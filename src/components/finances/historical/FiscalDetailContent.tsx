
import React, { useState } from 'react';
import { PropertyHistoricalData, FiscalData } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FiscalDetailForm from './FiscalDetailForm';
import { FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FiscalDetailContentProps {
  filteredData: PropertyHistoricalData[];
  selectedYear: number;
}

const FiscalDetailContent = ({ filteredData, selectedYear }: FiscalDetailContentProps) => {
  const isMobile = useIsMobile();
  const [fiscalData, setFiscalData] = useState<Record<string, FiscalData>>(() => {
    // Initialize with default data for each property
    const initialData: Record<string, FiscalData> = {};
    
    filteredData.forEach(property => {
      // Calculate some initial values based on the monthly data
      const totalRent = property.months.reduce((sum, month) => sum + month.rentAmount, 0);
      const totalExpenses = property.months.reduce((sum, month) => sum + month.totalExpenses, 0);
      const netProfit = totalRent - totalExpenses;
      
      // Default reduction is 50%
      const reducedNetProfit = netProfit > 0 ? netProfit * 0.5 : netProfit;
      
      initialData[property.propertyId] = {
        // Ingresos
        rentalIncome: totalRent,
        subsidies: 0,
        otherIncome: 0,
        
        // Gastos deducibles
        ibi: Math.round(totalRent * 0.05), // Estimated IBI
        communityFees: Math.round(totalRent * 0.1), // Estimated community fees
        mortgageInterest: Math.round(totalRent * 0.2), // Estimated mortgage interest
        homeInsurance: Math.round(totalRent * 0.03), // Estimated insurance
        maintenance: Math.round(totalRent * 0.05), // Estimated maintenance
        agencyFees: 0,
        administrativeFees: 0,
        propertyDepreciation: 0,
        buildingDepreciation: Math.round(totalRent * 0.15), // Estimated building depreciation (3%)
        furnitureDepreciation: Math.round(totalRent * 0.05), // Estimated furniture depreciation (10%)
        utilities: 0,
        municipalTaxes: Math.round(totalRent * 0.02), // Estimated municipal taxes
        legalFees: 0,
        badDebts: 0,
        otherExpenses: 0,
        
        // Totales calculados
        totalIncome: totalRent,
        totalExpenses: Math.round(totalRent * 0.6), // Estimated total expenses
        netProfit: Math.round(totalRent * 0.4), // Estimated net profit
        
        // Reducciones
        applicableReduction: 50, // Default 50%
        reducedNetProfit: Math.round(totalRent * 0.4 * 0.5), // Estimated reduced net profit
        
        // Información adicional
        inTensionedArea: false,
        rentLoweredFromPrevious: false,
        youngTenant: false,
        recentlyRenovated: false
      };
    });
    
    return initialData;
  });
  
  const handleSaveFiscalData = (propertyId: string, data: FiscalData) => {
    setFiscalData(prev => ({
      ...prev,
      [propertyId]: data
    }));
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay datos fiscales disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#8B5CF6]/20">
        <CardHeader className={isMobile ? "p-4" : ""}>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#8B5CF6]" />
            <CardTitle className="text-lg">Declaración de la Renta {selectedYear}</CardTitle>
          </div>
          <CardDescription>
            Información para la declaración de IRPF
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-0" : ""}>
          <div className="bg-[#292F3F] p-4 rounded-lg mb-6 text-sm">
            <p className="mb-2 font-medium">Instrucciones:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {isMobile ? (
                <>
                  <li>Ingresos y gastos: casillas 0062-0075</li>
                  <li>Reducción: casilla 0150</li>
                  <li>Conserve toda la documentación 4 años</li>
                </>
              ) : (
                <>
                  <li>Los ingresos y gastos deben declararse en el apartado de "Rendimientos del capital inmobiliario" (casillas 0062-0075).</li>
                  <li>La reducción por alquiler de vivienda habitual se aplica en la casilla 0150.</li>
                  <li>Todos los gastos deben estar justificados con facturas o recibos a nombre del propietario.</li>
                  <li>El exceso de gastos sobre ingresos puede compensarse en los 4 años siguientes.</li>
                  <li>Conserve toda la documentación durante al menos 4 años.</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {filteredData.map(property => (
        <div key={property.propertyId} className="mb-6 last:mb-0">
          <FiscalDetailForm
            initialData={fiscalData[property.propertyId]}
            onSave={(data) => handleSaveFiscalData(property.propertyId, data)}
            propertyName={property.propertyName}
            selectedYear={selectedYear}
          />
        </div>
      ))}
    </div>
  );
};

export default FiscalDetailContent;
