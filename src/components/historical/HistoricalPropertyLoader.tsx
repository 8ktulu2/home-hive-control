
import React from 'react';
import Layout from '@/components/layout/Layout';

interface HistoricalPropertyLoaderProps {
  yearNumber: number;
}

const HistoricalPropertyLoader: React.FC<HistoricalPropertyLoaderProps> = ({ yearNumber }) => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando datos del año {yearNumber}...</p>
        </div>
      </div>
    </Layout>
  );
};

export default HistoricalPropertyLoader;
