
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileIcon, Download, Trash, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Recopilar todos los documentos de todas las propiedades
  const allDocuments = mockProperties.reduce((documents, property) => {
    const propertyDocuments = property.documents?.map(doc => ({
      ...doc,
      propertyName: property.name,
      propertyId: property.id
    })) || [];
    return [...documents, ...propertyDocuments];
  }, [] as Array<any>);
  
  // Obtener lista única de propiedades para el filtro
  const uniqueProperties = Array.from(
    new Set(mockProperties.map(property => property.id))
  ).map(id => {
    const property = mockProperties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });
  
  // Obtener lista única de tipos de documentos para el filtro
  const uniqueTypes = Array.from(
    new Set(allDocuments.map(doc => doc.type))
  );
  
  // Filtrar documentos según los criterios seleccionados
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

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Documentos</h1>
        <p className="text-muted-foreground">
          Administra los documentos de todas tus propiedades
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full sm:w-[180px] gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filtrar por propiedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las propiedades</SelectItem>
              {uniqueProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
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
        <CardHeader>
          <CardTitle>Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay documentos disponibles</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Propiedad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell>{doc.propertyName}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Documents;
