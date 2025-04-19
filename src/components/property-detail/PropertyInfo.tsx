import { useState } from 'react';
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, FileBarChart, Users, Building, Droplet, Zap, Shield, Phone, Mail, Sofa, Refrigerator, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { FileBarChart, Building } from 'lucide-react';

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
          
          <TabsContent value="general" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">{property.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileBarChart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Referencia Catastral</p>
                <p className="text-sm text-muted-foreground">{property.cadastralReference || 'No especificada'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Inquilinos</p>
                {property.tenants && property.tenants.length > 0 ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {property.tenants.map(tenant => (
                      <li key={tenant.id}>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm text-muted-foreground hover:text-primary"
                          onClick={() => handleTenantClick(tenant)}
                        >
                          {tenant.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay inquilinos</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-3">
            <Button
              variant="ghost"
              className="w-full flex items-start gap-2 justify-start h-auto py-2"
              onClick={() => handleContactClick(
                'Administrador Comunidad',
                property.communityManagerDetails
              )}
            >
              <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium">Administrador Comunidad</p>
                <p className="text-sm text-muted-foreground">{property.communityManager || 'No especificado'}</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-start gap-2 justify-start h-auto py-2"
              onClick={() => handleContactClick(
                'Proveedor de Agua',
                property.waterProviderDetails
              )}
            >
              <Droplet className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium">Proveedor de Agua</p>
                <p className="text-sm text-muted-foreground">{property.waterProvider || 'No especificado'}</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-start gap-2 justify-start h-auto py-2"
              onClick={() => handleContactClick(
                'Proveedor de Electricidad',
                property.electricityProviderDetails
              )}
            >
              <Zap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium">Proveedor de Electricidad</p>
                <p className="text-sm text-muted-foreground">{property.electricityProvider || 'No especificado'}</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-start gap-2 justify-start h-auto py-2"
              onClick={() => handleContactClick(
                'Compañía de Seguros',
                property.insuranceDetails
              )}
            >
              <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium">Compañía de Seguros</p>
                <p className="text-sm text-muted-foreground">{property.insuranceCompany || 'No especificado'}</p>
              </div>
            </Button>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Muebles y Electrodomésticos</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsInventoryDialogOpen(true)}
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
                        <Badge className={getConditionColor(item.condition)}>
                          {item.condition === 'new' ? 'Nuevo' :
                           item.condition === 'good' ? 'Bueno' :
                           item.condition === 'fair' ? 'Regular' : 'Deteriorado'}
                        </Badge>
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
          </TabsContent>
          
          <TabsContent value="community" className="space-y-4">
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Gastos de Comunidad Anual</p>
                <p className="text-sm text-muted-foreground">
                  {property.communityFee ? formatCurrency(property.communityFee) : 'No especificado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileBarChart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Gastos Mensuales</p>
                <p className="text-sm text-muted-foreground">
                  {property.communityFee ? formatCurrency(property.communityFee / 12) : '€0,00'}
                </p>
              </div>
            </div>
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
                  <div className="text-right font-medium flex items-center justify-end gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Teléfono:</span>
                  </div>
                  <span className="col-span-3">{selectedTenant.phone}</span>
                </div>
              )}
              
              {selectedTenant.email && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right font-medium flex items-center justify-end gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email:</span>
                  </div>
                  <span className="col-span-3">{selectedTenant.email}</span>
                </div>
              )}
              
              {selectedTenant.identificationNumber && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right font-medium">DNI/NIE:</span>
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
