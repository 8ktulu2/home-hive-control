
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const allDocuments = mockProperties.reduce((documents, property) => {
    const propertyDocuments = property.documents?.map(doc => ({
      ...doc,
      propertyName: property.name,
      propertyId: property.id
    })) || [];
    return [...documents, ...propertyDocuments];
  }, [] as Array<any>);
  
  const uniqueProperties = Array.from(
    new Set(mockProperties.map(property => property.id))
  ).map(id => {
    const property = mockProperties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });
  
  const uniqueTypes = Array.from(
    new Set(allDocuments.map(doc => doc.type))
  );
  
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyFilter = 
      propertyFilter === 'all' || doc.propertyId === propertyFilter;
    
    const matchesTypeFilter = 
      typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesPropertyFilter && matchesTypeFilter;
  });

  const handleDownload = (documentName: string) => {
    console.log('Downloading:', documentName);
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
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] pl-4">Nombre</TableHead>
                    <TableHead className="w-[40%]">Propiedad</TableHead>
                    <TableHead className="w-[20%] text-right pr-4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="max-w-[40%] truncate pl-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="hover:underline text-left">
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
                      <TableCell className="max-w-[40%] truncate">
                        {doc.propertyName}
                      </TableCell>
                      <TableCell className="w-[20%] text-right pr-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4" />
                        </Button>
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
