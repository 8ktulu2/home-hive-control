
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoricalPropertyErrorState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No se pudieron cargar los datos</h2>
        <Button onClick={() => navigate('/historicos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Históricos
        </Button>
      </div>
    </Layout>
  );
};

export default HistoricalPropertyErrorState;
