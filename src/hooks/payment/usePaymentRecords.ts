
import { Property, PaymentRecord } from '@/types/property';
import { toast } from 'sonner';

export function usePaymentRecords(
  property: Property | null, 
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>
) {
  // Add a new payment record
  const addPaymentRecord = (paymentData: Partial<PaymentRecord>) => {
    if (!property) return null;
    
    const newPayment: PaymentRecord = {
      id: `payment-${Date.now()}`,
      date: new Date().toISOString(),
      amount: property.rent || 0,
      type: 'rent', // Set a default value for the required field
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
      rentPaid: paymentData.month === new Date().getMonth() && 
                paymentData.year === new Date().getFullYear() 
                  ? true 
                  : property.rentPaid
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
      
      // Show success message
      if (newPayment.isPaid) {
        toast.success('Pago registrado con éxito');
      } else {
        toast.success('Estado de pago actualizado');
      }
    } catch (error) {
      console.error('Error saving payment record:', error);
      toast.error('Error al guardar el registro de pago');
    }
    
    return newPayment;
  };
  
  return {
    addPaymentRecord
  };
}
