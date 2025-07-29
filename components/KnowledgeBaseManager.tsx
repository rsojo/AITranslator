
import React, { useCallback, useRef } from 'react';
import { PlusIcon } from './icons';
import type { KnowledgeBase, UploadedFile } from '../types';
import { DEFAULT_KNOWLEDGE_BASE } from '../constants';

interface KnowledgeBaseManagerProps {
  knowledgeBases: KnowledgeBase[];
  selectedKbId: string;
  onKbChange: (id: string) => void;
  onKbContentChange: (content: string) => void;
  onGenerateKb: (file: UploadedFile) => void;
  isGeneratingKb: boolean;
}

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  knowledgeBases,
  selectedKbId,
  onKbChange,
  onKbContentChange,
  onGenerateKb,
  isGeneratingKb
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedKb = knowledgeBases.find(kb => kb.id === selectedKbId) || null;

  const processFile = useCallback((file: File | null) => {
    if (!file) return;

    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onGenerateKb({
          name: file.name,
          mimeType: file.type,
          data: base64String,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Unsupported file type for knowledge base generation. Please use PDF, DOCX, TXT or an image file.');
    }
  }, [onGenerateKb]);
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file || null);
    if(event.target) event.target.value = ''; // Reset file input
  }, [processFile]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isReadOnly = selectedKb?.id === DEFAULT_KNOWLEDGE_BASE.id;

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Knowledge Base</h3>
        <button
          onClick={triggerFileInput}
          disabled={isGeneratingKb}
          className="flex items-center space-x-2 text-sm bg-indigo-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Add new knowledge base from file"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add from file</span>
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,image/jpeg,image/png,image/webp,image/gif,text/plain,.docx,.doc"
            className="hidden"
        />
      </div>
      
      <div className="flex space-x-2">
        <select
          value={selectedKbId}
          onChange={(e) => onKbChange(e.target.value)}
          disabled={isGeneratingKb}
          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          aria-label="Select a knowledge base"
        >
          {knowledgeBases.map((kb) => (
            <option key={kb.id} value={kb.id} title={kb.name} className="truncate">
              {kb.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="relative">
          <textarea
            value={selectedKb?.content || ''}
            onChange={(e) => onKbContentChange(e.target.value)}
            readOnly={isReadOnly}
            placeholder={isReadOnly ? "This is the default, read-only knowledge base." : "Add or edit term definitions here. Example: - 'Term' should be translated as 'Translation'"}
            className="w-full h-32 p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50 read-only:bg-gray-800/50 read-only:text-gray-400"
            disabled={isGeneratingKb}
            aria-label="Knowledge base content"
          />
           {isGeneratingKb && (
                <div className="absolute inset-0 bg-gray-900/80 rounded-md flex items-center justify-center">
                    <div className="text-center">
                         <div className="w-6 h-6 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin mx-auto"></div>
                         <p className="mt-2 text-sm text-gray-300">Generating from file...</p>
                    </div>
                </div>
           )}
      </div>

    </div>
  );
};