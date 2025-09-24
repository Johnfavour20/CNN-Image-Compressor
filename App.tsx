import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import Spinner from './components/Spinner';
import HistoryDisplay from './components/HistoryDisplay';
import CompressionControls from './components/CompressionControls';
import { simulateCompression } from './services/compressionService';
import { getAiQualitySuggestion } from './services/analysisService';
import { CompressionResult, HistoryEntry } from './types';

const HISTORY_STORAGE_KEY = 'compressionHistory';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ url: string; file: File } | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestionMessage, setAiSuggestionMessage] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      setHistory([]); // Reset to empty array on error
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);
  
  const resetState = () => {
    setOriginalImage(null);
    setCompressionResult(null);
    setIsLoading(false);
    setQuality(80);
    setError(null);
    setAiSuggestionMessage(null);
  };

  const handleImageSelect = useCallback((file: File) => {
    resetState(); // Reset everything for a new image
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage({ url: imageUrl, file });
  }, []);

  const handleCompress = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await simulateCompression(originalImage.file, quality);
      setCompressionResult(result);
      
      const newHistoryEntry: HistoryEntry = {
        id: new Date().toISOString() + originalImage.file.name,
        ...result,
        originalImage: {
          name: originalImage.file.name,
          url: originalImage.url,
        },
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newHistoryEntry, ...prev]);

    } catch (err) {
      console.error("Compression simulation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during compression.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetAiSuggestion = async () => {
    if (!originalImage) return;

    setIsSuggesting(true);
    setError(null);
    setAiSuggestionMessage(null);
    try {
      const suggestedQuality = await getAiQualitySuggestion(originalImage.file);
      setQuality(suggestedQuality);
      setAiSuggestionMessage(`AI Suggestion: ${suggestedQuality}`);
    } catch (err) {
      console.error("AI suggestion failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while getting AI suggestion.";
      setError(errorMessage);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    // Note: file object is not fully restored, which is acceptable for this simulation
    setOriginalImage({ url: entry.originalImage.url, file: new File([], entry.originalImage.name) }); 
    setCompressionResult({ compressedImageUrl: entry.compressedImageUrl, metrics: entry.metrics });
    setError(null);
    setAiSuggestionMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const renderActionArea = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-4 text-gray-300 text-center">
          <Spinner />
          <p>Compressing image with quality level {quality}...</p>
          <p className="text-sm text-gray-500">Simulating advanced CNN-based compression algorithm.</p>
        </div>
      );
    }

    if (compressionResult) {
      return (
        <button
          onClick={resetState}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Compress Another Image
        </button>
      );
    }

    return (
      <CompressionControls
        quality={quality}
        onQualityChange={(q) => {
          setQuality(q);
          setAiSuggestionMessage(null); // Clear suggestion message on manual change
        }}
        onCompress={handleCompress}
        onGetAiSuggestion={handleGetAiSuggestion}
        isSuggesting={isSuggesting}
        suggestionMessage={aiSuggestionMessage}
        disabled={isLoading || isSuggesting}
      />
    );
  };
  
  const ErrorDisplay: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="w-full max-w-4xl mx-auto p-4 mb-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg flex justify-between items-center">
      <span>{message}</span>
      <button onClick={onDismiss} className="text-red-200 hover:text-white font-bold">&times;</button>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-12">
          
          {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}

          {!originalImage && (
            <ImageUploader onImageSelect={handleImageSelect} disabled={isLoading} />
          )}

          {originalImage && (
            <>
              <ImageViewer 
                originalImage={originalImage}
                compressedImage={compressionResult?.compressedImageUrl || null}
              />
              
              <div className="w-full flex justify-center items-center min-h-[160px]">
                {renderActionArea()}
              </div>
            </>
          )}

          <HistoryDisplay history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
        </div>
      </main>
    </div>
  );
};

export default App;