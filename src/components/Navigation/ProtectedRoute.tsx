import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

// Define the shape of the role array
type Role = string;

// Define the shape of the ProtectedRoute props
interface ProtectedRouteProps {
  element: React.ReactElement; // The element to render
  roles?: Role[]; // Optional roles array
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element, roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to='/' />;
  }

  return element;
};

export default ProtectedRoute;
