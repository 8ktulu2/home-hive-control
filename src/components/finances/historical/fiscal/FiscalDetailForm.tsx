
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { FiscalIncomeSection } from './FiscalIncomeSection';
import { FiscalExpenseSection } from './FiscalExpenseSection';
import { FiscalReductionSection } from './FiscalReductionSection';
import { FiscalSummarySection } from './FiscalSummarySection';
import { FiscalFormProps } from './types';
import { FiscalData } from '../types';

export const FiscalDetailForm: React.FC<FiscalFormProps> = ({
  initialData,
  onSave,
  propertyName,
  selectedYear
}) => {
  // Ensure initialData has a default value for applicableReduction
  const safeInitialData = {
    ...initialData,
    applicableReduction: initialData?.applicableReduction ?? 50, // Default to 50% if not defined
  };

  const form = useForm<FiscalData>({
    defaultValues: safeInitialData
  });

  const [reduction, setReduction] = useState<number>(safeInitialData.applicableReduction);
  
  // Update form values when initialData changes
  useEffect(() => {
    const updatedData = {
      ...initialData,
      applicableReduction: initialData?.applicableReduction ?? 50
    };
    form.reset(updatedData);
    setReduction(updatedData.applicableReduction);
  }, [initialData, form]);

  // Calculate totals based on form values
  useEffect(() => {
    const calculateTotals = () => {
      const values = form.getValues();
      
      // Calculate total income
      const totalIncome = 
        (values.rentalIncome || 0) + 
        (values.subsidies || 0) + 
        (values.otherIncome || 0);
      
      // Calculate total expenses
      const totalExpenses = 
        (values.ibi || 0) +
        (values.communityFees || 0) +
        (values.mortgageInterest || 0) +
        (values.homeInsurance || 0) +
        (values.maintenance || 0) +
        (values.agencyFees || 0) +
        (values.administrativeFees || 0) +
        (values.propertyDepreciation || 0) +
        (values.buildingDepreciation || 0) +
        (values.furnitureDepreciation || 0) +
        (values.utilities || 0) +
        (values.municipalTaxes || 0) +
        (values.legalFees || 0) +
        (values.badDebts || 0) +
        (values.otherExpenses || 0);
      
      // Calculate net profit
      const netProfit = totalIncome - totalExpenses;
      
      // Apply reduction
      const reducedNetProfit = netProfit > 0 
        ? netProfit * (1 - reduction / 100) 
        : netProfit;
      
      // Update form values
      form.setValue('totalIncome', totalIncome);
      form.setValue('totalExpenses', totalExpenses);
      form.setValue('netIncome', netProfit);
      form.setValue('reducedNetProfit', reducedNetProfit);
    };

    calculateTotals();
  }, [form, reduction]);

  const handleSubmit = (data: FiscalData) => {
    onSave(data);
    toast.success("Datos fiscales actualizados correctamente");
  };

  // Check conditions for higher reductions
  const handleReductionChange = (inTensionedArea: boolean, rentLowered: boolean, youngTenant: boolean, recentlyRenovated: boolean) => {
    let newReduction = 50; // Default reduction
    
    if (inTensionedArea && rentLowered) {
      newReduction = 90;
    } else if (inTensionedArea && youngTenant) {
      newReduction = 70;
    } else if (recentlyRenovated) {
      newReduction = 60;
    }
    
    setReduction(newReduction);
    form.setValue('applicableReduction', newReduction);
    form.setValue('inTensionedArea', inTensionedArea);
    form.setValue('rentLoweredFromPrevious', rentLowered);
    form.setValue('youngTenant', youngTenant);
    form.setValue('recentlyRenovated', recentlyRenovated);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Datos IRPF - {propertyName} ({selectedYear})</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FiscalIncomeSection form={form} />
          <FiscalExpenseSection form={form} />
          <FiscalReductionSection 
            form={form} 
            reduction={reduction}
            handleReductionChange={handleReductionChange}
          />
          <FiscalSummarySection form={form} reduction={reduction} />
          
          <div className="flex justify-end">
            <Button type="submit">Guardar datos fiscales</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FiscalDetailForm;
