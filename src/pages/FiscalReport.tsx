
import React, { useState, useEffect } from 'react';
import { useAllProperties } from '@/hooks/useAllProperties';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, FileDown, Info, Building2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';
import ConsolidatedFiscalReport from '@/components/fiscal/ConsolidatedFiscalReport';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import { toast } from 'sonner';

const FiscalReport = () => {
  const { properties, loading } = useAllProperties();
  const { getAvailableYears } = useHistoricalStorage();
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [isMultiYear, setIsMultiYear] = useState(false);
  const [yearRange, setYearRange] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const historicalYears = getAvailableYears();
    
    // Include years from 2022 to current year
    const allYears = new Set([
      ...historicalYears,
      ...Array.from({ length: currentYear - 2022 + 1 }, (_, i) => 2022 + i)
    ]);
    
    const sortedYears = Array.from(allYears).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
    
    if (sortedYears.length > 0 && !selectedYear) {
      setSelectedYear(currentYear);
    }
  }, [properties]);

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
    setSelectedYear(new Date().getFullYear());
    setShowReport(false);
    toast.info('Filtros restablecidos');
  };

  const handleMultiYearChange = (checked: boolean | "indeterminate") => {
    const boolValue = checked === true;
    setIsMultiYear(boolValue);
    if (!boolValue) {
      setYearRange([]);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Calculator className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Cargando datos fiscales...</h3>
              <p className="text-gray-600">Preparando la información para tu declaración</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 min-h-screen pb-32">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6" />
              <h1 className="text-xl font-bold">Informe Fiscal IRPF</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-blue-200 hover:text-white cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <p>Genera informes detallados y precisos para tu declaración de la renta. 
                    Cumpliendo con la normativa fiscal española vigente.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {properties.length} Propiedades
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full">
          {!showReport ? (
            /* Compact Filter Panel */
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Filters in compact grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Property Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="property" className="text-sm font-medium">
                      Propiedades
                    </Label>
                    <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar propiedades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas ({properties.length})
                        </SelectItem>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Ejercicio Fiscal
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="multi-year" 
                          checked={isMultiYear}
                          onCheckedChange={handleMultiYearChange}
                        />
                        <Label htmlFor="multi-year" className="text-sm cursor-pointer">
                          Rango de años
                        </Label>
                      </div>

                      {!isMultiYear ? (
                        <Select 
                          value={selectedYear?.toString() || ''} 
                          onValueChange={(value) => setSelectedYear(parseInt(value))}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year} {year === new Date().getFullYear() ? '(Actual)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Select 
                            onValueChange={(value) => {
                              const endYear = yearRange.length > 0 ? yearRange[yearRange.length - 1] : parseInt(value);
                              handleYearRangeChange(value, endYear.toString());
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Desde" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            onValueChange={(value) => {
                              const startYear = yearRange.length > 0 ? yearRange[0] : parseInt(value);
                              handleYearRangeChange(startYear.toString(), value);
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Hasta" />
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
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={handleGenerateReport}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedYear && yearRange.length === 0}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Generar Informe
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="px-6"
                  >
                    Limpiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Generated Report */
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Informe Generado</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowReport(false)}
                  className="text-sm"
                >
                  ← Volver a Filtros
                </Button>
              </div>
              <ConsolidatedFiscalReport 
                properties={properties}
                fiscalData={fiscalData}
              />
            </div>
          )}
        </div>

        {/* Export Buttons */}
        {showReport && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h3 className="font-medium">Exportar Informe</h3>
                <p className="text-sm text-gray-600">Descarga en PDF o Excel</p>
              </div>
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
