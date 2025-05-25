
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, HelpCircle, Download } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import FiscalExecutiveSummary from '@/components/fiscal/FiscalExecutiveSummary';
import FiscalMetricsCards from '@/components/fiscal/FiscalMetricsCards';
import FiscalCharts from '@/components/fiscal/FiscalCharts';
import FiscalDataTables from '@/components/fiscal/FiscalDataTables';
import FiscalAlerts from '@/components/fiscal/FiscalAlerts';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import FiscalHeader from '@/components/fiscal/FiscalHeader';
import FiscalHelpDialog from '@/components/fiscal/FiscalHelpDialog';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';

const FiscalReport = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
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
      <div className="min-h-screen bg-gray-50">
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

        {/* Main Content - Responsive Grid */}
        <div className="pt-20 px-4 lg:px-6 pb-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
          {/* Alerts Panel */}
          <FiscalAlerts properties={properties} selectedYear={selectedYear} />

          {/* Executive Summary + Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Executive Summary - Left Column on Desktop, Full Width on Mobile */}
            <div className="lg:col-span-4">
              <FiscalExecutiveSummary fiscalData={fiscalData} selectedYear={selectedYear} />
            </div>
            
            {/* Key Metrics - Right Column on Desktop, Full Width on Mobile */}
            <div className="lg:col-span-8">
              <FiscalMetricsCards fiscalData={fiscalData} />
            </div>
          </div>

          {/* Charts Section - Responsive Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Calculator className="h-5 w-5" />
                Análisis Gráfico
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <FiscalCharts 
                properties={properties} 
                selectedYear={selectedYear} 
                fiscalData={fiscalData} 
              />
            </CardContent>
          </Card>

          {/* Detailed Data Tables - Mobile Optimized */}
          <div className="lg:block">
            <FiscalDataTables 
              properties={properties} 
              selectedYear={selectedYear} 
              fiscalData={fiscalData} 
            />
          </div>
        </div>

        {/* Fixed Footer Export Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-7xl mx-auto p-4">
            <FiscalExportButtons 
              properties={properties}
              selectedYear={selectedYear}
              fiscalData={fiscalData}
              selectedPropertyId={selectedPropertyId}
            />
          </div>
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
