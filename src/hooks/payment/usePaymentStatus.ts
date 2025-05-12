
import { useState } from 'react';
import { Property, PaymentRecord } from '@/types/property';

export function usePaymentStatus(property: Property | null) {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  
  // Find current month payment from payment history
  const getCurrentMonthPayment = (): PaymentRecord | null => {
    if (!property || !property.paymentHistory) return null;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return property.paymentHistory.find(payment => 
      payment.month === currentMonth && 
      payment.year === currentYear
    ) || null;
  };
  
  return {
    isUpdatingPayment,
    setIsUpdatingPayment,
    getCurrentMonthPayment
  };
}
