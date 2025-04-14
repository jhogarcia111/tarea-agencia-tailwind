
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useData } from '@/context/DataContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { auth, logError } = useData();
  const location = useLocation();

  // Use useEffect to log errors to prevent React state updates during rendering
  useEffect(() => {
    // Check if user is logged in
    if (!auth.isLoggedIn) {
      logError({
        location: location.pathname,
        form: null,
        message: "Intento de acceso a ruta protegida sin autenticación"
      });
    } else if (requiredRole && auth.currentUser?.role !== requiredRole) {
      // Check for role if specified
      logError({
        location: location.pathname,
        form: null,
        message: `Acceso denegado: Usuario ${auth.currentUser?.name} con rol ${auth.currentUser?.role} intentó acceder a ruta que requiere rol ${requiredRole}`
      });
    }
  }, [auth.isLoggedIn, auth.currentUser, requiredRole, location.pathname, logError]);

  // Check if user is logged in
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check for role if specified
  if (requiredRole && auth.currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
