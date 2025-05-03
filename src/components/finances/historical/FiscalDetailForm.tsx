
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FiscalData } from './types';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface FiscalDetailFormProps {
  initialData: FiscalData;
  onSave: (data: FiscalData) => void;
  propertyName: string;
  selectedYear: number;
}

const FiscalDetailForm = ({
  initialData,
  onSave,
  propertyName,
  selectedYear
}: FiscalDetailFormProps) => {
  const form = useForm<FiscalData>({
    defaultValues: initialData
  });

  const [reduction, setReduction] = useState<number>(initialData.applicableReduction);
  
  // Update form values when initialData changes
  useEffect(() => {
    form.reset(initialData);
    setReduction(initialData.applicableReduction);
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
      form.setValue('netProfit', netProfit);
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ingresos del alquiler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rentalIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingresos por alquiler</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subsidies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subvenciones</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otros ingresos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Indemnizaciones, pagos extraordinarios de inquilinos, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gastos deducibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ibi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBI</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Impuesto sobre Bienes Inmuebles
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="communityFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos de comunidad</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mortgageInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intereses hipoteca</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Solo la parte de intereses, no el capital amortizado
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeInsurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seguros</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Seguro del hogar, impago de alquiler, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mantenimiento y reparaciones</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Excluye mejoras o ampliaciones
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agencyFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Honorarios de agencia</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="administrativeFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos administrativos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Notaría, gestoría, certificados
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buildingDepreciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amortización inmueble (3%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        3% del valor de adquisición (sin suelo) o catastral de la construcción. 
                        Solo se amortiza la construcción, nunca el suelo.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="furnitureDepreciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amortización mobiliario (10%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        10% del coste de muebles, electrodomésticos y enseres. 
                        Se amortiza por completo durante 10 años.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suministros</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Agua, luz, gas (si los paga el propietario)
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="municipalTaxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tasas municipales</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Basuras, limpieza, alumbrado
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="legalFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos legales</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Abogados, juicios por impagos
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="badDebts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldos de dudoso cobro</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otros gastos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Certificación energética, jardinería, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <h4 className="font-medium mb-3">Guía de amortizaciones</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Amortización del inmueble (3%)</p>
                    <p className="text-muted-foreground">Se amortiza solamente el valor de la construcción (nunca el suelo). Se aplica el 3% sobre el mayor de:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                      <li>Valor catastral de la construcción (excluido el suelo)</li>
                      <li>Valor de adquisición de la construcción (excluido el suelo)</li>
                    </ul>
                    <p className="text-muted-foreground mt-1">El valor del suelo puede obtenerse del recibo del IBI, donde figura desglosado, o de la escritura de compra.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Amortización del mobiliario (10%)</p>
                    <p className="text-muted-foreground">Se aplica el 10% sobre el valor de adquisición de:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                      <li>Muebles y enseres (sofás, mesas, sillas, armarios, etc.)</li>
                      <li>Electrodomésticos (lavadora, nevera, horno, microondas, etc.)</li>
                      <li>Instalaciones no fijas (aires acondicionados portátiles, etc.)</li>
                      <li>Otros elementos (cortinas, alfombras, lámparas, etc.)</li>
                    </ul>
                    <p className="text-muted-foreground mt-1">Es importante conservar las facturas de compra como justificante. Los elementos de valor inferior a 300€ pueden amortizarse íntegramente en el año de adquisición.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reducciones aplicables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inTensionedArea"
                      checked={form.watch('inTensionedArea')}
                      onCheckedChange={(checked) => {
                        const isChecked = Boolean(checked);
                        handleReductionChange(
                          isChecked,
                          form.watch('rentLoweredFromPrevious'),
                          form.watch('youngTenant'),
                          form.watch('recentlyRenovated')
                        );
                      }}
                    />
                    <label htmlFor="inTensionedArea" className="text-sm font-medium">
                      Zona de mercado tensionado
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rentLowered"
                      checked={form.watch('rentLoweredFromPrevious')}
                      onCheckedChange={(checked) => {
                        const isChecked = Boolean(checked);
                        handleReductionChange(
                          form.watch('inTensionedArea'),
                          isChecked,
                          form.watch('youngTenant'),
                          form.watch('recentlyRenovated')
                        );
                      }}
                    />
                    <label htmlFor="rentLowered" className="text-sm font-medium">
                      Rebaja de renta 5% respecto al contrato anterior
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="youngTenant"
                      checked={form.watch('youngTenant')}
                      onCheckedChange={(checked) => {
                        const isChecked = Boolean(checked);
                        handleReductionChange(
                          form.watch('inTensionedArea'),
                          form.watch('rentLoweredFromPrevious'),
                          isChecked,
                          form.watch('recentlyRenovated')
                        );
                      }}
                    />
                    <label htmlFor="youngTenant" className="text-sm font-medium">
                      Inquilino joven (18-35 años)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recentlyRenovated"
                      checked={form.watch('recentlyRenovated')}
                      onCheckedChange={(checked) => {
                        const isChecked = Boolean(checked);
                        handleReductionChange(
                          form.watch('inTensionedArea'),
                          form.watch('rentLoweredFromPrevious'),
                          form.watch('youngTenant'),
                          isChecked
                        );
                      }}
                    />
                    <label htmlFor="recentlyRenovated" className="text-sm font-medium">
                      Vivienda rehabilitada en los 2 años anteriores
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm mb-1">Reducción aplicable:</p>
                  <div className="bg-[#2a2f3f] p-3 rounded-lg">
                    <p className="font-semibold text-lg">{reduction}%</p>
                    <p className="text-xs text-muted-foreground">
                      {reduction === 90 && "90% - Zona tensionada con rebaja de renta"}
                      {reduction === 70 && "70% - Zona tensionada con inquilino joven"}
                      {reduction === 60 && "60% - Vivienda recientemente rehabilitada"}
                      {reduction === 50 && "50% - Reducción general para vivienda habitual"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen fiscal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total ingresos</p>
                  <p className="text-lg font-semibold">{form.watch('totalIncome')?.toFixed(2) || "0.00"}€</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total gastos</p>
                  <p className="text-lg font-semibold">{form.watch('totalExpenses')?.toFixed(2) || "0.00"}€</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rendimiento neto</p>
                  <p className="text-lg font-semibold">{form.watch('netProfit')?.toFixed(2) || "0.00"}€</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="bg-[#2a2f3f] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Rendimiento neto reducido (a declarar)</p>
                    <p className="text-xl font-semibold">{form.watch('reducedNetProfit')?.toFixed(2) || "0.00"}€</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Reducción aplicada ({reduction}%)</p>
                    <p className="text-lg font-semibold">{form.watch('netProfit') > 0 ? (form.watch('netProfit') * (reduction / 100)).toFixed(2) : "0.00"}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">Guardar datos fiscales</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FiscalDetailForm;
