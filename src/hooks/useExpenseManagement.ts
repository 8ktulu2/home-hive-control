
import { Property, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
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
      category: expense.category || 'otros',
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
    
    // Save to localStorage and trigger updates
    if (savePropertyToStorage(updatedProperty)) {
      // Trigger a storage event to update other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'properties',
        newValue: JSON.stringify([updatedProperty])
      }));
      
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
    
    // Save to localStorage and trigger updates
    if (savePropertyToStorage(updatedProperty)) {
      // Trigger a storage event to update other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'properties',
        newValue: JSON.stringify([updatedProperty])
      }));
      
      toast.success('Gasto actualizado correctamente', { duration: 2000 });
    }
  };

  const handleExpenseDelete = (expenseId: string) => {
    if (!property || !property.monthlyExpenses) return;

    // Find the expense to be deleted
    const expenseToDelete = property.monthlyExpenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return;

    // Check if it's an inventory-related expense
    const isInventoryExpense = expenseId.startsWith('expense-inventory-');
    let updatedProperty = { ...property };

    if (isInventoryExpense) {
      // Extract inventory item ID from expense ID
      const inventoryId = expenseId.replace('expense-inventory-', '');
      
      // Remove the inventory item as well
      if (property.inventory) {
        updatedProperty.inventory = property.inventory.filter(item => item.id !== inventoryId);
        console.log(`Eliminando elemento de inventario asociado: ${inventoryId}`);
      }
    }

    // Filter out the deleted expense
    const updatedExpenses = property.monthlyExpenses.filter(e => e.id !== expenseId);
    updatedProperty.monthlyExpenses = updatedExpenses;
    
    // Recalculate total expenses using the utility function
    const newTotalExpenses = calculateTotalExpenses(updatedProperty);
    const newNetIncome = updatedProperty.rent - newTotalExpenses;
    
    updatedProperty.expenses = newTotalExpenses;
    updatedProperty.netIncome = newNetIncome;
    
    setProperty(updatedProperty);
    
    // Save to localStorage and trigger updates
    if (savePropertyToStorage(updatedProperty)) {
      // Trigger a storage event to update other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'properties',
        newValue: JSON.stringify([updatedProperty])
      }));
      
      if (isInventoryExpense) {
        toast.success('Gasto e inventario eliminados correctamente', { duration: 2000 });
      } else {
        toast.success('Gasto eliminado correctamente', { duration: 2000 });
      }
    }
  };

  return {
    handleExpenseAdd,
    handleExpenseUpdate,
    handleExpenseDelete,
    calculateTotalExpenses
  };
}
