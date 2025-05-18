
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyHistoricalData } from '@/components/finances/historical/types';
import { Button } from '@/components/ui/button';
import { FileDown, HelpCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { exportFiscalDataToPDF } from '@/utils/pdfExport';
import FiscalInfoModal from '@/components/finances/historical/fiscal/components/FiscalInfoModal';
import { mockProperties } from '@/data/mockData';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const FiscalReport = () => {
  // Usar datos de propiedades simulados
  const [properties, setProperties] = useState(mockProperties);
  
  // Estado para gestionar años disponibles
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({length: 5}, (_, i) => currentYear - i);
  
  // Estados para selecciones
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([currentYear - 1]);
  const [showFiscalInfoModal, setShowFiscalInfoModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Cargar propiedades desde localStorage si están disponibles
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

  // Manejar selección de propiedades
  const handlePropertyToggle = (propertyId: string) => {
    setSelectedPropertyIds(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Manejar selección de años
  const handleYearToggle = (year: number) => {
    setSelectedYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  // Seleccionar todas las propiedades
  const handleSelectAllProperties = () => {
    if (selectedPropertyIds.length === properties.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(properties.map(p => p.id));
    }
  };

  // Seleccionar todos los años
  const handleSelectAllYears = () => {
    if (selectedYears.length === availableYears.length) {
      setSelectedYears([]);
    } else {
      setSelectedYears([...availableYears]);
    }
  };

  // Generar datos históricos para las propiedades y años seleccionados
  const generateHistoricalData = (propId: string, year: number): PropertyHistoricalData => {
    const property = properties.find(p => p.id === propId);
    
    if (!property) {
      throw new Error(`Property with ID ${propId} not found`);
    }
    
    // Calcular gastos de la propiedad
    const monthlyExpenses = property.expenses || 0;
    const monthRentAmount = property.rent || 0;
    
    // Obtener interés hipotecario si está disponible
    const mortgageInterestRate = property.mortgage?.interestRate || 0;
    const mortgageAmount = property.mortgage?.totalAmount || 0;
    const estimatedAnnualMortgageInterest = mortgageAmount * (mortgageInterestRate / 100);
    
    // Nombres de los meses en español
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return {
      propertyId: property.id,
      propertyName: property.name,
      months: Array(12).fill(0).map((_, idx) => {
        // Usar datos de gastos reales si están disponibles
        let expensesData: any[] = [];
        if (property.monthlyExpenses) {
          // Filtrar gastos para este mes/año
          expensesData = property.monthlyExpenses
            .filter(e => e.month === idx && e.year === year)
            .map(e => ({
              id: e.id,
              name: e.name,
              amount: e.amount,
              isPaid: e.isPaid,
            }));
        }
        
        return {
          month: monthNames[idx],
          year: year,
          rentAmount: monthRentAmount,
          totalExpenses: monthlyExpenses,
          wasRented: true, // Asumimos alquilado por simplicidad
          expenses: expensesData,
          netIncome: monthRentAmount - monthlyExpenses,
          date: new Date(year, idx, 1)
        };
      })
    };
  };

  // Generar informes para las propiedades y años seleccionados
  const handleGenerateReports = async () => {
    if (selectedPropertyIds.length === 0 || selectedYears.length === 0) {
      toast.error("Selecciona al menos una propiedad y un año para generar informes");
      return;
    }
    
    setIsGenerating(true);
    
    const totalReports = selectedPropertyIds.length * selectedYears.length;
    let completedReports = 0;
    
    toast.info(`Generando ${totalReports} informes fiscales...`, { 
      duration: 5000,
      description: "Este proceso puede tardar unos momentos."
    });
    
    try {
      // Procesar cada combinación de propiedad y año
      for (const propId of selectedPropertyIds) {
        const property = properties.find(p => p.id === propId);
        if (!property) continue;
        
        for (const year of selectedYears) {
          const historicalData = generateHistoricalData(propId, year);
          
          // Usar useFiscalData para obtener datos fiscales consistentes
          const { fiscalData } = useFiscalData([historicalData], year);
          const propertyFiscalData = fiscalData[propId];
          
          if (propertyFiscalData) {
            // Generar nombre de archivo descriptivo
            const filename = `Informe_Fiscal_${property.name.replace(/\s+/g, "_")}_${year}.pdf`;
            
            // Exportar a PDF con un pequeño retraso para no bloquear el navegador
            await new Promise(resolve => {
              setTimeout(() => {
                exportFiscalDataToPDF(propertyFiscalData, property.name, year, filename);
                completedReports++;
                resolve(null);
              }, 800);
            });
          }
        }
      }
      
      toast.success(`Generados ${completedReports} informes fiscales`, { 
        duration: 5000,
        description: "Puedes encontrar los archivos en tu carpeta de descargas."
      });
    } catch (error) {
      console.error("Error al generar informes:", error);
      toast.error("Error al exportar los informes PDF", { duration: 3000 });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Informes Fiscales</h1>
          <div className="flex flex-wrap gap-2 ml-auto">
            <Button 
              variant="outline"
              onClick={() => setShowFiscalInfoModal(true)}
              className="flex items-center gap-2 border-blue-600 text-blue-700"
              title="Ver información detallada sobre datos fiscales"
            >
              <HelpCircle className="h-4 w-4" /> Guía Fiscal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de propiedades */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Propiedades</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAllProperties}
                  className="text-xs h-8"
                >
                  {selectedPropertyIds.length === properties.length ? "Deseleccionar todo" : "Seleccionar todo"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              {properties.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No hay propiedades disponibles
                </div>
              ) : (
                <div className="space-y-2">
                  {properties.map(property => (
                    <div key={property.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`property-${property.id}`}
                        checked={selectedPropertyIds.includes(property.id)}
                        onCheckedChange={() => handlePropertyToggle(property.id)}
                      />
                      <Label 
                        htmlFor={`property-${property.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {property.name}
                      </Label>
                      {selectedPropertyIds.includes(property.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selector de años */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Años Fiscales</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAllYears}
                  className="text-xs h-8"
                >
                  {selectedYears.length === availableYears.length ? "Deseleccionar todo" : "Seleccionar todo"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableYears.map(year => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`year-${year}`}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => handleYearToggle(year)}
                    />
                    <Label 
                      htmlFor={`year-${year}`}
                      className="cursor-pointer"
                    >
                      {year}
                    </Label>
                    {selectedYears.includes(year) && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen y botón de generación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Selección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Propiedades seleccionadas ({selectedPropertyIds.length}):</h3>
                  {selectedPropertyIds.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay propiedades seleccionadas</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {selectedPropertyIds.map(id => {
                        const property = properties.find(p => p.id === id);
                        return property ? (
                          <li key={id}>{property.name}</li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Años seleccionados ({selectedYears.length}):</h3>
                  {selectedYears.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay años seleccionados</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {selectedYears.map(year => (
                        <li key={year}>{year}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <Separator />

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total de informes a generar:</p>
                    <p className="text-2xl font-bold">
                      {selectedPropertyIds.length * selectedYears.length}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    disabled={selectedPropertyIds.length === 0 || selectedYears.length === 0 || isGenerating}
                    onClick={handleGenerateReports}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generando..." : "Generar Informes"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FiscalInfoModal 
        open={showFiscalInfoModal} 
        onOpenChange={setShowFiscalInfoModal} 
      />
    </Layout>
  );
};

export default FiscalReport;
