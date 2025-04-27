
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
            removeTaskNotification(taskId);
            
            toast.success("Tarea completada", {
              description: `La tarea "${task.title}" ha sido marcada como completada.`
            });
          } else {
            delete updatedTask.completedDate;
            // Re-add notification if task is unchecked
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

      // Add task notification
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
    }
  };

  const removeTaskNotification = (taskId: string) => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      const updatedNotifications = notifications.filter(
        (n: any) => !(n.type === 'task' && n.taskId === taskId)
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      console.log("Task notification removed for task:", taskId);
    }
  };

  const addTaskNotification = (propertyId: string, task: Task) => {
    if (!task.completed) {  // Only add notification if task is not completed
      const notification = {
        id: `notification-task-${task.id}`,
        type: 'task',
        taskId: task.id,
        propertyId: propertyId,
        message: `Tarea pendiente: ${task.title}`,
        read: false,
        createdAt: new Date().toISOString()
      };
  
      const savedNotifications = localStorage.getItem('notifications');
      let notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
      // Check if notification already exists
      const existingIndex = notifications.findIndex(
        (n: any) => n.taskId === task.id
      );
      
      if (existingIndex >= 0) {
        // Update existing notification
        notifications[existingIndex] = notification;
      } else {
        // Add new notification
        notifications.push(notification);
      }
      
      localStorage.setItem('notifications', JSON.stringify(notifications));
      console.log("Task notification added:", notification);
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
          
          // If the task status changed to completed, remove notification
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
