
import React, { useState, useEffect } from 'react';
import { useAllProperties } from '@/hooks/useAllProperties';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, HelpCircle, FileDown, Filter } from 'lucide-react';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';
import ConsolidatedFiscalReport from '@/components/fiscal/ConsolidatedFiscalReport';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import { toast } from 'sonner';

const FiscalReport = () => {
  const { properties, loading } = useAllProperties();
  const { getAvailableYears } = useHistoricalStorage();
  
  // Estados para filtrado avanzado
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [isMultiYear, setIsMultiYear] = useState(false);
  const [yearRange, setYearRange] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showReport, setShowReport] = useState(false);

  // Inicializar años disponibles
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const historicalYears = getAvailableYears();
    
    // Combinar años históricos con años recientes (excluyendo el año actual)
    const allYears = new Set([
      ...historicalYears,
      ...Array.from({ length: 5 }, (_, i) => currentYear - 1 - i)
    ]);
    
    const sortedYears = Array.from(allYears)
      .filter(year => year < currentYear) // Excluir año actual
      .sort((a, b) => b - a);
    
    setAvailableYears(sortedYears);
    
    // Establecer año por defecto
    if (sortedYears.length > 0 && !selectedYear) {
      setSelectedYear(sortedYears[0]);
    }
  }, [properties]);

  // Calcular datos fiscales
  const fiscalData = useFiscalCalculations(
    properties, 
    isMultiYear ? yearRange : selectedYear, 
    selectedPropertyId
  );

  const handleYearRangeChange = (startYear: string, endYear: string) => {
    if (startYear && endYear) {
      const start = parseInt(startYear);
      const end = parseInt(endYear);
      
      if (start <= end) {
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        setYearRange(range);
      } else {
        toast.error('El año de inicio debe ser menor o igual al año final');
      }
    }
  };

  const handleGenerateReport = () => {
    if (isMultiYear && yearRange.length === 0) {
      toast.error('Selecciona un rango de años válido');
      return;
    }
    
    if (!isMultiYear && !selectedYear) {
      toast.error('Selecciona un año');
      return;
    }
    
    setShowReport(true);
    toast.success('Informe fiscal generado correctamente');
  };

  const resetFilters = () => {
    setSelectedPropertyId('all');
    setIsMultiYear(false);
    setYearRange([]);
    setSelectedYear(availableYears[0] || new Date().getFullYear() - 1);
    setShowReport(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Calculator className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando datos fiscales...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 min-h-screen pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calculator className="h-8 w-8" />
                Informes Fiscales
              </h1>
              <p className="text-blue-100 mt-2">
                Genera informes detallados para la declaración de IRPF
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowReport(false)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Filter className="h-4 w-4 mr-2" />
              Volver a Filtros
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full">
          {!showReport ? (
            /* Panel de Filtros */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Configuración del Informe Fiscal
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecciona los criterios para generar tu informe personalizado
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selección de Propiedad */}
                <div className="space-y-2">
                  <Label htmlFor="property">Propiedades a Incluir</Label>
                  <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona las propiedades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📊 Todas las propiedades</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          🏠 {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Configuración Temporal */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="multi-year" 
                      checked={isMultiYear}
                      onCheckedChange={setIsMultiYear}
                    />
                    <Label htmlFor="multi-year" className="text-sm font-medium">
                      Informe multi-ejercicio (rango de años)
                    </Label>
                  </div>

                  {!isMultiYear ? (
                    /* Año Individual */
                    <div className="space-y-2">
                      <Label htmlFor="year">Ejercicio Fiscal</Label>
                      <Select 
                        value={selectedYear?.toString() || ''} 
                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el año fiscal" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              📅 Ejercicio {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    /* Rango de Años */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-year">Año de Inicio</Label>
                        <Select 
                          onValueChange={(value) => {
                            const endYear = yearRange.length > 0 ? yearRange[yearRange.length - 1] : parseInt(value);
                            handleYearRangeChange(value, endYear.toString());
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Año inicial" />
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
                      <div className="space-y-2">
                        <Label htmlFor="end-year">Año Final</Label>
                        <Select 
                          onValueChange={(value) => {
                            const startYear = yearRange.length > 0 ? yearRange[0] : parseInt(value);
                            handleYearRangeChange(startYear.toString(), value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Año final" />
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
                  )}
                </div>

                {/* Vista Previa de Configuración */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Vista Previa del Informe</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-blue-700 font-medium">Propiedades: </span>
                      <span className="text-blue-600">
                        {selectedPropertyId === 'all' 
                          ? `Todas (${properties.length})` 
                          : properties.find(p => p.id === selectedPropertyId)?.name || 'Seleccionar'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Período: </span>
                      <span className="text-blue-600">
                        {isMultiYear 
                          ? (yearRange.length > 0 ? `${yearRange[0]} - ${yearRange[yearRange.length - 1]}` : 'Seleccionar rango')
                          : (selectedYear || 'Seleccionar año')
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleGenerateReport}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedYear && yearRange.length === 0}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Generar Informe Fiscal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Informe Generado */
            <div className="space-y-6">
              <ConsolidatedFiscalReport 
                properties={properties}
                fiscalData={fiscalData}
              />
            </div>
          )}
        </div>

        {/* Botones de Exportación (solo cuando se muestra el informe) */}
        {showReport && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
            <div className="max-w-7xl mx-auto">
              <FiscalExportButtons 
                properties={properties}
                selectedYear={isMultiYear ? yearRange[0] : selectedYear}
                fiscalData={fiscalData}
                selectedPropertyId={selectedPropertyId}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FiscalReport;
