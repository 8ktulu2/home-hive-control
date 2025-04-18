
import { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, FileBarChart, Users, Building, Droplet, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);

  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({ title, details });
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
                    <li key={tenant.id}>{tenant.name}</li>
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
    </Card>
  );
};

export default PropertyInfo;
