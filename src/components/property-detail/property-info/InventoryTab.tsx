
import { Property, InventoryItem } from '@/types/property';
import { Plus, Sofa, Refrigerator, Home, Pencil, Trash, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

interface InventoryTabProps {
  property: Property;
  onAddInventoryClick: () => void;
  onEditInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
  historicalYear?: number;
}

const InventoryTab = ({ 
  property, 
  onAddInventoryClick, 
  onEditInventoryItem, 
  onDeleteInventoryItem,
  historicalYear 
}: InventoryTabProps) => {
  const [deductibleItems, setDeductibleItems] = useState<Set<string>>(new Set());

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

  const toggleDeductible = (itemId: string) => {
    const newDeductibleItems = new Set(deductibleItems);
    if (newDeductibleItems.has(itemId)) {
      newDeductibleItems.delete(itemId);
    } else {
      newDeductibleItems.add(itemId);
    }
    setDeductibleItems(newDeductibleItems);
  };

  const calculateTotalDeductible = () => {
    return property.inventory?.reduce((total, item) => {
      if (deductibleItems.has(item.id) && item.price) {
        return total + item.price;
      }
      return total;
    }, 0) || 0;
  };

  const calculateTotalInventoryValue = () => {
    return property.inventory?.reduce((total, item) => {
      if (item.price) {
        return total + item.price;
      }
      return total;
    }, 0) || 0;
  };

  const calculateNonDeductibleValue = () => {
    return property.inventory?.reduce((total, item) => {
      if (!deductibleItems.has(item.id) && item.price) {
        return total + item.price;
      }
      return total;
    }, 0) || 0;
  };

  return (
    <div className={`space-y-4 ${historicalYear ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' : ''}`}>
      {historicalYear && (
        <Alert className="bg-yellow-100 border-yellow-300">
          <AlertDescription className="text-yellow-800 text-sm">
            <strong>Inventario Histórico {historicalYear}</strong> - Datos específicos del año {historicalYear}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${historicalYear ? 'text-yellow-900' : ''}`}>
          Inventario {historicalYear ? `${historicalYear}` : ''}
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddInventoryClick}
          className={`flex items-center gap-1 ${
            historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100' : ''
          }`}
        >
          <Plus className="h-3 w-3" /> Añadir
        </Button>
      </div>

      {/* Totals section for historical years */}
      {historicalYear && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-green-800">
            Total inventario: {calculateTotalInventoryValue().toFixed(2)}€
          </p>
          <p className="text-sm font-medium text-blue-800">
            Gastos deducibles: {calculateTotalDeductible().toFixed(2)}€
          </p>
          <p className="text-sm font-medium text-gray-700">
            No deducibles: {calculateNonDeductibleValue().toFixed(2)}€
          </p>
        </div>
      )}
      
      {property.inventory && property.inventory.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {property.inventory.map(item => (
            <div key={item.id} className={`border p-3 rounded-md ${
              historicalYear ? 'border-yellow-300 bg-yellow-50' : ''
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInventoryIcon(item.type)}
                  <span className={`font-medium text-sm ${historicalYear ? 'text-yellow-900' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition === 'new' ? 'Nuevo' :
                    item.condition === 'good' ? 'Bueno' :
                    item.condition === 'fair' ? 'Regular' : 'Deteriorado'}
                  </Badge>
                  
                  {/* Deductible toggle for historical years */}
                  {historicalYear && item.price && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => toggleDeductible(item.id)}
                      title={deductibleItems.has(item.id) ? "Marcado como deducible" : "Marcar como deducible"}
                    >
                      <CheckCircle 
                        className={`h-4 w-4 ${
                          deductibleItems.has(item.id) 
                            ? 'text-green-600 fill-green-100' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  )}
                  
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
              {item.notes && (
                <p className={`text-xs ${historicalYear ? 'text-yellow-700' : 'text-muted-foreground'}`}>
                  {item.notes}
                </p>
              )}
              {item.price && (
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs font-medium ${historicalYear ? 'text-yellow-800' : 'text-green-600'}`}>
                    Precio: {item.price}€
                  </p>
                  {historicalYear && (
                    <span className={`text-xs font-medium ${
                      deductibleItems.has(item.id) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {deductibleItems.has(item.id) ? '✓ Deducible' : '✗ No deducible'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center p-6 border rounded-md ${
          historicalYear 
            ? 'border-yellow-300 bg-yellow-50 text-yellow-700' 
            : 'text-muted-foreground'
        }`}>
          <p>No hay elementos en el inventario{historicalYear ? ` para ${historicalYear}` : ''}</p>
          <p className="text-xs mt-1">
            Haz clic en "Añadir" para registrar muebles o electrodomésticos
            {historicalYear ? ` para el año ${historicalYear}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
