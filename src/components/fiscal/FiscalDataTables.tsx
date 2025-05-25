
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, Receipt, TrendingUp } from 'lucide-react';

interface FiscalDataTablesProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const FiscalDataTables: React.FC<FiscalDataTablesProps> = ({
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

  // Desglose de gastos detallado
  const expenseBreakdown = properties.map(property => {
    const ibi = property.taxInfo?.ibiAnnual || property.ibi || 0;
    const community = property.taxInfo?.communityFeesAnnual || (property.communityFee || 0) * 12;
    const homeInsurance = property.homeInsurance?.cost || 0;
    const lifeInsurance = property.lifeInsurance?.cost || 0;
    const mortgage = property.taxInfo?.mortgageInterest || property.mortgage?.annualInterest || 0;
    const depreciation = property.taxInfo?.buildingDepreciation || 0;
    
    return {
      property: property.name,
      ibi,
      community,
      insurance: homeInsurance + lifeInsurance,
      mortgage,
      depreciation,
      other: (property.monthlyExpenses || [])
        .filter(expense => expense.year === selectedYear && expense.isPaid)
        .reduce((sum, expense) => sum + expense.amount, 0),
      total: ibi + community + homeInsurance + lifeInsurance + mortgage + depreciation
    };
  });

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="summary">Resumen por Propiedad</TabsTrigger>
        <TabsTrigger value="expenses">Desglose de Gastos</TabsTrigger>
        <TabsTrigger value="fiscal">Declaración IRPF</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Resumen Fiscal por Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propiedad</TableHead>
                  <TableHead className="text-right">Ingresos Brutos</TableHead>
                  <TableHead className="text-right">Gastos Deducibles</TableHead>
                  <TableHead className="text-right">Rendimiento Neto</TableHead>
                  <TableHead className="text-right">Rentabilidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiscalData.propertyDetails.map((property) => {
                  const profitability = property.grossIncome > 0 
                    ? ((property.netProfit / property.grossIncome) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(property.grossIncome)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(property.expenses)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={property.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}>
                          {formatCurrency(property.netProfit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={parseFloat(profitability) >= 0 ? 'default' : 'destructive'}>
                          {profitability}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="border-t-2 border-gray-300 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(fiscalData.grossIncome)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatCurrency(fiscalData.deductibleExpenses)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    {formatCurrency(fiscalData.netProfit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {fiscalData.grossIncome > 0 ? 
                        ((fiscalData.netProfit / fiscalData.grossIncome) * 100).toFixed(1) : '0.0'
                      }%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Desglose Detallado de Gastos Deducibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propiedad</TableHead>
                  <TableHead className="text-right">IBI</TableHead>
                  <TableHead className="text-right">Comunidad</TableHead>
                  <TableHead className="text-right">Seguros</TableHead>
                  <TableHead className="text-right">Hipoteca</TableHead>
                  <TableHead className="text-right">Amortización</TableHead>
                  <TableHead className="text-right">Otros</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseBreakdown.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.property}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.ibi)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.community)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.insurance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.mortgage)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.depreciation)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.other)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fiscal">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Datos para Declaración IRPF - Modelo 100
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Apartado C - Rendimientos Capital Inmobiliario</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Casilla 001 - Ingresos íntegros</TableCell>
                        <TableCell className="text-right">{formatCurrency(fiscalData.grossIncome)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Casilla 002 - Gastos deducibles</TableCell>
                        <TableCell className="text-right">{formatCurrency(fiscalData.deductibleExpenses)}</TableCell>
                      </TableRow>
                      <TableRow className="border-t-2">
                        <TableCell className="font-bold">Rendimiento neto</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(fiscalData.netProfit)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Estimaciones Fiscales</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Base imponible estimada</TableCell>
                        <TableCell className="text-right">{formatCurrency(fiscalData.taxableBase)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cuota íntegra (24%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(fiscalData.irpfQuota)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Retenciones (estimadas)</TableCell>
                        <TableCell className="text-right">{formatCurrency(fiscalData.retentions)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800 mb-2">Documentación Requerida</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Contratos de arrendamiento firmados</li>
                  <li>• Justificantes de pago del IBI</li>
                  <li>• Recibos de gastos de comunidad</li>
                  <li>• Pólizas y recibos de seguros</li>
                  <li>• Facturas de reparaciones y mantenimiento</li>
                  <li>• Certificados de retenciones (si aplica)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FiscalDataTables;
