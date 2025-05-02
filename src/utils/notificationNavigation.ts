
import { Notification } from '@/types/notification';

export const getNavigationPathForNotification = (notification: Notification): string => {
  switch (notification.type) {
    case 'payment':
      return `/property/${notification.propertyId}#payment-status`;
    case 'task':
      return `/property/${notification.propertyId}#tasks`;
    case 'document':
      return `/property/${notification.propertyId}#documents`;
    default:
      return `/property/${notification.propertyId}`;
  }
};
