
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Notification } from '@/hooks/useNotifications';

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
  return (
    <div 
      className="flex items-start justify-between py-2 cursor-pointer"
      onClick={() => onNotificationClick(notification)}
    >
      <span className={notification.read ? "text-muted-foreground" : ""}>
        {notification.message}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 ml-2 opacity-50 hover:opacity-100"
        onClick={(e) => onRemoveNotification(notification.id, e)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
