import { useState } from 'react';
import { Property, PaymentRecord } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, Edit, Trash, AlertTriangle, X, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/formatters';
interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
}
const PropertyDetailHeader = ({
  property,
  onRentPaidChange
}: PropertyDetailHeaderProps) => {
  const [rentPaid, setRentPaid] = useState(property.rentPaid);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('es-ES', {
    month: 'long'
  });
  const handleRentPaidChange = (checked: boolean) => {
    if (checked) {
      // Al marcar como pagado, abrimos el diálogo para registrar el pago
      setRentPaid(checked);
      setIsDialogOpen(true);
    } else {
      // Al marcar como no pagado, simplemente actualizamos el estado
      setRentPaid(false);
      onRentPaidChange(false);
      toast.warning('Alquiler marcado como pendiente');
    }
  };
  const handleConfirmPayment = () => {
    // Creamos un nuevo registro de pago
    const newPayment: PaymentRecord = {
      id: `payment-${Date.now()}`,
      date: new Date().toISOString(),
      amount: property.rent,
      isPaid: true,
      notes: paymentNote,
      month: currentMonth,
      year: currentYear
    };

    // Actualizamos el estado
    onRentPaidChange(true);

    // Cerramos el diálogo y mostramos un mensaje de éxito
    setIsDialogOpen(false);
    setPaymentNote('');
    toast.success('Pago registrado correctamente');
  };
  return <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex gap-1 items-center text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/property/${property.id}/edit`}>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
          <Button variant="destructive" size="sm" className="flex gap-1 items-center">
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        <div className="flex items-center gap-4 pt-2 sm:pt-0">
          <div className="flex flex-col items-start gap-1">
            
            <div className="flex items-center gap-2">
              
              <div className="flex items-center gap-1">
                {rentPaid ? <>
                    
                    
                  </> : <>
                    
                    
                  </>}
              </div>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Pago de Alquiler</DialogTitle>
                <DialogDescription>
                  Introduce los detalles del pago para {property.name} correspondiente a {monthName} {currentYear}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Importe
                  </Label>
                  <Input id="amount" type="number" defaultValue={property.rent} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input id="date" type="text" value={formatDate(new Date().toISOString())} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notas
                  </Label>
                  <Input id="notes" placeholder="Opcional: añade notas sobre este pago" className="col-span-3" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmPayment}>
                  Confirmar Pago
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>;
};
export default PropertyDetailHeader;