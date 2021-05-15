import fs from 'fs';
import path from 'path';
import eslint from 'eslint';
import ZoneInfo from '../resources/zone_info';
import contentList from '../resources/content_list';
import ZoneId from '../resources/zone_id';
import { oopsyTriggerSetFields } from '../ui/oopsyraidsy/oopsy_fields';

// Used for trigger eval.
import Regexes from '../resources/regexes';
import NetRegexes from '../resources/netregexes';
import Conditions from '../resources/conditions';
import { Responses, triggerFunctions, triggerOutputFunctions, builtInResponseStr } from '../resources/responses';

// Paths are relative to current file.
// We can't import the manifest directly from util/ because that's webpack magic,
// so need to do the same processing its loader would do.
const raidbossManifest = '../ui/raidboss/data/raidboss_manifest.txt';
const oopsyManifest = '../ui/oopsyraidsy/data/oopsy_manifest.txt';
const outputFileName = 'coverage/coverage_report.ts';

const readManifest = (filename) => {
  const contents = fs.readFileSync(filename);
  if (!contents)
    return [];
  const lines = contents.toString().split(/[\r\n]+/);
  return lines;
};

const processRaidbossFile = (triggerFile, zoneId, triggerSet, timelineContents, coverage) => {
  let numTriggers = 0;
  if (triggerSet.triggers)
    numTriggers += triggerSet.triggers.length;
  if (triggerSet.timelineTriggers)
    numTriggers += triggerSet.timelineTriggers.length;

  // TODO: have find_missing_timeline_translations.js return a set of
  // translations that are missing so that we can include percentage translated
  // here as well.

  coverage[zoneId] = coverage[zoneId] || {};

  const timelineEntry = {};
  // 1000 here is an arbitrary limit to ignore stub timeline files that haven't been filled out.
  // ifrit-nm is the shortest real timeline, at 1800 characters.
  // TODO: consider processing the timeline and finding the max time? or some other heuristic.
  if (timelineContents && timelineContents.length > 1000)
    timelineEntry.hasFile = true;
  if (triggerSet.timelineNeedsFixing)
    timelineEntry.timelineNeedsFixing = true;

  Object.assign(coverage[zoneId], {
    triggers: {
      num: numTriggers,
    },
    timeline: timelineEntry,
  });
};

