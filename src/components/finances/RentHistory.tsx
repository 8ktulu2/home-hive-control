
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RentHistoryProps {
  properties: Property[];
}

const RentHistory = ({ properties }: RentHistoryProps) => {
  // Generamos un historial de pagos ficticio para demostración
  // En una app real, esto vendría de la base de datos
  const generateDummyHistory = () => {
    const history = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    for (const property of properties) {
      // Generamos registros para los últimos 6 meses
      for (let i = 0; i < 6; i++) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        
        // Alternamos pagados/no pagados para tener variedad
        const isPaid = month % 2 === 0 || month === currentMonth;
        
        history.push({
          id: `${property.id}-${year}-${month}`,
          propertyId: property.id,
          propertyName: property.name,
          month,
          year,
          date: new Date(year, month, 15).toISOString().split('T')[0],
          amount: property.rent,
          isPaid,
          notes: isPaid ? 'Pagado a tiempo' : 'Pendiente de pago'
        });
      }
    }
    
    // Ordenamos por fecha más reciente primero
    return history.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };
  
  const rentHistory = generateDummyHistory();
  
  // Función para obtener el nombre del mes
  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString('es-ES', { month: 'long' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos de Alquiler</CardTitle>
          <CardDescription>
            Registro histórico de pagos de alquiler de todas las propiedades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentHistory.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {getMonthName(payment.month)} {payment.year}
                  </TableCell>
                  <TableCell>
                    <Link to={`/property/${payment.propertyId}`} className="hover:underline">
                      {payment.propertyName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {payment.isPaid ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive mr-2" />
                      )}
                      <span>{payment.isPaid ? 'Pagado' : 'Pendiente'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total de pagos registrados</span>
                <span className="font-medium">{rentHistory.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pagos completados</span>
                <span className="font-medium text-success">
                  {rentHistory.filter(p => p.isPaid).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pagos pendientes</span>
                <span className="font-medium text-destructive">
                  {rentHistory.filter(p => !p.isPaid).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tasa de cobro</span>
                <span className="font-medium">
                  {Math.round((rentHistory.filter(p => p.isPaid).length / rentHistory.length) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximos Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map(property => {
                const nextMonth = new Date().getMonth() + 1;
                const nextMonthName = getMonthName((nextMonth) % 12);
                const nextYear = nextMonth > 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();
                
                return (
                  <div key={property.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {nextMonthName} {nextYear}
                      </div>
                    </div>
                    <div className="font-medium">{formatCurrency(property.rent)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentHistory;
