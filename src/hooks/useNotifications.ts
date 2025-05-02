
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'payment' | 'task' | 'document';
  propertyId: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: string;
}

export const useNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar notificaciones cada vez que se renderiza el componente para mantenerlo actualizado
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      
      const savedProperties = localStorage.getItem('properties');
      const properties = savedProperties ? JSON.parse(savedProperties) : [];
      const propertyIds = properties.map((p: any) => p.id);
      
      if (savedNotifications) {
        const allNotifications = JSON.parse(savedNotifications);
        // Filtrar notificaciones para propiedades que ya no existen
        // Y verificar el estado de las tareas para mantener las notificaciones de tareas pendientes
        const validNotifications = allNotifications.filter((notif: Notification) => {
          // Primero verificamos si la propiedad existe
          if (!propertyIds.includes(notif.propertyId)) return false;
          
          // Si es una notificación de tarea, verificamos el estado de la tarea
          if (notif.type === 'task' && notif.taskId) {
            const property = properties.find((p: any) => p.id === notif.propertyId);
            if (!property || !property.tasks) return false;
            
            const task = property.tasks.find((t: any) => t.id === notif.taskId);
            
            // Si la tarea existe y no está completada, mantenemos la notificación
            if (task && !task.completed) {
              return true;
            } else if (!task || (task && task.completed)) {
              // Si la tarea no existe o está completada, eliminamos la notificación
              return false;
            }
          }
          
          return true;
        });
        
        if (validNotifications.length !== allNotifications.length) {
          localStorage.setItem('notifications', JSON.stringify(validNotifications));
        }
        
        setNotifications(validNotifications);
      } else {
        // Si no hay notificaciones guardadas, revisamos las tareas pendientes y creamos notificaciones
        const defaultNotifications: Notification[] = [];
        
        // Crear notificaciones para todas las tareas pendientes
        properties.forEach((property: any) => {
          if (property.tasks) {
            property.tasks.forEach((task: any) => {
              if (!task.completed) {
                defaultNotifications.push({
                  id: `notification-task-${task.id}`,
                  type: 'task',
                  taskId: task.id,
                  propertyId: property.id,
                  message: `Tarea pendiente: ${task.title}`,
                  read: false,
                  createdAt: new Date().toISOString()
                });
              }
            });
          }
        });
        
        if (defaultNotifications.length > 0) {
          setNotifications(defaultNotifications);
          localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        } else {
          setNotifications([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    try {
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
        // Para notificaciones de tipo tarea, solo navegamos a la propiedad
        // No las marcamos como leídas ya que deben permanecer visibles hasta que se complete la tarea
        if (notification.type === 'task' && notification.taskId) {
          navigateToProperty(notification);
          return;
        }
        
        // Para otros tipos de notificaciones, las marcamos como leídas
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
      console.error("Error al manejar clic en notificación:", error);
    }
  };

  const navigateToProperty = (notification: Notification) => {
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
  };

  const handleRemoveNotification = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    toast.info('Notificación eliminada');
  };

  // Contar todas las notificaciones de tareas como no leídas,
  // independientemente de su estado de lectura ya que deben permanecer visibles
  const unreadCount = notifications.length;

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleRemoveNotification
  };
};
