import { JSX, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { OptionsProvider } from './context/OptionsContext';
import SignInTVS from './pages/SignIn-TVS.tsx';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App(): JSX.Element {
  const [isSignIn, setIsSignIn] = useState<boolean>(false);

  return (
    <OptionsProvider>
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={<SignIn setIsSignIn={setIsSignIn} />} />*/}
          <Route path="/" element={<SignInTVS setIsSignIn={setIsSignIn} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isSignIn={isSignIn}>
                <Dashboard setIsSignIn={setIsSignIn} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </OptionsProvider>
  );
}

export default App;
