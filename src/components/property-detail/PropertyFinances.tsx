
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PropertyFinancesProps {
  property: Property;
}

const PropertyFinances = ({ property }: PropertyFinancesProps) => {
  // Calcular valores para las tarjetas financieras
  const monthlyRevenue = property.rent;
  const monthlyExpenses = property.expenses;
  const netIncome = property.netIncome;
  const annualIncome = netIncome * 12;
  const ibi = property.ibi || 0;
  const mortgagePayment = property.mortgage?.monthlyPayment || 0;

  // Calcular los gastos desglosados
  const expenseItems = [
    { name: 'Hipoteca', value: mortgagePayment },
    { name: 'IBI (anual)', value: ibi / 12 }, // Convertir a mensual para mostrar
    { name: 'Comunidad', value: property.expenses - mortgagePayment - (ibi / 12) },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <span>Finanzas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tarjetas de resumen financiero */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Ingresos</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-2">{monthlyRevenue}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
            <p className="text-xs text-muted-foreground mt-1">{monthlyRevenue * 12}€ al año</p>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Gastos</h3>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-2xl font-bold mt-2">-{monthlyExpenses}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
            <p className="text-xs text-muted-foreground mt-1">-{monthlyExpenses * 12}€ al año</p>
          </div>

          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Beneficio</h3>
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
              {netIncome}€<span className="text-xs text-muted-foreground ml-1">/mes</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{annualIncome}€ al año</p>
          </div>
        </div>

        {/* Desglose de gastos */}
        <div>
          <h3 className="text-sm font-medium mb-3">Desglose de gastos</h3>
          <div className="space-y-2">
            {expenseItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium text-destructive">{item.value.toFixed(0)}€/mes</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-medium text-destructive">{monthlyExpenses}€/mes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFinances;
