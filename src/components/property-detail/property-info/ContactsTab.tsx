
import { Property, ContactDetails } from '@/types/property';
import { Building, Droplet, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactsTabProps {
  property: Property;
  onContactClick: (title: string, details: ContactDetails) => void;
}

const ContactsTab = ({ property, onContactClick }: ContactsTabProps) => {
  return (
    <div className="space-y-3 max-w-full">
      <Button
        variant="ghost"
        className="w-full flex items-start gap-2 justify-start h-auto py-2 text-left"
        onClick={() => onContactClick(
          'Administrador Comunidad',
          property.communityManagerDetails || {}
        )}
      >
        <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">Administrador Comunidad</p>
          <p className="text-sm text-muted-foreground truncate">{property.communityManager || 'No especificado'}</p>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full flex items-start gap-2 justify-start h-auto py-2 text-left"
        onClick={() => onContactClick(
          'Proveedor de Agua',
          property.waterProviderDetails || {}
        )}
      >
        <Droplet className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">Proveedor de Agua</p>
          <p className="text-sm text-muted-foreground truncate">{property.waterProvider || 'No especificado'}</p>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full flex items-start gap-2 justify-start h-auto py-2 text-left"
        onClick={() => onContactClick(
          'Proveedor de Electricidad',
          property.electricityProviderDetails || {}
        )}
      >
        <Zap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">Proveedor de Electricidad</p>
          <p className="text-sm text-muted-foreground truncate">{property.electricityProvider || 'No especificado'}</p>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full flex items-start gap-2 justify-start h-auto py-2 text-left"
        onClick={() => onContactClick(
          'Compañía de Seguros',
          property.insuranceDetails || {}
        )}
      >
        <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">Compañía de Seguros</p>
          <p className="text-sm text-muted-foreground truncate">{property.insuranceCompany || 'No especificado'}</p>
        </div>
      </Button>
    </div>
  );
};

export default ContactsTab;
