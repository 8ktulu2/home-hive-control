
import { toast } from 'sonner';

export function usePaymentValidation() {
  // Check if a month is in the future
  const isMonthInFuture = (month: number, year: number): boolean => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };
  
  // Validate notes for future month payments
  const validateFuturePayment = (notes?: string): boolean => {
    if (!notes || !notes.trim()) {
      toast.error('Las notas son obligatorias para pagos de meses futuros');
      return false;
    }
    return true;
  };
  
  return {
    isMonthInFuture,
    validateFuturePayment
  };
}
