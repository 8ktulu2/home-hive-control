
import { Property } from '@/types/property';
import { toast } from 'sonner';

export interface TemporalRecord<T> {
  id: string;
  year: number;
  month?: number;
  data: T;
  createdAt: string;
  immutable: boolean;
}

class TemporalDataService {
  private getStorageKey(type: string, propertyId: string): string {
    return `temporal_${type}_${propertyId}`;
  }

  // Guardar datos temporales (inmutables por año/mes)
  saveTemporalData<T>(
    type: string,
    propertyId: string,
    year: number,
    data: T,
    month?: number
  ): boolean {
    try {
      const key = this.getStorageKey(type, propertyId);
      const existing = this.getTemporalData<T>(type, propertyId);
      
      const recordId = month 
        ? `${year}-${month.toString().padStart(2, '0')}`
        : year.toString();
      
      // Verificar si ya existe un registro inmutable
      const existingRecord = existing.find(r => 
        r.year === year && 
        (month === undefined || r.month === month)
      );
      
      if (existingRecord && existingRecord.immutable) {
        console.warn(`Attempt to modify immutable record: ${recordId}`);
        return false;
      }

      const newRecord: TemporalRecord<T> = {
        id: recordId,
        year,
        month,
        data,
        createdAt: new Date().toISOString(),
        immutable: true // Los datos históricos son inmutables por defecto
      };

      const updatedRecords = [
        ...existing.filter(r => r.id !== recordId),
        newRecord
      ];

      localStorage.setItem(key, JSON.stringify(updatedRecords));
      return true;
    } catch (error) {
      console.error('Error saving temporal data:', error);
      return false;
    }
  }

  // Obtener datos temporales
  getTemporalData<T>(type: string, propertyId: string): TemporalRecord<T>[] {
    try {
      const key = this.getStorageKey(type, propertyId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading temporal data:', error);
      return [];
    }
  }

  // Obtener datos para un año específico
  getDataForYear<T>(type: string, propertyId: string, year: number): TemporalRecord<T>[] {
    return this.getTemporalData<T>(type, propertyId).filter(r => r.year === year);
  }

  // Obtener datos para un mes específico
  getDataForMonth<T>(
    type: string, 
    propertyId: string, 
    year: number, 
    month: number
  ): TemporalRecord<T> | null {
    const records = this.getTemporalData<T>(type, propertyId);
    return records.find(r => r.year === year && r.month === month) || null;
  }

  // Verificar si un registro es modificable
  isRecordMutable(type: string, propertyId: string, year: number, month?: number): boolean {
    const currentYear = new Date().getFullYear();
    
    // Solo el año actual es modificable, años históricos son inmutables
    if (year < currentYear) {
      return false;
    }
    
    if (month !== undefined) {
      const currentMonth = new Date().getMonth();
      // Solo meses futuros o el mes actual son modificables
      return year === currentYear && month >= currentMonth;
    }
    
    return year === currentYear;
  }

  // Guardar propiedad histórica completa
  saveHistoricalProperty(propertyId: string, year: number, property: Property): boolean {
    const currentYear = new Date().getFullYear();
    
    // Validar que no se modifique el año actual desde modo histórico
    if (year === currentYear) {
      toast.error('No se puede modificar el año actual desde el modo histórico');
      return false;
    }

    return this.saveTemporalData('property', propertyId, year, property);
  }

  // Obtener propiedad histórica
  getHistoricalProperty(propertyId: string, year: number): Property | null {
    const records = this.getDataForYear<Property>('property', propertyId, year);
    const latestRecord = records.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    return latestRecord ? latestRecord.data : null;
  }

  // Limpiar datos de una propiedad
  clearPropertyData(propertyId: string): void {
    const types = ['property', 'payments', 'tenants', 'expenses'];
    types.forEach(type => {
      const key = this.getStorageKey(type, propertyId);
      localStorage.removeItem(key);
    });
  }
}

export const temporalDataService = new TemporalDataService();
