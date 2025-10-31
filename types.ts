
export type ECommerceSource = 'Amazon' | 'Flipkart' | 'Other';

export interface Offer {
  source: ECommerceSource;
  price: string;
  url: string;
}

export interface Product {
  name: string;
  description: string;
  imageUrl: string;
  offers: Offer[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
  type?: 'message' | 'alert';
}

export interface UserPreferences {
  budget: string;
  preferredBrands: string[];
  sustainabilityFocus: boolean;
}

export interface DealAlert {
  id: string;
  productName: string;
  targetPrice: string; // The price to beat
}
