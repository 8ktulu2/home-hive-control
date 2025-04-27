
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, FileText, Calendar, ArrowLeftRight, ChartBar } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoricalDataProps {
  properties: Property[];
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const HistoricalData = ({ properties, selectedYear, onPreviousYear, onNextYear }: HistoricalDataProps) => {
  const [selectedProperty, setSelectedProperty] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState("summary");
  
  // Generar datos históricos simulados para demostración
  const generateHistoricalData = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const historicalData = [];
    
    for (const property of properties) {
      const propertyData = {
        propertyId: property.id,
        propertyName: property.name,
        months: [] as any[]
      };
      
      for (const month of months) {
        const rentAmount = property.rent * (0.9 + Math.random() * 0.2);
        const wasRented = Math.random() > 0.2; // 80% probabilidad de estar alquilado
        
        // Generar gastos simulados
        const expenses = [];
        
        if (Math.random() > 0.5) {
          expenses.push({
            id: `exp-${property.id}-${month}-1`,
            name: 'Comunidad',
            amount: Math.round(property.rent * 0.1),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.7) {
          expenses.push({
            id: `exp-${property.id}-${month}-2`,
            name: 'Reparación',
            amount: Math.round(property.rent * 0.15 * (Math.random() + 0.5)),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.8) {
          expenses.push({
            id: `exp-${property.id}-${month}-3`,
            name: 'IBI (proporcional)',
            amount: Math.round(property.rent * 0.08),
            isPaid: true
          });
        }
        
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const netIncome = wasRented ? rentAmount - totalExpenses : -totalExpenses;
        
        propertyData.months.push({
          month,
          wasRented,
          rentAmount: wasRented ? rentAmount : 0,
          expenses,
          totalExpenses,
          netIncome
        });
      }
      
      historicalData.push(propertyData);
    }
    
    return historicalData;
  };

  const historicalData = generateHistoricalData();
  
  // Filtrar datos por propiedad seleccionada
  const filteredData = selectedProperty === "all" 
    ? historicalData 
    : historicalData.filter(data => data.propertyId === selectedProperty);
  
  // Calcular totales anuales
  const calculateAnnualTotals = () => {
    const allMonthsData = filteredData.flatMap(property => 
      property.months.map(month => ({
        propertyName: property.propertyName,
        ...month
      }))
    );
    
    const totalRent = allMonthsData.reduce((sum, month) => sum + month.rentAmount, 0);
    const totalExpenses = allMonthsData.reduce((sum, month) => sum + month.totalExpenses, 0);
    const totalProfit = totalRent - totalExpenses;
    const rentedMonths = allMonthsData.filter(month => month.wasRented).length;
    const vacantMonths = allMonthsData.length - rentedMonths;
    const occupancyRate = (rentedMonths / allMonthsData.length) * 100;
    
    return {
      totalRent,
      totalExpenses,
      totalProfit,
      rentedMonths,
      vacantMonths,
      occupancyRate
    };
  };
  
  const annualTotals = calculateAnnualTotals();
  
  // Obtener un arreglo de meses
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="bg-[#1A1F2C] text-white rounded-lg p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousYear}
            className="bg-transparent border-[#8E9196] text-white hover:bg-[#292F3F] hover:text-white"
          >
            &lt;
          </Button>
          <div className="flex items-center gap-2 bg-[#292F3F] px-3 py-1 rounded-md">
            <Calendar className="h-4 w-4 text-[#E5DEFF]" />
            <span className="font-medium text-[#E5DEFF]">Ejercicio Fiscal {selectedYear}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextYear}
            className="bg-transparent border-[#8E9196] text-white hover:bg-[#292F3F] hover:text-white"
          >
            &gt;
          </Button>
        </div>
        
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger className="w-[200px] bg-[#292F3F] border-[#8E9196] text-white">
            <SelectValue placeholder="Todas las propiedades" />
          </SelectTrigger>
          <SelectContent className="bg-[#292F3F] border-[#8E9196] text-white">
            <SelectItem value="all">Todas las propiedades</SelectItem>
            {properties.map(property => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Badge className="bg-[#8B5CF6] text-white hover:bg-[#7048e8]">
        <FileText className="h-4 w-4 mr-1" /> Datos para Declaración Fiscal
      </Badge>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-6 bg-[#292F3F]">
          <TabsTrigger 
            value="summary" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Resumen Anual
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Detalle Mensual
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Gastos Deducibles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#292F3F] border-none">
              <CardHeader>
                <CardTitle className="text-white">Resumen Fiscal {selectedYear}</CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Datos consolidados para la declaración de impuestos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(annualTotals.totalRent)}
                      </p>
                    </div>
                    <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
                  </div>
                  
                  <Separator className="bg-[#8E9196]/20" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Gastos Deducibles</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(annualTotals.totalExpenses)}
                      </p>
                    </div>
                    <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
                  </div>
                  
                  <Separator className="bg-[#8E9196]/20" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Rendimiento Neto</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(annualTotals.totalProfit)}
                      </p>
                    </div>
                    <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#292F3F] border-none">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas de Ocupación</CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Análisis de ocupación para el año {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Tasa de Ocupación</p>
                      <p className="text-2xl font-bold text-white">
                        {annualTotals.occupancyRate.toFixed(1)}%
                      </p>
                    </div>
                    <ChartBar className="h-7 w-7 text-[#8B5CF6]" />
                  </div>
                  
                  <Separator className="bg-[#8E9196]/20" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Meses Alquilados</p>
                      <p className="text-2xl font-bold text-white">
                        {annualTotals.rentedMonths}
                      </p>
                    </div>
                    <div className="flex items-center text-green-500">
                      <Check className="h-5 w-5 mr-1" />
                    </div>
                  </div>
                  
                  <Separator className="bg-[#8E9196]/20" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#8E9196]">Meses Vacíos</p>
                      <p className="text-2xl font-bold text-white">
                        {annualTotals.vacantMonths}
                      </p>
                    </div>
                    <div className="flex items-center text-red-500">
                      <X className="h-5 w-5 mr-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card className="bg-[#292F3F] border-none">
            <CardHeader>
              <CardTitle className="text-white">Detalle Mensual {selectedYear}</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Registro mensual de ingresos y gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-[#8E9196]/30">
                      <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                      <TableHead className="text-[#E5DEFF]">Mes</TableHead>
                      <TableHead className="text-[#E5DEFF]">Estado</TableHead>
                      <TableHead className="text-[#E5DEFF] text-right">Ingresos</TableHead>
                      <TableHead className="text-[#E5DEFF] text-right">Gastos</TableHead>
                      <TableHead className="text-[#E5DEFF] text-right">Rendimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.flatMap(property => 
                      property.months.map((monthData, index) => (
                        <TableRow 
                          key={`${property.propertyId}-${index}`}
                          className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60"
                        >
                          <TableCell className="text-white">{property.propertyName}</TableCell>
                          <TableCell className="text-white">{monthData.month}</TableCell>
                          <TableCell>
                            {monthData.wasRented ? (
                              <Badge className="bg-green-500/20 text-green-500 border border-green-500">
                                Alquilado
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-500 border border-red-500">
                                Vacío
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-white">
                            {formatCurrency(monthData.rentAmount)}
                          </TableCell>
                          <TableCell className="text-right text-white">
                            {formatCurrency(monthData.totalExpenses)}
                          </TableCell>
                          <TableCell className={`text-right ${
                            monthData.netIncome >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {formatCurrency(monthData.netIncome)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card className="bg-[#292F3F] border-none">
            <CardHeader>
              <CardTitle className="text-white">Gastos Deducibles {selectedYear}</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Desglose detallado de gastos para la declaración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.flatMap(property => 
                  property.months.flatMap((monthData, monthIndex) => 
                    monthData.expenses.map((expense, expenseIndex) => (
                      <Card
                        key={`${property.propertyId}-${monthIndex}-${expenseIndex}`}
                        className="bg-[#292F3F]/50 border border-[#8E9196]/20"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-medium">{expense.name}</h4>
                              <p className="text-xs text-[#8E9196]">{property.propertyName}</p>
                            </div>
                            <Badge className="bg-[#E5DEFF]/10 text-[#E5DEFF] border border-[#E5DEFF]/20">
                              {monthData.month}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between">
                              <span className="text-[#8E9196]">Importe:</span>
                              <span className="text-white font-medium">
                                {formatCurrency(expense.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#8E9196]">Estado:</span>
                              <span className="text-green-500 flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Pagado
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-md p-4 mt-4">
        <h3 className="text-lg font-medium text-[#E5DEFF] mb-2">Información para la Declaración</h3>
        <p className="text-[#8E9196] text-sm">
          Los datos mostrados en esta sección están formateados para facilitar la declaración de la renta. 
          Recuerde que los ingresos derivados del alquiler deben declararse como rendimientos de capital inmobiliario.
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#292F3F] p-3 rounded">
            <p className="text-white font-medium">Total Base Imponible</p>
            <p className="text-xl font-bold text-[#8B5CF6]">
              {formatCurrency(annualTotals.totalRent)}
            </p>
          </div>
          <div className="bg-[#292F3F] p-3 rounded">
            <p className="text-white font-medium">Total Gastos Deducibles</p>
            <p className="text-xl font-bold text-[#8B5CF6]">
              {formatCurrency(annualTotals.totalExpenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;
