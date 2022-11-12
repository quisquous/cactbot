import fs from 'fs';
import readline from 'readline';

import { Namespace } from 'argparse';

import NetRegexes from '../../resources/netregexes';
import PetData from '../../resources/pet_names';
import SFuncs from '../../resources/stringhandlers';
import { NetMatches } from '../../types/net_matches';

import { LogUtilArgParse, TimelineArgs } from './arg_parser';
import { printCollectedFights, printCollectedZones } from './encounter_printer';
import { EncounterCollector, FightEncInfo, TLFuncs } from './encounter_tools';
import FFLogs, { ffLogsEventEntry } from './fflogs';

// TODO: Repeated abilities that need to be auto-commented may not get the comment marker
// if there's an intervening entry between the repeated entries.
// Figure out a more robust way to auto-comment lines that should be visible but unsynced.

// TODO: Add support for assigning sync windows to specific abilities,
// with or without phase conditions.

// TODO: Add support for auto-generating loops.

// TODO: Add FFLogs report parsing support.

// TODO: Reinstate support for using raw start/end times
// rather than force fight indexing.

// TODO: Add support for compiling log lines during the collector pre-pass.

type TimelineEntry = {
  time: string;
  combatant?: string;
  abilityId?: string;
  abilityName?: string;
  targetable?: boolean;
  lineType: string;
  duration?: number;
  window?: { beforeWindow: number; afterWindow: number };
  zoneSeal?: { seal: string; code: '0839' };
  lineComment?: string;
};

type ExtendedArgs = TimelineArgs & {
  'output_file': string | null;
  'start': string | null;
  'end': string | null;
  'ignore_id': string[] | null;
  'ignore_ability': string[] | null;
  'ignore_combatant': string[] | null;
  'only_combatant': string[] | null;
  'phase': string | null;
  'include_targetable': string[] | null;
};

class ExtendedArgsNamespace extends Namespace implements ExtendedArgs {
  'file': string | null;
  'force': boolean | null;
  'search_fights': number | null;
  'search_zones': number | null;
  'fight_regex': string | null;
  'zone_regex': string | null;
  'output_file': string | null;
  'start': string | null;
  'end': string | null;
  'ignore_id': string[] | null;
  'ignore_ability': string[] | null;
  'ignore_combatant': string[] | null;
  'only_combatant': string[] | null;
  'phase': string | null;
  'include_targetable': string[] | null;
  'report_id': string | null;
  'report_fight': number | null;
  'key': string | null;
}

// Some NPCs can be picked up by our entry processor.
// We list them out explicitly here so we can ignore them at will.
const ignoredCombatants = PetData['en'].concat([
  'Carbuncle',
  'Ruby Ifrit',
  'Emerald Garuda',
  'Topaz Titan',
  'Emerald Carbuncle',
  'Topaz Carbuncle',
  'Ruby Carbuncle',
  'Moonstone Carbuncle',
  'Earthly Star',
  'Alphinaud',
  'Alisaie',
  'Y\'shtola',
  'Ryne',
  'Minfilia',
  'Thancred',
  'Urianger',
  'Estinien',
  'G\'raha Tia',
  'Varshahn',
  'Alphinaud\'s Avatar',
  'Alisaie\'s Avatar',
  'Thancred\'s Avatar',
  'Urianger\'s Avatar',
  'Y\'shtola\'s Avatar',
  'Estinien\'s Avatar',
  'G\'raha Tia\'s Avatar',
  '',
  'Crystal Exarch',
  'Mikoto',
  'Liturgic Bell',
]);

const timelineParse = new LogUtilArgParse();

timelineParse.parser.addArgument(['--output_file', '-of'], {
  nargs: '?',
  type: 'string',
  help: 'Optional location to write timeline to file.',
});

timelineParse.parser.addArgument(['--ignore_id', '-ii'], {
  nargs: '+',
  help: 'Ability IDs to ignore, e.g. 27EF',
});

timelineParse.parser.addArgument(['--ignore_ability', '-ia'], {
  nargs: '+',
  help: 'Ability names to ignore, e.g. Attack',
});

timelineParse.parser.addArgument(['--ignore_combatant', '-ic'], {
  nargs: '+',
  help: 'Combatant names to ignore, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--only_combatant', '-oc'], {
  nargs: '+',
  help: 'Only the listed combatants will generate timeline data, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--phase', '-p'], {
  nargs: '+',
  help: 'Abilities that indicate a new phase, and the time to jump to, e.g. 28EC:1000',
});

