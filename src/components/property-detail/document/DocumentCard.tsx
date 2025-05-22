
import { FileType, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/property';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface DocumentCardProps {
  document: Document;
  onDownload: (document: Document) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentCard = ({ document, onDownload, onDelete }: DocumentCardProps) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileType className="h-4 w-4 text-destructive/80" />;
      case 'image':
        return <FileType className="h-4 w-4 text-blue-500/80" />;
      case 'doc':
      case 'docx':
        return <FileType className="h-4 w-4 text-primary/80" />;
      default:
        return <FileType className="h-4 w-4 text-muted-foreground/80" />;
    }
  };

  return (
    <div className="border rounded-lg p-2 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getDocumentIcon(document.type)}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-xs truncate">{document.name}</h3>
          <p className="text-[10px] text-muted-foreground">
            {new Date(document.uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => onDownload(document)}
        >
          <Download className="h-3 w-3" />
          <span className="sr-only">Descargar</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 text-destructive"
            >
              <Trash className="h-3 w-3" />
              <span className="sr-only">Borrar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el documento "{document.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(document.id)}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
