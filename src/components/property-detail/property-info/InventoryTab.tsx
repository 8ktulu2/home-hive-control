
import { Property, InventoryItem } from '@/types/property';
import { Plus, Sofa, Refrigerator, Home, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InventoryTabProps {
  property: Property;
  onAddInventoryClick: () => void;
  onEditInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
}

const InventoryTab = ({ 
  property, 
  onAddInventoryClick, 
  onEditInventoryItem, 
  onDeleteInventoryItem 
}: InventoryTabProps) => {
  const getInventoryIcon = (type: string) => {
    switch(type) {
      case 'furniture':
        return <Sofa className="h-4 w-4" />;
      case 'appliance':
        return <Refrigerator className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };
  
  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Muebles y Electrodomésticos</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddInventoryClick}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Añadir
        </Button>
      </div>
      
      {property.inventory && property.inventory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {property.inventory.map(item => (
            <div key={item.id} className="border p-3 rounded-md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInventoryIcon(item.type)}
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition === 'new' ? 'Nuevo' :
                    item.condition === 'good' ? 'Bueno' :
                    item.condition === 'fair' ? 'Regular' : 'Deteriorado'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => onEditInventoryItem(item)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                    onClick={() => onDeleteInventoryItem(item.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border rounded-md text-muted-foreground">
          <p>No hay elementos en el inventario</p>
          <p className="text-xs mt-1">Haz clic en "Añadir" para registrar muebles o electrodomésticos</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
