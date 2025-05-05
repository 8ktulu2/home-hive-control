
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
  
  // Get the phone number from any available property
  const phoneNumber = details.phone || details.contactPhone;
  
  // Get the email from any available property
  const emailAddress = details.email || details.contactEmail;
  
  // Get the contact person from any available property
  const contactPersonName = details.contactPerson || details.accountHolder || details.provider;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {phoneNumber && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Phone className="h-5 w-5 ml-auto text-primary" />
              </div>
              <div className="col-span-3">
                <a href={`tel:${phoneNumber}`} className="text-primary hover:underline">
                  {phoneNumber}
                </a>
              </div>
            </div>
          )}
          
          {emailAddress && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Mail className="h-5 w-5 ml-auto text-primary" />
              </div>
              <a 
                href={`mailto:${emailAddress}`} 
                className="col-span-3 text-primary hover:underline"
              >
                {emailAddress}
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
          
          {contactPersonName && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <User className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">
                {contactPersonName}
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
