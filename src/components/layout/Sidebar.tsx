import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { FileText, Home, Briefcase, CreditCard, FileBox, CheckSquare, BarChart3, Calendar } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

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

  return (
    <div className={cn("flex flex-col w-64 border-r border-r-border bg-secondary", className)}>
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center text-lg font-semibold">
          Inmobiliaria
        </Link>
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
