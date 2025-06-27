
import { Filter, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Property } from '@/types/property';

interface DocumentFiltersProps {
  propertyFilter: string;
  typeFilter: string;
  onPropertyFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onUploadClick: () => void;
  properties: Array<{ id: string; name: string }>;
  uniqueTypes: string[];
  isUploading: boolean;
}

export const DocumentFilters = ({
  propertyFilter,
  typeFilter,
  onPropertyFilterChange,
  onTypeFilterChange,
  onUploadClick,
  properties,
  uniqueTypes,
  isUploading
}: DocumentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={propertyFilter} onValueChange={onPropertyFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px] gap-1">
          <Filter className="h-4 w-4" />
          <SelectValue placeholder="Propiedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {properties.map(property => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {uniqueTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex justify-end sm:flex-1">
        <Button 
          onClick={onUploadClick} 
          variant="outline"
          className="flex items-center gap-1"
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? 'Subiendo...' : 'Subir documento'}</span>
        </Button>
      </div>
    </div>
  );
};
