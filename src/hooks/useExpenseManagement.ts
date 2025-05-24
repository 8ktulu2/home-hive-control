
import { Property, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';
import { calculateTotalExpenses, calculateExpenseImpact } from '@/utils/expenseCalculations';
import { savePropertyToStorage } from '@/utils/expenseStorage';

export function useExpenseManagement(
  property: Property | null,
  setProperty: (property: Property | null) => void
) {
  const handleExpenseAdd = (expense: Partial<MonthlyExpense>) => {
    if (!property) return;
    
    const newExpense: MonthlyExpense = {
      id: `expense-${Date.now()}`,
      name: expense.name || '',
      amount: expense.amount || 0,
      isPaid: expense.isPaid || false,
      category: expense.category || 'compra',
      propertyId: property.id,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      date: expense.date || new Date().toISOString(),
      paymentDate: expense.paymentDate
    };
    
    const updatedProperty = {
      ...property,
      monthlyExpenses: [...(property.monthlyExpenses || []), newExpense]
    };
    
    // Recalculate total expenses using the utility function
    const newTotalExpenses = calculateTotalExpenses(updatedProperty);
    const newNetIncome = updatedProperty.rent - newTotalExpenses;
    
    updatedProperty.expenses = newTotalExpenses;
    updatedProperty.netIncome = newNetIncome;
    
    setProperty(updatedProperty);
    
    // Save to localStorage
    if (savePropertyToStorage(updatedProperty)) {
      toast.success('Gasto añadido correctamente', { duration: 2000 });
    }
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: Partial<MonthlyExpense>) => {
    if (!property || !property.monthlyExpenses) return;
    
    const expense = property.monthlyExpenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // Update payment date if needed
    if (updates.isPaid !== undefined) {
      updates.paymentDate = updates.isPaid ? new Date().toISOString() : undefined;
    }
    
    const updatedExpenses = property.monthlyExpenses.map(expense => 
      expense.id === expenseId ? { ...expense, ...updates } : expense
    );
    
    const updatedProperty = {
      ...property,
      monthlyExpenses: updatedExpenses
    };
    
    // Recalculate total expenses using the utility function
    const newTotalExpenses = calculateTotalExpenses(updatedProperty);
    const newNetIncome = updatedProperty.rent - newTotalExpenses;
    
    updatedProperty.expenses = newTotalExpenses;
    updatedProperty.netIncome = newNetIncome;
    
    setProperty(updatedProperty);
    
    // Save to localStorage
    if (savePropertyToStorage(updatedProperty)) {
      toast.success('Gasto actualizado correctamente', { duration: 2000 });
    }
  };

  return {
    handleExpenseAdd,
    handleExpenseUpdate,
    calculateTotalExpenses
  };
}
