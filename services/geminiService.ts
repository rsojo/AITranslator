
import { GoogleGenAI } from "@google/genai";
import { SUPPORTED_LANGUAGES } from "../constants";
import type { UploadedFile } from '../types';

interface TranslateParams {
  fileToTranslate: UploadedFile | null;
  sourceLang: string;
  targetLang: string;
  context: string;
}

const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code;
}

export async function generateKnowledgeBaseFromFile(file: UploadedFile): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const filePart = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.data,
        },
    };
    const promptPart = {
        text: `You are an AI assistant that specializes in creating technical glossaries from documents. Your task is to analyze the provided document and extract key terms, concepts, acronyms, or proper nouns that are important for maintaining consistent translation.
        
Format the output as a simple list where each line follows the pattern: \`- "term" should be translated as "term"\`. This creates a template that the user can later fill in.

**Instructions:**
1.  Read the document and identify up to 20 key terms.
2.  For each term, create a line: \`- "term" should be translated as "term"\`.
3.  Output ONLY the list of lines. Do not add any introduction, explanation, or closing remarks.
4.  If the document is sparse or has no clear terms, return an empty string.

**Example Output:**
- "API" should be translated as "API"
- "React" should be translated as "React"
- "Component" should be translated as "Component"
`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [filePart, promptPart] },
    });

    return response.text.trim();
}


export async function translateText({
  fileToTranslate,
  sourceLang,
  targetLang,
  context,
}: TranslateParams): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    if (!fileToTranslate) {
        throw new Error("A file must be provided for translation.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const sourceLanguageName = getLanguageName(sourceLang);
    const targetLanguageName = getLanguageName(targetLang);

    // Multimodal translation (File + Text Prompt)
    const filePart = {
        inlineData: {
            mimeType: fileToTranslate.mimeType,
            data: fileToTranslate.data,
        },
    };
    const promptPart = {
        text: `You are a professional document translator. Your task is to extract all text from the provided document and translate it from ${sourceLanguageName} to ${targetLanguageName}.
  
Adhere strictly to the provided knowledge base for contextual accuracy. If a term is present in the knowledge base, you MUST use its corresponding translation.
  
**Knowledge Base:**
${context || 'No knowledge base provided.'}
  
---
  
**Instructions:**
1. Identify all text in the document.
2. Translate the identified text from ${sourceLanguageName} to ${targetLanguageName}.
3. Output ONLY the final, translated text. Do not include any headers, explanations, or notes like "Here is the translation:".`
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [filePart, promptPart] },
    });

    return response.text;
}