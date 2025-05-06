
import { useState } from 'react';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  property: Property;
  onExpenseUpdate?: (expenseId: string, updates: Partial<any>) => void;
  onlyDetails?: boolean;
}

// Define an explicit interface for fixed expenses that includes paymentDate
interface FixedExpense {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  category: string;
  date: string;
  paymentDate?: string;
}

export const ExpenseList = ({ 
  property, 
  onExpenseUpdate, 
  onlyDetails = false 
}: ExpenseListProps) => {
  const [showExpenseDetails, setShowExpenseDetails] = useState(onlyDetails);
  const [showAllExpenses, setShowAllExpenses] = useState(false);

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

  const currentDate = new Date().toISOString();
  const mortgagePayment = property.mortgage?.monthlyPayment || 0;
  const ibi = property.ibi || 0;
  
  // Define each fixed expense with appropriate interface shape including optional paymentDate
  const fixedExpenseItems: FixedExpense[] = [
    { 
      id: 'mortgage', 
      name: 'Hipoteca', 
      value: mortgagePayment, 
      isPaid: false, 
      category: 'mortgage',
      date: currentDate,
    },
    { 
      id: 'ibi', 
      name: 'IBI (anual)', 
      value: ibi / 12, 
      isPaid: false, 
      category: 'taxes',
      date: currentDate,
    },
    { 
      id: 'community', 
      name: 'Comunidad', 
      value: property.communityFee || 0, 
      isPaid: false, 
      category: 'community',
      date: currentDate,
    },
  ];
  
  // Add home insurance if it exists
  if (property.homeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'home-insurance',
      name: 'Seguro de Hogar',
      value: property.homeInsurance.cost / 12,
      isPaid: property.homeInsurance.isPaid || false,
      category: 'insurance',
      date: currentDate,
      paymentDate: property.homeInsurance.isPaid ? currentDate : undefined
    });
  }
  
  // Add life insurance if it exists
  if (property.lifeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'life-insurance',
      name: 'Seguro de Vida',
      value: property.lifeInsurance.cost / 12,
      isPaid: property.lifeInsurance.isPaid || false,
      category: 'insurance',
      date: currentDate,
      paymentDate: property.lifeInsurance.isPaid ? currentDate : undefined
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

  // Function to get badge color class based on category
  const getBadgeColorClass = (category: string) => {
    switch(category) {
      case 'mortgage': return "bg-blue-500 hover:bg-blue-600";
      case 'insurance': return "bg-green-500 hover:bg-green-600";
      case 'utilities': return "bg-amber-500 hover:bg-amber-600";
      case 'maintenance': return "bg-purple-500 hover:bg-purple-600";
      case 'repairs': return "bg-red-500 hover:bg-red-600";
      case 'taxes': return "bg-gray-500 hover:bg-gray-600";
      case 'administrative': return "bg-indigo-500 hover:bg-indigo-600";
      case 'community': return "bg-teal-500 hover:bg-teal-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const sortedExpenses = [...allExpenses].sort((a, b) => {
    // Primero por estado de pago (no pagados primero)
    if (a.isPaid !== b.isPaid) {
      return a.isPaid ? 1 : -1;
    }
    // Luego por nombre
    return a.name.localeCompare(b.name);
  });

  // Limitar la lista si no se ha solicitado mostrar todos
  const displayExpenses = showAllExpenses ? sortedExpenses : sortedExpenses.slice(0, 5);

  return (
    <div className="space-y-4">
      {displayExpenses.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No hay gastos registrados
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayExpenses.map((expense) => (
              <div 
                key={expense.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  expense.isPaid ? "bg-muted/50" : "bg-muted/80"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className={cn(
                      "font-medium", 
                      expense.isPaid ? "text-muted-foreground" : ""
                    )}>
                      {expense.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={getBadgeColorClass(expense.category)}>
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {expense.isPaid 
                          ? `Pagado el ${expense.paymentDate ? formatDate(expense.paymentDate) : 'n/a'}` 
                          : `Pendiente - Fecha: ${formatDate(expense.date)}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "text-lg font-semibold",
                    expense.isPaid ? "text-muted-foreground" : ""
                  )}>
                    {expense.value.toFixed(2)}€
                  </span>
                  {!['mortgage', 'ibi', 'community', 'home-insurance', 'life-insurance'].includes(expense.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleExpensePaid(expense.id, expense.isPaid)}
                      className={cn(
                        "h-8 w-8",
                        !expense.isPaid ? "text-green-500 hover:text-green-700 hover:bg-green-100" : "text-red-500 hover:text-red-700 hover:bg-red-100"
                      )}
                    >
                      {!expense.isPaid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Show more/less button */}
          {sortedExpenses.length > 5 && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setShowAllExpenses(!showAllExpenses)}
            >
              {showAllExpenses ? (
                <span className="flex items-center">Mostrar menos <ArrowUp className="ml-2 h-4 w-4" /></span>
              ) : (
                <span className="flex items-center">Mostrar todos ({sortedExpenses.length}) <ArrowDown className="ml-2 h-4 w-4" /></span>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
