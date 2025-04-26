
import { useState } from 'react';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { ExpenseListContent } from './expense-components/ExpenseListContent';

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
      value: property.expenses - mortgagePayment - (ibi / 12), 
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

  if (onlyDetails) {
    return <ExpenseListContent expenses={allExpenses} onTogglePaid={handleToggleExpensePaid} />;
  }

  return (
    <div 
      className="bg-destructive/10 rounded-lg p-4 cursor-pointer hover:bg-destructive/15 transition-colors"
      onClick={() => setShowExpenseDetails(!showExpenseDetails)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Gastos</h3>
      </div>
      {showExpenseDetails && (
        <div className="mt-3 pt-3 border-t border-destructive/20">
          <ExpenseListContent expenses={allExpenses} onTogglePaid={handleToggleExpensePaid} />
        </div>
      )}
    </div>
  );
};

