
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';

export const usePropertyLoader = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      setLoading(false);
    };

    loadProperty();
  }, [id, navigate]);

  return { property, setProperty, loading };
};
