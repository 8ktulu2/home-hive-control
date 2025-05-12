
import { Property, PaymentRecord } from '@/types/property';
import { usePaymentStatus } from './usePaymentStatus';
import { usePaymentRecords } from './usePaymentRecords';
import { usePaymentValidation } from './usePaymentValidation';

export function usePaymentManagement(property: Property | null, setProperty: React.Dispatch<React.SetStateAction<Property | null>>) {
  const { isUpdatingPayment, getCurrentMonthPayment } = usePaymentStatus(property);
  const { addPaymentRecord } = usePaymentRecords(property, setProperty);
  const { isMonthInFuture, validateFuturePayment } = usePaymentValidation();
  
  // Handle payment update for a specific month and year
  const handlePaymentUpdate = (month: number, year: number, isPaid: boolean, notes?: string) => {
    if (!property) return;
    
    // Check if this is a future month and validate notes if required
    if (isMonthInFuture(month, year) && isPaid) {
      const isValid = validateFuturePayment(notes);
      if (!isValid) return;
    }
    
    // Check if a payment record already exists for this month/year
    const existingPayment = property.paymentHistory?.find(
      p => p.month === month && p.year === year
    );
    
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
      updateLocalStorage(updatedProperty);
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
  };
  
  // Update rent paid status for current month
  const updateRentPaidStatus = async (status: boolean) => {
    if (!property) return;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
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
      updateLocalStorage(updatedProperty);
    } else {
      // Create new payment record for current month
      addPaymentRecord({ 
        isPaid: status,
        month: currentMonth,
        year: currentYear,
        date: status ? new Date().toISOString() : undefined
      });
    }
  };
  
  // Helper function to update localStorage
  const updateLocalStorage = (updatedProperty: Property) => {
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property?.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    } catch (error) {
      console.error('Error updating payment in localStorage:', error);
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
