
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface DocumentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
  selectedDocumentType: string;
  onDocumentTypeChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  properties: Array<{ id: string; name: string }>;
  availableYears: number[];
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedProperty,
  onPropertyChange,
  selectedDocumentType,
  onDocumentTypeChange,
  selectedYear,
  onYearChange,
  properties,
  availableYears
}) => {
  const documentTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'contract', label: 'Contratos' },
    { value: 'invoice', label: 'Facturas' },
    { value: 'certificate', label: 'Certificados' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'legal', label: 'Documentos Legales' },
    { value: 'tax', label: 'Documentos Fiscales' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'other', label: 'Otros' }
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: Search bar (centered) */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Row 2: Property filter (full width) */}
      <div className="w-full">
        <Select value={selectedProperty} onValueChange={onPropertyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por propiedad" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">Todas las propiedades</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Row 3: Document type (left) and Year (right) */}
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedDocumentType} onValueChange={onDocumentTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger>
            <SelectValue placeholder="Año de subida" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">Todos los años</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DocumentFilters;
