
import { Task, Property } from '@/types/property';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';
import { getNotificationsFromStorage, saveNotificationsToStorage } from '@/services/notificationService';

/**
 * Updates a property in local storage
 */
export const updatePropertyInStorage = (
  updatedProperty: Property,
  setProperty: (property: Property | null) => void
) => {
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

/**
 * Updates a task in a property
 */
export const updatePropertyTasks = (
  property: Property,
  updatedTasks: Task[],
  setProperty: (property: Property | null) => void
) => {
  if (!property) return;
  
  const updatedProperty = {
    ...property,
    tasks: updatedTasks
  };
  
  updatePropertyInStorage(updatedProperty, setProperty);
};
