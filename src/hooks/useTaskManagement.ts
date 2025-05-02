
import { useState } from 'react';
import { Task, Property } from '@/types/property';
import { toast } from 'sonner';
import { getNotificationsFromStorage, saveNotificationsToStorage } from '@/services/notificationService';
import { Notification } from '@/types/notification';

export function useTaskManagement(property: Property | null, setProperty: (property: Property | null) => void) {
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed };
          if (completed) {
            updatedTask.completedDate = new Date().toISOString();
            
            // Remove notification when task is completed
            removeTaskNotification(taskId);
            
            toast.success("Tarea completada", {
              description: `La tarea "${task.title}" ha sido marcada como completada.`
            });
          } else {
            delete updatedTask.completedDate;
            // Re-add notification if task is marked as pending
            addTaskNotification(property.id, updatedTask);
            
            toast.info("Tarea pendiente", {
              description: `La tarea "${task.title}" ha sido marcada como pendiente.`
            });
          }
          return updatedTask;
        }
        return task;
      });
      
      updatePropertyInStorage({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const handleTaskAdd = (newTask: { title: string; description?: string; notification?: { date: string; enabled: boolean } }) => {
    if (property) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: undefined,
        createdDate: new Date().toISOString(),
        notification: newTask.notification ? {
          enabled: newTask.notification.enabled,
          date: newTask.notification.date,
        } : undefined
      };

      // Add notification for new task
      addTaskNotification(property.id, task);
      
      // Update property with new task
      const updatedProperty = {
        ...property,
        tasks: [...(property.tasks || []), task]
      };
      
      updatePropertyInStorage(updatedProperty);
      
      toast.success("Tarea añadida", {
        description: `La tarea "${task.title}" ha sido añadida correctamente.`
      });
      
      // Sync all task notifications
      syncAllTaskNotifications();
    }
  };

  const removeTaskNotification = (taskId: string) => {
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

  const addTaskNotification = (propertyId: string, task: Task) => {
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

  // Function to sync all task notifications
  const syncAllTaskNotifications = () => {
    try {
      // Get all properties
      const savedProperties = localStorage.getItem('properties');
      if (!savedProperties) return;
      
      const properties = JSON.parse(savedProperties);
      
      // Collect all pending tasks
      const pendingTasks: {task: Task, propertyId: string}[] = [];
      properties.forEach((p: Property) => {
        if (p.tasks) {
          p.tasks.forEach(task => {
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
      const taskNotifications = pendingTasks.map(({task, propertyId}) => ({
        id: `notification-task-${task.id}`,
        type: 'task' as const,
        taskId: task.id,
        propertyId: propertyId,
        message: `Tarea pendiente: ${task.title}`,
        read: false,
        createdAt: task.createdDate
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

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      // Remove task notification when task is deleted
      removeTaskNotification(taskId);

      updatePropertyInStorage({
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      });
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates };
          
          // If task status changed to completed, remove notification
          if (updates.completed === true && !task.completed) {
            removeTaskNotification(taskId);
          } 
          // If task changed from completed to pending, add notification
          else if (updates.completed === false && task.completed) {
            addTaskNotification(property.id, updatedTask);
          }
          
          return updatedTask;
        }
        return task;
      });
      
      updatePropertyInStorage({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const updatePropertyInStorage = (updatedProperty: Property) => {
    setProperty(updatedProperty);
    
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === updatedProperty.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    } catch (error) {
      console.error("Error updating property in localStorage:", error);
    }
  };

  return {
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    syncAllTaskNotifications
  };
}
