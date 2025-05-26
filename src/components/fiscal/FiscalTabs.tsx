
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertySummaryTab from './tabs/PropertySummaryTab';
import ExpenseBreakdownTab from './tabs/ExpenseBreakdownTab';
import IRPFDeclarationTab from './tabs/IRPFDeclarationTab';

interface FiscalTabsProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const FiscalTabs: React.FC<FiscalTabsProps> = ({
  properties,
  selectedYear,
  fiscalData
}) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto mb-4 p-1">
          <TabsTrigger 
            value="summary" 
            className="text-[10px] sm:text-xs md:text-sm px-1 py-2 leading-tight min-h-[44px] flex items-center justify-center"
          >
            <span className="text-center break-words hyphens-auto">
              Resumen
              <br className="hidden xs:block" />
              <span className="hidden xs:inline">por </span>Propiedad
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="text-[10px] sm:text-xs md:text-sm px-1 py-2 leading-tight min-h-[44px] flex items-center justify-center"
          >
            <span className="text-center break-words hyphens-auto">
              Desglose
              <br className="hidden xs:block" />
              <span className="hidden xs:inline">de </span>Gastos
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="declaration" 
            className="text-[10px] sm:text-xs md:text-sm px-1 py-2 leading-tight min-h-[44px] flex items-center justify-center"
          >
            <span className="text-center break-words hyphens-auto">
              Declaración
              <br className="hidden xs:block" />
              IRPF
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-0">
          <PropertySummaryTab 
            properties={properties}
            selectedYear={selectedYear}
            fiscalData={fiscalData}
          />
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <ExpenseBreakdownTab 
            properties={properties}
            selectedYear={selectedYear}
            fiscalData={fiscalData}
          />
        </TabsContent>

        <TabsContent value="declaration" className="mt-0">
          <IRPFDeclarationTab 
            fiscalData={fiscalData}
            selectedYear={selectedYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FiscalTabs;
