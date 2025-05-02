
import { Property } from '@/types/property';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const usePropertyForm = (property: Property | null, calculateTotalExpenses: () => number) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      // Calculate updated expenses and net income
      const expenses = calculateTotalExpenses();
      const rent = property.rent || 0;
      const netIncome = rent - expenses;
      
      const updatedProperty = {
        ...property,
        expenses,
        netIncome
      };
      
      try {
        // Get existing properties from localStorage
        const savedProperties = localStorage.getItem('properties');
        let properties = [];
        
        if (savedProperties) {
          properties = JSON.parse(savedProperties);
          
          // Check if the property already exists
          const existingPropertyIndex = properties.findIndex((p: Property) => p.id === property.id);
          
          if (existingPropertyIndex !== -1) {
            // If it exists, update it
            properties[existingPropertyIndex] = updatedProperty;
            toast.success('Propiedad actualizada con éxito');
          } else {
            // If it's a new property, add it to the array
            properties.push(updatedProperty);
            toast.success('Propiedad creada con éxito');
          }
        } else {
          // If no properties are saved, create a new array
          properties = [updatedProperty];
          toast.success('Propiedad creada con éxito');
        }
        
        // Save back to localStorage
        localStorage.setItem('properties', JSON.stringify(properties));
        
        // Save main image separately if needed
        if (property.image && !property.image.startsWith('/placeholder')) {
          const savedImages = localStorage.getItem('propertyImages') || '{}';
          const images = JSON.parse(savedImages);
          images[property.id] = property.image;
          localStorage.setItem('propertyImages', JSON.stringify(images));
        }
        
        // Save additional images if they exist
        if (property.images && property.images.length > 0) {
          const savedImagesData = localStorage.getItem('propertyAdditionalImages') || '{}';
          const imagesData = JSON.parse(savedImagesData);
          
          // Guardar las URLs de las imágenes adicionales
          imagesData[property.id] = property.images;
          
          // También guardar las imágenes en base64 si son blob URLs
          const base64Images: string[] = [];
          const promises = property.images.map(async (url) => {
            if (url.startsWith('blob:')) {
              try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                });
              } catch (error) {
                console.error("Error converting blob to base64:", error);
                return url;
              }
            }
            return url;
          });
          
          Promise.all(promises)
            .then(base64ImagesResult => {
              imagesData[property.id] = base64ImagesResult;
              localStorage.setItem('propertyAdditionalImages', JSON.stringify(imagesData));
            })
            .catch(error => {
              console.error("Error processing images:", error);
              // Fallback: save URLs as-is
              localStorage.setItem('propertyAdditionalImages', JSON.stringify(imagesData));
            });
        }
        
        // Navigate back to property detail page
        navigate(`/property/${property.id}`);
      } catch (error) {
        console.error("Error al procesar las propiedades:", error);
        toast.error("Error al guardar la propiedad");
      }
    }
  };

  return { handleSubmit };
};
