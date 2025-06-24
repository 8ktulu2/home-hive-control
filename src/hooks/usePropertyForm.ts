
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { useHistoricalStorage } from './useHistoricalStorage';
import { temporalDataService } from '@/services/temporalDataService';
import { useYear } from '@/contexts/YearContext';

export const usePropertyForm = (
  property: Property | null, 
  calculateTotalExpenses: () => number,
  historicalYear?: number
) => {
  const navigate = useNavigate();
  const { saveRecord } = useHistoricalStorage();
  const { selectedYear, isHistoricalMode } = useYear();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!property) {
      toast.error('No se pudo obtener la información de la propiedad');
      return;
    }

    try {
      const activeYear = historicalYear || selectedYear;
      
      if (isHistoricalMode || historicalYear) {
        // MODO HISTÓRICO - Guardar en almacenamiento temporal aislado
        const success = temporalDataService.saveHistoricalProperty(
          property.id, 
          activeYear, 
          property
        );
        
        if (success) {
          toast.success(`Datos históricos de ${activeYear} guardados correctamente`);
          navigate(`/historicos/property/${property.id}/${activeYear}`);
        } else {
          toast.error('Error al guardar los datos históricos');
        }
      } else {
        // MODO ACTUAL - Guardar en almacenamiento principal
        const updatedProperty = {
          ...property,
          expenses: calculateTotalExpenses(),
          netIncome: (property.rent || 0) - calculateTotalExpenses()
        };

        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const propertyIndex = properties.findIndex((p: Property) => p.id === property.id);
          
          if (propertyIndex >= 0) {
            properties[propertyIndex] = updatedProperty;
            localStorage.setItem('properties', JSON.stringify(properties));
            toast.success('Propiedad actualizada correctamente');
            navigate(`/property/${property.id}`);
          } else {
            // Nueva propiedad
            const newProperty = { ...updatedProperty, id: Date.now().toString() };
            properties.push(newProperty);
            localStorage.setItem('properties', JSON.stringify(properties));
            toast.success('Propiedad creada correctamente');
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Error al guardar la propiedad');
    }
  };

  return { handleSubmit };
};
