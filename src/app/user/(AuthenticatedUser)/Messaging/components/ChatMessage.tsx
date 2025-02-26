import React from 'react';
import {  useChatMessage } from "../Types";

interface ChatMessageProps {
  message: useChatMessage;
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp: Date) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Invalid timestamp:', error);
      return '';
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`rounded-lg px-4 py-2 max-w-[70%] ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <span className={`text-xs ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

