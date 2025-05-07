
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useFormatNumber } from '@/hooks/use-format-number';
import { Mortgage } from '@/types/property';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // Estimar intereses anuales si cambia la cuota mensual o el tipo de interés
  const estimateAnnualInterest = () => {
    if (mortgage?.monthlyPayment && mortgage?.interestRate) {
      // Esta es una estimación simplificada
      const estimatedInterest = (mortgage.monthlyPayment * 12) * (mortgage.interestRate / 100);
      handleChange('annualInterest', Math.round(estimatedInterest));
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
            onChange={(e) => {
              const value = Number(e.target.value);
              handleChange('monthlyPayment', value);
              // Actualizar automáticamente la estimación de intereses
              setTimeout(estimateAnnualInterest, 100);
            }}
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
            onChange={(e) => {
              const value = Number(e.target.value);
              handleChange('interestRate', value);
              // Actualizar automáticamente la estimación de intereses
              setTimeout(estimateAnnualInterest, 100);
            }}
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
      
      <div className="space-y-2 border-t pt-4 mt-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="annual-interest">
            Intereses anuales (deducibles)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Introduce la parte de intereses anuales que pagas en tu hipoteca. Este valor es deducible en la declaración de la renta. Consulta tu recibo anual de hipoteca para obtener esta información exacta.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="annual-interest"
          type="number"
          value={mortgage?.annualInterest || ''}
          onChange={(e) => handleChange('annualInterest', Number(e.target.value))}
          placeholder="Ej: 3600 €"
        />
        <p className="text-xs text-muted-foreground mt-1">Importe deducible en la declaración de la renta</p>
      </div>
      
      {mortgage && mortgage.monthlyPayment > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">Resumen anual:</p>
          <p>Pago anual: {formatCurrency(mortgage.monthlyPayment * 12)}</p>
          {mortgage.annualInterest ? (
            <>
              <p>Intereses deducibles: {formatCurrency(mortgage.annualInterest)}</p>
              <p>Capital amortizado (no deducible): {formatCurrency((mortgage.monthlyPayment * 12) - mortgage.annualInterest)}</p>
            </>
          ) : mortgage.interestRate ? (
            <p>Intereses estimados: {formatCurrency((mortgage.monthlyPayment * 12) * (mortgage.interestRate / 100))} (basado en tipo de interés)</p>
          ) : (
            <p>Introduce el tipo de interés o los intereses anuales para calcular la parte deducible</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MortgageInfo;
