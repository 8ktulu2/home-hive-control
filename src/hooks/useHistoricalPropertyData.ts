
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { usePropertyYearData } from '@/hooks/usePropertyYearData';

export const useHistoricalPropertyData = () => {
  const { propertyId, year } = useParams();
  const navigate = useNavigate();
  const [baseProperty, setBaseProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  const yearNumber = year ? parseInt(year) : new Date().getFullYear();
  const isHistoricalYear = yearNumber < new Date().getFullYear();

  const {
    yearData,
    saveYearData,
    loading: yearDataLoading,
  } = usePropertyYearData(propertyId || '', baseProperty);

  useEffect(() => {
    if (propertyId) {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const property = properties.find((p: Property) => p.id === propertyId);
        if (property) {
          setBaseProperty(property);
        } else {
          toast.error('No se encontró la propiedad');
          navigate('/historicos');
        }
      }
    }
    setLoading(false);
  }, [propertyId, navigate]);

  const handleYearDataUpdate = (updatedData: any) => {
    if (yearData) {
      const success = saveYearData(updatedData);
      if (success) {
        toast.success(`Datos del año ${yearNumber} actualizados correctamente`);
      } else {
        toast.error('Error al actualizar los datos del año');
      }
    }
  };

  return {
    propertyId,
    yearNumber,
    isHistoricalYear,
    baseProperty,
    yearData,
    loading: loading || yearDataLoading,
    handleYearDataUpdate
  };
};
