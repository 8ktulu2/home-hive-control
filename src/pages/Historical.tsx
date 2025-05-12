import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import HistoricalData from '@/components/finances/historical/HistoricalData';
import { mockProperties } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Info, Download, Plus, FileSpreadsheet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Historical = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handlePreviousYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  const handleImportData = () => {
    toast.success("Datos importados correctamente");
    setIsImportModalOpen(false);
  };

  return (
    <Layout>
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Histórico</h1>
          <p className="text-muted-foreground">
            Datos históricos y declaración fiscal
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Añadir Datos</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <Info className="h-4 w-4" />
            <span>Guía IRPF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 border-violet-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-violet-500" />
              <CardTitle>Declaración de la Renta</CardTitle>
            </div>
            <CardDescription>
              Información para optimizar tu declaración IRPF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              La sección "Datos IRPF" incluye el desglose completo de ingresos y gastos deducibles para la 
              declaración de la renta. Todos los datos son exportables a CSV.
            </p>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsHelpModalOpen(true)}
              >
                <Info className="h-4 w-4" />
                <span>Ver Guía IRPF Completa</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-violet-500" />
              <CardTitle>Informes Financieros</CardTitle>
            </div>
            <CardDescription>
              Descarga informes para análisis y gestión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Genera informes personalizados para tus necesidades específicas de análisis, gestión o trámites fiscales.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-sky-700" />
                    <span className="text-sm font-medium">Informe Anual</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-sky-700" />
                    <span className="text-sm font-medium">Informe Fiscal</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-sky-700" />
                    <span className="text-sm font-medium">Datos Para Excel</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                También puedes crear informes personalizados desde la pestaña de Informes.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <HistoricalData
        properties={mockProperties}
        selectedYear={selectedYear}
        onPreviousYear={handlePreviousYear}
        onNextYear={handleNextYear}
      />

      {/* Import Data Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Datos Históricos</DialogTitle>
            <DialogDescription>
              Añade datos históricos anteriores a la app para un registro completo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="property">Propiedad</Label>
              <Select>
                <SelectTrigger id="property">
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map(property => (
                    <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Mes</Label>
                <Select>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Enero</SelectItem>
                    <SelectItem value="2">Febrero</SelectItem>
                    <SelectItem value="3">Marzo</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Mayo</SelectItem>
                    <SelectItem value="6">Junio</SelectItem>
                    <SelectItem value="7">Julio</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Septiembre</SelectItem>
                    <SelectItem value="10">Octubre</SelectItem>
                    <SelectItem value="11">Noviembre</SelectItem>
                    <SelectItem value="12">Diciembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Select>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Registro</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Tipo de registro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Ingreso por Alquiler</SelectItem>
                  <SelectItem value="vacancy">Período de Vacancia</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Importe</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impuestos">Impuestos</SelectItem>
                    <SelectItem value="comunidad">Comunidad</SelectItem>
                    <SelectItem value="seguro">Seguros</SelectItem>
                    <SelectItem value="reparaciones">Reparaciones</SelectItem>
                    <SelectItem value="suministros">Suministros</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="description">Descripción</Label>
                <span className="text-xs text-muted-foreground">Opcional</span>
              </div>
              <Input id="description" placeholder="Descripción del registro" />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleImportData}>Añadir Registro</Button>
            </div>
            
            <div className="text-center pt-2">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>También puedes</span>
                <Button variant="link" className="h-auto p-0">importar desde CSV</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* IRPF Help Modal - contenido completo de la guía IRPF */}
      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
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
              <Button onClick={() => setIsHelpModalOpen(false)}>Entendido</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Historical;
