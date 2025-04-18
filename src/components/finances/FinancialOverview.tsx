import { Property } from '@/types/property';

export interface FinancialOverviewProps {
  properties: Property[];
  summary: {
    totalRent: number;
    totalExpenses: number;
    netIncome: number;
  };
  selectedMonth: Date;
  showAllProperties: boolean;
}

const FinancialOverview = ({ properties, summary, selectedMonth, showAllProperties }: FinancialOverviewProps) => {
  // Calcular estadísticas adicionales
  const propertiesWithIncome = properties.filter(p => p.netIncome > 0).length;
  const propertiesWithLoss = properties.filter(p => p.netIncome < 0).length;
  const rentPaidCount = properties.filter(p => p.rentPaid).length;
  const paidPercentage = properties.length > 0 
    ? Math.round((rentPaidCount / properties.length) * 100) 
    : 0;
  
  const currentMonth = selectedMonth.toLocaleString('es-ES', { month: 'long' });
  const currentYear = selectedMonth.getFullYear();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos Mensuales</CardDescription>
            <CardTitle className="text-2xl flex justify-between items-center">
              <span>{formatCurrency(summary.totalRent)}</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{formatCurrency(summary.totalRent * 12)} al año</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gastos Mensuales</CardDescription>
            <CardTitle className="text-2xl flex justify-between items-center">
              <span>{formatCurrency(summary.totalExpenses)}</span>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{formatCurrency(summary.totalExpenses * 12)} al año</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Beneficio Mensual</CardDescription>
            <CardTitle className="text-2xl flex justify-between items-center">
              <span>{formatCurrency(summary.netIncome)}</span>
              <DollarSign className="h-5 w-5 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{formatCurrency(summary.netIncome * 12)} al año</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alquileres Pagados ({currentMonth})</CardDescription>
            <CardTitle className="text-2xl flex justify-between items-center">
              <span>{rentPaidCount}/{properties.length}</span>
              <Calendar className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{paidPercentage}% cobrado</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Propiedades</CardTitle>
          <CardDescription>Rendimiento de tu cartera de propiedades en {currentMonth} {currentYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Estado de Propiedades</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Propiedades Totales</span>
                  <span className="font-medium">{properties.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Propiedades con Beneficio</span>
                  <span className="font-medium text-success">{propertiesWithIncome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Propiedades con Pérdida</span>
                  <span className="font-medium text-destructive">{propertiesWithLoss}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alquileres Pagados</span>
                  <span className="font-medium">{rentPaidCount}/{properties.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Rendimiento Mensual</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Ingreso Medio por Propiedad</span>
                  <span className="font-medium">
                    {formatCurrency(properties.length > 0 ? summary.totalRent / properties.length : 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gastos Medios por Propiedad</span>
                  <span className="font-medium">
                    {formatCurrency(properties.length > 0 ? summary.totalExpenses / properties.length : 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Beneficio Medio por Propiedad</span>
                  <span className="font-medium">
                    {formatCurrency(properties.length > 0 ? summary.netIncome / properties.length : 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
