
import React, { useState, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import PreferencesPanel from './components/PreferencesPanel';
import ReviewSummaryPanel from './components/ReviewSummaryPanel';
import type { ChatMessage, UserPreferences, Product } from './types';
import { generateProductRecommendations, summarizeReviews } from './services/geminiService';

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 'under $500',
    preferredBrands: [],
    sustainabilityFocus: false,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Hello! I am your futuristic shopping assistant. How can I help you find the perfect product today?',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const handlePreferencesChange = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const result = await generateProductRecommendations(messageText, preferences);
      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result.response_text,
        products: result.products as Product[],
      };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: error instanceof Error ? error.message : "Sorry, something went wrong.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async (productName: string) => {
    setSelectedProduct(productName);
    setIsSummaryLoading(true);
    setReviewSummary(null);
    try {
      const summary = await summarizeReviews(productName);
      setReviewSummary(summary);
    } catch (error) {
      setReviewSummary(error instanceof Error ? error.message : "Failed to load summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-8 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          AI Shopping Assistant
        </h1>
        <p className="text-slate-400 mt-2">Your personal guide to smart shopping</p>
      </header>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 h-full min-h-[75vh]">
        <div className="lg:col-span-1 hidden lg:block">
          <PreferencesPanel preferences={preferences} onPreferencesChange={handlePreferencesChange} />
        </div>
        <div className="lg:col-span-2 h-[75vh] lg:h-auto">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onSummarize={handleSummarize}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1 h-[60vh] lg:h-auto">
          <ReviewSummaryPanel
            productName={selectedProduct}
            summary={reviewSummary}
            isLoading={isSummaryLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
