
import { Document } from '@/types/property';
import React from 'react';

export interface DocumentsContextType {
  documents: Document[];
  searchTerm: string;
  propertyFilter: string;
  typeFilter: string;
  filteredDocuments: Document[];
  isUploading: boolean;
  properties: Array<{ id: string; name: string }>;
  uniqueTypes: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  setSearchTerm: (term: string) => void;
  setPropertyFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;
  handleDownload: (documentName: string) => void;
  handleDelete: (documentId: string, documentName: string) => void;
  handleUploadClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
