import React from 'react';
import { LogoIcon } from './icons/Icons';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <LogoIcon className="w-10 h-10 text-emerald-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
            <span className="text-emerald-500">CNN</span> Image Compressor
          </h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">Welcome, <span className="font-semibold text-gray-200">{user}</span></span>
            <button
              onClick={onLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
       {!user && (
         <p className="text-center text-gray-400 mt-2 text-sm md:text-base">
          Leveraging Convolutional Neural Networks for advanced medical image compression.
        </p>
       )}
    </header>
  );
};

export default Header;