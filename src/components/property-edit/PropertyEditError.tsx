
import Layout from '@/components/layout/Layout';

const PropertyEditError = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-destructive">Error al cargar la propiedad</p>
      </div>
    </Layout>
  );
};

export default PropertyEditError;
