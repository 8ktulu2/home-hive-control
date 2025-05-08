
import { Property } from '@/types/property';
import { toast } from 'sonner';

/**
 * Save updated property to localStorage
 */
export const savePropertyToStorage = (updatedProperty: Property): boolean => {
  try {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      const properties = JSON.parse(savedProperties);
      const updatedProperties = properties.map((p: Property) => 
        p.id === updatedProperty.id ? updatedProperty : p
      );
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    toast.error('Error al guardar los cambios', { duration: 2000 });
    return false;
  }
};
