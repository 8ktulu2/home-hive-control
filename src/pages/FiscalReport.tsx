
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, AlertTriangle, Info, TrendingUp, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { mockProperties } from '@/data/mockData';
import FiscalExecutiveSummary from '@/components/fiscal/FiscalExecutiveSummary';
import FiscalMetricsCards from '@/components/fiscal/FiscalMetricsCards';
import FiscalCharts from '@/components/fiscal/FiscalCharts';
import FiscalDataTables from '@/components/fiscal/FiscalDataTables';
import FiscalAlerts from '@/components/fiscal/FiscalAlerts';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';

const FiscalReport = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Informe Fiscal</h1>
              <p className="text-muted-foreground">Gestión fiscal para rendimientos del capital inmobiliario</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    Ejercicio {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerts Panel */}
        <FiscalAlerts properties={properties} selectedYear={selectedYear} />

        {/* Executive Summary */}
        <FiscalExecutiveSummary fiscalData={fiscalData} selectedYear={selectedYear} />

        {/* Key Metrics Cards */}
        <FiscalMetricsCards fiscalData={fiscalData} />

        {/* Charts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análisis Gráfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FiscalCharts properties={properties} selectedYear={selectedYear} fiscalData={fiscalData} />
          </CardContent>
        </Card>

        {/* Detailed Data Tables */}
        <FiscalDataTables properties={properties} selectedYear={selectedYear} fiscalData={fiscalData} />

        {/* Export Options */}
        <FiscalExportButtons 
          properties={properties} 
          selectedYear={selectedYear} 
          fiscalData={fiscalData} 
        />
      </div>
    </Layout>
  );
};

export default FiscalReport;
