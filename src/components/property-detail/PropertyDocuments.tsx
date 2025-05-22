
import { useState, useRef, useEffect } from 'react';
import { Document } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DocumentCategories } from './document/DocumentCategories';
import { DocumentCard } from './document/DocumentCard';
import { useLocation } from 'react-router-dom';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface PropertyDocumentsProps {
  documents: Document[];
  onDocumentDelete: (documentId: string) => void;
  onDocumentAdd?: (document: Document) => void;
}

const PropertyDocuments = ({ documents, onDocumentDelete, onDocumentAdd }: PropertyDocumentsProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState<string>('other');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const { handleFileUpload, isUploading } = useDocumentUpload({
    onAddDocument: onDocumentAdd
  });
  
  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const handleUploadClick = () => {
    setShowCategoryDialog(true);
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      toast.error("No se pueden subir documentos a 'Todos'. Por favor, selecciona una categoría específica.");
      return;
    }
    
    setUploadCategory(category);
    setShowCategoryDialog(false);
    
    // Trigger file input click after closing the dialog
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Ensure a specific category is selected, not "all"
    if (!uploadCategory || uploadCategory === 'all') {
      toast.error("Por favor, selecciona una categoría específica para el documento.");
      return;
    }
    
    // Pass the selected category to the file upload handler
    handleFileUpload(file, uploadCategory);
    
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

  const confirmDeleteDocument = (documentId: string) => {
    setDocumentToDelete(documentId);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      onDocumentDelete(documentToDelete);
      toast.success('Documento eliminado', { duration: 2000 });
      setDocumentToDelete(null);
    }
  };

  // Scroll to documents section if hash is present
  useEffect(() => {
    if (location.hash === '#documents' && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);
  
  const categories = [
    { id: 'all', name: 'Todos', icon: <FileText className="h-4 w-4" /> },
    { id: 'tenant-contract', name: 'C. Alquiler', icon: <FileText className="h-4 w-4" /> },
    { id: 'supply-contract', name: 'C. Suministros', icon: <FileText className="h-4 w-4" /> },
    { id: 'insurance', name: 'C. Seguros', icon: <FileText className="h-4 w-4" /> },
    { id: 'invoice', name: 'Facturas', icon: <FileText className="h-4 w-4" /> },
    { id: 'other', name: 'Otros', icon: <FileText className="h-4 w-4" /> }
  ];

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
            onClick={handleUploadClick}
            className="flex items-center gap-1 h-8"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Subiendo...' : 'Subir'}</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
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
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDownload={handleDownload}
                  onDelete={confirmDeleteDocument}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el documento y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Category selection dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecciona una categoría</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-4">
            {categories.filter(cat => cat.id !== 'all').map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="flex justify-start items-center gap-2 h-10"
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PropertyDocuments;
