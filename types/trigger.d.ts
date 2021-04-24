import { Lang, NonEnLang } from './global';

export interface BaseRegExp<T> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Matches<T> =
  T extends BaseRegExp ? T['groups'] :
  T extends RegExp ? { [s: string]: string } :
  never;

export type FullLocaleText = Record<Lang, string>;

export type LocaleObject<T> = {
  en: T;
} & {
  [s in NonEnLang]?: T;
};

export type LocaleText = LocaleObject<string>;
