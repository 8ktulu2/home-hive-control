
import { X, Download, FileType } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Document } from '@/types/property';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentTableProps {
  documents: Document[];
  onDownload: (documentName: string) => void;
  onDelete: (documentId: string, documentName: string) => void;
}

export const DocumentTable = ({ documents, onDownload, onDelete }: DocumentTableProps) => {
  const isMobile = useIsMobile();
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No hay documentos disponibles</p>
      </div>
    );
  }

  // En dispositivos móviles, mostrar una versión adaptada con tarjetas en lugar de tabla
  if (isMobile) {
    return (
      <div className="space-y-4 px-2 py-2">
        {documents.map(doc => (
          <div key={doc.id} className="border rounded-lg p-3 flex items-center gap-3">
            <div className="flex-shrink-0">
              <FileType className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{doc.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{doc.propertyName || 'Sin propiedad'}</p>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-primary">
                    <Download size={16} />
                  </Button>
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
                    <AlertDialogAction onClick={() => onDownload(doc.name)}>
                      Descargar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                    <X size={16} />
                  </Button>
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
                    <AlertDialogAction onClick={() => onDelete(doc.id, doc.name)}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Versión de escritorio con tabla
  return (
    <ScrollArea className="w-full">
      <div className="min-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] pl-2">Nombre</TableHead>
              <TableHead className="w-[40%]">Propiedad</TableHead>
              <TableHead className="w-[20%] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map(doc => (
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
                        <AlertDialogAction onClick={() => onDownload(doc.name)}>
                          Descargar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell className="py-2 truncate max-w-[150px]">
                  {doc.propertyName || 'Sin propiedad'}
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
                        <AlertDialogAction onClick={() => onDelete(doc.id, doc.name)}>
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
    </ScrollArea>
  );
};
