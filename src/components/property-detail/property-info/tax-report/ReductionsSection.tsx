
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface ReductionsSectionProps {
  property: Property;
  netIncome: number;
  reductionPercentage: number;
}

const ReductionsSection: React.FC<ReductionsSectionProps> = ({ 
  property, 
  netIncome,
  reductionPercentage
}) => {
  const reductionAmount = (netIncome * reductionPercentage) / 100;

  // Get reason for reduction percentage
  const getReductionReason = () => {
    if (property.taxInfo?.isPrimaryResidence) {
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        return "Inquilino joven (18-35) en zona tensionada";
      }
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        return "Reducción de renta ≥5% en zona tensionada";
      }
      if (property.taxInfo?.recentlyRenovated) {
        return "Vivienda con rehabilitación reciente";
      }
      return "Vivienda habitual del inquilino";
    }
    return "No aplica reducción";
  };

  return (
    <div className="space-y-4 pt-2">
      {property.taxInfo?.isPrimaryResidence && (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tipo de uso</span>
            <TaxInfoTooltip content="El tipo de uso del inmueble determina las reducciones fiscales aplicables." />
          </div>
          <p className="text-sm text-muted-foreground">Vivienda habitual del inquilino</p>
        </div>
      )}
      
      {reductionPercentage > 0 && (
        <>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Porcentaje de reducción</span>
              <TaxInfoTooltip content="Para vivienda habitual, se aplica una reducción del 50% (general) hasta 90% según condiciones específicas (Ley 12/2023)." />
            </div>
            <p className="text-sm text-muted-foreground">{reductionPercentage}%</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Motivo de la reducción</span>
              <TaxInfoTooltip content="Justificación de la reducción aplicada según la normativa vigente." />
            </div>
            <p className="text-sm text-muted-foreground">{getReductionReason()}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Importe de la reducción</span>
              <TaxInfoTooltip content="La reducción se aplica sobre el rendimiento neto (ingresos - gastos deducibles)." />
            </div>
            <p className="text-sm text-muted-foreground">{reductionAmount.toLocaleString('es-ES')} €</p>
          </div>
        </>
      )}
      
      <div className="pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Normativa aplicable</span>
          <TaxInfoTooltip content="Base legal que justifica la reducción aplicada." />
        </div>
        <p className="text-sm text-muted-foreground">
          Ley 35/2006 del IRPF, Art. 23.2 y Ley 12/2023 de vivienda
        </p>
      </div>
    </div>
  );
};

export default ReductionsSection;
