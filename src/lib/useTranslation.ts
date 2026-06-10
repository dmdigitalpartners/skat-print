import en from '@/translations/en.json'
import bg from '@/translations/bg.json'

export type Lang = 'en' | 'bg'
export type Translation = typeof en

const translations: Record<Lang, Translation> = { en, bg }

export function getTranslation(lang: string): Translation {
  const key = lang === 'bg' ? 'bg' : 'en'
  return translations[key]
}
