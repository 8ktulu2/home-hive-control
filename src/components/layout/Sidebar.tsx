
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { FileText, Home, Briefcase, CreditCard, FileBox, CheckSquare, BarChart3, Calendar } from 'lucide-react';

interface SidebarProps {
  className?: string;
  isOpen?: boolean; // Added this prop
  onClose?: () => void; // Added this prop
}

const Sidebar = ({ className, isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  // Mock logout function since useAuth is not available
  const logout = () => {
    console.log('Logout clicked');
    // Add actual logout logic when authentication is implemented
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const navigationItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Propiedades', href: '/properties', icon: Briefcase },
    { name: 'Finanzas', href: '/finances', icon: CreditCard },
    { name: 'Documentos', href: '/documents', icon: FileBox },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Histórico', href: '/historical', icon: BarChart3 },
    { name: 'Informes Fiscales', href: '/fiscal-report', icon: FileText },
  ];

  // Apply conditional classes based on isOpen prop
  const sidebarClasses = cn(
    "flex flex-col w-64 border-r border-r-border bg-secondary",
    isOpen ? "block" : "hidden md:block", 
    className
  );

  return (
    <div className={sidebarClasses}>
      <div className="px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-lg font-semibold">
          Inmobiliaria
        </Link>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1 rounded-full hover:bg-accent"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <nav className="flex-1 px-6 py-4">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
                onClick={onClose ? () => onClose() : undefined}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-t-border">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
