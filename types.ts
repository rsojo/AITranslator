export interface KnowledgeBase {
  id: string;
  name: string;
  content: string;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt';

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded
}

export interface TranslatedFile {
  filename: string;
  blob: Blob;
}