import { Lang, Option } from './global';
import { TranslatableText } from './trigger';

export type Trig = {
  id: string;
  beforeSeconds?: number | ((data: Data) => number);
  overriddenByFile: string;
  isMissingId: true;
  output: unknown;
  outputStrings: Record<string, string>;
  isTimelineTrigger: string;
  timelineRegex?: RegExp;
  triggerRegex?: RegExp;
  triggerNetRegex?: RegExp;
}

export interface Configurator {
  lang: Lang;
  developerOptions: boolean;
  configOptions: Option;

  getOption: <T>(...path: [...string, T]) => T;
  setOption: <T>(...path: [...string, T]) => void;
  translate: (textObj: string | TranslatableText | null) => string;
  processFiles: (files, triggers) => Record<string, {
    triggerSet: {
      filename: string;
      triggers: Trig[];
      timelineTriggers: Trig[];
    };
    triggers: Record<string, Trig>;
  }>;
}
