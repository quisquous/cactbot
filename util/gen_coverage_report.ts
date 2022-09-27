import fs from 'fs';
import path from 'path';

import contentList from '../resources/content_list';
import ZoneId from '../resources/zone_id';
import ZoneInfo from '../resources/zone_info';
import { LooseOopsyTriggerSet } from '../types/oopsy';
import { LooseTriggerSet } from '../types/trigger';
import { oopsyTriggerSetFields } from '../ui/oopsyraidsy/oopsy_fields';

import { Coverage, CoverageEntry, CoverageTotals } from './coverage/coverage';

// Paths are relative to current file.
// We can't import the manifest directly from util/ because that's webpack magic,
// so need to do the same processing its loader would do.
const raidbossManifest = '../ui/raidboss/data/raidboss_manifest.txt';
const oopsyManifest = '../ui/oopsyraidsy/data/oopsy_manifest.txt';
const outputFileName = 'coverage/coverage_report.ts';

const emptyCoverage = (): CoverageEntry => {
  return {
    triggers: {
      num: 0,
    },
    timeline: {},
  };
};

const readManifest = (filename: string) => {
  const contents = fs.readFileSync(filename);
  const lines = contents.toString().split(/[\r\n]+/);
  return lines;
};

const processRaidbossFile = (
  _triggerFile: string,
  zoneId: number,
  triggerSet: LooseTriggerSet,
  timelineContents: string | undefined,
  coverage: Coverage,
) => {
  let numTriggers = 0;
  if (triggerSet.triggers)
    numTriggers += triggerSet.triggers.length;
  if (triggerSet.timelineTriggers)
    numTriggers += triggerSet.timelineTriggers.length;

  // TODO: have find_missing_timeline_translations.js return a set of
  // translations that are missing so that we can include percentage translated
  // here as well.

  const thisCoverage = coverage[zoneId] ??= emptyCoverage();

  const timelineEntry: Coverage[string]['timeline'] = {};
  // 1000 here is an arbitrary limit to ignore stub timeline files that haven't been filled out.
  // ifrit-nm is the shortest real timeline, at 1800 characters.
  // TODO: consider processing the timeline and finding the max time? or some other heuristic.
  if (timelineContents !== undefined && timelineContents.length > 1000)
    timelineEntry.hasFile = true;
  if (triggerSet.hasNoTimeline)
    timelineEntry.hasNoTimeline = true;
  else if (triggerSet.timelineNeedsFixing)
    timelineEntry.timelineNeedsFixing = true;

  thisCoverage.timeline = timelineEntry;
  thisCoverage.triggers.num = numTriggers;
};

const processRaidbossCoverage = async (manifest: string, coverage: Coverage) => {
  const manifestLines = readManifest(manifest);
  const dataDir = path.dirname(manifest);
  for (const line of manifestLines) {
    if (!line.endsWith('.js') && !line.endsWith('.ts'))
      continue;
    const triggerFileName = path.join(dataDir, line).replace(/\\/g, '/');

    // Dynamic imports don't have a type, so add type assertion.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const triggerSet = (await import(triggerFileName)).default as LooseTriggerSet;

    let timelineContents: string | undefined = undefined;
    if (triggerSet.timelineFile !== undefined) {
      const timelineFileName = path.join(path.dirname(triggerFileName), triggerSet.timelineFile);
      try {
        timelineContents = fs.readFileSync(timelineFileName).toString();
        if (!timelineContents)
          continue;
      } catch (e) {
        console.error(e);
      }
    }

    const zoneId = triggerSet.zoneId;
    if (zoneId === undefined) {
      console.error(`${line}: Missing ZoneId`);
      continue;
    }

    // Only process real zones.
    if (zoneId === ZoneId.MatchAll)
      continue;
    if (!Array.isArray(zoneId) && (!ZoneInfo[zoneId] || !contentList.includes(zoneId)))
      continue;

    if (Array.isArray(zoneId)) {
      for (const id of zoneId)
        processRaidbossFile(line, id, triggerSet, timelineContents, coverage);
    } else {
      processRaidbossFile(line, zoneId, triggerSet, timelineContents, coverage);
    }
  }
};

const processOopsyFile = (
  _triggerFile: string,
  zoneId: number,
  triggerSet: LooseOopsyTriggerSet,
  coverage: Coverage,
) => {
  let numTriggers = 0;

  for (const field of oopsyTriggerSetFields) {
    const obj = triggerSet[field];
    if (obj === undefined || obj === null)
      continue;
    if (typeof obj !== 'object')
      continue;
    // These can be either arrays or objects.
    numTriggers += Object.keys(obj).length;
  }

  // TODO: have find_missing_timeline_translations.js return a set of
  // translations that are missing so that we can include percentage translated
  // here as well.

  const thisCoverage = coverage[zoneId] ??= emptyCoverage();
  thisCoverage.oopsy = { num: numTriggers };
};

