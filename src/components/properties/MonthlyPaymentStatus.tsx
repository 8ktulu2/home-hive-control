
import React, { useState, useEffect } from 'react';
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
  const [paymentStatuses, setPaymentStatuses] = useState<{[key: string]: boolean}>({});
  
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  
  // Initialize payment statuses when property changes
  useEffect(() => {
    if (property && property.paymentHistory) {
      const statuses: {[key: string]: boolean} = {};
      
      // First set default values for all months
      for (let month = 0; month < 12; month++) {
        const key = `${currentYear}-${month}`;
        statuses[key] = false;
      }
      
      // Then update with actual payment history
      property.paymentHistory.forEach(payment => {
        if (payment.year === currentYear) {
          const key = `${payment.year}-${payment.month}`;
          statuses[key] = payment.isPaid;
        }
      });
      
      // Set current month status from property.rentPaid if no record exists
      const currentMonthKey = `${currentYear}-${currentMonth}`;
      if (statuses[currentMonthKey] === undefined) {
        statuses[currentMonthKey] = property.rentPaid;
      }
      
      setPaymentStatuses(statuses);
    }
  }, [property, property.paymentHistory, currentYear, currentMonth]);
  
  const getPaymentStatus = (month: number, year: number) => {
    const key = `${year}-${month}`;
    if (paymentStatuses[key] !== undefined) {
      return paymentStatuses[key];
    }
    
    // Fallback to checking payment history directly
    if (property.paymentHistory && property.paymentHistory.length > 0) {
      const payment = property.paymentHistory.find(
        p => p.month === month && p.year === year
      );
      if (payment) {
        return payment.isPaid;
      }
    }
    
    // For current month, fall back to property.rentPaid
    if (month === currentMonth && year === currentYear) {
      return property.rentPaid;
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
      
      // Update local state immediately for better UX
      setPaymentStatuses(prev => ({
        ...prev,
        [`${selectedPayment.year}-${selectedPayment.month}`]: !selectedPayment.isPaid
      }));
    }
    setSelectedPayment(null);
  };

  // Determine if selected month is in the future
  const isFutureMonth = (month: number, year: number) => {
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };

  // Generate all months of the current year
  const generateMonths = () => {
    const result = [];
    const year = currentYear;
    
    // Add all months of the current year (January to December)
    for (let month = 0; month < 12; month++) {
      result.push({ month, year });
    }
    
    return result;
  };
  
  const monthsToShow = generateMonths();
  
  // Split into two rows of 6 months if compact is true
  const firstRowMonths = compact ? monthsToShow.slice(0, 6) : monthsToShow;
  const secondRowMonths = compact ? monthsToShow.slice(6, 12) : [];
  
  return (
    <div className="rounded-lg border mb-4">
      <div className="p-3 bg-muted/50 flex items-center justify-between border-b">
        <h3 className="text-sm font-medium">Estado de Pagos {currentYear}</h3>
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
