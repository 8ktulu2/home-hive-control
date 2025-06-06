
import { useState, useCallback } from 'react';
import { Property } from '@/types/property';
import { toast } from 'sonner';

interface HistoricalPropertyEntry {
  propertyId: string;
  propertyName: string;
  year: number;
  data: Property;
  createdAt: string;
}

interface HistoricalPropertyData {
  propertyId: string;
  propertyName: string;
  years: number[];
}

export const useHistoricalMigration = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar si es 1 de enero y ejecutar migración automática
  const checkAndMigrateData = useCallback(() => {
    const today = new Date();
    const lastMigration = localStorage.getItem('lastHistoricalMigration');
    const currentYear = today.getFullYear();
    
    // Verificar si ya se hizo la migración este año
    if (lastMigration && parseInt(lastMigration) >= currentYear) {
      return;
    }

    // Verificar si es 1 de enero o si nunca se ha hecho migración
    const isJanuary1st = today.getMonth() === 0 && today.getDate() === 1;
    const hasNeverMigrated = !lastMigration;
    
    if (isJanuary1st || hasNeverMigrated) {
      performAutomaticMigration(currentYear - 1);
    }
  }, []);

  // Ejecutar migración automática
  const performAutomaticMigration = useCallback((yearToMigrate: number) => {
    setIsProcessing(true);
    
    try {
      const savedProperties = localStorage.getItem('properties');
      if (!savedProperties) {
        setIsProcessing(false);
        return;
      }

      const properties: Property[] = JSON.parse(savedProperties);
      const existingHistorical = getStoredHistoricalData();

      properties.forEach((property) => {
        // Crear una copia completa de la propiedad para el año histórico
        const historicalEntry: HistoricalPropertyEntry = {
          propertyId: property.id,
          propertyName: property.name,
          year: yearToMigrate,
          data: {
            ...property,
            // Asegurar que todos los datos están capturados
            paymentHistory: property.paymentHistory || [],
            tasks: property.tasks || [],
            documents: property.documents || [],
            inventory: property.inventory || [],
            monthlyExpenses: property.monthlyExpenses || []
          },
          createdAt: new Date().toISOString()
        };

        existingHistorical.push(historicalEntry);
      });

      // Guardar datos históricos actualizados
      localStorage.setItem('historicalData', JSON.stringify(existingHistorical));
      localStorage.setItem('lastHistoricalMigration', new Date().getFullYear().toString());
      
      toast.success(`Datos de ${yearToMigrate} migrados automáticamente a históricos`);
    } catch (error) {
      console.error('Error en migración automática:', error);
      toast.error('Error en la migración automática de datos');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Obtener datos históricos almacenados
  const getStoredHistoricalData = (): HistoricalPropertyEntry[] => {
    try {
      const stored = localStorage.getItem('historicalData');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading historical data:', error);
      return [];
    }
  };

  // Obtener estructura de datos para la vista principal
  const getHistoricalData = useCallback((): HistoricalPropertyData[] => {
    const historical = getStoredHistoricalData();
    const groupedData: { [propertyId: string]: HistoricalPropertyData } = {};

    historical.forEach((entry) => {
      if (!groupedData[entry.propertyId]) {
        groupedData[entry.propertyId] = {
          propertyId: entry.propertyId,
          propertyName: entry.propertyName,
          years: []
        };
      }
      
      if (!groupedData[entry.propertyId].years.includes(entry.year)) {
        groupedData[entry.propertyId].years.push(entry.year);
      }
    });

    return Object.values(groupedData);
  }, []);

  // Obtener datos específicos de una propiedad para un año
  const getPropertyHistoricalData = useCallback((propertyId: string, year: number): Property | null => {
    const historical = getStoredHistoricalData();
    const entry = historical.find(h => h.propertyId === propertyId && h.year === year);
    return entry ? entry.data : null;
  }, []);

  // Actualizar datos históricos específicos
  const updateHistoricalData = useCallback((propertyId: string, year: number, updatedData: Property): boolean => {
    try {
      const historical = getStoredHistoricalData();
      const entryIndex = historical.findIndex(h => h.propertyId === propertyId && h.year === year);
      
      if (entryIndex >= 0) {
        historical[entryIndex].data = updatedData;
        localStorage.setItem('historicalData', JSON.stringify(historical));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating historical data:', error);
      return false;
    }
  }, []);

  return {
    isProcessing,
    checkAndMigrateData,
    performAutomaticMigration,
    getHistoricalData,
    getPropertyHistoricalData,
    updateHistoricalData
  };
};
