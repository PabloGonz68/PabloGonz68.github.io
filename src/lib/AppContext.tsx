import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { translations, type Lang, type Translations } from './i18n'

// ── Theme ─────────────────────────────────────────────────────
type Theme = 'dark' | 'light'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType>({
  lang: 'es',
  setLang: () => {},
  t: translations.es,
  theme: 'dark',
  toggleTheme: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')
  const [theme, setTheme] = useState<Theme>('dark')

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light-mode')
    } else {
      root.classList.remove('light-mode')
    }
  }, [theme])

  // Persist preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio-lang') as Lang | null
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) setLang(savedLang)
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) setTheme(savedTheme)
  }, [])

  const handleSetLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('portfolio-lang', l)
  }

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('portfolio-theme', next)
  }

  return (
    <AppContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang], theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
