import { Lang } from './global';

export interface BaseRegExp<T> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Matches<T> =
  T extends BaseRegExp ? T['groups'] :
  T extends RegExp ? { [s: string]: string } :
  unknown;


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
