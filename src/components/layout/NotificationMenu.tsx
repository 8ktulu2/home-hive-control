
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export const NotificationMenu = () => {
  const { notifications, unreadCount, handleNotificationClick, handleRemoveNotification } = useNotifications();

  return (
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
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onNotificationClick={handleNotificationClick}
                onRemoveNotification={handleRemoveNotification}
              />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
