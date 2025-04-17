
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  
  const handlePropertiesUpdate = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Propiedades</h1>
        <p className="text-muted-foreground">Gestiona tus inmuebles en alquiler de forma sencilla</p>
      </div>
      <PropertyGrid 
        properties={properties} 
        onPropertiesUpdate={handlePropertiesUpdate} 
      />
    </Layout>
  );
};

export default Index;
