
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
      // Crear URL para la imagen temporal
      const imageUrl = URL.createObjectURL(file);
      updatePropertyImage(imageUrl);
      toast.success('Imagen subida correctamente');
      
      // Convertir la imagen a base64 para almacenamiento
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

  // Función para procesar y guardar las imágenes de la galería
  const processAdditionalImages = async (imageUrls: string[], propertyId: string) => {
    if (!imageUrls || imageUrls.length === 0 || !propertyId) return;
    
    try {
      const base64Images: string[] = [];
      
      // Convertir cada imagen a base64
      for (const url of imageUrls) {
        if (url.startsWith('blob:')) {
          const response = await fetch(url);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          base64Images.push(base64);
        } else {
          base64Images.push(url);
        }
      }
      
      // Guardar en localStorage
      const savedImages = localStorage.getItem('propertyAdditionalImages') || '{}';
      const images = JSON.parse(savedImages);
      images[propertyId] = base64Images;
      localStorage.setItem('propertyAdditionalImages', JSON.stringify(images));
      
    } catch (error) {
      console.error("Error al procesar imágenes adicionales:", error);
    }
  };

  return {
    handleImageUpload,
    handleImageChange,
    processAdditionalImages
  };
};
