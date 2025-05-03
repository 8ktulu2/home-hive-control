
import React from 'react';
import { Property, Utility } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Water, Lightbulb, GasPump, Wifi } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { v4 as uuidv4 } from 'uuid';

interface UtilitiesTabProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const UtilitiesTab = ({ property, setProperty }: UtilitiesTabProps) => {
  const updateUtilityInfo = (type: 'water' | 'electricity' | 'gas' | 'internet', field: string, value: string) => {
    const detailsField = `${type}ProviderDetails` as keyof Property;
    const providerField = `${type}Provider` as keyof Property;
    
    if (field === 'provider') {
      setProperty({
        ...property,
        [providerField]: value
      });
    } else {
      const currentDetails = (property[detailsField] as any) || {};
      
      setProperty({
        ...property,
        [detailsField]: {
          ...currentDetails,
          [field]: value
        }
      });
    }
  };
  
  const addOtherUtility = () => {
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
        <CardTitle>Suministros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" className="w-full" defaultValue={["water", "electricity"]}>
          <AccordionItem value="water" className="border-b">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Water className="h-5 w-5" />
                <h3 className="font-medium text-left">Agua</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="water"
                provider={property.waterProvider}
                details={property.waterProviderDetails}
                updateUtilityInfo={updateUtilityInfo}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="electricity" className="border-b">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-medium text-left">Electricidad</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="electricity"
                provider={property.electricityProvider}
                details={property.electricityProviderDetails}
                updateUtilityInfo={updateUtilityInfo}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="gas" className="border-b">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <GasPump className="h-5 w-5" />
                <h3 className="font-medium text-left">Gas</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="gas"
                provider={property.gasProvider}
                details={property.gasProviderDetails}
                updateUtilityInfo={updateUtilityInfo}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="internet" className="border-b">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                <h3 className="font-medium text-left">Internet</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <UtilitySection
                type="internet"
                provider={property.internetProvider}
                details={property.internetProviderDetails}
                updateUtilityInfo={updateUtilityInfo}
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
          className="mt-4 w-full flex items-center gap-2"
          onClick={addOtherUtility}
        >
          <Plus className="h-4 w-4" /> Añadir otro suministro
        </Button>
      </CardContent>
    </Card>
  );
};

interface UtilitySectionProps {
  type: 'water' | 'electricity' | 'gas' | 'internet';
  provider?: string;
  details?: any;
  updateUtilityInfo: (type: 'water' | 'electricity' | 'gas' | 'internet', field: string, value: string) => void;
}

const UtilitySection = ({ type, provider, details, updateUtilityInfo }: UtilitySectionProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label>Compañía</Label>
        <Input
          value={provider || ''}
          onChange={(e) => updateUtilityInfo(type, 'provider', e.target.value)}
          placeholder="Nombre de la compañía"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Número de contrato</Label>
        <Input
          value={details?.contractNumber || ''}
          onChange={(e) => updateUtilityInfo(type, 'contractNumber', e.target.value)}
          placeholder="Número de contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Titular</Label>
        <Input
          value={details?.accountHolder || ''}
          onChange={(e) => updateUtilityInfo(type, 'accountHolder', e.target.value)}
          placeholder="Titular del contrato"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Lectura inicial</Label>
        <Input
          value={details?.initialReading || ''}
          onChange={(e) => updateUtilityInfo(type, 'initialReading', e.target.value)}
          placeholder="Lectura inicial"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono de contacto</Label>
        <Input
          value={details?.phone || ''}
          onChange={(e) => updateUtilityInfo(type, 'phone', e.target.value)}
          placeholder="Teléfono de contacto"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Email de contacto</Label>
        <Input
          value={details?.email || ''}
          onChange={(e) => updateUtilityInfo(type, 'email', e.target.value)}
          placeholder="Email de contacto"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea
          value={details?.notes || ''}
          onChange={(e) => updateUtilityInfo(type, 'notes', e.target.value)}
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
        className="w-full mt-2"
      >
        Eliminar este suministro
      </Button>
    </div>
  );
};

export default UtilitiesTab;
