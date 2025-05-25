
import { Property, InventoryItem, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import { savePropertyToStorage } from '@/utils/expenseStorage';

export function useInventoryManagement(property: Property | null, setProperty: (property: Property | null) => void) {
  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    if (property) {
      const newItem: InventoryItem = {
        ...item,
        id: `inventory-${Date.now()}`
      };
      
      const updatedProperty = {
        ...property,
        inventory: [...(property.inventory || []), newItem]
      };
      
      // Add as expense if there's a price
      if (item.price && item.price > 0) {
        const newExpense: MonthlyExpense = {
          id: `expense-inventory-${newItem.id}`,
          name: `Compra: ${item.name}`,
          amount: item.price,
          isPaid: false,
          category: 'compra',
          propertyId: property.id,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          date: new Date().toISOString(),
        };
        
        updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
      }
      
      // Recalculate total expenses using the utility function
      const newTotalExpenses = calculateTotalExpenses(updatedProperty);
      const newNetIncome = updatedProperty.rent - newTotalExpenses;
      
      updatedProperty.expenses = newTotalExpenses;
      updatedProperty.netIncome = newNetIncome;
      
      setProperty(updatedProperty);
      
      // Save to localStorage and update other components
      if (savePropertyToStorage(updatedProperty)) {
        // Trigger a storage event to update other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'properties',
          newValue: JSON.stringify([updatedProperty])
        }));
        
        if (item.price && item.price > 0) {
          toast.success(`Elemento añadido al inventario y gasto de ${item.price}€ añadido (pendiente de pago)`);
        } else {
          toast.success('Elemento añadido al inventario');
        }
      }
    }
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    if (property && property.inventory) {
      // Find the item being deleted
      const itemToDelete = property.inventory.find(item => item.id === itemId);
      
      const updatedInventory = property.inventory.filter(item => item.id !== itemId);
      
      let updatedProperty = {
        ...property,
        inventory: updatedInventory
      };
      
      // Remove associated expense if it exists
      if (itemToDelete && property.monthlyExpenses) {
        const associatedExpenseId = `expense-inventory-${itemId}`;
        const expenseExists = property.monthlyExpenses.find(exp => exp.id === associatedExpenseId);
        
        if (expenseExists) {
          updatedProperty.monthlyExpenses = property.monthlyExpenses.filter(
            expense => expense.id !== associatedExpenseId
          );
          
          console.log(`Eliminando gasto asociado: ${associatedExpenseId}`);
        }
      }
      
      // Recalculate total expenses
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
        
        toast.success('Elemento eliminado del inventario');
      }
    }
  };

  const handleEditInventoryItem = (updatedItem: InventoryItem) => {
    if (property && property.inventory) {
      const originalItem = property.inventory.find(item => item.id === updatedItem.id);
      
      const updatedInventory = property.inventory.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      let updatedProperty = {
        ...property,
        inventory: updatedInventory
      };
      
      // Handle expense updates for price changes
      const associatedExpenseId = `expense-inventory-${updatedItem.id}`;
      
      if (originalItem && updatedItem.price && updatedItem.price > 0) {
        // Update existing expense or create new one
        if (property.monthlyExpenses) {
          const existingExpenseIndex = property.monthlyExpenses.findIndex(
            expense => expense.id === associatedExpenseId
          );
          
          if (existingExpenseIndex >= 0) {
            // Update existing expense
            const updatedExpenses = [...property.monthlyExpenses];
            updatedExpenses[existingExpenseIndex] = {
              ...updatedExpenses[existingExpenseIndex],
              name: `Compra: ${updatedItem.name}`,
              amount: updatedItem.price
            };
            updatedProperty.monthlyExpenses = updatedExpenses;
          } else {
            // Create new expense
            const newExpense: MonthlyExpense = {
              id: associatedExpenseId,
              name: `Compra: ${updatedItem.name}`,
              amount: updatedItem.price,
              isPaid: false,
              category: 'compra',
              propertyId: property.id,
              month: new Date().getMonth(),
              year: new Date().getFullYear(),
              date: new Date().toISOString(),
            };
            updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
          }
        }
      } else if (!updatedItem.price || updatedItem.price === 0) {
        // Remove expense if price is 0 or empty
        if (property.monthlyExpenses) {
          updatedProperty.monthlyExpenses = property.monthlyExpenses.filter(
            expense => expense.id !== associatedExpenseId
          );
        }
      }
      
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
        
        toast.success('Elemento actualizado en el inventario');
      }
    }
  };

  return {
    handleAddInventoryItem,
    handleDeleteInventoryItem,
    handleEditInventoryItem
  };
}
