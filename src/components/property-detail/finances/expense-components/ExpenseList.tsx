
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseEmptyState } from './ExpenseEmptyState';
import { ExpenseToggleButton } from './ExpenseToggleButton';

interface ExpenseListProps {
  property: Property;
  onExpenseUpdate?: (expenseId: string, updates: Partial<any>) => void;
  onExpenseDelete?: (expenseId: string) => void;
  onlyDetails?: boolean;
  simplified?: boolean;
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
  onExpenseDelete,
  onlyDetails = false,
  simplified = false
}: ExpenseListProps) => {
  const [showExpenseDetails, setShowExpenseDetails] = useState(onlyDetails);
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  const handleToggleExpensePaid = (expenseId: string, isPaid: boolean) => {
    const expense = allExpenses.find(e => e.id === expenseId);
    if (expense) {
      const isStaticExpense = ['mortgage', 'ibi', 'community', 'home-insurance', 'life-insurance'].includes(expenseId);
      
      if (isStaticExpense) {
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`, { duration: 2000 });
        return;
      }
      
      if (onExpenseUpdate) {
        onExpenseUpdate(expenseId, { isPaid: !isPaid });
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`, { duration: 2000 });
      }
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (onExpenseDelete) {
      onExpenseDelete(expenseId);
      toast.success('Gasto eliminado correctamente', { duration: 2000 });
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
      category: 'hipoteca',
      date: currentDate,
    },
    { 
      id: 'ibi', 
      name: 'IBI (anual)', 
      value: ibi / 12, 
      isPaid: false, 
      category: 'impuestos',
      date: currentDate,
    },
    { 
      id: 'community', 
      name: 'Comunidad', 
      value: property.communityFee || 0, 
      isPaid: false, 
      category: 'comunidad',
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
      category: 'seguro',
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
      category: 'seguro',
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
      category: expense.category || 'otros',
      date: expense.date || currentDate,
      paymentDate: expense.paymentDate
    }))
  ];

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
        <ExpenseEmptyState />
      ) : (
        <>
          <div className="space-y-3">
            {displayExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                id={expense.id}
                name={expense.name}
                value={expense.value}
                isPaid={expense.isPaid}
                simplified={simplified}
                onTogglePaid={handleToggleExpensePaid}
                onDeleteExpense={onExpenseDelete}
                isStatic={['mortgage', 'ibi', 'community', 'home-insurance', 'life-insurance'].includes(expense.id)}
              />
            ))}
          </div>
          
          {/* Show more/less button */}
          {sortedExpenses.length > 5 && (
            <ExpenseToggleButton 
              showAllExpenses={showAllExpenses}
              setShowAllExpenses={setShowAllExpenses}
              expenseCount={sortedExpenses.length}
            />
          )}
        </>
      )}
    </div>
  );
};
