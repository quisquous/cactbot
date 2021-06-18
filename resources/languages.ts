export const languages = ['en', 'de', 'fr', 'ja', 'cn', 'ko'] as const;

export type Lang = typeof languages[number];

export type NonEnLang = Exclude<Lang, 'en'>;

export const langMap: { [lang in Lang]: { [lang in Lang]: string } } = {
  en: {
    en: 'English',
    de: 'German',
    fr: 'French',
    ja: 'Japanese',
    cn: 'Chinese',
    ko: 'Korean',
  },
  de: {
    en: 'Englisch',
    de: 'Deutsch',
    fr: 'Französisch',
    ja: 'Japanisch',
    cn: 'Chinesisch',
    ko: 'Koreanisch',
  },
  fr: {
    en: 'Anglais',
    de: 'Allemand',
    fr: 'Français',
    ja: 'Japonais',
    cn: 'Chinois',
    ko: 'Coréen',
  },
  ja: {
    en: '英語',
    de: 'ドイツ語',
    fr: 'フランス語',
    ja: '日本語',
    cn: '中国語',
    ko: '韓国語',
  },
  cn: {
    en: '英语',
    de: '德语',
    fr: '法语',
    ja: '日语',
    cn: '中文',
    ko: '韩语',
  },
  ko: {
    en: '영어',
    de: '독일어',
    fr: '프랑스어',
    ja: '일본어',
    cn: '중국어',
    ko: '한국어',
  },
} as const;

export const isLang = (lang?: string): lang is Lang => {
  const langStrs: readonly string[] = languages;
  if (!lang)
    return false;
  return langStrs.includes(lang);
};
