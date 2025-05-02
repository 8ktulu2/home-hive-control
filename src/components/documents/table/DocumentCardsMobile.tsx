
import { Document } from '@/types/property';
import { DocumentActions } from './DocumentActions';
import { FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCardsMobileProps {
  documents: Document[];
  onDownload: (documentName: string) => void;
  onDelete: (documentId: string, documentName: string) => void;
}

export const DocumentCardsMobile = ({ documents, onDownload, onDelete }: DocumentCardsMobileProps) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No hay documentos disponibles</p>
      </div>
    );
  }

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
            <DocumentActions 
              document={doc}
              onDownload={onDownload}
              actionType="download"
              className="h-8 w-8 text-primary"
              asButton
            />
            <DocumentActions 
              document={doc}
              onDelete={onDelete}
              actionType="delete"
              className="h-8 w-8 text-destructive"
              asButton
            />
          </div>
        </div>
      ))}
    </div>
  );
};
