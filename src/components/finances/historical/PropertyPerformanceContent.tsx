
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface PropertyPerformanceContentProps {
  metrics: any[];
  filteredPropertyId?: string;
  year: number;
}

const PropertyPerformanceContent = ({ 
  metrics, 
  filteredPropertyId,
  year
}: PropertyPerformanceContentProps) => {
  // Filter metrics by property ID if provided
  const filteredMetrics = filteredPropertyId
    ? metrics.filter(m => m.propertyId === filteredPropertyId)
    : metrics;

  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <CardTitle className="text-white">Indicadores de Rendimiento {year}</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Métricas financieras y de ocupación de tus inmuebles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-[#8E9196]/30">
                <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Ocupación</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Ingresos</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Gastos</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">NOI</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Cap Rate</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMetrics.map((metric) => (
                <TableRow 
                  key={metric.propertyId}
                  className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60"
                >
                  <TableCell className="font-medium text-white">{metric.propertyName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col">
                      <span className="text-white">{metric.occupancyRate.toFixed(1)}%</span>
                      <span className="text-xs text-[#8E9196]">
                        {100 - metric.occupancyRate.toFixed(1)}% vacancia
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col">
                      <span className="text-white">{formatCurrency(metric.grossRentalIncome)}</span>
                      <span className="text-xs text-[#8E9196]">
                        Yield: {metric.grossYield.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col">
                      <span className="text-white">{formatCurrency(metric.totalExpenses)}</span>
                      <span className="text-xs text-[#8E9196]">
                        {metric.expenseRatio.toFixed(1)}% sobre ingresos
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {formatCurrency(metric.netOperatingIncome)}
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {metric.capRate.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {metric.cashOnCashReturn.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
              {filteredMetrics.length > 1 && (
                <TableRow className="border-t-2 border-[#8E9196]/30 font-medium">
                  <TableCell className="text-white">TOTALES</TableCell>
                  <TableCell className="text-right text-white">
                    {(filteredMetrics.reduce((acc, m) => acc + m.occupancyRate, 0) / filteredMetrics.length).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {formatCurrency(filteredMetrics.reduce((acc, m) => acc + m.grossRentalIncome, 0))}
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {formatCurrency(filteredMetrics.reduce((acc, m) => acc + m.totalExpenses, 0))}
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {formatCurrency(filteredMetrics.reduce((acc, m) => acc + m.netOperatingIncome, 0))}
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {(filteredMetrics.reduce((acc, m) => acc + m.capRate, 0) / filteredMetrics.length).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {(filteredMetrics.reduce((acc, m) => acc + m.cashOnCashReturn, 0) / filteredMetrics.length).toFixed(2)}%
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredMetrics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Glosario de Indicadores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A1F2C] p-3 rounded border border-[#8E9196]/20">
                <h4 className="font-medium text-white mb-1">Ocupación</h4>
                <p className="text-sm text-[#8E9196]">Porcentaje del tiempo que la propiedad ha estado alquilada durante el período.</p>
              </div>
              <div className="bg-[#1A1F2C] p-3 rounded border border-[#8E9196]/20">
                <h4 className="font-medium text-white mb-1">NOI (Net Operating Income)</h4>
                <p className="text-sm text-[#8E9196]">Ingresos menos gastos operativos, antes de impuestos y amortizaciones.</p>
              </div>
              <div className="bg-[#1A1F2C] p-3 rounded border border-[#8E9196]/20">
                <h4 className="font-medium text-white mb-1">Cap Rate</h4>
                <p className="text-sm text-[#8E9196]">NOI dividido por el valor del inmueble. Indica el rendimiento anual esperado.</p>
              </div>
              <div className="bg-[#1A1F2C] p-3 rounded border border-[#8E9196]/20">
                <h4 className="font-medium text-white mb-1">ROI (Cash on Cash)</h4>
                <p className="text-sm text-[#8E9196]">Flujo de caja anual dividido entre la inversión inicial. Mide el retorno sobre el capital invertido.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyPerformanceContent;
