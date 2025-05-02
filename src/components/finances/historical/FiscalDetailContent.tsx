
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { PropertyHistoricalData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface FiscalDetailContentProps {
  filteredData: PropertyHistoricalData[];
  selectedYear: number;
}

const FiscalDetailContent = ({ filteredData, selectedYear }: FiscalDetailContentProps) => {
  const [activeTab, setActiveTab] = useState('income');
  
  // Calcular datos fiscales para cada propiedad
  const calculateFiscalData = () => {
    return filteredData.map(property => {
      // Acumular ingresos
      const totalRent = property.months.reduce((sum, month) => sum + month.rentAmount, 0);
      
      // Acumular gastos por categoría (ejemplo simplificado)
      const expenses = {
        ibi: 0,
        communityFees: 0,
        mortgageInterest: 0,
        homeInsurance: 0,
        maintenance: 0,
        others: 0
      };
      
      // Calcular gastos a partir de los meses
      property.months.forEach(month => {
        month.expenses.forEach(expense => {
          if (expense.name.toLowerCase().includes('ibi')) {
            expenses.ibi += expense.amount;
          } else if (expense.name.toLowerCase().includes('comunidad')) {
            expenses.communityFees += expense.amount;
          } else if (expense.name.toLowerCase().includes('hipoteca') || expense.name.toLowerCase().includes('interés')) {
            expenses.mortgageInterest += expense.amount;
          } else if (expense.name.toLowerCase().includes('seguro')) {
            expenses.homeInsurance += expense.amount;
          } else if (expense.name.toLowerCase().includes('reparación') || expense.name.toLowerCase().includes('mantenimiento')) {
            expenses.maintenance += expense.amount;
          } else {
            expenses.others += expense.amount;
          }
        });
      });
      
      const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
      const netProfit = totalRent - totalExpenses;
      
      return {
        property: property.propertyName,
        rent: totalRent,
        expenses,
        totalExpenses,
        netProfit
      };
    });
  };
  
  const fiscalData = calculateFiscalData();
  
  // Calcular totales globales
  const totals = fiscalData.reduce((acc, property) => {
    acc.rent += property.rent;
    acc.ibi += property.expenses.ibi;
    acc.communityFees += property.expenses.communityFees;
    acc.mortgageInterest += property.expenses.mortgageInterest;
    acc.homeInsurance += property.expenses.homeInsurance;
    acc.maintenance += property.expenses.maintenance;
    acc.others += property.expenses.others;
    acc.totalExpenses += property.totalExpenses;
    acc.netProfit += property.netProfit;
    return acc;
  }, {
    rent: 0,
    ibi: 0,
    communityFees: 0,
    mortgageInterest: 0,
    homeInsurance: 0,
    maintenance: 0,
    others: 0,
    totalExpenses: 0,
    netProfit: 0
  });

  const handleDownloadCSV = () => {
    // Preparar datos para CSV
    const headers = [
      'Propiedad', 
      'Ingresos Alquiler', 
      'IBI', 
      'Comunidad', 
      'Intereses Hipoteca', 
      'Seguros',
      'Mantenimiento',
      'Otros Gastos',
      'Total Gastos',
      'Beneficio Neto'
    ].join(',');
    
    const rows = fiscalData.map(data => [
      data.property,
      data.rent.toFixed(2),
      data.expenses.ibi.toFixed(2),
      data.expenses.communityFees.toFixed(2),
      data.expenses.mortgageInterest.toFixed(2),
      data.expenses.homeInsurance.toFixed(2),
      data.expenses.maintenance.toFixed(2),
      data.expenses.others.toFixed(2),
      data.totalExpenses.toFixed(2),
      data.netProfit.toFixed(2)
    ].join(','));
    
    // Añadir fila de totales
    rows.push([
      'TOTALES',
      totals.rent.toFixed(2),
      totals.ibi.toFixed(2),
      totals.communityFees.toFixed(2),
      totals.mortgageInterest.toFixed(2),
      totals.homeInsurance.toFixed(2),
      totals.maintenance.toFixed(2),
      totals.others.toFixed(2),
      totals.totalExpenses.toFixed(2),
      totals.netProfit.toFixed(2)
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `datos_fiscales_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Datos para Declaración Fiscal {selectedYear}</CardTitle>
          <CardDescription className="text-[#8E9196]">
            Resumen de ingresos y gastos deducibles en el IRPF
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-[#8B5CF6] text-white hover:bg-[#7048e8] border-none"
          onClick={handleDownloadCSV}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 bg-[#1A1F2C]">
            <TabsTrigger 
              value="income"
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Ingresos
            </TabsTrigger>
            <TabsTrigger 
              value="expenses"
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Gastos Deducibles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#8E9196]/30">
                  <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                  <TableHead className="text-[#E5DEFF] text-right">Ingresos por Alquiler</TableHead>
                  <TableHead className="text-[#E5DEFF] text-right">Subvenciones</TableHead>
                  <TableHead className="text-[#E5DEFF] text-right">Otros Ingresos</TableHead>
                  <TableHead className="text-[#E5DEFF] text-right">Total Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiscalData.map((data, index) => (
                  <TableRow 
                    key={index}
                    className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60"
                  >
                    <TableCell className="text-white">{data.property}</TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(data.rent)}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(0)} {/* Placeholder para subvenciones */}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(0)} {/* Placeholder para otros ingresos */}
                    </TableCell>
                    <TableCell className="text-right text-green-500 font-medium">
                      {formatCurrency(data.rent)}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Fila de totales */}
                <TableRow className="border-t-2 border-[#8B5CF6]/30 bg-[#1A1F2C]/50">
                  <TableCell className="text-white font-bold">TOTALES</TableCell>
                  <TableCell className="text-right text-white font-bold">
                    {formatCurrency(totals.rent)}
                  </TableCell>
                  <TableCell className="text-right text-white font-bold">
                    {formatCurrency(0)}
                  </TableCell>
                  <TableCell className="text-right text-white font-bold">
                    {formatCurrency(0)}
                  </TableCell>
                  <TableCell className="text-right text-green-500 font-bold">
                    {formatCurrency(totals.rent)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="expenses" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#8E9196]/30">
                    <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">IBI</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Comunidad</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Intereses Hipoteca</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Seguros</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Mantenimiento</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Otros</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Total Gastos</TableHead>
                    <TableHead className="text-[#E5DEFF] text-right">Beneficio Neto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiscalData.map((data, index) => (
                    <TableRow 
                      key={index}
                      className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60"
                    >
                      <TableCell className="text-white">{data.property}</TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.ibi)}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.communityFees)}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.mortgageInterest)}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.homeInsurance)}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.maintenance)}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(data.expenses.others)}
                      </TableCell>
                      <TableCell className="text-right text-red-500 font-medium">
                        {formatCurrency(data.totalExpenses)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        data.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {formatCurrency(data.netProfit)}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Fila de totales */}
                  <TableRow className="border-t-2 border-[#8B5CF6]/30 bg-[#1A1F2C]/50">
                    <TableCell className="text-white font-bold">TOTALES</TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.ibi)}
                    </TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.communityFees)}
                    </TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.mortgageInterest)}
                    </TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.homeInsurance)}
                    </TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.maintenance)}
                    </TableCell>
                    <TableCell className="text-right text-white font-bold">
                      {formatCurrency(totals.others)}
                    </TableCell>
                    <TableCell className="text-right text-red-500 font-bold">
                      {formatCurrency(totals.totalExpenses)}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${
                      totals.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatCurrency(totals.netProfit)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-[#1A1F2C] rounded-lg">
          <h3 className="text-[#E5DEFF] font-medium mb-3">Recordatorio para la Declaración de la Renta</h3>
          <ul className="space-y-2">
            <li className="text-sm text-[#8E9196] flex items-start gap-2">
              <span>•</span>
              <span>Rendimiento del capital inmobiliario = Ingresos totales - Gastos deducibles</span>
            </li>
            <li className="text-sm text-[#8E9196] flex items-start gap-2">
              <span>•</span>
              <span>La amortización anual del inmueble es deducible (3% del valor catastral de la construcción)</span>
            </li>
            <li className="text-sm text-[#8E9196] flex items-start gap-2">
              <span>•</span>
              <span>Los intereses de préstamos para adquisición o mejora son deducibles (no la amortización del capital)</span>
            </li>
            <li className="text-sm text-[#8E9196] flex items-start gap-2">
              <span>•</span>
              <span>Consulta con un profesional para obtener todas las deducciones posibles en tu caso específico</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiscalDetailContent;
