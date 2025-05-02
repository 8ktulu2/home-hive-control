
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialOverview from '@/components/finances/FinancialOverview';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import RentHistory from '@/components/finances/RentHistory';
import FinancialCharts from '@/components/finances/FinancialCharts';
import HistoricalData from '@/components/finances/historical/HistoricalData';
import { FileText } from 'lucide-react';
import MonthlyNavigator from '@/components/finances/MonthlyNavigator';
import ViewToggle from '@/components/finances/ViewToggle';
import PropertyAnalysis from '@/components/finances/PropertyAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockProperties } from '@/data/mockData';
import { Card } from '@/components/ui/card';

const Finances = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showAllProperties, setShowAllProperties] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const isMobile = useIsMobile();
  
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

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const handlePreviousYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Finanzas</h1>
        <p className="text-muted-foreground">
          Análisis financiero y seguimiento de ingresos y gastos
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <MonthlyNavigator
          selectedMonth={selectedMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        
        <ViewToggle
          showAllProperties={showAllProperties}
          onToggleView={setShowAllProperties}
        />
      </div>

      <Card className="overflow-hidden">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-2 pt-2 pb-0 bg-card">
            {isMobile ? (
              <>
                <TabsList className="grid grid-cols-3 w-full mb-1">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2 w-full mb-2">
                  <TabsTrigger value="charts">Gráficos</TabsTrigger>
                  <TabsTrigger value="historical">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Histórico</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </>
            ) : (
              <TabsList className="grid grid-cols-5 w-full mb-0">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="charts">Gráficos</TabsTrigger>
                <TabsTrigger value="historical">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Histórico</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <div className="p-4">
            <TabsContent value="overview">
              <FinancialOverview 
                properties={mockProperties} 
                summary={financialSummary}
                selectedMonth={selectedMonth}
                showAllProperties={showAllProperties}
              />
            </TabsContent>

            <TabsContent value="metrics">
              <FinancialMetrics 
                properties={mockProperties}
                selectedMonth={selectedMonth}
                showAllProperties={showAllProperties}
              />
            </TabsContent>

            <TabsContent value="history">
              <RentHistory 
                properties={mockProperties}
                selectedMonth={selectedMonth}
                showAllProperties={showAllProperties}
              />
            </TabsContent>

            <TabsContent value="charts">
              <FinancialCharts 
                properties={mockProperties}
                selectedMonth={selectedMonth}
                showAllProperties={showAllProperties}
              />
            </TabsContent>

            <TabsContent value="historical">
              <HistoricalData
                properties={mockProperties}
                selectedYear={selectedYear}
                onPreviousYear={handlePreviousYear}
                onNextYear={handleNextYear}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {!showAllProperties && (
        <PropertyAnalysis 
          properties={mockProperties}
          selectedMonth={selectedMonth}
        />
      )}
    </Layout>
  );
};

export default Finances;
