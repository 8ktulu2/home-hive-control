
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
                date: new Date().toISOString(),
                amount: record.categorias.alquiler,
                type: 'rent' as const,
                isPaid,
                month,
                year,
                notes: ''
              };
              paymentHistory.push(newPayment);
            }
            
            // Actualizar rentPaid si es el mes actual
            const currentDate = new Date();
            if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
              property.rentPaid = isPaid;
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

  return {
    syncPaymentToHistorical,
    syncHistoricalToProperty
  };
};
