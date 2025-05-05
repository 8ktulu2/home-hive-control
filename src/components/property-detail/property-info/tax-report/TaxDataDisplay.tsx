
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, Users, Banknote, MinusCircle, Percent } from 'lucide-react';
import PropertyDataSection from './PropertyDataSection';
import TenantSection from './TenantSection';
import IncomeSection from './IncomeSection';
import ExpensesSection from './ExpensesSection';
import ReductionsSection from './ReductionsSection';

interface TaxDataDisplayProps {
  property: Property;
  netIncome: number;
  reductionPercentage: number;
  activeAccordion: string;
  setActiveAccordion: (value: string) => void;
}

const TaxDataDisplay: React.FC<TaxDataDisplayProps> = ({
  property,
  netIncome,
  reductionPercentage,
  activeAccordion,
  setActiveAccordion
}) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full" 
      defaultValue={activeAccordion}
      onValueChange={setActiveAccordion}
    >
      <AccordionItem value="property">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <h3 className="font-medium text-left">Datos del Inmueble</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <PropertyDataSection property={property} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="tenant">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h3 className="font-medium text-left">Inquilino</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TenantSection property={property} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="income">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            <h3 className="font-medium text-left">Ingresos</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <IncomeSection property={property} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="expenses">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <MinusCircle className="h-5 w-5" />
            <h3 className="font-medium text-left">Gastos Deducibles</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ExpensesSection property={property} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="reductions">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            <h3 className="font-medium text-left">Reducciones</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ReductionsSection 
            property={property} 
            netIncome={netIncome} 
            reductionPercentage={reductionPercentage} 
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TaxDataDisplay;
