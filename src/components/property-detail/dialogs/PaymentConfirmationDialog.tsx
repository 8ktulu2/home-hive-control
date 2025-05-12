
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes: string, paymentDate: Date) => void;
  month: number;
  year: number;
  isPaid: boolean;
  isFutureMonth: boolean;
}

const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  month,
  year,
  isPaid,
  isFutureMonth,
}) => {
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setNotes('');
      setDate(new Date());
      setValidationError(null);
      setAttemptedSubmit(false);
    }
  }, [open]);

  const handleConfirm = () => {
    // Validate notes for future months
    if (isFutureMonth && !isPaid && !notes.trim()) {
      setAttemptedSubmit(true);
      setValidationError("Las notas son obligatorias para pagos de meses futuros");
      toast.error("Las notas son obligatorias para pagos de meses futuros");
      return;
    }
    
    onConfirm(notes, date || new Date());
    setValidationError(null);
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const monthName = months[month];
  const action = isPaid ? 'no pagado' : 'pagado';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea marcar {monthName} {year} como {action}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {!isPaid && (
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="payment-date">Fecha de pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">
                  Notas {isFutureMonth && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {isFutureMonth && <span className="text-xs text-red-500">Obligatorio</span>}
              </div>
              <Textarea 
                id="notes"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (isFutureMonth && e.target.value.trim()) {
                    setValidationError(null);
                  }
                }}
                placeholder={isFutureMonth 
                  ? "Debe añadir notas para pagos de meses futuros..." 
                  : "Añade notas sobre este pago..."}
                className={cn(
                  (validationError && attemptedSubmit) ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
              />
              {validationError && attemptedSubmit && (
                <div className="flex items-center text-sm text-red-500 mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <p>{validationError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentConfirmationDialog;
