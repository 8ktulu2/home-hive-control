
import React from 'react';
import { Property } from '@/types/property';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface FiscalAlertsProps {
  properties: Property[];
  selectedYear: number;
}

const FiscalAlerts: React.FC<FiscalAlertsProps> = ({ properties, selectedYear }) => {
  const alerts = [];
  
  // Verificar datos faltantes
  properties.forEach(property => {
    if (!property.ibi && !property.taxInfo?.ibiAnnual) {
      alerts.push({
        type: 'warning',
        title: 'IBI no registrado',
        description: `La propiedad "${property.name}" no tiene registrado el IBI anual, necesario para gastos deducibles.`
      });
    }
    
    if (!property.taxInfo?.acquisitionCost) {
      alerts.push({
        type: 'warning',
        title: 'Coste de adquisición no registrado',
        description: `La propiedad "${property.name}" necesita el coste de adquisición para calcular la amortización (3% anual).`
      });
    }
    
    if (!property.tenants || property.tenants.length === 0) {
      alerts.push({
        type: 'info',
        title: 'Sin datos de inquilino',
        description: `La propiedad "${property.name}" no tiene inquilinos registrados. Verifique si debe aplicar retenciones.`
      });
    }
  });
  
  // Verificar fechas de vencimiento
  const currentDate = new Date();
  const declarationDeadline = new Date(selectedYear + 1, 5, 30); // 30 de junio del año siguiente
  
  if (currentDate > declarationDeadline) {
    alerts.push({
      type: 'error',
      title: 'Plazo de declaración vencido',
      description: `El plazo para declarar el ejercicio ${selectedYear} venció el 30 de junio de ${selectedYear + 1}.`
    });
  } else if (currentDate > new Date(selectedYear + 1, 3, 1)) { // Después del 1 de abril
    alerts.push({
      type: 'warning',
      title: 'Próximo vencimiento',
      description: `Recuerde que el plazo para declarar el ejercicio ${selectedYear} vence el 30 de junio de ${selectedYear + 1}.`
    });
  }
  
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      title: 'Datos completos',
      description: 'Todos los datos fiscales están completos para generar la declaración.'
    });
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'error' && <AlertTriangle className="h-4 w-4" />}
          {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
          {alert.type === 'info' && <Info className="h-4 w-4" />}
          {alert.type === 'success' && <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default FiscalAlerts;
