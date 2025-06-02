
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, TrendingUp, TrendingDown, Calculator, Home, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConsolidatedFiscalReportProps {
  properties: Property[];
  fiscalData: FiscalData;
}

const ConsolidatedFiscalReport: React.FC<ConsolidatedFiscalReportProps> = ({
  properties,
  fiscalData
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getReductionColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header del Informe */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            Informe Fiscal Consolidado - Ejercicio {fiscalData.yearRange}
          </CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            Análisis completo según normativa IRPF española vigente
          </div>
        </CardHeader>
      </Card>

      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-green-700 mb-1">Ingresos Totales</div>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(fiscalData.grossIncome)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Base de cálculo principal
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-sm text-red-700 mb-1">Gastos Deducibles</div>
            <div className="text-2xl font-bold text-red-800">
              {formatCurrency(fiscalData.deductibleExpenses)}
            </div>
            <div className="text-xs text-red-600 mt-1">
              Según Art. 23 Ley IRPF
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-blue-700 mb-1">Base Imponible</div>
            <div className="text-2xl font-bold text-blue-800">
              {formatCurrency(fiscalData.taxableBase)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Tras reducciones aplicadas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Home className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm text-purple-700 mb-1">Cuota IRPF</div>
            <div className="text-2xl font-bold text-purple-800">
              {formatCurrency(fiscalData.irpfQuota)}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Estimación según tramos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explicación de Reducciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Reducciones Aplicadas según Normativa Española
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Ley 12/2023 de Vivienda - Reducciones Vigentes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">90%</Badge>
                    <span>Zona tensionada + reducción precio (≥5%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">70%</Badge>
                    <span>Zona tensionada + inquilino joven (18-35)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">60%</Badge>
                    <span>Obras de rehabilitación previas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">50%</Badge>
                    <span>Vivienda habitual (general)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              * Las reducciones se aplican sobre el rendimiento neto (ingresos - gastos deducibles)
              según el artículo 23.2 de la Ley 35/2006 del IRPF y modificaciones de la Ley 12/2023.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose por Propiedades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-indigo-600" />
            Análisis por Propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fiscalData.propertyDetails.map((property, index) => (
              <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{property.name}</h4>
                    {property.address && (
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    )}
                  </div>
                  <Badge className={getReductionColor(property.reductionPercentage)}>
                    Reducción {property.reductionPercentage}%
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Ingresos</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(property.grossIncome)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Gastos</div>
                    <div className="font-semibold text-red-600">
                      {formatCurrency(property.expenses)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Rendimiento Neto</div>
                    <div className="font-semibold text-blue-600">
                      {formatCurrency(property.netProfit)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Base Imponible</div>
                    <div className="font-semibold text-purple-600">
                      {formatCurrency(property.taxableBase)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {property.occupancyMonths}/12 meses
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Meses con ingresos registrados</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="text-muted-foreground">
                      Rentabilidad: {property.grossIncome > 0 ? 
                        formatPercentage((property.netProfit / property.grossIncome) * 100) : '0%'
                      }
                    </div>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          <Info className="h-3 w-3 mr-1" />
                          Motivo reducción
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{property.reductionReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Desglose de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Gastos Deducibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(fiscalData.expenseBreakdown).map(([key, value]) => {
              const labels: Record<string, string> = {
                hipoteca: 'Hipoteca',
                comunidad: 'Comunidad',
                ibi: 'IBI',
                seguroVida: 'Seguro Vida',
                seguroHogar: 'Seguro Hogar',
                compras: 'Compras',
                averias: 'Averías',
                suministros: 'Suministros'
              };
              
              if (value > 0) {
                return (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {labels[key]}
                    </div>
                    <div className="font-semibold text-gray-800">
                      {formatCurrency(value)}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Fiscal Final */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-center">Liquidación Final del Ejercicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground mb-1">Retenciones Aplicadas</div>
                <div className="text-xl font-semibold text-blue-600">
                  {formatCurrency(fiscalData.retentions)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">19% sobre ingresos</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground mb-1">IRPF a Pagar</div>
                <div className="text-xl font-semibold text-red-600">
                  {formatCurrency(fiscalData.irpfQuota)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Según tramos vigentes</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-green-200">
                <div className="text-sm text-muted-foreground mb-1">Liquidez Final</div>
                <div className={`text-xl font-bold ${fiscalData.finalLiquidity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(fiscalData.finalLiquidity)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {fiscalData.finalLiquidity >= 0 ? 'A devolver' : 'A ingresar'}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Este informe es orientativo y se basa en la normativa fiscal española vigente.</p>
              <p>Se recomienda consultar con un asesor fiscal para la declaración definitiva.</p>
              <p>Generado el {new Date().toLocaleDateString('es-ES')} para el ejercicio {fiscalData.yearRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidatedFiscalReport;
