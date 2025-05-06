
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator, PieChart, FileText } from 'lucide-react';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';
import { Button } from '@/components/ui/button';
import { AddExpenseDialog } from './AddExpenseDialog';
import { ExpenseList } from './ExpenseList';
import KPIBar from './KPIBar';
import TaxReportSummary from '../property-info/tax-report/TaxReportSummary';
import TaxDataDisplay from '../property-info/tax-report/TaxDataDisplay';
import { useTaxCalculations } from '../property-info/tax-report/useTaxCalculations';
import { FiscalAmortizationGuide } from '@/components/finances/historical/fiscal';

interface CombinedFinancesTabProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const CombinedFinancesTab: React.FC<CombinedFinancesTabProps> = ({ property, setProperty }) => {
  const [activeSubTab, setActiveSubTab] = React.useState('summary');
  const [activeAccordion, setActiveAccordion] = React.useState('property');
  
  const { handleExpenseAdd, handleExpenseUpdate } = useExpenseManagement(property, setProperty);
  
  // Usar el hook de cálculos fiscales
  const {
    grossIncome,
    expenses,
    netIncome,
    reductionPercentage,
    reduction,
    taxableIncome
  } = useTaxCalculations(property);
  
  // Valores seguros para evitar errores si property no tiene ciertos campos
  const rent = property.rent || 0;
  const propertyExpenses = property.expenses || 0;
  const propertyNetIncome = property.netIncome || (rent - propertyExpenses);
  
  return (
    <div className="space-y-6">
      <KPIBar 
        rent={rent}
        expenses={propertyExpenses}
        netIncome={propertyNetIncome}
      />
      
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Resumen Financiero
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Gastos Detallados
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Informe Fiscal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          {/* Sección de hipoteca */}
          {property.mortgage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hipoteca</CardTitle>
                <CardDescription>Desglose de la información hipotecaria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Prestamista</div>
                    <p className="text-muted-foreground">{property.mortgage.lender || 'No especificado'}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Cuota Mensual</div>
                    <p className="text-muted-foreground">{property.mortgage.monthlyPayment}€</p>
                  </div>
                  {property.mortgage.interestRate && (
                    <div>
                      <div className="text-sm font-medium">Tipo de Interés</div>
                      <p className="text-muted-foreground">{property.mortgage.interestRate}%</p>
                    </div>
                  )}
                </div>
                
                {property.taxInfo?.mortgageInterest && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm font-medium">Desglose Fiscal Anual</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <div className="text-xs font-medium">Cuota Total Anual</div>
                        <p className="text-muted-foreground">{(property.mortgage.monthlyPayment * 12).toFixed(2)}€</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium">Intereses (Deducibles)</div>
                        <p className="text-muted-foreground">{property.taxInfo.mortgageInterest}€</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium">Amortización (No Deducible)</div>
                        <p className="text-muted-foreground">
                          {((property.mortgage.monthlyPayment * 12) - property.taxInfo.mortgageInterest).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Sección de seguros */}
          {(property.homeInsurance || property.lifeInsurance) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Seguros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.homeInsurance && (
                  <div>
                    <div className="text-sm font-medium">Seguro de Hogar</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Compañía:</span> {property.homeInsurance.company}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Coste:</span> {property.homeInsurance.cost}€/año
                      </p>
                    </div>
                  </div>
                )}
                
                {property.lifeInsurance && (
                  <div>
                    <div className="text-sm font-medium">Seguro de Vida</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Compañía:</span> {property.lifeInsurance.company}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Coste:</span> {property.lifeInsurance.cost}€/año
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Datos fiscales del inmueble */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos Fiscales del Inmueble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Referencia Catastral</div>
                  <p className="text-muted-foreground">
                    {property.cadastralReference || 'No especificada'}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium">IBI Anual</div>
                  <p className="text-muted-foreground">
                    {property.ibi ? `${property.ibi}€/año` : 'No especificado'}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium">Valor de Adquisición</div>
                  <p className="text-muted-foreground">
                    {property.taxInfo?.acquisitionCost ? `${property.taxInfo.acquisitionCost}€` : 'No especificado'}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium">Valor del Suelo</div>
                  <p className="text-muted-foreground">
                    {property.taxInfo?.landValue ? `${property.taxInfo.landValue}€` : 'No especificado'}
                  </p>
                </div>
              </div>
              
              {property.taxInfo?.acquisitionCost && property.taxInfo?.landValue && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium">Amortización del Inmueble</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-xs font-medium">Valor Construcción</div>
                      <p className="text-muted-foreground">
                        {(property.taxInfo.acquisitionCost - property.taxInfo.landValue).toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-medium">Amortización Anual (3%)</div>
                      <p className="text-muted-foreground">
                        {((property.taxInfo.acquisitionCost - property.taxInfo.landValue) * 0.03).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {property.taxInfo?.furnitureValue && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium">Amortización del Mobiliario</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-xs font-medium">Valor Mobiliario</div>
                      <p className="text-muted-foreground">
                        {property.taxInfo.furnitureValue.toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-medium">Amortización Anual (10%)</div>
                      <p className="text-muted-foreground">
                        {(property.taxInfo.furnitureValue * 0.1).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Gastos Detallados</CardTitle>
              <AddExpenseDialog onExpenseAdd={handleExpenseAdd} />
            </CardHeader>
            <CardContent>
              <ExpenseList 
                property={property} 
                onExpenseUpdate={handleExpenseUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fiscal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos para la Declaración de la Renta</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxDataDisplay
                    property={property}
                    netIncome={netIncome}
                    reductionPercentage={reductionPercentage}
                    activeAccordion={activeAccordion}
                    setActiveAccordion={setActiveAccordion}
                  />
                </CardContent>
              </Card>
              <FiscalAmortizationGuide />
            </div>
            
            <div>
              <TaxReportSummary 
                grossIncome={grossIncome}
                expenses={expenses}
                netIncome={netIncome}
                reductionPercentage={reductionPercentage}
                reduction={reduction}
                taxableIncome={taxableIncome}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CombinedFinancesTab;
