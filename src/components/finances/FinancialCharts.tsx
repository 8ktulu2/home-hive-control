
import { Property } from '@/types/property';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/formatters';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { Link } from 'react-router-dom';

export interface FinancialChartsProps {
  properties: Property[];
  selectedMonth: Date;
  showAllProperties: boolean;
}

const FinancialCharts = ({ properties, selectedMonth, showAllProperties }: FinancialChartsProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Datos para el gráfico de pastel de distribución de ingresos
  const incomeDistributionData = properties.map((property, index) => ({
    name: property.name,
    value: property.rent,
    color: COLORS[index % COLORS.length]
  }));
  
  // Datos para el gráfico de barras de ingresos vs gastos
  const incomeExpenseData = properties.map(property => ({
    name: property.name.length > 10 ? property.name.substring(0, 10) + '...' : property.name,
    ingresos: property.rent,
    gastos: property.expenses,
    beneficio: property.netIncome
  }));
  
  // Datos para el gráfico de línea de evolución histórica (simulados)
  const generateHistoricalData = () => {
    const data = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    
    // Generamos datos para 12 meses
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      
      // Simulamos valores con pequeñas variaciones
      let totalRent = properties.reduce((sum, p) => sum + p.rent, 0);
      let totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
      
      // Añadimos algunas variaciones para hacer el gráfico más interesante
      const rentVariation = 0.95 + (Math.random() * 0.1);
      const expenseVariation = 0.97 + (Math.random() * 0.06);
      
      totalRent *= rentVariation;
      totalExpenses *= expenseVariation;
      
      data.push({
        name: months[monthIndex],
        ingresos: Math.round(totalRent),
        gastos: Math.round(totalExpenses),
        beneficio: Math.round(totalRent - totalExpenses)
      });
    }
    
    return data;
  };
  
  const historicalData = generateHistoricalData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Ingresos</CardTitle>
            <CardDescription>
              Contribución de cada propiedad a los ingresos totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={{
                ingresos: { color: '#0088FE' }
              }}>
                <PieChart>
                  <Pie
                    data={incomeDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
            <CardDescription>
              Comparativa de ingresos y gastos por propiedad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={{
                ingresos: { color: '#0088FE' },
                gastos: { color: '#FF8042' },
                beneficio: { color: '#00C49F' }
              }}>
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#0088FE" />
                  <Bar dataKey="gastos" fill="#FF8042" />
                  <Bar dataKey="beneficio" fill="#00C49F" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Evolución Histórica</CardTitle>
          <CardDescription>
            Evolución de ingresos, gastos y beneficios en los últimos 12 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer config={{
              ingresos: { color: '#0088FE' },
              gastos: { color: '#FF8042' },
              beneficio: { color: '#00C49F' }
            }}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#0088FE" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="gastos" stroke="#FF8042" />
                <Line type="monotone" dataKey="beneficio" stroke="#00C49F" />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
