
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertTriangle } from 'lucide-react';

interface HistoricalPropertyAlertsProps {
  yearNumber: number;
  isHistoricalYear: boolean;
}

const HistoricalPropertyAlerts: React.FC<HistoricalPropertyAlertsProps> = ({ 
  yearNumber, 
  isHistoricalYear 
}) => {
  return (
    <div className="space-y-3">
      <Alert className={isHistoricalYear ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}>
        <Calendar className={`h-4 w-4 ${isHistoricalYear ? "text-yellow-600" : "text-blue-600"}`} />
        <AlertDescription className={`${isHistoricalYear ? "text-yellow-800" : "text-blue-800"} text-sm`}>
          <strong>
            {isHistoricalYear ? `Modo Histórico - Año ${yearNumber}` : `Año Actual - ${yearNumber}`}
          </strong> - 
          Todos los datos mostrados y modificaciones corresponden exclusivamente al año {yearNumber}.
          {isHistoricalYear && " Los cambios NO afectarán el año actual ni otros años históricos."}
        </AlertDescription>
      </Alert>

      {isHistoricalYear && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-sm">
            <strong>Importante:</strong> Estás viendo y editando datos históricos del año {yearNumber}. 
            Estos cambios están completamente aislados y no afectarán otros años.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default HistoricalPropertyAlerts;
