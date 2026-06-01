import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

/**
 * AuthGuard – protects routes.
 */
const AuthGuard = ({ children, requireAdminOrModerator = false }) => {
  const { user } = useAuth();

  // Not logged in at all → send to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If this route requires admin/mod, check the role
  if (requireAdminOrModerator) {
    const allowed = ['ADMIN', 'MODERATOR'].includes(user.role);
    if (!allowed) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
