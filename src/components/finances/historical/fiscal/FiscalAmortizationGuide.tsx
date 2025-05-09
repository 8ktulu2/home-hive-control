
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

export const FiscalAmortizationGuide: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button 
        variant="link" 
        size="sm" 
        className="text-xs flex items-center gap-1 mt-1 text-muted-foreground"
        onClick={() => setShowDialog(true)}
      >
        <Info className="h-3.5 w-3.5" />
        <span>Guía de amortización</span>
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Guía de Amortización para Inmuebles en Alquiler</DialogTitle>
            <DialogDescription>
              Cómo calcular correctamente la amortización para la declaración de la renta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Amortización del Inmueble (3%)</h3>
              <p className="text-muted-foreground">
                Se aplica sobre el mayor de estos valores (excluyendo el valor del suelo):
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li>Coste de adquisición satisfecho</li>
                <li>Valor catastral de la construcción</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                <strong>Fórmula:</strong> (Valor de adquisición - Valor del suelo) × 3%
              </p>
              <p className="mt-1 text-muted-foreground">
                <strong>Ejemplo:</strong> Para un inmueble de 200.000€ donde el suelo vale 80.000€:
                <br />
                (200.000€ - 80.000€) × 3% = 3.600€/año
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Amortización de Mobiliario (10%)</h3>
              <p className="text-muted-foreground">
                Se aplica sobre el valor de adquisición del mobiliario y enseres:
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li>Electrodomésticos</li>
                <li>Muebles</li>
                <li>Instalaciones</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                <strong>Fórmula:</strong> Valor de adquisición del mobiliario × 10%
              </p>
              <p className="mt-1 text-muted-foreground">
                <strong>Ejemplo:</strong> Para un mobiliario de 15.000€:
                <br />
                15.000€ × 10% = 1.500€/año
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <p className="text-xs">
                <strong>Nota:</strong> Para la declaración de la renta, es importante conservar las facturas de adquisición tanto del inmueble como del mobiliario. La amortización se aplica de forma proporcional al tiempo que la vivienda ha estado alquilada durante el año fiscal.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
