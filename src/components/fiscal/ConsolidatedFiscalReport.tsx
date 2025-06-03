
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, PieChart, BarChart3, FileText, Info } from 'lucide-react';

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

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const getReductionExplanation = (percentage: number) => {
    switch (percentage) {
      case 90:
        return "Vivienda en zona tensionada con reducción del precio de alquiler (≥5%)";
      case 70:
        return "Zona tensionada con inquilino joven (18-35 años) o primer alquiler";
      case 60:
        return "Obras de rehabilitación previas al contrato";
      case 50:
        return "Reducción general para arrendamiento de vivienda habitual";
      default:
        return "No es vivienda habitual - sin reducción aplicable";
    }
  };

  const renderProgressBar = (value: number, max: number, color: string = "bg-blue-500") => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: DATOS GLOBALES PARA LA DECLARACIÓN */}
      <Card className="border-2 border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            📋 DATOS CLAVE PARA LA DECLARACIÓN DE LA RENTA {fiscalData.yearRange}
          </CardTitle>
          <p className="text-green-600">
            Información esencial para cumplimentar el Modelo 100 - Rendimientos del Capital Inmobiliario
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Datos principales en grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna 1: Ingresos y Gastos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">💰 INGRESOS Y GASTOS</h3>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-800">📈 Ingresos Totales</span>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(fiscalData.grossIncome)}</span>
                </div>
                <p className="text-xs text-green-700">
                  Casilla 011 del Modelo 100. Incluye todos los importes percibidos por el arrendamiento de inmuebles.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-red-800">📉 Gastos Deducibles</span>
                  <span className="text-2xl font-bold text-red-600">{formatCurrency(fiscalData.deductibleExpenses)}</span>
                </div>
                <p className="text-xs text-red-700">
                  Casilla 012 del Modelo 100. Gastos necesarios según Art. 23 Ley IRPF: intereses hipoteca, IBI, comunidad, seguros, etc.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-800">💼 Rendimiento Neto</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(fiscalData.netProfit)}</span>
                </div>
                <p className="text-xs text-blue-700">
                  Resultado: Ingresos - Gastos. Base para calcular las reducciones aplicables.
                </p>
              </div>
            </div>

            {/* Columna 2: Reducciones y Base Imponible */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">📊 REDUCCIONES Y TRIBUTACIÓN</h3>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-purple-800">🎯 Reducción Aplicada</span>
                  <span className="text-2xl font-bold text-purple-600">{fiscalData.reductionPercentage}%</span>
                </div>
                <p className="text-xs text-purple-700 mb-2">
                  {getReductionExplanation(fiscalData.reductionPercentage)}
                </p>
                <div className="text-sm font-medium text-purple-800">
                  Importe: {formatCurrency(fiscalData.netProfit * (fiscalData.reductionPercentage / 100))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-orange-800">🏛️ Base Imponible</span>
                  <span className="text-2xl font-bold text-orange-600">{formatCurrency(fiscalData.taxableBase)}</span>
                </div>
                <p className="text-xs text-orange-700">
                  Casilla 013 del Modelo 100. Rendimiento Neto tras aplicar las reducciones legales.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">💸 Cuota IRPF Estimada</span>
                  <span className="text-2xl font-bold text-gray-600">{formatCurrency(fiscalData.irpfQuota)}</span>
                </div>
                <p className="text-xs text-gray-700">
                  Estimación según tramos IRPF vigentes. El importe final dependerá de sus demás rentas.
                </p>
              </div>
            </div>
          </div>

          {/* Información sobre retenciones y liquidez */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-indigo-800">🏦 Retenciones (19%)</span>
                <span className="text-xl font-bold text-indigo-600">{formatCurrency(fiscalData.retentions)}</span>
              </div>
              <p className="text-xs text-indigo-700">
                Retenciones aplicadas sobre ingresos brutos. Se compensarán en la declaración final.
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${fiscalData.finalLiquidity >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${fiscalData.finalLiquidity >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {fiscalData.finalLiquidity >= 0 ? '💰 A Devolver' : '📋 A Pagar'}
                </span>
                <span className={`text-xl font-bold ${fiscalData.finalLiquidity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(fiscalData.finalLiquidity))}
                </span>
              </div>
              <p className={`text-xs ${fiscalData.finalLiquidity >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Resultado provisional: Beneficio neto - IRPF + Retenciones aplicadas.
              </p>
            </div>
          </div>

          {/* Resumen de ocupación */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">📊 RESUMEN DE OCUPACIÓN</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{fiscalData.consolidatedSummary.totalProperties}</div>
                <div className="text-yellow-700">Propiedades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{fiscalData.consolidatedSummary.totalMonthsOccupied}</div>
                <div className="text-yellow-700">Meses Ocupados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{formatPercentage(fiscalData.consolidatedSummary.averageOccupancy)}</div>
                <div className="text-yellow-700">Ocupación Media</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{formatPercentage(fiscalData.consolidatedSummary.averageRentability)}</div>
                <div className="text-yellow-700">Rentabilidad Media</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: DESGLOSE GLOBAL DE GASTOS */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-3">
            <PieChart className="h-6 w-6" />
            📊 DESGLOSE DETALLADO DE GASTOS DEDUCIBLES
          </CardTitle>
          <p className="text-blue-600">
            Análisis por categorías según normativa fiscal española
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de gastos */}
            <div className="space-y-3">
              {Object.entries(fiscalData.expenseBreakdown).map(([category, amount]) => {
                if (amount > 0) {
                  const categoryLabels: { [key: string]: { label: string, icon: string, description: string } } = {
                    hipoteca: { 
                      label: 'Intereses Hipoteca', 
                      icon: '🏦', 
                      description: 'Solo la parte de intereses, no el capital' 
                    },
                    comunidad: { 
                      label: 'Gastos Comunidad', 
                      icon: '🏢', 
                      description: 'Cuotas ordinarias y extraordinarias' 
                    },
                    ibi: { 
                      label: 'IBI', 
                      icon: '📄', 
                      description: 'Impuesto sobre Bienes Inmuebles' 
                    },
                    seguroVida: { 
                      label: 'Seguro de Vida', 
                      icon: '💼', 
                      description: 'Vinculado al préstamo hipotecario' 
                    },
                    seguroHogar: { 
                      label: 'Seguro del Hogar', 
                      icon: '🛡️', 
                      description: 'Seguro de la vivienda arrendada' 
                    },
                    compras: { 
                      label: 'Compras y Mobiliario', 
                      icon: '🛒', 
                      description: 'Amortización del mobiliario (10% anual)' 
                    },
                    averias: { 
                      label: 'Reparaciones', 
                      icon: '🔧', 
                      description: 'Gastos de conservación y reparación' 
                    },
                    suministros: { 
                      label: 'Suministros', 
                      icon: '⚡', 
                      description: 'Agua, luz, gas a cargo del propietario' 
                    }
                  };

                  const categoryInfo = categoryLabels[category];
                  const percentage = ((amount / fiscalData.deductibleExpenses) * 100).toFixed(1);

                  return (
                    <div key={category} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryInfo.icon}</span>
                          <div>
                            <span className="font-semibold text-gray-800">{categoryInfo.label}</span>
                            <p className="text-xs text-gray-600">{categoryInfo.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600">{formatCurrency(amount)}</div>
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                      {renderProgressBar(amount, fiscalData.deductibleExpenses, "bg-blue-500")}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Gráfico simulado con barras */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Distribución Visual de Gastos
              </h4>
              <div className="space-y-2">
                {Object.entries(fiscalData.expenseBreakdown)
                  .filter(([_, amount]) => amount > 0)
                  .sort(([_a, a], [_b, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const percentage = (amount / fiscalData.deductibleExpenses) * 100;
                    const categoryLabels: { [key: string]: string } = {
                      hipoteca: '🏦 Hipoteca',
                      comunidad: '🏢 Comunidad',
                      ibi: '📄 IBI',
                      seguroVida: '💼 Seg. Vida',
                      seguroHogar: '🛡️ Seg. Hogar',
                      compras: '🛒 Compras',
                      averias: '🔧 Reparaciones',
                      suministros: '⚡ Suministros'
                    };

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{categoryLabels[category]}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        {renderProgressBar(percentage, 100, "bg-gradient-to-r from-blue-400 to-blue-600")}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: DATOS POR INMUEBLE */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            🏠 DETALLE POR INMUEBLE
          </CardTitle>
          <p className="text-purple-600">
            Información específica de cada propiedad para la declaración
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {fiscalData.propertyDetails.map((property, index) => (
            <div key={property.id} className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    🏠 {property.name}
                  </h3>
                  {property.address && (
                    <p className="text-sm text-gray-600">📍 {property.address}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  Propiedad #{index + 1}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Datos financieros */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-1">💰 Datos Financieros</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <div className="font-medium text-green-800">Ingresos</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(property.grossIncome)}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <div className="font-medium text-red-800">Gastos</div>
                      <div className="text-lg font-bold text-red-600">{formatCurrency(property.expenses)}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="font-medium text-blue-800">Rendimiento</div>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(property.netProfit)}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                      <div className="font-medium text-orange-800">Base Imponible</div>
                      <div className="text-lg font-bold text-orange-600">{formatCurrency(property.taxableBase)}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <div className="text-sm font-medium text-purple-800 mb-1">
                      Reducción Aplicada: {property.reductionPercentage}%
                    </div>
                    <div className="text-xs text-purple-700">{property.reductionReason}</div>
                  </div>
                </div>

                {/* Calendario de ocupación visual */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-1">📅 Ocupación Anual</h4>
                  <div className="grid grid-cols-6 gap-1 text-xs">
                    {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, monthIndex) => {
                      // Aquí podrías integrar datos reales de ocupación por mes
                      const isOccupied = property.occupancyMonths > monthIndex; // Simplificación
                      return (
                        <div
                          key={month}
                          className={`p-2 text-center rounded border ${
                            isOccupied 
                              ? 'bg-green-100 border-green-300 text-green-800' 
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="font-medium">{month}</div>
                          <div className="text-xs">{isOccupied ? '✓' : '✗'}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm text-center">
                    <span className="font-medium">Ocupación: {property.occupancyMonths}/12 meses</span>
                    <span className="text-gray-600 ml-2">
                      ({((property.occupancyMonths / 12) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Información normativa */}
      <Card className="border-2 border-yellow-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardTitle className="text-lg font-bold text-yellow-800 flex items-center gap-3">
            <Info className="h-5 w-5" />
            📖 NORMATIVA APLICADA
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800">📋 Base Legal:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Ley 35/2006, de 28 de noviembre, del Impuesto sobre la Renta de las Personas Físicas</li>
                <li>Ley 12/2023, de 24 de mayo, por el derecho a la vivienda (reducciones especiales)</li>
                <li>Real Decreto 439/2007, por el que se aprueba el Reglamento del IRPF</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">🎯 Reducciones Vigentes (Ley 12/2023):</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>90%:</strong> Zona tensionada con reducción del precio de alquiler (≥5%)</li>
                <li><strong>70%:</strong> Zona tensionada con inquilino joven (18-35 años)</li>
                <li><strong>60%:</strong> Obras de rehabilitación previas al contrato</li>
                <li><strong>50%:</strong> Reducción general para arrendamiento de vivienda habitual</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidatedFiscalReport;
