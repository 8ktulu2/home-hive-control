
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export type YearMode = "current" | "historical";

interface YearModeContextType {
  selectedYear: number;
  mode: YearMode;
  setYearAndMode: (year: number, mode: YearMode) => void;
  isHistoricalMode: boolean;
  resetToCurrentYear: () => void;
}

const YearModeContext = createContext<YearModeContextType | undefined>(undefined);

export const YearModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [mode, setMode] = useState<YearMode>("current");
  const location = useLocation();
  const params = useParams();

  // Detectar automáticamente el modo basado en la ruta
  useEffect(() => {
    const isHistoricalRoute = location.pathname.includes('/historicos/');
    
    if (isHistoricalRoute && params.year) {
      const urlYear = parseInt(params.year);
      if (!isNaN(urlYear)) {
        setYearAndMode(urlYear, "historical");
      }
    } else if (!isHistoricalRoute) {
      setYearAndMode(currentYear, "current");
    }
  }, [location.pathname, params.year, currentYear]);

  const setYearAndMode = (year: number, newMode: YearMode) => {
    setSelectedYear(year);
    setMode(newMode);
  };

  const resetToCurrentYear = () => {
    setYearAndMode(currentYear, "current");
  };

  const isHistoricalMode = mode === "historical";

  return (
    <YearModeContext.Provider value={{
      selectedYear,
      mode,
      setYearAndMode,
      isHistoricalMode,
      resetToCurrentYear
    }}>
      {children}
    </YearModeContext.Provider>
  );
};

export const useYearMode = () => {
  const context = useContext(YearModeContext);
  if (!context) {
    throw new Error("useYearMode debe usarse dentro de YearModeProvider");
  }
  return context;
};
