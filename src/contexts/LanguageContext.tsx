import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

const translations: Translations = {
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  profile: { en: 'Profile', bn: 'প্রোফাইল' },
  aiAssistant: { en: 'AI Assistant', bn: 'এআই সহকারী' },
  decisionEngine: { en: 'Decision Engine', bn: 'সিদ্ধান্ত ইঞ্জিন' },
  documentAnalyzer: { en: 'Document Analyzer', bn: 'ডকুমেন্ট বিশ্লেষক' },
  reportAnalyzer: { en: 'Report Analyzer', bn: 'রিপোর্ট বিশ্লেষক' },
  learningPlanner: { en: 'Learning Planner', bn: 'শিক্ষা পরিকল্পনাকারী' },
  knowledgeHub: { en: 'Knowledge Hub', bn: 'জ্ঞান কেন্দ্র' },
  cvBuilder: { en: 'CV Builder', bn: 'সিভি বিল্ডার' },
  settings: { en: 'Settings', bn: 'সেটিংস' },
  search: { en: 'Search...', bn: 'অনুসন্ধান...' },
  welcome: { en: 'Welcome back', bn: 'স্বাগতম' },
  quickActions: { en: 'Quick Actions', bn: 'দ্রুত ক্রিয়া' },
  recentActivity: { en: 'Recent Activity', bn: 'সাম্প্রতিক কার্যকলাপ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language;
      return stored || 'en';
    }
    return 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
