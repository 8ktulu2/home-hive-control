
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  
  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

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
