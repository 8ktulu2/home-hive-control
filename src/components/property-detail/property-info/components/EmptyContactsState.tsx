
import React from 'react';

interface EmptyContactsStateProps {
  message?: string;
}

const EmptyContactsState: React.FC<EmptyContactsStateProps> = ({ 
  message = "No hay información de contactos disponible" 
}) => {
  return (
    <div className="text-center py-6 text-gray-500">
      {message}
    </div>
  );
};

export default EmptyContactsState;
