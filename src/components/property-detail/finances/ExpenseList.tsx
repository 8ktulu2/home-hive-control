
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';
import { Property } from '@/types/property';
import { getCategoryBadge } from './ExpenseCategories';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseListProps {
  property: Property;
  onExpenseUpdate?: (expenseId: string, updates: Partial<any>) => void;
  onlyDetails?: boolean; // si true, solo muestra desglose, NO KPIs arriba
}

export const ExpenseList = ({ property, onExpenseUpdate, onlyDetails = false }: ExpenseListProps) => {
  // Solo expandibles si es "dashboard", no en modo desglose
  const [showExpenseDetails, setShowExpenseDetails] = useState(onlyDetails);

  const handleToggleExpensePaid = (expenseId: string, isPaid: boolean) => {
    const expense = allExpenses.find(e => e.id === expenseId);
    if (expense) {
      if (expenseId === 'home-insurance' || expenseId === 'life-insurance' || ['mortgage', 'ibi', 'community'].includes(expenseId)) {
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`, { duration: 2000 });
        return;
      }
      if (onExpenseUpdate) {
        onExpenseUpdate(expenseId, { isPaid: !isPaid });
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`, { duration: 2000 });
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return '---';
    }
  };

  const currentDate = new Date().toISOString();
  const mortgagePayment = property.mortgage?.monthlyPayment || 0;
  const ibi = property.ibi || 0;
  
  const fixedExpenseItems = [
    { 
      id: 'mortgage', 
      name: 'Hipoteca', 
      value: mortgagePayment, 
      isPaid: false, 
      category: 'mortgage',
      date: currentDate, // Add default date for fixed expenses
      paymentDate: undefined // Add default paymentDate as undefined
    },
    { 
      id: 'ibi', 
      name: 'IBI (anual)', 
      value: ibi / 12, 
      isPaid: false, 
      category: 'taxes',
      date: currentDate, // Add default date for fixed expenses
      paymentDate: undefined // Add default paymentDate as undefined
    },
    { 
      id: 'community', 
      name: 'Comunidad', 
      value: property.expenses - mortgagePayment - (ibi / 12), 
      isPaid: false, 
      category: 'community',
      date: currentDate, // Add default date for fixed expenses
      paymentDate: undefined // Add default paymentDate as undefined
    },
  ];
  
  if (property.homeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'home-insurance',
      name: 'Seguro de Hogar',
      value: property.homeInsurance.cost / 12,
      isPaid: property.homeInsurance.isPaid || false,
      category: 'insurance',
      date: currentDate, // Add default date for fixed expenses
      paymentDate: property.homeInsurance.isPaid ? currentDate : undefined // Add paymentDate if paid
    });
  }
  
  if (property.lifeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'life-insurance',
      name: 'Seguro de Vida',
      value: property.lifeInsurance.cost / 12,
      isPaid: property.lifeInsurance.isPaid || false,
      category: 'insurance',
      date: currentDate, // Add default date for fixed expenses
      paymentDate: property.lifeInsurance.isPaid ? currentDate : undefined // Add paymentDate if paid
    });
  }
  
  const currentMonthDate = new Date();
  const currentMonth = currentMonthDate.getMonth();
  const currentYear = currentMonthDate.getFullYear();
  const currentMonthExpenses = property.monthlyExpenses?.filter(
    expense => expense.month === currentMonth && expense.year === currentYear
  ) || [];
  
  const allExpenses = [
    ...fixedExpenseItems,
    ...currentMonthExpenses.map(expense => ({
      id: expense.id,
      name: expense.name,
      value: expense.amount,
      isPaid: expense.isPaid,
      category: expense.category,
      date: expense.date,
      paymentDate: expense.paymentDate
    }))
  ];
  
  const totalExpensesCalculated = allExpenses
    .filter(expense => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.value, 0);

  const totalPaidExpenses = allExpenses
    .filter(expense => expense.isPaid)
    .reduce((sum, expense) => sum + expense.value, 0);

  // Si onlyDetails, solo mostrar los detalles, no los totales KPIs
  if (onlyDetails) {
    return (
      <div className="rounded-lg p-4 border border-destructive/30 bg-destructive/5">
        <h4 className="text-xs font-medium mb-2">Desglose de gastos</h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {allExpenses.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-destructive/10 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 rounded-full ${item.isPaid ? 'text-success' : 'text-muted-foreground'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpensePaid(item.id, item.isPaid);
                  }}
                  title={item.isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <div className="flex flex-col">
                  <span className={`text-sm ${item.isPaid ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {item.name}
                  </span>
                  <div className="mt-0.5">
                    {getCategoryBadge(item.category)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-sm font-medium ${item.isPaid ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                  {item.value.toFixed(0)}€/mes
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span title="Fecha de creación">{formatDate(item.date)}</span>
                  </div>
                  {item.isPaid && (
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-success" />
                      <span title="Fecha de pago">{formatDate(item.paymentDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2 mt-2">
            <span className="font-medium">Total</span>
            <span className="font-medium text-destructive">{totalExpensesCalculated.toFixed(0)}€/mes</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Pagados: {totalPaidExpenses.toFixed(0)}€</p>
      </div>
    );
  }

  // Modo normal: no usado en la vista detalle, pero lo dejamos por si quieres reusarlo
  return (
    <div 
      className="bg-destructive/10 rounded-lg p-4 cursor-pointer hover:bg-destructive/15 transition-colors"
      onClick={() => setShowExpenseDetails(!showExpenseDetails)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Gastos</h3>
      </div>
      {showExpenseDetails && (
        <div className="mt-3 pt-3 border-t border-destructive/20 space-y-2">
          <h4 className="text-xs font-medium mb-2">Desglose de gastos</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allExpenses.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-destructive/10 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${item.isPaid ? 'text-success' : 'text-muted-foreground'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleExpensePaid(item.id, item.isPaid);
                    }}
                    title={item.isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col">
                    <span className={`text-sm ${item.isPaid ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    <div className="mt-0.5">
                      {getCategoryBadge(item.category)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-medium ${item.isPaid ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                    {item.value.toFixed(0)}€/mes
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span title="Fecha de creación">{formatDate(item.date)}</span>
                    </div>
                    {item.isPaid && (
                      <div className="flex items-center">
                        <Check className="h-3 w-3 mr-1 text-success" />
                        <span title="Fecha de pago">{formatDate(item.paymentDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-medium text-destructive">{totalExpensesCalculated.toFixed(0)}€/mes</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Pagados: {totalPaidExpenses.toFixed(0)}€</p>
        </div>
      )}
    </div>
  );
};
