
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FiscalSectionProps } from './types';
import { FiscalAmortizationGuide } from './FiscalAmortizationGuide';

export const FiscalExpenseSection: React.FC<FiscalSectionProps> = ({ form }) => {
  return (
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
                <FormLabel>Seguro de hogar</FormLabel>
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
            name="lifeInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seguro de vida</FormLabel>
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
                  Si está asociado a la hipoteca
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conservación y reparaciones</FormLabel>
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
            name="contractFormalization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formalización de contrato</FormLabel>
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
                  Honorarios de abogados, inmobiliarias
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="legalFees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defensa jurídica</FormLabel>
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
                  Costes de desahucio, etc.
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
                <FormDescription>
                  Impagos de alquiler deducibles
                </FormDescription>
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
        
        <FiscalAmortizationGuide />
      </CardContent>
    </Card>
  );
};
