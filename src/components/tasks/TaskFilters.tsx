
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from '@/types/property';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  propertyFilter: string;
  onPropertyFilterChange: (value: string) => void;
  properties: Property[];
}

export const TaskFilters = ({
  searchTerm,
  onSearchChange,
  propertyFilter,
  onPropertyFilterChange,
  properties,
}: TaskFiltersProps) => {
  const uniqueProperties = Array.from(
    new Set(properties.map(property => property.id))
  ).map(id => {
    const property = properties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select value={propertyFilter} onValueChange={onPropertyFilterChange}>
        <SelectTrigger className="w-[180px] gap-2">
          <Filter className="h-4 w-4" />
          <SelectValue placeholder="Filtrar por propiedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las propiedades</SelectItem>
          {uniqueProperties.map(property => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
