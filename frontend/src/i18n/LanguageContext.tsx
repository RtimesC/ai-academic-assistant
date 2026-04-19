import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  t: TranslationKeys;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('app-language') as Language | null;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = translations[language];

  // Avoid rendering until localStorage is checked to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
