
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/types/property';

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

const PropertySelector = ({ properties, selectedProperty, onPropertyChange }: PropertySelectorProps) => {
  return (
    <Select value={selectedProperty} onValueChange={onPropertyChange}>
      <SelectTrigger className="w-[200px] bg-[#292F3F] border-[#8E9196] text-white">
        <SelectValue placeholder="Todas las propiedades" />
      </SelectTrigger>
      <SelectContent className="bg-[#292F3F] border-[#8E9196] text-white">
        <SelectItem value="all">Todas las propiedades</SelectItem>
        {properties.map(property => (
          <SelectItem key={property.id} value={property.id}>
            {property.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PropertySelector;
