
import React, { useState } from 'react';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, Percent, HelpCircle } from 'lucide-react';

interface FiscalIRPFDeclarationProps {
  fiscalData: FiscalData;
  selectedYear: number;
}

const FiscalIRPFDeclaration: React.FC<FiscalIRPFDeclarationProps> = ({
  fiscalData,
  selectedYear
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Base Imponible',
      value: formatCurrency(fiscalData.taxableBase),
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      tooltip: 'Rendimiento neto que se integra en la base imponible general del IRPF'
    },
    {
      title: 'Cuota IRPF Estimada',
      value: formatCurrency(fiscalData.irpfQuota),
      icon: Percent,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      tooltip: 'Estimación de la cuota íntegra aplicando el tipo medio del IRPF (24%)'
    },
    {
      title: 'Retenciones',
      value: formatCurrency(fiscalData.retentions),
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      tooltip: 'Retenciones e ingresos a cuenta practicados durante el ejercicio'
    }
  ];

  const declarationModels = [
    {
      id: 'modelo-100',
      title: 'Modelo 100 - Declaración de la Renta',
      description: 'Declaración anual del IRPF para residentes fiscales en España',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Apartado C - Rendimientos del Capital Inmobiliario</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Casilla 001 - Ingresos íntegros:</span>
                <span className="font-medium">{formatCurrency(fiscalData.grossIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Casilla 002 - Gastos deducibles:</span>
                <span className="font-medium">{formatCurrency(fiscalData.deductibleExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Casilla 003 - Rendimiento neto previo:</span>
                <span className="font-medium">{formatCurrency(fiscalData.netProfit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Casilla 005 - Rendimiento neto final:</span>
                <span className="font-medium text-blue-600">{formatCurrency(fiscalData.taxableBase)}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Plazo de presentación:</strong> Del 6 de abril al 30 de junio del año siguiente</p>
            <p><strong>Documentación necesaria:</strong> Contratos de arrendamiento, justificantes de ingresos y gastos, certificado de retenciones</p>
          </div>
        </div>
      )
    },
    {
      id: 'modelo-210',
      title: 'Modelo 210 - No Residentes',
      description: 'Declaración trimestral para arrendadores no residentes en España',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Obligaciones para No Residentes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ingresos brutos trimestrales:</span>
                <span className="font-medium">{formatCurrency(fiscalData.grossIncome / 4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Retención (19%):</span>
                <span className="font-medium">{formatCurrency(fiscalData.grossIncome * 0.19 / 4)}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Frecuencia:</strong> Declaración trimestral</p>
            <p><strong>Plazos:</strong> 1T (20 abril), 2T (20 julio), 3T (20 octubre), 4T (20 enero)</p>
          </div>
        </div>
      )
    },
    {
      id: 'modelo-123',
      title: 'Modelo 123 - Retenciones de Capital Inmobiliario',
      description: 'Declaración trimestral de retenciones practicadas por empresas',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Retenciones e Ingresos a Cuenta</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base de retención anual:</span>
                <span className="font-medium">{formatCurrency(fiscalData.grossIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Retención (19%):</span>
                <span className="font-medium">{formatCurrency(fiscalData.grossIncome * 0.19)}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Aplicable a:</strong> Empresas que actúan como retenedoras</p>
            <p><strong>Tipo de retención:</strong> 19% sobre ingresos íntegros</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} ${card.borderColor} border-2`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {card.title}
              </CardTitle>
              <div className="flex items-center gap-1">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">{card.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl lg:text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Declaration Models Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Modelos de Declaración</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {declarationModels.map((model) => (
              <AccordionItem key={model.id} value={model.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{model.title}</div>
                      <div className="text-sm text-gray-600 font-normal">{model.description}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {model.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="bg-yellow-50 border-yellow-200 border-2">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Aviso Legal</h4>
              <p className="text-sm text-yellow-700">
                Esta información tiene carácter orientativo y no sustituye el asesoramiento fiscal profesional. 
                Los cálculos son estimaciones basadas en los datos introducidos y la normativa vigente. 
                Se recomienda consultar con un asesor fiscal antes de realizar las declaraciones.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiscalIRPFDeclaration;
