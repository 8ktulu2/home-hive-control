
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main
        className={cn(
          "transition-all duration-300 pt-16 min-h-[calc(100vh-4rem)]",
          sidebarOpen ? "pl-0 md:pl-64" : "pl-0"
        )}
      >
        <div className="container p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
