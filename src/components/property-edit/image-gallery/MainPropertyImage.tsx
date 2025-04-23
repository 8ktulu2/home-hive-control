
import React, { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface MainPropertyImageProps {
  image: string;
  imageInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainPropertyImage = ({ 
  image, 
  imageInputRef, 
  handleImageUpload, 
  handleImageChange 
}: MainPropertyImageProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full h-48 overflow-hidden rounded-lg border">
        <img 
          src={image} 
          alt="Imagen principal" 
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
    </div>
  );
};

export default MainPropertyImage;
