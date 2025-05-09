
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types/property';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface InventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'>) => void;
  initialItem?: InventoryItem | null;
}

const InventoryDialog = ({ isOpen, onClose, onSave, initialItem }: InventoryDialogProps) => {
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    type: 'furniture',
    name: '',
    condition: 'good',
    notes: '',
    isNewPurchase: false,
    purchaseAmount: 0
  });

  useEffect(() => {
    if (initialItem) {
      setNewItem(initialItem);
    } else {
      setNewItem({
        type: 'furniture',
        name: '',
        condition: 'good',
        notes: '',
        isNewPurchase: false,
        purchaseAmount: 0
      });
    }
  }, [initialItem, isOpen]);

  const handleSave = () => {
    onSave(newItem as Omit<InventoryItem, 'id'>);
    setNewItem({
      type: 'furniture',
      name: '',
      condition: 'good',
      notes: '',
      isNewPurchase: false,
      purchaseAmount: 0
    });
  };

  const isEditing = !!initialItem;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Añadir a'} Inventario</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles del elemento seleccionado.'
              : 'Registra muebles, electrodomésticos u otros elementos en la propiedad.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-type" className="text-right">
              Tipo
            </Label>
            <Select
              value={newItem.type}
              onValueChange={(value) => setNewItem({...newItem, type: value as any})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="furniture">Mueble</SelectItem>
                <SelectItem value="appliance">Electrodoméstico</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              Nombre
            </Label>
            <Input
              id="item-name"
              placeholder="Ej: Sofá, Nevera, Mesa..."
              className="col-span-3"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-condition" className="text-right">
              Estado
            </Label>
            <Select
              value={newItem.condition}
              onValueChange={(value) => setNewItem({...newItem, condition: value as any})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="good">Bueno</SelectItem>
                <SelectItem value="fair">Regular</SelectItem>
                <SelectItem value="poor">Deteriorado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-notes" className="text-right">
              Notas
            </Label>
            <Textarea
              id="item-notes"
              placeholder="Detalles adicionales..."
              className="col-span-3"
              value={newItem.notes || ''}
              onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <Label htmlFor="is-new-purchase" className="text-right">
                Compra nueva
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-new-purchase" 
                checked={newItem.isNewPurchase} 
                onCheckedChange={(checked) => {
                  setNewItem({
                    ...newItem, 
                    isNewPurchase: !!checked,
                    purchaseAmount: !checked ? 0 : newItem.purchaseAmount
                  });
                }}
              />
              <Label htmlFor="is-new-purchase">Registrar como nueva compra</Label>
            </div>
          </div>
          
          {newItem.isNewPurchase && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase-amount" className="text-right">
                Importe
              </Label>
              <Input
                id="purchase-amount"
                type="number"
                placeholder="0.00"
                className="col-span-3"
                value={newItem.purchaseAmount || ''}
                onChange={(e) => setNewItem({...newItem, purchaseAmount: parseFloat(e.target.value) || 0})}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Añadir al Inventario'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialog;
