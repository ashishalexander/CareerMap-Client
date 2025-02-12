export type NotificationType = 'CONNECTION' | 'LIKE' | 'COMMENT' | 'SHARE' | 'JOB' | 'MENTION' | 'DEFAULT';

export interface INotification {
    _id: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    createdAt: Date;
    status: 'SENT' | 'FAILED';
    read?: boolean;
}

export type CombinedNotification = {
    _id: string;
    type: string;
    title?: string;
    message: string;
    link?: string;
    createdAt: Date;
    senderId?: string;
    receiverId?: string;
    postId?: string;
    source: 'admin' | 'user';
    // Added new properties for user notifications
    senderName?: string;
    senderAvatar?: string;
    comment?: string;
};

export interface IUserNotification extends Document {
    _id: string;
    type: "like" | "comment" | "connection" | "message" | "general";
    senderId: string;
    receiverId: string;
    postId: string;
    comment?: string;
    message?: string;
    createdAt: Date;
}