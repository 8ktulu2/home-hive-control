
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const savedProperties = localStorage.getItem('properties');
    return savedProperties ? JSON.parse(savedProperties) : mockProperties;
  });
  
  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);
  
  const handlePropertiesUpdate = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Propiedades</h1>
          <p className="text-muted-foreground">Gestiona tus inmuebles en alquiler de forma sencilla</p>
        </div>
      </div>
      <PropertyGrid 
        properties={properties} 
        onPropertiesUpdate={handlePropertiesUpdate} 
      />
    </Layout>
  );
};

export default Index;

