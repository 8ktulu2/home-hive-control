
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { FileText, Building, Calendar, FileCheck, ClipboardList, CreditCard } from 'lucide-react';
import { Transaction } from './types';

interface HistoricalTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const HistoricalTransactionModal = ({ isOpen, onClose, transaction }: HistoricalTransactionModalProps) => {
  if (!transaction) return null;
  
  const isIncome = transaction.type === 'income';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1A1F2C] text-white border-[#3F4554]">
        <DialogHeader>
          <DialogTitle className="text-white">{isIncome ? 'Ingreso' : 'Gasto'}</DialogTitle>
          <DialogDescription className="text-[#8E9196]">
            Detalles de la transacción
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between border-b border-[#3F4554] pb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                isIncome ? "bg-green-500/20" : "bg-amber-500/20"
              }`}>
                {isIncome ? (
                  <CreditCard className={`h-5 w-5 text-green-500`} />
                ) : (
                  <CreditCard className={`h-5 w-5 text-amber-500`} />
                )}
              </div>
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-sm text-[#8E9196]">{transaction.propertyName}</p>
              </div>
            </div>
            <Badge className={`${
              isIncome 
                ? "bg-green-500/20 text-green-500 border border-green-500" 
                : "bg-amber-500/20 text-amber-500 border border-amber-500"
            }`}>
              {formatCurrency(Math.abs(transaction.amount))}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#8E9196]">Fecha</p>
                <div className="flex items-center text-sm text-white">
                  <Calendar className="h-4 w-4 mr-2 text-[#8E9196]" />
                  {format(new Date(transaction.date), 'dd MMMM yyyy', {locale: es})}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-[#8E9196]">Categoría</p>
                <div className="flex items-center text-sm text-white">
                  <FileCheck className="h-4 w-4 mr-2 text-[#8E9196]" />
                  {transaction.category === 'rent' ? 'Alquiler' : 
                   transaction.category === 'comunidad' ? 'Comunidad' :
                   transaction.category === 'impuestos' ? 'Impuestos' :
                   transaction.category === 'seguro' ? 'Seguros' :
                   transaction.category === 'suministros' ? 'Suministros' :
                   transaction.category === 'reparaciones' ? 'Reparaciones' :
                   transaction.category === 'otros' ? 'Otros' : transaction.category}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-[#8E9196]">Propiedad</p>
              <div className="flex items-center text-sm text-white">
                <Building className="h-4 w-4 mr-2 text-[#8E9196]" />
                {transaction.propertyName}
              </div>
            </div>
            
            {transaction.notes && (
              <div className="space-y-1">
                <p className="text-xs text-[#8E9196]">Notas</p>
                <div className="flex items-start text-sm text-white">
                  <ClipboardList className="h-4 w-4 mr-2 text-[#8E9196] mt-0.5" />
                  <p>{transaction.notes}</p>
                </div>
              </div>
            )}
            
            {transaction.documents && transaction.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#8E9196]">Documentos</p>
                <div className="space-y-2">
                  {transaction.documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded-md bg-[#292F3F] hover:bg-[#333945] cursor-pointer"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-[#8E9196]" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-[#8E9196]/40">
                        Ver
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalTransactionModal;
