
import { useState } from 'react';
import { Document, Property } from '@/types/property';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UseDocumentUploadProps {
  property?: Property | null;
  setProperty?: (property: Property | null) => void;
  onAddDocument?: (document: Document) => void;
}

export function useDocumentUpload({ property, setProperty, onAddDocument }: UseDocumentUploadProps = {}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (file: File, category: string = 'other') => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a blob URL for the file (simulating server storage)
    const fileUrl = URL.createObjectURL(file);
    
    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Determine document type based on extension
    let type = 'other';
    if (['pdf'].includes(fileExtension)) {
      type = 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      type = 'image';
    } else if (['doc', 'docx'].includes(fileExtension)) {
      type = 'doc';
    }
    
    // Create new document object
    const newDocument: Document = {
      id: uuidv4(),
      name: file.name,
      type,
      url: fileUrl,
      uploadDate: new Date().toISOString(),
      category: category as any
    };
    
    // If property and setProperty are provided, update the property
    if (property && setProperty) {
      const updatedProperty = {
        ...property,
        documents: [...(property.documents || []), newDocument]
      };
      
      setProperty(updatedProperty);
      
      // Update in localStorage
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
        toast.success(`Documento "${file.name}" subido con éxito`);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast.error("No se pudo guardar el documento: cuota de almacenamiento excedida");
          console.error("LocalStorage quota exceeded:", error);
        } else {
          toast.error("Error al guardar el documento");
          console.error("Error saving document:", error);
        }
      }
    } 
    
    // Or use the callback if provided
    else if (onAddDocument) {
      onAddDocument(newDocument);
      toast.success(`Documento "${file.name}" subido con éxito`);
    }
    
    setIsUploading(false);
    return newDocument;
  };

  return {
    handleFileUpload,
    isUploading
  };
}
