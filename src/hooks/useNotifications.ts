
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
}

export const useNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
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
            const task = property?.tasks?.find((t: any) => t.id === notif.taskId);
            
            // Si la tarea existe y no está completada, mantenemos la notificación
            if (task && !task.completed) {
              return true;
            } else if (task && task.completed) {
              // Si la tarea está completada, eliminamos la notificación
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
        // Crear notificaciones predeterminadas solo para propiedades existentes
        const defaultNotifications: Notification[] = [];
        
        // Solo agregar notificaciones predeterminadas si la propiedad existe
        if (propertyIds.includes('property-001')) {
          defaultNotifications.push(
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
          );
        }
        
        setNotifications(defaultNotifications);
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
      }
    };

    loadNotifications();
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
      // Para notificaciones de tipo tarea, solo marcarlas como leídas si no están relacionadas a tareas pendientes
      if (notification.type === 'task' && notification.taskId) {
        const property = properties.find((p: any) => p.id === notification.propertyId);
        const task = property?.tasks?.find((t: any) => t.id === notification.taskId);
        
        if (task && !task.completed) {
          // Si la tarea está pendiente, navegamos sin marcar como leída
          navigateToProperty(notification);
          return;
        }
      }
      
      // Para otros tipos de notificaciones, las marcamos como leídas
      const updatedNotifications = notifications.map(n => {
        if (n.id === notification.id) {
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

  // Modificado para contar todas las notificaciones de tareas relacionadas con tareas pendientes como no leídas,
  // independientemente de su estado de lectura
  const unreadCount = notifications.filter(n => {
    if (n.type === 'task' && n.taskId) {
      // Considerar todas las notificaciones de tareas para tareas pendientes como "no leídas" para el contador
      return true;
    }
    return !n.read;
  }).length;

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleRemoveNotification
  };
};
