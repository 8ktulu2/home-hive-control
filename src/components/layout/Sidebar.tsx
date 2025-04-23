
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, CheckSquare, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  
  // Close sidebar when location changes on mobile only
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen && onClose) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Close on navigation only on mobile
    if (window.innerWidth < 768 && isOpen && onClose) {
      onClose();
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, isOpen, onClose]);

  const navItems = [
    { href: '/', icon: <Home className="h-5 w-5" />, label: 'Propiedades' },
    { href: '/documents', icon: <FileText className="h-5 w-5" />, label: 'Documentos' },
    { href: '/tasks', icon: <CheckSquare className="h-5 w-5" />, label: 'Tareas' },
    { href: '/finances', icon: <BarChart2 className="h-5 w-5" />, label: 'Finanzas' },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
