
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
          } else {
            delete updatedTask.completedDate;
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
      
      updatePropertyInStorage({
        ...property,
        tasks: [...(property.tasks || []), task]
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
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
