
import React from 'react';

const PrintFooter: React.FC = () => {
  return (
    <div className="mt-10 pt-4 border-t text-xs text-gray-500 text-center">
      <p>Documento generado para uso informativo.</p>
      <p>Los datos contenidos en este informe deben ser verificados con su asesor fiscal.</p>
      <div className="mt-4 text-left text-xs">
        <h4 className="font-semibold mb-1">Explicación de los conceptos:</h4>
        <ul className="space-y-1">
          <li><strong>Ingresos íntegros:</strong> Total de rentas percibidas por el alquiler durante el año fiscal.</li>
          <li><strong>Gastos deducibles:</strong> Importes que la normativa fiscal permite restar de los ingresos (IBI, comunidad, etc.).</li>
          <li><strong>Rendimiento neto:</strong> Diferencia entre ingresos y gastos antes de aplicar reducciones.</li>
          <li><strong>Reducción aplicable:</strong> Porcentaje de reducción legal que se aplica al rendimiento neto.</li>
          <li><strong>Base imponible:</strong> Cantidad final que se integra en la declaración tras aplicar la reducción.</li>
        </ul>
      </div>
      <p className="mt-2">© {new Date().getFullYear()} PropHive - Gestión Integral de Propiedades</p>
    </div>
  );
};

export default PrintFooter;
