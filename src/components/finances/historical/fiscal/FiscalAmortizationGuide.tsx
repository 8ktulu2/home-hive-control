
import React from 'react';

export const FiscalAmortizationGuide: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <h4 className="font-medium mb-3">Guía de amortizaciones</h4>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium">Amortización del inmueble (3%)</p>
          <p className="text-muted-foreground">Se amortiza solamente el valor de la construcción (nunca el suelo). Se aplica el 3% sobre el mayor de:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
            <li>Valor catastral de la construcción (excluido el suelo)</li>
            <li>Valor de adquisición de la construcción (excluido el suelo)</li>
          </ul>
          <p className="text-muted-foreground mt-1">El valor del suelo puede obtenerse del recibo del IBI, donde figura desglosado, o de la escritura de compra.</p>
        </div>
        
        <div>
          <p className="font-medium">Amortización del mobiliario (10%)</p>
          <p className="text-muted-foreground">Se aplica el 10% sobre el valor de adquisición de:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
            <li>Muebles y enseres (sofás, mesas, sillas, armarios, etc.)</li>
            <li>Electrodomésticos (lavadora, nevera, horno, microondas, etc.)</li>
            <li>Instalaciones no fijas (aires acondicionados portátiles, etc.)</li>
            <li>Otros elementos (cortinas, alfombras, lámparas, etc.)</li>
          </ul>
          <p className="text-muted-foreground mt-1">Es importante conservar las facturas de compra como justificante. Los elementos de valor inferior a 300€ pueden amortizarse íntegramente en el año de adquisición.</p>
        </div>
      </div>
    </div>
  );
};
