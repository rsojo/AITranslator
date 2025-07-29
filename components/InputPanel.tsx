import React, { useState, useCallback, useRef } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { KnowledgeBaseManager } from './KnowledgeBaseManager';
import { SwapIcon, UploadIcon, DocumentIcon } from './icons';
import type { LanguageCode, UploadedFile, KnowledgeBase } from '../types';

interface InputPanelProps {
  sourceLang: LanguageCode;
  setSourceLang: (lang: LanguageCode) => void;
  targetLang: LanguageCode;
  setTargetLang: (lang: LanguageCode) => void;
  onSwapLanguages: () => void;
  onTranslate: (file: UploadedFile | null) => void;
  isLoading: boolean;
  isGeneratingKb: boolean;
  knowledgeBases: KnowledgeBase[];
  selectedKbId: string;
  onKbChange: (id: string) => void;
  onKbContentChange: (content: string) => void;
  onGenerateKb: (file: UploadedFile) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  onSwapLanguages,
  onTranslate,
  isLoading,
  isGeneratingKb,
  knowledgeBases,
  selectedKbId,
  onKbChange,
  onKbContentChange,
  onGenerateKb,
}) => {
  const [inputFile, setInputFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File | null) => {
    if (!file) return;
    
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setInputFile({
          name: file.name,
          mimeType: file.type,
          data: base64String,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Unsupported file type. Please upload a PDF or an image file (JPEG, PNG, WEBP, GIF).');
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file || null);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file || null);
    e.dataTransfer.clearData();
  }, [processFile]);

  const handleTranslateClick = () => {
    onTranslate(inputFile);
  };
  
  const handleClearInput = () => {
      setInputFile(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col space-y-6 shadow-2xl h-full">
      <div className="flex items-center justify-between space-x-2">
        <LanguageSelector selectedLang={sourceLang} onLangChange={setSourceLang} />
        <button
          onClick={onSwapLanguages}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Swap languages"
        >
          <SwapIcon className="w-6 h-6 text-gray-400" />
        </button>
        <LanguageSelector selectedLang={targetLang} onLangChange={setTargetLang} />
      </div>

      <div 
        className="relative flex-grow flex flex-col bg-gray-900 rounded-lg border border-gray-700"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf,image/jpeg,image/png,image/webp,image/gif" className="hidden"/>
        
        {inputFile ? (
            <div className="flex-grow flex flex-col items-center justify-center p-4">
                {inputFile.mimeType.startsWith('image/') ? (
                    <img src={`data:${inputFile.mimeType};base64,${inputFile.data}`} alt="Uploaded content" className="max-h-64 w-auto object-contain rounded-lg shadow-lg"/>
                ) : (
                    <div className="text-center text-gray-400">
                        <DocumentIcon className="w-24 h-24 mx-auto" />
                        <p className="font-semibold mt-4 text-gray-300">Document Ready</p>
                    </div>
                )}
                <p className="mt-4 text-sm text-gray-400 truncate max-w-full px-4" title={inputFile.name}>{inputFile.name}</p>
                 <button onClick={handleClearInput} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">Clear File</button>
            </div>
        ) : (
            <div 
              className={`flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-gray-800' : 'border-gray-600 hover:bg-gray-800 hover:border-indigo-500'}`}
              onClick={triggerFileInput}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileInput()}
            >
              <UploadIcon className="w-16 h-16 text-gray-500 mb-4"/>
              <p className="text-gray-400 font-semibold">Drag & drop a file here</p>
              <p className="text-indigo-400 font-medium mt-1">or click to upload</p>
              <p className="text-sm text-gray-500 mt-2">PDF or Images (JPG, PNG, WEBP)</p>
            </div>
        )}
        
        {isDragging && (
            <div className="absolute inset-0 bg-indigo-600/30 backdrop-blur-sm rounded-lg border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center pointer-events-none z-10">
                <UploadIcon className="w-20 h-20 text-white/80 animate-bounce" />
                <p className="text-white font-bold text-lg mt-4">
                    {inputFile ? 'Drop to replace the file' : 'Drop the file to upload'}
                </p>
            </div>
        )}
      </div>
      
      <KnowledgeBaseManager
        knowledgeBases={knowledgeBases}
        selectedKbId={selectedKbId}
        onKbChange={onKbChange}
        onKbContentChange={onKbContentChange}
        onGenerateKb={onGenerateKb}
        isGeneratingKb={isGeneratingKb}
      />

      <button
        onClick={handleTranslateClick}
        disabled={isLoading || isGeneratingKb || !inputFile}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
           <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : isGeneratingKb ? (
           'Processing Knowledge Base...'
        ) : (
          'Translate Document'
        )}
      </button>
    </div>
  );
};