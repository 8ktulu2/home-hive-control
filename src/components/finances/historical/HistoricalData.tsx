
import React from 'react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import YearNavigator from './YearNavigator';
import PropertySelector from './PropertySelector';
import AnnualSummaryCards from './AnnualSummaryCards';
import ExpensesContent from './ExpensesContent';
import MonthlyContent from './MonthlyContent';
import { PropertyHistoricalData } from './types';

interface HistoricalDataProps {
  properties: Property[];
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const HistoricalData = ({ properties, selectedYear, onPreviousYear, onNextYear }: HistoricalDataProps) => {
  const [selectedProperty, setSelectedProperty] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState("summary");

  const generateHistoricalData = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const historicalData: PropertyHistoricalData[] = [];
    
    for (const property of properties) {
      const propertyData: PropertyHistoricalData = {
        propertyId: property.id,
        propertyName: property.name,
        months: []
      };
      
      for (const month of months) {
        const rentAmount = property.rent * (0.9 + Math.random() * 0.2);
        const wasRented = Math.random() > 0.2; // 80% probabilidad de estar alquilado
        
        const expenses = [];
        
        if (Math.random() > 0.5) {
          expenses.push({
            id: `exp-${property.id}-${month}-1`,
            name: 'Comunidad',
            amount: Math.round(property.rent * 0.1),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.7) {
          expenses.push({
            id: `exp-${property.id}-${month}-2`,
            name: 'Reparación',
            amount: Math.round(property.rent * 0.15 * (Math.random() + 0.5)),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.8) {
          expenses.push({
            id: `exp-${property.id}-${month}-3`,
            name: 'IBI (proporcional)',
            amount: Math.round(property.rent * 0.08),
            isPaid: true
          });
        }
        
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const netIncome = wasRented ? rentAmount - totalExpenses : -totalExpenses;
        
        propertyData.months.push({
          month,
          wasRented,
          rentAmount: wasRented ? rentAmount : 0,
          expenses,
          totalExpenses,
          netIncome
        });
      }
      
      historicalData.push(propertyData);
    }
    
    return historicalData;
  };

  const historicalData = generateHistoricalData();
  
  const filteredData = selectedProperty === "all" 
    ? historicalData 
    : historicalData.filter(data => data.propertyId === selectedProperty);
  
  const calculateAnnualTotals = () => {
    const allMonthsData = filteredData.flatMap(property => 
      property.months.map(month => ({
        propertyName: property.propertyName,
        ...month
      }))
    );
    
    const totalRent = allMonthsData.reduce((sum, month) => sum + month.rentAmount, 0);
    const totalExpenses = allMonthsData.reduce((sum, month) => sum + month.totalExpenses, 0);
    const totalProfit = totalRent - totalExpenses;
    const rentedMonths = allMonthsData.filter(month => month.wasRented).length;
    const vacantMonths = allMonthsData.length - rentedMonths;
    const occupancyRate = (rentedMonths / allMonthsData.length) * 100;
    
    return {
      totalRent,
      totalExpenses,
      totalProfit,
      rentedMonths,
      vacantMonths,
      occupancyRate
    };
  };
  
  const annualTotals = calculateAnnualTotals();

  return (
    <div className="bg-[#1A1F2C] text-white rounded-lg p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <YearNavigator
          selectedYear={selectedYear}
          onPreviousYear={onPreviousYear}
          onNextYear={onNextYear}
        />
        <PropertySelector
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      </div>
      
      <Badge className="bg-[#8B5CF6] text-white hover:bg-[#7048e8]">
        <FileText className="h-4 w-4 mr-1" /> Datos para Declaración Fiscal
      </Badge>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-6 bg-[#292F3F]">
          <TabsTrigger 
            value="summary" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Resumen Anual
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Detalle Mensual
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
          >
            Gastos Deducibles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <AnnualSummaryCards {...annualTotals} />
        </TabsContent>
        
        <TabsContent value="monthly">
          <MonthlyContent filteredData={filteredData} selectedYear={selectedYear} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesContent filteredData={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoricalData;
