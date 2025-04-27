
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      // Parse and clean up properties - remove empty "Nueva Propiedad" entries
      let parsedProperties = JSON.parse(savedProperties);
      
      // Filter out empty properties with default name and no details
      parsedProperties = parsedProperties.filter((p: Property) => {
        if (!p || !p.id) return false; // Filter out invalid entries
        
        const isEmptyNewProperty = p.name === 'Nueva Propiedad' && 
          (!p.address || p.address === '') && 
          (!p.rent || p.rent === 0) && 
          (!p.tenants || p.tenants.length === 0);
          
        return !isEmptyNewProperty;
      });
      
      // Save cleaned up properties back to localStorage
      localStorage.setItem('properties', JSON.stringify(parsedProperties));
      
      return parsedProperties;
    }
    return mockProperties;
  });
  
  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);
  
  const handlePropertiesUpdate = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <Layout>
      <div className="text-center pt-5">
        <h1 className="text-3xl font-bold text-gray-800">Mis Propiedades</h1>
      </div>
      <PropertyGrid 
        properties={properties} 
        onPropertiesUpdate={handlePropertiesUpdate} 
      />
    </Layout>
  );
};

export default Index;
