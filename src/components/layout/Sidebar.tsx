
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, CheckSquare, BarChart2, X, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { href: '/', icon: <Home className="h-5 w-5" />, label: 'Propiedades' },
    { href: '/documents', icon: <FileText className="h-5 w-5" />, label: 'Documentos' },
    { href: '/tasks', icon: <CheckSquare className="h-5 w-5" />, label: 'Tareas' },
    { href: '/finances', icon: <BarChart2 className="h-5 w-5" />, label: 'Finanzas' },
    { href: '/historical', icon: <History className="h-5 w-5" />, label: 'Histórico' },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-56 transform border-r bg-background transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-2">
          <div className="flex justify-end md:hidden mb-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
