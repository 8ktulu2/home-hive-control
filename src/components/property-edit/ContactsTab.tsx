
import { Property, ContactDetails, Utility } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Building2, Droplet, Lightbulb, Shield, Flame, Wifi, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ContactsTabProps {
  property: Property;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany' | 'gasProvider' | 'internetProvider', field: string, value: string) => void;
  setProperty: (property: Property) => void;
  addOtherUtility?: () => void;
}

const ContactsTab = ({ property, updateContactDetails, setProperty, addOtherUtility }: ContactsTabProps) => {
  const handleAddOtherUtility = () => {
    const newUtility: Utility = {
      id: uuidv4(),
      name: '',
    };
    
    setProperty({
      ...property,
      otherUtilities: [...(property.otherUtilities || []), newUtility]
    });
  };
  
  const updateOtherUtility = (index: number, field: keyof Utility, value: string) => {
    if (property.otherUtilities) {
      const updatedUtilities = [...property.otherUtilities];
      updatedUtilities[index] = { 
        ...updatedUtilities[index],
        [field]: value 
      };
      
      setProperty({
        ...property,
        otherUtilities: updatedUtilities
      });
    }
  };
  
  const removeOtherUtility = (index: number) => {
    if (property.otherUtilities) {
      const updatedUtilities = [...property.otherUtilities];
      updatedUtilities.splice(index, 1);
      
      setProperty({
        ...property,
        otherUtilities: updatedUtilities
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactos y Suministros</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <Accordion type="multiple" className="w-full" defaultValue={["communityManager", "water"]}>
          <AccordionItem value="communityManager">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h3 className="font-medium text-left">Administrador de la Comunidad</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ContactSection
                type="communityManager"
                details={property.communityManagerDetails}
                name={property.communityManager}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="insuranceCompany">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="font-medium text-left">Compañía de Seguros</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ContactSection
                type="insuranceCompany"
                details={property.insuranceDetails}
                name={property.insuranceCompany}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="water">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                <h3 className="font-medium text-left">Proveedor de Agua</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="waterProvider"
                provider={property.waterProvider}
                details={property.waterProviderDetails}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="electricity">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-medium text-left">Proveedor de Electricidad</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="electricityProvider"
                provider={property.electricityProvider}
                details={property.electricityProviderDetails}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="gas">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <h3 className="font-medium text-left">Proveedor de Gas</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="gasProvider"
                provider={property.gasProvider}
                details={property.gasProviderDetails}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="internet">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                <h3 className="font-medium text-left">Proveedor de Internet</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="internetProvider"
                provider={property.internetProvider}
                details={property.internetProviderDetails}
                updateContactDetails={updateContactDetails}
              />
            </AccordionContent>
          </AccordionItem>
          
          {property.otherUtilities?.map((utility, index) => (
            <AccordionItem key={utility.id} value={utility.id} className="border-b">
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-left">{utility.name || "Otro suministro"}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <OtherUtilitySection
                  utility={utility}
                  updateUtility={(field, value) => updateOtherUtility(index, field as keyof Utility, value)}
                  removeUtility={() => removeOtherUtility(index)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Button 
          type="button" 
          variant="outline" 
          className="mt-6 w-full flex items-center gap-2"
          onClick={handleAddOtherUtility}
        >
          <Plus className="h-4 w-4" /> Añadir otro suministro
        </Button>
      </CardContent>
    </Card>
  );
};

interface ContactSectionProps {
  type: 'communityManager' | 'insuranceCompany';
  details?: ContactDetails;
  name?: string;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany' | 'gasProvider' | 'internetProvider', field: string, value: string) => void;
}

const ContactSection = ({ type, details, name, updateContactDetails }: ContactSectionProps) => {
  return (
    <div className="space-y-4 pt-2">
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

interface UtilitySectionProps {
  type: 'waterProvider' | 'electricityProvider' | 'gasProvider' | 'internetProvider';
  provider?: string;
  details?: any;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany' | 'gasProvider' | 'internetProvider', field: string, value: string) => void;
}

const UtilitySection = ({ type, provider, details, updateContactDetails }: UtilitySectionProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label>Compañía</Label>
        <Input
          value={provider || ''}
          onChange={(e) => updateContactDetails(type, 'name', e.target.value)}
          placeholder="Nombre de la compañía"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Número de contrato</Label>
        <Input
          value={details?.contractNumber || ''}
          onChange={(e) => updateContactDetails(type, 'contractNumber', e.target.value)}
          placeholder="Número de contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Titular</Label>
        <Input
          value={details?.accountHolder || ''}
          onChange={(e) => updateContactDetails(type, 'accountHolder', e.target.value)}
          placeholder="Titular del contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Lectura inicial</Label>
        <Input
          value={details?.initialReading || ''}
          onChange={(e) => updateContactDetails(type, 'initialReading', e.target.value)}
          placeholder="Lectura inicial"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono de contacto</Label>
        <Input
          value={details?.phone || ''}
          onChange={(e) => updateContactDetails(type, 'phone', e.target.value)}
          placeholder="Teléfono de contacto"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Email de contacto</Label>
        <Input
          value={details?.email || ''}
          onChange={(e) => updateContactDetails(type, 'email', e.target.value)}
          placeholder="Email de contacto"
          type="email"
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

interface OtherUtilitySectionProps {
  utility: Utility;
  updateUtility: (field: string, value: string) => void;
  removeUtility: () => void;
}

const OtherUtilitySection = ({ utility, updateUtility, removeUtility }: OtherUtilitySectionProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label>Nombre del suministro</Label>
        <Input
          value={utility.name || ''}
          onChange={(e) => updateUtility('name', e.target.value)}
          placeholder="Nombre del suministro (ej: Calefacción central)"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Proveedor</Label>
        <Input
          value={utility.provider || ''}
          onChange={(e) => updateUtility('provider', e.target.value)}
          placeholder="Nombre del proveedor"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Número de contrato</Label>
        <Input
          value={utility.contractNumber || ''}
          onChange={(e) => updateUtility('contractNumber', e.target.value)}
          placeholder="Número de contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Titular</Label>
        <Input
          value={utility.accountHolder || ''}
          onChange={(e) => updateUtility('accountHolder', e.target.value)}
          placeholder="Titular del contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono de contacto</Label>
        <Input
          value={utility.contactPhone || ''}
          onChange={(e) => updateUtility('contactPhone', e.target.value)}
          placeholder="Teléfono de contacto"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Email de contacto</Label>
        <Input
          value={utility.contactEmail || ''}
          onChange={(e) => updateUtility('contactEmail', e.target.value)}
          placeholder="Email de contacto"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea
          value={utility.notes || ''}
          onChange={(e) => updateUtility('notes', e.target.value)}
          placeholder="Notas adicionales"
          rows={2}
        />
      </div>
      
      <Button 
        type="button" 
        variant="destructive" 
        onClick={removeUtility}
        className="w-full mt-2 flex items-center justify-center gap-2"
      >
        <Trash2 className="h-4 w-4" /> Eliminar este suministro
      </Button>
    </div>
  );
};

export default ContactsTab;
