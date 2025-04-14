
import React from 'react';
import { TopBar } from './TopBar';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarInset
} from '@/components/ui/sidebar';
import { AgencySidebar } from './AgencySidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AgencySidebar />
        <SidebarInset>
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
