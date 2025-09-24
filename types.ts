// types.ts

export interface CompressionMetrics {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  ssim: number; // Structural Similarity Index
  psnr: number; // Peak Signal-to-Noise Ratio
  processingTime: number; // in seconds
}

export interface CompressionResult {
  compressedImageUrl: string;
  metrics: CompressionMetrics;
}

export interface DecompressionResult {
  decompressedImageUrl: string;
  metrics: {
    processingTime: number; // in seconds
  };
}

export interface HistoryEntry extends CompressionResult {
  id: string;
  originalImage: {
    name: string;
    url: string;
  };
  timestamp: string;
}
