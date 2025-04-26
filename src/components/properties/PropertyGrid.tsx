
import { useState } from 'react';
import { Search, Plus, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';
import { Property, PaymentRecord } from '@/types/property';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
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
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyGridProps {
  properties: Property[];
  onPropertiesUpdate?: (updatedProperties: Property[]) => void;
}

const PropertyGrid = ({ properties, onPropertiesUpdate }: PropertyGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const filteredProperties = properties.filter(
    property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const handleDeleteSelected = () => {
    try {
      const updatedProperties = properties.filter(p => !selectedProperties.includes(p.id));
      
      // Update localStorage
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      
      // Delete associated images
      const savedImages = localStorage.getItem('propertyImages');
      if (savedImages) {
        const images = JSON.parse(savedImages);
        selectedProperties.forEach(id => delete images[id]);
        localStorage.setItem('propertyImages', JSON.stringify(images));
      }
      
      // Delete additional images
      const savedAdditionalImages = localStorage.getItem('propertyAdditionalImages');
      if (savedAdditionalImages) {
        const additionalImages = JSON.parse(savedAdditionalImages);
        selectedProperties.forEach(id => delete additionalImages[id]);
        localStorage.setItem('propertyAdditionalImages', JSON.stringify(additionalImages));
      }
      
      if (onPropertiesUpdate) {
        onPropertiesUpdate(updatedProperties);
      }
      
      setSelectedProperties([]);
      setShowDeleteDialog(false);
      toast.success('Propiedades seleccionadas eliminadas correctamente');
    } catch (error) {
      console.error('Error al eliminar las propiedades:', error);
      toast.error('Error al eliminar las propiedades');
    }
  };

  const handlePaymentUpdate = (propertyId: string, month: number, year: number, isPaid: boolean, notes?: string) => {
    const updatedProperties = properties.map(property => {
      if (property.id === propertyId) {
        const existingPayments = property.paymentHistory || [];
        const existingPaymentIndex = existingPayments.findIndex(p => p.month === month && p.year === year);
        
        let updatedPayments: PaymentRecord[];
        
        if (existingPaymentIndex >= 0) {
          // Update existing payment record
          updatedPayments = [...existingPayments];
          updatedPayments[existingPaymentIndex] = {
            ...updatedPayments[existingPaymentIndex],
            isPaid,
            date: new Date().toISOString(),
            notes: notes || updatedPayments[existingPaymentIndex].notes
          };
        } else {
          // Create new payment record
          const newPayment: PaymentRecord = {
            id: `payment-${Date.now()}`,
            date: new Date().toISOString(),
            amount: property.rent,
            isPaid,
            month,
            year,
            notes
          };
          updatedPayments = [...existingPayments, newPayment];
        }
        
        // Update the property
        return {
          ...property,
          paymentHistory: updatedPayments,
          rentPaid: isPaid
        };
      }
      return property;
    });
    
    if (onPropertiesUpdate) {
      onPropertiesUpdate(updatedProperties);
      toast.success(`Estado de pago actualizado para ${month + 1}/${year}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {selectedProperties.length > 0 && (
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
              data-delete-properties
            >
              <Trash className="h-4 w-4" />
              <span>Eliminar ({selectedProperties.length})</span>
            </Button>
          )}
          <Button asChild className="flex gap-2">
            <Link to="/property/new">
              <Plus className="h-4 w-4" />
              <span>Nueva Propiedad</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-medium">No se encontraron propiedades</p>
          <p className="text-muted-foreground mt-2">Intente con otra búsqueda o agregue una nueva propiedad</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="relative">
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={() => handlePropertySelect(property.id)}
                />
              </div>
              <PropertyCard 
                property={property} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente {selectedProperties.length} propiedades
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyGrid;

