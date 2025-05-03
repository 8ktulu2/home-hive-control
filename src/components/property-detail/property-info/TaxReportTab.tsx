import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  FileText,
  Home,
  Info,
  Users,
  Banknote,
  Percent,
  MinusCircle,
  HelpCircle,
  FileDown,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import TaxInfoTooltip from './tax-report/TaxInfoTooltip';
import IncomeSection from './tax-report/IncomeSection';
import ExpensesSection from './tax-report/ExpensesSection';
import ReductionsSection from './tax-report/ReductionsSection';
import TaxReportSummary from './tax-report/TaxReportSummary';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';

interface TaxReportTabProps {
  property: Property;
}

const TaxReportTab: React.FC<TaxReportTabProps> = ({ property }) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("property");
  
  // Calculate values based on property data
  const calculateGrossIncome = () => {
    const monthlyRent = property.rent || 0;
    const monthsRented = 12; // Default to full year, could be made variable
    return monthlyRent * monthsRented;
  };

  const calculateDeductibleExpenses = () => {
    let expenses = 0;
    
    // Mortgage interest (use direct value from taxInfo if available)
    if (property.taxInfo?.mortgageInterest) {
      expenses += property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.monthlyPayment) {
      // Fallback to estimated interest if not specified
      expenses += property.mortgage.monthlyPayment * 0.8 * 12; // 80% of payment as interest, for 12 months
    }
    
    // IBI (annual property tax)
    if (property.ibi) {
      expenses += property.ibi;
    }
    
    // Community fees
    if (property.communityFee) {
      expenses += property.communityFee;
    }
    
    // Home insurance
    if (property.homeInsurance?.cost) {
      expenses += property.homeInsurance.cost;
    }
    
    // Monthly expenses
    if (property.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        expenses += expense.amount * 12; // Assuming monthly expenses for 12 months
      });
    }
    
    return expenses;
  };

  const grossIncome = calculateGrossIncome();
  const expenses = calculateDeductibleExpenses();
  const netIncome = grossIncome - expenses;
  
  // Determine reduction percentage based on property data
  const calculateReductionPercentage = () => {
    // Base reduction for primary residence
    if (property.taxInfo?.isPrimaryResidence) {
      // Young tenant in tensioned area: 70%
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        return 70;
      }
      // Rent reduction in tensioned area: 90%
      else if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        return 90;
      }
      // Recent renovation: 60%
      else if (property.taxInfo?.recentlyRenovated) {
        return 60;
      }
      // Default reduction for primary residence
      return 50;
    }
    return 0;
  };
  
  const reductionPercentage = calculateReductionPercentage();
  const reduction = (netIncome * reductionPercentage) / 100;
  const taxableIncome = netIncome - reduction;

  const handleExportPDF = () => {
    toast.info("Generando informe PDF detallado...", { duration: 3000 });
    setTimeout(() => {
      try {
        const filename = `Informe_Fiscal_${property.name.replace(/\s+/g, "_")}.pdf`;
        exportPropertyTaxDataToPDF(property, filename);
        
        toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar el informe PDF", { duration: 3000 });
      }
    }, 1500);
  };

  // Only show the tab if we have minimal financial data
  if (!property.rent && !property.mortgage?.monthlyPayment && !property.ibi) {
    return (
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-xl">Informe Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay datos suficientes</h3>
            <p className="text-muted-foreground mt-2">
              Para generar un informe fiscal, necesitas añadir información básica sobre el alquiler, 
              gastos e ingresos en la sección "Finanzas" del inmueble.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.href = `/property/${property.id}/edit`}>
              Editar información del inmueble
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informe para Declaración de la Renta (IRPF)
        </h2>
        <Button 
          onClick={handleExportPDF} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          title="Exportar a PDF con gráficos visuales y explicaciones detalladas"
        >
          <FileDown className="h-4 w-4" /> Generar Informe PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Datos fiscales</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Este informe se basa en la normativa del IRPF (Ley 35/2006, Real Decreto 439/2007, y Ley 12/2023).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion 
                type="single" 
                collapsible 
                className="w-full" 
                defaultValue={activeAccordion}
                onValueChange={setActiveAccordion}
              >
                <AccordionItem value="property">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      <h3 className="font-medium text-left">Datos del Inmueble</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Dirección</span>
                            <TaxInfoTooltip content="La dirección completa del inmueble debe coincidir con los datos catastrales." />
                          </div>
                          <p className="text-sm text-muted-foreground">{property.address || "No especificada"}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Referencia Catastral</span>
                            <TaxInfoTooltip content="La referencia catastral identifica el inmueble en la declaración (Apartado C, Renta Web)." />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {property.cadastralReference || "No especificada"}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Metros cuadrados</span>
                            <TaxInfoTooltip content="El tamaño del inmueble puede afectar al cálculo de ciertas deducciones." />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {property.squareMeters ? `${property.squareMeters} m²` : "No especificados"}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Tipo de inmueble</span>
                            <TaxInfoTooltip content="El tipo de inmueble determina qué reducciones fiscales son aplicables." />
                          </div>
                          <p className="text-sm text-muted-foreground">{property.taxInfo?.propertyType === 'residential' ? 'Vivienda' : property.taxInfo?.propertyType || 'No especificado'}</p>
                        </div>
                        
                        {property.taxInfo?.isTensionedArea !== undefined && (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Zona de mercado residencial tensionado</span>
                              <TaxInfoTooltip content="Las viviendas en zonas tensionadas pueden acceder a reducciones fiscales adicionales." />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {property.taxInfo?.isTensionedArea ? 'Sí' : 'No'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="tenant">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <h3 className="font-medium text-left">Inquilino</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {property.tenants && property.tenants.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        {property.tenants.map((tenant, index) => (
                          <div key={tenant.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Nombre completo</span>
                                <TaxInfoTooltip content="El nombre completo del inquilino puede ser necesario para ciertas deducciones fiscales." />
                              </div>
                              <p className="text-sm text-muted-foreground">{tenant.name || "No especificado"}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Identificación</span>
                                <TaxInfoTooltip content="El DNI/NIE del inquilino puede ser necesario para ciertas deducciones fiscales." />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {tenant.identificationNumber || "No especificada"}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Show young tenant information if applicable */}
                        {property.taxInfo?.hasYoungTenant && property.taxInfo?.isTensionedArea && (
                          <div className="mt-2 py-2 px-3 bg-blue-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-blue-800">Inquilino joven (18-35 años)</span>
                              <TaxInfoTooltip content="Los inquilinos jóvenes en zonas tensionadas permiten acceder a una reducción del 70% sobre el rendimiento neto." />
                            </div>
                            <p className="text-xs text-blue-700 mt-1">
                              Se aplica reducción del 70% según Ley 12/2023
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay inquilinos registrados</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="income">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <h3 className="font-medium text-left">Ingresos</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <IncomeSection property={property} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="expenses">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <MinusCircle className="h-5 w-5" />
                      <h3 className="font-medium text-left">Gastos Deducibles</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ExpensesSection property={property} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="reductions">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <Percent className="h-5 w-5" />
                      <h3 className="font-medium text-left">Reducciones</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ReductionsSection 
                      property={property} 
                      netIncome={netIncome} 
                      reductionPercentage={reductionPercentage} 
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
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
    </div>
  );
};

export default TaxReportTab;
