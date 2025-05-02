
export interface Notification {
  id: string;
  type: 'payment' | 'task' | 'document';
  propertyId: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: string;
}
