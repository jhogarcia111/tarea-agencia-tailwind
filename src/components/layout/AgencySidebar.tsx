
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Settings, 
  AlertCircle, 
  Activity,
  LogOut
} from "lucide-react";
import { useData } from '@/context/DataContext';
import { toast } from "sonner";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed?: boolean;
}

export function AgencySidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const location = useLocation();
  const { auth, logout } = useData();
  
  // Only show admin-only links for admin users
  const isAdmin = auth.currentUser?.role === "admin";

  const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isCollapsed }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          isCollapsed && "justify-center"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 z-20 flex flex-col bg-background transition-all",
      isCollapsed ? "w-16" : "w-64",
    )}>
      <div className="flex h-14 items-center justify-center border-b">
        <Link to="/dashboard" className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "px-3")}>
          <BarChart3 className="h-6 w-6" />
          {!isCollapsed && <span className="font-semibold">Agencia Marketing</span>}
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          <SidebarItem 
            to="/dashboard" 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Dashboard" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            to="/users" 
            icon={<Users className="h-5 w-5" />} 
            label="Usuarios" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            to="/clients" 
            icon={<Briefcase className="h-5 w-5" />} 
            label="Clientes" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            to="/tasks" 
            icon={<CheckSquare className="h-5 w-5" />} 
            label="Tareas" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            to="/activity-logs" 
            icon={<Activity className="h-5 w-5" />} 
            label="Actividades" 
            isCollapsed={isCollapsed} 
          />
          {isAdmin && (
            <SidebarItem 
              to="/error-logs" 
              icon={<AlertCircle className="h-5 w-5" />} 
              label="Errores" 
              isCollapsed={isCollapsed} 
            />
          )}
          <SidebarItem 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Ajustes" 
            isCollapsed={isCollapsed} 
          />
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:bg-accent hover:text-foreground mt-6",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </nav>
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {auth.currentUser?.avatar || "?"}
            </div>
            <div>
              <p className="text-sm font-medium">{auth.currentUser?.name || "Usuario"}</p>
              <p className="text-xs text-muted-foreground">{auth.currentUser?.role || "Rol"}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
