
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useFormatNumber } from '@/hooks/use-format-number';
import { Mortgage } from '@/types/property';

interface MortgageInfoProps {
  mortgage?: Mortgage | null;
  onMortgageChange: (mortgage: Mortgage | null) => void;
}

export const MortgageInfo = ({ mortgage, onMortgageChange }: MortgageInfoProps) => {
  const { formatCurrency } = useFormatNumber();
  
  const [endDate, setEndDate] = useState<Date | undefined>(
    mortgage?.endDate ? new Date(mortgage.endDate) : undefined
  );
  
  const handleChange = (field: string, value: any) => {
    const updatedMortgage = {
      ...(mortgage || { monthlyPayment: 0 }),
      [field]: value
    };
    onMortgageChange(updatedMortgage);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      handleChange('endDate', date.toISOString());
    } else {
      handleChange('endDate', undefined);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mortgage-lender">Entidad</Label>
          <Input
            id="mortgage-lender"
            value={mortgage?.lender || ''}
            onChange={(e) => handleChange('lender', e.target.value)}
            placeholder="Ej: BBVA, Santander"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mortgage-payment">Cuota mensual</Label>
          <Input
            id="mortgage-payment"
            type="number"
            value={mortgage?.monthlyPayment || ''}
            onChange={(e) => handleChange('monthlyPayment', Number(e.target.value))}
            placeholder="Ej: 450 €"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mortgage-total">Importe total</Label>
          <Input
            id="mortgage-total"
            type="number"
            value={mortgage?.totalAmount || ''}
            onChange={(e) => handleChange('totalAmount', Number(e.target.value))}
            placeholder="Ej: 180000 €"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mortgage-remaining">Importe pendiente</Label>
          <Input
            id="mortgage-remaining"
            type="number"
            value={mortgage?.remainingAmount || ''}
            onChange={(e) => handleChange('remainingAmount', Number(e.target.value))}
            placeholder="Ej: 120000 €"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mortgage-interest">Tipo de interés</Label>
          <Input
            id="mortgage-interest"
            type="number"
            step="0.01"
            value={mortgage?.interestRate || ''}
            onChange={(e) => handleChange('interestRate', Number(e.target.value))}
            placeholder="Ej: 2.5 %"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Fecha finalización</Label>
          <DatePicker
            date={endDate}
            onSelect={handleDateChange}
            placeholder="Selecciona fecha"
          />
        </div>
      </div>
      
      {mortgage && mortgage.monthlyPayment > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">Resumen anual:</p>
          <p>Pago anual: {formatCurrency(mortgage.monthlyPayment * 12)}</p>
          {mortgage.interestRate && (
            <p>Intereses aproximados: {formatCurrency((mortgage.monthlyPayment * 12) * 0.6)} (estimado)</p>
          )}
        </div>
      )}
    </div>
  );
};
