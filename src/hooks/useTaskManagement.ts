
import { useState } from 'react';
import { Task, Property } from '@/types/property';
import { toast } from 'sonner';

export function useTaskManagement(property: Property | null, setProperty: (property: Property | null) => void) {
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed };
          if (completed) {
            updatedTask.completedDate = new Date().toISOString();
            
            // Remove the notification when task is completed
            const savedNotifications = localStorage.getItem('notifications');
            if (savedNotifications) {
              const notifications = JSON.parse(savedNotifications);
              const updatedNotifications = notifications.filter(
                (n: any) => !(n.type === 'task' && n.taskId === taskId)
              );
              localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
            }
          } else {
            delete updatedTask.completedDate;
            // Re-add notification if task is unchecked
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

      // Add task notification
      addTaskNotification(property.id, task);
      
      updatePropertyInStorage({
        ...property,
        tasks: [...(property.tasks || []), task]
      });
    }
  };

  const addTaskNotification = (propertyId: string, task: Task) => {
    const notification = {
      id: `notification-task-${task.id}`,
      type: 'task',
      taskId: task.id,
      propertyId: propertyId,
      message: `Tarea pendiente: ${task.title}`,
      read: false
    };

    const savedNotifications = localStorage.getItem('notifications');
    const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    
    // Check if notification already exists
    const notificationExists = notifications.some(
      (n: any) => n.taskId === task.id
    );
    
    if (!notificationExists) {
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      // Remove task notification when task is deleted
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        const updatedNotifications = notifications.filter(
          (n: any) => !(n.type === 'task' && n.taskId === taskId)
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      }

      updatePropertyInStorage({
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      });
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      updatePropertyInStorage({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const updatePropertyInStorage = (updatedProperty: Property) => {
    setProperty(updatedProperty);
    
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      const properties = JSON.parse(savedProperties);
      const updatedProperties = properties.map((p: Property) => 
        p.id === updatedProperty.id ? updatedProperty : p
      );
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
    }
  };

  return {
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
  };
}
