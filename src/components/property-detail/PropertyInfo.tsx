
import { useState } from 'react';
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ContactsTab from './tabs/ContactsTab';
import InventoryTab from './tabs/InventoryTab';
import CommunityTab from './tabs/CommunityTab';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({
    type: 'furniture',
    name: '',
    condition: 'good',
    notes: ''
  });
  
  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({ title, details });
  };
  
  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };
  
  const handleAddInventoryItem = () => {
    toast.success(`Añadido "${newInventoryItem.name}" al inventario`);
    setIsInventoryDialogOpen(false);
    setNewInventoryItem({
      type: 'furniture',
      name: '',
      condition: 'good',
      notes: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contacts">Contactos</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="community">Comunidad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralInfoTab property={property} onTenantClick={handleTenantClick} />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsTab property={property} onContactClick={handleContactClick} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryTab property={property} onAddInventoryClick={() => setIsInventoryDialogOpen(true)} />
          </TabsContent>
          
          <TabsContent value="community">
            <CommunityTab property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>

      {selectedContact && (
        <ContactDetailsDialog
          isOpen={true}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.title}
          details={selectedContact.details || {}}
        />
      )}
      
      {selectedTenant && (
        <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTenant.name}</DialogTitle>
              <DialogDescription>
                Información de contacto del inquilino
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedTenant.phone && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Teléfono:</Label>
                  <span className="col-span-3">{selectedTenant.phone}</span>
                </div>
              )}
              
              {selectedTenant.email && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email:</Label>
                  <span className="col-span-3">{selectedTenant.email}</span>
                </div>
              )}
              
              {selectedTenant.identificationNumber && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">DNI/NIE:</Label>
                  <span className="col-span-3">{selectedTenant.identificationNumber}</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir a Inventario</DialogTitle>
            <DialogDescription>
              Registra muebles, electrodomésticos u otros elementos en la propiedad.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-type" className="text-right">
                Tipo
              </Label>
              <Select
                value={newInventoryItem.type}
                onValueChange={(value) => setNewInventoryItem({...newInventoryItem, type: value as any})}
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
                value={newInventoryItem.name}
                onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-condition" className="text-right">
                Estado
              </Label>
              <Select
                value={newInventoryItem.condition}
                onValueChange={(value) => setNewInventoryItem({...newInventoryItem, condition: value as any})}
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
                value={newInventoryItem.notes}
                onChange={(e) => setNewInventoryItem({...newInventoryItem, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleAddInventoryItem}>Añadir al Inventario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PropertyInfo;
