
import React, { useState } from 'react';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IRPFDeclarationTabProps {
  fiscalData: FiscalData;
  selectedYear: number;
}

const IRPFDeclarationTab: React.FC<IRPFDeclarationTabProps> = ({
  fiscalData,
  selectedYear
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const TooltipIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-4">
      {/* Main Declaration Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              Base Imponible IRPF
              <TooltipIcon content="Rendimiento neto que se integra en la base imponible general del IRPF para aplicar la escala de gravamen correspondiente." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(fiscalData.taxableBase)}
            </div>
            <div className="text-sm text-gray-600">
              Ejercicio {selectedYear}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              Cuota IRPF Estimada
              <TooltipIcon content="Estimación de la cuota íntegra aplicando un tipo medio del 24% sobre la base imponible de rendimientos inmobiliarios." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(fiscalData.irpfQuota)}
            </div>
            <div className="text-sm text-gray-600">
              Tipo aplicado: 24% (estimado)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              Retenciones e Ingresos a Cuenta
              <TooltipIcon content="Retenciones practicadas por empresas arrendadoras o ingresos a cuenta realizados durante el ejercicio fiscal." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(fiscalData.retentions)}
            </div>
            <div className="text-sm text-gray-600">
              A deducir de la cuota líquida
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Declaration Models Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos de Declaración</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="modelo-100">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  Modelo 100 - Declaración de la Renta
                  <TooltipIcon content="Declaración anual del IRPF donde se incluyen los rendimientos del capital inmobiliario en el apartado C." />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Apartado C - Rendimientos del Capital Inmobiliario</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Casilla 001 - Ingresos íntegros:</span>
                        <span className="font-medium">{formatCurrency(fiscalData.grossIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Casilla 002 - Gastos deducibles:</span>
                        <span className="font-medium">{formatCurrency(fiscalData.deductibleExpenses)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-semibold">Rendimiento neto:</span>
                        <span className="font-bold">{formatCurrency(fiscalData.netProfit)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Plazo:</strong> Del 6 de abril al 30 de junio del año siguiente ({selectedYear + 1})
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modelo-210">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  Modelo 210 - No Residentes
                  <TooltipIcon content="Declaración trimestral para arrendadores no residentes en España. Retención del 19% sobre ingresos íntegros." />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Obligaciones para No Residentes</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Declaración trimestral de rentas obtenidas</li>
                      <li>• Retención del 19% sobre ingresos íntegros</li>
                      <li>• No se aplican gastos deducibles en la retención</li>
                      <li>• Posibilidad de declaración anual con gastos</li>
                    </ul>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Plazos trimestrales:</strong> 20 de abril, julio, octubre y enero
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modelo-123">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  Modelo 123 - Retenciones
                  <TooltipIcon content="Declaración trimestral de retenciones practicadas por empresas arrendadoras sobre rendimientos del capital inmobiliario." />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Retenciones por Empresas</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Declaración trimestral de retenciones practicadas</li>
                      <li>• Retención del 19% sobre rendimientos</li>
                      <li>• Obligatorio para personas jurídicas arrendadoras</li>
                      <li>• Emisión de certificados de retenciones</li>
                    </ul>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Aplicable si:</strong> El arrendador es una empresa o sociedad
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Resumen Fiscal {selectedYear}</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div className="flex justify-between">
              <span>Beneficio neto del ejercicio:</span>
              <span className="font-medium">{formatCurrency(fiscalData.netProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cuota IRPF estimada:</span>
              <span className="font-medium">{formatCurrency(fiscalData.irpfQuota)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-semibold">Liquidez final estimada:</span>
              <span className="font-bold">{formatCurrency(fiscalData.finalLiquidity)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IRPFDeclarationTab;
