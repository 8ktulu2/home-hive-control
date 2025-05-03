
import { renderHook, act } from '@testing-library/react';
import { useDocumentsState } from '../useDocumentsState';
import * as documentUtils from '../documentUtils';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock the document utils
jest.mock('../documentUtils', () => ({
  getInitialDocuments: jest.fn(() => [
    { id: '1', name: 'Test Doc', type: 'pdf', url: '#', uploadDate: '2023-01-01' },
    { id: '2', name: 'Another Doc', type: 'doc', url: '#', uploadDate: '2023-01-02' }
  ]),
  getPropertiesFromStorage: jest.fn(() => [
    { id: '1', name: 'Property 1' },
    { id: '2', name: 'Property 2' }
  ]),
  getUniqueProperties: jest.fn(() => [
    { id: '1', name: 'Property 1' },
    { id: '2', name: 'Property 2' }
  ]),
  getAllDocuments: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn<(key: string) => string | null>((key) => store[key] || null),
    setItem: jest.fn<(key: string, value: string) => void>((key, value) => {
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

// Mock document.createElement for download functionality
const mockElement = {
  setAttribute: jest.fn(),
  click: jest.fn(),
  style: {},
  href: '',
  download: '',
} as unknown as HTMLElement;

document.createElement = jest.fn().mockImplementation(() => mockElement);

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock useDocumentUpload hook
jest.mock('@/hooks/useDocumentUpload', () => ({
  useDocumentUpload: jest.fn(() => ({
    handleFileUpload: jest.fn((file: File) => ({
      id: 'new-doc-id',
      name: file.name,
      type: 'pdf',
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString()
    })),
    isUploading: false
  }))
}));

describe('useDocumentsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useDocumentsState());
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.propertyFilter).toBe('all');
    expect(result.current.typeFilter).toBe('all');
    expect(result.current.documents.length).toBe(2);
    expect(result.current.filteredDocuments.length).toBe(2);
  });

  test('setSearchTerm updates search term state', () => {
    const { result } = renderHook(() => useDocumentsState());
    
    act(() => {
      result.current.setSearchTerm('test');
    });
    
    expect(result.current.searchTerm).toBe('test');
  });

  test('setPropertyFilter updates property filter state', () => {
    const { result } = renderHook(() => useDocumentsState());
    
    act(() => {
      result.current.setPropertyFilter('1');
    });
    
    expect(result.current.propertyFilter).toBe('1');
  });

  test('setTypeFilter updates type filter state', () => {
    const { result } = renderHook(() => useDocumentsState());
    
    act(() => {
      result.current.setTypeFilter('pdf');
    });
    
    expect(result.current.typeFilter).toBe('pdf');
  });

  test('filtering documents works correctly', () => {
    const { result } = renderHook(() => useDocumentsState());
    
    // Filter by search term
    act(() => {
      result.current.setSearchTerm('Another');
    });
    
    expect(result.current.filteredDocuments.length).toBe(1);
    expect(result.current.filteredDocuments[0].name).toBe('Another Doc');
    
    // Reset search and filter by type
    act(() => {
      result.current.setSearchTerm('');
      result.current.setTypeFilter('pdf');
    });
    
    expect(result.current.filteredDocuments.length).toBe(1);
    expect(result.current.filteredDocuments[0].type).toBe('pdf');
  });

  test('handleDelete removes document and updates localStorage', () => {
    localStorage.setItem('properties', JSON.stringify([
      { id: '1', documents: [{ id: '1', name: 'Test Doc' }] }
    ]));
    
    const { result } = renderHook(() => useDocumentsState());
    
    act(() => {
      result.current.handleDelete('1', 'Test Doc');
    });
    
    expect(result.current.documents.length).toBe(1); // One less document
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
