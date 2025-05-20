
import React from 'react';

interface PrintHeaderProps {
  propertiesCount: number;
  yearsCount: number;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ propertiesCount, yearsCount }) => {
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold mb-1">INFORME FISCAL PARA IRPF</h1>
      <p className="text-lg text-gray-600 mb-2">
        Resumen de {propertiesCount} {propertiesCount === 1 ? 'propiedad' : 'propiedades'} • 
        {yearsCount} {yearsCount === 1 ? 'año fiscal' : 'años fiscales'}
      </p>
      <p className="text-sm text-gray-500">Generado el {today}</p>
      
      <div className="border-t border-b border-gray-300 my-4 py-4 text-sm text-gray-600">
        <p>Este informe muestra un resumen de los datos fiscales relevantes para la declaración de la renta.</p>
        <p>Los importes y reducciones se calculan según la normativa fiscal vigente para arrendamientos de inmuebles.</p>
      </div>
    </div>
  );
};

export default PrintHeader;
