import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useState, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useAppSelector } from "@/app/store/store";
import { useSocket } from "../../providers";

interface ChatRoomProps {
  roomId: string;
  receiverId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, receiverId }) => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const userId = useAppSelector(state => state.auth.user?._id);
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join_room', roomId);

    return () => {
      socket.emit('leave_room', roomId);
    };
  }, [socket, roomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(newMessage, receiverId);
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {messages && messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === userId}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};