import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyHistoricalData } from '@/components/finances/historical/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';
import PropertySelector from '@/components/finances/historical/PropertySelector';
import FiscalDetailContent from '@/components/finances/historical/FiscalDetailContent';
import { mockProperties } from '@/data/mockData';

const FiscalReport = () => {
  // Just use mock properties directly instead of trying to use usePropertyLoader without an ID
  const [properties, setProperties] = useState(mockProperties);
  const isLoading = false;
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Informe Fiscal</h1>
          <Button 
            onClick={() => {
              if (filteredData.length === 0) {
                toast.error("No hay datos fiscales para exportar");
                return;
              }
              
              toast.info("Generando informe fiscal detallado...", { duration: 3000 });
              
              setTimeout(() => {
                try {
                  const property = properties?.find(p => p.id === selectedPropertyId);
                  if (!property && selectedPropertyId) {
                    toast.error("No se encontró la propiedad seleccionada.");
                    return;
                  }
                  
                  const filename = property 
                    ? `Informe_Fiscal_${property.name.replace(/\s+/g, "_")}_${selectedYear}.pdf`
                    : `Informe_Fiscal_Completo_${selectedYear}.pdf`;
                    
                  if (property) {
                    exportPropertyTaxDataToPDF(property, filename);
                  } else {
                    // Export all properties
                    toast.error("Por favor seleccione una propiedad específica para exportar");
                    return;
                  }
                  
                  toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
                } catch (error) {
                  console.error("Error exporting to PDF:", error);
                  toast.error("Error al exportar el informe PDF", { duration: 3000 });
                }
              }, 1500);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 ml-auto"
            title="Exportar a PDF con explicaciones detalladas"
          >
            <FileDown className="h-4 w-4" /> Generar Informe PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Propiedad y Año</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertySelector 
              properties={properties}
              selectedProperty={selectedPropertyId || "all"}
              onPropertyChange={setSelectedPropertyId}
            />
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
    </Layout>
  );
};

export default FiscalReport;
