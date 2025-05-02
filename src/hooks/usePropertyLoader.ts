
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';

export const usePropertyLoader = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const isNewProperty = id === 'new';
  const navigate = useNavigate();

  useEffect(() => {
    const loadProperty = async () => {
      if (isNewProperty) {
        // Create a basic empty property object for new property
        const newProperty: Property = {
          id: `property-${Date.now()}`,
          name: '',
          address: '',
          image: '/placeholder.svg',
          rent: 0,
          expenses: 0,
          rentPaid: false,
          netIncome: 0,
          tenants: [],
          images: [] // Inicializamos el array de imágenes
        };
        setProperty(newProperty);
        setLoading(false);
        return;
      }
      
      const savedProperties = localStorage.getItem('properties');
      let foundProperty: Property | undefined;
      
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        foundProperty = properties.find((p: Property) => p.id === id);
        
        if (foundProperty) {
          // Cargar la imagen principal si existe
          const savedImages = localStorage.getItem('propertyImages');
          if (savedImages && foundProperty.id) {
            const images = JSON.parse(savedImages);
            if (images[foundProperty.id]) {
              foundProperty.image = images[foundProperty.id];
            }
          }
          
          // Cargar las imágenes adicionales si existen
          const savedAdditionalImages = localStorage.getItem('propertyAdditionalImages');
          if (savedAdditionalImages && foundProperty.id) {
            const additionalImages = JSON.parse(savedAdditionalImages);
            if (additionalImages[foundProperty.id]) {
              foundProperty.images = additionalImages[foundProperty.id];
            } else {
              foundProperty.images = []; // Asegurar que siempre hay un array de imágenes
            }
          } else {
            foundProperty.images = []; // Asegurar que siempre hay un array de imágenes
          }
        }
      }
      
      if (!foundProperty) {
        foundProperty = mockProperties.find(p => p.id === id);
      }
      
      if (foundProperty) {
        // Ensure all needed property objects exist to prevent null reference errors
        if (!foundProperty.tenants) foundProperty.tenants = [];
        if (!foundProperty.mortgage) foundProperty.mortgage = {};
        if (!foundProperty.homeInsurance) foundProperty.homeInsurance = {};
        if (!foundProperty.lifeInsurance) foundProperty.lifeInsurance = {};
        if (!foundProperty.documents) foundProperty.documents = [];
        if (!foundProperty.images) foundProperty.images = [];
        
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
        toast.error('Propiedad no encontrada');
        navigate('/');
      }
      setLoading(false);
    };

    loadProperty();
  }, [id, navigate, isNewProperty]);

  return { property, setProperty, loading, isNewProperty };
};
