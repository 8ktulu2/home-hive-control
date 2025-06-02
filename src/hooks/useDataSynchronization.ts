
import { useEffect } from 'react';
import { Property } from '@/types/property';
import { useHistoricalStorage, HistoricalRecord } from './useHistoricalStorage';
import { toast } from 'sonner';

export const useDataSynchronization = () => {
  const { records, saveRecord, getRecord } = useHistoricalStorage();

  // Función para sincronizar un pago de propiedad con el histórico
  const syncPaymentToHistorical = (
    propertyId: string,
    year: number,
    month: number,
    isPaid: boolean,
    rentAmount: number
  ) => {
    try {
      // Solo sincronizar si el año no es el actual (datos históricos)
      const currentYear = new Date().getFullYear();
      if (year >= currentYear) {
        console.log(`No sincronizando año actual ${year} al histórico`);
        return;
      }

      // Obtener el registro histórico existente para este mes
      const existingRecord = getRecord(propertyId, year, month);
      
      if (existingRecord) {
        // Actualizar el registro existente manteniendo otros gastos
        const updatedCategories = {
          ...existingRecord.categorias,
          alquiler: isPaid ? rentAmount : 0
        };
        
        saveRecord(propertyId, year, month, updatedCategories);
      } else {
        // Crear nuevo registro si no existe
        const newCategories = {
          alquiler: isPaid ? rentAmount : 0,
          hipoteca: 0,
          comunidad: 0,
          ibi: 0,
          seguroVida: 0,
          seguroHogar: 0,
          compras: 0,
          averias: 0,
          suministros: 0
        };
        
        saveRecord(propertyId, year, month, newCategories);
      }
      
      console.log(`Sincronizado pago de propiedad ${propertyId} para ${year}/${month + 1}: ${isPaid}`);
    } catch (error) {
      console.error('Error sincronizando pago con histórico:', error);
      toast.error('Error al sincronizar datos');
    }
  };

  // Función para sincronizar datos históricos con el estado de propiedades
  const syncHistoricalToProperty = (propertyId: string, year: number, month: number) => {
    try {
      // Solo sincronizar si el año no es el actual
      const currentYear = new Date().getFullYear();
      if (year >= currentYear) {
        console.log(`No sincronizando año actual ${year} desde histórico`);
        return;
      }

      const record = getRecord(propertyId, year, month);
      
      if (record) {
        // Obtener propiedades del localStorage
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties: Property[] = JSON.parse(savedProperties);
          const propertyIndex = properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            const property = properties[propertyIndex];
            
            // Actualizar el historial de pagos de la propiedad
            const paymentHistory = property.paymentHistory || [];
            const existingPaymentIndex = paymentHistory.findIndex(
              p => p.month === month && p.year === year
            );
            
            const isPaid = record.categorias.alquiler > 0;
            
            if (existingPaymentIndex >= 0) {
              // Actualizar pago existente
              paymentHistory[existingPaymentIndex] = {
                ...paymentHistory[existingPaymentIndex],
                isPaid,
                amount: record.categorias.alquiler
              };
            } else {
              // Crear nuevo registro de pago
              const newPayment = {
                id: `payment-${Date.now()}`,
                date: new Date(year, month, 1).toISOString(),
                amount: record.categorias.alquiler,
                type: 'rent' as const,
                isPaid,
                month,
                year,
                notes: ''
              };
              paymentHistory.push(newPayment);
            }
            
            // Guardar cambios
            properties[propertyIndex] = {
              ...property,
              paymentHistory
            };
            
            localStorage.setItem('properties', JSON.stringify(properties));
            console.log(`Sincronizado histórico a propiedad ${propertyId} para ${year}/${month + 1}`);
          }
        }
      }
    } catch (error) {
      console.error('Error sincronizando histórico con propiedad:', error);
      toast.error('Error al sincronizar datos');
    }
  };

  // Función para migrar datos del año actual al histórico
  const migrateCurrentYearToHistorical = (year: number) => {
    try {
      const savedProperties = localStorage.getItem('properties');
      if (!savedProperties) return false;

      const properties: Property[] = JSON.parse(savedProperties);
      let migratedCount = 0;

      properties.forEach(property => {
        if (property.paymentHistory) {
          property.paymentHistory.forEach(payment => {
            if (payment.year === year) {
              // Crear registro histórico para este pago
              const categories = {
                alquiler: payment.isPaid ? payment.amount : 0,
                hipoteca: 0,
                comunidad: 0,
                ibi: 0,
                seguroVida: 0,
                seguroHogar: 0,
                compras: 0,
                averias: 0,
                suministros: 0
              };

              const success = saveRecord(property.id, payment.year, payment.month, categories);
              if (success) {
                migratedCount++;
              }
            }
          });
        }
      });

      if (migratedCount > 0) {
        toast.success(`Se migraron ${migratedCount} registros del año ${year} al histórico`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error migrando datos al histórico:', error);
      toast.error('Error al migrar datos al histórico');
      return false;
    }
  };

  return {
    syncPaymentToHistorical,
    syncHistoricalToProperty,
    migrateCurrentYearToHistorical
  };
};
