
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Document } from '@/types/property';

interface DocumentTableProps {
  documents: Document[];
  onDownload: (documentName: string) => void;
  onDelete: (documentId: string, documentName: string) => void;
}

export const DocumentTable = ({ documents, onDownload, onDelete }: DocumentTableProps) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No hay documentos disponibles</p>
      </div>
    );
  }

  return (
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
  );
};
