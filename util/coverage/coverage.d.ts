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
