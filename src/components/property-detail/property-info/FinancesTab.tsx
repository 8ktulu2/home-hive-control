
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseList } from '../finances/expense-components/ExpenseList';
import { AddExpenseDialog } from '../finances/AddExpenseDialog';

interface FinancesTabProps {
  property: Property;
}

const FinancesTab: React.FC<FinancesTabProps> = ({ property }) => {
  // Necesitamos simular estos manejadores ya que no tenemos la función setProperty aquí
  const handleExpenseAdd = (expense: any) => {
    console.log('Añadiendo gasto:', expense);
    // Esto normalmente sería manejado por useExpenseManagement con setProperty
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: any) => {
    console.log('Actualizando gasto:', expenseId, updates);
    // Esto normalmente sería manejado por useExpenseManagement con setProperty
  };

  return (
    <div className="space-y-4">
      {/* Expenses Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Desglose de Gastos</h3>
            <AddExpenseDialog onExpenseAdd={handleExpenseAdd} />
          </div>
          
          <ExpenseList 
            property={property} 
            onExpenseUpdate={handleExpenseUpdate} 
            onlyDetails
          />
        </CardContent>
      </Card>
      
      {/* Display mortgage information only */}
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
      
      {/* Show insurance information */}
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
