
import { Property } from '@/types/property';
import { PropertyYearData, PropertyWithYearData } from '@/types/property/property-year-data';
import { toast } from 'sonner';

class PropertyDataService {
  private getStorageKey(propertyId: string): string {
    return `property_data_${propertyId}`;
  }

  // Obtener datos de una propiedad para un año específico
  getPropertyYearData(propertyId: string, year: number): PropertyYearData | null {
    try {
      const key = this.getStorageKey(propertyId);
      const data = localStorage.getItem(key);
      
      if (!data) return null;
      
      const propertyData: PropertyWithYearData = JSON.parse(data);
      return propertyData.years[year] || null;
    } catch (error) {
      console.error('Error loading property year data:', error);
      return null;
    }
  }

  // Guardar datos de una propiedad para un año específico - COMPLETAMENTE AISLADO
  savePropertyYearData(propertyId: string, year: number, data: PropertyYearData): boolean {
    try {
      const key = this.getStorageKey(propertyId);
      const existingData = localStorage.getItem(key);
      
      let propertyData: PropertyWithYearData;
      
      if (existingData) {
        propertyData = JSON.parse(existingData);
      } else {
        // Crear estructura inicial si no existe
        propertyData = {
          id: propertyId,
          name: 'Propiedad',
          address: '',
          years: {}
        };
      }

      // AISLAMIENTO TOTAL: Solo actualizar el año específico sin tocar otros años
      propertyData.years[year] = {
        ...data,
        // Marcar pagos históricos como inmutables solo si no es el año actual
        payments: data.payments.map(payment => ({
          ...payment,
          immutable: year < new Date().getFullYear()
        }))
      };

      localStorage.setItem(key, JSON.stringify(propertyData));
      console.log(`Datos guardados para año ${year}, propiedad ${propertyId}:`, propertyData.years[year]);
      return true;
    } catch (error) {
      console.error('Error saving property year data:', error);
      toast.error('Error al guardar los datos');
      return false;
    }
  }

  // Crear datos vacíos para un año específico
  createEmptyYearData(propertyId: string, year: number, baseProperty?: Property): PropertyYearData {
    const emptyData: PropertyYearData = {
      tenants: [],
      payments: [],
      expenses: [],
      notes: '',
      rent: baseProperty?.rent || 0,
      rentPaid: false
    };

    // Si tenemos una propiedad base y es el primer año, inicializar con algunos datos básicos
    if (baseProperty && year === new Date().getFullYear()) {
      emptyData.rent = baseProperty.rent || 0;
      emptyData.rentPaid = baseProperty.rentPaid || false;
    }

    return emptyData;
  }

  // Obtener todos los años disponibles para una propiedad
  getAvailableYears(propertyId: string): number[] {
    try {
      const key = this.getStorageKey(propertyId);
      const data = localStorage.getItem(key);
      
      if (!data) return [];
      
      const propertyData: PropertyWithYearData = JSON.parse(data);
      return Object.keys(propertyData.years).map(Number).sort((a, b) => b - a);
    } catch (error) {
      console.error('Error loading available years:', error);
      return [];
    }
  }

  // Verificar si un año es modificable
  isYearEditable(year: number): boolean {
    const currentYear = new Date().getFullYear();
    // Solo el año actual es editable sin restricciones
    // Los años históricos también son editables pero con advertencias
    return true;
  }

  // Verificar si estamos en modo histórico
  isHistoricalMode(year: number): boolean {
    return year < new Date().getFullYear();
  }

  // Limpiar datos de una propiedad específica
  clearPropertyData(propertyId: string): void {
    const key = this.getStorageKey(propertyId);
    localStorage.removeItem(key);
  }

  // Limpiar datos de un año específico solamente
  clearYearData(propertyId: string, year: number): void {
    try {
      const key = this.getStorageKey(propertyId);
      const existingData = localStorage.getItem(key);
      
      if (existingData) {
        const propertyData: PropertyWithYearData = JSON.parse(existingData);
        delete propertyData.years[year];
        localStorage.setItem(key, JSON.stringify(propertyData));
        console.log(`Datos del año ${year} eliminados para propiedad ${propertyId}`);
      }
    } catch (error) {
      console.error('Error clearing year data:', error);
    }
  }

  // Migrar propiedad existente al nuevo formato SOLO para el año actual
  migratePropertyToYearStructure(property: Property, currentYear: number): boolean {
    try {
      // Solo migrar al año actual, no crear datos históricos automáticamente
      const yearData: PropertyYearData = {
        tenants: (property.tenants || []).map(tenant => ({
          name: tenant.name,
          startMonth: `${currentYear}-01`,
          endMonth: undefined,
          email: tenant.email,
          phone: tenant.phone
        })),
        payments: (property.paymentHistory || []).map(payment => ({
          month: typeof payment.month === 'string' ? payment.month : `${currentYear}-01`,
          amount: payment.amount,
          createdAt: new Date().toISOString(),
          immutable: false,
          isPaid: payment.isPaid || false,
          notes: payment.notes || ''
        })),
        expenses: Array.isArray(property.monthlyExpenses) ? property.monthlyExpenses.map(expense => ({
          concept: expense.name || 'Gasto',
          amount: expense.amount || 0,
          deductible: false,
          category: expense.category || 'General',
          date: expense.date || new Date().toISOString()
        })) : [],
        notes: '',
        rent: property.rent,
        rentPaid: property.rentPaid
      };

      return this.savePropertyYearData(property.id, currentYear, yearData);
    } catch (error) {
      console.error('Error migrating property:', error);
      return false;
    }
  }
}

export const propertyDataService = new PropertyDataService();
