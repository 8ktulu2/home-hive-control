
import { Property, InventoryItem } from '@/types/property';
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
      const updatedInventory = property.inventory.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
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
      
      toast.success('Elemento actualizado en el inventario');
    }
  };

  return {
    handleAddInventoryItem,
    handleDeleteInventoryItem,
    handleEditInventoryItem
  };
}
