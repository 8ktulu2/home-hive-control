
import { Document } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, FileType, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PropertyDocumentsProps {
  documents: Document[];
  onDocumentDelete: (documentId: string) => void;
}

const PropertyDocuments = ({ documents, onDocumentDelete }: PropertyDocumentsProps) => {
  const handleFileUpload = () => {
    toast.info('La función de subida de documentos estará disponible próximamente', {
      description: 'Esta característica está en desarrollo'
    });
  };

  const handleDownload = (document: Document) => {
    toast.info(`Descargando documento: ${document.name}`, {
      icon: <Download className="h-4 w-4" />
    });
  };

  const handleDelete = (documentId: string) => {
    onDocumentDelete(documentId);
    toast.success('Documento eliminado');
  };

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>Documentos</span>
        </CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleFileUpload}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          <span>Subir</span>
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No hay documentos todavía</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map(document => (
              <div 
                key={document.id} 
                className="border rounded-lg p-3 flex flex-col"
              >
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
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-xs">Descargar</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive flex items-center gap-1"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    <span className="text-xs">Borrar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
