
import { Property, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';

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
        date: new Date().toISOString(),
        paymentDate: expense.isPaid ? new Date().toISOString() : undefined
      };
      
      // Calculate the new total expenses
      const newTotalExpenses = property.expenses + (newExpense.isPaid ? 0 : newExpense.amount);
      const newNetIncome = property.rent - newTotalExpenses;
      
      setProperty({
        ...property,
        monthlyExpenses: [...(property.monthlyExpenses || []), newExpense],
        expenses: newTotalExpenses,
        netIncome: newNetIncome
      });
      
      toast.success('Gasto añadido correctamente', { duration: 2000 });
    }
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: Partial<MonthlyExpense>) => {
    if (property && property.monthlyExpenses) {
      const expense = property.monthlyExpenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      // Calculate expense impact
      let expenseDifference = 0;
      
      // If we're changing the paid status
      if (updates.isPaid !== undefined && expense.isPaid !== updates.isPaid) {
        // If marking as paid, subtract from total (was counted, now shouldn't be)
        if (updates.isPaid) {
          expenseDifference = -expense.amount;
          updates.paymentDate = new Date().toISOString();
        } 
        // If marking as unpaid, add to total (wasn't counted, now should be)
        else {
          expenseDifference = expense.amount;
          updates.paymentDate = undefined;
        }
      }
      
      // If we're changing the amount
      if (updates.amount !== undefined && !expense.isPaid) {
        const amountDifference = updates.amount - expense.amount;
        expenseDifference += amountDifference;
      }
      
      const updatedExpenses = property.monthlyExpenses.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      );
      
      const newTotalExpenses = property.expenses + expenseDifference;
      const newNetIncome = property.rent - newTotalExpenses;
      
      setProperty({
        ...property,
        monthlyExpenses: updatedExpenses,
        expenses: newTotalExpenses,
        netIncome: newNetIncome
      });
      
      toast.success('Gasto actualizado correctamente', { duration: 2000 });
    }
  };

  const calculateTotalExpenses = (propertyToCalculate: Property) => {
    let totalExpenses = 0;
    
    // Add mortgage payment
    if (propertyToCalculate.mortgage?.monthlyPayment) {
      totalExpenses += propertyToCalculate.mortgage.monthlyPayment;
    }
    
    // Add IBI (property tax) divided by 12 for monthly amount
    if (propertyToCalculate.ibi) {
      totalExpenses += propertyToCalculate.ibi / 12;
    }
    
    // Add insurances
    if (propertyToCalculate.homeInsurance?.cost && !propertyToCalculate.homeInsurance.isPaid) {
      totalExpenses += propertyToCalculate.homeInsurance.cost / 12;
    }
    
    if (propertyToCalculate.lifeInsurance?.cost && !propertyToCalculate.lifeInsurance.isPaid) {
      totalExpenses += propertyToCalculate.lifeInsurance.cost / 12;
    }
    
    // Add monthly expenses that are not paid
    if (propertyToCalculate.monthlyExpenses) {
      propertyToCalculate.monthlyExpenses.forEach(expense => {
        if (!expense.isPaid) {
          totalExpenses += expense.amount;
        }
      });
    }
    
    return totalExpenses;
  };

  return {
    handleExpenseAdd,
    handleExpenseUpdate,
    calculateTotalExpenses
  };
}
