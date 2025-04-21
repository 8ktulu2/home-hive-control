
import { Property, MonthlyExpense } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrendingUp, TrendingDown, DollarSign, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { AddExpenseDialog } from './AddExpenseDialog';
import { ExpenseList } from './ExpenseList';

interface PropertyFinancesProps {
  property: Property;
  onExpenseAdd?: (expense: Partial<MonthlyExpense>) => void;
  onExpenseUpdate?: (expenseId: string, updates: Partial<MonthlyExpense>) => void;
}

const PropertyFinances = ({ property, onExpenseAdd, onExpenseUpdate }: PropertyFinancesProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  
  const monthlyRevenue = property.rent;
  const totalExpensesCalculated = property.expenses;
  const netIncome = monthlyRevenue - totalExpensesCalculated;
  
  const handleExportToGoogleSheets = () => {
    toast.success("Exportando datos a Google Sheets...", {
      description: "Esta función estará disponible próximamente"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <span>Finanzas {monthName}</span>
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExportToGoogleSheets}
          >
            <FileDown className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <AddExpenseDialog onExpenseAdd={onExpenseAdd} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <ExpenseList property={property} onExpenseUpdate={onExpenseUpdate} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Ingresos</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold mt-2">{monthlyRevenue}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
              <p className="text-xs text-muted-foreground mt-1">{monthlyRevenue * 12}€ al año</p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Beneficio</h3>
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                {netIncome.toFixed(0)}€<span className="text-xs text-muted-foreground ml-1">/mes</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{(netIncome * 12).toFixed(0)}€ al año</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFinances;
