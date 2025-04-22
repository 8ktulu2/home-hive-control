
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Bed, Bath, Ruler } from 'lucide-react';
import { RefObject, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [additionalImages, setAdditionalImages] = useState<string[]>(property.images || []);
  
  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagesArray = filesArray.map(file => URL.createObjectURL(file));
      
      // Actualizar el estado local
      const updatedImages = [...additionalImages, ...newImagesArray];
      setAdditionalImages(updatedImages);
      
      // Actualizar el estado de la propiedad
      setProperty({
        ...property,
        images: updatedImages
      });
    }
  };

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
              <span>Imagen principal</span>
            </Button>
            <input 
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />

            {/* Galería de imágenes adicionales */}
            <div className="mt-4 w-full">
              <Label htmlFor="additional-images">Galería de imágenes</Label>
              <div className="mt-2">
                <ScrollArea className="h-32 w-full rounded-md border">
                  <div className="flex gap-2 p-2">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative h-20 w-20 flex-shrink-0">
                        <img 
                          src={img} 
                          alt={`Imagen ${index + 1}`} 
                          className="h-full w-full object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => {
                            const newImages = additionalImages.filter((_, i) => i !== index);
                            setAdditionalImages(newImages);
                            setProperty({
                              ...property,
                              images: newImages
                            });
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('additional-images-input')?.click()}
                  className="mt-2 w-full flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Añadir fotos</span>
                </Button>
                <input 
                  id="additional-images-input"
                  type="file" 
                  accept="image/*"
                  multiple
                  className="hidden" 
                  onChange={handleMultipleImageUpload}
                />
              </div>
            </div>
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
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
