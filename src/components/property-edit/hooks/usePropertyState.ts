
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

export const usePropertyState = (
  baseProperty: Property | null,
  historicalYear: number | undefined,
  id: string | undefined
) => {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!baseProperty) return;
    
    // Ahora solo maneja propiedades actuales - sin lógica histórica
    setProperty(baseProperty);
  }, [baseProperty]);

  return { property, setProperty };
};
