import { JSX, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isSignIn: boolean;
  children: ReactNode;
}

function ProtectedRoute({ isSignIn, children }: ProtectedRouteProps): JSX.Element {
  if (!isSignIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
