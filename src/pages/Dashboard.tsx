import { useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import TrueIDAuth from '@tdg/trueid-web-sdk';
import { useOptions } from '../context/OptionsContext.tsx';
import { logout } from '../services';
import { toast } from 'react-toastify';

interface DashboardProps {
  setIsSignIn: (value: boolean) => void;
}

function Dashboard({ setIsSignIn }: DashboardProps): JSX.Element {
  const navigate = useNavigate();
  const { options, isLoading } = useOptions();
  console.log(options, isLoading)

  const handleLogout = async () => {
    if (isLoading || !options.trueId) return;
    try {
      const client = new TrueIDAuth({
        ...options.trueId,
        redirect_uri: window.location.origin
      });

      await Promise.all([client.logout(), logout()])

      setIsSignIn(false);
      navigate('/');
    } catch (e: any) {
      toast(`${e.message}`, {
        type: 'error',
      });
    }
  };

  return (
  <div className="dashboard-container">
    <h1>Dashboard</h1>
    <p>Welcome to your personal account!</p>
    <button onClick={handleLogout}>Sign Out</button>
  </div>
  );
}

export default Dashboard;
