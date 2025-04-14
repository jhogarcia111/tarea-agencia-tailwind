
import React from 'react';
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

  // Check if user is logged in
  if (!auth.isLoggedIn) {
    logError({
      location: location.pathname,
      form: null,
      message: "Intento de acceso a ruta protegida sin autenticación"
    });
    
    return <Navigate to="/login" replace />;
  }

  // Check for role if specified
  if (requiredRole && auth.currentUser?.role !== requiredRole) {
    logError({
      location: location.pathname,
      form: null,
      message: `Acceso denegado: Usuario ${auth.currentUser?.name} con rol ${auth.currentUser?.role} intentó acceder a ruta que requiere rol ${requiredRole}`
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
