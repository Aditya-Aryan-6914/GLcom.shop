
import React from 'react';
import type { Product, Offer } from '../types';
import AmazonLogo from './icons/AmazonLogo';
import FlipkartLogo from './icons/FlipkartLogo';
import BellIcon from './icons/BellIcon';

interface ProductCardProps {
  product: Product;
  onSummarize: (productName: string) => void;
  onSetAlert: (product: Product) => void;
}

const getBestOffer = (offers: Offer[]): Offer | null => {
  if (!offers || offers.length === 0) return null;
  return offers.reduce((best, current) => {
    const bestPrice = parseFloat(best.price.replace(/[^0-9.]+/g, ''));
    const currentPrice = parseFloat(current.price.replace(/[^0-9.]+/g, ''));
    return currentPrice < bestPrice ? current : best;
  });
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onSummarize, onSetAlert }) => {
  const bestOffer = getBestOffer(product.offers);

  const SourceLogo = ({ source }: { source: string }) => {
    switch (source) {
      case 'Amazon':
        return <AmazonLogo className="h-6 w-auto" />;
      case 'Flipkart':
        return <FlipkartLogo className="h-6 w-6" />;
      default:
        return <span className="text-sm font-semibold">{source}</span>;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm flex flex-col">
      <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-100 mb-1 leading-tight">{product.name}</h3>
          {bestOffer && (
            <div className="flex-shrink-0 ml-4">
              <SourceLogo source={bestOffer.source} />
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-4 h-10 overflow-hidden">{product.description}</p>
        
        <div className="mt-auto">
          <div className="mb-4">
             {bestOffer ? (
                <p className="text-2xl font-light text-cyan-400">{bestOffer.price}</p>
              ) : (
                <p className="text-slate-500">No offers available</p>
              )}
          </div>
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => onSummarize(product.name)}
              className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors duration-200 flex-grow text-center"
            >
              Review Summary
            </button>
             <button
              onClick={() => onSetAlert(product)}
              className="bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-lg hover:bg-blue-500/20 hover:text-blue-200 transition-colors duration-200"
              title="Set price drop alert"
            >
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
