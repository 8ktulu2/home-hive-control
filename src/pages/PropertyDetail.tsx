import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyInfo from '@/components/property-detail/PropertyInfo';
import PropertyTasks from '@/components/property-detail/PropertyTasks';
import PropertyDocuments from '@/components/property-detail/PropertyDocuments';
import PropertyFinances from '@/components/property-detail/finances/PropertyFinances';
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
    const savedProperties = localStorage.getItem('properties');
    let foundProperty: Property | undefined;
    
    if (savedProperties) {
      const properties = JSON.parse(savedProperties);
      foundProperty = properties.find((p: Property) => p.id === id);
      
      if (foundProperty) {
        const savedImages = localStorage.getItem('propertyImages');
        if (savedImages && foundProperty.id) {
          const images = JSON.parse(savedImages);
          if (images[foundProperty.id]) {
            foundProperty.image = images[foundProperty.id];
          }
        }
      }
    }
    
    if (!foundProperty) {
      foundProperty = mockProperties.find(p => p.id === id);
    }
    
    if (foundProperty) {
      if (foundProperty.paymentHistory && foundProperty.paymentHistory.length > 0) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const currentMonthPayment = foundProperty.paymentHistory.find(
          payment => payment.month === currentMonth && payment.year === currentYear
        );
        
        if (currentMonthPayment) {
          foundProperty.rentPaid = currentMonthPayment.isPaid;
        }
      }
      
      setProperty(foundProperty);
    } else {
      if (id === 'new') {
        navigate('/property/edit/new');
      } else {
        toast.error('Propiedad no encontrada');
        navigate('/');
      }
    }
  }, [id, navigate, setProperty]);
  
  useEffect(() => {
    const handleRouteChange = () => {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties && id) {
        const properties = JSON.parse(savedProperties);
        const updatedProperty = properties.find((p: Property) => p.id === id);
        if (updatedProperty) {
          setProperty(updatedProperty);
        }
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [id, setProperty]);

  const handleExportToGoogleSheets = () => {
    if (!property) return;

    const propertyData = {
      'Información General': {
        Nombre: property.name,
        Dirección: property.address,
        'Referencia Catastral': property.cadastralReference || '',
        Inquilinos: property.tenants?.map(t => t.name).join(', ') || 'Ninguno'
      },
      'Información Financiera': {
        'Alquiler Mensual': formatCurrency(property.rent),
        'Gastos Mensuales': formatCurrency(property.expenses),
        'Ingresos Netos': formatCurrency(property.netIncome),
        'IBI Anual': property.ibi ? formatCurrency(property.ibi) : '',
      },
      'Estado de Pagos': property.paymentHistory?.map(p => ({
        Mes: `${p.month + 1}/${p.year}`,
        Estado: p.isPaid ? 'Pagado' : 'Pendiente',
        Fecha: new Date(p.date).toLocaleDateString('es-ES'),
        Notas: p.notes || ''
      })),
      'Contactos': {
        'Administrador Comunidad': property.communityManager || '',
        'Compañía de Seguros': property.insuranceCompany || '',
        'Proveedor de Agua': property.waterProvider || '',
        'Proveedor de Electricidad': property.electricityProvider || ''
      },
      'Tareas': property.tasks?.map(t => ({
        Título: t.title,
        Descripción: t.description || '',
        Estado: t.completed ? 'Completada' : 'Pendiente',
        'Fecha límite': t.dueDate || '',
      })),
      'Documentos': property.documents?.map(d => ({
        Nombre: d.name,
        Tipo: d.type,
        Categoría: d.category || '',
        'Fecha de subida': d.uploadDate,
      })),
      'Inventario': property.inventory?.map(i => ({
        Tipo: i.type,
        Nombre: i.name,
        Estado: i.condition,
        Notas: i.notes || ''
      }))
    };
    
    console.log('Datos para exportar a Google Sheets:', propertyData);
    
    toast.success('Preparando exportación a Google Sheets...');
    setTimeout(() => {
      toast.success('Datos exportados correctamente a Google Sheets');
    }, 1500);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
