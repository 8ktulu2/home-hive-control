
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';
import { Link } from 'react-router-dom';

interface PropertyGridProps {
  properties: Property[];
}

const PropertyGrid = ({ properties }: PropertyGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProperties = properties.filter(
    property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button asChild className="w-full sm:w-auto flex gap-2">
          <Link to="/property/new">
            <Plus className="h-4 w-4" />
            <span>Nueva Propiedad</span>
          </Link>
        </Button>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-medium">No se encontraron propiedades</p>
          <p className="text-muted-foreground mt-2">Intente con otra búsqueda o agregue una nueva propiedad</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
