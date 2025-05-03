
import React from 'react';
import { Property } from '@/types/property';
import TaxInfoTooltip from './TaxInfoTooltip';

interface ExpensesSectionProps {
  property: Property;
}

const ExpensesSection: React.FC<ExpensesSectionProps> = ({ property }) => {
  // Calculate mortgage interest
  const getMortgageInterest = () => {
    if (property.taxInfo?.mortgageInterest) {
      return property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.monthlyPayment) {
      // Estimate interest as 80% of total payment
      return property.mortgage.monthlyPayment * 0.8 * 12;
    }
    return 0;
  };

  const getTotalMortgagePayment = () => {
    if (property.taxInfo?.totalMortgagePayment) {
      return property.taxInfo.totalMortgagePayment;
    } else if (property.mortgage?.monthlyPayment) {
      return property.mortgage.monthlyPayment * 12;
    }
    return 0;
  };

  const hasAnyExpense = getMortgageInterest() > 0 || property.ibi || property.communityFee || 
                       (property.homeInsurance?.cost ?? 0) > 0;

  if (!hasAnyExpense) {
    return <p className="text-sm text-muted-foreground">No hay gastos deducibles registrados</p>;
  }

  return (
    <div className="space-y-4 pt-2">
      {(property.mortgage?.monthlyPayment || property.taxInfo?.mortgageInterest || property.taxInfo?.totalMortgagePayment) && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Hipoteca</span>
            <TaxInfoTooltip content="Solo los intereses son deducibles como gasto, no el total de la cuota hipotecaria (Art. 23.1.a, Ley 35/2006)." />
          </div>
          
          <div className="ml-4 space-y-2">
            {property.taxInfo?.totalMortgagePayment ? (
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm">Total cuota hipotecaria (informativo)</span>
                  <p className="text-xs text-muted-foreground">No deducible en su totalidad</p>
                </div>
                <span className="text-sm font-medium">{property.taxInfo.totalMortgagePayment.toLocaleString('es-ES')} €/año</span>
              </div>
            ) : property.mortgage?.monthlyPayment ? (
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm">Total cuota hipotecaria (informativo)</span>
                  <p className="text-xs text-muted-foreground">No deducible en su totalidad</p>
                </div>
                <span className="text-sm font-medium">{(property.mortgage.monthlyPayment * 12).toLocaleString('es-ES')} €/año</span>
              </div>
            ) : null}
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium">Intereses de hipoteca</span>
                <p className="text-xs text-muted-foreground">Gasto deducible</p>
              </div>
              <span className="text-sm font-medium">{getMortgageInterest().toLocaleString('es-ES')} €/año</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Show other expenses */}
      {property.ibi && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">IBI</span>
            <TaxInfoTooltip content="El Impuesto sobre Bienes Inmuebles es un gasto deducible (Art. 23.1.a, Ley 35/2006)." />
          </div>
          <span className="text-sm font-medium">{property.ibi.toLocaleString('es-ES')} €/año</span>
        </div>
      )}
      
      {property.communityFee && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Gastos de comunidad</span>
            <TaxInfoTooltip content="Las cuotas de comunidad son gastos deducibles (Art. 23.1.a, Ley 35/2006)." />
          </div>
          <span className="text-sm font-medium">{property.communityFee.toLocaleString('es-ES')} €/año</span>
        </div>
      )}
      
      {property.homeInsurance?.cost && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Seguro del hogar</span>
            <TaxInfoTooltip content="Las primas de seguros son gastos deducibles (Art. 23.1.a, Ley 35/2006)." />
          </div>
          <span className="text-sm font-medium">{property.homeInsurance.cost.toLocaleString('es-ES')} €/año</span>
        </div>
      )}
      
      {property.monthlyExpenses && property.monthlyExpenses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">Otros gastos</span>
            <TaxInfoTooltip content="Gastos de administración, suministros no repercutidos y otros gastos deducibles." />
          </div>
          {property.monthlyExpenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between pl-4">
              <span className="text-sm">{expense.name}</span>
              <span className="text-sm">{(expense.amount * 12).toLocaleString('es-ES')} €/año</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Add a note about expense limit */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-muted-foreground">
          <strong>Nota:</strong> Los gastos por intereses de hipoteca y reparación/conservación tienen un límite conjunto 
          igual a los ingresos íntegros por inmueble (Art. 23.1.a, Ley 35/2006).
        </p>
      </div>
    </div>
  );
};

export default ExpensesSection;
