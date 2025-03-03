import { useState, useCallback, useEffect } from 'react';
import { useSocket } from '../../providers';
import { useChatMessage } from '../Types/index';
import { chatApi } from '../api/chatApi';
import { useAppSelector } from '@/app/store/store';

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<useChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();
  const currentUser = useAppSelector((state)=>state.auth.user)

  // Load chat history when room changes
 useEffect(() => {
    const loadChatHistory = async () => {
      if (!roomId || !currentUser) return;
      
      setIsLoading(true);
      try {
        const response = await chatApi.getChatHistory(roomId, currentUser._id);
        console.log(response.data)
        // Transform the message data to match expected format
        const transformedMessages = response.data.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          senderId: msg.sender._id,
          receiverId: msg.receiver ? msg.receiver._id : null,
          timestamp: new Date(msg.createdAt),
          type: msg.type || 'text'
        }));
        setMessages(transformedMessages);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [roomId, socket?.id, currentUser]);


  const sendMessage = useCallback((content: string, receiverId: string) => {
    const messageData = {
      roomId,
      content,
      receiverId,
      timestamp: new Date()
    };

    socket?.emit('send_message', messageData);
  }, [socket, roomId]);

    const handleNewMessage = useCallback((message: useChatMessage) => {
    if (!message) return;

    setMessages(prevMessages => {
      // Ensure prevMessages is an array
      const currentMessages = prevMessages || [];
      
      // Check if message already exists
      const exists = currentMessages.find(msg => msg.id === message.id);
      
      if (exists) {
        return currentMessages;
      }
      
      return [...currentMessages, message];
    });
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  return {
    messages,
    sendMessage,
    isLoading
  };
};