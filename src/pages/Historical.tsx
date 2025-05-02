
import Layout from '@/components/layout/Layout';
import HistoricalData from '@/components/finances/historical/HistoricalData';
import { mockProperties } from '@/data/mockData';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Info } from 'lucide-react';

const Historical = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handlePreviousYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Histórico</h1>
        <p className="text-muted-foreground">
          Datos históricos y declaración fiscal
        </p>
      </div>

      <Card className="mb-6 border-violet-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-violet-500" />
            <CardTitle>Declaración de la Renta</CardTitle>
          </div>
          <CardDescription>
            Información completa para optimizar tu declaración de IRPF como propietario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">
              La sección "Datos IRPF" incluye el desglose completo de ingresos y gastos deducibles para la 
              declaración de la renta. Todos los datos son exportables a CSV para facilitar la gestión con tu asesor fiscal.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-sky-500/10 text-sky-500 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4" />
                  <p className="font-semibold">Gastos Deducibles:</p>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>IBI (100% deducible)</li>
                  <li>Intereses hipoteca (no el capital amortizado)</li>
                  <li>Gastos de comunidad y mantenimiento</li>
                  <li>Seguros del inmueble</li>
                  <li>Amortización del inmueble (3% valor)</li>
                  <li>Amortización de mobiliario (10%)</li>
                  <li>Suministros pagados por el propietario</li>
                </ul>
              </div>
              
              <div className="bg-violet-500/10 text-violet-400 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4" />
                  <p className="font-semibold">Reducciones Aplicables:</p>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>50% general (vivienda habitual)</li>
                  <li>90% (zonas tensionadas con rebaja de renta)</li>
                  <li>70% (inquilinos jóvenes en zonas tensionadas)</li>
                  <li>60% (viviendas recientemente rehabilitadas)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-500/10 text-amber-500 p-3 rounded-md text-sm">
              <p className="font-semibold mb-1">Recuerda:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Los gastos de conservación y reparación son deducibles, pero no las mejoras que aumenten el valor.</li>
                <li>Los intereses y gastos de reparación no pueden superar los ingresos (el exceso se compensa en 4 años).</li>
                <li>Conserva facturas y justificantes de todos los gastos durante al menos 4 años.</li>
                <li>Las reducciones solo aplican a alquileres de vivienda habitual, no a usos turísticos o temporales.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <HistoricalData
        properties={mockProperties}
        selectedYear={selectedYear}
        onPreviousYear={handlePreviousYear}
        onNextYear={handleNextYear}
      />
    </Layout>
  );
};

export default Historical;
