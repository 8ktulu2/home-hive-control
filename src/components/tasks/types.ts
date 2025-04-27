
import { Task } from '@/types/property';

export interface ExtendedTask extends Task {
  propertyName: string;
  propertyId: string;
  completedDate?: string;
  createdDate: string;
}
