
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

export const FiscalAmortizationGuide: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="p-0 h-auto text-muted-foreground hover:bg-transparent">
        <Info className="h-4 w-4 mr-1" /> Guía de amortización
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Guía de Amortización para Inmuebles y Mobiliario</DialogTitle>
            <DialogDescription>
              Información importante para calcular correctamente la amortización fiscal de su propiedad de alquiler
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Amortización del Inmueble (3%)</h3>
              <p>
                Se calcula como el 3% del valor de adquisición de la construcción (excluido el valor del suelo). 
                Importante: solo se amortiza el valor de la construcción, nunca el valor del suelo.
              </p>
              <div className="mt-2 p-2 bg-background rounded">
                <p><strong>Ejemplo:</strong> Inmueble adquirido por 200.000€ donde el valor del suelo es 40.000€ (20%).</p>
                <p>Valor amortizable: 200.000€ - 40.000€ = 160.000€</p>
                <p>Amortización anual: 160.000€ × 3% = 4.800€</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Amortización del Mobiliario (10%)</h3>
              <p>
                Se calula como el 10% del valor de adquisición del mobiliario y enseres 
                (electrodomésticos, muebles, equipamiento, etc).
              </p>
              <div className="mt-2 p-2 bg-background rounded">
                <p><strong>Ejemplo:</strong> Mobiliario valorado en 15.000€.</p>
                <p>Amortización anual: 15.000€ × 10% = 1.500€</p>
              </div>
            </div>
            
            <div className="p-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg">
              <h3 className="font-medium mb-2">Notas importantes:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Conserve las facturas de todos los elementos amortizables como prueba ante una posible inspección fiscal.</li>
                <li>Si el inmueble o los muebles estuvieran parcialmente amortizados antes del alquiler, solo puede amortizar la parte pendiente.</li>
                <li>Los elementos de poco valor (menos de 300€) pueden amortizarse íntegramente en el año de adquisición.</li>
                <li>El valor catastral desglosado se puede obtener en el recibo del IBI o solicitándolo al Catastro.</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
