import api from '../../../../lib/axios-config';
import { ChatRoom,Iuser, chatHistoryMessage } from '../Types';


export const chatApi = {
  getChatRooms: (userId:string) => 
    api.get<ChatRoom[]>(`/api/users/chat/rooms/${userId}`),
  
  getChatHistory: (roomId: string,userId:string) => 
    api.get<chatHistoryMessage[]>(`/api/users/chat/rooms/${roomId}/messages/${userId}`),
  
  createChatRoom: (userId:string,participantId: string) =>
    api.post<ChatRoom>(`/api/users/chat/rooms/${userId}`, { participantId }),

  getConnectedUsers: (userId:string) => 
    api.get<Iuser[]>(`/api/users/chat/connected-users/${userId}`),

};