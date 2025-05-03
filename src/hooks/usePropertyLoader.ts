
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

  // Fix the issue with empty objects for required properties
  const initializeEmptyProperty = (): Property => {
    return {
      id: `property-${Date.now()}`,
      name: '',
      address: '',
      image: '/placeholder.svg',
      rent: 0,
      rentPaid: false,
      expenses: 0,
      netIncome: 0,
      tenants: [],
      mortgage: {
        monthlyPayment: 0 // Set a default value for required field
      },
      homeInsurance: {
        company: '', // Set default required values
        cost: 0
      },
      lifeInsurance: {
        company: '', // Set default required values 
        cost: 0
      }
    };
  };

  // Fix the finding of payment history by ensuring we check month and year properties
  const getCurrentMonthPayment = (property: Property) => {
    if (property.paymentHistory && property.paymentHistory.length > 0) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Only check for month/year properties if they exist
      const currentMonthPayment = property.paymentHistory.find(
        payment => 
          payment.month === currentMonth && 
          payment.year === currentYear
      );
      
      if (currentMonthPayment) {
        return { ...property, rentPaid: currentMonthPayment.isPaid };
      }
    }
    
    return property;
  };

  useEffect(() => {
    const loadProperty = async () => {
      if (isNewProperty) {
        // Create a basic empty property object for new property
        const newProperty: Property = initializeEmptyProperty();
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
        if (!foundProperty.mortgage) foundProperty.mortgage = { monthlyPayment: 0 };
        if (!foundProperty.homeInsurance) foundProperty.homeInsurance = { company: '', cost: 0 };
        if (!foundProperty.lifeInsurance) foundProperty.lifeInsurance = { company: '', cost: 0 };
        if (!foundProperty.documents) foundProperty.documents = [];
        if (!foundProperty.images) foundProperty.images = [];
        if (!foundProperty.otherUtilities) foundProperty.otherUtilities = [];
        if (!foundProperty.contract) foundProperty.contract = {};
        if (!foundProperty.legalDocuments) foundProperty.legalDocuments = [];
        if (!foundProperty.taxes) foundProperty.taxes = {};
        if (!foundProperty.maintenance) foundProperty.maintenance = {};
        if (!foundProperty.communityManagerDetails) foundProperty.communityManagerDetails = {};
        if (!foundProperty.waterProviderDetails) foundProperty.waterProviderDetails = {};
        if (!foundProperty.electricityProviderDetails) foundProperty.electricityProviderDetails = {};
        if (!foundProperty.gasProviderDetails) foundProperty.gasProviderDetails = {};
        if (!foundProperty.internetProviderDetails) foundProperty.internetProviderDetails = {};
        if (!foundProperty.insuranceDetails) foundProperty.insuranceDetails = {};
        
        foundProperty = getCurrentMonthPayment(foundProperty);
        
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
