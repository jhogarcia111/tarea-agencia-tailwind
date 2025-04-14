
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div
      className={cn(
        'bg-sidebar border-r border-sidebar-border h-screen fixed transition-all duration-300 z-30',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {isOpen && (
          <Link to="/" className="flex items-center">
            <div className="bg-brand-500 text-white font-bold rounded-lg p-1.5">AM</div>
            <span className="ml-2 font-semibold text-sidebar-foreground">AgencyManager</span>
          </Link>
        )}
        {!isOpen && (
          <div className="mx-auto bg-brand-500 text-white font-bold rounded-lg p-1.5">
            AM
          </div>
        )}
      </div>

      <nav className="px-2 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to="/"
          isCollapsed={!isOpen}
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Usuarios"
          to="/users"
          isCollapsed={!isOpen}
        />
        <SidebarItem
          icon={<Briefcase size={20} />}
          label="Clientes"
          to="/clients"
          isCollapsed={!isOpen}
        />
        <SidebarItem
          icon={<CheckSquare size={20} />}
          label="Tareas"
          to="/tasks"
          isCollapsed={!isOpen}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Configuración"
          to="/settings"
          isCollapsed={!isOpen}
        />
      </nav>

      <div className="absolute bottom-0 w-full p-2">
        <button className="flex items-center justify-center w-full px-2 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut size={20} />
          {isOpen && <span className="ml-2">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}

function SidebarItem({ icon, label, to, isCollapsed }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-2 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent group transition-colors',
        location.pathname === to ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
      )}
    >
      <div className={cn(
        isCollapsed ? 'mx-auto' : 'mr-3',
        location.pathname === to ? 'text-brand-600' : ''
      )}>
        {icon}
      </div>
      {!isCollapsed && <span>{label}</span>}
      {isCollapsed && (
        <div className="invisible absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md whitespace-nowrap opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
          {label}
        </div>
      )}
    </Link>
  );
}
