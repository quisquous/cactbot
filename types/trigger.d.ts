import { Lang } from './global';

export type Matches<T> =
  T extends (params?: infer R) => RegExp ?
  { [s in Exclude<keyof R, 'capture'>]: string } :
  { [s: string]: string };


type TranslatableText = {
  [s in Lang]: string;
};


type TranslatedText = {
  en: string;
  de: string;
  fr: string;
  ja: string;
  cn: string;
  ko: string;
};
