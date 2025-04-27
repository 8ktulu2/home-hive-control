
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
        // Filter out notifications for properties that no longer exist
        // También verificamos el estado de las tareas para mantener las notificaciones no leídas
        const validNotifications = allNotifications.filter((notif: Notification) => {
          // Primero verificamos si la propiedad existe
          if (!propertyIds.includes(notif.propertyId)) return false;
          
          // Si es una notificación de tarea, verificamos el estado de la tarea
          if (notif.type === 'task' && notif.taskId) {
            const property = properties.find((p: any) => p.id === notif.propertyId);
            const task = property?.tasks?.find((t: any) => t.id === notif.taskId);
            
            // Si la tarea existe y no está completada, mantenemos la notificación como no leída
            if (task && !task.completed) {
              notif.read = false;
            }
          }
          
          return true;
        });
        
        if (validNotifications.length !== allNotifications.length) {
          localStorage.setItem('notifications', JSON.stringify(validNotifications));
        }
        
        setNotifications(validNotifications);
      } else {
        // Create default notifications only for existing properties
        const defaultNotifications: Notification[] = [];
        
        // Only add default notifications if the property exists
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
      // Ya no marcamos la notificación como leída aquí
      // Solo navegamos a la página correspondiente
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
      handleRemoveNotification(notification.id);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleRemoveNotification
  };
};
