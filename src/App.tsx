import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatState } from './types/chat';
import { initializeGemini, generateResponse } from './utils/gemini';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      setChatState(prev => ({ ...prev, error: 'Please enter your API key first' }));
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await generateResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to generate response. Please try again.',
      }));
    }
  };

  useEffect(() => {
    if (apiKey) {
      initializeGemini(apiKey);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 glass-effect sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Chat Assistant
              </h1>
              <p className="text-sm text-gray-600">Powered by Gemini</p>
            </div>
          </div>
        </div>

        {/* API Key Input */}
        {!apiKey && (
          <div className="p-6 glass-effect mt-4 mx-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Gemini API Key to start chatting
            </label>
            <input
              type="password"
              placeholder="Enter your API key"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}

        {/* Error Message */}
        {chatState.error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 glass-effect">
            {chatState.error}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {chatState.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 glass-effect rounded-2xl">
                <MessageSquare size={40} className="mx-auto mb-4 text-purple-500" />
                <p className="text-gray-600">Start a conversation by sending a message</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="p-4 glass-effect rounded-xl inline-block">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={chatState.isLoading || !apiKey}
            autoFocus={!chatState.isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;