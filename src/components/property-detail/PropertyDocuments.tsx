
import { useState, useRef } from 'react';
import { Document } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, FileType, Download, Trash, File, FolderOpen, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PropertyDocumentsProps {
  documents: Document[];
  onDocumentDelete: (documentId: string) => void;
}

const PropertyDocuments = ({ documents, onDocumentDelete }: PropertyDocumentsProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const categories = [
    { id: 'all', name: 'Todos', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'tenant-contract', name: 'Contratos de Alquiler', icon: <FileText className="h-4 w-4" /> },
    { id: 'supply-contract', name: 'Contratos de Suministros', icon: <FileText className="h-4 w-4" /> },
    { id: 'insurance', name: 'Contratos de Seguros', icon: <FileText className="h-4 w-4" /> },
    { id: 'invoice', name: 'Facturas', icon: <FileText className="h-4 w-4" /> },
    { id: 'other', name: 'Otros', icon: <Folder className="h-4 w-4" /> }
  ];
  
  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    
    // In a real app, you would upload the file to a server here
    toast.info('La función de subida de documentos estará disponible próximamente', {
      description: 'Esta característica está en desarrollo',
      duration: 2000
    });
  };

  const handleDownload = (document: Document) => {
    // In a real application, this would be a real URL to your file
    const fileUrl = document.url;

    // Create an anchor element and trigger the download
    // Use window.document to specify we're using the browser's document object
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = document.name; // Set the file name for download
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    toast.success(`Descargando ${document.name}`, {
      icon: <Download className="h-4 w-4" />,
      duration: 2000
    });
  };

  const handleDelete = (documentId: string) => {
    onDocumentDelete(documentId);
    toast.success('Documento eliminado', { duration: 2000 });
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

  const tenantContracts = documents.filter(doc => doc.category === 'tenant-contract');
  const primaryContract = tenantContracts.find(doc => doc.isPrimary) || tenantContracts[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>Documentos</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleFileUpload}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            <span>Subir</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {primaryContract && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <File className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <h3 className="font-medium mb-1">Contrato Principal</h3>
                <p className="text-sm text-muted-foreground mb-2">{primaryContract.name}</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-primary flex items-center gap-1"
                    onClick={() => handleDownload(primaryContract)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-xs">Descargar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className="flex items-center gap-2 justify-center"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">{category.name}</span>
            </Button>
          ))}
        </div>
          
        <div className="mt-4">
          {filteredDocuments.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No hay documentos en esta categoría</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDocuments.map(document => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
