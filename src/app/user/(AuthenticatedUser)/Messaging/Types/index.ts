import { User } from "../page";

export interface Message {
    _id: string;
    content: string;
    createdAt: string;
    sender:string;
}

export interface chatHistoryMessage{
    _id: string;
    chat: string;
    sender: User; 
    content: string;
    type: 'text' | 'image' | 'video' | 'file'; // Adjust this to match possible types
    readBy: string[]; // List of user IDs who have read the message
    createdAt: string;
    updatedAt: string;
    __v: number
}

export interface useChatMessage{
    id: string; 
  content: string; 
  senderId: string; 
  receiverId: string | null; 
  timestamp: Date; 
  type: 'text' | 'image' | 'video' | 'file';
}
  
export interface ChatRoom {
    _id: string;
    participants: User[];
    lastMessage?: Message;
    updatedAt: string;
    createdAt: string;
}

export interface Iuser{
    _id:string;
    firstName:string;
    lastName:string;
    email:string;
    profile:Profile;
}

interface Profile {
    profilePicture: string;
}
  