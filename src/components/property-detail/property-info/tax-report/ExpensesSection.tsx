
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface ExpensesSectionProps {
  property: Property;
}

const ExpensesSection: React.FC<ExpensesSectionProps> = ({ property }) => {
  // Calculate mortgage interest (for demonstration, estimated as 80% of payment)
  const calculateMortgageInterest = () => {
    if (property.mortgage?.monthlyPayment) {
      const monthlyInterest = property.mortgage.monthlyPayment * 0.8; // 80% as interest (example)
      return monthlyInterest * 12; // Annual interest
    }
    return 0;
  };

  const mortgageInterest = calculateMortgageInterest();
  const ibi = property.ibi || 0;
  const communityFee = property.communityFee || 0;
  const homeInsurance = property.homeInsurance?.cost || 0;
  
  // Calculate amortization (3% of purchase value, example)
  const amortization = 0; // This would need property purchase value
  
  // Sum all expenses
  const totalExpenses = mortgageInterest + ibi + communityFee + homeInsurance + amortization;

  return (
    <div className="space-y-4 pt-2">
      {mortgageInterest > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Intereses de hipoteca</span>
            <TaxInfoTooltip content="Los intereses de préstamos para la adquisición o mejora del inmueble son deducibles. Se declaran en el Apartado C de Renta Web (Art. 23, Ley 35/2006)." />
          </div>
          <p className="text-sm">{mortgageInterest.toLocaleString('es-ES')} €</p>
        </div>
      )}
      
      {ibi > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">IBI (Impuesto sobre Bienes Inmuebles)</span>
            <TaxInfoTooltip content="El Impuesto sobre Bienes Inmuebles (IBI) es completamente deducible en el año en que se paga." />
          </div>
          <p className="text-sm">{ibi.toLocaleString('es-ES')} €</p>
        </div>
      )}
      
      {communityFee > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Gastos de comunidad</span>
            <TaxInfoTooltip content="Las cuotas de comunidad pagadas por el propietario son deducibles, incluidas derramas para reparaciones." />
          </div>
          <p className="text-sm">{communityFee.toLocaleString('es-ES')} €</p>
        </div>
      )}
      
      {homeInsurance > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Seguro del hogar</span>
            <TaxInfoTooltip content="Las primas de seguros de responsabilidad civil, incendio, robo, etc., son deducibles en su totalidad." />
          </div>
          <p className="text-sm">{homeInsurance.toLocaleString('es-ES')} €</p>
        </div>
      )}
      
      {amortization > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Amortización del inmueble</span>
            <TaxInfoTooltip content="Se puede deducir un 3% anual del mayor valor entre: coste de adquisición o valor catastral (excluyendo el valor del suelo)." />
          </div>
          <p className="text-sm">{amortization.toLocaleString('es-ES')} €</p>
        </div>
      )}
      
      <div className="border-t pt-2 mt-4">
        <div className="flex justify-between items-center font-medium">
          <div className="flex items-center gap-2">
            <span className="text-sm">Total gastos deducibles</span>
            <TaxInfoTooltip content="Los gastos deducibles reducen directamente los ingresos íntegros para calcular el rendimiento neto del alquiler." />
          </div>
          <p className="text-sm">{totalExpenses.toLocaleString('es-ES')} €</p>
        </div>
      </div>
    </div>
  );
};

export default ExpensesSection;
