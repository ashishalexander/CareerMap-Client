export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
}
  
export interface ChatRoom {
    id: string;
    participants: string[];
    lastMessage?: Message;
    updatedAt: Date;
}