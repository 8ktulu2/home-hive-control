
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileIcon, Download, Trash } from 'lucide-react';

const Documents = () => {
  // Recopilar todos los documentos de todas las propiedades
  const allDocuments = mockProperties.reduce((documents, property) => {
    const propertyDocuments = property.documents?.map(doc => ({
      ...doc,
      propertyName: property.name,
      propertyId: property.id
    })) || [];
    return [...documents, ...propertyDocuments];
  }, [] as Array<any>);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Documentos</h1>
        <p className="text-muted-foreground">
          Administra los documentos de todas tus propiedades
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {allDocuments.length === 0 ? (
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
                {allDocuments.map(doc => (
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
