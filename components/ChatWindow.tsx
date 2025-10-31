
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import SendIcon from './icons/SendIcon';
import ProductCard from './ProductCard';
import SparklesIcon from './icons/SparklesIcon';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  onSummarize: (productName: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, onSummarize, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-xl p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600/50 text-slate-100 rounded-br-none' : 'bg-slate-800 text-slate-300 rounded-bl-none'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.products && msg.products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-2 w-full max-w-4xl">
                  {msg.products.map((product, index) => (
                    <ProductCard key={`${msg.id}-prod-${index}`} product={product} onSummarize={onSummarize} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                <div className="flex items-center gap-2 text-slate-400">
                   <SparklesIcon className="w-5 h-5 animate-pulse text-cyan-400" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a product, e.g., 'wireless headphones under $200'"
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-5 pr-14 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
