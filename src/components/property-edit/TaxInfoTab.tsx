
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaxInfoTabProps {
  property: Property;
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>;
}

const TaxInfoTab: React.FC<TaxInfoTabProps> = ({ property, setProperty }) => {
  const updateField = (field: string, value: any) => {
    setProperty({
      ...property,
      taxInfo: {
        ...property.taxInfo,
        [field]: value
      }
    });
  };

  const TaxTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Información Fiscal del Inmueble
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="cadastralReference">Referencia Catastral</Label>
                  <TaxTooltip content="La referencia catastral identifica el inmueble en la declaración (Apartado C, Renta Web)." />
                </div>
                <Input
                  id="cadastralReference"
                  value={property.cadastralReference || ''}
                  onChange={(e) => setProperty({
                    ...property,
                    cadastralReference: e.target.value
                  })}
                  placeholder="Ej: 9872023VH5797S0001WX"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="acquisitionCost">Coste de Adquisición (€)</Label>
                  <TaxTooltip content="Valor de compra del inmueble. Se utiliza para calcular la amortización (3% anual, excluido el valor del suelo)." />
                </div>
                <Input
                  id="acquisitionCost"
                  type="number"
                  value={property.taxInfo?.acquisitionCost || ''}
                  onChange={(e) => updateField('acquisitionCost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="landValue">Valor del Suelo (€)</Label>
                  <TaxTooltip content="Parte del valor del inmueble correspondiente al terreno. No se amortiza y suele constar en la escritura o impuesto IBI." />
                </div>
                <Input
                  id="landValue"
                  type="number"
                  value={property.taxInfo?.landValue || ''}
                  onChange={(e) => updateField('landValue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="propertyType">Tipo de Inmueble</Label>
                  <TaxTooltip content="El tipo de inmueble determina ciertas deducciones fiscales." />
                </div>
                <Select
                  value={property.taxInfo?.propertyType || 'residential'}
                  onValueChange={(value) => updateField('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Vivienda</SelectItem>
                    <SelectItem value="commercial">Local comercial</SelectItem>
                    <SelectItem value="garage">Garaje</SelectItem>
                    <SelectItem value="storage">Trastero</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                    <SelectItem value="industrial">Nave industrial</SelectItem>
                    <SelectItem value="office">Oficina</SelectItem>
                    <SelectItem value="tourist">Apartamento turístico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label>Características Fiscales</Label>
                  <TaxTooltip content="Características que determinan las posibles reducciones fiscales." />
                </div>
                
                <div className="flex items-start space-x-2 mt-4">
                  <Checkbox
                    id="isPrimaryResidence"
                    checked={property.taxInfo?.isPrimaryResidence || false}
                    onCheckedChange={(checked) => updateField('isPrimaryResidence', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="isPrimaryResidence"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Vivienda habitual del inquilino
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reducción del 50% en el IRPF sobre el rendimiento neto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-2">
                  <Checkbox
                    id="isTensionedArea"
                    checked={property.taxInfo?.isTensionedArea || false}
                    onCheckedChange={(checked) => updateField('isTensionedArea', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="isTensionedArea"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Zona de mercado residencial tensionado
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Puede incrementar la reducción hasta el 90% (Ley 12/2023)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-2">
                  <Checkbox
                    id="hasYoungTenant"
                    checked={property.taxInfo?.hasYoungTenant || false}
                    onCheckedChange={(checked) => updateField('hasYoungTenant', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="hasYoungTenant"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Inquilino joven (18-35 años)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Puede incrementar la reducción en zonas tensionadas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-2">
                  <Checkbox
                    id="recentlyRenovated"
                    checked={property.taxInfo?.recentlyRenovated || false}
                    onCheckedChange={(checked) => updateField('recentlyRenovated', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="recentlyRenovated"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Rehabilitación en los últimos 2 años
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Puede optar a reducción del 60% (Ley 12/2023)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Información fiscal importante</h3>
            <p className="text-xs text-blue-600">
              Los datos facilitados en esta sección se utilizarán para calcular las deducciones y reducciones 
              aplicables según la normativa vigente del IRPF (Ley 35/2006, Real Decreto 439/2007, y Ley 12/2023).
              Recuerde guardar los justificantes de todos los gastos deducibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxInfoTab;
