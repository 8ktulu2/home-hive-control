
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FiscalDetailCardProps {
  selectedYear: number;
  children?: React.ReactNode;
}

const FiscalDetailCard = ({ selectedYear, children }: FiscalDetailCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="border-[#8B5CF6]/20">
      <CardHeader className={isMobile ? "p-4" : ""}>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#8B5CF6]" />
          <CardTitle className="text-lg">Declaración de la Renta {selectedYear}</CardTitle>
        </div>
        <CardDescription>
          Información para la declaración de IRPF
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "p-4 pt-0" : ""}>
        <div className="bg-[#292F3F] p-4 rounded-lg mb-6 text-sm">
          <p className="mb-2 font-medium">Instrucciones:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {isMobile ? (
              <>
                <li>Ingresos y gastos: casillas 0062-0075</li>
                <li>Reducción: casilla 0150</li>
                <li>Conserve toda la documentación 4 años</li>
              </>
            ) : (
              <>
                <li>Los ingresos y gastos deben declararse en el apartado de "Rendimientos del capital inmobiliario" (casillas 0062-0075).</li>
                <li>La reducción por alquiler de vivienda habitual se aplica en la casilla 0150.</li>
                <li>Todos los gastos deben estar justificados con facturas o recibos a nombre del propietario.</li>
                <li>El exceso de gastos sobre ingresos puede compensarse en los 4 años siguientes.</li>
                <li>Conserve toda la documentación durante al menos 4 años.</li>
              </>
            )}
          </ul>
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

export default FiscalDetailCard;
