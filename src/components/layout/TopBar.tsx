
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function TopBar() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2" />
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8 w-full bg-secondary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-medium">
              AD
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">admin@agency.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
