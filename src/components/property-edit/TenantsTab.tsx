
import { Property, Tenant } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, User } from 'lucide-react';

interface TenantsTabProps {
  property: Property;
  addTenant: () => void;
  updateTenant: (index: number, field: keyof Tenant, value: string) => void;
  removeTenant: (index: number) => void;
}

const TenantsTab = ({ property, addTenant, updateTenant, removeTenant }: TenantsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Inquilinos</CardTitle>
        <Button type="button" size="sm" onClick={addTenant}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Inquilino
        </Button>
      </CardHeader>
      <CardContent className="overflow-visible">
        {property.tenants && property.tenants.length > 0 ? (
          <div className="space-y-6">
            {property.tenants.map((tenant, index) => (
              <div key={tenant.id} className="p-4 border rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Inquilino {index + 1}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTenant(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`tenant-${index}-name`}>Nombre</Label>
                    <Input
                      id={`tenant-${index}-name`}
                      value={tenant.name}
                      onChange={(e) => updateTenant(index, 'name', e.target.value)}
                      placeholder="Nombre del inquilino"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`tenant-${index}-id`}>Identificación</Label>
                    <Input
                      id={`tenant-${index}-id`}
                      value={tenant.identificationNumber || ''}
                      onChange={(e) => updateTenant(index, 'identificationNumber', e.target.value)}
                      placeholder="DNI / NIE / Pasaporte"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`tenant-${index}-phone`}>Teléfono</Label>
                    <Input
                      id={`tenant-${index}-phone`}
                      value={tenant.phone || ''}
                      onChange={(e) => updateTenant(index, 'phone', e.target.value)}
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`tenant-${index}-email`}>Email</Label>
                    <Input
                      id={`tenant-${index}-email`}
                      value={tenant.email || ''}
                      onChange={(e) => updateTenant(index, 'email', e.target.value)}
                      placeholder="Email de contacto"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay inquilinos registrados</p>
            <p className="text-sm mt-2">Haz clic en "Añadir Inquilino" para empezar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantsTab;
