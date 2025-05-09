
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/lib/formatters';
import { X, Pencil, Save, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface HistoricalTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any | null;
}

const HistoricalTransactionModal = ({ isOpen, onClose, transaction }: HistoricalTransactionModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (transaction) {
      setNotes(transaction.notes || '');
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSaveNotes = () => {
    // In a real application, you would save the updated notes to the backend
    setIsEditing(false);
    toast.success('Notas guardadas correctamente');
  };

  const handleDownloadDocument = (document: string) => {
    toast.success(`Descargando documento: ${document}`);
  };

  const formatTransactionType = (type: string) => {
    return type === 'income' ? 'Ingreso' : 'Gasto';
  };

  const formatCategory = (category: string) => {
    return category === 'rent' ? 'Alquiler' : 
      category === 'comunidad' ? 'Comunidad' :
      category === 'impuestos' ? 'Impuestos' :
      category === 'seguro' ? 'Seguros' :
      category === 'suministros' ? 'Suministros' :
      category === 'reparaciones' ? 'Reparaciones' :
      category === 'otros' ? 'Otros' : category;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#292F3F] text-white border-[#8E9196]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>Detalle de Transacción</span>
            <Badge className={
              transaction.type === 'income' 
                ? "bg-green-500/20 text-green-500 border border-green-500" 
                : "bg-amber-500/20 text-amber-500 border border-amber-500"
            }>
              {formatTransactionType(transaction.type)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-[#8E9196]">
            Información completa de la transacción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-[#8E9196] text-sm">Descripción</h4>
            <p className="text-white">{transaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-[#8E9196] text-sm">Fecha</h4>
              <p className="text-white">{format(new Date(transaction.date), 'dd MMMM yyyy', {locale: es})}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[#8E9196] text-sm">Importe</h4>
              <p className={transaction.amount >= 0 ? 'text-green-500' : 'text-amber-500'}>
                {formatCurrency(Math.abs(transaction.amount))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-[#8E9196] text-sm">Propiedad</h4>
              <p className="text-white">{transaction.propertyName}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[#8E9196] text-sm">Categoría</h4>
              <p className="text-white">{formatCategory(transaction.category)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-[#8E9196] text-sm">Notas</h4>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[#8E9196] hover:text-white"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[#8E9196] hover:text-white"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#1A1F2C] border-[#8E9196]/40" 
                  placeholder="Escribe notas sobre esta transacción..."
                />
                <Button 
                  size="sm" 
                  className="bg-violet-500 hover:bg-violet-600"
                  onClick={handleSaveNotes}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar notas
                </Button>
              </div>
            ) : (
              <p className="text-white">{notes || "No hay notas"}</p>
            )}
          </div>

          {transaction.documents && transaction.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[#8E9196] text-sm">Documentos</h4>
              <div className="space-y-2">
                {transaction.documents.map((doc: string, index: number) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-[#1A1F2C] p-2 rounded border border-[#8E9196]/20"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-[#8E9196]" />
                      <span className="text-white text-sm">{doc}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-[#8E9196] hover:text-white"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalTransactionModal;
