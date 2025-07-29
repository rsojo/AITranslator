
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import type { LanguageCode } from '../types';

interface LanguageSelectorProps {
  selectedLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLang, onLangChange }) => {
  return (
    <div className="flex-1">
      <select
        value={selectedLang}
        onChange={(e) => onLangChange(e.target.value as LanguageCode)}
        className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
