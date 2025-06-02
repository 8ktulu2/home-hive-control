
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExpenseBreakdownTabProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const ExpenseBreakdownTab: React.FC<ExpenseBreakdownTabProps> = ({
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

  const expenseCategories = [
    { key: 'hipoteca', label: 'Hipoteca', color: 'bg-red-100 text-red-800' },
    { key: 'comunidad', label: 'Comunidad', color: 'bg-blue-100 text-blue-800' },
    { key: 'ibi', label: 'IBI', color: 'bg-green-100 text-green-800' },
    { key: 'seguroVida', label: 'Seguro de Vida', color: 'bg-purple-100 text-purple-800' },
    { key: 'seguroHogar', label: 'Seguro de Hogar', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'compras', label: 'Compras', color: 'bg-pink-100 text-pink-800' },
    { key: 'averias', label: 'Averías', color: 'bg-orange-100 text-orange-800' },
    { key: 'suministros', label: 'Suministros', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="space-y-4">
      {/* Resumen Total de Gastos */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg">Resumen Total de Gastos - {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Gastos</div>
              <div className="font-bold text-red-600 text-lg">
                {formatCurrency(fiscalData.deductibleExpenses)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Ingresos Brutos</div>
              <div className="font-bold text-green-600 text-lg">
                {formatCurrency(fiscalData.grossIncome)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">% sobre Ingresos</div>
              <div className="font-bold text-lg">
                {fiscalData.grossIncome > 0 ? 
                  ((fiscalData.deductibleExpenses / fiscalData.grossIncome) * 100).toFixed(1) : '0.0'
                }%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Beneficio Neto</div>
              <div className={`font-bold text-lg ${fiscalData.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(fiscalData.netProfit)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose por Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desglose por Categorías de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {expenseCategories.map((category) => {
              const amount = fiscalData.expenseBreakdown[category.key as keyof typeof fiscalData.expenseBreakdown];
              const percentage = fiscalData.deductibleExpenses > 0 
                ? ((amount / fiscalData.deductibleExpenses) * 100).toFixed(1)
                : '0.0';
              
              return (
                <div key={category.key} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.label}</span>
                    <Badge className={`text-xs ${category.color}`}>
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Desglose por Propiedades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desglose de Gastos por Propiedad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fiscalData.propertyDetails.map((property) => (
              <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{property.name}</h4>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Gastos</div>
                    <div className="font-bold text-red-600">
                      {formatCurrency(property.expenses)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {expenseCategories.map((category) => {
                    const amount = property.expenseBreakdown[category.key as keyof typeof property.expenseBreakdown];
                    
                    if (amount === 0) return null;
                    
                    return (
                      <div key={category.key} className="text-center p-2 bg-white rounded border">
                        <div className="text-xs text-gray-600">{category.label}</div>
                        <div className="font-semibold text-sm">
                          {formatCurrency(amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {property.expenses === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No hay gastos registrados para esta propiedad en {selectedYear}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseBreakdownTab;
