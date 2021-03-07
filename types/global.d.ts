export type Lang = 'en' | 'de' | 'fr' | 'ja' | 'cn' | 'ko';

export type NonEnLang = Exclude<Lang, 'en'>;

export type Nullable<T> = T | null;
