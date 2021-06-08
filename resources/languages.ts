export const languages = ['en', 'de', 'fr', 'ja', 'cn', 'ko'] as const;

export type Lang = typeof languages[number];

export type NonEnLang = Exclude<Lang, 'en'>;

export const isLang = (lang?: string): lang is Lang => {
  const langStrs: readonly string[] = languages;
  if (!lang)
    return false;
  return langStrs.includes(lang);
};
