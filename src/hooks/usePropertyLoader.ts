
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';
import { usePropertyCreation } from './usePropertyCreation';

export const usePropertyLoader = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const propertyCreatedRef = useRef(false);
  const isNewProperty = id === 'new';
  const navigate = useNavigate();
  const { createNewProperty } = usePropertyCreation();

  useEffect(() => {
    const fetchOrCreateProperty = async () => {
      if (isNewProperty && !propertyCreatedRef.current) {
        propertyCreatedRef.current = true;
        const newProperty = createNewProperty();
        setProperty(newProperty);
        setLoading(false);
      } else if (!isNewProperty) {
        const savedProperties = localStorage.getItem('properties');
        let foundProperty = null;
        
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          foundProperty = properties.find((p: Property) => p.id === id);
        }
        
        if (!foundProperty) {
          foundProperty = mockProperties.find(p => p.id === id);
        }
        
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          toast.error('Propiedad no encontrada');
          navigate('/');
        }
        setLoading(false);
      }
    };
    
    fetchOrCreateProperty();
  }, [id, isNewProperty, navigate]);

  return { property, setProperty, loading, isNewProperty };
};
