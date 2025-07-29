
import type { Language, KnowledgeBase } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
];

export const DEFAULT_KB_CONTENT = `- "WebApp" should be translated as "Aplicación Web".
- "Frontend" should be translated as "Interfaz de Usuario".
- "Backend" should be translated as "Servidor".
- "API Key" should be translated as "Clave de API".
- "Knowledge Base" should be translated as "Base de Conocimiento".`;


export const DEFAULT_KNOWLEDGE_BASE: KnowledgeBase = {
    id: 'default',
    name: 'Default',
    content: DEFAULT_KB_CONTENT,
};