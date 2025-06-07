
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

interface YearContextType {
  selectedYear: number;
  isHistoricalMode: boolean;
  setSelectedYear: (year: number) => void;
  resetToCurrentYear: () => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const location = useLocation();
  const params = useParams();

  // Detectar si estamos en una ruta histórica y actualizar el contexto
  useEffect(() => {
    const isHistoricalRoute = location.pathname.includes('/historicos/');
    
    if (isHistoricalRoute && params.year) {
      const urlYear = parseInt(params.year);
      if (!isNaN(urlYear) && urlYear !== selectedYear) {
        setSelectedYear(urlYear);
      }
    } else if (!isHistoricalRoute && selectedYear !== currentYear) {
      // Si salimos de rutas históricas, volver al año actual
      setSelectedYear(currentYear);
    }
  }, [location.pathname, params.year, selectedYear, currentYear]);

  const isHistoricalMode = selectedYear !== currentYear;

  const resetToCurrentYear = () => {
    setSelectedYear(currentYear);
  };

  return (
    <YearContext.Provider value={{
      selectedYear,
      isHistoricalMode,
      setSelectedYear,
      resetToCurrentYear
    }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
};
