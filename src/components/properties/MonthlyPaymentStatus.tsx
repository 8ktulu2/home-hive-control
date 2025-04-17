
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Property, PaymentRecord } from '@/types/property';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, CircleDashed, XCircle, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

interface MonthlyPaymentStatusProps {
  property: Property;
  onPaymentUpdate: (month: number, year: number, isPaid: boolean, notes?: string) => void;
}

const MonthlyPaymentStatus = ({ property, onPaymentUpdate }: MonthlyPaymentStatusProps) => {
  const [paymentNotes, setPaymentNotes] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [dialogAction, setDialogAction] = useState<'mark-paid' | 'mark-unpaid' | null>(null);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate array of months for the current year
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return {
      index: i,
      name: format(date, 'MMMM', { locale: es }),
      shortName: format(date, 'MMM', { locale: es })
    };
  });
  
  // Get payment status for each month
  const getPaymentStatus = (month: number) => {
    if (!property.paymentHistory) return 'future';
    
    const payment = property.paymentHistory.find(
      p => p.month === month && p.year === currentYear
    );
    
    if (!payment) {
      return month > currentMonth ? 'future' : 'unpaid';
    }
    
    return payment.isPaid ? 'paid' : 'unpaid';
  };
  
  const getPaymentDate = (month: number) => {
    if (!property.paymentHistory) return null;
    
    const payment = property.paymentHistory.find(
      p => p.month === month && p.year === currentYear
    );
    
    return payment ? new Date(payment.date) : null;
  };
  
  const handleOpenDialog = (month: number, year: number, action: 'mark-paid' | 'mark-unpaid') => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDialogAction(action);
    setPaymentNotes('');
  };
  
  const handleConfirmPayment = () => {
    if (selectedMonth === null || selectedYear === null || !dialogAction) return;
    
    onPaymentUpdate(selectedMonth, selectedYear, dialogAction === 'mark-paid', paymentNotes);
    
    const message = dialogAction === 'mark-paid' 
      ? `Pago de ${months[selectedMonth].name} marcado como realizado` 
      : `Pago de ${months[selectedMonth].name} marcado como pendiente`;
    
    toast.success(message);
    
    setSelectedMonth(null);
    setSelectedYear(null);
    setDialogAction(null);
    setPaymentNotes('');
  };
  
  const getMonthClassName = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'unpaid':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'future':
        return 'bg-white border-gray-200 text-gray-400';
      default:
        return 'bg-orange-100 border-orange-400 text-orange-800';
    }
  };
  
  const getMonthIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'unpaid':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'future':
        return <CircleDashed className="h-5 w-5 text-gray-400" />;
      default:
        return <CircleDashed className="h-5 w-5 text-orange-600" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <span>Estado de Pagos {currentYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {months.map((month) => {
            const status = getPaymentStatus(month.index);
            const paymentDate = getPaymentDate(month.index);
            const isPastOrCurrent = month.index <= currentMonth;
            
            return (
              <AlertDialog key={month.index}>
                <AlertDialogTrigger asChild>
                  <div 
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center ${getMonthClassName(status)}`}
                    onClick={() => {
                      if (isPastOrCurrent) {
                        handleOpenDialog(
                          month.index, 
                          currentYear, 
                          status === 'paid' ? 'mark-unpaid' : 'mark-paid'
                        );
                      }
                    }}
                  >
                    <div className="font-medium text-sm capitalize mb-1">{month.name}</div>
                    <div className="mb-2">{getMonthIcon(status)}</div>
                    {paymentDate && (
                      <div className="text-xs text-center">
                        {format(paymentDate, 'dd/MM')}
                      </div>
                    )}
                  </div>
                </AlertDialogTrigger>
                
                {isPastOrCurrent && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {dialogAction === 'mark-paid' 
                          ? `Confirmar Pago - ${month.name}` 
                          : `Marcar como Pendiente - ${month.name}`}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {dialogAction === 'mark-paid' 
                          ? `¿Confirmas que se ha recibido el pago del alquiler de ${month.name}?`
                          : `¿Confirmas que quieres marcar el pago de ${month.name} como pendiente?`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    {dialogAction === 'mark-paid' && (
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
                    )}
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmPayment}>
                        {dialogAction === 'mark-paid' ? 'Confirmar Pago' : 'Marcar Pendiente'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPaymentStatus;
