
import React, { useState, useEffect } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Calculator, HelpCircle } from 'lucide-react';
import FiscalAlerts from '@/components/fiscal/FiscalAlerts';
import FiscalHelpDialog from '@/components/fiscal/FiscalHelpDialog';
import FiscalExportButtons from '@/components/fiscal/FiscalExportButtons';
import FiscalTabs from '@/components/fiscal/FiscalTabs';
import { useFiscalCalculations } from '@/hooks/useFiscalCalculations';
import FiscalHeader from '@/components/fiscal/FiscalHeader';

const FiscalReport = () => {
  // Usamos el hook para cargar las propiedades
  const { properties, loading } = usePropertyLoader();
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  // Generamos los años disponibles (últimos 5 años)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    setAvailableYears(years);
  }, []);

  // Calculamos los datos fiscales usando nuestro hook actualizado
  const fiscalData = useFiscalCalculations(properties, selectedYear, selectedPropertyId);

  return (
    <Layout>
      <div className="flex flex-col gap-4 overflow-x-hidden min-h-screen pb-32">
        {/* Header con filtros */}
        <FiscalHeader
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          setSelectedPropertyId={setSelectedPropertyId}
          onShowHelp={() => setShowHelpDialog(true)}
        />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 mt-16">
          {/* Alertas */}
          <FiscalAlerts 
            properties={properties} 
            selectedYear={selectedYear} 
          />

          {/* Contenido principal - Pestañas */}
          <div className="flex-1 mt-4">
            <FiscalTabs 
              properties={properties}
              selectedYear={selectedYear}
              fiscalData={fiscalData}
            />
          </div>

          {/* Botones de exportación fijos en la parte inferior */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
            <div className="max-w-7xl mx-auto">
              <FiscalExportButtons 
                properties={properties}
                selectedYear={selectedYear}
                fiscalData={fiscalData}
                selectedPropertyId={selectedPropertyId}
              />
            </div>
          </div>
        </div>

        {/* Diálogo de ayuda */}
        <FiscalHelpDialog 
          open={showHelpDialog}
          onOpenChange={setShowHelpDialog}
        />
      </div>
    </Layout>
  );
};

export default FiscalReport;
