
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
  details: ContactDetails | undefined;
}

const ContactDetailsDialog = ({ isOpen, onClose, title, details }: ContactDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {details?.phone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Phone className="h-5 w-5 ml-auto text-primary" />
              </div>
              <div className="col-span-3">
                <a href={`tel:${details.phone}`} className="text-primary hover:underline">
                  {details.phone}
                </a>
              </div>
            </div>
          )}
          
          {details?.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Mail className="h-5 w-5 ml-auto text-primary" />
              </div>
              <a 
                href={`mailto:${details.email}`} 
                className="col-span-3 text-primary hover:underline"
              >
                {details.email}
              </a>
            </div>
          )}
          
          {details?.website && (
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
          
          {details?.contactPerson && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <User className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{details.contactPerson}</span>
            </div>
          )}
          
          {details?.notes && (
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
