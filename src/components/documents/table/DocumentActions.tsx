
import { X, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Document } from '@/types/property';
import { Button } from '@/components/ui/button';

interface DocumentActionsProps {
  document: Document;
  onDownload?: (documentName: string) => void;
  onDelete?: (documentId: string, documentName: string) => void;
  actionType: 'download' | 'delete';
  className?: string;
  children?: React.ReactNode;
  asButton?: boolean;
}

export const DocumentActions = ({ 
  document, 
  onDownload, 
  onDelete, 
  actionType, 
  className = '',
  children,
  asButton = false
}: DocumentActionsProps) => {
  const isDownload = actionType === 'download';
  
  const getDialogContent = () => {
    if (isDownload) {
      return {
        title: "Descargar documento",
        description: `¿Quieres descargar el documento "${document.name}"?`,
        action: "Descargar",
        onAction: () => onDownload?.(document.name)
      };
    }
    
    return {
      title: "Eliminar documento",
      description: `¿Estás seguro de que quieres eliminar el documento "${document.name}"?`,
      action: "Eliminar",
      onAction: () => onDelete?.(document.id, document.name)
    };
  };
  
  const dialogContent = getDialogContent();
  
  const renderTrigger = () => {
    if (asButton) {
      return (
        <Button size="icon" variant="ghost" className={className}>
          {isDownload ? <Download size={16} /> : <X size={16} />}
        </Button>
      );
    }
    
    if (children) {
      return <button className={className}>{children}</button>;
    }
    
    return (
      <button className={className}>
        {isDownload ? <Download size={16} strokeWidth={2} /> : <X size={16} strokeWidth={2} />}
      </button>
    );
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {renderTrigger()}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={dialogContent.onAction}>
            {dialogContent.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
