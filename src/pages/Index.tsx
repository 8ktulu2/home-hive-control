
import Layout from '@/components/layout/Layout';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { mockProperties } from '@/data/mockData';

const Index = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Propiedades</h1>
        <p className="text-muted-foreground">Gestiona tus inmuebles en alquiler de forma sencilla</p>
      </div>
      <PropertyGrid properties={mockProperties} />
    </Layout>
  );
};

export default Index;
