
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, HelpCircle, Home, Shield, Wrench, Calculator } from 'lucide-react';

interface FiscalExpensesBreakdownProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const FiscalExpensesBreakdown: React.FC<FiscalExpensesBreakdownProps> = ({
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

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const expenseCategories = [
    {
      id: 'property-taxes',
      title: 'Impuestos sobre la Propiedad',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      total: properties.reduce((sum, prop) => {
        const ibi = prop.taxInfo?.ibiAnnual || prop.ibi || 0;
        return sum + ibi;
      }, 0),
      tooltip: 'IBI y otros impuestos locales sobre la propiedad (art. 23.1.a LIRPF)',
      items: properties.map(prop => ({
        name: `${prop.name} - IBI`,
        amount: prop.taxInfo?.ibiAnnual || prop.ibi || 0
      })).filter(item => item.amount > 0)
    },
    {
      id: 'community-fees',
      title: 'Gastos de Comunidad',
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      total: properties.reduce((sum, prop) => {
        const community = prop.taxInfo?.communityFeesAnnual || (prop.communityFee ? prop.communityFee * 12 : 0);
        return sum + community;
      }, 0),
      tooltip: 'Cuotas de comunidad, gastos de conservación y administración del edificio',
      items: properties.map(prop => ({
        name: `${prop.name} - Comunidad`,
        amount: prop.taxInfo?.communityFeesAnnual || (prop.communityFee ? prop.communityFee * 12 : 0)
      })).filter(item => item.amount > 0)
    },
    {
      id: 'insurance',
      title: 'Seguros',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      total: properties.reduce((sum, prop) => {
        const homeInsurance = prop.homeInsurance?.cost || 0;
        const lifeInsurance = prop.lifeInsurance?.cost || 0;
        return sum + homeInsurance + lifeInsurance;
      }, 0),
      tooltip: 'Seguros del hogar, vida y otros seguros relacionados con la propiedad',
      items: properties.flatMap(prop => [
        ...(prop.homeInsurance?.cost ? [{
          name: `${prop.name} - Seguro Hogar`,
          amount: prop.homeInsurance.cost
        }] : []),
        ...(prop.lifeInsurance?.cost ? [{
          name: `${prop.name} - Seguro Vida`,
          amount: prop.lifeInsurance.cost
        }] : [])
      ])
    },
    {
      id: 'maintenance',
      title: 'Reparaciones y Conservación',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      total: properties.reduce((sum, prop) => {
        const conservation = prop.taxInfo?.conservationExpenses || 0;
        const maintenance = prop.monthlyExpenses?.filter(exp => 
          exp.year === selectedYear && exp.isPaid && 
          ['reparaciones', 'mantenimiento', 'conservacion'].includes(exp.category || '')
        ).reduce((subSum, exp) => subSum + exp.amount, 0) || 0;
        return sum + conservation + maintenance;
      }, 0),
      tooltip: 'Gastos de reparación, conservación y mejora de la propiedad',
      items: properties.flatMap(prop => {
        const items = [];
        if (prop.taxInfo?.conservationExpenses) {
          items.push({
            name: `${prop.name} - Conservación`,
            amount: prop.taxInfo.conservationExpenses
          });
        }
        const maintenanceExpenses = prop.monthlyExpenses?.filter(exp => 
          exp.year === selectedYear && exp.isPaid && 
          ['reparaciones', 'mantenimiento', 'conservacion'].includes(exp.category || '')
        ) || [];
        items.push(...maintenanceExpenses.map(exp => ({
          name: `${prop.name} - ${exp.name}`,
          amount: exp.amount
        })));
        return items;
      }).filter(item => item.amount > 0)
    },
    {
      id: 'depreciation',
      title: 'Amortizaciones',
      icon: Calculator,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      total: fiscalData.depreciation,
      tooltip: 'Amortización anual del 3% sobre el valor de construcción (excluyendo suelo)',
      items: properties.map(prop => {
        let depreciation = 0;
        if (prop.taxInfo?.buildingDepreciation) {
          depreciation = prop.taxInfo.buildingDepreciation;
        } else if (prop.taxInfo?.acquisitionCost && prop.taxInfo?.landValue) {
          const constructionValue = prop.taxInfo.acquisitionCost - prop.taxInfo.landValue;
          depreciation = constructionValue * 0.03;
        }
        return {
          name: `${prop.name} - Amortización (3%)`,
          amount: depreciation
        };
      }).filter(item => item.amount > 0)
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {expenseCategories.map((category) => (
          <Card key={category.id} className={`${category.bgColor} ${category.borderColor} border-2`}>
            <Collapsible
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      <div>
                        <CardTitle className="text-sm font-medium text-gray-700">
                          {category.title}
                        </CardTitle>
                        <div className={`text-lg font-bold ${category.color}`}>
                          {formatCurrency(category.total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                              <HelpCircle className="h-3 w-3 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p className="text-xs">{category.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {openCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {category.items.length > 0 ? (
                    <div className="space-y-2">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1 px-2 bg-white/50 rounded text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay gastos registrados en esta categoría</p>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-50 border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            Resumen Total de Gastos Deducibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(fiscalData.deductibleExpenses)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Total de gastos deducibles según el artículo 23 de la Ley del IRPF
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiscalExpensesBreakdown;
