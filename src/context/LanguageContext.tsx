import React, { createContext, useContext, useState } from 'react'
import { Language, translations } from '../i18n/translations'

// Tipe fleksibel — tidak pakai literal types dari `as const`
export type TranslationsShape = {
  brand: Record<string, string>
  export: Record<string, string>
  form: Record<string, string>
  invoice: Record<string, string>
}

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: TranslationsShape
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations['en'] as TranslationsShape,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  const setLang = (l: Language) => {
    setLangState(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as TranslationsShape }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}