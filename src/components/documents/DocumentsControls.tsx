
import React from 'react';
import { DocumentSearchBar } from '@/components/documents/DocumentSearchBar';
import DocumentFilters from '@/components/documents/DocumentFilters';
import { useDocuments } from '@/contexts/documents';

export const DocumentsControls = () => {
  const {
    searchTerm,
    propertyFilter,
    typeFilter,
    setSearchTerm,
    setPropertyFilter,
    setTypeFilter,
    handleUploadClick,
    properties,
    uniqueTypes,
    isUploading
  } = useDocuments();

  // Generate available years from current documents (mock data for now)
  const availableYears = [2025, 2024, 2023, 2022, 2021];

  return (
    <div className="flex flex-col gap-3 mb-4 max-w-full">
      <DocumentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedProperty={propertyFilter}
        onPropertyChange={setPropertyFilter}
        selectedDocumentType={typeFilter}
        onDocumentTypeChange={setTypeFilter}
        selectedYear="all"
        onYearChange={() => {}} // TODO: Implement year filter logic
        properties={properties}
        availableYears={availableYears}
        onUploadClick={handleUploadClick}
      />
    </div>
  );
};