timelineParse.parser.addArgument(['--include_targetable', '-it'], {
  nargs: '+',
  help: 'Set this flag to include "34" log lines when making the timeline',
});

const args: Partial<ExtendedArgsNamespace> = new ExtendedArgsNamespace({});
timelineParse.parser.parseArgs(undefined, args);

const printHelpAndExit = (errString: string): void => {
  console.error(errString);
  timelineParse.parser.printHelp();
  process.exit(-1);
};

const hasFile = typeof args.file === 'string' && args?.file !== '';
const hasReport = typeof args.report_id === 'string' && args?.report_id !== '';

// TODO: Revisit this logic when we re-add FFLogs support.
if (hasFile && hasReport || !hasFile && !hasReport)
  printHelpAndExit('Error: Must specify exactly one of -f or -r\n');
if (hasFile && !args.file?.includes('.log'))
  printHelpAndExit('Error: Must specify an FFXIV ACT log file, as log.log\n');
if (args.report_fight !== null && hasReport)
  printHelpAndExit('Error: Must specify a report ID.');
let numExclusiveArgs = 0;
const exclusiveArgs = ['search_fights', 'search_zones', 'report_fight'] as const;
for (const opt of exclusiveArgs) {
  if (args[opt] !== null && args[opt] !== undefined)
    numExclusiveArgs++;
}
if (numExclusiveArgs !== 1)
  printHelpAndExit('Error: Must specify exactly one of -lf, -lz, or -rf\n');
if (
  typeof args.report_id === 'string' &&
  (typeof args.report_fight !== 'number' || args.report_fight < 0)
)
  printHelpAndExit('Error: Must specify a report fight index of 0 or greater');
if (args.fight_regex === '-1')
  printHelpAndExit('Error: Timeline generation does not currently support -fr\n');
if (args.zone_regex === '-1')
  printHelpAndExit('Error: Timeline generation does not currently support -zr\n');

const makeCollectorFromPrepass = async (fileName: string, store: boolean) => {
  const collector = new EncounterCollector();
  const lineReader = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  for await (const line of lineReader) {
    // TODO: this could be more efficient if it stopped when it found the requested encounter.
    collector.process(line, store);
  }
  return collector;
};

const parseNameToggleToEntry = (matches: NetMatches['NameToggle']): TimelineEntry => {
  const targetable = matches.toggle === '01';
  const entry: TimelineEntry = {
    time: matches.timestamp,
    combatant: matches.name,
    lineType: 'nameToggle',
    targetable: targetable,
  };
  return entry;
};

const parseAbilityToEntry = (matches: NetMatches['Ability']): TimelineEntry => {
  let abilityName = matches.ability;
  if (abilityName.toLowerCase().includes('unknown_'))
    abilityName = '--sync--';
  const entry: TimelineEntry = {
    time: matches.timestamp,
    combatant: matches.source,
    abilityId: matches.id,
    abilityName: abilityName,
    lineType: 'ability',
  };
  return entry;
};

const parseFFLogsEventToEntry = (
  event: ffLogsEventEntry,
  enemies: { [index: string]: string },
  startTime: number,
): TimelineEntry => {
  const timestamp = startTime + event.timestamp;

  let combatant: string | undefined;
  if (event.source !== undefined)
    combatant = enemies[event.source.id];
  else if (event.sourceID !== undefined)
    combatant = enemies[event.sourceID];
  else
    combatant = 'Unknown';

  const abilityId = event.ability.guid.toString(16).toUpperCase();
  let ability = event.ability.name;
  if (event.ability.name.toLowerCase().startsWith('unknown_'))
    ability = '--sync--';

  const entry: TimelineEntry = {
    time: new Date(timestamp).toISOString(),
    combatant: combatant,
    abilityId: abilityId,
    abilityName: ability,
    lineType: 'ability',
  };
  return entry;
};

