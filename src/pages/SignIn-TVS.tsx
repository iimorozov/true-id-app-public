import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrueIDAuth from '@tdg/trueid-web-sdk';
import { toast } from 'react-toastify';
import { useOptions } from '../context/OptionsContext';
import styles from './SignIn-TVS.module.css';
import { loginByTrueIdApi } from '../services';

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
          setIsSignIn(true);
          navigate(`/dashboard`, { state: { afterLogin: true } });
        })
        .catch((e) => {
          lockRef.current = false;
          client.getStatus().then(setSessionState);
          toast(`${e.message}. Pls reload page or contact with support center.`, {
            type: 'warning',
          });
        });
    }
  };

  /**
   * Initiates the TrueID login flow
   */
  const handleClick = () => client.login(setSessionState);

  /**
   * Effect hook to process login after receiving access token
   */
  useEffect(() => {
    const accessToken = sessionState?.access_token;
    if (!accessToken) return;
    loginByTrueId(accessToken);
  }, [sessionState?.access_token]);

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
      .then((status) => {
        setSessionState(status);
      })
      .catch(() => {
        toast(`SSO was blocked. Pls reload page or contact with support center.`, {
          type: 'error',
        });
      });
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
