
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, CheckSquare, BarChart2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar only when a navigation happens and the user clicks a link
  // But we won't use any automatic closing based just on location changes
  const handleLinkClick = useCallback(() => {
    if (isMobile && onClose) {
      // We'll close on link click but with a small delay to ensure the navigation is visible
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [isMobile, onClose]);

  // Handle ESC key to close sidebar on mobile
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const navItems = [
    { href: '/', icon: <Home className="h-5 w-5" />, label: 'Propiedades' },
    { href: '/documents', icon: <FileText className="h-5 w-5" />, label: 'Documentos' },
    { href: '/tasks', icon: <CheckSquare className="h-5 w-5" />, label: 'Tareas' },
    { href: '/finances', icon: <BarChart2 className="h-5 w-5" />, label: 'Finanzas' },
  ];

  // Don't render anything when closed on mobile
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay - only close when clicked directly */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={(e) => {
            // Only close when clicking directly on the overlay
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
          aria-hidden="true"
        />
      )}
      
      <div
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          {/* Mobile close button at the top of sidebar */}
          {isMobile && (
            <div className="flex justify-end mb-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onClose && onClose()}
                className="h-8 w-8"
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={handleLinkClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Add a visible close button as a clear indication for mobile users */}
          {isMobile && (
            <button
              onClick={() => onClose && onClose()}
              className="mt-auto mb-4 bg-gray-200 rounded-md px-3 py-2 text-sm font-medium w-full text-center"
            >
              Cerrar menú
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
