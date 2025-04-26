
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Plus, Trash, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  type: 'payment' | 'task' | 'document';
  propertyId: string;
  message: string;
  read: boolean;
}

const Header = ({
  toggleSidebar
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const defaultNotifications: Notification[] = [
        {
          id: 'notif-1',
          type: 'payment',
          propertyId: 'property-001',
          message: 'Pago de alquiler pendiente - Apartamento Centro',
          read: false
        },
        {
          id: 'notif-2',
          type: 'task',
          propertyId: 'property-001',
          message: 'Tarea pendiente - Revisar caldera',
          read: false
        },
        {
          id: 'notif-3',
          type: 'document',
          propertyId: 'property-001',
          message: 'Documento caducado - Contrato Inquilino',
          read: false
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    const savedProperties = localStorage.getItem('properties');
    let properties = [];
    
    if (savedProperties) {
      properties = JSON.parse(savedProperties);
    } else {
      const { mockProperties } = require('@/data/mockData');
      properties = mockProperties;
      localStorage.setItem('properties', JSON.stringify(mockProperties));
    }
    
    const propertyExists = properties.some((p: any) => p.id === notification.propertyId);
    
    if (propertyExists) {
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      
      switch (notification.type) {
        case 'payment':
          navigate(`/property/${notification.propertyId}#payment-status`);
          break;
        case 'task':
          navigate(`/property/${notification.propertyId}#tasks`);
          break;
        case 'document':
          navigate(`/property/${notification.propertyId}#documents`);
          break;
        default:
          navigate(`/property/${notification.propertyId}`);
          break;
      }
    } else {
      toast.error('Propiedad no encontrada');
    }
  };

  const handleRemoveNotification = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    toast.info('Notificación eliminada');
  };

  const handleDeleteProperties = () => {
    // If we're on the home page, find the delete button in PropertyGrid and trigger it
    if (location.pathname === '/') {
      // Try to find if there are selected properties
      const deleteButton = document.querySelector('button[data-delete-properties]');
      if (deleteButton) {
        (deleteButton as HTMLButtonElement).click();
      } else {
        toast.info('Por favor, seleccione las propiedades a eliminar en la lista');
      }
    } else {
      toast.info('Solo puede eliminar propiedades desde la página principal');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }} aria-label="Toggle menu" className="flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary font-bold text-xl">Res Gestum</span>
            </Link>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => navigate('/property/new')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleDeleteProperties}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-2 px-2 text-center text-muted-foreground">
                  No hay notificaciones
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="flex items-start justify-between py-2 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className={notification.read ? "text-muted-foreground" : ""}>
                      {notification.message}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-2 opacity-50 hover:opacity-100"
                      onClick={(e) => handleRemoveNotification(notification.id, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};

export default Header;

