
import React from 'react';
import type { Product } from '../types';
import AmazonLogo from './icons/AmazonLogo';
import FlipkartLogo from './icons/FlipkartLogo';

interface ProductCardProps {
  product: Product;
  onSummarize: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSummarize }) => {
  const SourceLogo = () => {
    switch (product.source) {
      case 'Amazon':
        return <AmazonLogo className="h-6 w-auto" />;
      case 'Flipkart':
        return <FlipkartLogo className="h-6 w-6" />;
      default:
        return <span className="text-sm font-semibold">{product.source}</span>;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm">
      <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-100 mb-1 leading-tight">{product.name}</h3>
          <div className="flex-shrink-0 ml-4">
            <SourceLogo />
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-4 h-10 overflow-hidden">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-light text-cyan-400">{product.price}</p>
          <button
            onClick={() => onSummarize(product.name)}
            className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors duration-200"
          >
            Review Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
