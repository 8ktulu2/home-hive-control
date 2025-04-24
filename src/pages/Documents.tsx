
import { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Search, Filter, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { Document } from '@/types/property';
import { toast } from 'sonner';

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
  
  const uniqueProperties = Array.from(
    new Set([...mockProperties.map(property => property.id)])
  ).map(id => {
    const property = mockProperties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });
  
  const uniqueTypes = Array.from(
    new Set(documents.map(doc => doc.type))
  );
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyFilter = 
      propertyFilter === 'all' || doc.propertyId === propertyFilter;
    
    const matchesTypeFilter = 
      typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesPropertyFilter && matchesTypeFilter;
  });

  const handleDocumentUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get selected property
    const propertyId = propertyFilter !== 'all' ? propertyFilter : uniqueProperties[0]?.id;
    const property = mockProperties.find(p => p.id === propertyId);
    
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
      
      // Save to localStorage
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: any) => {
          if (p.id === property.id) {
            return {
              ...p,
              documents: [...(p.documents || []), newDoc]
            };
          }
          return p;
        });
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
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
    
    toast.success(`Documento "${documentName}" eliminado`);
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Documentos</h1>
        <p className="text-muted-foreground text-sm">
          Administra los documentos de todas tus propiedades
        </p>
      </div>
      
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full sm:w-[200px] gap-1">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Propiedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex justify-end sm:flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button 
              onClick={handleDocumentUpload} 
              variant="outline"
              className="flex items-center gap-1"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Subiendo...' : 'Subir documento'}</span>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No hay documentos disponibles</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] pl-2">Nombre</TableHead>
                    <TableHead className="w-[40%]">Propiedad</TableHead>
                    <TableHead className="w-[20%] text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="py-2 pl-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="hover:underline text-left truncate max-w-[150px] block">
                              {doc.name}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Descargar documento</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Quieres descargar el documento "{doc.name}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDownload(doc.name)}>
                                Descargar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                      <TableCell className="py-2 truncate max-w-[150px]">
                        {doc.propertyName}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-red-500 hover:bg-red-50 rounded-full p-1 inline-flex">
                              <X size={16} strokeWidth={2} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar documento</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que quieres eliminar el documento "{doc.name}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(doc.id, doc.name)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Documents;
