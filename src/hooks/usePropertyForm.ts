
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { useHistoricalStorage } from './useHistoricalStorage';

export const usePropertyForm = (
  property: Property | null, 
  calculateTotalExpenses: () => number,
  historicalYear?: number
) => {
  const navigate = useNavigate();
  const { saveRecord } = useHistoricalStorage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!property) {
      toast.error('No se pudo obtener la información de la propiedad');
      return;
    }

    try {
      if (historicalYear) {
        // Guardar cambios históricos - PRESERVAR CONTEXTO
        const success = saveHistoricalPropertyData(property, historicalYear);
        
        if (success) {
          toast.success(`Datos históricos de ${historicalYear} guardados correctamente`);
          navigate(`/historicos/property/${property.id}/${historicalYear}`);
        } else {
          toast.error('Error al guardar los datos históricos');
        }
      } else {
        // Guardar cambios del año actual
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

  const saveHistoricalPropertyData = (property: Property, year: number): boolean => {
    try {
      // Guardar datos históricos de forma aislada
      const historicalKey = `historicalProperty_${property.id}_${year}`;
      const historicalData = {
        ...property,
        year,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(historicalKey, JSON.stringify(historicalData));
      
      // También actualizar registros de categorías si existen
      if (property.paymentHistory) {
        property.paymentHistory.forEach(payment => {
          if (payment.year === year) {
            const categorias = {
              alquiler: payment.isPaid ? (property.rent || 0) : 0,
              hipoteca: property.mortgage?.monthlyPayment || 0,
              comunidad: property.communityFee || 0,
              ibi: (property.ibi || 0) / 12,
              seguroVida: (property.lifeInsurance?.cost || 0) / 12,
              seguroHogar: (property.homeInsurance?.cost || 0) / 12,
              compras: 0,
              averias: 0,
              suministros: 0
            };
            
            saveRecord(property.id, year, payment.month, categorias);
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving historical property data:', error);
      return false;
    }
  };

  return { handleSubmit };
};
