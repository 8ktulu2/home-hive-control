
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import PaymentConfirmationDialog from '@/components/property-detail/dialogs/PaymentConfirmationDialog';

interface MonthlyPaymentStatusProps {
  property: Property;
  onPaymentUpdate?: (month: number, year: number, isPaid: boolean, notes?: string) => void;
  compact?: boolean;
}

const MonthlyPaymentStatus: React.FC<MonthlyPaymentStatusProps> = ({ property, onPaymentUpdate, compact = false }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const [selectedPayment, setSelectedPayment] = useState<{ month: number; year: number; isPaid: boolean } | null>(null);
  
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  
  const getPaymentStatus = (month: number, year: number) => {
    if (property.paymentHistory && property.paymentHistory.length > 0) {
      const payment = property.paymentHistory.find(
        p => p.month === month && p.year === year
      );
      return payment?.isPaid || false;
    }
    return false;
  };
  
  const handlePaymentClick = (month: number, year: number) => {
    const isPaid = getPaymentStatus(month, year);
    setSelectedPayment({ month, year, isPaid });
  };
  
  const handleConfirmPayment = (notes: string, paymentDate: Date) => {
    if (selectedPayment && onPaymentUpdate) {
      onPaymentUpdate(
        selectedPayment.month, 
        selectedPayment.year, 
        !selectedPayment.isPaid,
        notes
      );
    }
    setSelectedPayment(null);
  };

  // Determine if selected month is in the future
  const isFutureMonth = (month: number, year: number) => {
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };

  // Generar los últimos 12 meses desde el mes actual hacia atrás
  const generateMonths = () => {
    const result = [];
    let month = currentMonth;
    let year = currentYear;
    
    for (let i = 0; i < 12; i++) {
      result.push({ month, year });
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
    }
    
    return result;
  };
  
  const monthsToShow = generateMonths();
  
  // Dividir en dos filas de 6 meses si compact es true
  const firstRowMonths = compact ? monthsToShow.slice(0, 6) : monthsToShow;
  const secondRowMonths = compact ? monthsToShow.slice(6, 12) : [];
  
  return (
    <div className="rounded-lg border mb-4">
      <div className="p-3 bg-muted/50 flex items-center justify-between border-b">
        <h3 className="text-sm font-medium">Estado de Pagos</h3>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1">
          {firstRowMonths.map(({ month, year }) => {
            const isPaid = getPaymentStatus(month, year);
            return (
              <button
                key={`${year}-${month}`}
                onClick={() => handlePaymentClick(month, year)}
                className={cn(
                  "flex-1 min-w-[40px] h-9 flex flex-col items-center justify-center rounded text-xs font-medium transition-colors",
                  isPaid
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                )}
              >
                <span>{months[month]}</span>
                {!compact && <span className="text-[10px]">{year}</span>}
              </button>
            );
          })}
        </div>
        
        {compact && secondRowMonths.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {secondRowMonths.map(({ month, year }) => {
              const isPaid = getPaymentStatus(month, year);
              return (
                <button
                  key={`${year}-${month}`}
                  onClick={() => handlePaymentClick(month, year)}
                  className={cn(
                    "flex-1 min-w-[40px] h-9 flex flex-col items-center justify-center rounded text-xs font-medium transition-colors",
                    isPaid
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  )}
                >
                  <span>{months[month]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Confirmation Dialog */}
      {selectedPayment && (
        <PaymentConfirmationDialog
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
          onConfirm={handleConfirmPayment}
          month={selectedPayment.month}
          year={selectedPayment.year}
          isPaid={selectedPayment.isPaid}
          isFutureMonth={isFutureMonth(selectedPayment.month, selectedPayment.year)}
        />
      )}
    </div>
  );
};

export default MonthlyPaymentStatus;
