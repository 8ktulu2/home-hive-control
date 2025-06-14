
import { useState, useEffect } from 'react';
import { PropertyYearData } from '@/types/property/property-year-data';
import { propertyDataService } from '@/services/propertyDataService';
import { useYearMode } from '@/contexts/YearModeContext';
import { Property } from '@/types/property';

export const usePropertyYearData = (propertyId: string, baseProperty?: Property) => {
  const { selectedYear, isHistoricalMode } = useYearMode();
  const [yearData, setYearData] = useState<PropertyYearData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYearData = async () => {
      setLoading(true);
      
      try {
        console.log(`Cargando datos para año ${selectedYear}, propiedad ${propertyId}`);
        
        let data = propertyDataService.getPropertyYearData(propertyId, selectedYear);
        
        // Si no hay datos para el año específico
        if (!data) {
          console.log(`No hay datos para el año ${selectedYear}, creando estructura vacía`);
          
          // Si es el año actual y tenemos propiedad base, migrar
          if (!isHistoricalMode && baseProperty && selectedYear === new Date().getFullYear()) {
            console.log('Migrando datos de la propiedad base al año actual');
            const migrated = propertyDataService.migratePropertyToYearStructure(
              baseProperty, 
              selectedYear
            );
            
            if (migrated) {
              data = propertyDataService.getPropertyYearData(propertyId, selectedYear);
            }
          }
          
          // Si aún no hay datos, crear estructura vacía para este año específico
          if (!data) {
            console.log(`Creando estructura vacía para año ${selectedYear}`);
            data = propertyDataService.createEmptyYearData(propertyId, selectedYear, baseProperty);
          }
        }
        
        console.log(`Datos cargados para año ${selectedYear}:`, data);
        setYearData(data);
      } catch (error) {
        console.error('Error loading year data:', error);
        setYearData(null);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      loadYearData();
    }
  }, [propertyId, selectedYear, baseProperty, isHistoricalMode]);

  const saveYearData = (data: PropertyYearData): boolean => {
    console.log(`Guardando datos para año ${selectedYear}, propiedad ${propertyId}:`, data);
    
    const success = propertyDataService.savePropertyYearData(propertyId, selectedYear, data);
    if (success) {
      setYearData(data);
      console.log(`Datos guardados exitosamente para año ${selectedYear}`);
    } else {
      console.error(`Error al guardar datos para año ${selectedYear}`);
    }
    return success;
  };

  const getAvailableYears = (): number[] => {
    return propertyDataService.getAvailableYears(propertyId);
  };

  const clearCurrentYearData = (): void => {
    propertyDataService.clearYearData(propertyId, selectedYear);
    const emptyData = propertyDataService.createEmptyYearData(propertyId, selectedYear, baseProperty);
    setYearData(emptyData);
  };

  return {
    yearData,
    setYearData,
    saveYearData,
    clearCurrentYearData,
    loading,
    selectedYear,
    isHistoricalMode,
    getAvailableYears,
    isEditable: propertyDataService.isYearEditable(selectedYear)
  };
};
