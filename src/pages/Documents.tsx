
import React from 'react';
import Layout from '@/components/layout/Layout';
import { DocumentsProvider } from '@/contexts/documents';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { DocumentsControls } from '@/components/documents/DocumentsControls';
import { DocumentsContainer } from '@/components/documents/DocumentsContainer';

const Documents = () => {
  return (
    <Layout>
      <DocumentsProvider>
        <DocumentsHeader 
          title="Documentos" 
          subtitle="Administra los documentos de todas tus propiedades" 
        />
        <DocumentsControls />
        <DocumentsContainer />
      </DocumentsProvider>
    </Layout>
  );
};

export default Documents;
