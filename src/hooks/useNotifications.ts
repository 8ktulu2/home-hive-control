
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';
import { 
  getNotificationsFromStorage,
  saveNotificationsToStorage,
  getPropertiesFromStorage,
  createTaskNotificationsForPendingTasks,
  filterValidNotifications
} from '@/services/notificationService';
import { getNavigationPathForNotification } from '@/utils/notificationNavigation';

// Re-export the Notification type for backward compatibility
export type { Notification };

export const useNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications whenever the component renders to keep it updated
  useEffect(() => {
    loadNotifications();
  }, []);

  // Update storage when notifications change
  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const loadNotifications = () => {
    try {
      const properties = getPropertiesFromStorage();
      const existingNotifications = getNotificationsFromStorage();
      
      // Generate notifications for pending tasks
      const pendingTaskNotifications = createTaskNotificationsForPendingTasks(properties);
      
      if (existingNotifications.length > 0) {
        // Filter out notifications for properties that no longer exist or completed tasks
        const validNotifications = filterValidNotifications(existingNotifications, properties);
        
        // Create a map of task IDs to avoid duplicates
        const taskIdMap = new Map();
        pendingTaskNotifications.forEach(notification => {
          if (notification.taskId) {
            taskIdMap.set(notification.taskId, notification);
          }
        });
        
        // Filter out existing notifications that are already in pendingTaskNotifications
        const uniqueValidNotifications = validNotifications.filter(notification => {
          return notification.type !== 'task' || 
                (notification.taskId && !taskIdMap.has(notification.taskId));
        });
        
        // Combine unique valid notifications with pending task notifications
        const combinedNotifications = [...uniqueValidNotifications, ...pendingTaskNotifications];
        
        if (combinedNotifications.length !== existingNotifications.length || pendingTaskNotifications.length > 0) {
          saveNotificationsToStorage(combinedNotifications);
        }
        
        setNotifications(combinedNotifications);
      } else {
        // If no saved notifications exist, use just the pending task notifications
        if (pendingTaskNotifications.length > 0) {
          setNotifications(pendingTaskNotifications);
          saveNotificationsToStorage(pendingTaskNotifications);
        } else {
          setNotifications([]);
        }
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    try {
      const properties = getPropertiesFromStorage();
      const propertyExists = properties.some(p => p.id === notification.propertyId);
      
      if (propertyExists) {
        // For task notifications, we don't mark as read since they should remain visible
        if (notification.type === 'task' && notification.taskId) {
          // Direct navigation using hash for tasks
          navigate(`/property/${notification.propertyId}#tasks`);
          return;
        }
        
        // For other types of notifications, mark as read
        const updatedNotifications = notifications.map(n => {
          if (n.id === notification.id && n.type !== 'task') {
            return { ...n, read: true };
          }
          return n;
        });
        
        setNotifications(updatedNotifications);
        navigateToProperty(notification);
      } else {
        toast.error('Propiedad no encontrada');
        handleRemoveNotification(notification.id);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const navigateToProperty = (notification: Notification) => {
    const path = getNavigationPathForNotification(notification);
    navigate(path);
  };

  const handleRemoveNotification = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    toast.info('Notificación eliminada');
  };

  // Count all notifications as unread to keep a proper count in the UI
  const unreadCount = notifications.length;

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleRemoveNotification,
    loadNotifications // Export this function for reloading notifications from elsewhere
  };
};
