
import { useState } from 'react';
import { Property, Tenant, ContactDetails } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, FileBarChart, Users, Building, Droplet, Zap, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({ title, details });
  };
  
  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3">
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
        </div>
        
        <div className="space-y-3">
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
        </div>
      </CardContent>

      {selectedContact && (
        <ContactDetailsDialog
          isOpen={true}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.title}
          details={selectedContact.details}
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
    </Card>
  );
};

export default PropertyInfo;
