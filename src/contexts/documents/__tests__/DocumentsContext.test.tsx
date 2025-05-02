
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentsProvider, useDocuments } from '../';
import { act } from 'react-dom/test-utils';

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

// Mock document object for download functionality
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Create a test component that uses the useDocuments hook
const TestComponent = () => {
  const {
    documents,
    filteredDocuments,
    searchTerm,
    setSearchTerm,
    propertyFilter,
    setPropertyFilter,
    typeFilter,
    setTypeFilter,
  } = useDocuments();

  return (
    <div>
      <div data-testid="document-count">{documents.length}</div>
      <div data-testid="filtered-count">{filteredDocuments.length}</div>
      <div data-testid="search-term">{searchTerm}</div>
      <div data-testid="property-filter">{propertyFilter}</div>
      <div data-testid="type-filter">{typeFilter}</div>
      <button data-testid="set-search" onClick={() => setSearchTerm('test-search')}>
        Set Search
      </button>
      <button data-testid="set-property" onClick={() => setPropertyFilter('1')}>
        Set Property
      </button>
      <button data-testid="set-type" onClick={() => setTypeFilter('pdf')}>
        Set Type
      </button>
    </div>
  );
};

describe('DocumentsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders DocumentsProvider without crashing', () => {
    render(
      <DocumentsProvider>
        <div>Test</div>
      </DocumentsProvider>
    );
  });

  test('useDocuments hook provides context values', () => {
    // Mock localStorage with properties data
    localStorage.setItem('properties', JSON.stringify([
      {
        id: '1',
        name: 'Test Property',
        documents: [
          { id: '1', name: 'Document 1', type: 'pdf', url: '#', uploadDate: '2023-01-01' }
        ]
      }
    ]));

    render(
      <DocumentsProvider>
        <TestComponent />
      </DocumentsProvider>
    );

    expect(screen.getByTestId('document-count').textContent).toBe('1');
    expect(screen.getByTestId('search-term').textContent).toBe('');
    expect(screen.getByTestId('property-filter').textContent).toBe('all');
    expect(screen.getByTestId('type-filter').textContent).toBe('all');
  });

  test('setSearchTerm updates the search term', () => {
    render(
      <DocumentsProvider>
        <TestComponent />
      </DocumentsProvider>
    );

    fireEvent.click(screen.getByTestId('set-search'));
    expect(screen.getByTestId('search-term').textContent).toBe('test-search');
  });

  test('setPropertyFilter updates the property filter', () => {
    render(
      <DocumentsProvider>
        <TestComponent />
      </DocumentsProvider>
    );

    fireEvent.click(screen.getByTestId('set-property'));
    expect(screen.getByTestId('property-filter').textContent).toBe('1');
  });

  test('setTypeFilter updates the type filter', () => {
    render(
      <DocumentsProvider>
        <TestComponent />
      </DocumentsProvider>
    );

    fireEvent.click(screen.getByTestId('set-type'));
    expect(screen.getByTestId('type-filter').textContent).toBe('pdf');
  });

  test('throws error when useDocuments used outside of provider', () => {
    // Spy on console.error to prevent the expected error from being logged
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDocuments must be used within a DocumentsProvider');

    spy.mockRestore();
  });
});
