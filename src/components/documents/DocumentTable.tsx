
import { Document } from '@/types/property';
import { useIsMobile } from '@/hooks/use-mobile';
import { DocumentTableDesktop } from './table/DocumentTableDesktop';
import { DocumentCardsMobile } from './table/DocumentCardsMobile';

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
      <DocumentCardsMobile 
        documents={documents}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    );
  }

  // Versión de escritorio con tabla
  return (
    <DocumentTableDesktop 
      documents={documents}
      onDownload={onDownload}
      onDelete={onDelete}
    />
  );
};
