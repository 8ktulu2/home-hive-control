
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialOverview from '@/components/finances/FinancialOverview';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import RentHistory from '@/components/finances/RentHistory';
import FinancialCharts from '@/components/finances/FinancialCharts';
import { mockProperties } from '@/data/mockData';

const Finances = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calcular datos financieros globales
  const financialSummary = mockProperties.reduce(
    (acc, property) => {
      acc.totalRent += property.rent;
      acc.totalExpenses += property.expenses;
      acc.netIncome += property.netIncome;
      return acc;
    },
    { totalRent: 0, totalExpenses: 0, netIncome: 0 }
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Finanzas</h1>
        <p className="text-muted-foreground">
          Análisis financiero y seguimiento de ingresos y gastos
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <FinancialOverview properties={mockProperties} summary={financialSummary} />
        </TabsContent>

        <TabsContent value="metrics">
          <FinancialMetrics properties={mockProperties} />
        </TabsContent>

        <TabsContent value="history">
          <RentHistory properties={mockProperties} />
        </TabsContent>

        <TabsContent value="charts">
          <FinancialCharts properties={mockProperties} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Finances;
