
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
    </Card>
  );
};

export default FiscalDetailCard;
