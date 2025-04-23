
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bed, Bath, Ruler } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyDetailsProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const PropertyDetails = ({ property, setProperty }: PropertyDetailsProps) => {
  return (
    <div className="w-full md:w-2/3 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Propiedad</Label>
        <Input
          id="name"
          value={property.name}
          onChange={(e) => setProperty({ ...property, name: e.target.value })}
          placeholder="Ej: Apartamento Centro"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={property.address}
          onChange={(e) => setProperty({ ...property, address: e.target.value })}
          placeholder="Ej: Calle Principal 123"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cadastralReference">Referencia Catastral</Label>
        <Input
          id="cadastralReference"
          value={property.cadastralReference || ''}
          onChange={(e) =>
            setProperty({ ...property, cadastralReference: e.target.value })
          }
          placeholder="Ej: 9872023VH5797S0001WX"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="squareMeters" className="flex items-center gap-1">
            <Ruler className="h-4 w-4" /> Metros cuadrados
          </Label>
          <Input
            id="squareMeters"
            type="number"
            value={property.squareMeters || ''}
            onChange={(e) =>
              setProperty({ ...property, squareMeters: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="Ej: 80"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> Habitaciones
          </Label>
          <Input
            id="bedrooms"
            type="number"
            value={property.bedrooms || ''}
            onChange={(e) =>
              setProperty({ ...property, bedrooms: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="Ej: 2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> Baños
          </Label>
          <Input
            id="bathrooms"
            type="number"
            value={property.bathrooms || ''}
            onChange={(e) =>
              setProperty({ ...property, bathrooms: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="Ej: 1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="rent">Alquiler Mensual (€)</Label>
          <Input
            id="rent"
            type="number"
            value={property.rent}
            onChange={(e) => {
              const rent = parseInt(e.target.value) || 0;
              const expenses = property.expenses || 0;
              const netIncome = rent - expenses;
              setProperty({ ...property, rent, netIncome });
            }}
            placeholder="0"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
