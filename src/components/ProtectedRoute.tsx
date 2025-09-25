import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  inverse?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, inverse = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (inverse) {
    // Public route: redirect if logged in
    return user ? <Navigate to="/" replace /> : <>{children}</>;
  }

  // Protected route: redirect if not logged in
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
