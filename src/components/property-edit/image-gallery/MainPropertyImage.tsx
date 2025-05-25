
import React, { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface MainPropertyImageProps {
  image: string;
  imageInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick?: () => void;
}

const MainPropertyImage = ({ 
  image, 
  imageInputRef, 
  handleImageUpload, 
  handleImageChange,
  onImageClick 
}: MainPropertyImageProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        {image ? (
          <img 
            src={image} 
            alt="Imagen principal de la propiedad" 
            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onImageClick}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm text-center">Sin imagen</span>
          </div>
        )}
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleImageUpload}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        <span>Subir imagen principal</span>
      </Button>
      
      <input 
        ref={imageInputRef}
        type="file" 
        accept="image/*"
        className="hidden" 
        onChange={handleImageChange}
      />
    </div>
  );
};

export default MainPropertyImage;
