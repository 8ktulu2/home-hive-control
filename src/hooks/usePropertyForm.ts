
import { Property } from '@/types/property';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const usePropertyForm = (property: Property | null, calculateTotalExpenses: () => number) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      // Calculate updated expenses and net income
      const expenses = calculateTotalExpenses();
      const rent = property.rent || 0;
      const netIncome = rent - expenses;
      
      const updatedProperty = {
        ...property,
        expenses,
        netIncome
      };
      
      try {
        // Get existing properties from localStorage
        const savedProperties = localStorage.getItem('properties');
        let properties = [];
        
        if (savedProperties) {
          properties = JSON.parse(savedProperties);
          
          // Check if the property already exists
          const existingPropertyIndex = properties.findIndex((p: Property) => p.id === property.id);
          
          if (existingPropertyIndex === -1) {
            // If it's a new property, add it to the array
            properties.push(updatedProperty);
            toast.success('Propiedad creada con éxito');
          } else {
            // If it exists, update it
            properties[existingPropertyIndex] = updatedProperty;
            toast.success('Propiedad actualizada con éxito');
          }
        } else {
          // If no properties are saved, create a new array
          properties = [updatedProperty];
          toast.success('Propiedad creada con éxito');
        }
        
        // Save back to localStorage
        localStorage.setItem('properties', JSON.stringify(properties));
        
        // Save images separately if needed
        if (property.image && !property.image.startsWith('/placeholder')) {
          const savedImages = localStorage.getItem('propertyImages') || '{}';
          const images = JSON.parse(savedImages);
          images[property.id] = property.image;
          localStorage.setItem('propertyImages', JSON.stringify(images));
        }
        
        // Navigate back to property detail page
        navigate(`/property/${property.id}`);
      } catch (error) {
        console.error("Error al procesar las propiedades:", error);
        toast.error("Error al guardar la propiedad");
      }
    }
  };

  return { handleSubmit };
};
