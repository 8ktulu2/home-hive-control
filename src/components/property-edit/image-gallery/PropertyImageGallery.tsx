
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface PropertyImageGalleryProps {
  images: string[];
  onImageAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (index: number) => void;
}

const PropertyImageGallery = ({ images, onImageAdd, onImageDelete }: PropertyImageGalleryProps) => {
  return (
    <div className="mt-4 w-full">
      <ScrollArea className="h-32 w-full rounded-md border">
        <div className="flex gap-2 p-2">
          {images.map((img, index) => (
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
                onClick={() => onImageDelete(index)}
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
        onChange={onImageAdd}
      />
    </div>
  );
};

export default PropertyImageGallery;
