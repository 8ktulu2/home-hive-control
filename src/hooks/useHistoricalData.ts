
import { useState, useEffect } from 'react';
import { HistoricalEntry, HistoricalSummary, HistoricalFilters } from '@/types/historical';
import { Property } from '@/types/property';
import { toast } from 'sonner';

export const useHistoricalData = () => {
  const [historicalEntries, setHistoricalEntries] = useState<HistoricalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos históricos del localStorage
  useEffect(() => {
    const loadHistoricalData = () => {
      try {
        const savedData = localStorage.getItem('historicalData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setHistoricalEntries(parsedData);
        }
      } catch (error) {
        console.error('Error loading historical data:', error);
        toast.error('Error al cargar los datos históricos');
      }
    };

    loadHistoricalData();
  }, []);

  // Guardar en localStorage
  const saveToStorage = (entries: HistoricalEntry[]) => {
    try {
      localStorage.setItem('historicalData', JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Error saving historical data:', error);
      toast.error('Error al guardar los datos históricos');
      return false;
    }
  };

  // Añadir nueva entrada histórica
  const addHistoricalEntry = (entry: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>) => {
    const newEntry: HistoricalEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isHistorical: true
    };

    const updatedEntries = [...historicalEntries, newEntry];
    setHistoricalEntries(updatedEntries);
    
    if (saveToStorage(updatedEntries)) {
      toast.success('Registro histórico añadido correctamente');
      return newEntry;
    }
    return null;
  };

  // Actualizar entrada existente
  const updateHistoricalEntry = (id: string, updates: Partial<HistoricalEntry>) => {
    const updatedEntries = historicalEntries.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );
    
    setHistoricalEntries(updatedEntries);
    
    if (saveToStorage(updatedEntries)) {
      toast.success('Registro histórico actualizado');
      return true;
    }
    return false;
  };

  // Eliminar entrada
  const deleteHistoricalEntry = (id: string) => {
    const updatedEntries = historicalEntries.filter(entry => entry.id !== id);
    setHistoricalEntries(updatedEntries);
    
    if (saveToStorage(updatedEntries)) {
      toast.success('Registro histórico eliminado');
      return true;
    }
    return false;
  };

  // Filtrar entradas
  const getFilteredEntries = (filters: HistoricalFilters): HistoricalEntry[] => {
    return historicalEntries.filter(entry => {
      if (filters.propertyId && entry.propertyId !== filters.propertyId) return false;
      if (filters.year && entry.year !== filters.year) return false;
      if (filters.type && entry.type !== filters.type) return false;
      if (filters.category && entry.category !== filters.category) return false;
      return true;
    });
  };

  // Generar resumen anual por propiedad
  const getAnnualSummary = (propertyId: string, year: number): HistoricalSummary | null => {
    const entries = getFilteredEntries({ propertyId, year });
    if (entries.length === 0) return null;

    const property = entries[0];
    const months = Array.from({ length: 12 }, (_, month) => {
      const monthEntries = entries.filter(e => e.month === month);
      const income = monthEntries
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + (e.amount || 0), 0);
      const expenses = monthEntries
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + (e.amount || 0), 0);
      const occupancyEntry = monthEntries.find(e => e.type === 'occupancy');
      const incidents = monthEntries.filter(e => e.type === 'incident').length;

      return {
        month,
        income,
        expenses,
        isOccupied: occupancyEntry?.isOccupied || false,
        tenantName: occupancyEntry?.tenantName,
        incidentsCount: incidents
      };
    });

    const totalIncome = months.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = months.reduce((sum, m) => sum + m.expenses, 0);
    const occupiedMonths = months.filter(m => m.isOccupied).length;

    return {
      propertyId,
      propertyName: property.propertyName,
      year,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      occupancyRate: (occupiedMonths / 12) * 100,
      months
    };
  };

  return {
    historicalEntries,
    loading,
    addHistoricalEntry,
    updateHistoricalEntry,
    deleteHistoricalEntry,
    getFilteredEntries,
    getAnnualSummary
  };
};
