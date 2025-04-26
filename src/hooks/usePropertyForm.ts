
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
      
      // Obtener propiedades del localStorage
      const savedProperties = localStorage.getItem('properties');
      let properties = [];
      let isNewProperty = true;
      
      if (savedProperties) {
        try {
          properties = JSON.parse(savedProperties);
          
          // Comprobar si la propiedad ya existe
          const existingPropertyIndex = properties.findIndex((p: Property) => p.id === property.id);
          isNewProperty = existingPropertyIndex === -1;
          
          if (isNewProperty) {
            // Si es nueva, añadirla al array
            properties.push(updatedProperty);
          } else {
            // Si existe, actualizarla
            properties[existingPropertyIndex] = updatedProperty;
          }
          
          // Guardar en localStorage
          localStorage.setItem('properties', JSON.stringify(properties));
          
        } catch (error) {
          console.error("Error al procesar las propiedades:", error);
          toast.error("Error al guardar la propiedad");
          return;
        }
      } else {
        // Si no hay propiedades guardadas, crear un nuevo array
        localStorage.setItem('properties', JSON.stringify([updatedProperty]));
      }
      
      toast.success(isNewProperty ? 'Propiedad creada con éxito' : 'Propiedad actualizada con éxito');
      navigate(`/property/${property.id}`);
    }
  };

  return { handleSubmit };
};
