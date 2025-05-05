
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface TenantSectionProps {
  property: Property;
}

const TenantSection: React.FC<TenantSectionProps> = ({ property }) => {
  return (
    <>
      {property.tenants && property.tenants.length > 0 ? (
        <div className="space-y-4 pt-2">
          {property.tenants.map((tenant, index) => (
            <div key={tenant.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Nombre completo</span>
                  <TaxInfoTooltip content="El nombre completo del inquilino puede ser necesario para ciertas deducciones fiscales." />
                </div>
                <p className="text-sm text-muted-foreground">{tenant.name || "No especificado"}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Identificación</span>
                  <TaxInfoTooltip content="El DNI/NIE del inquilino puede ser necesario para ciertas deducciones fiscales." />
                </div>
                <p className="text-sm text-muted-foreground">
                  {tenant.identificationNumber || "No especificada"}
                </p>
              </div>
            </div>
          ))}
          
          {/* Show young tenant information if applicable */}
          {property.taxInfo?.hasYoungTenant && property.taxInfo?.isTensionedArea && (
            <div className="mt-2 py-2 px-3 bg-blue-50 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Inquilino joven (18-35 años)</span>
                <TaxInfoTooltip content="Los inquilinos jóvenes en zonas tensionadas permiten acceder a una reducción del 70% sobre el rendimiento neto." />
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Se aplica reducción del 70% según Ley 12/2023
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No hay inquilinos registrados</p>
      )}
    </>
  );
};

export default TenantSection;
