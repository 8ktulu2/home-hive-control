
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
        let data = propertyDataService.getPropertyYearData(propertyId, selectedYear);
        
        // Si no hay datos para el año y tenemos la propiedad base, migrar
        if (!data && baseProperty && selectedYear === new Date().getFullYear()) {
          const migrated = propertyDataService.migratePropertyToYearStructure(
            baseProperty, 
            selectedYear
          );
          
          if (migrated) {
            data = propertyDataService.getPropertyYearData(propertyId, selectedYear);
          }
        }
        
        // Si aún no hay datos, crear estructura vacía para el año actual
        if (!data && selectedYear === new Date().getFullYear()) {
          data = {
            tenants: [],
            payments: [],
            expenses: [],
            notes: '',
            rent: baseProperty?.rent || 0,
            rentPaid: baseProperty?.rentPaid || false
          };
        }
        
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
  }, [propertyId, selectedYear, baseProperty]);

  const saveYearData = (data: PropertyYearData): boolean => {
    const success = propertyDataService.savePropertyYearData(propertyId, selectedYear, data);
    if (success) {
      setYearData(data);
    }
    return success;
  };

  const getAvailableYears = (): number[] => {
    return propertyDataService.getAvailableYears(propertyId);
  };

  return {
    yearData,
    setYearData,
    saveYearData,
    loading,
    selectedYear,
    isHistoricalMode,
    getAvailableYears,
    isEditable: propertyDataService.isYearEditable(selectedYear)
  };
};
