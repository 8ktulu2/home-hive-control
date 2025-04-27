import { useState, useEffect, useRef } from 'react';
import { Property } from '@/types/property';
import PropertyGridHeader from './grid/PropertyGridHeader';
import PropertyGridList from './grid/PropertyGridList';
import DeletePropertiesDialog from './grid/DeletePropertiesDialog';
import { toast } from 'sonner';

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
    console.log('PropertyGrid - handlePropertySelect:', propertyId);
    
    setSelectedProperties(prev => {
      // Toggle selection
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Listen for the delete button in header actions
  useEffect(() => {
    const handleShowDeleteDialog = () => {
      if (selectedProperties.length > 0) {
        setShowDeleteDialog(true);
      } else {
        toast.info('Por favor, seleccione las propiedades a eliminar en la lista');
      }
    };
    
    const deleteButton = document.querySelector('button[aria-label="Delete properties"]');
    if (deleteButton) {
      deleteButton.addEventListener('click', handleShowDeleteDialog);
    }
    
    return () => {
      if (deleteButton) {
        deleteButton.removeEventListener('click', handleShowDeleteDialog);
      }
    };
  }, [selectedProperties.length]);

  const handleDeleteSelected = () => {
    try {
      console.log('Deleting properties:', selectedProperties);
      
      // Filter out any empty properties or properties with default names to fix the issue
      const validProperties = properties.filter(p => 
        p.name !== 'Nueva Propiedad' || 
        (p.address && p.address.trim() !== '')
      );
      
      // Now filter out selected properties
      const updatedProperties = validProperties.filter(p => !selectedProperties.includes(p.id));
      
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
      
      // Delete any task notifications related to the properties
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        const updatedNotifications = notifications.filter(
          (n: any) => !selectedProperties.includes(n.propertyId)
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
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

  const handlePaymentUpdate = (propertyId: string, month: number, year: number, isPaid: boolean) => {
    const updatedProperties = properties.map(property => {
      if (property.id === propertyId) {
        const existingPayments = property.paymentHistory || [];
        const existingPaymentIndex = existingPayments.findIndex(p => p.month === month && p.year === year);
        
        let updatedPayments;
        
        if (existingPaymentIndex >= 0) {
          updatedPayments = [...existingPayments];
          updatedPayments[existingPaymentIndex] = {
            ...updatedPayments[existingPaymentIndex],
            isPaid,
            date: new Date().toISOString()
          };
        } else {
          const newPayment = {
            id: `payment-${Date.now()}`,
            date: new Date().toISOString(),
            amount: property.rent,
            isPaid,
            month,
            year
          };
          updatedPayments = [...existingPayments, newPayment];
        }
        
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
      <PropertyGridHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedProperties.length}
        onDeleteClick={() => {
          if (selectedProperties.length > 0) {
            setShowDeleteDialog(true);
          } else {
            toast.info('Por favor, seleccione las propiedades a eliminar en la lista');
          }
        }}
      />
      
      <PropertyGridList
        properties={filteredProperties}
        selectedProperties={selectedProperties}
        onPropertySelect={handlePropertySelect}
        onPaymentUpdate={handlePaymentUpdate}
      />

      <DeletePropertiesDialog
        showDialog={showDeleteDialog}
        selectedCount={selectedProperties.length}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDeleteSelected}
      />
    </div>
  );
};

export default PropertyGrid;
