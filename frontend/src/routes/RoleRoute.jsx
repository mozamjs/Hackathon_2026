import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Checking role authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // If officer tries to visit citizen dashboard, redirect to /officer/dashboard
    if (user?.role === 'officer') {
      return <Navigate to="/officer/dashboard" replace />;
    }
    // If citizen tries to visit officer pages, redirect to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
