
import { FileType, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/property';

interface DocumentCardProps {
  document: Document;
  onDownload: (document: Document) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentCard = ({ document, onDownload, onDelete }: DocumentCardProps) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileType className="h-10 w-10 text-destructive/80" />;
      case 'image':
        return <FileType className="h-10 w-10 text-blue-500/80" />;
      case 'doc':
      case 'docx':
        return <FileType className="h-10 w-10 text-primary/80" />;
      default:
        return <FileType className="h-10 w-10 text-muted-foreground/80" />;
    }
  };

  return (
    <div className="border rounded-lg p-3 flex flex-col">
      <div className="flex justify-center p-2">
        {getDocumentIcon(document.type)}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm truncate">{document.name}</h3>
        <p className="text-xs text-muted-foreground">
          {new Date(document.uploadDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-between mt-2 pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary flex items-center gap-1"
          onClick={() => onDownload(document)}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="text-xs">Descargar</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive flex items-center gap-1"
          onClick={() => onDelete(document.id)}
        >
          <Trash className="h-3.5 w-3.5" />
          <span className="text-xs">Borrar</span>
        </Button>
      </div>
    </div>
  );
};
