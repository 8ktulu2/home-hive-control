
import { Property } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MortgageInfo } from './finances/MortgageInfo';
import InsuranceInfo from './finances/InsuranceInfo';
import { FiscalAmortizationGuide } from '@/components/finances/historical/fiscal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface FinancesTabProps {
  property: Property;
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  calculateTotalExpenses: () => number;
  updateInsuranceCompany: (value: string) => void;
}

const FinancesTab = ({ 
  property, 
  setProperty, 
  calculateTotalExpenses,
  updateInsuranceCompany 
}: FinancesTabProps) => {
  const updateNumericValue = (field: string, subField: string | null, value: number) => {
    if (!property) return;
    
    if (subField) {
      // Manejar campos anidados (como homeInsurance.cost)
      if (field === 'homeInsurance' || field === 'lifeInsurance') {
        const currentValue = property[field] || {};
        setProperty({
          ...property,
          [field]: {
            ...currentValue,
            cost: value
          }
        });
      } else {
        // Para otros campos con subfields
        const currentFieldValue = property[field as keyof Property] || {};
        setProperty({
          ...property,
          [field]: {
            ...currentFieldValue as object,
            [subField]: value
          }
        });
      }
    } else {
      // Manejar campos directos (como ibi)
      setProperty({
        ...property,
        [field]: value
      });
    }
  };
  
  const handleRentChange = (value: string) => {
    const rent = parseFloat(value) || 0;
    setProperty({
      ...property,
      rent: rent,
      expenses: calculateTotalExpenses(),
      netIncome: rent - calculateTotalExpenses(),
    });
  };
  
  const handleRentPaidChange = (checked: boolean) => {
    setProperty({
      ...property,
      rentPaid: checked,
    });
  };

  const handleMortgageChange = (mortgage: any) => {
    setProperty({
      ...property,
      mortgage
    });
  };
  
  // Función para actualizar datos fiscales
  const updateTaxField = (field: string, value: any) => {
    setProperty({
      ...property,
      taxInfo: {
        ...property.taxInfo,
        [field]: value
      }
    });
  };
  
  return (
    <div className="space-y-6 overflow-visible">
      <Card>
        <CardHeader>
          <CardTitle>Información Financiera del Alquiler</CardTitle>
          <CardDescription>
            Datos básicos de ingresos por alquiler y gastos mensuales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Renta Mensual (€)</Label>
                <Input
                  type="number"
                  value={property.rent || 0}
                  onChange={(e) => handleRentChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="rent-paid"
                  checked={property.rentPaid}
                  onCheckedChange={handleRentPaidChange}
                />
                <Label htmlFor="rent-paid">
                  Renta Pagada
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label>IBI (€/año)</Label>
                <Input
                  type="number"
                  value={property.ibi || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setProperty({
                      ...property,
                      ibi: value,
                      expenses: calculateTotalExpenses(),
                      netIncome: property.rent - calculateTotalExpenses(),
                    });
                  }}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cuota Comunidad (€/mes)</Label>
                <Input
                  type="number"
                  value={property.communityFee || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setProperty({
                      ...property,
                      communityFee: value,
                      expenses: calculateTotalExpenses(),
                      netIncome: property.rent - calculateTotalExpenses(),
                    });
                  }}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="cadastralReference">Referencia Catastral</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">La referencia catastral identifica el inmueble en la declaración (Apartado C, Renta Web).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cadastralReference"
                  value={property.cadastralReference || ''}
                  onChange={(e) => setProperty({
                    ...property,
                    cadastralReference: e.target.value
                  })}
                  placeholder="Ej: 9872023VH5797S0001WX"
                  maxLength={20}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="acquisitionCost">Coste de Adquisición (€)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">Valor de compra del inmueble. Se utiliza para calcular la amortización (3% anual, excluido el valor del suelo).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="acquisitionCost"
                  type="number"
                  value={property.taxInfo?.acquisitionCost || ''}
                  onChange={(e) => updateTaxField('acquisitionCost', parseFloat(e.target.value) || 0)}
                  placeholder="Ejemplo: 150000"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="landValue">Valor del Suelo (€)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">Parte del valor del inmueble correspondiente al terreno. No se amortiza y suele constar en la escritura o impuesto IBI.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="landValue"
                  type="number"
                  value={property.taxInfo?.landValue || ''}
                  onChange={(e) => updateTaxField('landValue', parseFloat(e.target.value) || 0)}
                  placeholder="Ejemplo: 50000"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="furnitureValue">Valor del Mobiliario (€)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">Valor total de muebles y enseres. Se amortiza al 10% anual.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="furnitureValue"
                  type="number"
                  value={property.taxInfo?.furnitureValue || ''}
                  onChange={(e) => updateTaxField('furnitureValue', parseFloat(e.target.value) || 0)}
                  placeholder="Ejemplo: 5000"
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <CardTitle className="text-base">Características Fiscales del Alquiler</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Switch
                  id="isPrimaryResidence"
                  checked={property.taxInfo?.isPrimaryResidence || false}
                  onCheckedChange={(checked) => updateTaxField('isPrimaryResidence', checked)}
                />
                <div className="grid gap-1">
                  <Label htmlFor="isPrimaryResidence">
                    Vivienda habitual del inquilino
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reducción del 50% en el IRPF sobre el rendimiento neto
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Switch
                  id="isTensionedArea"
                  checked={property.taxInfo?.isTensionedArea || false}
                  onCheckedChange={(checked) => updateTaxField('isTensionedArea', checked)}
                />
                <div className="grid gap-1">
                  <Label htmlFor="isTensionedArea">
                    Zona de mercado residencial tensionado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Puede incrementar la reducción hasta el 90% (Ley 12/2023)
                  </p>
                </div>
              </div>
              
              {property.taxInfo?.isTensionedArea && (
                <div className="flex items-start space-x-2">
                  <Switch
                    id="hasYoungTenant"
                    checked={property.taxInfo?.hasYoungTenant || false}
                    onCheckedChange={(checked) => updateTaxField('hasYoungTenant', checked)}
                  />
                  <div className="grid gap-1">
                    <Label htmlFor="hasYoungTenant">
                      Inquilino joven (18-35 años)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Permite incrementar la reducción al 70% en zonas tensionadas
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-2">
                <Switch
                  id="recentlyRenovated"
                  checked={property.taxInfo?.recentlyRenovated || false}
                  onCheckedChange={(checked) => updateTaxField('recentlyRenovated', checked)}
                />
                <div className="grid gap-1">
                  <Label htmlFor="recentlyRenovated">
                    Rehabilitación en los últimos 2 años
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Puede optar a reducción del 60% (Ley 12/2023)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Switch
                  id="rentReduction"
                  checked={property.taxInfo?.rentReduction || false}
                  onCheckedChange={(checked) => updateTaxField('rentReduction', checked)}
                />
                <div className="grid gap-1">
                  <Label htmlFor="rentReduction">
                    Reducción de renta ≥5% respecto a contrato anterior
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Puede incrementar la reducción hasta el 90% en zonas tensionadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hipoteca y Seguros</CardTitle>
          <CardDescription>
            Información detallada sobre hipoteca y seguros asociados al inmueble
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MortgageInfo
            mortgage={property.mortgage}
            onMortgageChange={handleMortgageChange}
          />
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <CardTitle className="text-base">Desglose de Hipoteca (€/año)</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="totalMortgagePayment">Total Cuota Hipotecaria (€/año)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">Suma total de las cuotas mensuales pagadas en el año.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="totalMortgagePayment"
                  type="number"
                  value={property.taxInfo?.totalMortgagePayment || property.mortgage?.monthlyPayment ? property.mortgage.monthlyPayment * 12 : ''}
                  onChange={(e) => updateTaxField('totalMortgagePayment', parseFloat(e.target.value) || 0)}
                  placeholder="Ejemplo: 6000 €/año"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="mortgageInterest">Intereses de Hipoteca (€/año, deducibles)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">Solo los intereses son deducibles en la declaración. Ver cuadro de amortización del banco.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="mortgageInterest"
                  type="number"
                  value={property.taxInfo?.mortgageInterest || ''}
                  onChange={(e) => updateTaxField('mortgageInterest', parseFloat(e.target.value) || 0)}
                  placeholder="Ejemplo: 2000 €/año"
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <InsuranceInfo
            property={property}
            updateNumericValue={updateNumericValue}
            updateInsuranceCompany={updateInsuranceCompany}
          />
        </CardContent>
      </Card>
      
      <FiscalAmortizationGuide />
    </div>
  );
};

export default FinancesTab;
