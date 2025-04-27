
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
  
  const touchStartTime = useRef<number>(0);
  const touchTimer = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Start timer to detect long press
    touchStartTime.current = Date.now();
    touchTimer.current = window.setTimeout(() => {
      console.log('Long press detected on mobile');
      if (onLongPress) {
        onLongPress();
      }
    }, 800); // Slightly shorter timing for better user experience
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear the timer
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
    
    // Check if it was a short tap and we're in selection mode
    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration < 800 && isSelected !== undefined && onSelect) {
      // This was a short tap while we're in selection mode, toggle selection
      e.preventDefault(); // Prevent navigation
      onSelect(property.id);
    }
  };

  // Mouse events for non-mobile
  const handleMouseDown = () => {
    if (!isMobile) {
      touchStartTime.current = Date.now();
      touchTimer.current = window.setTimeout(() => {
        console.log('Long press detected on desktop');
        if (onLongPress) {
          onLongPress();
        }
      }, 800);
    }
  };

  const handleMouseUp = () => {
    if (!isMobile && touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };
  
  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current);
      }
    };
  }, []);

  return (
    <Link 
      to={isSelected ? "#" : `/property/${property.id}`}
      onClick={(e) => {
        if (isSelected !== undefined) {
          const pressTimeDiff = Date.now() - touchStartTime.current;
          if (pressTimeDiff < 800 && onSelect) {
            // Short tap/click in selection mode
            e.preventDefault();
            onSelect(property.id);
          }
        }
      }}
      className={cn(
        "group block w-full transition-all duration-200 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        if (touchTimer.current) {
          clearTimeout(touchTimer.current);
          touchTimer.current = null;
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
                onPaymentUpdate(property.id, currentMonth, currentYear, !property.rentPaid);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                property.rentPaid 
                  ? "bg-success/20 text-success hover:bg-success/30" 
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              )}
            >
              <span>{property.rentPaid ? 'Pagado' : 'Pendiente'}</span>
            </div>
            
            <p className="text-xs text-muted-foreground capitalize">
              {monthName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyButton;
