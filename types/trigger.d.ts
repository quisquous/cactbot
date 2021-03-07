import { NotEnLang } from './global';

export type Matches = {
  target?: string;
  [s: string]: string;
}


export type TranslatableText = {
  en: string;
  [s in NotEnLang]?: string;
};

export type TranslatableObject<T> = {
  en: T;
  [s in NotEnLang]?: T;
};
