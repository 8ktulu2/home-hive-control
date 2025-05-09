
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiscalSectionProps } from './types';
import { FiscalAmortizationGuide } from './FiscalAmortizationGuide';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FiscalData } from '../types';

interface ExpenseItemProps extends FiscalSectionProps {
  label: string;
  field: keyof FiscalData;
  description?: string;
  className?: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ form, label, field, description, className }) => {
  return (
    <div className={cn("grid grid-cols-3 gap-4 items-center", className)}>
      <Label htmlFor={String(field)} className="text-right">
        {label}
      </Label>
      <Input
        type="number"
        id={String(field)}
        placeholder="0.00"
        className="col-span-2"
        {...form.register(field as keyof FiscalData, { valueAsNumber: true })}
      />
      {description && (
        <p className="col-span-3 text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export const FiscalExpenseSection: React.FC<FiscalSectionProps> = ({ form }) => {
  const totalExpenses = 
    (form.watch('ibi') || 0) +
    (form.watch('communityFees') || 0) +
    (form.watch('mortgageInterest') || 0) +
    (form.watch('homeInsurance') || 0) +
    (form.watch('lifeInsurance') || 0) +
    (form.watch('maintenance') || 0) +
    (form.watch('agencyFees') || 0) +
    (form.watch('administrativeFees') || 0) +
    (form.watch('contractFormalization') || 0) +
    (form.watch('propertyDepreciation') || 0) +
    (form.watch('buildingDepreciation') || 0) +
    (form.watch('furnitureDepreciation') || 0) +
    (form.watch('utilities') || 0) +
    (form.watch('municipalTaxes') || 0) +
    (form.watch('legalFees') || 0) +
    (form.watch('badDebts') || 0) +
    (form.watch('otherExpenses') || 0);

  // Update totalExpenses and netIncome when any expense changes
  React.useEffect(() => {
    form.setValue('totalExpenses', totalExpenses);
    form.setValue('netIncome', (form.watch('totalIncome') || 0) - totalExpenses);
  }, [totalExpenses, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gastos deducibles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExpenseItem
          form={form}
          label="IBI"
          field="ibi"
          description="Impuesto sobre Bienes Inmuebles"
        />
        <ExpenseItem
          form={form}
          label="Gastos de comunidad"
          field="communityFees"
          description="Cuotas de la comunidad de propietarios"
        />
        <ExpenseItem
          form={form}
          label="Intereses hipotecarios"
          field="mortgageInterest"
          description="Solo los intereses, no el capital amortizado"
        />
        <ExpenseItem
          form={form}
          label="Seguro del hogar"
          field="homeInsurance"
          description="Prima anual del seguro de hogar"
        />
        <ExpenseItem
          form={form}
          label="Seguro de vida"
          field="lifeInsurance"
          description="Si está vinculado a la hipoteca"
        />
        <ExpenseItem
          form={form}
          label="Mantenimiento"
          field="maintenance"
          description="Reparaciones y conservación"
        />
        <ExpenseItem
          form={form}
          label="Honorarios de agencia"
          field="agencyFees"
          description="Gestión del alquiler"
        />
        <ExpenseItem
          form={form}
          label="Gastos administrativos"
          field="administrativeFees"
          description="Gestoría, administración"
        />
        <ExpenseItem
          form={form}
          label="Formalización contrato"
          field="contractFormalization"
          description="Gastos de notaría, registro"
        />
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ExpenseItem
              form={form}
              label="Amort. Inmueble"
              field="buildingDepreciation"
              description="3% valor construcción (sin suelo)"
            />
          </div>
          <div>
            <ExpenseItem
              form={form}
              label="Amort. Mobiliario"
              field="furnitureDepreciation"
              description="10% valor mobiliario"
            />
            <FiscalAmortizationGuide />
          </div>
        </div>
        
        <Separator />
        
        <ExpenseItem
          form={form}
          label="Suministros"
          field="utilities"
          description="Agua, luz, gas (si los paga el propietario)"
        />
        <ExpenseItem
          form={form}
          label="Impuestos municipales"
          field="municipalTaxes"
          description="Tasas de basuras, etc."
        />
        <ExpenseItem
          form={form}
          label="Gastos jurídicos"
          field="legalFees"
          description="Abogado, procurador"
        />
        <ExpenseItem
          form={form}
          label="Saldos impagados"
          field="badDebts"
          description="Alquileres no cobrados"
        />
        <ExpenseItem
          form={form}
          label="Otros gastos"
          field="otherExpenses"
          description="Otros gastos deducibles"
        />
        
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total gastos declarados</p>
            <p className="text-lg font-semibold">
              {(form.watch('totalExpenses') || 0).toFixed(2)}€
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rendimiento neto (antes de reducción)</p>
            <p className="text-lg font-semibold">
              {(form.watch('netIncome') || 0).toFixed(2)}€
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
