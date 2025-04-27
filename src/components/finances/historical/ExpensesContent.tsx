
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { PropertyHistoricalData } from './types';

interface ExpensesContentProps {
  filteredData: PropertyHistoricalData[];
}

const ExpensesContent = ({ filteredData }: ExpensesContentProps) => {
  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <CardTitle className="text-white">Gastos Deducibles</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Desglose detallado de gastos para la declaración
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.flatMap(property => 
            property.months.flatMap((monthData: any, monthIndex: number) => 
              monthData.expenses.map((expense: any, expenseIndex: number) => (
                <Card
                  key={`${property.propertyId}-${monthIndex}-${expenseIndex}`}
                  className="bg-[#292F3F]/50 border border-[#8E9196]/20"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium">{expense.name}</h4>
                        <p className="text-xs text-[#8E9196]">{property.propertyName}</p>
                      </div>
                      <Badge className="bg-[#E5DEFF]/10 text-[#E5DEFF] border border-[#E5DEFF]/20">
                        {monthData.month}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Importe:</span>
                        <span className="text-white font-medium">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Estado:</span>
                        <span className="text-green-500 flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Pagado
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesContent;
