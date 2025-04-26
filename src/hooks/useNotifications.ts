
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'payment' | 'task' | 'document';
  propertyId: string;
  message: string;
  read: boolean;
}

export const useNotifications = () => {
  const navigate = useNavigate();
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleRemoveNotification
  };
};
