
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

export function useAllProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = () => {
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const parsedProperties = JSON.parse(savedProperties);
          setProperties(parsedProperties);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  return { properties, loading };
}
