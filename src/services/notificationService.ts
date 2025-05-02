import { Notification } from '@/types/notification';
import { Property } from '@/types/property';

export const getNotificationsFromStorage = (): Notification[] => {
  try {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  } catch (error) {
    console.error("Error loading notifications from storage:", error);
    return [];
  }
};

export const saveNotificationsToStorage = (notifications: Notification[]): void => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error("Error saving notifications to storage:", error);
  }
};

export const getPropertiesFromStorage = (): Property[] => {
  try {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      return JSON.parse(savedProperties);
    }
    
    // Fallback to mock data if needed
    const { mockProperties } = require('@/data/mockData');
    return mockProperties;
  } catch (error) {
    console.error("Error loading properties from storage:", error);
    return [];
  }
};

export const createTaskNotificationsForPendingTasks = (properties: Property[]): Notification[] => {
  const pendingTaskNotifications: Notification[] = [];
  
  properties.forEach((property) => {
    if (!property.tasks) return;
    
    property.tasks.forEach((task) => {
      if (!task.completed) {
        pendingTaskNotifications.push({
          id: `notification-task-${task.id}`,
          type: 'task',
          taskId: task.id,
          propertyId: property.id,
          message: `Tarea pendiente: ${task.title}`,
          read: false,
          createdAt: task.createdDate || new Date().toISOString()
        });
      }
    });
  });
  
  return pendingTaskNotifications;
};

export const filterValidNotifications = (
  notifications: Notification[], 
  properties: Property[]
): Notification[] => {
  const propertyIds = properties.map(p => p.id);
  
  return notifications.filter((notif) => {
    // Check if the property exists
    if (!propertyIds.includes(notif.propertyId)) return false;
    
    // For task notifications, verify task status
    if (notif.type === 'task' && notif.taskId) {
      const property = properties.find(p => p.id === notif.propertyId);
      if (!property || !property.tasks) return false;
      
      const task = property.tasks.find(t => t.id === notif.taskId);
      
      // Keep notification only if task exists and is not completed
      return task && !task.completed;
    }
    
    return true;
  });
};
