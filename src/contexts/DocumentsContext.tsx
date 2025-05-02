import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { Document, Property } from '@/types/property';
import { mockProperties } from '@/data/mockData';
import { toast } from 'sonner';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface DocumentsContextType {
  documents: Document[];
  searchTerm: string;
  propertyFilter: string;
  typeFilter: string;
  filteredDocuments: Document[];
  isUploading: boolean;
  properties: Array<{ id: string; name: string }>;
  uniqueTypes: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  setSearchTerm: (term: string) => void;
  setPropertyFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;
  handleDownload: (documentName: string) => void;
  handleDelete: (documentId: string, documentName: string) => void;
  handleUploadClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const useDocuments = (): DocumentsContextType => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [documents, setDocuments] = useState<Document[]>(() => {
    // Get documents from localStorage or use mock data
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      const properties = JSON.parse(savedProperties);
      return properties.reduce((docs: Document[], property: any) => {
        const propertyDocuments = property.documents?.map((doc: Document) => ({
          ...doc,
          propertyName: property.name,
          propertyId: property.id
        })) || [];
        return [...docs, ...propertyDocuments];
      }, []);
    }
    return getAllDocuments();
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload, isUploading } = useDocumentUpload();
  
  // Get all properties from localStorage or use mock data
  const properties = (() => {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      try {
        return JSON.parse(savedProperties);
      } catch (e) {
        console.error("Error parsing properties from localStorage", e);
        return mockProperties;
      }
    }
    return mockProperties;
  })();
  
  const uniqueProperties = Array.from(
    new Set([...properties.map((property: Property) => property.id)])
  ).map(id => {
    const property = properties.find((p: Property) => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });
  
  const uniqueTypes = Array.from(
    new Set(documents.map(doc => doc.type))
  );
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesPropertyFilter = 
      propertyFilter === 'all' || doc.propertyId === propertyFilter;
    
    const matchesTypeFilter = 
      typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesPropertyFilter && matchesTypeFilter;
  });

  // Function to get all documents from mock data
  function getAllDocuments() {
    return mockProperties.reduce((documents, property) => {
      const propertyDocuments = property.documents?.map(doc => ({
        ...doc,
        propertyName: property.name,
        propertyId: property.id
      })) || [];
      return [...documents, ...propertyDocuments];
    }, [] as Array<any>);
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get selected property
    const propertyId = propertyFilter !== 'all' ? propertyFilter : uniqueProperties[0]?.id;
    const property = properties.find((p: Property) => p.id === propertyId);
    
    if (!property) {
      toast.error("Selecciona una propiedad para subir documentos");
      return;
    }

    // Upload the document
    const newDoc = handleFileUpload(file);
    if (newDoc) {
      const documentWithProperty = {
        ...newDoc,
        propertyName: property.name,
        propertyId: property.id
      };
      
      setDocuments(prev => [...prev, documentWithProperty]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (documentName: string) => {
    const doc = documents.find(d => d.name === documentName);
    if (doc) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Descargando ${documentName}`);
    }
  };

  const handleDelete = (documentId: string, documentName: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    // Update localStorage
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: any) => {
          if (p.documents?.some((d: any) => d.id === documentId)) {
            return {
              ...p,
              documents: p.documents.filter((d: any) => d.id !== documentId)
            };
          }
          return p;
        });
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    } catch (e) {
      console.error("Error updating localStorage:", e);
    }
    
    toast.success(`Documento "${documentName}" eliminado`);
  };

  const value = {
    documents,
    searchTerm,
    propertyFilter,
    typeFilter,
    filteredDocuments,
    isUploading,
    properties: uniqueProperties,
    uniqueTypes,
    fileInputRef,
    setSearchTerm,
    setPropertyFilter,
    setTypeFilter,
    handleDownload,
    handleDelete,
    handleUploadClick,
    handleFileChange
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};
