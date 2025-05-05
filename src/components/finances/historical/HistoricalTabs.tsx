
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface HistoricalTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: React.ReactNode;
}

const HistoricalTabs = ({ activeTab, setActiveTab, children }: HistoricalTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="px-4 bg-[#292F3F]/80">
        {isMobile ? (
          <>
            <TabsList className="grid grid-cols-2 gap-1 w-full mb-1 bg-transparent">
              <TabsTrigger 
                value="summary" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Mensual
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-2 gap-1 w-full mb-2 bg-transparent">
              <TabsTrigger 
                value="expenses" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Gastos
              </TabsTrigger>
              <TabsTrigger 
                value="fiscal" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                IRPF
              </TabsTrigger>
            </TabsList>
          </>
        ) : (
          <TabsList className="grid grid-cols-4 w-full bg-transparent">
            <TabsTrigger 
              value="summary" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Mensual
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Gastos Deducibles
            </TabsTrigger>
            <TabsTrigger 
              value="fiscal" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Datos IRPF
            </TabsTrigger>
          </TabsList>
        )}
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </Tabs>
  );
};

export default HistoricalTabs;
