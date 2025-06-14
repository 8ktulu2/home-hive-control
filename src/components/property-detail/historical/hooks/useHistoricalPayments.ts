
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { toast } from 'sonner';

export const useHistoricalPayments = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const { getRecord, saveRecord, getRecordsByPropertyYear } = useHistoricalStorage();

  // ISOLATED payment update - affects ONLY the historical year
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
    console.log(`Updating historical payment: ${month}/${updateYear} - isPaid: ${isPaid}`);

    // Get current record or create default categories
    const currentRecord = getRecord(property.id, updateYear, month);
    const categorias = currentRecord?.categorias || {
      alquiler: isPaid ? (property.rent || 0) : 0,
      hipoteca: property.mortgage?.monthlyPayment || 0,
      comunidad: property.communityFee || 0,
      ibi: (property.ibi || 0) / 12,
      seguroVida: (property.lifeInsurance?.cost || 0) / 12,
      seguroHogar: (property.homeInsurance?.cost || 0) / 12,
      compras: 0,
      averias: 0,
      suministros: 0
    };

    // Update rent payment
    categorias.alquiler = isPaid ? (property.rent || 0) : 0;

    const success = saveRecord(property.id, updateYear, month, categorias);
    
    if (success && historicalProperty) {
      // Update historical property payment history
      const updatedPaymentHistory = [...(historicalProperty.paymentHistory || [])];
      const existingIndex = updatedPaymentHistory.findIndex(p => p.month === month && p.year === updateYear);
      
      if (existingIndex >= 0) {
        updatedPaymentHistory[existingIndex] = {
          ...updatedPaymentHistory[existingIndex],
          isPaid,
          notes,
          amount: isPaid ? property.rent || 0 : 0
        };
      } else {
        updatedPaymentHistory.push({
          id: `hist-payment-${Date.now()}`,
          date: new Date(updateYear, month, 1).toISOString(),
          amount: isPaid ? property.rent || 0 : 0,
          type: 'rent',
          isPaid,
          month,
          year: updateYear,
          description: 'Alquiler',
          notes
        });
      }
      
      setHistoricalProperty({
        ...historicalProperty,
        paymentHistory: updatedPaymentHistory,
        rentPaid: isPaid && month === new Date().getMonth()
      });

      toast.success(`Pago histórico ${isPaid ? 'confirmado' : 'cancelado'} para ${month + 1}/${updateYear}`);
    } else {
      toast.error('Error al actualizar el pago histórico');
    }
  };

  // Handle rent paid change for historical property
  const handleRentPaidChange = (paid: boolean) => {
    const currentMonth = new Date().getMonth();
    handleHistoricalPaymentUpdate(currentMonth, year, paid);
  };

  return {
    handleHistoricalPaymentUpdate,
    handleRentPaidChange
  };
};
