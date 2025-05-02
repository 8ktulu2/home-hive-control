
import React, { createContext, useContext } from 'react';
import { DocumentsContextType } from './types';
import { useDocumentsState } from './useDocumentsState';

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const useDocuments = (): DocumentsContextType => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const documentsState = useDocumentsState();

  return (
    <DocumentsContext.Provider value={documentsState}>
      {children}
    </DocumentsContext.Provider>
  );
};
