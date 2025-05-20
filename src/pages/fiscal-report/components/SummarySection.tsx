
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Property } from '@/types/property';
import SelectionSummary from './summary/SelectionSummary';
import ReportActions from './summary/ReportActions';
import { useFiscalReportGeneration } from '../hooks/useFiscalReportGeneration';
import PrintableReport from './print/PrintableReport';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
import { generateHistoricalData } from './utils/fiscalReportUtils';

interface SummarySectionProps {
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const SummarySection = ({
  properties,
  selectedPropertyIds,
  selectedYears,
  isGenerating,
  setIsGenerating
}: SummarySectionProps) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  // Generate historical data for selected properties and years
  const historicalData = selectedPropertyIds.flatMap(propId => {
    const property = properties.find(p => p.id === propId);
    if (!property) return [];
    
    return selectedYears.map(year => generateHistoricalData(propId, property, year));
  });
  
  // Get fiscal data using the existing hook
  const { fiscalData } = useFiscalData(historicalData, selectedYears[0] || new Date().getFullYear());

  const { handleGenerateReports } = useFiscalReportGeneration({
    properties,
    selectedPropertyIds,
    selectedYears
  });
  
  const totalReports = selectedPropertyIds.length * selectedYears.length;
  const isGeneratingDisabled = selectedPropertyIds.length === 0 || selectedYears.length === 0;
  
  const handlePrintPreview = () => {
    setShowPrintPreview(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Selección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SelectionSummary 
              properties={properties}
              selectedPropertyIds={selectedPropertyIds}
              selectedYears={selectedYears}
            />
            
            <ReportActions 
              totalReports={totalReports}
              isGenerating={isGenerating}
              onGenerate={handleGenerateReports}
              onPrint={handlePrintPreview}
              disabled={isGeneratingDisabled}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Print Preview Modal */}
      {showPrintPreview && (
        <PrintableReport
          fiscalData={fiscalData}
          properties={properties}
          selectedPropertyIds={selectedPropertyIds}
          selectedYears={selectedYears}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </>
  );
};

export default SummarySection;
