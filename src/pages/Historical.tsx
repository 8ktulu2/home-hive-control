
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, AlertCircle } from 'lucide-react';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import HistoricalDataInput from '@/components/historical/HistoricalDataInput';

const Historical = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  const {
    historicalEntries,
    addHistoricalEntry,
    updateHistoricalEntry,
    deleteHistoricalEntry
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
              Introduce los datos históricos de tus propiedades de forma rápida y visual
            </p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
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
          </div>
        )}

        {/* Componente principal de entrada de datos */}
        <HistoricalDataInput
          properties={properties}
          onSaveData={addHistoricalEntry}
          onUpdateData={updateHistoricalEntry}
          existingEntries={historicalEntries}
        />
      </div>
    </Layout>
  );
};

export default Historical;
