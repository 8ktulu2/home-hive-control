
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
            
            // Eliminar la notificación cuando se completa la tarea
            removeTaskNotification(taskId);
            
            toast.success("Tarea completada", {
              description: `La tarea "${task.title}" ha sido marcada como completada.`
            });
          } else {
            delete updatedTask.completedDate;
            // Volver a añadir la notificación si se desmarca la tarea
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

      // Añadir notificación de tarea para cada tarea nueva
      addTaskNotification(property.id, task);
      
      // Actualizar propiedad con nueva tarea
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
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        const updatedNotifications = notifications.filter(
          (n: any) => !(n.type === 'task' && n.taskId === taskId)
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        console.log("Notificación de tarea eliminada para tarea:", taskId);
      }
    } catch (error) {
      console.error("Error al eliminar notificación de tarea:", error);
    }
  };

  const addTaskNotification = (propertyId: string, task: Task) => {
    try {
      if (!task.completed) {  // Solo añadir notificación si la tarea no está completada
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
        
        // Comprobar si la notificación ya existe
        const existingIndex = notifications.findIndex(
          (n: any) => n.taskId === task.id
        );
        
        if (existingIndex >= 0) {
          // Actualizar notificación existente
          notifications[existingIndex] = notification;
        } else {
          // Añadir nueva notificación
          notifications.push(notification);
        }
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
        console.log("Notificación de tarea añadida:", notification);
      }
    } catch (error) {
      console.error("Error al añadir notificación de tarea:", error);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      // Eliminar notificación de tarea cuando se elimina la tarea
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
          
          // Si el estado de la tarea cambió a completada, eliminar notificación
          if (updates.completed === true && !task.completed) {
            removeTaskNotification(taskId);
          } 
          // Si la tarea cambió de completada a pendiente, añadir notificación
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
      console.error("Error al actualizar propiedad en localStorage:", error);
    }
  };

  return {
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
  };
}
