
import { Property } from '@/types/property';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';
import { toast } from 'sonner';

export const useHistoricalInventory = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const { 
    addHistoricalInventoryItem, 
    updateHistoricalInventoryItem, 
    deleteHistoricalInventoryItem
  } = useHistoricalDataIsolation();

  // ISOLATED inventory management - affects ONLY the historical year
  const handleHistoricalInventoryAdd = (item: Omit<any, 'id'>) => {
    const newItem = addHistoricalInventoryItem(property.id, year, item);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: [...(historicalProperty.inventory || []), {
          id: newItem.id,
          name: newItem.name,
          type: newItem.type,
          condition: newItem.condition,
          notes: newItem.notes,
          acquisitionDate: newItem.acquisitionDate,
          price: newItem.price
        }]
      });
      toast.success('Elemento añadido al inventario histórico');
    }
  };

  const handleHistoricalInventoryEdit = (item: any) => {
    const updated = updateHistoricalInventoryItem(property.id, year, item.id, item);
    
    if (updated && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.map(inv => 
          inv.id === item.id ? item : inv
        ) || []
      });
      toast.success('Elemento del inventario histórico actualizado');
    }
  };

  const handleHistoricalInventoryDelete = (itemId: string) => {
    const deleted = deleteHistoricalInventoryItem(property.id, year, itemId);
    
    if (deleted && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.filter(inv => inv.id !== itemId) || []
      });
      toast.success('Elemento eliminado del inventario histórico');
    }
  };

  return {
    handleHistoricalInventoryAdd,
    handleHistoricalInventoryEdit,
    handleHistoricalInventoryDelete
  };
};
