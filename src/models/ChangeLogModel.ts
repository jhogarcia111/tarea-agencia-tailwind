export interface ChangeLog {
  id: number;
  entity: 'task' | 'client';
  entityId: number;
  action: 'create' | 'update' | 'delete';
  userId: number;
  userName: string;
  timestamp: string;
  details: string;
}