import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import Spinner from './components/Spinner';
import HistoryDisplay from './components/HistoryDisplay';
import CompressionControls from './components/CompressionControls';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { simulateCompression, simulateDecompression } from './services/compressionService';
import { getAiQualitySuggestion } from './services/analysisService';
import { CompressionResult, HistoryEntry, DecompressionResult } from './types';

type View = 'login' | 'register' | 'app';
interface User {
  email: string;
  name: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse current user from localStorage", e);
        return null;
      }
    }
    return null;
  });
  const [view, setView] = useState<View>(currentUser ? 'app' : 'login');
  
  const [originalImage, setOriginalImage] = useState<{ url: string; file: File } | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [decompressionResult, setDecompressionResult] = useState<DecompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDecompressing, setIsDecompressing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestionMessage, setAiSuggestionMessage] = useState<string | null>(null);

  const getHistoryStorageKey = useCallback(() => {
    return currentUser ? `compressionHistory_${currentUser.email}` : null;
  }, [currentUser]);

  // Load history from localStorage on user change
  useEffect(() => {
    const key = getHistoryStorageKey();
    if (!key) {
      setHistory([]);
      return;
    };
    try {
      const savedHistory = localStorage.getItem(key);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      setHistory([]); // Reset to empty array on error
    }
  }, [currentUser, getHistoryStorageKey]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    const key = getHistoryStorageKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(history));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
    }
  }, [history, getHistoryStorageKey]);
  
  const resetState = () => {
    setOriginalImage(null);
    setCompressionResult(null);
    setDecompressionResult(null);
    setIsLoading(false);
    setIsDecompressing(false);
    setQuality(80);
    setError(null);
    setAiSuggestionMessage(null);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setView('login');
    resetState();
  };

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setView('app');
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

  const handleDecompress = async (entry: HistoryEntry) => {
    handleHistorySelect(entry); // Load the selected state
    setIsDecompressing(true);
    setError(null);
    try {
      const result = await simulateDecompression(entry);
      setDecompressionResult(result);
    } catch (err) {
      console.error("Decompression simulation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during decompression.";
      setError(errorMessage);
    } finally {
      setIsDecompressing(false);
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
    setDecompressionResult(null); // Clear decompression result when viewing a new item
    setError(null);
    setAiSuggestionMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const renderActionArea = () => {
    if (isLoading || isDecompressing) {
      return (
        <div className="flex flex-col items-center gap-4 text-gray-300 text-center">
          <Spinner />
          {isLoading ? (
            <>
              <p>Compressing image with quality level {quality}...</p>
              <p className="text-sm text-gray-500">Simulating advanced CNN-based compression algorithm.</p>
            </>
          ) : (
            <>
              <p>Decompressing image...</p>
              <p className="text-sm text-gray-500">Simulating image reconstruction process.</p>
            </>
          )}
        </div>
      );
    }

    if (compressionResult) {
      return (
        <button
          onClick={resetState}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Process Another Image
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
        disabled={isLoading || isSuggesting || isDecompressing}
      />
    );
  };
  
  const ErrorDisplay: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="w-full max-w-4xl mx-auto p-4 mb-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg flex justify-between items-center">
      <span>{message}</span>
      <button onClick={onDismiss} className="text-red-200 hover:text-white font-bold">&times;</button>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setView('register')} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={() => setView('login')} onNavigateToLogin={() => setView('login')} />;
      case 'app':
      default:
        return (
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
                    decompressedImage={decompressionResult?.decompressedImageUrl || null}
                  />
                  
                  <div className="w-full flex justify-center items-center min-h-[160px]">
                    {renderActionArea()}
                  </div>
                </>
              )}

              <HistoryDisplay 
                history={history} 
                onSelect={handleHistorySelect} 
                onClear={handleClearHistory}
                onDecompress={handleDecompress}
              />
            </div>
          </main>
        );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header user={currentUser?.name || null} onLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default App;
