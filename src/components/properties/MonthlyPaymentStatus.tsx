
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import PaymentConfirmationDialog from '@/components/property-detail/dialogs/PaymentConfirmationDialog';

interface MonthlyPaymentStatusProps {
  property: Property;
  onPaymentUpdate?: (month: number, year: number, isPaid: boolean, notes?: string) => void;
  compact?: boolean;
  historicalYear?: number;
}

const MonthlyPaymentStatus: React.FC<MonthlyPaymentStatusProps> = ({ 
  property, 
  onPaymentUpdate, 
  compact = false,
  historicalYear 
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const displayYear = historicalYear || currentYear;
  
  const [selectedPayment, setSelectedPayment] = useState<{ month: number; year: number; isPaid: boolean } | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<{[key: string]: boolean}>({});
  
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  
  // Initialize payment statuses ONLY for the display year
  useEffect(() => {
    console.log(`Inicializando pagos para año ${displayYear}, propiedad ${property.id}`);
    
    if (property && property.paymentHistory) {
      const statuses: {[key: string]: boolean} = {};
      
      // Initialize all months of the display year to false
      for (let month = 0; month < 12; month++) {
        const key = `${displayYear}-${month}`;
        statuses[key] = false;
      }
      
      // ONLY update with payment history for the specific display year
      const yearSpecificPayments = property.paymentHistory.filter(payment => payment.year === displayYear);
      
      console.log(`Pagos encontrados para año ${displayYear}:`, yearSpecificPayments);
      
      yearSpecificPayments.forEach(payment => {
        const key = `${payment.year}-${payment.month}`;
        statuses[key] = payment.isPaid;
        console.log(`Pago ${key}: ${payment.isPaid}`);
      });
      
      // For current year only, check rentPaid property
      if (displayYear === currentYear && !historicalYear) {
        const currentMonthKey = `${currentYear}-${currentMonth}`;
        if (statuses[currentMonthKey] === false) {
          statuses[currentMonthKey] = property.rentPaid || false;
        }
      }
      
      console.log(`Estados finales para año ${displayYear}:`, statuses);
      setPaymentStatuses(statuses);
    }
  }, [property, property.paymentHistory, displayYear, currentYear, currentMonth, historicalYear, property.rentPaid]);
  
  const getPaymentStatus = (month: number, year: number) => {
    // ONLY return payment status for the exact display year
    if (year !== displayYear) {
      return false;
    }
    
    const key = `${year}-${month}`;
    const status = paymentStatuses[key];
    
    console.log(`Estado del pago ${key}: ${status}`);
    
    return status || false;
  };
  
  const handlePaymentClick = (month: number, year: number) => {
    // ONLY allow clicks for the display year
    if (year !== displayYear) {
      return;
    }
    
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
      
      // Update local state immediately for the specific year only
      setPaymentStatuses(prev => ({
        ...prev,
        [`${selectedPayment.year}-${selectedPayment.month}`]: !selectedPayment.isPaid
      }));
    }
    setSelectedPayment(null);
  };

  const isFutureMonth = (month: number, year: number) => {
    if (historicalYear) return false;
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };

  // Generate ONLY months for the display year
  const generateMonths = () => {
    const result = [];
    
    for (let month = 0; month < 12; month++) {
      result.push({ month, year: displayYear });
    }
    
    return result;
  };
  
  const monthsToShow = generateMonths();
  const firstRowMonths = compact ? monthsToShow.slice(0, 6) : monthsToShow;
  const secondRowMonths = compact ? monthsToShow.slice(6, 12) : [];
  
  return (
    <div className="rounded-lg border mb-4">
      <div className="p-3 bg-muted/50 flex items-center justify-between border-b">
        <h3 className="text-sm font-medium">Estado de Pagos {displayYear}</h3>
        {historicalYear && (
          <span className="text-xs text-orange-600 font-medium">
            Modo Histórico
          </span>
        )}
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
