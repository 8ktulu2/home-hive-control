
import { useState, useRef } from 'react';
import { Document } from '@/types/property';
import { toast } from 'sonner';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { getAllDocuments, getPropertiesFromStorage, getUniqueProperties, getInitialDocuments } from './documentUtils';

export function useDocumentsState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [documents, setDocuments] = useState<Document[]>(getInitialDocuments);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload, isUploading } = useDocumentUpload();
  
  // Get all properties and unique properties
  const properties = getPropertiesFromStorage();
  const uniqueProperties = getUniqueProperties(properties);
  
  // Get unique document types
  const uniqueTypes = Array.from(
    new Set(documents.map(doc => doc.type))
  );
  
  // Filter documents based on search term and filters
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get selected property
    const propertyId = propertyFilter !== 'all' ? propertyFilter : uniqueProperties[0]?.id;
    const property = properties.find((p) => p.id === propertyId);
    
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

  return {
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
}
