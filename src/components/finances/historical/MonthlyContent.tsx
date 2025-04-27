
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';

interface MonthlyContentProps {
  filteredData: any[];
  selectedYear: number;
}

const MonthlyContent = ({ filteredData, selectedYear }: MonthlyContentProps) => {
  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <CardTitle className="text-white">Detalle Mensual {selectedYear}</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Registro mensual de ingresos y gastos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-[#8E9196]/30">
                <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                <TableHead className="text-[#E5DEFF]">Mes</TableHead>
                <TableHead className="text-[#E5DEFF]">Estado</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Ingresos</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Gastos</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Rendimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.flatMap(property => 
                property.months.map((monthData: any, index: number) => (
                  <TableRow 
                    key={`${property.propertyId}-${index}`}
                    className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60"
                  >
                    <TableCell className="text-white">{property.propertyName}</TableCell>
                    <TableCell className="text-white">{monthData.month}</TableCell>
                    <TableCell>
                      {monthData.wasRented ? (
                        <Badge className="bg-green-500/20 text-green-500 border border-green-500">
                          Alquilado
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-500 border border-red-500">
                          Vacío
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(monthData.rentAmount)}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(monthData.totalExpenses)}
                    </TableCell>
                    <TableCell className={`text-right ${
                      monthData.netIncome >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatCurrency(monthData.netIncome)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyContent;
