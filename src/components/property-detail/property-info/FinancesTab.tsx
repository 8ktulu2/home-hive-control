
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import KPIBar from '../finances/KPIBar';
import { ExpenseList } from '../finances/ExpenseList';
import { AddExpenseDialog } from '../finances/AddExpenseDialog';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';

interface FinancesTabProps {
  property: Property;
}

const FinancesTab: React.FC<FinancesTabProps> = ({ property }) => {
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  
  // We need to mock these handlers since we don't have the setProperty function here
  const handleExpenseAdd = (expense: any) => {
    console.log('Adding expense:', expense);
    // This would typically be handled by useExpenseManagement with setProperty
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: any) => {
    console.log('Updating expense:', expenseId, updates);
    // This would typically be handled by useExpenseManagement with setProperty
  };

  // Get values from property
  const rent = property.rent || 0;
  const expenses = property.expenses || 0;
  const netIncome = property.netIncome || (rent - expenses);

  return (
    <div className="space-y-4">
      <KPIBar 
        rent={rent}
        expenses={expenses}
        netIncome={netIncome}
        onExpensesClick={() => setShowAllExpenses(!showAllExpenses)}
      />
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Gastos</h3>
            <AddExpenseDialog onExpenseAdd={handleExpenseAdd} />
          </div>
          
          <ExpenseList 
            property={property} 
            onExpenseUpdate={handleExpenseUpdate} 
            onlyDetails
          />
        </CardContent>
      </Card>
      
      {/* Show mortgage information if available */}
      {property.mortgage && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Hipoteca</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Prestamista</div>
                <p className="text-muted-foreground">{property.mortgage.lender || 'No especificado'}</p>
              </div>
              <div>
                <div className="text-sm font-medium">Cuota Mensual</div>
                <p className="text-muted-foreground">{property.mortgage.monthlyPayment}€</p>
              </div>
              {property.mortgage.interestRate && (
                <div>
                  <div className="text-sm font-medium">Tipo de Interés</div>
                  <p className="text-muted-foreground">{property.mortgage.interestRate}%</p>
                </div>
              )}
              {property.mortgage.remainingAmount && (
                <div>
                  <div className="text-sm font-medium">Capital Pendiente</div>
                  <p className="text-muted-foreground">{property.mortgage.remainingAmount}€</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show insurance information if available */}
      {(property.homeInsurance || property.lifeInsurance) && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Seguros</h3>
            <div className="space-y-4">
              {property.homeInsurance && (
                <div>
                  <div className="text-sm font-medium">Seguro de Hogar</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Compañía:</span> {property.homeInsurance.company}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Coste:</span> {property.homeInsurance.cost}€
                    </p>
                  </div>
                </div>
              )}
              
              {property.lifeInsurance && (
                <div>
                  <div className="text-sm font-medium">Seguro de Vida</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Compañía:</span> {property.lifeInsurance.company}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Coste:</span> {property.lifeInsurance.cost}€
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancesTab;
