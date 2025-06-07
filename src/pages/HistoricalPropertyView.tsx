
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { useHistoricalMigration } from '@/hooks/useHistoricalMigration';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyDetailContent from '@/components/property-detail/PropertyDetailContent';
import { toast } from 'sonner';

const HistoricalPropertyView = () => {
  const { propertyId, year } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { getPropertyHistoricalData, updateHistoricalData } = useHistoricalMigration();

  useEffect(() => {
    if (propertyId && year) {
      const historicalProperty = getPropertyHistoricalData(propertyId, parseInt(year));
      if (historicalProperty) {
        setProperty(historicalProperty);
      } else {
        toast.error('No se encontraron datos históricos para esta propiedad y año');
        navigate('/historicos');
      }
    }
    setLoading(false);
  }, [propertyId, year, getPropertyHistoricalData, navigate]);

  const handlePropertyUpdate = (updatedProperty: Property) => {
    if (propertyId && year && updatedProperty) {
      const success = updateHistoricalData(propertyId, parseInt(year), updatedProperty);
      if (success) {
        setProperty(updatedProperty);
        toast.success('Datos históricos actualizados');
      } else {
        toast.error('Error al actualizar los datos históricos');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando datos históricos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Datos históricos no encontrados</h2>
          <Button onClick={() => navigate('/historicos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Históricos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Botón de navegación y alerta de modo histórico */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/historicos')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Históricos
          </Button>

          <Alert className="bg-blue-50 border-blue-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Modo Histórico - Año {year}</strong> - Todos los datos mostrados corresponden exclusivamente al año {year}. Las modificaciones solo afectarán este año histórico.
            </AlertDescription>
          </Alert>
        </div>

        {/* Header de la propiedad */}
        <PropertyDetailHeader 
          property={property}
          onRentPaidChange={() => {}}
        />

        {/* Contenido principal */}
        <PropertyDetailContent
          property={property}
          onRentPaidChange={() => {}}
          onPaymentUpdate={() => {}}
          handleTaskToggle={() => {}}
          handleTaskAdd={() => {}}
          handleTaskDelete={() => {}}
          handleTaskUpdate={() => {}}
          handleDocumentDelete={() => {}}
          handleDocumentAdd={() => {}}
          setProperty={handlePropertyUpdate}
        />
      </div>
    </Layout>
  );
};

export default HistoricalPropertyView;
