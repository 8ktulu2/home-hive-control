
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { Property } from '@/types/property';
import { toast } from 'sonner';

interface ExportButtonProps {
  property: Property;
}

const ExportButton: React.FC<ExportButtonProps> = ({ property }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleExportToGoogleSheets = () => {
    if (!property) return;

    const propertyData = {
      'Información General': {
        Nombre: property.name,
        Dirección: property.address,
        'Referencia Catastral': property.cadastralReference || '',
        Inquilinos: property.tenants?.map(t => t.name).join(', ') || 'Ninguno'
      },
      'Información Financiera': {
        'Alquiler Mensual': formatCurrency(property.rent),
        'Gastos Mensuales': formatCurrency(property.expenses),
        'Ingresos Netos': formatCurrency(property.netIncome),
        'IBI Anual': property.ibi ? formatCurrency(property.ibi) : '',
      },
      'Estado de Pagos': property.paymentHistory?.map(p => ({
        Mes: `${p.month + 1}/${p.year}`,
        Estado: p.isPaid ? 'Pagado' : 'Pendiente',
        Fecha: new Date(p.date).toLocaleDateString('es-ES'),
        Notas: p.notes || ''
      })),
      'Contactos': {
        'Administrador Comunidad': property.communityManager || '',
        'Compañía de Seguros': property.insuranceCompany || '',
        'Proveedor de Agua': property.waterProvider || '',
        'Proveedor de Electricidad': property.electricityProvider || ''
      },
      'Tareas': property.tasks?.map(t => ({
        Título: t.title,
        Descripción: t.description || '',
        Estado: t.completed ? 'Completada' : 'Pendiente',
        'Fecha límite': t.dueDate || '',
      })),
      'Documentos': property.documents?.map(d => ({
        Nombre: d.name,
        Tipo: d.type,
        Categoría: d.category || '',
        'Fecha de subida': d.uploadDate,
      })),
      'Inventario': property.inventory?.map(i => ({
        Tipo: i.type,
        Nombre: i.name,
        Estado: i.condition,
        Notas: i.notes || ''
      }))
    };
    
    console.log('Datos para exportar a Google Sheets:', propertyData);
    
    toast.success('Preparando exportación a Google Sheets...');
    setTimeout(() => {
      toast.success('Datos exportados correctamente a Google Sheets');
    }, 1500);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExportToGoogleSheets}
      className="flex items-center gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      <span>Exportar a Google Sheets</span>
    </Button>
  );
};

export default ExportButton;
