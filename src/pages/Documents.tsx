
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Trash, Search, Filter } from 'lucide-react';
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
        
        <div className="flex gap-2">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="flex-1 gap-1">
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
            <SelectTrigger className="flex-1">
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
        <CardContent className="px-2 py-1">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No hay documentos disponibles</p>
            </div>
          ) : (
            <div className="overflow-auto -mx-2 px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Propiedad</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha</TableHead>
                    <TableHead className="w-[80px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="flex items-center gap-2">
                        <span className="truncate font-medium">{doc.name}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{doc.propertyName}</TableCell>
                      <TableCell className="hidden md:table-cell">{doc.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{doc.uploadDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
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

