
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialOverview from '@/components/finances/FinancialOverview';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import RentHistory from '@/components/finances/RentHistory';
import FinancialCharts from '@/components/finances/FinancialCharts';
import HistoricalData from '@/components/finances/HistoricalData';
import { mockProperties } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Building, Calendar, ArrowUpDown, Filter, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Finances = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showAllProperties, setShowAllProperties] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Format the current month and year
  const formattedMonth = format(selectedMonth, 'MMMM yyyy', { locale: es });
  
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
          >
            &lt;
          </Button>
          <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formattedMonth}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            &gt;
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showAllProperties ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowAllProperties(true)}
          >
            <Building className="h-4 w-4" />
            <span>Todas las propiedades</span>
          </Button>
          <Button
            variant={!showAllProperties ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowAllProperties(false)}
          >
            <Filter className="h-4 w-4" />
            <span>Por propiedad</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="historical">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Histórico Fiscal</span>
            </div>
          </TabsTrigger>
        </TabsList>

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
      </Tabs>

      {!showAllProperties && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Análisis por Propiedad</CardTitle>
            <CardDescription>Visión detallada de cada propiedad para {formattedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProperties.map(property => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{property.name}</h3>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 bg-muted/20 border-t">
                    <div className="p-3 border-r">
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                      <p className="font-medium text-primary">{property.rent}€</p>
                    </div>
                    <div className="p-3 border-r">
                      <p className="text-xs text-muted-foreground">Gastos</p>
                      <p className="font-medium text-destructive">{property.expenses}€</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">Neto</p>
                      <p className={`font-medium ${property.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {property.netIncome}€
                      </p>
                    </div>
                  </div>
                  <div className="p-3 border-t flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="text-xs flex items-center gap-1"
                    >
                      <a href={`/property/${property.id}`}>
                        <span>Ver detalles</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Finances;
