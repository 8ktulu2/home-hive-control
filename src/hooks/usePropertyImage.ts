
import { RefObject } from 'react';
import { Property } from '@/types/property';
import { toast } from 'sonner';

export const usePropertyImage = (
  property: Property | null,
  imageInputRef: RefObject<HTMLInputElement>,
  updatePropertyImage: (imageUrl: string) => void
) => {
  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && property) {
      const imageUrl = URL.createObjectURL(file);
      updatePropertyImage(imageUrl);
      toast.success('Imagen subida correctamente');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (property.id) {
          const savedImages = localStorage.getItem('propertyImages') || '{}';
          const images = JSON.parse(savedImages);
          images[property.id] = base64String;
          localStorage.setItem('propertyImages', JSON.stringify(images));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    handleImageUpload,
    handleImageChange
  };
};
