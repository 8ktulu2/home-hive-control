
import { ContactDetails } from '@/types/property';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Mail, Globe, User, FileText } from 'lucide-react';

interface ContactDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: ContactDetails | Record<string, any> | undefined;
}

const ContactDetailsDialog = ({ isOpen, onClose, title, details }: ContactDetailsDialogProps) => {
  if (!details) {
    details = {};
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {(details.phone || details.contactPhone) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Phone className="h-5 w-5 ml-auto text-primary" />
              </div>
              <div className="col-span-3">
                <a href={`tel:${details.phone || details.contactPhone}`} className="text-primary hover:underline">
                  {details.phone || details.contactPhone}
                </a>
              </div>
            </div>
          )}
          
          {(details.email || details.contactEmail) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Mail className="h-5 w-5 ml-auto text-primary" />
              </div>
              <a 
                href={`mailto:${details.email || details.contactEmail}`} 
                className="col-span-3 text-primary hover:underline"
              >
                {details.email || details.contactEmail}
              </a>
            </div>
          )}
          
          {details.website && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Globe className="h-5 w-5 ml-auto text-primary" />
              </div>
              <a 
                href={details.website.startsWith('http') ? details.website : `https://${details.website}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="col-span-3 text-primary hover:underline"
              >
                {details.website}
              </a>
            </div>
          )}
          
          {(details.contactPerson || details.accountHolder || details.provider) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <User className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">
                {details.contactPerson || details.accountHolder || details.provider}
              </span>
            </div>
          )}
          
          {details.contractNumber && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <FileText className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">
                <strong>Contrato:</strong> {details.contractNumber}
              </span>
            </div>
          )}
          
          {details.initialReading && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <FileText className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">
                <strong>Lectura inicial:</strong> {details.initialReading}
              </span>
            </div>
          )}
          
          {details.notes && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <FileText className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{details.notes}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsDialog;
