export const Languages = ['en', 'de', 'fr', 'ja', 'cn', 'ko'] as const;

export type Lang = typeof Languages[number];

export type NonEnLang = Exclude<Lang, 'en'>;

export const isLang = (lang?: string): lang is Lang => Languages.includes(lang as Lang);
