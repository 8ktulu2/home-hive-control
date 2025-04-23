
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  toggleSidebar: () => void;
}

// Define a notification structure
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Create default notifications if none exist
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

  // Save notifications when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    // First ensure we have the mock properties loaded
    const savedProperties = localStorage.getItem('properties');
    let properties = [];
    
    if (savedProperties) {
      properties = JSON.parse(savedProperties);
    } else {
      // Load from mock data
      const { mockProperties } = require('@/data/mockData');
      properties = mockProperties;
      // Save to localStorage
      localStorage.setItem('properties', JSON.stringify(mockProperties));
    }
    
    // Check if property exists
    const propertyExists = properties.some((p: any) => p.id === notification.propertyId);
    
    if (propertyExists) {
      // Mark notification as read
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      
      // Navigate to the appropriate section with specific anchors
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
      // Property doesn't exist
      toast.error('Propiedad no encontrada');
    }
  };

  const handleRemoveNotification = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    toast.info('Notificación eliminada');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
