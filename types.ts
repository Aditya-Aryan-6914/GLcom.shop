
export type ECommerceSource = 'Amazon' | 'Flipkart' | 'Other';

export interface Product {
  name: string;
  description: string;
  price: string;
  source: ECommerceSource;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
}

export interface UserPreferences {
  budget: string;
  preferredBrands: string[];
  sustainabilityFocus: boolean;
}
