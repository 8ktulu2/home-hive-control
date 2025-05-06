
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FiscalSectionProps } from './types';

export const FiscalIncomeSection: React.FC<FiscalSectionProps> = ({ form }) => {
  return (
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
  );
};
