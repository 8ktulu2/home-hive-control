
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface PropertyButtonProps {
  property: Property;
  onPaymentUpdate: (propertyId: string, month: number, year: number, isPaid: boolean) => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

const PropertyButton = ({ property, onPaymentUpdate, onLongPress, isSelected }: PropertyButtonProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleMouseDown = () => {
    if (onLongPress) {
      const timer = window.setTimeout(() => {
        onLongPress();
      }, 1000);
      setPressTimer(timer);
    }
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);

  return (
    <Link 
      to={`/property/${property.id}`}
      className={cn(
        "group block w-full transition-all duration-200 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
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
