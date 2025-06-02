
import { useState } from 'react';
import { Property, PaymentRecord } from '@/types/property';
import { toast } from 'sonner';
import { useDataSynchronization } from './useDataSynchronization';

export function usePaymentManagement(property: Property | null, setProperty: React.Dispatch<React.SetStateAction<Property | null>>) {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const { syncPaymentToHistorical } = useDataSynchronization();
  
  // Find current month payment from payment history
  const getCurrentMonthPayment = () => {
    if (!property || !property.paymentHistory) return null;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return property.paymentHistory.find(payment => 
      payment.month === currentMonth && 
      payment.year === currentYear
    );
  };
  
  // Save property to localStorage
  const savePropertyToStorage = (updatedProperty: Property) => {
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === updatedProperty.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    } catch (error) {
      console.error('Error saving property payment update to localStorage:', error);
    }
  };
  
  // Handle payment update for a specific month and year
  const handlePaymentUpdate = (month: number, year: number, isPaid: boolean, notes?: string) => {
    if (!property) return;
    
    setIsUpdatingPayment(true);
    
    try {
      // Check if a payment record already exists for this month/year
      const existingPayment = property.paymentHistory?.find(
        p => p.month === month && p.year === year
      );
      
      let updatedProperty: Property;
      
      if (existingPayment) {
        // Update existing payment
        const updatedHistory = property.paymentHistory?.map(payment => 
          payment.month === month && payment.year === year
            ? { 
                ...payment, 
                isPaid, 
                notes: notes || payment.notes,
                amount: isPaid ? property.rent : 0,
                // Update payment date only if marking as paid
                ...(isPaid ? { date: new Date().toISOString() } : {})
              }
            : payment
        );
        
        updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          // Update rentPaid if this is the current month
          rentPaid: month === new Date().getMonth() && year === new Date().getFullYear() ? isPaid : property.rentPaid
        };
      } else {
        // Create new payment record
        const newPayment = {
          id: `payment-${Date.now()}`,
          date: isPaid ? new Date().toISOString() : new Date(year, month, 1).toISOString(),
          amount: isPaid ? property.rent : 0,
          type: 'rent' as const,
          isPaid,
          month,
          year,
          notes: notes || '',
        };
        
        const updatedHistory = property.paymentHistory 
          ? [...property.paymentHistory, newPayment] 
          : [newPayment];
        
        updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          // Update rentPaid if this is the current month
          rentPaid: month === new Date().getMonth() && year === new Date().getFullYear() ? isPaid : property.rentPaid
        };
      }
      
      setProperty(updatedProperty);
      savePropertyToStorage(updatedProperty);
      
      // Sincronizar con histórico
      syncPaymentToHistorical(property.id, year, month, isPaid, property.rent);
      
      toast.success(isPaid ? 'Pago registrado con éxito' : 'Estado de pago actualizado');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Error al actualizar el pago');
    } finally {
      setIsUpdatingPayment(false);
    }
  };
  
  // Update rent paid status for current month
  const updateRentPaidStatus = async (status: boolean) => {
    if (!property) return;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    handlePaymentUpdate(currentMonth, currentYear, status);
  };
  
  // Add a handler to make the naming consistent with the usage in PropertyDetail.tsx
  const handleRentPaidChange = updateRentPaidStatus;
  
  return {
    isUpdatingPayment,
    getCurrentMonthPayment,
    updateRentPaidStatus,
    handlePaymentUpdate,
    handleRentPaidChange
  };
}
