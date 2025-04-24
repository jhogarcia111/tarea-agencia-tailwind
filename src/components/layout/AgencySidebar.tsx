import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Briefcase,
  CheckSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { useData } from '@/context/DataContext';

export function AgencySidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useData();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleNavigation = (to) => {
    setIsCollapsed(true); // Auto-collapse the sidebar on navigation
    window.location.href = to;
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 z-20 flex flex-col bg-background transition-all',
        isCollapsed ? 'w-16' : 'w-30'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <button
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? 'Expandir' : 'Contraer'}
        </button>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          <SidebarItem
            to="/dashboard"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Dashboard"
            isCollapsed={isCollapsed}
            onClick={() => handleNavigation('/dashboard')}
          />
          <SidebarItem
            to="/users"
            icon={<Users className="h-5 w-5" />}
            label="Usuarios"
            isCollapsed={isCollapsed}
            onClick={() => handleNavigation('/users')}
          />
          <SidebarItem
            to="/clients"
            icon={<Briefcase className="h-5 w-5" />}
            label="Clientes"
            isCollapsed={isCollapsed}
            onClick={() => handleNavigation('/clients')}
          />
          <SidebarItem
            to="/tasks"
            icon={<CheckSquare className="h-5 w-5" />}
            label="Tareas"
            isCollapsed={isCollapsed}
            onClick={() => handleNavigation('/tasks')}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Ajustes"
            isCollapsed={isCollapsed}
            onClick={() => handleNavigation('/settings')}
          />
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:bg-accent hover:text-foreground mt-6',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label, isCollapsed, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
        isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        isCollapsed && 'justify-center'
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
}
