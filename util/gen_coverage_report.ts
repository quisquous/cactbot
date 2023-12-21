import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import contentList from '../resources/content_list';
import ContentType from '../resources/content_type';
import { isLang, Lang, languages } from '../resources/languages';
import ZoneId from '../resources/zone_id';
import ZoneInfo from '../resources/zone_info';
import { LooseOopsyTriggerSet } from '../types/oopsy';
import { LooseTriggerSet } from '../types/trigger';
import { oopsyTriggerSetFields } from '../ui/oopsyraidsy/oopsy_fields';

import { Coverage, CoverageEntry, CoverageTotals, TranslationTotals } from './coverage/coverage.d';
import { findMissingTranslations, MissingTranslationErrorType } from './find_missing_translations';
import findManifestFiles from './manifest';

type MissingTranslations = {
  file: string;
  line?: number;
  type: MissingTranslationErrorType;
  message: string;
};

type MissingTranslationsDict = {
  [lang in Lang]?: MissingTranslations[];
};

// Paths are relative to current file.
// We can't import the manifest directly from util/ because that's webpack magic,
// so need to do the same processing its loader would do.
const raidbossManifest = '../ui/raidboss/data/raidboss_manifest.txt';
const oopsyManifest = '../ui/oopsyraidsy/data/oopsy_manifest.txt';
const outputFileName = 'coverage/coverage_report.ts';

const missingOutputFileNames = {
  de: 'coverage/missing_translations_de.html',
  fr: 'coverage/missing_translations_fr.html',
  ja: 'coverage/missing_translations_ja.html',
  cn: 'coverage/missing_translations_cn.html',
  ko: 'coverage/missing_translations_ko.html',
};

const basePath = () => path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const baseUrl = 'https://github.com/OverlayPlugin/cactbot/blob/main';

const emptyCoverage = (): CoverageEntry => {
  return {
    triggers: {
      num: 0,
    },
    timeline: {},
  };
};

const processRaidbossFile = (
  triggerFileName: string,
  zoneId: number,
  triggerSet: LooseTriggerSet,
  timelineFileName: string | undefined,
  timelineContents: string | undefined,
  coverage: Coverage,
  missingTranslations: MissingTranslationsDict,
) => {
  let numTriggers = 0;
  if (triggerSet.triggers)
    numTriggers += triggerSet.triggers.length;
  if (triggerSet.timelineTriggers)
    numTriggers += triggerSet.timelineTriggers.length;

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

  for (const [lang, missing] of Object.entries(missingTranslations)) {
    if (!isLang(lang))
      continue;
    if (lang === 'en')
      continue;
    for (const translation of missing) {
      if (translation.file !== triggerFileName && translation.file !== timelineFileName)
        continue;
      const langEntry = (thisCoverage.translations ??= {})[lang] ??= {};
      langEntry[translation.type] = (langEntry[translation.type] ?? 0) + 1;
    }
  }
};

