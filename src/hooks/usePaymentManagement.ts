
import { Property, PaymentRecord } from '@/types/property';

export function usePaymentManagement(
  property: Property | null,
  setProperty: (property: Property | null) => void
) {
  const handlePaymentUpdate = (month: number, year: number, isPaid: boolean, notes?: string) => {
    if (property) {
      const existingPayments = property.paymentHistory || [];
      const existingPaymentIndex = existingPayments.findIndex(p => p.month === month && p.year === year);
      
      let updatedPayments: PaymentRecord[];
      
      if (existingPaymentIndex >= 0) {
        updatedPayments = [...existingPayments];
        updatedPayments[existingPaymentIndex] = {
          ...updatedPayments[existingPaymentIndex],
          isPaid,
          date: new Date().toISOString(),
          notes: notes || updatedPayments[existingPaymentIndex].notes
        };
      } else {
        const newPayment: PaymentRecord = {
          id: `payment-${Date.now()}`,
          date: new Date().toISOString(),
          amount: property.rent,
          isPaid,
          month,
          year,
          notes
        };
        updatedPayments = [...existingPayments, newPayment];
      }
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const isCurrentMonth = month === currentMonth && year === currentYear;
      
      setProperty({
        ...property,
        paymentHistory: updatedPayments,
        rentPaid: isCurrentMonth ? isPaid : property.rentPaid
      });
    }
  };

  const handleRentPaidChange = (isPaid: boolean) => {
    if (property) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      handlePaymentUpdate(currentMonth, currentYear, isPaid);
    }
  };

  return {
    handlePaymentUpdate,
    handleRentPaidChange,
  };
}
