
import { Property, ContactDetails } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactsTabProps {
  property: Property;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany', field: string, value: string) => void;
}

const ContactsTab = ({ property, updateContactDetails }: ContactsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactos y Proveedores</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContactSection
            title="Administrador de la Comunidad"
            type="communityManager"
            details={property.communityManagerDetails}
            name={property.communityManager}
            updateContactDetails={updateContactDetails}
          />
          
          <ContactSection
            title="Compañía de Seguros"
            type="insuranceCompany"
            details={property.insuranceDetails}
            name={property.insuranceCompany}
            updateContactDetails={updateContactDetails}
          />
          
          <ContactSection
            title="Proveedor de Agua"
            type="waterProvider"
            details={property.waterProviderDetails}
            name={property.waterProvider}
            updateContactDetails={updateContactDetails}
          />
          
          <ContactSection
            title="Proveedor de Electricidad"
            type="electricityProvider"
            details={property.electricityProviderDetails}
            name={property.electricityProvider}
            updateContactDetails={updateContactDetails}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface ContactSectionProps {
  title: string;
  type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany';
  details?: ContactDetails;
  name?: string;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany', field: string, value: string) => void;
}

const ContactSection = ({ title, type, details, name, updateContactDetails }: ContactSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      
      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input
          value={name || ''}
          onChange={(e) => updateContactDetails(type, 'name', e.target.value)}
          placeholder="Nombre del proveedor"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          value={details?.phone || ''}
          onChange={(e) => updateContactDetails(type, 'phone', e.target.value)}
          placeholder="Teléfono de contacto"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={details?.email || ''}
          onChange={(e) => updateContactDetails(type, 'email', e.target.value)}
          placeholder="Email de contacto"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Sitio web</Label>
        <Input
          value={details?.website || ''}
          onChange={(e) => updateContactDetails(type, 'website', e.target.value)}
          placeholder="Sitio web"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Persona de contacto</Label>
        <Input
          value={details?.contactPerson || ''}
          onChange={(e) => updateContactDetails(type, 'contactPerson', e.target.value)}
          placeholder="Persona de contacto"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea
          value={details?.notes || ''}
          onChange={(e) => updateContactDetails(type, 'notes', e.target.value)}
          placeholder="Notas adicionales"
          rows={2}
        />
      </div>
    </div>
  );
};

export default ContactsTab;
