
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Plus, FileText, BarChart3, AlertCircle, Download } from 'lucide-react';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import HistoricalEntryModal from '@/components/historical/HistoricalEntryModal';
import HistoricalEntriesList from '@/components/historical/HistoricalEntriesList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const Historical = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HistoricalEntry | null>(null);
  const [activeTab, setActiveTab] = useState('entries');

  const {
    historicalEntries,
    addHistoricalEntry,
    updateHistoricalEntry,
    deleteHistoricalEntry,
    getFilteredEntries,
    getAnnualSummary
  } = useHistoricalData();

  // Cargar propiedades del localStorage
  useEffect(() => {
    const loadProperties = () => {
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const parsedProperties = JSON.parse(savedProperties);
          setProperties(parsedProperties);
        }
      } catch (error) {
        console.error("Error loading properties:", error);
        toast.error("Error al cargar las propiedades");
      }
    };
    
    loadProperties();
  }, []);

  const handleSaveEntry = (entryData: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>) => {
    if (editingEntry) {
      updateHistoricalEntry(editingEntry.id, entryData);
      setEditingEntry(null);
    } else {
      addHistoricalEntry(entryData);
    }
    setIsModalOpen(false);
  };

  const handleEditEntry = (entry: HistoricalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro histórico?')) {
      deleteHistoricalEntry(id);
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  // Calcular estadísticas rápidas
  const totalEntries = historicalEntries.length;
  const totalIncome = historicalEntries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalExpenses = historicalEntries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  const uniqueYears = [...new Set(historicalEntries.map(e => e.year))].sort((a, b) => b - a);
  const uniqueProperties = [...new Set(historicalEntries.map(e => e.propertyId))].length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold">Histórico</h1>
            </div>
            <p className="text-muted-foreground">
              Gestiona los datos históricos de tus propiedades para completar informes fiscales y análisis de rentabilidad
            </p>
          </div>
          
          <Button onClick={handleNewEntry} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir Datos Históricos
          </Button>
        </div>

        {/* Alerta informativa */}
        {properties.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para añadir datos históricos, primero necesitas tener propiedades registradas en el sistema.
              Ve a la sección de propiedades para añadir una.
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas rápidas */}
        {totalEntries > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalEntries}</div>
                <p className="text-sm text-muted-foreground">Registros Totales</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalIncome)}
                </div>
                <p className="text-sm text-muted-foreground">Ingresos Históricos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalExpenses)}
                </div>
                <p className="text-sm text-muted-foreground">Gastos Históricos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(netBalance)}
                </div>
                <p className="text-sm text-muted-foreground">Balance Neto</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{uniqueYears.length}</div>
                <p className="text-sm text-muted-foreground">Años con Datos</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contenido principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entries">Registros Históricos</TabsTrigger>
            <TabsTrigger value="reports">Informes y Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            <HistoricalEntriesList
              entries={historicalEntries}
              properties={properties}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informes Disponibles</CardTitle>
                  <CardDescription>
                    Genera informes basados en los datos históricos registrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueYears.map(year => (
                      <Card key={year} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Informe Fiscal {year}</h3>
                            <p className="text-sm text-muted-foreground">
                              {historicalEntries.filter(e => e.year === year).length} registros
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {uniqueYears.length === 0 && (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600">No hay datos históricos para generar informes</p>
                      <p className="text-sm text-gray-500">Añade algunos registros históricos para ver los informes disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Análisis por propiedad */}
              {uniqueProperties > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis por Propiedad</CardTitle>
                    <CardDescription>
                      Rendimiento histórico de cada propiedad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {properties
                        .filter(prop => historicalEntries.some(e => e.propertyId === prop.id))
                        .map(property => {
                          const propertyEntries = historicalEntries.filter(e => e.propertyId === property.id);
                          const propertyIncome = propertyEntries
                            .filter(e => e.type === 'income')
                            .reduce((sum, e) => sum + (e.amount || 0), 0);
                          const propertyExpenses = propertyEntries
                            .filter(e => e.type === 'expense')
                            .reduce((sum, e) => sum + (e.amount || 0), 0);
                          
                          return (
                            <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-semibold">{property.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {propertyEntries.length} registros históricos
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold">
                                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(propertyIncome - propertyExpenses)}
                                </div>
                                <div className="text-sm text-muted-foreground">Balance histórico</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para añadir/editar datos históricos */}
        <HistoricalEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEntry}
          properties={properties}
          editingEntry={editingEntry}
        />
      </div>
    </Layout>
  );
};

export default Historical;
