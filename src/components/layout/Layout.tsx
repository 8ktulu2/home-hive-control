
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          sidebarOpen ? "md:pl-64" : ""
        )}
      >
        <div className="container p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
