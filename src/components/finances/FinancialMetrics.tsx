import { Property } from '@/types/property';

export interface FinancialMetricsProps {
  properties: Property[];
  selectedMonth: Date;
  showAllProperties: boolean;
}

const FinancialMetrics = ({ properties, selectedMonth, showAllProperties }: FinancialMetricsProps) => {
  // Calculamos métricas básicas para cada propiedad
  const propertyMetrics = properties.map(property => {
    const annualRent = property.rent * 12;
    const annualExpenses = property.expenses * 12;
    const annualNetIncome = property.netIncome * 12;
    
    // Asumimos un valor de propiedad estimado (esto sería un dato real en la app)
    const estimatedValue = property.rent * 200; // Ejemplo simplificado
    
    // Asumimos una inversión inicial (esto sería un dato real en la app)
    const initialInvestment = estimatedValue * 0.3; // Ejemplo: 30% de entrada
    
    // ROI = Retorno anual / Inversión inicial
    const roi = annualNetIncome / initialInvestment;
    
    // Cap Rate = Ingreso Operativo Neto Anual / Valor de Propiedad
    const capRate = annualNetIncome / estimatedValue;
    
    // Gross Rent Multiplier = Valor de Propiedad / Alquiler Anual Bruto
    const grm = estimatedValue / annualRent;
    
    // Cash on Cash = Flujo de Caja Anual / Inversión en Efectivo
    const cashOnCash = annualNetIncome / initialInvestment;
    
    return {
      id: property.id,
      name: property.name,
      estimatedValue,
      annualRent,
      annualExpenses,
      annualNetIncome,
      roi,
      capRate,
      grm,
      cashOnCash
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Métricas Financieras</CardTitle>
          <CardDescription>
            Análisis detallado del rendimiento de cada propiedad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead className="text-right">Valor Est.</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Cap Rate</TableHead>
                <TableHead className="text-right">GRM</TableHead>
                <TableHead className="text-right">Cash on Cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertyMetrics.map(metric => (
                <TableRow key={metric.id}>
                  <TableCell>
                    <Link to={`/property/${metric.id}`} className="hover:underline">
                      {metric.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(metric.estimatedValue)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(metric.roi)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(metric.capRate)}</TableCell>
                  <TableCell className="text-right">{metric.grm.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(metric.cashOnCash)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué significan estas métricas?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">ROI (Retorno sobre la Inversión)</h4>
              <p className="text-sm text-muted-foreground">
                Mide el beneficio obtenido en relación a la inversión realizada. 
                Un ROI del 10% significa que obtienes 10€ por cada 100€ invertidos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">Cap Rate (Tasa de Capitalización)</h4>
              <p className="text-sm text-muted-foreground">
                Indica el rendimiento de una propiedad respecto a su valor actual de mercado.
                Es útil para comparar propiedades independientemente de su financiación.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">GRM (Multiplicador de la Renta Bruta)</h4>
              <p className="text-sm text-muted-foreground">
                Muestra cuántos años de alquiler se necesitarían para recuperar el valor de la propiedad.
                Un GRM menor es mejor, ya que indica una recuperación más rápida.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">Cash on Cash</h4>
              <p className="text-sm text-muted-foreground">
                Mide el rendimiento anual en efectivo respecto al dinero realmente invertido.
                Es útil cuando se utiliza financiación para comprar propiedades.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interpretación de Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Valores Ideales</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>ROI: Por encima del 7% anual es considerado un buen rendimiento.</li>
                <li>Cap Rate: Entre 5% y 10% es generalmente favorable.</li>
                <li>GRM: Un valor entre 8 y 12 es normalmente considerado aceptable.</li>
                <li>Cash on Cash: Un valor por encima del 8% anual es considerado positivo.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Factores a Considerar</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Ubicación y potencial de revalorización de la zona.</li>
                <li>Estado de la propiedad y posibles gastos futuros en reformas.</li>
                <li>Estabilidad del mercado de alquiler en la zona.</li>
                <li>Costes de financiación y perspectivas de tipos de interés.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialMetrics;
