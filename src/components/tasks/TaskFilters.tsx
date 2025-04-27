
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from '@/types/property';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  propertyFilter: string;
  onPropertyFilterChange: (value: string) => void;
  properties: Property[];
  onNewTask: () => void;
}

export const TaskFilters = ({
  searchTerm,
  onSearchChange,
  propertyFilter,
  onPropertyFilterChange,
  properties,
  onNewTask
}: TaskFiltersProps) => {
  const uniqueProperties = Array.from(
    new Set(properties.map(property => property.id))
  ).map(id => {
    const property = properties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={propertyFilter} onValueChange={onPropertyFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] gap-2">
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
        
        <Button className="w-full sm:w-auto flex gap-2" onClick={onNewTask}>
          <Plus className="h-4 w-4" />
          <span>Nueva Tarea</span>
        </Button>
      </div>
    </div>
  );
};
