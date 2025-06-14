
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, AlertTriangle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyDetailContent from '@/components/property-detail/PropertyDetailContent';
import { toast } from 'sonner';
import { usePropertyYearData } from '@/hooks/usePropertyYearData';

const HistoricalPropertyView = () => {
  const { propertyId, year } = useParams();
  const navigate = useNavigate();
  const [baseProperty, setBaseProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  const yearNumber = year ? parseInt(year) : new Date().getFullYear();
  const isHistoricalYear = yearNumber < new Date().getFullYear();

  // Usar el hook de datos por año
  const {
    yearData,
    saveYearData,
    loading: yearDataLoading,
    selectedYear,
    isHistoricalMode
  } = usePropertyYearData(propertyId || '', baseProperty);

  useEffect(() => {
    if (propertyId) {
      // Cargar la propiedad base para referencia
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const property = properties.find((p: Property) => p.id === propertyId);
        if (property) {
          setBaseProperty(property);
        } else {
          toast.error('No se encontró la propiedad');
          navigate('/historicos');
        }
      }
    }
    setLoading(false);
  }, [propertyId, navigate]);

  const handleYearDataUpdate = (updatedData: any) => {
    if (yearData) {
      const success = saveYearData(updatedData);
      if (success) {
        toast.success(`Datos del año ${yearNumber} actualizados correctamente`);
      } else {
        toast.error('Error al actualizar los datos del año');
      }
    }
  };

  if (loading || yearDataLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando datos del año {yearNumber}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!baseProperty || !yearData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No se pudieron cargar los datos</h2>
          <Button onClick={() => navigate('/historicos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Históricos
          </Button>
        </div>
      </Layout>
    );
  }

  // Crear una propiedad virtual para el año específico
  const historicalProperty: Property = {
    ...baseProperty,
    rent: yearData.rent || 0,
    rentPaid: yearData.rentPaid || false,
    paymentHistory: yearData.payments.map((payment, index) => ({
      id: `${yearNumber}-${payment.month}-${index}`,
      date: payment.createdAt,
      amount: payment.amount,
      type: 'rent' as const,
      isPaid: payment.isPaid || false,
      month: parseInt(payment.month.split('-')[1]) || 1, // Convertir "2024-01" a 1
      year: yearNumber,
      description: payment.notes || 'Alquiler'
    })),
    monthlyExpenses: yearData.expenses.map((expense, index) => ({
      id: `${yearNumber}-${expense.concept}-${index}`,
      name: expense.concept,
      amount: expense.amount,
      category: expense.category || 'otros',
      date: expense.date,
      isPaid: false, // Valor por defecto requerido
      dueDate: undefined,
      paymentDate: undefined,
      recurring: false,
      notes: undefined,
      propertyId: propertyId,
      month: new Date(expense.date).getMonth() + 1,
      year: yearNumber
    })),
    tasks: baseProperty.tasks || [],
    documents: baseProperty.documents || [],
    inventory: baseProperty.inventory || []
  };

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

          <Alert className={isHistoricalYear ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}>
            <Calendar className={`h-4 w-4 ${isHistoricalYear ? "text-yellow-600" : "text-blue-600"}`} />
            <AlertDescription className={`${isHistoricalYear ? "text-yellow-800" : "text-blue-800"} text-sm`}>
              <strong>
                {isHistoricalYear ? `Modo Histórico - Año ${yearNumber}` : `Año Actual - ${yearNumber}`}
              </strong> - 
              Todos los datos mostrados y modificaciones corresponden exclusivamente al año {yearNumber}.
              {isHistoricalYear && " Los cambios NO afectarán el año actual ni otros años históricos."}
            </AlertDescription>
          </Alert>

          {isHistoricalYear && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                <strong>Importante:</strong> Estás viendo y editando datos históricos del año {yearNumber}. 
                Estos cambios están completamente aislados y no afectarán otros años.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Header de la propiedad */}
        <PropertyDetailHeader 
          property={historicalProperty}
          onRentPaidChange={(paid) => {
            const updatedYearData = {
              ...yearData,
              rentPaid: paid
            };
            handleYearDataUpdate(updatedYearData);
          }}
          historicalYear={yearNumber}
        />

        {/* Contenido principal */}
        <PropertyDetailContent
          property={historicalProperty}
          onRentPaidChange={(paid) => {
            const updatedYearData = {
              ...yearData,
              rentPaid: paid
            };
            handleYearDataUpdate(updatedYearData);
          }}
          onPaymentUpdate={() => {
            // Los pagos se manejan a través del yearData
            console.log('Payment updated for year', yearNumber);
          }}
          handleTaskToggle={() => {}}
          handleTaskAdd={() => {}}
          handleTaskDelete={() => {}}
          handleTaskUpdate={() => {}}
          handleDocumentDelete={() => {}}
          handleDocumentAdd={() => {}}
          setProperty={(updatedProperty) => {
            // Convertir cambios de la propiedad de vuelta a yearData
            const updatedYearData = {
              ...yearData,
              rent: updatedProperty.rent || 0,
              rentPaid: updatedProperty.rentPaid || false,
              expenses: updatedProperty.monthlyExpenses?.map(expense => ({
                concept: expense.name,
                amount: expense.amount,
                deductible: false,
                category: expense.category,
                date: expense.date
              })) || []
            };
            handleYearDataUpdate(updatedYearData);
          }}
        />

        {/* Botón de edición específico para el año */}
        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => navigate(`/historicos/property/${propertyId}/${yearNumber}/edit`)}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Editar Datos del Año {yearNumber}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default HistoricalPropertyView;
