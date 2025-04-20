
import { Property } from '@/types/property';
import { toast } from 'sonner';

export function usePropertyImages(property: Property | null, setProperty: (property: Property | null) => void) {
  const updatePropertyImage = (imageUrl: string) => {
    if (property) {
      const updatedProperty = {
        ...property,
        image: imageUrl
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  return {
    updatePropertyImage,
  };
}
