
import { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Document, Property } from '@/types/property';
import { DocumentSearchBar } from '@/components/documents/DocumentSearchBar';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

const Documents = () => {
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

  return (
    <Layout>
      <div className="mb-4 max-w-full">
        <h1 className="text-2xl font-bold mb-2">Documentos</h1>
        <p className="text-muted-foreground text-sm">
          Administra los documentos de todas tus propiedades
        </p>
      </div>
      
      <div className="flex flex-col gap-3 mb-4 max-w-full">
        <DocumentSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <DocumentFilters
          propertyFilter={propertyFilter}
          typeFilter={typeFilter}
          onPropertyFilterChange={setPropertyFilter}
          onTypeFilterChange={setTypeFilter}
          onUploadClick={handleUploadClick}
          properties={uniqueProperties}
          uniqueTypes={uniqueTypes}
          isUploading={isUploading}
        />
      </div>

      <Card className="max-w-full">
        <CardHeader className="py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documentos ({filteredDocuments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <DocumentTable 
            documents={filteredDocuments}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Documents;
