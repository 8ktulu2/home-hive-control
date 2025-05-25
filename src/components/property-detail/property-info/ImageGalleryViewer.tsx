
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import ImageViewer from '../image-viewer/ImageViewer';

interface ImageGalleryViewerProps {
  property: Property;
}

const ImageGalleryViewer = ({ property }: ImageGalleryViewerProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const allImages = [property.image, ...(property.images || [])].filter(Boolean);

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const handleViewAllImages = () => {
    setInitialImageIndex(0);
    setIsImageViewerOpen(true);
  };

  if (allImages.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No hay imágenes disponibles
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Imágenes ({allImages.length})</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAllImages}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver todas
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {allImages.slice(0, 6).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image}
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === 5 && allImages.length > 6 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  +{allImages.length - 6}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={allImages}
        initialIndex={initialImageIndex}
      />
    </div>
  );
};

export default ImageGalleryViewer;
