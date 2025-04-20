
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { RefObject } from 'react';

interface BasicInfoTabProps {
  property: Property;
  imageInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setProperty: (property: Property) => void;
}

const BasicInfoTab = ({ 
  property, 
  imageInputRef, 
  handleImageUpload, 
  handleImageChange,
  setProperty 
}: BasicInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
            <div className="relative w-full h-48 overflow-hidden rounded-lg border">
              <img 
                src={property.image} 
                alt={property.name || "Imagen de propiedad"} 
                className="w-full h-full object-cover"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleImageUpload}
              className="w-full flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Cambiar imagen</span>
            </Button>
            <input 
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
          
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
                const rent = parseInt(e.target.value);
                const expenses = property.expenses || 0;
                const netIncome = rent - expenses;
                setProperty({ ...property, rent, netIncome });
              }}
              placeholder="0"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
