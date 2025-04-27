
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PropertyButtonProps {
  property: Property;
  onPaymentUpdate: (propertyId: string, month: number, year: number, isPaid: boolean) => void;
}

const PropertyButton = ({ property, onPaymentUpdate }: PropertyButtonProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Link 
      to={`/property/${property.id}`}
      className="group block w-full transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative p-4 rounded-xl border bg-gradient-to-br from-background to-secondary/20 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Alquiler:</span>
                <span className="ml-2 font-semibold">{formatCurrency(property.rent)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Gastos:</span>
                <span className="ml-2 font-semibold text-destructive">
                  -{formatCurrency(property.expenses)}
                </span>
              </div>
            </div>
          </div>

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
            {property.rentPaid ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Pagado</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Pendiente</span>
              </>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-2 right-4">
          <p className="text-xs text-muted-foreground capitalize">
            {monthName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyButton;
