
import { useState, useRef } from 'react';
import { Document } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DocumentCategories } from './document/DocumentCategories';
import { DocumentCard } from './document/DocumentCard';
import { PrimaryContract } from './document/PrimaryContract';

interface PropertyDocumentsProps {
  documents: Document[];
  onDocumentDelete: (documentId: string) => void;
}

const PropertyDocuments = ({ documents, onDocumentDelete }: PropertyDocumentsProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    toast.info('La función de subida de documentos estará disponible próximamente', {
      description: 'Esta característica está en desarrollo',
      duration: 2000
    });
  };

  const handleDownload = (document: Document) => {
    const fileUrl = document.url;
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = document.name;
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
          <PrimaryContract 
            contract={primaryContract} 
            onDownload={handleDownload}
          />
        )}

        <DocumentCategories 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
          
        <div className="mt-4">
          {filteredDocuments.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No hay documentos en esta categoría
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
