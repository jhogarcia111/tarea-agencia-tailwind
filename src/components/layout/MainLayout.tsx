import React from 'react';
import { TopBar } from './TopBar';
import { AgencySidebar } from './AgencySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="w-1/12">
          <AgencySidebar />
        </div>
        <div className="w-11/12">
          <TopBar />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
