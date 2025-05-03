
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
    
    setProperty({
      ...property,
      paymentHistory: updatedHistory,
      rentPaid: true
    });
    
    return newPayment;
  };
  
  // Update rent paid status
  const updateRentPaidStatus = async (status: boolean) => {
    if (!property) return;
    
    setIsUpdatingPayment(true);
    
    try {
      const currentPayment = getCurrentMonthPayment();
      
      if (currentPayment) {
        // Update existing payment record
        const updatedHistory = property.paymentHistory?.map(payment => 
          payment.id === currentPayment.id 
            ? { ...payment, isPaid: status } 
            : payment
        );
        
        setProperty({
          ...property,
          paymentHistory: updatedHistory,
          rentPaid: status
        });
      } else {
        // Create new payment record for current month
        addPaymentRecord({ 
          isPaid: status,
          month: new Date().getMonth(),
          year: new Date().getFullYear()
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
  
  return {
    isUpdatingPayment,
    getCurrentMonthPayment,
    addPaymentRecord,
    updateRentPaidStatus
  };
}
