
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Property } from '@/types/property';
import SelectionSummary from './summary/SelectionSummary';
import ReportActions from './summary/ReportActions';
import { useFiscalReportGeneration } from '../hooks/useFiscalReportGeneration';

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

  const { handleGenerateReports } = useFiscalReportGeneration({
    properties,
    selectedPropertyIds,
    selectedYears
  });
  
  const totalReports = selectedPropertyIds.length * selectedYears.length;
  const isGeneratingDisabled = selectedPropertyIds.length === 0 || selectedYears.length === 0;
  
  return (
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
            disabled={isGeneratingDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
