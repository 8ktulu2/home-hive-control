
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Calculator, FileText, AlertTriangle } from 'lucide-react';

interface FiscalHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FiscalHelpDialog: React.FC<FiscalHelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Guía del Informe Fiscal - Rendimientos del Capital Inmobiliario
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="concepts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="concepts">Conceptos</TabsTrigger>
            <TabsTrigger value="calculations">Cálculos</TabsTrigger>
            <TabsTrigger value="declarations">Declaración</TabsTrigger>
            <TabsTrigger value="deadlines">Plazos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="concepts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conceptos Básicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Ingresos del Capital Inmobiliario</h4>
                  <p className="text-sm text-gray-700">
                    Rentas obtenidas por el arrendamiento de bienes inmuebles urbanos (art. 25 LIRPF).
                    Incluye alquileres de viviendas, locales comerciales y otros inmuebles.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Gastos Deducibles (art. 23 LIRPF)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Intereses de préstamos para la adquisición del inmueble</li>
                    <li>• Tributos y recargos no estatales (IBI, tasas de basura)</li>
                    <li>• Gastos de conservación y reparación</li>
                    <li>• Servicios, suministros y gastos de comunidad</li>
                    <li>• Primas de seguro del inmueble</li>
                    <li>• Amortización del inmueble (3% anual sobre valor construcción)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Reducciones Aplicables</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>50%:</strong> Arrendamiento de vivienda habitual del inquilino</li>
                    <li>• <strong>60%:</strong> + Obras de mejora en los 2 años anteriores</li>
                    <li>• <strong>70%:</strong> + Inquilino joven (18-35 años) en zona tensionada</li>
                    <li>• <strong>90%:</strong> + Reducción de renta ≥5% en zona tensionada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Fórmulas de Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Rendimiento Neto</h4>
                  <code className="text-sm bg-white p-2 rounded block">
                    Rendimiento Neto = Ingresos Íntegros - Gastos Deducibles
                  </code>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Rendimiento Neto Reducido</h4>
                  <code className="text-sm bg-white p-2 rounded block">
                    Rendimiento Final = Rendimiento Neto × (100% - % Reducción)
                  </code>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Amortización Anual</h4>
                  <code className="text-sm bg-white p-2 rounded block">
                    Amortización = (Precio Adquisición - Valor Suelo) × 3%
                  </code>
                  <p className="text-xs text-purple-700 mt-1">
                    Valor del suelo: mínimo 20% del precio total de adquisición
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Estimación IRPF</h4>
                  <code className="text-sm bg-white p-2 rounded block">
                    Cuota Estimada = Rendimiento Final × Tipo Marginal (19-47%)
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="declarations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Modelos de Declaración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Modelo 100 - Declaración de la Renta</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Apartado C:</strong> Rendimientos del Capital Inmobiliario
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Casilla 001:</strong> Ingresos íntegros</li>
                    <li>• <strong>Casilla 002:</strong> Gastos deducibles</li>
                    <li>• <strong>Casilla 003:</strong> Rendimiento neto previo</li>
                    <li>• <strong>Casilla 004:</strong> Reducción aplicable (%)</li>
                    <li>• <strong>Casilla 005:</strong> Rendimiento neto final</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Modelo 210 - No Residentes</h4>
                  <p className="text-sm text-gray-700">
                    Declaración trimestral para arrendadores no residentes en España.
                    Retención del 19% sobre ingresos íntegros.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Modelo 123 - Retenciones</h4>
                  <p className="text-sm text-gray-700">
                    Declaración trimestral de retenciones practicadas por empresas arrendadoras.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Plazos y Obligaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Declaración de la Renta</h4>
                  <p className="text-sm text-red-700">
                    <strong>Plazo:</strong> Del 6 de abril al 30 de junio del año siguiente
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Modelos Trimestrales</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>1er trimestre:</strong> Hasta el 20 de abril</li>
                    <li>• <strong>2do trimestre:</strong> Hasta el 20 de julio</li>
                    <li>• <strong>3er trimestre:</strong> Hasta el 20 de octubre</li>
                    <li>• <strong>4to trimestre:</strong> Hasta el 20 de enero (año siguiente)</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Documentación Requerida</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Contratos de arrendamiento</li>
                    <li>• Justificantes de ingresos (recibos, transferencias)</li>
                    <li>• Facturas de gastos deducibles</li>
                    <li>• Certificado de retenciones (si aplica)</li>
                    <li>• Escritura de compra del inmueble</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FiscalHelpDialog;