const parseReport = async (
  reportId: string,
  fightIndex: number,
  apiKey: string,
): Promise<{ 'entries': TimelineEntry[]; 'abilityTimes': { [abilityId: string]: number[] } }> => {
  const rawReportData = await FFLogs.getFightInfo(reportId, apiKey);
  const reportStartTime = rawReportData.start;
  // First we verify that the user entered a valid index
  let chosenFight;
  for (const fight of rawReportData.fights) {
    if (fight.id === fightIndex)
      chosenFight = fight;
  }
  if (chosenFight === undefined) {
    console.error('No encounter found in the report at that fight index.');
    process.exit(-2);
  }

  // Knowing that the encounter exists in the report,
  // we next assemble the list of all hostile entities in the report.
  // Unfortunately, entity data is not present in the data for individual encounters,
  // so we have to do some matching magic.
  const enemies = FFLogs.extractEnemiesFromReport(rawReportData);
  const rawFightData = await FFLogs.getEventData(
    reportId,
    apiKey,
    chosenFight.start_time,
    chosenFight.end_time,
  );

  const entries: TimelineEntry[] = [];
  const abilityTimeMap: { [abilityId: string]: number[] } = {};

  for (const event of rawFightData) {
    // FFLogs mixes 14 StartsUsing lines in with 15/16 Ability lines.
    if (event.type !== 'cast')
      continue;
    entries.push(parseFFLogsEventToEntry(event, enemies, chosenFight.start_time + reportStartTime));

    // Store off exact times for each ability's usages for later sync commenting
    const abilityId = event.ability.guid.toString(16).toUpperCase();
    const abilityTimeStamp = chosenFight.start_time + reportStartTime + event.timestamp;
    abilityTimeMap[abilityId] ??= [];
    if (!abilityTimeMap[abilityId]?.includes(abilityTimeStamp))
      abilityTimeMap[abilityId]?.push(abilityTimeStamp);
  }
  return { entries: entries, abilityTimes: abilityTimeMap };
};

const extractRawLinesFromLog = async (
  fileName: string,
  start: string | Date,
  end: string | Date,
): Promise<string[]> => {
  const lines: string[] = [];
  const file = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  start = typeof start === 'string' ? start : TLFuncs.timeFromDate(start);
  end = typeof end === 'string' ? end : TLFuncs.timeFromDate(end);
  let started = false;
  for await (const line of file) {
    // This will fail on lines with 3-digit identifiers,
    // but that's okay because those will never be start lines.
    const lineTimeStamp = line.slice(14, 26);
    if (start === lineTimeStamp && !started)
      started = start === lineTimeStamp;
    if (started)
      lines.push(line);
    if (lineTimeStamp === end) {
      file.close();
      return lines;
    }
  }
  file.close();
  return lines;
};

const extractTLEntriesFromLog = (
  lines: string[],
  targetArray: string[] | null,
): { 'entries': TimelineEntry[]; 'abilityTimes': { [abilityId: string]: number[] } } => {
  const entries: TimelineEntry[] = [];
  const abilityTimeMap: { [abilityId: string]: number[] } = {};
  for (const line of lines) {
    const targetable = NetRegexes.nameToggle().exec(line)?.groups;
    const ability = NetRegexes.ability().exec(line)?.groups;
    // Cull non-relevant lines immediately.

    if (!ability && !targetable)
      continue;

    // Make nameplate toggle lines if and only if the user has specified them.
    if (targetable) {
      if (targetArray !== null && targetArray.includes(targetable.name)) {
        const targetEntry = parseNameToggleToEntry(targetable);
        entries.push(targetEntry);
      }
      continue;
    }

    // At this point, only ability lines are left.
    if (ability) {
      // Cull non-enemy lines
      // TODO: Handle this using the raid emulator's line parsing functionality.
      if (!ability.sourceId.startsWith('4'))
        continue;
      const abilityEntry = parseAbilityToEntry(ability);
      entries.push(abilityEntry);

      // Store off exact times for each ability's usages for later sync commenting
      abilityTimeMap[ability.id] ??= [];
      const timestamp = Date.parse(ability.timestamp);
      if (!abilityTimeMap[ability.id]?.includes(timestamp))
        abilityTimeMap[ability.id]?.push(timestamp);
      continue;
    }

    // There shouldn't be any way that we get here,
    // but if we do, something is drastically wrong.
    // Notify the user of the malformed line and continue.
    const errString = `Warning: Potentially malformed/corrupted log line found:\n${line}\n\n`;
    console.log(errString);
    continue;
  }

  if (entries.length === 0) {
    console.error('Fight not found');
    process.exit(-2);
  } else {
    return { entries: entries, abilityTimes: abilityTimeMap };
  }
};

