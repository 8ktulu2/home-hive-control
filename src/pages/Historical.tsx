
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  const validProperties = properties.filter(property => 
    property.id && 
    property.id.trim() !== '' && 
    property.name && 
    property.name.trim() !== ''
  );

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
        {validProperties.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para añadir datos históricos, primero necesitas tener propiedades registradas en el sistema.
              Ve a la sección de propiedades para añadir una.
            </AlertDescription>
          </Alert>
        )}

        {/* Componente principal de entrada de datos */}
        <HistoricalDataInput
          properties={validProperties}
          onSaveData={addHistoricalEntry}
          onUpdateData={updateHistoricalEntry}
          existingEntries={historicalEntries}
        />
      </div>
    </Layout>
  );
};

export default Historical;