const processRaidbossCoverage = async (
  manifest: string,
  coverage: Coverage,
  missingTranslations: MissingTranslationsDict,
) => {
  const manifestLines = findManifestFiles(manifest);
  const dataDir = path.dirname(manifest);
  for (const line of manifestLines) {
    if (!line.endsWith('.js') && !line.endsWith('.ts'))
      continue;
    const triggerFileName = path.join(dataDir, line).replace(/\\/g, '/');

    // Dynamic imports don't have a type, so add type assertion.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const triggerSet = (await import(triggerFileName)).default as LooseTriggerSet;

    let timelineContents: string | undefined = undefined;
    const timelineFileName = triggerSet.timelineFile !== undefined
      ? path.join(path.dirname(triggerFileName), triggerSet.timelineFile).replace(/\\/g, '/')
      : undefined;
    if (timelineFileName !== undefined) {
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

    // TODO: this is kind of a hack, and maybe we should do this better.
    // We're importing from util/, so remove the ../ on the path names
    const triggerRelPath = triggerFileName.replace(/^\.\.\//, '');
    const timelineRelPath = timelineFileName?.replace(/^\.\.\//, '');

    if (Array.isArray(zoneId)) {
      for (const id of zoneId)
        processRaidbossFile(
          triggerRelPath,
          id,
          triggerSet,
          timelineRelPath,
          timelineContents,
          coverage,
          missingTranslations,
        );
    } else {
      processRaidbossFile(
        triggerRelPath,
        zoneId,
        triggerSet,
        timelineRelPath,
        timelineContents,
        coverage,
        missingTranslations,
      );
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
  const manifestLines = findManifestFiles(manifest);
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

const buildTotals = (coverage: Coverage, missingTranslations: MissingTranslationsDict) => {
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

  const defaultTranslationTotal = { totalFiles: 0, translatedFiles: 0, missingFiles: 0, errors: 0 };
  const translationTotals: TranslationTotals = {
    de: { ...defaultTranslationTotal },
    fr: { ...defaultTranslationTotal },
    ja: { ...defaultTranslationTotal },
    cn: { ...defaultTranslationTotal },
    ko: { ...defaultTranslationTotal },
  };

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
    const origContentType = zoneInfo.contentType;
    if (origContentType === undefined)
      continue;
    // Until we get more V&C dungeons (if ever), lump them in with "dungeons".
    const contentTypeRemap: { [type: number]: number } = {
      [ContentType.VCDungeonFinder]: ContentType.Dungeons,
    };
    const contentType = contentTypeRemap[origContentType] ?? origContentType;

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

    for (const lang in translationTotals) {
      if (!isLang(lang) || lang === 'en')
        continue;

      const translations = thisCoverage.translations?.[lang] ?? {};
      let totalMistakes = 0;

      // Chinese and Korean are unable to get translation sections until the content
      // is released, so if there is a missing translations section, we'll treat that
      // as the fight not existing for that language.
      const isMissingSection = (translations.replaceSection ?? 0) > 0;
      if (isMissingSection) {
        translationTotals[lang].missingFiles++;
        continue;
      }

      for (const value of Object.values(translations))
        totalMistakes += value;
      translationTotals[lang].totalFiles++;
      if (totalMistakes === 0)
        translationTotals[lang].translatedFiles++;
    }
  }

  for (const [lang, translations] of Object.entries(missingTranslations)) {
    if (!isLang(lang) || lang === 'en')
      continue;
    // Separate out missing file errors here.
    const errors = translations.filter((x) => x.type !== 'replaceSection');
    translationTotals[lang].errors += errors.length;
  }

  return {
    totals,
    translationTotals,
  };
};

const writeCoverageReport = (
  currentFileName: string,
  outputFileName: string,
  coverage: Coverage,
  totals: CoverageTotals,
  translationTotals: TranslationTotals,
) => {
  const str = `// Auto-generated from ${currentFileName}\n` +
    `// DO NOT EDIT THIS FILE DIRECTLY\n\n` +
    `// Disable eslint for auto-generated file\n` +
    `/* eslint-disable */\n` +
    `import { Coverage, CoverageTotals, TranslationTotals } from './coverage.d';\n\n` +
    `export const coverage: Coverage = ${JSON.stringify(coverage, undefined, 2)};\n\n` +
    `export const coverageTotals: CoverageTotals = ${JSON.stringify(totals, undefined, 2)};\n` +
    `export const translationTotals: TranslationTotals = ${
      JSON.stringify(translationTotals, undefined, 2)
    };\n`;

  // Overwrite the file, if it already exists.
  const flags = 'w';
  const writer = fs.createWriteStream(outputFileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });

  writer.write(str);
};

const processMissingTranslations = async (): Promise<MissingTranslationsDict> => {
  const missing: MissingTranslationsDict = {};
  const basePathCached = basePath();

  await findMissingTranslations(undefined, languages, (file, line, type, langOrLangs, message) => {
    const langs = Array.isArray(langOrLangs) ? langOrLangs : [langOrLangs];
    for (const lang of langs) {
      const entry = missing[lang] ??= [];
      const relPath = path.relative(basePathCached, file).replaceAll('\\', '/');
      entry.push({
        file: relPath,
        line: line,
        type: type,
        message: message,
      });
    }
  });

  return missing;
};

const writeMissingTranslations = (missing: MissingTranslations[], outputFileName: string) => {
  const flags = 'w';
  const writer = fs.createWriteStream(outputFileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });

  for (const trans of missing) {
    const lineHash = trans.line === undefined ? '' : `#L${trans.line}`;
    const lineText = trans.line === undefined ? '' : `:${trans.line}`;
    const url = `${baseUrl}/${trans.file}${lineHash}`;
    const link = `<a href="${url}">${trans.file}${lineText}</a>`;
    writer.write(`<div>${link} [${trans.type}] ${trans.message}</div>\n`);
  }
};

(async () => {
  // Do this prior to chdir which conflicts with find_missing_timeline_translations.ts.
  // FIXME: make that script more robust to cwd.
  const missingTranslations = await processMissingTranslations();
  for (const lang of languages) {
    if (lang === 'en')
      continue;
    const missing = missingTranslations[lang];
    if (missing === undefined)
      continue;
    writeMissingTranslations(missing, missingOutputFileNames[lang]);
  }

  const currentPathAndFile = process.argv?.[1] ?? '';
  const currentFileName = path.basename(currentPathAndFile);
  process.chdir(path.dirname(currentPathAndFile));
  const coverage = {};
  await processRaidbossCoverage(raidbossManifest, coverage, missingTranslations);
  await processOopsyCoverage(oopsyManifest, coverage);
  const { totals, translationTotals } = buildTotals(coverage, missingTranslations);
  writeCoverageReport(currentFileName, outputFileName, coverage, totals, translationTotals);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
