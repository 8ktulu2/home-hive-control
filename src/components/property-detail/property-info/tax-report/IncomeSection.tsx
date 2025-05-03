
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface IncomeSectionProps {
  property: Property;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ property }) => {
  const monthlyRent = property.rent || 0;
  const annualRent = monthlyRent * 12; // Assuming full year rental

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Renta mensual</span>
            <TaxInfoTooltip content="Importe mensual recibido por el alquiler del inmueble. Se deben declarar todos los ingresos, incluidos los pagos en especie." />
          </div>
          <p className="text-sm text-muted-foreground">
            {monthlyRent ? `${monthlyRent.toLocaleString('es-ES')} €/mes` : "No especificada"}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Meses alquilados</span>
            <TaxInfoTooltip content="Número de meses durante el año en que el inmueble ha estado alquilado. Para períodos inferiores a 12 meses, los gastos se prorratean proporcionalmente." />
          </div>
          <p className="text-sm text-muted-foreground">12 meses</p>
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Ingresos íntegros anuales</span>
            <TaxInfoTooltip content="Suma total de todas las rentas recibidas durante el año fiscal. Se declaran en el Apartado C de Renta Web (Art. 22, Ley 35/2006)." />
          </div>
          <p className="text-sm text-muted-foreground">
            {annualRent ? `${annualRent.toLocaleString('es-ES')} €` : "0 €"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeSection;
