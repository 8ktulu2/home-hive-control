
import Layout from '@/components/layout/Layout';
import HistoricalData from '@/components/finances/historical/HistoricalData';
import { mockProperties } from '@/data/mockData';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator } from 'lucide-react';

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
            <div className="bg-sky-500/10 text-sky-500 p-3 rounded-md text-sm">
              <p className="font-semibold mb-1">Recuerda:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El IBI es 100% deducible en el año fiscal correspondiente.</li>
                <li>Solo la parte de intereses de la hipoteca es deducible (no el capital amortizado).</li>
                <li>La amortización del inmueble (3% valor catastral) también es un gasto deducible.</li>
                <li>Conserva facturas y justificantes de todos los gastos durante al menos 4 años.</li>
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
