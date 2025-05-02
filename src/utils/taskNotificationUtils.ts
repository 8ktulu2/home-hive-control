
import { Task } from '@/types/property';
import { Notification } from '@/types/notification';
import { getNotificationsFromStorage, saveNotificationsToStorage } from '@/services/notificationService';

/**
 * Removes a notification for a specific task
 */
export const removeTaskNotification = (taskId: string) => {
  try {
    const notifications = getNotificationsFromStorage();
    const updatedNotifications = notifications.filter(
      (n) => !(n.type === 'task' && n.taskId === taskId)
    );
    
    saveNotificationsToStorage(updatedNotifications);
    console.log("Task notification removed for task:", taskId);
  } catch (error) {
    console.error("Error removing task notification:", error);
  }
};

/**
 * Adds a notification for a task
 */
export const addTaskNotification = (propertyId: string, task: Task) => {
  try {
    if (!task.completed) {  // Only add notification if task is not completed
      const notification: Notification = {
        id: `notification-task-${task.id}`,
        type: 'task',
        taskId: task.id,
        propertyId: propertyId,
        message: `Tarea pendiente: ${task.title}`,
        read: false,
        createdAt: new Date().toISOString()
      };
  
      const notifications = getNotificationsFromStorage();
      
      // Check if notification already exists
      const existingIndex = notifications.findIndex(
        (n) => n.taskId === task.id
      );
      
      if (existingIndex >= 0) {
        // Update existing notification
        notifications[existingIndex] = notification;
      } else {
        // Add new notification
        notifications.push(notification);
      }
      
      saveNotificationsToStorage(notifications);
      console.log("Task notification added:", notification);
    }
  } catch (error) {
    console.error("Error adding task notification:", error);
  }
};

/**
 * Synchronizes all task notifications based on pending tasks across properties
 */
export const syncAllTaskNotifications = () => {
  try {
    // Get all properties
    const savedProperties = localStorage.getItem('properties');
    if (!savedProperties) return;
    
    const properties = JSON.parse(savedProperties);
    
    // Collect all pending tasks
    const pendingTasks: {task: Task, propertyId: string}[] = [];
    properties.forEach((p: any) => {
      if (p.tasks) {
        p.tasks.forEach((task: Task) => {
          if (!task.completed) {
            pendingTasks.push({task, propertyId: p.id});
          }
        });
      }
    });
    
    // Get current notifications
    const notifications = getNotificationsFromStorage();
    
    // Filter non-task notifications
    const nonTaskNotifications = notifications.filter(
      (n) => n.type !== 'task'
    );
    
    // Create new notifications for all pending tasks
    const taskNotifications: Notification[] = pendingTasks.map(({task, propertyId}) => ({
      id: `notification-task-${task.id}`,
      type: 'task' as const,
      taskId: task.id,
      propertyId: propertyId,
      message: `Tarea pendiente: ${task.title}`,
      read: false,
      createdAt: task.createdDate || new Date().toISOString()
    }));
    
    // Combine notifications
    const updatedNotifications = [...nonTaskNotifications, ...taskNotifications];
    
    // Save updated notifications
    saveNotificationsToStorage(updatedNotifications);
    
    console.log("Notifications synced with pending tasks:", updatedNotifications.length);
  } catch (error) {
    console.error("Error syncing task notifications:", error);
  }
};
