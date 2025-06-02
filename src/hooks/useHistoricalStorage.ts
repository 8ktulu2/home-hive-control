
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDataSynchronization } from './useDataSynchronization';

export interface HistoricalRecord {
  id: string;
  propiedadId: string;
  año: number;
  mes: number;
  ingresos: number;
  gastos: number;
  categorias: {
    alquiler: number;
    hipoteca: number;
    comunidad: number;
    ibi: number;
    seguroVida: number;
    seguroHogar: number;
    compras: number;
    averias: number;
    suministros: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const useHistoricalStorage = () => {
  const [records, setRecords] = useState<HistoricalRecord[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('historicalRecords');
      if (savedData) {
        setRecords(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
      toast.error('Error al cargar los datos históricos');
    }
  }, []);

  // Guardar en localStorage
  const saveToStorage = (newRecords: HistoricalRecord[]) => {
    try {
      localStorage.setItem('historicalRecords', JSON.stringify(newRecords));
      setRecords(newRecords);
      return true;
    } catch (error) {
      console.error('Error saving historical data:', error);
      toast.error('Error al guardar los datos históricos');
      return false;
    }
  };

  // Obtener registro por propiedad, año y mes
  const getRecord = (propiedadId: string, año: number, mes: number): HistoricalRecord | null => {
    return records.find(r => 
      r.propiedadId === propiedadId && 
      r.año === año && 
      r.mes === mes
    ) || null;
  };

  // Obtener todos los registros de una propiedad y año
  const getRecordsByPropertyYear = (propiedadId: string, año: number): HistoricalRecord[] => {
    return records.filter(r => r.propiedadId === propiedadId && r.año === año);
  };

  // Obtener todos los registros filtrados por año y propiedad
  const getFilteredRecords = (año: number, propiedadId?: string): HistoricalRecord[] => {
    let filteredRecords = records.filter(r => r.año === año);
    
    if (propiedadId && propiedadId !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.propiedadId === propiedadId);
    }
    
    return filteredRecords;
  };

  // Guardar o actualizar registro
  const saveRecord = (
    propiedadId: string, 
    año: number, 
    mes: number, 
    categorias: HistoricalRecord['categorias']
  ): boolean => {
    const ingresos = categorias.alquiler;
    const gastos = categorias.hipoteca + categorias.comunidad + categorias.ibi + 
                   categorias.seguroVida + categorias.seguroHogar + categorias.compras + 
                   categorias.averias + categorias.suministros;

    const existingIndex = records.findIndex(r => 
      r.propiedadId === propiedadId && r.año === año && r.mes === mes
    );

    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      // Actualizar registro existente
      const updatedRecords = [...records];
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        ingresos,
        gastos,
        categorias,
        updatedAt: now
      };
      
      const success = saveToStorage(updatedRecords);
      
      // Sincronizar con propiedades si cambió el alquiler
      if (success) {
        const { syncHistoricalToProperty } = require('./useDataSynchronization').useDataSynchronization();
        syncHistoricalToProperty(propiedadId, año, mes);
      }
      
      return success;
    } else {
      // Crear nuevo registro
      const newRecord: HistoricalRecord = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propiedadId,
        año,
        mes,
        ingresos,
        gastos,
        categorias,
        createdAt: now,
        updatedAt: now
      };
      
      const success = saveToStorage([...records, newRecord]);
      
      // Sincronizar con propiedades si se creó un nuevo registro con alquiler
      if (success && categorias.alquiler > 0) {
        const { syncHistoricalToProperty } = require('./useDataSynchronization').useDataSynchronization();
        syncHistoricalToProperty(propiedadId, año, mes);
      }
      
      return success;
    }
  };

  // Eliminar registro
  const deleteRecord = (propiedadId: string, año: number, mes: number): boolean => {
    const updatedRecords = records.filter(r => 
      !(r.propiedadId === propiedadId && r.año === año && r.mes === mes)
    );
    return saveToStorage(updatedRecords);
  };

  return {
    records,
    getRecord,
    getRecordsByPropertyYear,
    getFilteredRecords,
    saveRecord,
    deleteRecord
  };
};
