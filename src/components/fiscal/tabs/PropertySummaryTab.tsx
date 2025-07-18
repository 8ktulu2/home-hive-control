
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertySummaryTabProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const PropertySummaryTab: React.FC<PropertySummaryTabProps> = ({
  properties,
  selectedYear,
  fiscalData
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {fiscalData.propertyDetails.map((property) => {
          const profitability = property.grossIncome > 0 
            ? ((property.netProfit / property.grossIncome) * 100).toFixed(1)
            : '0.0';
          
          return (
            <Card key={property.id} className="property-card">
              <CardContent className="p-3 space-y-2">
                <div className="font-semibold text-sm truncate" title={property.name}>
                  {property.name}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ingresos:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(property.grossIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gastos:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(property.expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Neto:</span>
                    <span className={`font-medium ${property.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(property.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rentabilidad:</span>
                    <Badge variant={parseFloat(profitability) >= 0 ? 'default' : 'destructive'} className="text-xs px-1 py-0">
                      {profitability}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Summary Card */}
      <Card className="bg-blue-50 border-blue-200 w-full">
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-3 text-center">Resumen Total - Ejercicio {selectedYear}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-600 leading-tight">Ingresos Totales</div>
              <div className="font-bold text-green-600 text-sm break-words">
                {formatCurrency(fiscalData.grossIncome)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-600 leading-tight">Gastos Totales</div>
              <div className="font-bold text-red-600 text-sm break-words">
                {formatCurrency(fiscalData.deductibleExpenses)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-600 leading-tight">Beneficio Neto</div>
              <div className="font-bold text-blue-600 text-sm break-words">
                {formatCurrency(fiscalData.netProfit)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-600 leading-tight">Rentabilidad Media</div>
              <div className="font-bold text-sm">
                {fiscalData.grossIncome > 0 ? 
                  ((fiscalData.netProfit / fiscalData.grossIncome) * 100).toFixed(1) : '0.0'
                }%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySummaryTab;
