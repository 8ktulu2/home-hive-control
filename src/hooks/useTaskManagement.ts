
import { useState } from 'react';
import { Task, Property } from '@/types/property';
import { toast } from 'sonner';
import { 
  removeTaskNotification, 
  addTaskNotification, 
  syncAllTaskNotifications 
} from '@/utils/taskNotificationUtils';
import { updatePropertyInStorage, updatePropertyTasks } from '@/services/taskService';
import { useNotifications } from '@/hooks/useNotifications';

export function useTaskManagement(property: Property | null, setProperty: (property: Property | null) => void) {
  const { loadNotifications } = useNotifications();
  
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
      
      updatePropertyTasks(property, updatedTasks, setProperty);
      
      // Reload notifications to update the UI immediately
      loadNotifications();
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
      
      updatePropertyInStorage(updatedProperty, setProperty);
      
      toast.success("Tarea añadida", {
        description: `La tarea "${task.title}" ha sido añadida correctamente.`
      });
      
      // Reload notifications to update the UI immediately
      loadNotifications();
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      // Remove task notification when task is deleted
      removeTaskNotification(taskId);

      const updatedProperty = {
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      };
      
      updatePropertyInStorage(updatedProperty, setProperty);
      
      // Reload notifications to update the UI immediately
      loadNotifications();
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
      
      updatePropertyTasks(property, updatedTasks, setProperty);
      
      // Reload notifications to update the UI immediately
      loadNotifications();
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
