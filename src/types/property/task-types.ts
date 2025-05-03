
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdDate: string;
  completedDate?: string;
  notification?: TaskNotification;
}

export interface TaskNotification {
  enabled: boolean;
  date: string;
  reminderDays?: number;
  type?: 'email' | 'push' | 'both';
}
