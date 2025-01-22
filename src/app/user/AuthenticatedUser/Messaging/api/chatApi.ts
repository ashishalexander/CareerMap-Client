import api from '../../../../lib/axios-config';
import { ChatRoom, Message } from '../Types';


export const chatApi = {
  getChatRooms: (userId:string) => 
    api.get<ChatRoom[]>(`/api/users/chat/rooms/${userId}`),
  
  getChatHistory: (roomId: string,userId:string) => 
    api.get<Message[]>(`/api/users/chat/rooms/${roomId}/messages/${userId}`),
  
  createChatRoom: (userId:string,participantId: string) =>
    api.post<ChatRoom>(`/api/users/chat/rooms/${userId}`, { participantId }),

  getConnectedUsers: (userId:string) => 
    api.get<IUser[]>(`/api/users/chat/connected-users/${userId}`),

};