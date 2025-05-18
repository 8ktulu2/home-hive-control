
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, HelpCircle } from 'lucide-react';

interface FiscalDetailCardProps {
  selectedYear: number;
  showFiscalInfoModal?: () => void;
}

const FiscalDetailCard = ({ selectedYear, showFiscalInfoModal }: FiscalDetailCardProps) => {
  return (
    <Card className="border-[#8B5CF6]/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#8B5CF6]" />
            <CardTitle className="text-lg">Declaración de la Renta {selectedYear}</CardTitle>
          </div>
          {showFiscalInfoModal && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={showFiscalInfoModal}
              title="Ver información detallada sobre datos fiscales"
            >
              <HelpCircle className="h-5 w-5 text-[#8B5CF6]" />
            </Button>
          )}
        </div>
        <CardDescription>
          Información para la declaración de IRPF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-[#292F3F] p-4 rounded-lg mb-6 text-sm">
          <p className="mb-2 font-medium">Instrucciones:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Los ingresos y gastos deben declararse en el apartado de "Rendimientos del capital inmobiliario" (casillas 0062-0075).</li>
            <li>La reducción por alquiler de vivienda habitual se aplica en la casilla 0150.</li>
            <li>Todos los gastos deben estar justificados con facturas o recibos a nombre del propietario.</li>
            <li>El exceso de gastos sobre ingresos puede compensarse en los 4 años siguientes.</li>
            <li>Conserve toda la documentación durante al menos 4 años.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiscalDetailCard;
