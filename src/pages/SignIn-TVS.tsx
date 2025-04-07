import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrueIDAuth from '@tdg/trueid-web-sdk';
import { toast } from 'react-toastify';
import { useOptions } from '../context/OptionsContext';
import styles from './SignIn-TVS.module.css';
import { loginByTrueIdApi } from '../services';
import { calculateBackoff } from '../services/utils/retry.ts';

function SignInTVS({ setIsSignIn }: any) {
  const navigate = useNavigate();
  // Prevents multiple simultaneous login attempts
  const lockRef = useRef(false);
  // Get configuration options from context
  const { options, isLoading } = useOptions();

  // State for TrueID client instance
  const [client, setClient] = useState<any>(null);
  // State for TrueID authentication session
  const [sessionState, setSessionState] = useState<any>(null);

  // Retry configuration
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const retryTimeoutRef = useRef<number | null>(null);
  // Add a retry attempt ID to force useEffect to react even with the same token
  const [retryAttemptId, setRetryAttemptId] = useState(0);

  // Clear all retry state
  const clearRetryState = () => {
    retryCountRef.current = 0;
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  // Function to refresh session status and retry auth flow
  const refreshSessionAndRetry = () => {
    if (retryCountRef.current < MAX_RETRIES) {
      const backoffTime = calculateBackoff(retryCountRef.current, 300, 2, 10000);

      console.log(`Scheduling retry ${retryCountRef.current + 1}/${MAX_RETRIES} after ${Math.round(backoffTime)}ms`);

      // Clear any existing timeout
      if (retryTimeoutRef.current)
        clearTimeout(retryTimeoutRef.current);

      // Schedule retry after backoff delay
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`Executing retry ${retryCountRef.current + 1}/${MAX_RETRIES}`);
        retryCountRef.current += 1;

        // Increment retry attempt ID to force useEffect to trigger
        setRetryAttemptId(prev => prev + 1);

        // Refresh session status
        client.getStatus()
          .then((status: any) => {
            // Wrap the status in a new object to ensure React sees it as a new state value
            setSessionState({...status, _retryAttempt: retryCountRef.current});
          })
          .catch((statusError: any) => {
            console.error('Failed to get status during retry: ', statusError);
            // Try again if still have retries
            if (retryCountRef.current < MAX_RETRIES) {
              refreshSessionAndRetry();
            } else {
              // Clear retry state after reaching maximum attempts
              clearRetryState();
              // Reset lock to allow new login attempts via button click
              lockRef.current = false;
              toast(`Maximum retry attempts reached. Click the button to try again.`, {
                type: 'error',
              });
            }
          });
      }, backoffTime);
    } else {
      // Max retries reached - clear retry state
      clearRetryState();
      // Reset lock to allow new login attempts via button click
      lockRef.current = false;
      toast(`Maximum retry attempts reached. Click the button to try again.`, {
        type: 'error',
      });
    }
  };

  /**
   * Handles backend authentication using TrueID access token
   * After successful authentication, redirects user to dashboard
   *
   * @param accessToken - The access token received from TrueID
   */
  const loginByTrueId = (accessToken: string) => {
    if (!lockRef.current) {
      lockRef.current = true;

      loginByTrueIdApi({ token: accessToken })
        .then(() => {
          // Success! Clear all retry state
          clearRetryState();

          setIsSignIn(true);
          navigate(`/dashboard`, { state: { afterLogin: true } });
        })
        .catch((e: any) => {
          lockRef.current = false;
          console.warn(`${e.message}. Attempting to reconnect...`)
          // Start retry flow
          refreshSessionAndRetry();
        });
    }
  };

  /**
   * Initiates the TrueID login flow
   */
    const handleClick = () => client.login(setSessionState);

  /**
   * Effect hook to process login after receiving access token or retry attempt
   * The dependency array includes retryAttemptId to ensure it runs on retry
   */
  useEffect(() => {
    const accessToken = sessionState?.access_token;
    if (!accessToken || !client) return;
    loginByTrueId(accessToken);
  }, [sessionState?.access_token, retryAttemptId, client]);

  /**
   * Effect hook to initialize TrueID client and check login status
   * Sets up the TrueID authentication client when options are loaded
   */
  useEffect(() => {
    if (isLoading || !options.trueId) return;

    const trueIdAuth = new TrueIDAuth({
      ...options.trueId,
      redirect_uri: window.location.origin,
    });

    setClient(trueIdAuth);

    trueIdAuth
      .getStatus()
      .then(setSessionState)
      .catch(() => {
        toast(`SSO was blocked. Pls reload page or contact with support center.`, {
          type: 'error',
        });
      });

    // Cleanup function to clear any pending timeouts
    return () => {
      clearRetryState();
    };
  }, [options.trueId, isLoading]);

  if (isLoading) return <div>Loading options...</div>;

  return (
    <div className={styles.trueID}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          Sign in to access the system
        </h3>
        <p className={styles.description}>
          Use your TrueID account for quick authorization
        </p>
        <button
          className={styles.signButton}
          onClick={handleClick}
          type="button"
          disabled={!client}
        >
        <span className={styles.signButtonText}>
          Get Started
        </span>
        </button>
      </div>
    </div>
  );
}

export default SignInTVS;
