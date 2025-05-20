
import React from 'react';

interface EmptyTableStateProps {
  message?: string;
}

const EmptyTableState: React.FC<EmptyTableStateProps> = ({ 
  message = "Selecciona propiedades y años para visualizar el informe" 
}) => {
  return (
    <div className="flex items-center justify-center p-6 text-muted-foreground border-2 border-dashed rounded-md">
      {message}
    </div>
  );
};

export default EmptyTableState;
