import React from 'react';
import { HistoryEntry } from '../types';
import { HistoryIcon, DownloadIcon, TrashIcon } from './icons/Icons';

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  const handleDownloadCSV = () => {
    if (history.length === 0) return;

    const headers = ['Filename', 'Timestamp', 'Compression Ratio', 'SSIM', 'PSNR (dB)'];
    
    const rows = history.map(entry => {
      // Escape commas in filename by enclosing in double quotes
      const filename = `"${entry.originalImage.name.replace(/"/g, '""')}"`;
      const timestamp = new Date(entry.timestamp).toLocaleString();
      const ratio = `${entry.metrics.compressionRatio.toFixed(2)}:1`;
      const ssim = entry.metrics.ssim.toFixed(4);
      const psnr = entry.metrics.psnr.toFixed(2);
      return [filename, timestamp, ratio, ssim, psnr].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'compression_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to clear the entire compression history? This action cannot be undone.'
    );
    if (isConfirmed) {
      onClear();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <HistoryIcon className="w-6 h-6 mr-2 text-emerald-500" />
          Compression History
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="bg-gray-700 hover:bg-gray-600 text-sm text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            Download CSV
          </button>
          <button
            onClick={handleClear}
            className="bg-red-900/50 hover:bg-red-800/60 text-sm text-red-300 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Clear History
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/60">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Filename</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">Ratio</th>
              <th scope="col" className="px-6 py-3">SSIM</th>
              <th scope="col" className="px-6 py-3">PSNR (dB)</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="bg-gray-900/30 border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {entry.originalImage.name}
                </th>
                <td className="px-6 py-4">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">{entry.metrics.compressionRatio.toFixed(2)}:1</td>
                <td className="px-6 py-4">{entry.metrics.ssim.toFixed(4)}</td>
                <td className="px-6 py-4">{entry.metrics.psnr.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelect(entry)}
                    className="font-medium text-emerald-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryDisplay;