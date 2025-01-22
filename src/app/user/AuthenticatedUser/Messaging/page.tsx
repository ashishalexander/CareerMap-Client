'use client'
import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, UserPlus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoom } from './components/ChatRoom';
import { chatApi } from './api/chatApi';
import { useSocket } from '../providers';
import { useAppSelector } from "@/app/store/store";

// Define interfaces matching our MongoDB models
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DBMessage {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  type: 'text' | 'image' | 'file';
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface DBChatRoom {
  _id: string;
  participants: User[];
  lastMessage?: DBMessage;
  createdAt: string;
  updatedAt: string;
}

interface ListItem {
  id: string;
  type: 'chat' | 'connection';
  user: User;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
  };
  updatedAt: string;
}

const ChatInterface: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<DBChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatRooms, setChatRooms] = useState<DBChatRoom[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const socket = useSocket();
  const currentUser = useAppSelector((state) => state.auth.user);
  
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!currentUser){
          return null
        }
        const [roomsResponse, connectionsResponse] = await Promise.all([
          chatApi.getChatRooms(currentUser?._id),
          chatApi.getConnectedUsers(currentUser?._id)
        ]);
        setChatRooms(roomsResponse.data);
        setConnections(connectionsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRoom = (room: DBChatRoom) => {
      setChatRooms(prev => [...prev, room]);
    };

    const handleRoomUpdate = (updatedRoom: DBChatRoom) => {
      setChatRooms(prev => 
        prev.map(room => room._id === updatedRoom._id ? updatedRoom : room)
      );
    };

    socket.on('new_room', handleNewRoom);
    socket.on('room_updated', handleRoomUpdate);

    return () => {
      socket.off('new_room', handleNewRoom);
      socket.off('room_updated', handleRoomUpdate);
    };
  }, [socket]);

  const handleStartNewChat = async (participantId: string) => {
    try {
      if(!currentUser) return null
      const newRoom = await chatApi.createChatRoom(currentUser._id,participantId);
      setChatRooms(prev => [...prev, newRoom.data]);
      setSelectedRoom(newRoom.data);
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const getCombinedList = (): ListItem[] => {
    const existingChatUserIds = new Set(chatRooms.flatMap(room => 
      room.participants.map(p => p._id)
    ));

    const newConnections = connections.filter(conn => 
      !existingChatUserIds.has(conn._id) && conn._id !== currentUser?._id
    );

    const chatRoomItems: ListItem[] = chatRooms.map(room => {
      const otherUser = room.participants.find(p => p._id !== currentUser?._id);
      return {
        id: room._id,
        type: 'chat',
        user: otherUser as User,
        lastMessage: room.lastMessage ? {
          id: room.lastMessage._id,
          content: room.lastMessage.content,
          senderId: room.lastMessage.sender,
          receiverId: room.participants.find(p => p._id !== room.lastMessage?.sender)?._id || '',
          timestamp: new Date(room.lastMessage.createdAt)
        } : undefined,
        updatedAt: room.updatedAt
      };
    });

    const connectionItems: ListItem[] = newConnections.map(conn => ({
      id: conn._id,
      type: 'connection',
      user: conn,
      updatedAt: new Date(0).toISOString()
    }));

    return [...chatRoomItems, ...connectionItems]
      .filter(item => {
        const userName = `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.toLowerCase();
        return userName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const combinedList = getCombinedList();

  return (
    <div className="flex h-[600px] w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(600px-73px)]">
          {combinedList.map(item => (
            <div
              key={item.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedRoom?._id === item.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                console.log('Clicked Item:', item); // Log the item
                if (item.type === 'chat') {
                  setSelectedRoom(chatRooms.find(r => r._id === item.id) || null);
                } else {
                  handleStartNewChat(item.id);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.user?.firstName} {item.user?.lastName}
                    </p>
                    {item.type === 'chat' ? (
                      <p className="text-xs text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    ) : (
                      <UserPlus className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {item.type === 'chat' && item.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {item.lastMessage.content}
                    </p>
                  )}
                  {item.type === 'connection' && (
                    <p className="text-sm text-gray-500 truncate">
                      Start a new conversation
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <ChatRoom
            roomId={selectedRoom._id}
            receiverId={selectedRoom.participants.find(p => p._id !== currentUser?._id)?._id || ''}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;