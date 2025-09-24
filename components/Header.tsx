import React from 'react';
import { LogoIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <LogoIcon className="w-10 h-10 text-emerald-500 mr-3" />
        <h1 className="text-4xl font-bold text-white tracking-tighter">
          <span className="text-emerald-500">CNN</span> Image Compressor
        </h1>
      </div>
      <p className="text-center text-gray-400 mt-2">
        Leveraging Convolutional Neural Networks for advanced medical image compression.
      </p>
    </header>
  );
};

export default Header;