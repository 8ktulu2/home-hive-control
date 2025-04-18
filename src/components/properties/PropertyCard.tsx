
import { useState } from 'react';
import { CheckCircle, XCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Property } from '@/types/property';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  onPaymentUpdate: (propertyId: string, month: number, year: number, isPaid: boolean, notes?: string) => void;
}

const PropertyCard = ({ property, onPaymentUpdate }: PropertyCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  
  const handleRentPaidToggle = () => {
    if (!property.rentPaid) {
      setIsDialogOpen(true);
    } else {
      // Only ask for confirmation if marking as unpaid
      onPaymentUpdate(property.id, currentMonth, currentYear, false);
      toast.success(`Alquiler de ${property.name} marcado como pendiente`);
    }
  };
  
  const handleConfirmPayment = () => {
    onPaymentUpdate(property.id, currentMonth, currentYear, true, paymentNotes);
    setIsDialogOpen(false);
    setPaymentNotes('');
    toast.success(`Alquiler de ${property.name} marcado como pagado`);
  };

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/property/${property.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold truncate">{property.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground truncate mb-2">{property.address}</p>
          <div className="text-sm flex justify-between">
            <span className="font-medium">Alquiler:</span>
            <span className="font-bold">{property.rent}€/mes</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="font-medium">Gastos:</span>
            <span className="font-medium text-destructive">-{property.expenses}€/mes</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className={cn(
        "p-4 border-t flex justify-between items-center",
        property.netIncome > 0 ? "text-success" : "text-destructive"
      )}>
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm">Neto: <span className="font-semibold">{property.netIncome}€/mes</span></span>
          <div className="flex items-center gap-1">
            <span className="text-xs capitalize">{monthName}:</span>
            {property.rentPaid ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
        
        <div 
          onClick={handleRentPaidToggle}
          className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${property.rentPaid ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}
        >
          {property.rentPaid ? (
            <>
              <CheckCircle className="h-3 w-3" />
              <span>Pagado</span>
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              <span>Pendiente</span>
            </>
          )}
        </div>
        
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Pago de Alquiler</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Confirmas que se ha recibido el pago del alquiler de {monthName} para {property.name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notas
                </Label>
                <Input
                  id="notes"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Opcional: Añade notas sobre este pago"
                  className="col-span-3"
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmPayment}>
                Confirmar Pago
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
