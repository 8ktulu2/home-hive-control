
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { toast } from 'sonner';

export const useHistoricalPayments = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const { getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();

  // ISOLATED payment update - affects ONLY the historical year
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
    if (updateYear !== year) {
      console.warn(`Payment update attempted for year ${updateYear} but we're in historical year ${year}`);
      return;
    }

    console.log(`Updating historical payment: ${month}/${updateYear} - isPaid: ${isPaid}`);

    const currentRecord = getRecordsByPropertyYear(property.id, year).find(r => r.mes === month);
    const categorias = currentRecord?.categorias || {
      alquiler: property.rent || 0,
      hipoteca: property.mortgage?.monthlyPayment || 0,
      comunidad: property.communityFee || 0,
      ibi: (property.ibi || 0) / 12,
      seguroVida: (property.lifeInsurance?.cost || 0) / 12,
      seguroHogar: (property.homeInsurance?.cost || 0) / 12,
      compras: 0,
      averias: 0,
      suministros: 0
    };

    if (isPaid) {
      categorias.alquiler = property.rent || 0;
    } else {
      categorias.alquiler = 0;
    }

    const saved = saveRecord(property.id, year, month, categorias);
    
    if (saved && historicalProperty) {
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
        paymentHistory: updatedPaymentHistory
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
