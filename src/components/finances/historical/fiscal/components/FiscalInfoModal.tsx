
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileCheck, Percent, Calculator, Coins } from 'lucide-react';

interface FiscalInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FiscalInfoModal: React.FC<FiscalInfoModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            Guía fiscal para propietarios de inmuebles
          </DialogTitle>
          <DialogDescription>
            Información detallada sobre los datos requeridos para la declaración de la renta y deducciones fiscales aplicables
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="datos">
          <TabsList className="grid grid-cols-5 mb-2">
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="reducciones">Reducciones</TabsTrigger>
            <TabsTrigger value="calculos">Cálculos</TabsTrigger>
            <TabsTrigger value="documentacion">Documentos</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="max-h-[60vh] pr-3">
            <TabsContent value="datos" className="space-y-4 mt-0">
              <section className="space-y-3">
                <h3 className="text-lg font-medium">Datos necesarios para la declaración</h3>
                <p className="text-sm text-muted-foreground">
                  Estos son los datos principales que necesitarás tener disponibles para completar correctamente la declaración del IRPF en relación a tus propiedades:
                </p>
                
                <div className="space-y-3">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Casillas principales</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Los ingresos y gastos deben declararse en el apartado de "Rendimientos del capital inmobiliario" (casillas 0062-0075).</li>
                      <li>La reducción por alquiler de vivienda habitual se aplica en la casilla 0150.</li>
                      <li>El exceso de gastos sobre ingresos puede compensarse en los 4 años siguientes.</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Identificación del inmueble</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Referencia catastral (aparece en el recibo del IBI)</li>
                      <li>Dirección completa</li>
                      <li>Fecha de adquisición y valor de compra</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Datos del contrato de alquiler</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Importe anual total de las rentas recibidas</li>
                      <li>Periodos de alquiler (si no ha estado alquilado todo el año)</li>
                      <li>Datos identificativos del inquilino (NIF/NIE)</li>
                      <li>Edad del inquilino (importante para ciertas deducciones)</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Otros ingresos relacionados</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Subvenciones recibidas para la vivienda</li>
                      <li>Cantidades percibidas por penalizaciones o indemnizaciones</li>
                      <li>Cualquier otro pago relacionado con el inmueble</li>
                    </ul>
                  </div>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="gastos" className="space-y-4 mt-0">
              <section className="space-y-3">
                <h3 className="text-lg font-medium">Gastos deducibles</h3>
                <p className="text-sm text-muted-foreground">
                  Según la Ley del IRPF (Art. 23), estos son los gastos que puedes deducir de los ingresos del alquiler:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Gastos necesarios</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Intereses de préstamos (NO el capital amortizado)</li>
                      <li>IBI y otras tasas municipales</li>
                      <li>Gastos de comunidad</li>
                      <li>Seguros de vivienda y de responsabilidad civil</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Servicios y suministros</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Gastos de administración y portería</li>
                      <li>Honorarios profesionales (abogados, gestores)</li>
                      <li>Suministros (luz, agua, gas) si los pagas tú</li>
                      <li>Servicios de limpieza entre inquilinos</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Conservación y reparación</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Reparaciones y conservación del inmueble</li>
                      <li>Pintura, fontanería, electricidad, etc.</li>
                      <li>Sustitución de elementos deteriorados</li>
                    </ul>
                    <p className="text-xs text-amber-600 mt-1">Nota: No se incluyen mejoras ni ampliaciones</p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-1">Amortización</h4>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>3% anual del valor de adquisición (sin suelo)</li>
                      <li>10% de muebles, enseres e instalaciones</li>
                    </ul>
                    <p className="text-xs text-amber-600 mt-1">La amortización es obligatoria aunque no suponga desembolso</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <h4 className="font-medium text-amber-800">Límite importante</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    Los gastos de intereses y conservación tienen un límite conjunto: no pueden superar los ingresos íntegros.
                    El exceso se puede deducir en los 4 años siguientes.
                  </p>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="reducciones" className="space-y-4 mt-0">
              <section className="space-y-3">
                <h3 className="text-lg font-medium">Reducciones fiscales aplicables</h3>
                <p className="text-sm text-muted-foreground">
                  Según la Ley 12/2023, de 24 de mayo, puedes aplicar importantes reducciones al rendimiento neto:
                </p>
                
                <div className="space-y-3">
                  <div className="border border-green-200 bg-green-50 rounded-md p-3">
                    <h4 className="font-medium text-green-800 mb-1">Reducción base del 50%</h4>
                    <p className="text-sm text-green-800">
                      Aplicable a todos los alquileres de vivienda habitual (el inquilino vive allí).
                    </p>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 rounded-md p-3">
                    <h4 className="font-medium text-blue-800 mb-1">Reducción del 60%</h4>
                    <p className="text-sm text-blue-800">
                      Si el inmueble ha sido rehabilitado energéticamente en los últimos 2 años.
                    </p>
                  </div>
                  
                  <div className="border border-violet-200 bg-violet-50 rounded-md p-3">
                    <h4 className="font-medium text-violet-800 mb-1">Reducción del 70%</h4>
                    <p className="text-sm text-violet-800">
                      Para alquileres a jóvenes (entre 18 y 35 años) en zonas tensionadas.
                    </p>
                    <ul className="text-xs text-violet-800 mt-1 pl-5 list-disc">
                      <li>Zona tensionada: declarada oficialmente por la Comunidad Autónoma</li>
                      <li>Se debe acreditar la edad del inquilino</li>
                    </ul>
                  </div>
                  
                  <div className="border border-purple-200 bg-purple-50 rounded-md p-3">
                    <h4 className="font-medium text-purple-800 mb-1">Reducción del 90%</h4>
                    <p className="text-sm text-purple-800">
                      En zonas tensionadas cuando el alquiler se rebaje al menos un 5% respecto al contrato anterior.
                    </p>
                    <ul className="text-xs text-purple-800 mt-1 pl-5 list-disc">
                      <li>Debes poder acreditar el precio del contrato anterior</li>
                      <li>La rebaja debe ser de al menos el 5% respecto al contrato anterior</li>
                    </ul>
                  </div>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="calculos" className="space-y-4 mt-0">
              <section className="space-y-3">
                <h3 className="text-lg font-medium">Cálculo del rendimiento a declarar</h3>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 bg-gray-50">
                    <h4 className="font-medium mb-2">Paso 1: Rendimiento íntegro</h4>
                    <p className="text-sm">Total de rentas percibidas durante el año por el alquiler del inmueble.</p>
                    <div className="flex items-center justify-between p-2 bg-white rounded mt-2">
                      <span className="text-sm font-medium">Rentas anuales</span>
                      <span className="text-sm">12.000€</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-gray-50">
                    <h4 className="font-medium mb-2">Paso 2: Restar gastos deducibles</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">IBI</span>
                        <span className="text-sm">- 500€</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">Intereses hipoteca</span>
                        <span className="text-sm">- 2.400€</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">Comunidad</span>
                        <span className="text-sm">- 1.200€</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">Amortización (3%)</span>
                        <span className="text-sm">- 1.800€</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded mt-1">
                        <span className="text-sm font-medium">Rendimiento neto</span>
                        <span className="text-sm">6.100€</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-gray-50">
                    <h4 className="font-medium mb-2">Paso 3: Aplicar reducción</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">Rendimiento neto</span>
                        <span className="text-sm">6.100€</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-sm">Reducción (60%)</span>
                        <span className="text-sm">- 3.660€</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded mt-1">
                        <span className="text-sm font-medium">Rendimiento a declarar</span>
                        <span className="text-sm">2.440€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="documentacion" className="space-y-4 mt-0">
              <section className="space-y-3">
                <h3 className="text-lg font-medium">Documentación necesaria</h3>
                <p className="text-sm text-muted-foreground">
                  Conserva estos documentos durante al menos 4 años (plazo de prescripción fiscal):
                </p>
                
                <div className="space-y-3">
                  <div className="border rounded-md p-3 flex">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Contrato de alquiler</h4>
                      <p className="text-sm text-muted-foreground">
                        Conserva todos los contratos firmados y sus modificaciones o prórrogas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 flex">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Facturas y recibos</h4>
                      <p className="text-sm text-muted-foreground">
                        Todos los justificantes de gastos deducidos: IBI, comunidad, seguros, etc.
                        Deben estar a nombre del propietario.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 flex">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Justificantes de ingresos</h4>
                      <p className="text-sm text-muted-foreground">
                        Transferencias bancarias, recibos u otros documentos que acrediten el cobro del alquiler.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 flex">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Escritura de propiedad</h4>
                      <p className="text-sm text-muted-foreground">
                        Para verificar la fecha de adquisición y valor a efectos de amortización.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 flex">
                    <FileCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Certificado para reducciones especiales</h4>
                      <p className="text-sm text-muted-foreground">
                        Para reducciones del 60%, 70% o 90%: certificados de eficiencia energética, 
                        zona tensionada, DNI del inquilino para verificar edad, etc.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                  <p className="text-sm text-blue-800">
                    <strong>Recomendación:</strong> La aplicación te permite generar informes fiscales detallados 
                    que puedes usar como documentación auxiliar para tu declaración de la renta.
                  </p>
                </div>
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FiscalInfoModal;
