
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { useDocuments } from '@/contexts/documents';
import React from 'react';

export const DocumentsContainer = () => {
  const { 
    filteredDocuments, 
    handleDownload, 
    handleDelete, 
    fileInputRef, 
    handleFileChange 
  } = useDocuments();

  return (
    <Card className="max-w-full">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Documentos ({filteredDocuments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <DocumentTable 
          documents={filteredDocuments}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