const ignoreTimelineAbilityEntry = (entry: TimelineEntry, args: Partial<ExtendedArgs>): boolean => {
  const abilityName = entry.abilityName;
  const abilityId = entry.abilityId;
  const combatant = entry.combatant;

  const ia = args.ignore_ability ?? null;
  const ii = args.ignore_id ?? null;
  const ic = args.ignore_combatant ?? null;
  const oc = args.only_combatant ?? null;
  // Ignore auto-attacks named "attack"
  if (abilityName?.toLowerCase() === 'attack')
    return true;

  // Ignore abilities from NPC allies.
  if (combatant !== undefined && ignoredCombatants.includes(combatant))
    return true;

  // Ignore abilities by name.
  if (abilityName !== undefined && ia !== null && ia.includes(abilityName))
    return true;

  // Ignore abilities by ID
  if (abilityId !== undefined && ii !== null && ii.includes(abilityId))
    return true;

  // Ignore combatants by name
  if (combatant !== undefined && ic !== null && ic.includes(combatant))
    return true;

  // If only-combatants was specified, ignore all combatants not in the list.
  if (combatant !== undefined && oc !== null && !oc.includes(combatant))
    return true;
  return false;
};

const findTimeDifferences = (lastTimeDiff: number): { diffSeconds: number; drift: number } => {
  if (lastTimeDiff === 0)
    return { diffSeconds: 0, drift: 0 };
  let diffSeconds = Math.floor(lastTimeDiff / 1000);
  const diffMilliSeconds = lastTimeDiff - diffSeconds * 1000;
  let drift = 0;

  // Find the difference in tenths of a second.
  const diffTenthSeconds = Math.floor(diffMilliSeconds / 100) / 10;

  // Adjust full-second difference.
  diffSeconds += diffTenthSeconds;

  // Round up a tenth of a second.
  if (diffMilliSeconds > 600) {
    diffSeconds += 0.1;
  } else if (diffMilliSeconds > 500) {
    // Round up, warning of exceptional drift.
    diffSeconds += 0.1;
    drift = diffMilliSeconds - 1000;
  } else if (diffMilliSeconds > 400) {
    // Round down, warning of exceptional drift
    drift = diffMilliSeconds;
  } else {
    // If <20ms then there's no need to adjust sec or drift
    true;
  }
  return { diffSeconds: diffSeconds, drift: drift };
};

const assembleTimelineStrings = (
  entries: TimelineEntry[],
  abilityTimes: { [abilityId: string]: number[] },
  start: Date,
  args: Partial<ExtendedArgs>,
  fight?: FightEncInfo,
): string[] => {
  const assembled: string[] = [];
  let lastAbilityTime = start.getTime();
  let timelinePosition = 0;
  let lastEntry: TimelineEntry = { time: lastAbilityTime.toString(), lineType: 'None' };
  if (fight !== undefined && fight.sealName !== undefined) {
    const zoneMessage = SFuncs.toProperCase(fight.sealName);
    const tlString = `0.0 "--sync--" sync / 00:0839::${zoneMessage} will be sealed off/ window 0,1`;
    assembled.push(tlString);
  } else {
    assembled.push('0.0 "--sync--" sync /Engage!/ window 0,1');
  }

  // If the user entered phase information,
  // process it and store it off.
  const phases: { [name: string]: number } = {};
  if (typeof args.phase === 'string') {
    for (const phase of args.phase) {
      const ability = phase.split(':')[0];
      const time = phase.split(':')[1];
      if (ability !== undefined && time !== undefined)
        phases[ability] = parseFloat(time);
    }
  }

  for (const entry of entries) {
    // Ignore auto-attacks, NPC allies, and abilities based on user-entered flags.
    if (entry.lineType === 'ability' && ignoreTimelineAbilityEntry(entry, args))
      continue;

    // Ignore AoE spam
    if (lastEntry.time === entry.time) {
      if (
        entry.abilityId !== undefined &&
        lastEntry.abilityId !== undefined &&
        entry.abilityId === lastEntry.abilityId
      )
        continue;
    }

    // Ignore targetable lines if not specified
    if (entry.lineType === 'targetable' && args.include_targetable === null)
      continue;

    // Find out how long it's been since the last ability.
    const lineTime = Date.parse(entry.time);
    const lastTimeDiff = lineTime - lastAbilityTime;
    const timeInfo = findTimeDifferences(lastTimeDiff);

    // Set the time, adjusting to phases if necessary.
    const abilityId = entry.abilityId ?? 'Unknown';
    const phaseTime = abilityId ? phases[abilityId] : timelinePosition;
    if (
      !(entry.lineType === 'ability' && abilityId && Object.keys(phases).includes(abilityId))
    ) {
      timelinePosition += timeInfo.diffSeconds;
    } else if (abilityId && phaseTime && Object.keys(phases).includes(abilityId)) {
      timelinePosition = phaseTime;
      delete phases[abilityId];
    }

    // We're done manipulating time, so save where we are for the next loop.
    lastAbilityTime = lineTime;

    // If a given use of an ability is within 2.5 seconds of another use,
    // we want to comment it by default.
    const checkAbilityTime = (element: number) => Math.abs(lineTime - element) <= 2500;
    const lineAbilityTimeList = abilityTimes[abilityId];
    let commentSync = '';
    if (lineAbilityTimeList !== undefined && lineAbilityTimeList.length > 1) {
      const overlaps = lineAbilityTimeList.filter(checkAbilityTime).length > 1;
      commentSync = overlaps ? '#' : '';
    }

    if (entry.lineType !== 'nameToggle') {
      const ability = entry.abilityName ?? 'Unknown';
      const combatant = entry.combatant ?? 'Unknown';
      const newEntry = `${
        timelinePosition.toFixed(1)
      } "${ability}" ${commentSync}sync / 1[56]:[^:]*:${combatant}:${abilityId}:/`;
      assembled.push(newEntry);
    } else {
      const targetable = entry.targetable ? '--targetable--' : '--untargetable--';
      const newEntry = `${timelinePosition.toFixed(1)} "${targetable}"`;
      assembled.push(newEntry);
    }
    lastEntry = entry;
  }
  return assembled;
};

