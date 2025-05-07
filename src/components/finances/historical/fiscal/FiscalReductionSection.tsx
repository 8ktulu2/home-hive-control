
import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FiscalSectionProps } from './types';

interface ReductionProps extends FiscalSectionProps {
  reduction: number;
  handleReductionChange: (
    inTensionedArea: boolean,
    rentLowered: boolean,
    youngTenant: boolean,
    recentlyRenovated: boolean
  ) => void;
}

export const FiscalReductionSection: React.FC<ReductionProps> = ({ 
  form, 
  reduction,
  handleReductionChange 
}) => {
  // Cuando cambia el estado de zona tensionada, restablecer las opciones relacionadas
  useEffect(() => {
    const isTensionedArea = form.watch('inTensionedArea');
    if (!isTensionedArea) {
      // Si no es zona tensionada, reseteamos estas opciones
      form.setValue('rentLoweredFromPrevious', false);
      form.setValue('youngTenant', false);
    }
  }, [form.watch('inTensionedArea')]);

  return (
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
                    isChecked ? form.watch('rentLoweredFromPrevious') : false,
                    isChecked ? form.watch('youngTenant') : false,
                    form.watch('recentlyRenovated')
                  );
                }}
              />
              <label htmlFor="inTensionedArea" className="text-sm font-medium">
                Zona de mercado tensionado
              </label>
            </div>
            
            {form.watch('inTensionedArea') && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rentLowered"
                    checked={form.watch('rentLoweredFromPrevious')}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      // Si marcamos esta opción, desmarcamos la de inquilino joven
                      if (isChecked) {
                        form.setValue('youngTenant', false);
                      }
                      handleReductionChange(
                        form.watch('inTensionedArea'),
                        isChecked,
                        isChecked ? false : form.watch('youngTenant'),
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
                      // Si marcamos esta opción, desmarcamos la de rebaja de renta
                      if (isChecked) {
                        form.setValue('rentLoweredFromPrevious', false);
                      }
                      handleReductionChange(
                        form.watch('inTensionedArea'),
                        isChecked ? false : form.watch('rentLoweredFromPrevious'),
                        isChecked,
                        form.watch('recentlyRenovated')
                      );
                    }}
                  />
                  <label htmlFor="youngTenant" className="text-sm font-medium">
                    Inquilino joven (18-35 años)
                  </label>
                </div>
              </>
            )}
            
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
                {reduction === 0 && "0% - No aplicable (no es vivienda habitual)"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
