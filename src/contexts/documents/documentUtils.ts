
import { Document, Property } from '@/types/property';
import { mockProperties } from '@/data/mockData';

// Function to get all documents from properties
export function getAllDocuments(): Document[] {
  return mockProperties.reduce((documents, property) => {
    const propertyDocuments = property.documents?.map(doc => ({
      ...doc,
      propertyName: property.name,
      propertyId: property.id
    })) || [];
    return [...documents, ...propertyDocuments];
  }, [] as Array<Document>);
}

// Function to get all properties from localStorage or use mock data
export function getPropertiesFromStorage(): Property[] {
  const savedProperties = localStorage.getItem('properties');
  if (savedProperties) {
    try {
      return JSON.parse(savedProperties);
    } catch (e) {
      console.error("Error parsing properties from localStorage", e);
      return mockProperties;
    }
  }
  return mockProperties;
}

// Function to get unique property objects from properties
export function getUniqueProperties(properties: Property[]): Array<{ id: string; name: string }> {
  return Array.from(
    new Set([...properties.map((property: Property) => property.id)])
  ).map(id => {
    const property = properties.find((p: Property) => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });
}

// Function to get initial documents state
export function getInitialDocuments(): Document[] {
  const savedProperties = localStorage.getItem('properties');
  if (savedProperties) {
    const properties = JSON.parse(savedProperties);
    return properties.reduce((docs: Document[], property: any) => {
      const propertyDocuments = property.documents?.map((doc: Document) => ({
        ...doc,
        propertyName: property.name,
        propertyId: property.id
      })) || [];
      return [...docs, ...propertyDocuments];
    }, []);
  }
  return getAllDocuments();
}
