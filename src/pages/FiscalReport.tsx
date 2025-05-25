
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import FiscalHeader from '@/components/fiscal/FiscalHeader';
import FiscalHelpDialog from '@/components/fiscal/FiscalHelpDialog';
import FiscalPropertySummary from '@/components/fiscal/FiscalPropertySummary';
import FiscalExpensesBreakdown from '@/components/fiscal/FiscalExpensesBreakdown';
import FiscalIRPFDeclaration from '@/components/fiscal/FiscalIRPFDeclaration';
import FiscalAlerts from '@/components/fiscal/FiscalAlerts';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';

const FiscalReport = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Load properties from localStorage if available
  useEffect(() => {
    const loadProperties = () => {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        try {
          const parsedProperties = JSON.parse(savedProperties);
          setProperties(parsedProperties);
        } catch (error) {
          console.error("Error loading properties from localStorage:", error);
        }
      }
    };
    
    loadProperties();
    
    // Generate available years (last 5 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    setAvailableYears(years);
  }, []);

  // Calculate fiscal data using custom hook
  const fiscalData = useFiscalCalculations(properties, selectedYear);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Fixed Header */}
        <FiscalHeader 
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          setSelectedPropertyId={setSelectedPropertyId}
          onShowHelp={() => setShowHelpDialog(true)}
        />

        {/* Main Content - Fixed padding top for header */}
        <div className="pt-20 px-3 lg:px-6 pb-6 max-w-7xl mx-auto">
          {/* Alerts Panel */}
          <div className="mb-4">
            <FiscalAlerts properties={properties} selectedYear={selectedYear} />
          </div>

          {/* Main Tabs Container */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Calculator className="h-5 w-5 text-blue-600" />
                Informe Fiscal - Ejercicio {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-none border-b">
                  <TabsTrigger 
                    value="summary" 
                    className="text-sm lg:text-base py-3 px-2 data-[state=active]:border-b-4 data-[state=active]:border-blue-600 data-[state=active]:bg-white rounded-none"
                  >
                    Resumen por Propiedad
                  </TabsTrigger>
                  <TabsTrigger 
                    value="expenses" 
                    className="text-sm lg:text-base py-3 px-2 data-[state=active]:border-b-4 data-[state=active]:border-blue-600 data-[state=active]:bg-white rounded-none"
                  >
                    Desglose de Gastos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="declaration" 
                    className="text-sm lg:text-base py-3 px-2 data-[state=active]:border-b-4 data-[state=active]:border-blue-600 data-[state=active]:bg-white rounded-none"
                  >
                    Declaración IRPF
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-0 p-4 lg:p-6">
                  <FiscalPropertySummary 
                    properties={properties}
                    selectedYear={selectedYear}
                    selectedPropertyId={selectedPropertyId}
                    setSelectedPropertyId={setSelectedPropertyId}
                    fiscalData={fiscalData}
                  />
                </TabsContent>

                <TabsContent value="expenses" className="mt-0 p-4 lg:p-6">
                  <FiscalExpensesBreakdown 
                    properties={properties}
                    selectedYear={selectedYear}
                    fiscalData={fiscalData}
                  />
                </TabsContent>

                <TabsContent value="declaration" className="mt-0 p-4 lg:p-6">
                  <FiscalIRPFDeclaration 
                    fiscalData={fiscalData}
                    selectedYear={selectedYear}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Help Dialog */}
        <FiscalHelpDialog 
          open={showHelpDialog}
          onOpenChange={setShowHelpDialog}
        />
      </div>
    </Layout>
  );
};

export default FiscalReport;
