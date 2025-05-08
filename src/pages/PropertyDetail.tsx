
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import { Property } from '@/types/property';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyDetailContent from '@/components/property-detail/PropertyDetailContent';
import PropertyDetailLoader from '@/components/property-detail/PropertyDetailLoader';

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
    handleDocumentAdd,
    handleExpenseAdd,
    handleExpenseUpdate
  } = usePropertyManagement(null);

  const { 
    handlePaymentUpdate, 
    handleRentPaidChange 
  } = usePaymentManagement(property, setProperty);

  useEffect(() => {
    const loadProperty = () => {
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
    };

    loadProperty();
  }, [id, navigate, setProperty]);
  
  // Manejador para eventos de navegación y para el gesto de volver del móvil
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      // Si estamos en una página de detalle y se presiona atrás, navegamos a la página principal
      if (window.location.pathname.includes('/property/')) {
        e.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    
    // Preventivamente capturamos el evento de hardware back button en Android
    document.addEventListener('backbutton', () => {
      navigate('/');
    });

    // Más específicamente para gestos en móviles, también podemos usar:
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartX = e.touches[0].clientX;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;
        
        // Si el deslizamiento es suficientemente grande hacia la derecha (gesto común para "volver")
        if (diff > 100) {
          navigate('/');
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        }
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };
    
    // Solo añadir este listener en dispositivos móviles
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart);
    }

    return () => {
      window.removeEventListener('popstate', handleBackButton);
      document.removeEventListener('backbutton', () => {});
      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [navigate]);

  if (!property) {
    return <PropertyDetailLoader />;
  }

  return (
    <Layout>
      <div className="space-y-2 mt-1">
        <PropertyDetailHeader 
          property={property}
          onRentPaidChange={handleRentPaidChange}
        />
        
        <PropertyDetailContent
          property={property}
          onRentPaidChange={handleRentPaidChange}
          onPaymentUpdate={handlePaymentUpdate}
          handleTaskToggle={handleTaskToggle}
          handleTaskAdd={handleTaskAdd}
          handleTaskDelete={handleTaskDelete}
          handleTaskUpdate={handleTaskUpdate}
          handleDocumentDelete={handleDocumentDelete}
          handleDocumentAdd={handleDocumentAdd}
          setProperty={setProperty}
        />
      </div>
    </Layout>
  );
};

export default PropertyDetail;
