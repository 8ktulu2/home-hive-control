
import { Property, InventoryItem, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';

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
      
      // Si es una compra nueva, añadir como gasto
      if (item.isNewPurchase && item.purchaseAmount && item.purchaseAmount > 0) {
        const newExpense: MonthlyExpense = {
          id: `expense-${Date.now()}`,
          name: `Compra: ${item.name}`,
          amount: item.purchaseAmount,
          isPaid: true,
          category: 'compra',
          propertyId: property.id,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          date: new Date().toISOString(),
          paymentDate: new Date().toISOString(),
          notes: `Compra de ${item.name} para el inventario`
        };
        
        // Actualizar gastos y ingresos netos
        const newTotalExpenses = property.expenses + newExpense.amount;
        const newNetIncome = property.rent - newTotalExpenses;
        
        updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
        updatedProperty.expenses = newTotalExpenses;
        updatedProperty.netIncome = newNetIncome;
      }
      
      setProperty(updatedProperty);
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
      
      toast.success('Elemento añadido al inventario');
    }
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    if (property && property.inventory) {
      const updatedInventory = property.inventory.filter(item => item.id !== itemId);
      
      const updatedProperty = {
        ...property,
        inventory: updatedInventory
      };
      
      setProperty(updatedProperty);
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
      
      toast.success('Elemento eliminado del inventario');
    }
  };

  const handleEditInventoryItem = (updatedItem: InventoryItem) => {
    if (property && property.inventory) {
      const originalItem = property.inventory.find(item => item.id === updatedItem.id);
      const updatedInventory = property.inventory.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      const updatedProperty = {
        ...property,
        inventory: updatedInventory
      };
      
      // Si se activó la opción de compra nueva y no estaba activada antes, añadir como gasto
      if (updatedItem.isNewPurchase && updatedItem.purchaseAmount && updatedItem.purchaseAmount > 0 && 
          (!originalItem?.isNewPurchase || !originalItem?.purchaseAmount)) {
        
        const newExpense: MonthlyExpense = {
          id: `expense-${Date.now()}`,
          name: `Compra: ${updatedItem.name}`,
          amount: updatedItem.purchaseAmount,
          isPaid: true,
          category: 'compra',
          propertyId: property.id,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          date: new Date().toISOString(),
          paymentDate: new Date().toISOString(),
          notes: `Compra de ${updatedItem.name} para el inventario`
        };
        
        // Actualizar gastos y ingresos netos
        const newTotalExpenses = property.expenses + newExpense.amount;
        const newNetIncome = property.rent - newTotalExpenses;
        
        updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
        updatedProperty.expenses = newTotalExpenses;
        updatedProperty.netIncome = newNetIncome;
      }
      
      setProperty(updatedProperty);
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
      
      toast.success('Elemento actualizado en el inventario');
    }
  };

  return {
    handleAddInventoryItem,
    handleDeleteInventoryItem,
    handleEditInventoryItem
  };
}
