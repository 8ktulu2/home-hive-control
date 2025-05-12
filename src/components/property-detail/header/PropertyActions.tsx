
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PropertyActionsProps {
  propertyId: string;
}

const PropertyActions: React.FC<PropertyActionsProps> = ({ propertyId }) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleDelete = () => {
    try {
      // Get current properties from localStorage
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        // Filter out the property to delete
        const updatedProperties = properties.filter((p: any) => p.id !== propertyId);
        // Save back to localStorage
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        
        // Delete associated images if they exist
        const savedImages = localStorage.getItem('propertyImages');
        if (savedImages) {
          const images = JSON.parse(savedImages);
          delete images[propertyId];
          localStorage.setItem('propertyImages', JSON.stringify(images));
        }
        
        // Delete additional images if they exist
        const savedAdditionalImages = localStorage.getItem('propertyAdditionalImages');
        if (savedAdditionalImages) {
          const additionalImages = JSON.parse(savedAdditionalImages);
          delete additionalImages[propertyId];
          localStorage.setItem('propertyAdditionalImages', JSON.stringify(additionalImages));
        }

        toast.success('Propiedad eliminada correctamente');
        navigate('/');
      }
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      toast.error('Error al eliminar la propiedad');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-muted-foreground"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Volver</span>
      </Button>
      <Link to={`/property/${propertyId}/edit`}>
        <Button variant="outline" size="sm" className="flex items-center">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </Link>
      <Button 
        variant="destructive" 
        size="sm" 
        className="flex items-center"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Eliminar</span>
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta propiedad
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyActions;
