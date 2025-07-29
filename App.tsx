import React, { useState, useCallback } from 'react';
import { Document, Packer, Paragraph } from 'docx';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Header } from './components/Header';
import { translateText, generateKnowledgeBaseFromFile } from './services/geminiService';
import { DEFAULT_KNOWLEDGE_BASE } from './constants';
import type { LanguageCode, UploadedFile, TranslatedFile, KnowledgeBase } from './types';

export default function App() {
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('es');
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([DEFAULT_KNOWLEDGE_BASE]);
  const [selectedKbId, setSelectedKbId] = useState<string>(DEFAULT_KNOWLEDGE_BASE.id);
  
  const [translatedFile, setTranslatedFile] = useState<TranslatedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingKb, setIsGeneratingKb] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateKb = useCallback(async (file: UploadedFile) => {
    setIsGeneratingKb(true);
    setError(null);
    setTranslatedFile(null);
    try {
      const content = await generateKnowledgeBaseFromFile(file);
      const newKb: KnowledgeBase = {
        id: `kb-${Date.now()}`,
        name: file.name,
        content: content || 'AI could not generate a knowledge base from this file. You can add terms manually.',
      };
      setKnowledgeBases(prev => [...prev, newKb]);
      setSelectedKbId(newKb.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate knowledge base.');
    } finally {
      setIsGeneratingKb(false);
    }
  }, []);

  const handleTranslate = useCallback(async (inputFile: UploadedFile | null) => {
    if (!inputFile) {
      setError('Please upload a document to translate.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedFile(null);

    const knowledgeBase = knowledgeBases.find(kb => kb.id === selectedKbId)?.content || '';

    try {
      const result = await translateText({
        fileToTranslate: inputFile,
        sourceLang,
        targetLang,
        context: knowledgeBase,
      });
      
      const originalFilename = inputFile.name.split('.').slice(0, -1).join('.') || inputFile.name;
      const newFilename = `${originalFilename}_${targetLang}_translation.docx`;

      const doc = new Document({
        sections: [{
          properties: {},
          children: result.split('\n').map(textLine => new Paragraph({ text: textLine })),
        }],
      });

      const docxBlob = await Packer.toBlob(doc);

      setTranslatedFile({
        filename: newFilename,
        blob: docxBlob,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang, knowledgeBases, selectedKbId]);
  
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };
  
  const handleKbContentChange = (newContent: string) => {
      if (selectedKbId !== DEFAULT_KNOWLEDGE_BASE.id) {
          setKnowledgeBases(prevKbs => prevKbs.map(kb => 
              kb.id === selectedKbId ? { ...kb, content: newContent } : kb
          ));
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <InputPanel
            sourceLang={sourceLang}
            setSourceLang={setSourceLang}
            targetLang={targetLang}
            setTargetLang={setTargetLang}
            onSwapLanguages={handleSwapLanguages}
            onTranslate={handleTranslate}
            isLoading={isLoading}
            isGeneratingKb={isGeneratingKb}
            knowledgeBases={knowledgeBases}
            selectedKbId={selectedKbId}
            onKbChange={setSelectedKbId}
            onKbContentChange={handleKbContentChange}
            onGenerateKb={handleGenerateKb}
          />
          <OutputPanel
            translatedFile={translatedFile}
            isLoading={isLoading}
            error={error}
            isGeneratingKb={isGeneratingKb}
          />
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini. For demonstration purposes only.</p>
      </footer>
    </div>
  );
}