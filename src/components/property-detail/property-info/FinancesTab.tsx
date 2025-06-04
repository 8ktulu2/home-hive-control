
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpenseList } from '../finances/expense-components/ExpenseList';
import { AddExpenseDialog } from '../finances/AddExpenseDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FinancesTabProps {
  property: Property;
  historicalYear?: number;
}

const FinancesTab: React.FC<FinancesTabProps> = ({ property, historicalYear }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['basic']));
  
  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Calculated rent value from payment status
  const calculatePaidRent = () => {
    // This should be calculated from payment history, not editable
    const currentYear = historicalYear || new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    if (property.paymentHistory) {
      const currentPayment = property.paymentHistory.find(
        p => p.year === currentYear && p.month === currentMonth
      );
      return currentPayment?.isPaid ? property.rent : 0;
    }
    return 0;
  };

  return (
    <div className={`space-y-4 ${historicalYear ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' : ''}`}>
      {historicalYear && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-sm text-yellow-800">
          <strong>Finanzas Históricas {historicalYear}</strong> - Datos específicos de este año
        </div>
      )}

      {/* Información Básica del Alquiler */}
      <Card>
        <Collapsible 
          open={openSections.has('basic')} 
          onOpenChange={() => toggleSection('basic')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Información Básica del Alquiler</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openSections.has('basic') ? 'rotate-180' : ''
                }`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Renta Mensual Estipulada</label>
                    <InfoTooltip content="Importe mensual del alquiler según contrato. Se declara en el apartado de rendimientos de capital inmobiliario (casilla 0011)" />
                  </div>
                  <div className="text-lg font-semibold">{property.rent}€</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Renta Mensual Cobrada</label>
                    <InfoTooltip content="Importe realmente cobrado. Se calcula automáticamente del estado de pagos. No editable." />
                  </div>
                  <div className="text-lg font-semibold text-green-600">{calculatePaidRent()}€</div>
                  <p className="text-xs text-muted-foreground">Calculado automáticamente</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Gastos Deducibles */}
      <Card>
        <Collapsible 
          open={openSections.has('expenses')} 
          onOpenChange={() => toggleSection('expenses')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Gastos Deducibles</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openSections.has('expenses') ? 'rotate-180' : ''
                }`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <InfoTooltip content="Gastos que se pueden deducir de los ingresos por alquiler según la normativa fiscal (casillas 0012-0019)" />
                <span className="text-sm text-muted-foreground">Desglose de gastos deducibles</span>
              </div>
              <ExpenseList 
                property={property} 
                onExpenseUpdate={() => {}} 
                onlyDetails
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Características Fiscales */}
      <Card>
        <Collapsible 
          open={openSections.has('fiscal')} 
          onOpenChange={() => toggleSection('fiscal')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Características Fiscales</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openSections.has('fiscal') ? 'rotate-180' : ''
                }`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">IBI Anual</label>
                    <InfoTooltip content="Impuesto sobre Bienes Inmuebles. Deducible como gasto en la casilla 0013. Se prorrateable si no se alquila todo el año." />
                  </div>
                  <div className="text-lg">{property.ibi || 0}€</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Gastos de Comunidad</label>
                    <InfoTooltip content="Gastos de comunidad de propietarios. Deducibles en casilla 0014. Incluye administración, limpieza, ascensor, etc." />
                  </div>
                  <div className="text-lg">{property.communityFee || 0}€/mes</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Suministros del Hogar</label>
                    <InfoTooltip content="Solo deducibles los suministros que corran a cargo del propietario según contrato (agua, luz, gas). Casilla 0015." />
                  </div>
                  <div className="text-lg text-muted-foreground">Según contrato</div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Datos para Amortizaciones */}
      <Card>
        <Collapsible 
          open={openSections.has('amortization')} 
          onOpenChange={() => toggleSection('amortization')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Datos para Amortizaciones</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openSections.has('amortization') ? 'rotate-180' : ''
                }`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Valor de Adquisición</label>
                    <InfoTooltip content="Precio de compra + gastos de adquisición (notaría, registro, etc.). Base para calcular amortización en casilla 0017." />
                  </div>
                  <div className="text-lg text-muted-foreground">Por definir</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Amortización Anual (3%)</label>
                    <InfoTooltip content="Máximo 3% anual del valor de adquisición (excluyendo suelo). Casilla 0017. Solo aplicable si la vivienda tiene más de 3 años." />
                  </div>
                  <div className="text-lg text-muted-foreground">Calculada automáticamente</div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Hipoteca y Seguros */}
      {(property.mortgage || property.homeInsurance || property.lifeInsurance) && (
        <Card>
          <Collapsible 
            open={openSections.has('mortgage')} 
            onOpenChange={() => toggleSection('mortgage')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Hipoteca y Seguros</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    openSections.has('mortgage') ? 'rotate-180' : ''
                  }`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {property.mortgage && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Hipoteca</h4>
                      <InfoTooltip content="Solo son deducibles los intereses de la hipoteca, NO la amortización del capital. Casilla 0016." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Cuota Mensual Total</div>
                        <p className="text-lg">{property.mortgage.monthlyPayment}€</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Intereses Anuales (deducible)</div>
                        <p className="text-lg text-muted-foreground">Consultar certificado bancario</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {property.homeInsurance && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Seguro de Hogar</span>
                        <InfoTooltip content="Prima del seguro de hogar deducible en casilla 0015. Debe cubrir la vivienda arrendada." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-sm">Compañía: {property.homeInsurance.company}</p>
                        <p className="text-sm">Coste anual: {property.homeInsurance.cost}€</p>
                      </div>
                    </div>
                  )}
                  
                  {property.lifeInsurance && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Seguro de Vida</span>
                        <InfoTooltip content="Solo deducible si es obligatorio por la entidad financiera para la hipoteca. Casilla 0015." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-sm">Compañía: {property.lifeInsurance.company}</p>
                        <p className="text-sm">Coste anual: {property.lifeInsurance.cost}€</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Guía Detallada de Amortizaciones y Fiscalidad */}
      <Card>
        <Collapsible 
          open={openSections.has('guide')} 
          onOpenChange={() => toggleSection('guide')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Guía Detallada de Amortizaciones y Fiscalidad</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openSections.has('guide') ? 'rotate-180' : ''
                }`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🏠 Amortización del Inmueble</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Máximo 3% anual del valor de adquisición (excluyendo suelo)</li>
                    <li>• Solo aplicable si la vivienda tiene más de 3 años</li>
                    <li>• Base: precio compra + gastos de adquisición - valor del suelo</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💰 Gastos Menores de 300€</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Se deducen íntegramente el año de compra</li>
                    <li>• No se amortizan, van directamente a gastos</li>
                    <li>• Ejemplo: herramientas, pequeños electrodomésticos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🔧 Reformas y Mejoras</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Conservación: deducible íntegramente el año realizado</li>
                    <li>• Mejora: se amortiza en varios años (3% anual)</li>
                    <li>• Criterio: ¿aumenta el valor o solo mantiene el estado?</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🏦 Intereses de Hipoteca</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Solo deducibles los intereses, NO la amortización del capital</li>
                    <li>• Solicitar certificado anual al banco</li>
                    <li>• Si hay varios inmuebles, prorratear según uso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🏠 Alquiler por Habitaciones</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Prorratear gastos según superficie o número de habitaciones</li>
                    <li>• Distinguir zonas comunes de privadas</li>
                    <li>• Documentar criterio de reparto para Hacienda</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default FinancesTab;
