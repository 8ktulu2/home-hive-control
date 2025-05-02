
import { 
  getAllDocuments, 
  getPropertiesFromStorage, 
  getUniqueProperties, 
  getInitialDocuments 
} from '../documentUtils';
import { mockProperties } from '@/data/mockData';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('documentUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('getAllDocuments returns flattened list of documents', () => {
    const documents = getAllDocuments();
    
    // The mock data has 4 documents across 3 properties
    expect(documents.length).toBe(4);
    
    // Each document should have propertyId and propertyName
    expect(documents[0].propertyId).toBeDefined();
    expect(documents[0].propertyName).toBeDefined();
  });

  test('getPropertiesFromStorage returns mock data if localStorage is empty', () => {
    const properties = getPropertiesFromStorage();
    
    expect(properties).toEqual(mockProperties);
    expect(localStorage.getItem).toHaveBeenCalledWith('properties');
  });
  
  test('getPropertiesFromStorage returns data from localStorage if available', () => {
    const mockStoredProperties = [
      { id: 'test-id', name: 'Test Property' }
    ];
    localStorage.setItem('properties', JSON.stringify(mockStoredProperties));
    
    const properties = getPropertiesFromStorage();
    
    expect(properties).toEqual(mockStoredProperties);
  });
  
  test('getPropertiesFromStorage handles JSON parse errors', () => {
    localStorage.setItem('properties', 'invalid-json');
    
    const properties = getPropertiesFromStorage();
    
    expect(properties).toEqual(mockProperties);
  });

  test('getUniqueProperties returns unique property objects', () => {
    const testProperties = [
      { id: '1', name: 'Property 1' },
      { id: '2', name: 'Property 2' },
      { id: '1', name: 'Property 1 Duplicate' } // Duplicate ID
    ];
    
    const uniqueProperties = getUniqueProperties(testProperties);
    
    expect(uniqueProperties.length).toBe(2);
    expect(uniqueProperties[0].id).toBe('1');
    expect(uniqueProperties[0].name).toBe('Property 1'); // First occurrence is used
    expect(uniqueProperties[1].id).toBe('2');
  });

  test('getInitialDocuments returns documents from localStorage if available', () => {
    const mockStoredProperties = [
      { 
        id: '1', 
        name: 'Test Property',
        documents: [
          { id: 'doc1', name: 'Test Doc', type: 'pdf' }
        ]
      }
    ];
    localStorage.setItem('properties', JSON.stringify(mockStoredProperties));
    
    const documents = getInitialDocuments();
    
    expect(documents.length).toBe(1);
    expect(documents[0].id).toBe('doc1');
    expect(documents[0].propertyName).toBe('Test Property');
    expect(documents[0].propertyId).toBe('1');
  });

  test('getInitialDocuments falls back to getAllDocuments if localStorage is empty', () => {
    const getAllDocumentsSpy = jest.spyOn(require('../documentUtils'), 'getAllDocuments');
    getAllDocumentsSpy.mockImplementation(() => [{ id: 'mock-doc' }]);
    
    const documents = getInitialDocuments();
    
    expect(documents).toEqual([{ id: 'mock-doc' }]);
    expect(getAllDocumentsSpy).toHaveBeenCalled();
    
    getAllDocumentsSpy.mockRestore();
  });
});
