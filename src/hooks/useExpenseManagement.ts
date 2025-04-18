
import { Property, MonthlyExpense } from '@/types/property';

export function useExpenseManagement(
  property: Property | null,
  setProperty: (property: Property | null) => void
) {
  const handleExpenseAdd = (expense: Partial<MonthlyExpense>) => {
    if (property) {
      const newExpense: MonthlyExpense = {
        id: `expense-${Date.now()}`,
        name: expense.name || '',
        amount: expense.amount || 0,
        isPaid: expense.isPaid || false,
        category: expense.category || 'utilities',
        propertyId: property.id,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        date: new Date().toISOString()
      };
      
      setProperty({
        ...property,
        monthlyExpenses: [...(property.monthlyExpenses || []), newExpense]
      });
    }
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: Partial<MonthlyExpense>) => {
    if (property && property.monthlyExpenses) {
      const updatedExpenses = property.monthlyExpenses.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      );
      
      let totalExpenses = property.expenses;
      const updatedExpense = updates.isPaid !== undefined ? updates : null;
      
      if (updatedExpense && updatedExpense.isPaid) {
        const expense = property.monthlyExpenses.find(e => e.id === expenseId);
        if (expense && !expense.isPaid) {
          totalExpenses -= expense.amount;
        }
      } else if (updatedExpense && !updatedExpense.isPaid) {
        const expense = property.monthlyExpenses.find(e => e.id === expenseId);
        if (expense && expense.isPaid) {
          totalExpenses += expense.amount;
        }
      }
      
      const netIncome = property.rent - totalExpenses;
      
      setProperty({
        ...property,
        monthlyExpenses: updatedExpenses,
        expenses: totalExpenses,
        netIncome
      });
    }
  };

  return {
    handleExpenseAdd,
    handleExpenseUpdate,
  };
}
