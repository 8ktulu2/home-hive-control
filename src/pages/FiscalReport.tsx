
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyHistoricalData } from '@/components/finances/historical/types';
import { Button } from '@/components/ui/button';
import { FileDown, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';
import PropertySelector from '@/components/finances/historical/PropertySelector';
import FiscalDetailContent from '@/components/finances/historical/fiscal/components/FiscalDetailContent';
import FiscalInfoModal from '@/components/finances/historical/fiscal/components/FiscalInfoModal';
import { mockProperties } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FiscalReport = () => {
  // Just use mock properties directly instead of trying to use usePropertyLoader without an ID
  const [properties, setProperties] = useState(mockProperties);
  const isLoading = false;
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [showFiscalInfoModal, setShowFiscalInfoModal] = useState(false);
  
  // Generate available years (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({length: 5}, (_, i) => currentYear - i);
  
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
  }, []);
  
  // Generate historical data using actual property data
  const generateHistoricalData = (): PropertyHistoricalData[] => {
    if (!properties || properties.length === 0) return [];
    
    return properties.map(property => {
      // Calculate property expenses
      const monthlyExpenses = property.expenses || 0;
      const monthRentAmount = property.rent || 0;
      
      // Get mortgage interest if available
      const mortgageInterestRate = property.mortgage?.interestRate || 0;
      const mortgageAmount = property.mortgage?.totalAmount || 0;
      const estimatedAnnualMortgageInterest = mortgageAmount * (mortgageInterestRate / 100);
      
      return {
        propertyId: property.id,
        propertyName: property.name,
        months: Array(12).fill(0).map((_, idx) => {
          // Convert month from number to string as required by MonthlyData type
          const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];
          
          // Use real expense data if available
          let expensesData: any[] = [];
          if (property.monthlyExpenses) {
            // Filter expenses for this month/year
            expensesData = property.monthlyExpenses
              .filter(e => e.month === idx && e.year === selectedYear)
              .map(e => ({
                id: e.id,
                name: e.name,
                amount: e.amount,
                isPaid: e.isPaid,
              }));
          }
          
          return {
            month: monthNames[idx],
            year: selectedYear,
            rentAmount: monthRentAmount,
            totalExpenses: monthlyExpenses,
            wasRented: true, // Assuming always rented for simplicity
            expenses: expensesData,
            netIncome: monthRentAmount - monthlyExpenses,
            date: new Date(selectedYear, idx, 1) // Ensure date property is included
          };
        })
      };
    });
  };

  const historicalData = generateHistoricalData();
  
  const filteredData = selectedPropertyId 
    ? historicalData.filter(p => p.propertyId === selectedPropertyId)
    : historicalData;
    
  const handleGenerateAllReports = () => {
    if (historicalData.length === 0) {
      toast.error("No hay datos fiscales para exportar");
      return;
    }
    
    toast.info("Generando informes fiscales para todas las propiedades...", { 
      duration: 3000,
      description: "Este proceso puede tardar unos momentos dependiendo del número de propiedades."
    });
    
    setTimeout(() => {
      try {
        // En una implementación real, aquí se generarían múltiples PDFs
        historicalData.forEach((property, index) => {
          // Simulamos un pequeño retraso entre cada informe para evitar bloqueos
          setTimeout(() => {
            const filename = `Informe_Fiscal_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.pdf`;
            const propertyObj = properties?.find(p => p.id === property.propertyId);
            
            if (propertyObj) {
              exportPropertyTaxDataToPDF(propertyObj, filename);
            }
            
            // Notificación individual para cada propiedad generada
            if (index === historicalData.length - 1) {
              toast.success(`Generados todos los informes fiscales (${historicalData.length} propiedades)`, { 
                duration: 5000,
                description: "Puedes encontrar los archivos en tu carpeta de descargas."
              });
            }
          }, index * 800); // Escalona las generaciones
        });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar los informes PDF", { duration: 3000 });
      }
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Informe Fiscal</h1>
          <div className="flex flex-wrap gap-2 ml-auto">
            <Button 
              variant="outline"
              onClick={() => setShowFiscalInfoModal(true)}
              className="flex items-center gap-2 border-blue-600 text-blue-700"
              title="Ver información detallada sobre datos fiscales"
            >
              <HelpCircle className="h-4 w-4" /> Guía Fiscal
            </Button>
            
            <Button 
              onClick={handleGenerateAllReports}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              title="Generar informes fiscales para todas las propiedades"
            >
              <FileDown className="h-4 w-4" /> Generar Todos los Informes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Propiedad y Año</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-selector" className="mb-2 block">Propiedad</Label>
                <PropertySelector 
                  properties={properties}
                  selectedProperty={selectedPropertyId || "all"}
                  onPropertyChange={setSelectedPropertyId}
                />
              </div>
              <div>
                <Label htmlFor="year-selector" className="mb-2 block">Año fiscal</Label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger id="year-selector">
                    <SelectValue placeholder="Seleccionar año" />
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
            </div>
          </CardContent>
        </Card>

        {filteredData.length > 0 ? (
          <FiscalDetailContent 
            filteredData={filteredData}
            selectedYear={selectedYear}
          />
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                <p>No hay datos fiscales disponibles. Por favor, seleccione una propiedad.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <FiscalInfoModal 
        open={showFiscalInfoModal} 
        onOpenChange={setShowFiscalInfoModal} 
      />
    </Layout>
  );
};

export default FiscalReport;
