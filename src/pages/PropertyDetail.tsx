
import { useEffect } from 'react';
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
    const foundProperty = mockProperties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      toast.error('Propiedad no encontrada');
      navigate('/');
    }
  }, [id, navigate, setProperty]);

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
