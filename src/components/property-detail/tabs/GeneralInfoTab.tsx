
import { Property, Tenant } from '@/types/property';
import { MapPin, Users, FileBarChart, Bed, Bath, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneralInfoTabProps {
  property: Property;
  onTenantClick: (tenant: Tenant) => void;
}

const GeneralInfoTab = ({ property, onTenantClick }: GeneralInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <Ruler className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Metros cuadrados</p>
          <p className="text-sm text-muted-foreground">{property.squareMeters ? `${property.squareMeters} m²` : 'No especificado'}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Bed className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">{property.bedrooms || '?'}</p>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">{property.bathrooms || '?'}</p>
          </div>
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
                    onClick={() => onTenantClick(tenant)}
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
    </div>
  );
};

export default GeneralInfoTab;
