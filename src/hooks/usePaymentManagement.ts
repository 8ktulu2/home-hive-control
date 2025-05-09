
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
      type: 'rent' as const, // Set a default value for the required field
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
      rentPaid: paymentData.month === new Date().getMonth() && paymentData.year === new Date().getFullYear() ? true : property.rentPaid
    };
    
    setProperty(updatedProperty);
    
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    } catch (error) {
      console.error('Error saving payment record:', error);
    }
    
    return newPayment;
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
      
      // Check if this is a future month
      const isFutureMonth = isMonthInFuture(month, year);
      
      // Validate notes for future months
      if (isFutureMonth && isPaid && (!notes || !notes.trim())) {
        toast.error('Las notas son obligatorias para pagos de meses futuros');
        setIsUpdatingPayment(false);
        return;
      }
      
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
        
        const updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          // Update rentPaid if this is the current month
          rentPaid: month === new Date().getMonth() && year === new Date().getFullYear() ? isPaid : property.rentPaid
        };
        
        setProperty(updatedProperty);
        
        // Save to localStorage
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      } else {
        // Create new payment record
        addPaymentRecord({
          month,
          year,
          isPaid,
          notes,
          date: isPaid ? new Date().toISOString() : undefined
        });
      }
      
      toast.success(isPaid ? 'Pago registrado con éxito' : 'Estado de pago actualizado');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Error al actualizar el pago');
    } finally {
      setIsUpdatingPayment(false);
    }
  };
  
  // Check if a month is in the future
  const isMonthInFuture = (month: number, year: number): boolean => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };
  
  // Update rent paid status for current month
  const updateRentPaidStatus = async (status: boolean) => {
    if (!property) return;
    
    setIsUpdatingPayment(true);
    
    try {
      const currentPayment = getCurrentMonthPayment();
      
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
        
        const updatedProperty = {
          ...property,
          paymentHistory: updatedHistory,
          rentPaid: status
        };
        
        setProperty(updatedProperty);
        
        // Save to localStorage
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      } else {
        // Create new payment record for current month
        addPaymentRecord({ 
          isPaid: status,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          date: status ? new Date().toISOString() : undefined
        });
      }
      
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
    handleRentPaidChange,
    isMonthInFuture
  };
}
