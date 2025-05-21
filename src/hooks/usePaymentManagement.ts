
import { useState } from 'react';
import { Property, PaymentRecord } from '@/types/property';
import { toast } from 'sonner';

export function usePaymentManagement(property: Property | null, setProperty: React.Dispatch<React.SetStateAction<Property | null>>) {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  
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
  
  // Add a new payment record
  const addPaymentRecord = (paymentData: Partial<PaymentRecord>) => {
    if (!property) return null;
    
    const newPayment = {
      id: `payment-${Date.now()}`,
      date: new Date().toISOString(),
      amount: property.rent || 0,
      type: 'rent' as const,
      isPaid: true,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      notes: paymentData.notes || '',
      ...paymentData
    };
    
    const updatedHistory = property.paymentHistory 
      ? [...property.paymentHistory, newPayment] 
      : [newPayment];
    
    const updatedProperty = {
      ...property,
      paymentHistory: updatedHistory,
      rentPaid: true
    };
    
    setProperty(updatedProperty);
    savePropertyToStorage(updatedProperty);
    
    return newPayment;
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
          amount: property.rent || 0,
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
    
    setIsUpdatingPayment(true);
    
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentPayment = getCurrentMonthPayment();
      
      let updatedProperty: Property;
      
      if (currentPayment) {
        // Update existing payment record
        const updatedHistory = property.paymentHistory?.map(payment => 
          payment.id === currentPayment.id 
            ? { 
                ...payment, 
                isPaid: status,
                // Update date if marking as paid
                ...(status ? { date: new Date().toISOString() } : {})
              } 
            : payment
        );
        
        updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          rentPaid: status
        };
      } else {
        // Create new payment record for current month
        const newPayment = {
          id: `payment-${Date.now()}`,
          date: status ? new Date().toISOString() : new Date(currentYear, currentMonth, 1).toISOString(),
          amount: property.rent || 0,
          type: 'rent' as const,
          isPaid: status,
          month: currentMonth,
          year: currentYear,
          notes: '',
        };
        
        const updatedHistory = property.paymentHistory 
          ? [...property.paymentHistory, newPayment] 
          : [newPayment];
        
        updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          rentPaid: status
        };
      }
      
      setProperty(updatedProperty);
      savePropertyToStorage(updatedProperty);
      
      toast.success(status ? 'Pago registrado con éxito' : 'Estado de pago actualizado');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error al actualizar el estado de pago');
    } finally {
      setIsUpdatingPayment(false);
    }
  };
  
  // Add a handler to make the naming consistent with the usage in PropertyDetail.tsx
  const handleRentPaidChange = updateRentPaidStatus;
  
  return {
    isUpdatingPayment,
    getCurrentMonthPayment,
    addPaymentRecord,
    updateRentPaidStatus,
    handlePaymentUpdate,
    handleRentPaidChange
  };
}
