export type NotificationType = 'CONNECTION' | 'LIKE' | 'COMMENT' | 'SHARE' | 'JOB' | 'MENTION' | 'DEFAULT';

export interface INotification {
    _id: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    createdAt: Date;
    status: 'SENT' | 'FAILED';
    read?: boolean; // Added for tracking read status
}
