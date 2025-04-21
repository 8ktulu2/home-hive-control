
import { Property } from '@/types/property';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const usePropertyForm = (property: Property | null, calculateTotalExpenses: () => number) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      const expenses = calculateTotalExpenses();
      const netIncome = property.rent - expenses;
      
      const updatedProperty = {
        ...property,
        expenses,
        netIncome
      };
      
      const savedProperties = localStorage.getItem('properties');
      let isNewProperty = true;
      
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        isNewProperty = !properties.some((p: Property) => p.id === property.id);
        
        if (isNewProperty) {
          properties.push(updatedProperty);
        } else {
          const index = properties.findIndex((p: Property) => p.id === property.id);
          if (index >= 0) {
            properties[index] = updatedProperty;
          } else {
            properties.push(updatedProperty);
          }
        }
        
        localStorage.setItem('properties', JSON.stringify(properties));
      } else {
        localStorage.setItem('properties', JSON.stringify([updatedProperty]));
      }
      
      toast.success(isNewProperty ? 'Propiedad creada con éxito' : 'Propiedad actualizada con éxito');
      navigate(`/property/${property.id}`);
    }
  };

  return { handleSubmit };
};