const processOopsyCoverage = async (manifest: string, coverage: Coverage) => {
  const manifestLines = readManifest(manifest);
  const dataDir = path.dirname(manifest);
  for (const line of manifestLines) {
    if (!line.endsWith('.js') && !line.endsWith('.ts'))
      continue;
    const triggerFileName = path.join(dataDir, line).replace(/\\/g, '/');

    // Dynamic imports don't have a type, so add type assertion.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const triggerSet = (await import(triggerFileName)).default as LooseOopsyTriggerSet;

    const zoneId = triggerSet.zoneId;
    if (zoneId === undefined) {
      console.error(`${line}: Missing ZoneId`);
      continue;
    }

    // Only process real zones.
    if (zoneId === ZoneId.MatchAll)
      continue;
    if (!Array.isArray(zoneId) && (!ZoneInfo[zoneId] || !contentList.includes(zoneId)))
      continue;

    if (Array.isArray(zoneId)) {
      for (const id of zoneId) {
        if (id !== ZoneId.MatchAll)
          processOopsyFile(line, id, triggerSet, coverage);
      }
    } else {
      processOopsyFile(line, zoneId, triggerSet, coverage);
    }
  }
};

const buildTotals = (coverage: Coverage) => {
  // Find the set of content types and versions that appear.
  const contentTypeSet = new Set<number>();
  const versionSet = new Set<number>();
  for (const zoneId of contentList) {
    if (zoneId === ZoneId.MatchAll)
      continue;
    const zoneInfo = ZoneInfo[zoneId];
    if (!zoneInfo)
      continue;
    if (zoneInfo.contentType)
      contentTypeSet.add(zoneInfo.contentType);
    versionSet.add(zoneInfo.exVersion);
  }
  const contentTypes = Array.from(contentTypeSet);
  const versions = Array.from(versionSet);

  const defaultTotal = { raidboss: 0, oopsy: 0, total: 0 };

  // Initialize return object.
  const totals: CoverageTotals = {
    byExpansion: {},
    byContentType: {},
    overall: { ...defaultTotal },
  };
  for (const contentType of contentTypes)
    totals.byContentType[contentType] = { ...defaultTotal };
  for (const exVersion of versions) {
    const versionInfo: CoverageTotals['byExpansion'][string] = {
      byContentType: {},
      overall: { ...defaultTotal },
    };
    for (const contentType of contentTypes)
      versionInfo.byContentType[contentType] = { ...defaultTotal };
    totals.byExpansion[exVersion] = versionInfo;
  }

  for (const zoneId of contentList) {
    if (zoneId === ZoneId.MatchAll)
      continue;
    const zoneInfo = ZoneInfo[zoneId];
    if (!zoneInfo)
      continue;

    const emptyTotal = {
      raidboss: 0,
      oopsy: 0,
      total: 0,
    };

    const versionInfo = totals.byExpansion[zoneInfo.exVersion] ?? {
      byContentType: {},
      overall: { ...emptyTotal },
    };
    const contentType = zoneInfo.contentType;
    if (contentType === undefined)
      continue;
    const accum = versionInfo.byContentType[contentType] ?? { ...emptyTotal };

    accum.total++;
    versionInfo.overall.total++;
    const totalsByContentType = totals.byContentType[contentType] ??= { ...emptyTotal };
    totalsByContentType.total++;
    totals.overall.total++;

    const thisCoverage = coverage[zoneId];
    if (!thisCoverage)
      continue;

    const hasTriggers = thisCoverage.triggers?.num > 0;
    const hasTimeline = thisCoverage.timeline?.hasFile;
    if (hasTriggers || hasTimeline) {
      accum.raidboss++;
      versionInfo.overall.raidboss++;
      totalsByContentType.raidboss++;
      totals.overall.raidboss++;
    }
    if ((thisCoverage?.oopsy?.num ?? 0) > 0) {
      accum.oopsy++;
      versionInfo.overall.oopsy++;
      totalsByContentType.oopsy++;
      totals.overall.oopsy++;
    }
  }

  return totals;
};

const writeCoverageReport = (
  currentFileName: string,
  outputFileName: string,
  coverage: Coverage,
  totals: CoverageTotals,
) => {
  const str = `// Auto-generated from ${currentFileName}\n` +
    `// DO NOT EDIT THIS FILE DIRECTLY\n\n` +
    `// Disable eslint for auto-generated file\n` +
    `/* eslint-disable */\n` +
    `import { Coverage, CoverageTotals } from './coverage.d';\n\n` +
    `export const coverage: Coverage = ${JSON.stringify(coverage, undefined, 2)};\n\n` +
    `export const coverageTotals: CoverageTotals = ${JSON.stringify(totals, undefined, 2)};\n`;

  // Overwrite the file, if it already exists.
  const flags = 'w';
  const writer = fs.createWriteStream(outputFileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });

  writer.write(str);
};

(async () => {
  const currentPathAndFile = process.argv?.[1] ?? '';
  const currentFileName = path.basename(currentPathAndFile);
  process.chdir(path.dirname(currentPathAndFile));
  const coverage = {};
  await processRaidbossCoverage(raidbossManifest, coverage);
  await processOopsyCoverage(oopsyManifest, coverage);
  const totals = buildTotals(coverage);
  writeCoverageReport(currentFileName, outputFileName, coverage, totals);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
