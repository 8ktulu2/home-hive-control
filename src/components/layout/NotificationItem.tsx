
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
  onRemoveNotification: (id: string, e: React.MouseEvent) => void;
}

export const NotificationItem = ({ 
  notification, 
  onNotificationClick, 
  onRemoveNotification 
}: NotificationItemProps) => {
  // Task notifications are always highlighted
  const isHighlighted = notification.type === 'task' || !notification.read;
  const navigate = useNavigate();
  
  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For task notifications, navigate directly to the property with task focus
    if (notification.type === 'task' && notification.propertyId) {
      console.log('Navigating to property task:', notification.propertyId);
      navigate(`/property/${notification.propertyId}#tasks`);
    } else {
      onNotificationClick(notification);
    }
  };
  
  return (
    <div 
      className={`flex items-start justify-between py-2 cursor-pointer hover:bg-accent/20 px-2 rounded-md border-l-4 ${
        isHighlighted ? 'border-l-primary' : 'border-l-muted'
      }`}
      onClick={handleNotificationClick}
    >
      <div className="flex-1">
        <span className={isHighlighted ? "font-medium" : "text-muted-foreground"}>
          {notification.message}
        </span>
        {notification.read && notification.type !== 'task' && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Check className="h-3 w-3 mr-1" />
            <span>Visto</span>
          </div>
        )}
        {notification.type === 'task' && (
          <div className="flex items-center text-xs text-primary mt-1">
            <span>Pendiente hasta completar la tarea</span>
          </div>
        )}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 ml-2 opacity-50 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveNotification(notification.id, e);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
