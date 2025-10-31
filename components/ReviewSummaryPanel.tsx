
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface ReviewSummaryPanelProps {
  productName: string | null;
  summary: string | null;
  isLoading: boolean;
}

const ReviewSummaryPanel: React.FC<ReviewSummaryPanelProps> = ({ productName, summary, isLoading }) => {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-blue-400" />
        External Review Summary
      </h2>
      {productName && <p className="text-sm text-slate-400 mb-6 border-b border-slate-800 pb-4">For: {productName}</p>}
      
      <div className="flex-grow overflow-y-auto pr-2">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 w-full">
              <p className="text-center text-blue-300">Generating summary...</p>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                <div className="h-4 bg-slate-700 rounded w-1/4 mt-4"></div>
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-800 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        )}
        {!isLoading && !summary && (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-center">Select a product to see its review summary.</p>
          </div>
        )}
        {!isLoading && summary && (
          <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/Pros:/g, '<strong class="text-green-400">Pros:</strong>').replace(/Cons:/g, '<strong class="text-red-400">Cons:</strong>') }} />
        )}
      </div>
    </div>
  );
};

export default ReviewSummaryPanel;
