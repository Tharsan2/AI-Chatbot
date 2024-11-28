import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end flex-row-reverse'} message-appear`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isBot 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
          : 'bg-gradient-to-r from-pink-500 to-orange-500'
      }`}>
        {isBot ? (
          <Bot size={20} className="text-white" />
        ) : (
          <User size={20} className="text-white" />
        )}
      </div>
      <div className={`max-w-[70%] glass-effect rounded-2xl p-4 ${
        isBot 
          ? 'rounded-tl-sm' 
          : 'rounded-tr-sm'
      }`}>
        <div className="font-medium mb-1 text-sm">
          <span className={`${
            isBot 
              ? 'text-blue-600' 
              : 'text-pink-600'
          }`}>
            {isBot ? 'AI Assistant' : 'You'}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}