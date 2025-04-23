
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({
  toggleSidebar
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = (type: string, propertyId: string) => {
    switch (type) {
      case 'payment':
        navigate(`/property/${propertyId}#payment-status`);
        break;
      case 'task':
        navigate(`/property/${propertyId}#tasks`);
        break;
      case 'document':
        navigate(`/property/${propertyId}#documents`);
        break;
      default:
        break;
    }
  };

  return <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={e => {
            // Simple event handling without delays
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }} aria-label="Toggle menu" className="flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-bold text-xl">HomeHive</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNotificationClick('payment', 'property-1')}>
                <span>Pago de alquiler pendiente - Apartamento Centro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNotificationClick('task', 'property-1')}>
                <span>Tarea pendiente - Revisar caldera</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNotificationClick('document', 'property-1')}>
                <span>Documento caducado - Contrato Inquilino</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};

export default Header;
