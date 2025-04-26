
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/hooks/useNotifications';

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
  );
};
