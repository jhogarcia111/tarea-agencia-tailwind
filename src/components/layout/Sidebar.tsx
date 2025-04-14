import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (to: string) => {
    navigate(to);
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={cn(
        'bg-sidebar border-r border-sidebar-border h-screen fixed transition-all duration-300 z-30',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {isSidebarOpen && (
          <Link to="/" className="flex items-center">
            <div className="bg-brand-500 text-white font-bold rounded-lg p-1.5">AM</div>
            <span className="ml-2 font-semibold text-sidebar-foreground">AgencyManager</span>
          </Link>
        )}
        {!isSidebarOpen && (
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
          isCollapsed={!isSidebarOpen}
          onClick={() => handleNavigation('/')}
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Usuarios"
          to="/users"
          isCollapsed={!isSidebarOpen}
          onClick={() => handleNavigation('/users')}
        />
        <SidebarItem
          icon={<Briefcase size={20} />}
          label="Clientes"
          to="/clients"
          isCollapsed={!isSidebarOpen}
          onClick={() => handleNavigation('/clients')}
        />
        <SidebarItem
          icon={<CheckSquare size={20} />}
          label="Tareas"
          to="/tasks"
          isCollapsed={!isSidebarOpen}
          onClick={() => handleNavigation('/tasks')}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Configuración"
          to="/settings"
          isCollapsed={!isSidebarOpen}
          onClick={() => handleNavigation('/settings')}
        />
      </nav>

      <div className="absolute bottom-0 w-full p-2">
        <button className="flex items-center justify-center w-full px-2 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-2">Cerrar sesión</span>}
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
  onClick?: () => void;
}

function SidebarItem({ icon, label, to, isCollapsed, onClick }: SidebarItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
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
