import { Lang } from '../../resources/languages';
import { MissingTranslationErrorType } from '../find_missing_translations';

export type CoverageEntry = {
  triggers: {
    num: number;
  };
  timeline: {
    hasFile?: boolean;
    timelineNeedsFixing?: boolean;
    hasNoTimeline?: boolean;
  };
  oopsy?: {
    num: number;
  };
  translations?: {
    [lang in Lang]?: {
      [type in MissingTranslationErrorType]?: number;
    };
  };
};

export type Coverage = { [zoneId: string]: CoverageEntry };

export type CoverageTotalEntry = {
  raidboss: number;
  oopsy: number;
  total: number;
};

export type CoverageTotals = {
  byExpansion: {
    [exVersion: string]: {
      byContentType: { [contentType: string]: CoverageTotalEntry };
      overall: CoverageTotalEntry;
    };
  };
  byContentType: { [contentType: string]: CoverageTotalEntry };
  overall: CoverageTotalEntry;
};

export type TranslationTotals = {
  [lang in Exclude<Lang, 'en'>]: {
    translatedFiles: number;
    totalFiles: number;
    missingFiles: number;
    errors: number;
  };
};