const parseTimelineFromFile = async (
  args: Partial<ExtendedArgs>,
  file: string,
  fight: FightEncInfo,
) => {
  const startTime = fight.startTime;
  const endTime = fight.endTime;
  // All encounters on a collector will guaranteed have a start/end time,
  // but Typescript doesn't know that.
  if (!(startTime && endTime)) {
    console.error('Missing start or end time at specified index.');
    process.exit(1);
  }
  // This logic can probably be split out once we re-enable support for raw start/end times.
  let lines: string[];
  if (fight.logLines !== undefined) {
    lines = fight.logLines;
  } else {
    lines = await extractRawLinesFromLog(
      file,
      TLFuncs.timeFromDate(startTime),
      TLFuncs.timeFromDate(endTime),
    );
  }
  const baseEntries = extractTLEntriesFromLog(
    lines,
    args?.include_targetable ?? null,
  );
  const assembled = assembleTimelineStrings(
    baseEntries.entries,
    baseEntries.abilityTimes,
    startTime,
    args,
    fight,
  );
  return assembled;
};

const printTimelineToConsole = (entryList: string[]): void => {
  if (entryList.length > 0)
    console.log(entryList.join('\n'));
};

const writeTimelineToFile = (entryList: string[], fileName: string, force: boolean): void => {
  const flags = force ? 'w' : 'wx';
  const writer = fs.createWriteStream(fileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });
  if (entryList.length > 0) {
    for (const entry of entryList) {
      writer.write(entry);
      writer.write('\n');
    }
  }
  writer.close();
};

const makeTimeline = async () => {
  let assembled: string[] = [];
  if (
    typeof args.report_id === 'string' && typeof args.report_fight === 'number' &&
    typeof args.key === 'string'
  ) {
    const rawEntries = await parseReport(args.report_id, args.report_fight, args.key);
    // Account for the possibility of a malformed response that somehow
    // ends up with a defined encounter but produces bogus or no entries.
    if (rawEntries.entries.length === 0 || rawEntries.entries[0] === undefined) {
      console.error('No encounter found in the report at that fight index.');
      process.exit(-2);
    }
    const startTime = new Date(rawEntries.entries[0].time);
    assembled = assembleTimelineStrings(
      rawEntries.entries,
      rawEntries.abilityTimes,
      startTime,
      args,
    );
  }
  if (typeof args.file === 'string' && args.file.length > 0) {
    const store = typeof args.search_fights === 'number' && args.search_fights > 0;
    const collector = await makeCollectorFromPrepass(args.file, store);
    if (args['search_fights'] === -1) {
      printCollectedFights(collector);
      process.exit(0);
    }
    if (args.search_zones === -1) {
      printCollectedZones(collector);
      process.exit(0);
    }
    // All fights are 1-indexed on collectors,
    // so we subtract 1 from the user's 1-indexed selection.
    if (args.search_fights) {
      const fight = collector.fights[args.search_fights - 1];
      if (fight === undefined) {
        console.error('No fight found at specified index');
        process.exit(-2);
      }
      assembled = await parseTimelineFromFile(args, args.file, fight);
    }
  }
  if (typeof args.output_file === 'string') {
    const force = args.force !== null;
    writeTimelineToFile(assembled, args.output_file, force);
  }
  if (args.output_file === null)
    printTimelineToConsole(assembled);
  process.exit(0);
};

void makeTimeline();
