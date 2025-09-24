
import { CompressionResult, CompressionMetrics, HistoryEntry, DecompressionResult } from '../types';

// Utility to read a file as a Data URL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Mock service to simulate CNN compression
export const simulateCompression = async (file: File, quality: number): Promise<CompressionResult> => {
  const startTime = performance.now();
  
  // 1. Read the image file to get a URL for display
  const originalImageUrl = await readFileAsDataURL(file);

  // 2. Simulate network and processing delay (2-4 seconds)
  const delay = Math.random() * 2000 + 2000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 3. Generate fake compression metrics based on quality (1-100)
  const originalSize = file.size;
  
  // Map quality [1, 100] to compression ratio [~50:1, ~5:1]
  // Lower quality -> higher ratio
  const maxRatio = 50;
  const minRatio = 5;
  const baseRatio = maxRatio - ((quality - 1) / 99) * (maxRatio - minRatio);
  const compressionRatio = Math.max(minRatio, baseRatio + (Math.random() - 0.5) * (baseRatio * 0.1)); // Add 10% jitter

  const compressedSize = originalSize / compressionRatio;
  
  // Map quality [1, 100] to SSIM [~0.85, ~0.995]
  // Higher quality -> higher SSIM
  const minSsim = 0.85;
  const maxSsim = 0.995;
  const baseSsim = minSsim + ((quality - 1) / 99) * (maxSsim - minSsim);
  const ssim = Math.min(1.0, baseSsim + (Math.random() - 0.5) * 0.01); // Add jitter, cap at 1.0

  // Map quality [1, 100] to PSNR [~30, ~50]
  // Higher quality -> higher PSNR
  const minPsnr = 30;
  const maxPsnr = 50;
  const basePsnr = minPsnr + ((quality - 1) / 99) * (maxPsnr - minPsnr);
  const psnr = basePsnr + (Math.random() - 0.5) * 2; // Add jitter

  const endTime = performance.now();
  const processingTime = (endTime - startTime) / 1000;

  const metrics: CompressionMetrics = {
    originalSize,
    compressedSize,
    compressionRatio,
    ssim,
    psnr,
    processingTime,
  };

  // 4. Return the result. For this simulation, we'll use the original image URL
  // as the "compressed" one. In a real app, this would be a new URL from the backend.
  return {
    compressedImageUrl: originalImageUrl,
    metrics,
  };
};

// Mock service to simulate CNN decompression
export const simulateDecompression = async (entry: HistoryEntry): Promise<DecompressionResult> => {
  const startTime = performance.now();

  // 1. Simulate network and processing delay (1-3 seconds)
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const endTime = performance.now();
  const processingTime = (endTime - startTime) / 1000;

  // 2. In this simulation, decompression perfectly restores the original image.
  return {
    decompressedImageUrl: entry.originalImage.url,
    metrics: {
      processingTime,
    },
  };
};
