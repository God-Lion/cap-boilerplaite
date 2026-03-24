export interface INotificationService {
  notify(role: string, data: any): Promise<void>;
}
