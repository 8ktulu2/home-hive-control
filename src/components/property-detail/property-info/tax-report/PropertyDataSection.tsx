
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface PropertyDataSectionProps {
  property: Property;
}

const PropertyDataSection: React.FC<PropertyDataSectionProps> = ({ property }) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Dirección</span>
            <TaxInfoTooltip content="La dirección completa del inmueble debe coincidir con los datos catastrales." />
          </div>
          <p className="text-sm text-muted-foreground">{property.address || "No especificada"}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Referencia Catastral</span>
            <TaxInfoTooltip content="La referencia catastral identifica el inmueble en la declaración (Apartado C, Renta Web)." />
          </div>
          <p className="text-sm text-muted-foreground">
            {property.cadastralReference || "No especificada"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Metros cuadrados</span>
            <TaxInfoTooltip content="El tamaño del inmueble puede afectar al cálculo de ciertas deducciones." />
          </div>
          <p className="text-sm text-muted-foreground">
            {property.squareMeters ? `${property.squareMeters} m²` : "No especificados"}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tipo de inmueble</span>
            <TaxInfoTooltip content="El tipo de inmueble determina qué reducciones fiscales son aplicables." />
          </div>
          <p className="text-sm text-muted-foreground">{property.taxInfo?.propertyType === 'residential' ? 'Vivienda' : property.taxInfo?.propertyType || 'No especificado'}</p>
        </div>
        
        {property.taxInfo?.isTensionedArea !== undefined && (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Zona de mercado residencial tensionado</span>
              <TaxInfoTooltip content="Las viviendas en zonas tensionadas pueden acceder a reducciones fiscales adicionales." />
            </div>
            <p className="text-sm text-muted-foreground">
              {property.taxInfo?.isTensionedArea ? 'Sí' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDataSection;
