import React from 'react';
import type { TranslatedFile } from '../types';
import { DocumentIcon, DownloadIcon } from './icons';

interface OutputPanelProps {
  translatedFile: TranslatedFile | null;
  isLoading: boolean;
  error: string | null;
  isGeneratingKb: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ translatedFile, isLoading, error, isGeneratingKb }) => {
  const handleDownload = () => {
    if (!translatedFile) return;

    const url = URL.createObjectURL(translatedFile.blob);
    const a = document.createElement('a');
a.href = url;
    a.download = translatedFile.filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };
  
  const showLoader = isLoading || isGeneratingKb;
  const loaderText = isGeneratingKb ? 'Generating Knowledge Base...' : 'Translating...';

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col shadow-2xl h-full">
      <h2 className="text-lg font-semibold text-white mb-4">Translated Document</h2>
      <div className="relative flex-grow bg-gray-900 rounded-lg border border-gray-700 p-4 flex items-center justify-center">
        {showLoader && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-gray-300">{loaderText}</p>
            </div>
          </div>
        )}

        {error && !showLoader && (
          <div className="text-red-400 text-center">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {!error && !showLoader && translatedFile && (
          <div className="text-center text-gray-300">
            <DocumentIcon className="w-24 h-24 mx-auto text-indigo-400" />
            <p className="font-semibold mt-4 text-white">Translation Complete</p>
            <p className="mt-1 text-sm text-gray-400 truncate max-w-full px-4" title={translatedFile.filename}>
              {translatedFile.filename}
            </p>
            <button
                onClick={handleDownload}
                className="mt-6 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center mx-auto"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Document
            </button>
          </div>
        )}
        
        {!error && !showLoader && !translatedFile && (
           <span className="text-gray-500">Your translated document will be available for download here.</span>
        )}
      </div>
    </div>
  );
};