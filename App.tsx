import React, { useState, useCallback, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import PreferencesPanel from './components/PreferencesPanel';
import ReviewSummaryPanel from './components/ReviewSummaryPanel';
import DealAlertsPanel from './components/DealAlertsPanel';
import type { ChatMessage, UserPreferences, Product, Offer, DealAlert } from './types';
import { generateProductRecommendations, summarizeReviews } from './services/geminiService';

const getBestOffer = (offers: Offer[]): Offer | null => {
  if (!offers || offers.length === 0) return null;
  return offers.reduce((best, current) => {
    const bestPrice = parseFloat(best.price.replace(/[^0-9.]+/g, ''));
    const currentPrice = parseFloat(current.price.replace(/[^0-9.]+/g, ''));
    return currentPrice < bestPrice ? current : best;
  });
};

const App: React.FC = () => {
  // Check for API key at the component level for graceful failure
  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center bg-slate-900 border border-red-500/50 rounded-2xl p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-red-400">Configuration Error</h1>
          <p className="text-slate-300 mt-4">
            The AI Shopping Assistant could not start because the Google Gemini API key is missing.
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Please make sure the <code>API_KEY</code> environment variable is set in your deployment configuration and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 'under $500',
    preferredBrands: [],
    sustainabilityFocus: false,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      type: 'message',
      text: 'Hello! I am your futuristic shopping assistant. How can I help you find the perfect product today?',
    },
  ]);

  const [dealAlerts, setDealAlerts] = useState<DealAlert[]>([]);
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
      type: 'message',
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
        type: 'message',
      };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: error instanceof Error ? error.message : "Sorry, something went wrong.",
        type: 'message',
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

  const handleSetAlert = (product: Product) => {
    const bestOffer = getBestOffer(product.offers);
    if (!bestOffer || dealAlerts.some(a => a.productName === product.name)) {
      return;
    }
    const newAlert: DealAlert = {
      id: `alert-${product.name}-${Date.now()}`,
      productName: product.name,
      targetPrice: bestOffer.price,
    };
    setDealAlerts(prev => [...prev, newAlert]);
  };

  const handleRemoveAlert = (alertId: string) => {
    setDealAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dealAlerts.length > 0) {
        const randomAlert = dealAlerts[Math.floor(Math.random() * dealAlerts.length)];
        const originalPriceNum = parseFloat(randomAlert.targetPrice.replace(/[^0-9.]+/g, ''));
        const currencySymbol = randomAlert.targetPrice.replace(/[0-9., ]/g, '');
        const newPrice = (originalPriceNum * 0.9).toFixed(2);

        const alertMessage: ChatMessage = {
          id: `alert-msg-${Date.now()}`,
          sender: 'ai',
          type: 'alert',
          text: `PRICE DROP! ${randomAlert.productName} is now ${currencySymbol}${newPrice}.`,
        };

        setMessages(prev => [...prev, alertMessage]);
        handleRemoveAlert(randomAlert.id); // Remove alert after notifying
      }
    }, 20000); // Simulate check every 20 seconds

    return () => clearInterval(intervalId);
  }, [dealAlerts]);


  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-8 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          AI Shopping Assistant
        </h1>
        <p className="text-slate-400 mt-2">Your personal guide to smart shopping</p>
      </header>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 h-full min-h-[75vh]">
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-8">
          <PreferencesPanel preferences={preferences} onPreferencesChange={handlePreferencesChange} />
          <DealAlertsPanel alerts={dealAlerts} onRemoveAlert={handleRemoveAlert} />
        </div>
        <div className="lg:col-span-2 h-[75vh] lg:h-auto">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onSummarize={handleSummarize}
            onSetAlert={handleSetAlert}
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