
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ExpenseBreakdownTabProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const ExpenseBreakdownTab: React.FC<ExpenseBreakdownTabProps> = ({
  properties,
  selectedYear,
  fiscalData
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const expenseCategories = [
    {
      id: 'ibi',
      name: 'IBI y Tasas Municipales',
      total: properties.reduce((sum, property) => 
        sum + (property.taxInfo?.ibiAnnual || property.ibi || 0), 0),
      items: properties.map(property => ({
        name: property.name,
        amount: property.taxInfo?.ibiAnnual || property.ibi || 0
      })).filter(item => item.amount > 0)
    },
    {
      id: 'community',
      name: 'Gastos de Comunidad',
      total: properties.reduce((sum, property) => 
        sum + (property.taxInfo?.communityFeesAnnual || (property.communityFee || 0) * 12), 0),
      items: properties.map(property => ({
        name: property.name,
        amount: property.taxInfo?.communityFeesAnnual || (property.communityFee || 0) * 12
      })).filter(item => item.amount > 0)
    },
    {
      id: 'insurance',
      name: 'Seguros',
      total: properties.reduce((sum, property) => 
        sum + (property.homeInsurance?.cost || 0) + (property.lifeInsurance?.cost || 0), 0),
      items: properties.map(property => ({
        name: property.name,
        amount: (property.homeInsurance?.cost || 0) + (property.lifeInsurance?.cost || 0)
      })).filter(item => item.amount > 0)
    },
    {
      id: 'mortgage',
      name: 'Gastos Financieros (Hipoteca)',
      total: properties.reduce((sum, property) => 
        sum + (property.taxInfo?.mortgageInterest || property.mortgage?.annualInterest || 0), 0),
      items: properties.map(property => ({
        name: property.name,
        amount: property.taxInfo?.mortgageInterest || property.mortgage?.annualInterest || 0
      })).filter(item => item.amount > 0)
    },
    {
      id: 'depreciation',
      name: 'Amortización (3% anual)',
      total: properties.reduce((sum, property) => 
        sum + (property.taxInfo?.buildingDepreciation || 0), 0),
      items: properties.map(property => ({
        name: property.name,
        amount: property.taxInfo?.buildingDepreciation || 0
      })).filter(item => item.amount > 0)
    },
    {
      id: 'other',
      name: 'Otros Gastos Deducibles',
      total: properties.reduce((sum, property) => {
        const monthlyExpenses = (property.monthlyExpenses || [])
          .filter(expense => expense.year === selectedYear && expense.isPaid)
          .reduce((expSum, expense) => expSum + expense.amount, 0);
        return sum + monthlyExpenses;
      }, 0),
      items: properties.map(property => {
        const monthlyExpenses = (property.monthlyExpenses || [])
          .filter(expense => expense.year === selectedYear && expense.isPaid)
          .reduce((expSum, expense) => expSum + expense.amount, 0);
        return {
          name: property.name,
          amount: monthlyExpenses
        };
      }).filter(item => item.amount > 0)
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {expenseCategories.map((category) => (
          <Card key={category.id} className="w-full">
            <Collapsible 
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors p-4">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {formatCurrency(category.total)}
                      </span>
                      {openCategories.includes(category.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 p-4">
                  {category.items.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="truncate">{item.name}</span>
                          <span className="font-medium">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      No hay gastos registrados en esta categoría
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Total Summary */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total Gastos Deducibles:</span>
            <span className="font-bold text-xl text-red-600">
              {formatCurrency(fiscalData.deductibleExpenses)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseBreakdownTab;
