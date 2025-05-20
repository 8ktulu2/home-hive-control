
import React from 'react';

const PrintFooter: React.FC = () => {
  return (
    <div className="mt-10 pt-4 border-t text-xs text-gray-500 text-center">
      <p>Documento generado para uso informativo.</p>
      <p>Los datos contenidos en este informe deben ser verificados con su asesor fiscal.</p>
      <p className="mt-2">© {new Date().getFullYear()} PropHive - Gestión Integral de Propiedades</p>
    </div>
  );
};

export default PrintFooter;
