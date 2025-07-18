
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyButtonProps {
  property: Property;
  onPaymentUpdate: (propertyId: string, month: number, year: number, isPaid: boolean) => void;
  onLongPress?: () => void;
  onSelect?: (propertyId: string) => void;
  isSelected?: boolean;
}

const PropertyButton = ({ property, onPaymentUpdate, onLongPress, onSelect, isSelected }: PropertyButtonProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTime = useRef<number>(0);
  const isMobile = useIsMobile();
  const [isLongPress, setIsLongPress] = useState(false);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleTouchStart = () => {
    touchStartTime.current = Date.now();
    
    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    // Set a new timeout for long press detection - reduce to 500ms for better responsiveness
    touchTimeoutRef.current = setTimeout(() => {
      console.log('Long press detected for property:', property.id);
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress();
      }
    }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const touchDuration = Date.now() - touchStartTime.current;
    
    // Clear the timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    
    // If we're already in selection mode or this was a long press
    if (isSelected !== undefined && onSelect) {
      // Always prevent default to handle selection properly
      e.preventDefault();
      // Toggle selection on click/tap when in selection mode
      onSelect(property.id);
    }
    
    setIsLongPress(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Get actual payment status from property payment history
  const getActualPaymentStatus = () => {
    if (property.paymentHistory && property.paymentHistory.length > 0) {
      const currentMonthPayment = property.paymentHistory.find(
        payment => payment.month === currentMonth && payment.year === currentYear
      );
      return currentMonthPayment ? currentMonthPayment.isPaid : property.rentPaid;
    }
    return property.rentPaid;
  };

  const actualRentPaid = getActualPaymentStatus();

  return (
    <Link 
      to={isSelected !== undefined && onSelect ? "#" : `/property/${property.id}`}
      onClick={(e) => {
        if (isSelected !== undefined && onSelect) {
          e.preventDefault();
          onSelect(property.id);
        }
      }}
      className={cn(
        "group block w-full transition-all duration-200 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd as any}
      onMouseDown={isMobile ? undefined : handleTouchStart}
      onMouseUp={isMobile ? undefined : handleTouchEnd as any}
      onMouseLeave={() => {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
          touchTimeoutRef.current = null;
        }
      }}
      data-selected={isSelected ? "true" : "false"}
    >
      <div className="relative p-4 rounded-xl border bg-gradient-to-br from-background to-secondary/20 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold truncate">{property.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{property.address}</p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="space-x-4">
              <span>
                <span className="text-muted-foreground">Alquiler:</span>
                <span className="ml-2 font-semibold">{formatCurrency(property.rent)}</span>
              </span>
              <span>
                <span className="text-muted-foreground">Gastos:</span>
                <span className="ml-2 font-semibold text-destructive">
                  -{formatCurrency(property.expenses)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPaymentUpdate(property.id, currentMonth, currentYear, !actualRentPaid);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                actualRentPaid 
                  ? "bg-success/20 text-success hover:bg-success/30" 
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              )}
            >
              <span>{actualRentPaid ? 'Pagado' : 'Pendiente'}</span>
            </div>
            
            <p className="text-xs text-muted-foreground capitalize">
              {monthName}
            </p>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
            ✓
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyButton;
