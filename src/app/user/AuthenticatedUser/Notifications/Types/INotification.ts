export interface INotification {
    _id:string;
    title: string;
    message: string;
    link?: string;
    createdAt: Date;
    status: 'SENT' | 'FAILED';
}