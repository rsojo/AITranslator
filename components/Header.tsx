
import React from 'react';
import { TranslateIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <TranslateIcon className="h-8 w-8 text-indigo-400" />
          <div>
            <h1 className="text-xl font-bold text-white">AI Document Translator</h1>
            <p className="text-sm text-gray-400">Context-Aware Translations</p>
          </div>
        </div>
      </div>
    </header>
  );
};
