
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { ExtendedTask } from '@/components/tasks/types';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  removeTaskNotification, 
  addTaskNotification, 
  syncAllTaskNotifications 
} from '@/utils/taskNotificationUtils';
import { mockProperties } from '@/data/mockData';

export const useTasksList = (
  filter: string,
  searchTerm: string,
  propertyFilter: string
) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { loadNotifications } = useNotifications();
  
  useEffect(() => {
    const loadProperties = () => {
      const savedProperties = localStorage.getItem('properties');
      return savedProperties ? JSON.parse(savedProperties) : mockProperties;
    };
    
    setProperties(loadProperties());
  }, []);
  
  // Sync notifications when component mounts
  useEffect(() => {
    syncAllTaskNotifications();
  }, []);
  
  const allTasks: ExtendedTask[] = properties.reduce((tasks, property) => {
    if (!property.tasks) return tasks;
    
    const propertyTasks = property.tasks.map(task => ({
      ...task,
      propertyName: property.name,
      propertyId: property.id,
      createdDate: task.createdDate || new Date().toISOString()
    }));
    
    return [...tasks, ...propertyTasks];
  }, [] as ExtendedTask[]);
  
  const filteredTasks = allTasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPropertyFilter = 
      propertyFilter === 'all' || task.propertyId === propertyFilter;
    
    return matchesFilter && matchesSearch && matchesPropertyFilter;
  });
  
  const handleTaskClick = (task: ExtendedTask) => {
    navigate(`/property/${task.propertyId}#tasks`);
  };
  
  const handleTaskToggle = (task: ExtendedTask) => {
    // This method is now only used to set the selected task
    // The actual toggle happens in handleConfirmTaskToggle
    return task;
  };
  
  const handleConfirmTaskToggle = (selectedTask: ExtendedTask) => {
    const updatedProperties = properties.map(property => {
      if (property.id === selectedTask.propertyId) {
        const updatedTasks = property.tasks?.map(task => {
          if (task.id === selectedTask.id) {
            const updatedTask = { 
              ...task, 
              completed: !task.completed
            };
            
            if (!task.completed) {
              updatedTask.completedDate = new Date().toISOString();
              
              // Remove notification when completing task
              removeTaskNotification(task.id);
            } else {
              delete updatedTask.completedDate;
              
              // Add notification when marking as pending
              addTaskNotification(property.id, updatedTask);
            }
            
            return updatedTask;
          }
          return task;
        });
        
        return {
          ...property,
          tasks: updatedTasks
        };
      }
      return property;
    });
    
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    const actionText = selectedTask.completed ? 'pendiente' : 'completada';
    toast.success(`Tarea marcada como ${actionText}`);
    
    // Reload notifications after changing task state
    loadNotifications();
  };

  return {
    properties,
    filteredTasks,
    handleTaskClick,
    handleTaskToggle,
    handleConfirmTaskToggle
  };
};
