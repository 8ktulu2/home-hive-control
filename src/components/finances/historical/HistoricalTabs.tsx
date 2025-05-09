
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart, Calendar, FileSpreadsheet, Receipt, LineChart, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HistoricalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const HistoricalTabs = ({ activeTab, setActiveTab, children }: HistoricalTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="px-4 pt-4 pb-0 overflow-x-auto">
        {isMobile ? (
          <div className="space-y-2">
            <TabsList className="w-full grid grid-cols-3 bg-[#252A37]">
              <TabsTrigger value="summary" className="text-xs">
                <BarChart className="h-3 w-3 mr-1" /> Resumen
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" /> Mensual
              </TabsTrigger>
              <TabsTrigger value="expenses" className="text-xs">
                <Receipt className="h-3 w-3 mr-1" /> Gastos
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full grid grid-cols-4 bg-[#252A37]">
              <TabsTrigger value="transactions" className="text-xs">
                <FileText className="h-3 w-3 mr-1" /> Transacciones
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                <LineChart className="h-3 w-3 mr-1" /> KPIs
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">
                <Download className="h-3 w-3 mr-1" /> Informes
              </TabsTrigger>
              <TabsTrigger value="fiscal" className="text-xs">
                <FileSpreadsheet className="h-3 w-3 mr-1" /> IRPF
              </TabsTrigger>
            </TabsList>
          </div>
        ) : (
          <TabsList className="w-full bg-[#252A37]">
            <TabsTrigger value="summary">
              <BarChart className="h-4 w-4 mr-2" /> Resumen
            </TabsTrigger>
            <TabsTrigger value="monthly">
              <Calendar className="h-4 w-4 mr-2" /> Mensual
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <Receipt className="h-4 w-4 mr-2" /> Gastos
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <FileText className="h-4 w-4 mr-2" /> Transacciones
            </TabsTrigger>
            <TabsTrigger value="performance">
              <LineChart className="h-4 w-4 mr-2" /> Rendimiento
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Download className="h-4 w-4 mr-2" /> Informes
            </TabsTrigger>
            <TabsTrigger value="fiscal">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> IRPF
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
