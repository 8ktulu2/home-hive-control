
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    name: property.name.length > 15 ? property.name.substring(0, 15) + '...' : property.name,
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

  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="properties">Por Propiedad</TabsTrigger>
        <TabsTrigger value="distribution">Distribución Gastos</TabsTrigger>
        <TabsTrigger value="evolution">Evolución Temporal</TabsTrigger>
      </TabsList>
      
      <TabsContent value="properties" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Análisis por Propiedad</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ingresos" fill="var(--color-ingresos)" />
                  <Bar dataKey="gastos" fill="var(--color-gastos)" />
                  <Bar dataKey="beneficio" fill="var(--color-beneficio)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="distribution" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos Deducibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="evolution" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución Temporal (Últimos 5 años)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="año" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="var(--color-ingresos)" 
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="var(--color-gastos)" 
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beneficio" 
                    stroke="var(--color-beneficio)" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FiscalCharts;
