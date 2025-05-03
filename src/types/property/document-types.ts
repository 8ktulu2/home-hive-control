
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  category?: 'tenant-contract' | 'supply-contract' | 'insurance' | 'invoice' | 'other';
  isPrimary?: boolean;
  propertyName?: string;
  propertyId?: string;
}

export interface LegalDocument {
  id: string;
  type: 'deed' | 'energyCertificate' | 'habitabilityCertificate' | 'technicalInspection' | 'other';
  name: string;
  dateIssued?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
}
