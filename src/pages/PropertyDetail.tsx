
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import MainContent from '@/components/property-detail/MainContent';
import SecondaryContent from '@/components/property-detail/SecondaryContent';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';
import { Property } from '@/types/property';
import PropertyActions from '@/components/property-detail/header/PropertyActions';
import ExportButton from '@/components/property-detail/header/ExportButton';

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
    handleDocumentAdd
  } = usePropertyManagement(null);

  const { 
    handlePaymentUpdate, 
    handleRentPaidChange 
  } = usePaymentManagement(property, setProperty);

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
        <PropertyActions propertyId={property.id} />
        
        <div className="flex justify-between items-start">
          <PropertyDetailHeader 
            property={property}
            onRentPaidChange={handleRentPaidChange}
          />
          
          <ExportButton property={property} />
        </div>

        <MonthlyPaymentStatus 
          property={property}
          onPaymentUpdate={handlePaymentUpdate}
        />

        <MainContent property={property} setProperty={setProperty} />

        <SecondaryContent
          property={property}
          onTaskToggle={handleTaskToggle}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
          onDocumentDelete={handleDocumentDelete}
          onDocumentAdd={handleDocumentAdd}
        />
      </div>
    </Layout>
  );
};

export default PropertyDetail;
