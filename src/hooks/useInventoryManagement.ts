
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
      
      // Add as expense if there's a price
      if (item.price && item.price > 0) {
        const newExpense: MonthlyExpense = {
          id: `expense-${Date.now()}`,
          name: `Compra: ${item.name}`,
          amount: item.price,
          isPaid: true,
          category: 'compra',
          propertyId: property.id,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          date: new Date().toISOString(),
          paymentDate: new Date().toISOString(),
        };
        
        // Update expenses and net income
        const newTotalExpenses = property.expenses + newExpense.amount;
        const newNetIncome = property.rent - newTotalExpenses;
        
        updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
        updatedProperty.expenses = newTotalExpenses;
        updatedProperty.netIncome = newNetIncome;
        
        toast.success(`Se añadió el gasto de ${item.price}€ por la compra de ${item.name}`);
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
      
      // If the price changed and there's a new price > 0, add a new expense
      if (originalItem && updatedItem.price && updatedItem.price > 0 && 
          (!originalItem.price || originalItem.price !== updatedItem.price)) {
        
        const priceDifference = updatedItem.price - (originalItem.price || 0);
        
        if (priceDifference > 0) {
          const newExpense: MonthlyExpense = {
            id: `expense-${Date.now()}`,
            name: `Actualización inventario: ${updatedItem.name}`,
            amount: priceDifference,
            isPaid: true,
            category: 'compra',
            propertyId: property.id,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            date: new Date().toISOString(),
            paymentDate: new Date().toISOString(),
          };
          
          // Update expenses and net income
          const newTotalExpenses = property.expenses + priceDifference;
          const newNetIncome = property.rent - newTotalExpenses;
          
          updatedProperty.monthlyExpenses = [...(property.monthlyExpenses || []), newExpense];
          updatedProperty.expenses = newTotalExpenses;
          updatedProperty.netIncome = newNetIncome;
          
          toast.success(`Se añadió un gasto adicional de ${priceDifference}€ por la actualización de ${updatedItem.name}`);
        }
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
