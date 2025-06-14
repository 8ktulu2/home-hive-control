
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

  // Guardar datos de una propiedad para un año específico
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

      // Actualizar datos del año específico
      propertyData.years[year] = {
        ...data,
        // Marcar pagos históricos como inmutables
        payments: data.payments.map(payment => ({
          ...payment,
          immutable: year < new Date().getFullYear()
        }))
      };

      localStorage.setItem(key, JSON.stringify(propertyData));
      return true;
    } catch (error) {
      console.error('Error saving property year data:', error);
      toast.error('Error al guardar los datos');
      return false;
    }
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

  // Migrar propiedad existente al nuevo formato
  migratePropertyToYearStructure(property: Property, currentYear: number): boolean {
    try {
      const yearData: PropertyYearData = {
        tenants: (property.tenants || []).map(tenant => ({
          name: tenant.name,
          startMonth: `${currentYear}-01`, // Default start month
          endMonth: undefined, // Tenant type doesn't have endMonth, so we set undefined
          email: tenant.email,
          phone: tenant.phone
        })),
        payments: (property.paymentHistory || []).map(payment => ({
          month: typeof payment.month === 'string' ? payment.month : `${currentYear}-01`,
          amount: payment.amount,
          createdAt: new Date().toISOString(), // PaymentRecord doesn't have createdAt, so we create new
          immutable: false, // PaymentRecord doesn't have immutable, default to false
          isPaid: payment.isPaid || false,
          notes: payment.notes || ''
        })),
        expenses: Array.isArray(property.monthlyExpenses) ? property.monthlyExpenses.map(expense => ({
          concept: expense.description || expense.name || 'Gasto', // MonthlyExpense might have description or name
          amount: expense.amount || 0,
          deductible: false, // MonthlyExpense doesn't have deductible, default to false
          category: expense.category || 'General',
          date: expense.date || new Date().toISOString()
        })) : [],
        notes: '', // TaxInfo doesn't have notes, so we set empty string
        rent: property.rent,
        rentPaid: property.rentPaid
      };

      return this.savePropertyYearData(property.id, currentYear, yearData);
    } catch (error) {
      console.error('Error migrating property:', error);
      return false;
    }
  }

  // Verificar si un año es modificable
  isYearEditable(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year === currentYear;
  }

  // Limpiar datos de una propiedad
  clearPropertyData(propertyId: string): void {
    const key = this.getStorageKey(propertyId);
    localStorage.removeItem(key);
  }
}

export const propertyDataService = new PropertyDataService();
