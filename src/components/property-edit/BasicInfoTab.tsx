
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefObject, useState, useEffect } from 'react';
import MainPropertyImage from './image-gallery/MainPropertyImage';
import PropertyImageGallery from './image-gallery/PropertyImageGallery';
import PropertyDetails from './details/PropertyDetails';
import ImageViewer from '../property-detail/image-viewer/ImageViewer';

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
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  
  // Inicializar con las imágenes de la propiedad si existen
  useEffect(() => {
    if (property.images && property.images.length > 0) {
      setAdditionalImages(property.images);
    }
  }, [property.id]); // Solo cuando cambia la propiedad

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagesArray = filesArray.map(file => URL.createObjectURL(file));
      
      const updatedImages = [...additionalImages, ...newImagesArray];
      setAdditionalImages(updatedImages);
      
      setProperty({
        ...property,
        images: updatedImages
      });
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setProperty({
      ...property,
      images: newImages
    });
  };

  const handleMainImageClick = () => {
    if (property.image) {
      const allImages = [property.image, ...additionalImages];
      setViewerImages(allImages);
      setInitialImageIndex(0);
      setIsImageViewerOpen(true);
    }
  };

  const handleGalleryImageClick = (index: number) => {
    const allImages = [property.image, ...additionalImages].filter(Boolean);
    setViewerImages(allImages);
    setInitialImageIndex(property.image ? index + 1 : index);
    setIsImageViewerOpen(true);
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-visible">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/3 flex flex-col items-center gap-2">
            <MainPropertyImage
              image={property.image}
              imageInputRef={imageInputRef}
              handleImageUpload={handleImageUpload}
              handleImageChange={handleImageChange}
              onImageClick={handleMainImageClick}
            />
            <PropertyImageGallery
              images={additionalImages}
              onImageAdd={handleMultipleImageUpload}
              onImageDelete={handleImageDelete}
              onImageClick={handleGalleryImageClick}
            />
          </div>
          
          <PropertyDetails 
            property={property}
            setProperty={setProperty}
          />
        </div>

        <ImageViewer
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          images={viewerImages}
          initialIndex={initialImageIndex}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
