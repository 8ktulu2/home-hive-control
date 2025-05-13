
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Info } from 'lucide-react';

interface IRPFGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IRPFGuideModal = ({ isOpen, onClose }: IRPFGuideModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guía para la Declaración de la Renta (IRPF)</DialogTitle>
          <DialogDescription>
            Instrucciones para optimizar la declaración de alquileres
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Rendimientos del Capital Inmobiliario</h3>
            <p className="text-sm text-muted-foreground">
              Los ingresos por alquiler se declaran como rendimientos del capital inmobiliario. Es importante seguir estas pautas:
            </p>
            
            <div className="mt-2 space-y-2">
              <h4 className="font-medium">Ingresos a Declarar:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Rentas percibidas por el arrendamiento</li>
                <li>Cantidades por servicios incluidos (agua, internet, etc.)</li>
                <li>Fianzas retenidas por incumplimientos</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Gastos Deducibles</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Puedes deducir estos gastos para reducir la base imponible:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Intereses y Gastos de Financiación:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Intereses de préstamos (no la amortización del capital)</li>
                  <li>Gastos de formalización de contratos</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Gastos de Conservación y Reparación:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Pintura, arreglo de instalaciones, etc.</li>
                  <li>No incluye ampliaciones o mejoras</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Tributos y Recargos:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>IBI, Tasas municipales</li>
                  <li>Recargos municipales</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Otros Gastos:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Saldos de dudoso cobro</li>
                  <li>Seguros de hogar, responsabilidad civil</li>
                  <li>Servicios profesionales (abogados, administradores)</li>
                  <li>Gastos de comunidad</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Amortización:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>3% anual del valor de adquisición de la construcción (no del suelo)</li>
                  <li>Mobiliario y enseres: 10% anual</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Reducciones Aplicables</h3>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li><span className="font-medium">Reducción General (60%):</span> Para arrendamientos destinados a vivienda habitual.</li>
              <li><span className="font-medium">Alquiler de viviendas en zonas tensionadas (90%):</span> Alquileres en zonas declaradas tensionadas que cumplan requisitos específicos.</li>
              <li><span className="font-medium">Alquiler a jóvenes (70%):</span> Arrendamientos a inquilinos entre 18 y 35 años con rendimientos netos superiores al IPREM.</li>
            </ul>
          </div>

          <Card className="bg-sky-50 p-4 rounded-md border border-sky-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-sky-700" />
              <h4 className="font-medium text-sky-900">Importante:</h4>
            </div>
            <ul className="list-disc pl-5 text-sm text-sky-900 space-y-1">
              <li>La aplicación calcula automáticamente tus rendimientos del capital inmobiliario para facilitar la declaración.</li>
              <li>Mantén siempre los documentos justificativos de ingresos y gastos durante al menos 4 años.</li>
              <li>Consulta con un asesor fiscal para casos específicos o situaciones complejas.</li>
            </ul>
          </Card>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={onClose}>Entendido</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IRPFGuideModal;
