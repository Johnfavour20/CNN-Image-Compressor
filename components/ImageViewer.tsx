
import React from 'react';
import { DownloadIcon } from './icons/Icons';

interface ImageViewerProps {
  originalImage: { url: string; file: File };
  compressedImage: string | null;
  decompressedImage: string | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ originalImage, compressedImage, decompressedImage }) => {
  const handleDownload = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    // Create a new filename for the compressed image
    const originalName = originalImage.file.name;
    const nameParts = originalName.split('.');
    const extension = nameParts.pop();
    const newName = `${nameParts.join('.')}_compressed.${extension}`;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const ImageCard: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode; showPlaceholder?: boolean }> = ({ title, imageUrl, children, showPlaceholder = false }) => (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-200 mb-3">{title}</h3>
      <div className="w-full aspect-square bg-gray-800/50 rounded-lg overflow-hidden border-2 border-gray-700 flex items-center justify-center relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
        ) : showPlaceholder ? (
           <div className="text-gray-500 text-center p-4">Awaiting process...</div>
        ) : null}
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      <ImageCard title="Original Image" imageUrl={originalImage.url} />
      
      <ImageCard title="Compressed Image" imageUrl={compressedImage}>
        {compressedImage && (
            <button 
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105 shadow-lg"
            >
              <DownloadIcon className="w-5 h-5" />
              Download
            </button>
        )}
      </ImageCard>
      
      <ImageCard title="Decompressed Image" imageUrl={decompressedImage} showPlaceholder={!!compressedImage} />
    </div>
  );
};

export default ImageViewer;