const processRaidbossCoverage = async (manifest, coverage) => {
  const manifestLines = readManifest(manifest);
  const dataDir = path.dirname(manifest);
  for (const line of manifestLines) {
    if (!line.endsWith('.js') && !line.endsWith('.ts'))
      continue;
    const triggerFileName = path.join(dataDir, line).replace(/\\/g, '/');
    const triggerSet = (await import(triggerFileName)).default;

    let timelineContents = null;
    if (triggerSet.timelineFile) {
      const timelineFileName = path.join(path.dirname(triggerFileName), triggerSet.timelineFile);
      try {
        timelineContents = fs.readFileSync(timelineFileName);
        if (!timelineContents)
          continue;
        timelineContents = timelineContents.toString();
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    const zoneId = triggerSet.zoneId;
    if (zoneId === undefined) {
      console.error(`${line}: Missing ZoneId`);
      continue;
    }

    // Only process real zones.
    if (zoneId === ZoneId.MatchAll || !ZoneInfo[zoneId] || !contentList.includes(zoneId))
      continue;

    if (Array.isArray(zoneId)) {
      for (const id of zoneId)
        processRaidbossFile(line, id, triggerSet, timelineContents, coverage);
    } else {
      processRaidbossFile(line, zoneId, triggerSet, timelineContents, coverage);
    }
  }
};

const processOopsyFile = (triggerFile, zoneId, triggerSet, coverage) => {
  let numTriggers = 0;

  for (const field of oopsyTriggerSetFields) {
    const obj = triggerSet[field];
    if (!obj)
      continue;
    if (typeof obj !== 'object')
      continue;
    // These can be either arrays or objects.
    numTriggers += Object.keys(obj).length;
  }

  // TODO: have find_missing_timeline_translations.js return a set of
  // translations that are missing so that we can include percentage translated
  // here as well.

  coverage[zoneId] = coverage[zoneId] || {};

  Object.assign(coverage[zoneId], {
    oopsy: {
      num: numTriggers,
    },
  });
};

const processOopsyCoverage = async (manifest, coverage) => {
  const manifestLines = readManifest(manifest);
  const dataDir = path.dirname(manifest);
  for (const line of manifestLines) {
    if (!line.endsWith('.js') && !line.endsWith('.ts'))
      continue;
    const triggerFileName = path.join(dataDir, line).replace(/\\/g, '/');
    const triggerSet = (await import(triggerFileName)).default;
    const zoneId = triggerSet.zoneId;
    if (zoneId === undefined) {
      console.error(`${line}: Missing ZoneId`);
      continue;
    }

    // Only process real zones.
    if (zoneId === ZoneId.MatchAll || !ZoneInfo[zoneId] || !contentList.includes(zoneId))
      continue;

    if (Array.isArray(zoneId)) {
      for (const id of zoneId)
        processOopsyFile(line, id, triggerSet, coverage);
    } else {
      processOopsyFile(line, zoneId, triggerSet, coverage);
    }
  }
};

const buildTotals = (coverage) => {
  // Find the set of content types and versions that appear.
  const contentTypeSet = new Set();
  const versionSet = new Set();
  for (const zoneId of contentList) {
    const zoneInfo = ZoneInfo[zoneId];
    if (!zoneInfo)
      continue;
    contentTypeSet.add(zoneInfo.contentType);
    versionSet.add(zoneInfo.exVersion);
  }
  const contentTypes = Array.from(contentTypeSet);
  const versions = Array.from(versionSet);

  const defaultTotal = { raidboss: 0, oopsy: 0, total: 0 };

  // Initialize return object.
  const totals = {
    byExpansion: {},
    byContentType: {},
    overall: { ...defaultTotal },
  };
  for (const contentType of contentTypes)
    totals.byContentType[contentType] = { ...defaultTotal };
  for (const exVersion of versions) {
    const versionInfo = {
      byContentType: {},
      overall: { ...defaultTotal },
    };
    for (const contentType of contentTypes)
      versionInfo.byContentType[contentType] = { ...defaultTotal };
    totals.byExpansion[exVersion] = versionInfo;
  }

  for (const zoneId of contentList) {
    const zoneInfo = ZoneInfo[zoneId];
    if (!zoneInfo)
      continue;

    const versionInfo = totals.byExpansion[zoneInfo.exVersion];
    const accum = versionInfo.byContentType[zoneInfo.contentType];

    accum.total++;
    versionInfo.overall.total++;
    totals.byContentType[zoneInfo.contentType].total++;
    totals.overall.total++;

    if (coverage[zoneId]) {
      const hasTriggers = coverage[zoneId].triggers && coverage[zoneId].triggers.num > 0;
      const hasTimeline = coverage[zoneId].timeline && coverage[zoneId].timeline.hasFile;
      if (hasTriggers || hasTimeline) {
        accum.raidboss++;
        versionInfo.overall.raidboss++;
        totals.byContentType[zoneInfo.contentType].raidboss++;
        totals.overall.raidboss++;
      }
      if (coverage[zoneId].oopsy && coverage[zoneId].oopsy.num > 0) {
        accum.oopsy++;
        versionInfo.overall.oopsy++;
        totals.byContentType[zoneInfo.contentType].oopsy++;
        totals.overall.oopsy++;
      }
    }
  }

  return totals;
};

const writeCoverageReport = async (outputFileName, coverage, totals) => {
  const str =
    `// Auto-generated from ${path.basename(process.argv[1])}\n` +
    `// DO NOT EDIT THIS FILE DIRECTLY\n\n` +
    `export const coverage = ${JSON.stringify(coverage, undefined, 2)};\n\n` +
    `export const coverageTotals = ${JSON.stringify(totals, undefined, 2)};\n`;

  const linter = new eslint.ESLint({ fix: true });
  const results = await linter.lintText(str, { filePath: outputFileName });

  // There's only one result from lintText, as per documentation.
  const lintResult = results[0];
  if (lintResult.errorCount > 0 || lintResult.warningCount > 0) {
    console.error('Lint ran with errors, aborting.');
    process.exit(2);
  }

  // Overwrite the file, if it already exists.
  const flags = 'w';
  const writer = fs.createWriteStream(outputFileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });

  writer.write(lintResult.output);
};


(async () => {
  process.chdir(path.dirname(process.argv[1]));
  const coverage = {};
  await processRaidbossCoverage(raidbossManifest, coverage);
  await processOopsyCoverage(oopsyManifest, coverage);
  const totals = buildTotals(coverage);
  writeCoverageReport(outputFileName, coverage, totals);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
