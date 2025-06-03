
import React, { useState, useEffect } from 'react';
import { useAllProperties } from '@/hooks/useAllProperties';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, FileDown, Filter, ArrowLeft, TrendingUp, Building2 } from 'lucide-react';
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

  // Inicializar años disponibles (incluyendo el año actual para informes en curso)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const historicalYears = getAvailableYears();
    
    // Combinar años históricos con años desde 2022 hasta el año actual (incluido)
    const allYears = new Set([
      ...historicalYears,
      ...Array.from({ length: currentYear - 2022 + 1 }, (_, i) => 2022 + i)
    ]);
    
    const sortedYears = Array.from(allYears).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
    
    // Establecer año por defecto (año anterior si no es enero, año actual si es enero)
    const defaultYear = new Date().getMonth() === 0 ? currentYear : currentYear - 1;
    if (sortedYears.length > 0 && !selectedYear) {
      setSelectedYear(sortedYears.find(year => year === defaultYear) || sortedYears[0]);
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
    toast.success('Informe fiscal generado correctamente', {
      description: 'Revisa los datos y utiliza los botones de exportación al final de la página'
    });
  };

  const resetFilters = () => {
    setSelectedPropertyId('all');
    setIsMultiYear(false);
    setYearRange([]);
    const currentYear = new Date().getFullYear();
    const defaultYear = new Date().getMonth() === 0 ? currentYear : currentYear - 1;
    setSelectedYear(availableYears.find(year => year === defaultYear) || availableYears[0]);
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
      <div className="flex flex-col gap-8 min-h-screen pb-32">
        {/* Header mejorado */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold flex items-center gap-4">
                  <Calculator className="h-10 w-10" />
                  📋 Informes Fiscales IRPF
                </h1>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Genera informes detallados y precisos para tu declaración de la renta. 
                  Cumpliendo con la normativa fiscal española vigente.
                </p>
                <div className="flex items-center gap-6 text-sm text-blue-200">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {properties.length} Propiedades registradas
                  </span>
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Datos desde {availableYears[availableYears.length - 1] || 'N/A'}
                  </span>
                </div>
              </div>
              {showReport && (
                <Button
                  variant="secondary"
                  onClick={() => setShowReport(false)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Filtros
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full">
          {!showReport ? (
            /* Panel de Filtros Mejorado */
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-3">
                  <Filter className="h-6 w-6" />
                  ⚙️ Configuración del Informe Fiscal
                </CardTitle>
                <p className="text-blue-600 text-base">
                  Selecciona los criterios para generar tu informe personalizado para Hacienda
                </p>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                
                {/* Configuración de Propiedades */}
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    🏠 Selección de Propiedades
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="property" className="text-green-700 font-medium">
                      Propiedades a Incluir en el Informe
                    </Label>
                    <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                      <SelectTrigger className="bg-white border-2 border-green-300 hover:border-green-400 transition-colors text-lg p-4">
                        <SelectValue placeholder="Selecciona las propiedades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-lg p-3">
                          🏢 Todas las propiedades ({properties.length})
                        </SelectItem>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id} className="text-lg p-3">
                            🏠 {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Configuración Temporal */}
                <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    📅 Período Fiscal
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                      <Checkbox 
                        id="multi-year" 
                        checked={isMultiYear}
                        onCheckedChange={handleMultiYearChange}
                        className="border-2 border-purple-400"
                      />
                      <Label htmlFor="multi-year" className="text-base font-medium text-purple-800 cursor-pointer">
                        📊 Informe multi-ejercicio (rango de años)
                      </Label>
                    </div>

                    {!isMultiYear ? (
                      /* Año Individual */
                      <div className="space-y-3">
                        <Label htmlFor="year" className="text-purple-700 font-medium">
                          Ejercicio Fiscal Individual
                        </Label>
                        <Select 
                          value={selectedYear?.toString() || ''} 
                          onValueChange={(value) => setSelectedYear(parseInt(value))}
                        >
                          <SelectTrigger className="bg-white border-2 border-purple-300 hover:border-purple-400 transition-colors text-lg p-4">
                            <SelectValue placeholder="Selecciona el año fiscal" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map((year) => (
                              <SelectItem key={year} value={year.toString()} className="text-lg p-3">
                                📅 Ejercicio {year} {year === new Date().getFullYear() ? '(Año actual)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      /* Rango de Años */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="start-year" className="text-purple-700 font-medium">
                            Año de Inicio
                          </Label>
                          <Select 
                            onValueChange={(value) => {
                              const endYear = yearRange.length > 0 ? yearRange[yearRange.length - 1] : parseInt(value);
                              handleYearRangeChange(value, endYear.toString());
                            }}
                          >
                            <SelectTrigger className="bg-white border-2 border-purple-300 hover:border-purple-400 transition-colors">
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
                        <div className="space-y-3">
                          <Label htmlFor="end-year" className="text-purple-700 font-medium">
                            Año Final
                          </Label>
                          <Select 
                            onValueChange={(value) => {
                              const startYear = yearRange.length > 0 ? yearRange[0] : parseInt(value);
                              handleYearRangeChange(startYear.toString(), value);
                            }}
                          >
                            <SelectTrigger className="bg-white border-2 border-purple-300 hover:border-purple-400 transition-colors">
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
                </div>

                {/* Vista Previa de Configuración Mejorada */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    👁️ Vista Previa del Informe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-blue-700 font-medium">🏠 Propiedades:</span>
                        <span className="text-blue-800 font-bold">
                          {selectedPropertyId === 'all' 
                            ? `Todas (${properties.length})` 
                            : properties.find(p => p.id === selectedPropertyId)?.name || 'Seleccionar'
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-blue-700 font-medium">📅 Período:</span>
                        <span className="text-blue-800 font-bold">
                          {isMultiYear 
                            ? (yearRange.length > 0 ? `${yearRange[0]} - ${yearRange[yearRange.length - 1]}` : 'Seleccionar rango')
                            : (selectedYear || 'Seleccionar año')
                          }
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-blue-700 font-medium">📊 Tipo:</span>
                        <span className="text-blue-800 font-bold">
                          {isMultiYear ? 'Multi-ejercicio' : 'Ejercicio único'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-blue-700 font-medium">📋 Estado:</span>
                        <span className="text-green-600 font-bold">
                          {(selectedYear || yearRange.length > 0) ? '✅ Listo para generar' : '⚠️ Configura período'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción Mejorados */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleGenerateReport}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all"
                    disabled={!selectedYear && yearRange.length === 0}
                  >
                    <FileDown className="h-5 w-5 mr-3" />
                    🎯 Generar Informe Fiscal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 py-4 px-6 text-lg"
                  >
                    🔄 Limpiar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Informe Generado */
            <div className="space-y-8">
              <ConsolidatedFiscalReport 
                properties={properties}
                fiscalData={fiscalData}
              />
            </div>
          )}
        </div>

        {/* Botones de Exportación Mejorados */}
        {showReport && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white to-gray-50 border-t-2 border-blue-200 shadow-2xl z-40 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  <h3 className="font-semibold text-lg">📥 Exportar Informe</h3>
                  <p className="text-sm text-gray-600">Descarga tu informe en PDF o Excel para adjuntar a Hacienda</p>
                </div>
                <FiscalExportButtons 
                  properties={properties}
                  selectedYear={isMultiYear ? yearRange[0] : selectedYear}
                  fiscalData={fiscalData}
                  selectedPropertyId={selectedPropertyId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FiscalReport;
