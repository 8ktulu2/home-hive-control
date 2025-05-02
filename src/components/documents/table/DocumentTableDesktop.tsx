
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document } from '@/types/property';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentActions } from './DocumentActions';

interface DocumentTableDesktopProps {
  documents: Document[];
  onDownload: (documentName: string) => void;
  onDelete: (documentId: string, documentName: string) => void;
}

export const DocumentTableDesktop = ({ documents, onDownload, onDelete }: DocumentTableDesktopProps) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No hay documentos disponibles</p>
      </div>
    );
  }

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
                  <DocumentActions 
                    document={doc}
                    onDownload={onDownload}
                    actionType="download"
                    className="hover:underline text-left truncate max-w-[150px] block"
                  >
                    {doc.name}
                  </DocumentActions>
                </TableCell>
                <TableCell className="py-2 truncate max-w-[150px]">
                  {doc.propertyName || 'Sin propiedad'}
                </TableCell>
                <TableCell className="py-2 text-center">
                  <DocumentActions 
                    document={doc}
                    onDelete={onDelete}
                    actionType="delete"
                    className="text-red-500 hover:bg-red-50 rounded-full p-1 inline-flex"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
