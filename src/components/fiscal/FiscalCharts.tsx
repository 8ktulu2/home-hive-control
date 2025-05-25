
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface FiscalChartsProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const FiscalCharts: React.FC<FiscalChartsProps> = ({
  properties,
  selectedYear,
  fiscalData
}) => {
  // Datos para gráfico de ingresos vs gastos por propiedad
  const propertyData = fiscalData.propertyDetails.map(property => ({
    name: property.name.length > 12 ? property.name.substring(0, 12) + '...' : property.name,
    fullName: property.name,
    ingresos: property.grossIncome,
    gastos: property.expenses,
    beneficio: property.netProfit
  }));

  // Datos para gráfico de distribución de gastos
  const expenseDistribution = [
    { name: 'IBI y Tasas', value: 15, color: '#FF6B6B' },
    { name: 'Comunidad', value: 25, color: '#4ECDC4' },
    { name: 'Seguros', value: 8, color: '#45B7D1' },
    { name: 'Reparaciones', value: 20, color: '#FFA07A' },
    { name: 'Amortización', value: 22, color: '#98D8C8' },
    { name: 'Gastos Financieros', value: 10, color: '#F7DC6F' }
  ];

  // Datos para evolución multi-año (simulados)
  const yearlyEvolution = Array.from({ length: 5 }, (_, i) => {
    const year = selectedYear - 4 + i;
    const baseIncome = fiscalData.grossIncome;
    const variation = (Math.random() - 0.5) * 0.2; // ±20% variación
    return {
      año: year.toString(),
      ingresos: Math.round(baseIncome * (1 + variation)),
      gastos: Math.round(fiscalData.deductibleExpenses * (1 + variation * 0.8)),
      beneficio: Math.round((baseIncome - fiscalData.deductibleExpenses) * (1 + variation))
    };
  });

  const chartConfig = {
    ingresos: {
      label: "Ingresos",
      color: "#22C55E",
    },
    gastos: {
      label: "Gastos", 
      color: "#EF4444",
    },
    beneficio: {
      label: "Beneficio",
      color: "#3B82F6",
    },
  };

  const TooltipIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="properties" className="w-full">
        <div className="px-6 py-4 border-b">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="properties" className="text-xs lg:text-sm px-2 py-2">
              Por Propiedad
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs lg:text-sm px-2 py-2">
              Distribución
            </TabsTrigger>
            <TabsTrigger value="evolution" className="text-xs lg:text-sm px-2 py-2">
              Evolución
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs lg:text-sm px-2 py-2">
              Análisis
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="properties" className="mt-0 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Análisis por Propiedad</h3>
            <TooltipIcon content="Comparativa de ingresos, gastos y beneficios por cada propiedad. Los valores se declaran en el apartado C del Modelo 100." />
          </div>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = propertyData.find(p => p.name === label);
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-semibold">{data?.fullName}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(entry.value as number)}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="ingresos" fill="var(--color-ingresos)" name="Ingresos" />
                  <Bar dataKey="gastos" fill="var(--color-gastos)" name="Gastos" />
                  <Bar dataKey="beneficio" fill="var(--color-beneficio)" name="Beneficio" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-0 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Distribución de Gastos Deducibles</h3>
            <TooltipIcon content="Proporción de cada tipo de gasto deducible según el art. 23 LIRPF. Incluye IBI, comunidad, seguros, reparaciones, amortización (3% anual) y gastos financieros." />
          </div>
          <div className="h-[250px] lg:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={12}
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p>{payload[0].value}% del total de gastos</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="mt-0 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Evolución Temporal (Últimos 5 años)</h3>
            <TooltipIcon content="Tendencia de ingresos, gastos y beneficios en los últimos ejercicios fiscales. Útil para identificar patrones y planificar estrategias fiscales." />
          </div>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyEvolution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="año" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="var(--color-ingresos)" 
                    strokeWidth={3}
                    name="Ingresos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="var(--color-gastos)" 
                    strokeWidth={3}
                    name="Gastos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beneficio" 
                    stroke="var(--color-beneficio)" 
                    strokeWidth={3}
                    name="Beneficio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Análisis Fiscal Detallado</h3>
            <TooltipIcon content="Métricas clave para optimización fiscal: rentabilidad neta, eficiencia de gastos y proyección de cuota IRPF." />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Indicadores de Rentabilidad</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rentabilidad Bruta:</span>
                  <span className="font-medium">{((fiscalData.grossIncome / 100000) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rentabilidad Neta:</span>
                  <span className="font-medium">{((fiscalData.netProfit / fiscalData.grossIncome) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Ratio Gastos/Ingresos:</span>
                  <span className="font-medium">{((fiscalData.deductibleExpenses / fiscalData.grossIncome) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Proyección Fiscal</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Imponible:</span>
                  <span className="font-medium">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(fiscalData.taxableBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cuota Estimada (24%):</span>
                  <span className="font-medium">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(fiscalData.irpfQuota)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidez Final:</span>
                  <span className="font-medium">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(fiscalData.finalLiquidity)}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FiscalCharts;
