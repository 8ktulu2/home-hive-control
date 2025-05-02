
import React from 'react';
import { DocumentSearchBar } from '@/components/documents/DocumentSearchBar';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
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

  return (
    <div className="flex flex-col gap-3 mb-4 max-w-full">
      <DocumentSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <DocumentFilters
        propertyFilter={propertyFilter}
        typeFilter={typeFilter}
        onPropertyFilterChange={setPropertyFilter}
        onTypeFilterChange={setTypeFilter}
        onUploadClick={handleUploadClick}
        properties={properties}
        uniqueTypes={uniqueTypes}
        isUploading={isUploading}
      />
    </div>
  );
};
