
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, HelpCircle } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import FiscalAlerts from '@/components/fiscal/FiscalAlerts';
import FiscalHelpDialog from '@/components/fiscal/FiscalHelpDialog';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import FiscalTabs from '@/components/fiscal/FiscalTabs';
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
      <div className="flex flex-col gap-4 p-4 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-blue-600" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Informe Fiscal</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHelpDialog(true)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <HelpCircle className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          </div>
          
          {/* Selectors */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Ejercicio:
              </label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Propiedad:
              </label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las propiedades</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <FiscalAlerts properties={properties} selectedYear={selectedYear} />

        {/* Main Content - Tabs */}
        <FiscalTabs 
          properties={properties}
          selectedYear={selectedYear}
          fiscalData={fiscalData}
        />

        {/* Fixed Footer Export Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
          <div className="max-w-7xl mx-auto">
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
