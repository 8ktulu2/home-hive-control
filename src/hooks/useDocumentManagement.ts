
import { Property } from '@/types/property';

export function useDocumentManagement(property: Property | null, setProperty: (property: Property | null) => void) {
  const handleDocumentDelete = (documentId: string) => {
    if (property && property.documents) {
      const updatedProperty = {
        ...property,
        documents: property.documents.filter(doc => doc.id !== documentId)
      };
      
      setProperty(updatedProperty);
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    }
  };

  return {
    handleDocumentDelete,
  };
}
