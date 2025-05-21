
import { useState, useRef, useEffect } from 'react';
import { Document } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DocumentCategories } from './document/DocumentCategories';
import { DocumentCard } from './document/DocumentCard';
import { PrimaryContract } from './document/PrimaryContract';
import { useLocation } from 'react-router-dom';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface PropertyDocumentsProps {
  documents: Document[];
  onDocumentDelete: (documentId: string) => void;
  onDocumentAdd?: (document: Document) => void;
}

const PropertyDocuments = ({ documents, onDocumentDelete, onDocumentAdd }: PropertyDocumentsProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const { handleFileUpload, isUploading } = useDocumentUpload({
    onAddDocument: onDocumentAdd
  });
  
  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    handleFileUpload(file, activeCategory !== 'all' ? activeCategory : 'other');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  // Scroll to documents section if hash is present
  useEffect(() => {
    if (location.hash === '#documents' && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const tenantContracts = documents.filter(doc => doc.category === 'tenant-contract');
  const primaryContract = tenantContracts.find(doc => doc.isPrimary) || tenantContracts[0];

  return (
    <Card id="documents" ref={cardRef}>
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
            onClick={handleFileUploadClick}
            className="flex items-center gap-1"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Subiendo...' : 'Subir'}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
