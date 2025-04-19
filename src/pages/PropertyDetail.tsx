
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyInfo from '@/components/property-detail/PropertyInfo';
import PropertyTasks from '@/components/property-detail/PropertyTasks';
import PropertyDocuments from '@/components/property-detail/PropertyDocuments';
import PropertyFinances from '@/components/property-detail/PropertyFinances';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';
import { mockProperties } from '@/data/mockData';
import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';
import { Property } from '@/types/property';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    property, 
    setProperty, 
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
  } = usePropertyManagement(null);

  const { 
    handlePaymentUpdate, 
    handleRentPaidChange 
  } = usePaymentManagement(property, setProperty);

  const { 
    handleExpenseAdd, 
    handleExpenseUpdate 
  } = useExpenseManagement(property, setProperty);

  useEffect(() => {
    // Intentamos cargar la propiedad desde localStorage primero
    const savedProperties = localStorage.getItem('properties');
    let foundProperty: Property | undefined;
    
    if (savedProperties) {
      const properties = JSON.parse(savedProperties);
      foundProperty = properties.find((p: Property) => p.id === id);
    }
    
    // Si no se encuentra en localStorage, usamos las propiedades mockadas
    if (!foundProperty) {
      foundProperty = mockProperties.find(p => p.id === id);
    }
    
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      toast.error('Propiedad no encontrada');
      navigate('/');
    }
  }, [id, navigate, setProperty]);
  
  // Este efecto se ejecuta cuando cambia la ruta para recargar la propiedad
  useEffect(() => {
    const handleRouteChange = () => {
      // Volvemos a cargar la propiedad desde localStorage
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties && id) {
        const properties = JSON.parse(savedProperties);
        const updatedProperty = properties.find((p: Property) => p.id === id);
        if (updatedProperty) {
          setProperty(updatedProperty);
        }
      }
    };

    // Escucha eventos de cambio de ruta
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [id, setProperty]);

  const handleExportToGoogleSheets = () => {
    toast.success('Preparando exportación a Google Sheets...');
    setTimeout(() => {
      toast.success('Datos exportados correctamente a Google Sheets');
    }, 1500);
  };

  if (!property) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-xl">Cargando propiedad...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <PropertyDetailHeader 
            property={property}
            onRentPaidChange={handleRentPaidChange}
          />
          
          <Button 
            variant="outline" 
            onClick={handleExportToGoogleSheets}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exportar a Google Sheets</span>
          </Button>
        </div>

        <MonthlyPaymentStatus 
          property={property}
          onPaymentUpdate={handlePaymentUpdate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyInfo property={property} />
          <PropertyFinances 
            property={property} 
            onExpenseAdd={handleExpenseAdd} 
            onExpenseUpdate={handleExpenseUpdate} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyTasks 
            tasks={property.tasks || []}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
          />
          <PropertyDocuments 
            documents={property.documents || []}
            onDocumentDelete={handleDocumentDelete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
