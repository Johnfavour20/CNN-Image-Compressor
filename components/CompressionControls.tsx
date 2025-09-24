import React, { useState } from 'react';
import { SparklesIcon } from './icons/Icons';

interface CompressionControlsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  onCompress: () => void;
  onGetAiSuggestion: () => void;
  isSuggesting: boolean;
  suggestionMessage: string | null;
  disabled: boolean;
}

const CompressionControls: React.FC<CompressionControlsProps> = ({ 
  quality, 
  onQualityChange, 
  onCompress, 
  onGetAiSuggestion,
  isSuggesting,
  suggestionMessage,
  disabled 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompressClick = () => {
    if (disabled || isSubmitting) return;
    setIsSubmitting(true);
    // Add a small delay so the user can see the feedback before the main spinner appears
    setTimeout(() => {
      onCompress();
    }, 400); 
  };
  
  // The component is disabled if the parent says so, or if it's in its internal submitting state.
  const isDisabled = disabled || isSubmitting;

  return (
    <div className={`w-full max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-lg border border-gray-700 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="quality-slider" className="text-lg font-semibold text-gray-200">
              Compression Quality
            </label>
            <button
              onClick={onGetAiSuggestion}
              disabled={isDisabled}
              className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-emerald-400 font-semibold px-3 py-1 rounded-full transition-colors"
            >
              {isSuggesting ? (
                 <>
                  <svg className="animate-spin h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                   Getting Suggestion...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Get AI Suggestion
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-3">Higher quality results in a larger file size but better visual fidelity.</p>
           <div className="relative">
             <input
              id="quality-slider"
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => onQualityChange(parseInt(e.target.value, 10))}
              disabled={isDisabled}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-emerald-400 [&::-webkit-slider-thumb]:active:scale-110"
              aria-label="Compression quality slider"
            />
             <span 
              className="absolute -top-7 right-0 px-3 py-1 text-sm font-bold text-emerald-300 bg-emerald-900/50 rounded-full tabular-nums"
              aria-live="polite"
            >
              {quality}
            </span>
          </div>
          {suggestionMessage && <p className="text-sm text-emerald-400 text-center mt-3">{suggestionMessage}</p>}
        </div>
        <button
          onClick={handleCompressClick}
          disabled={isDisabled}
          className={`w-full text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform shadow-lg mt-2
            ${isSubmitting 
              ? 'bg-emerald-800 scale-100 cursor-wait' 
              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-100 disabled:bg-gray-600 disabled:cursor-not-allowed hover:scale-105'
            }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing...
            </>
          ) : (
            'Compress Image'
          )}
        </button>
      </div>
    </div>
  );
};

export default CompressionControls;