
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, FileBarChart, Users, Building, Droplet, Zap } from 'lucide-react';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
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
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Administrador Comunidad</p>
              <p className="text-sm text-muted-foreground">{property.communityManager || 'No especificado'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Droplet className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Proveedor de Agua</p>
              <p className="text-sm text-muted-foreground">{property.waterProvider || 'No especificado'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Zap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Proveedor de Electricidad</p>
              <p className="text-sm text-muted-foreground">{property.electricityProvider || 'No especificado'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
