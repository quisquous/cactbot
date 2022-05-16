import fs from 'fs';
import readline from 'readline';

import NetRegexes from '../../resources/netregexes';
import PetData from '../../resources/pet_names';
import { NetMatches } from '../../types/net_matches';

import { LogUtilArgParse, TimelineArgs } from './arg_parser';
import { EncounterCollector, FightEncInfo, TLFuncs } from './encounter_tools';

// TODO: Add support for auto-commenting repeated abilities
// that can't be synced but should be visible.

// TODO: Add support for assigning sync windows to specific abilities,
// with or without phase conditions.

// TODO: Add support for auto-generating loops.

// TODO: Add FFLogs report parsing support.

// TODO: Reinstate support for using raw start/end times
// rather than force fight indexing.

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
  [index: string]: string | string[] | number | boolean | undefined;
  'output-file'?: string;
  'start'?: string;
  'end'?: string;
  'ignore-id'?: string[];
  'ignore-ability'?: string[];
  'ignore-combatant'?: string[];
  'only-combatant'?: string[];
  'phase'?: string;
  'include-targetable'?: string[];
};

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
const args = timelineParse.parser.parseArgs() as ExtendedArgs;

const printHelpAndExit = (errString: string): void => {
  console.error(errString);
  timelineParse.parser.printHelp();
  process.exit(-1);
};

// TODO: Revisit this logic when we re-add FFLogs support.
if (args.file === null)
  printHelpAndExit('Error: Must specify -f\n');
if (!args.file?.includes('.log'))
  printHelpAndExit('Error: Must specify an FFXIV ACT log file, as log.log\n');
let numExclusiveArgs = 0;
for (const opt of ['search_fights', 'search_zones']) {
  if (args[opt] !== null)
    numExclusiveArgs++;
}
if (numExclusiveArgs !== 1)
  printHelpAndExit('Error: Must specify exactly one of -lf or -lz\n');
if (args.fight_regex === '-1')
  printHelpAndExit('Error: Timeline generation does not currently support -fr\n');
if (args.zone_regex === '-1')
  printHelpAndExit('Error: Timeline generation does not currently support -zr\n');

const makeCollectorFromPrepass = async (fileName: string) => {
  const collector = new EncounterCollector();
  const lineReader = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  for await (const line of lineReader) {
    // TODO: this could be more efficient if it stopped when it found the requested encounter.
    collector.process(line);
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

const extractRawLines = async (fileName: string, start: string, end: string): Promise<string[]> => {
  const lines: string[] = [];
  const file = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  let started = false;
  for await (const line of file) {
    // This will fail on lines with 3-digit identifiers,
    // but that's okay because those will never be start lines.
    const lineTimeStamp = line.substring(14, 26);
    if (start === lineTimeStamp && !started)
      started = start === lineTimeStamp;
    if (started)
      lines.push(line);
    if (lineTimeStamp === end)
      file.close();
  }
  return lines;
};

const extractTLEntries = async (
  fileName: string,
  start: Date,
  end: Date,
  targetArray?: string[],
): Promise<TimelineEntry[]> => {
  const entries: TimelineEntry[] = [];
  const fileStart = TLFuncs.timeFromDate(start);
  const fileEnd = TLFuncs.timeFromDate(end);
  const lines: string[] = await extractRawLines(fileName, fileStart, fileEnd);

  // We have exactly the lines relevant to our encounter now.
  for (const line of lines) {
    const targetable = NetRegexes.nameToggle().exec(line)?.groups;
    const ability = NetRegexes.ability().exec(line)?.groups;
    // Cull non-relevant lines immediately.

    if (!ability && !targetable)
      continue;

    // Make nameplate toggle lines if and only if the user has specified them.
    if (targetable) {
      if (targetArray && targetArray.includes(targetable.name)) {
        const targetEntry = parseNameToggleToEntry(targetable);
        entries.push(targetEntry);
      }
      continue;
    }

    // At this point, only ability lines are left.
    if (ability) {
      // Cull non-enemy lines
      if (ability.sourceId.substring(0, 3) !== '400')
        continue;
      const abilityEntry = parseAbilityToEntry(ability);
      entries.push(abilityEntry);
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
    process.exit(-1);
  } else {
    return entries;
  }
};

const ignoreTimelineAbilityEntry = (entry: TimelineEntry, args: ExtendedArgs): boolean => {
  const abilityName = entry.abilityName;
  const abilityId = entry.abilityId;
  const combatant = entry.combatant;

  const ia = args.ignore_ability as string[];
  const ii = args.ignore_id as string[];
  const ic = args.ignore_combatant as string[];
  const oc = args.only_combatant as string[];
  // Ignore auto-attacks named "attack"
  if (abilityName?.toLowerCase() === 'attack')
    return true;

  // Ignore abilities from NPC allies.
  if (combatant && ignoredCombatants.includes(combatant))
    return true;

  // Ignore abilities by name.
  if (abilityName && ia && ia.includes(abilityName))
    return true;

  // Ignore abilities by ID
  if (abilityId && ii && ii.includes(abilityId))
    return true;

  // Ignore combatants by name
  if (combatant && ic && ic.includes(combatant))
    return true;

  // If only-combatants was specified, ignore all combatants not in the list.
  if (combatant && oc && !oc.includes(combatant))
    return true;
  return false;
};

const findTimeDifferences = (lastTimeDiff: number): { diffSeconds: number; drift: number } => {
  if (lastTimeDiff === 0)
    return { diffSeconds: 0, drift: 0 };
  let diffSeconds = Math.floor(lastTimeDiff / 1000);
  const diffMilliSeconds = lastTimeDiff - (diffSeconds * 1000);
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
  fight: FightEncInfo,
  entries: TimelineEntry[],
  start: Date,
  args: ExtendedArgs,
): string[] => {
  const assembled: string[] = [];
  let lastAbilityTime = (start.getTime());
  let timelinePosition = 0;
  let lastEntry: TimelineEntry = { time: lastAbilityTime.toString(), lineType: 'None' };
  if (fight.sealName) {
    const zoneMessage = TLFuncs.toProperCase(fight.sealName);
    const tlString = `0.0 "--sync--" sync / 00:0839::${zoneMessage} will be sealed off/ window 0,1`;
    assembled.push(tlString);
  } else {
    assembled.push('0.0 "--sync--" sync /Engage!/ window 0,1');
  }

  for (const entry of entries) {
    // Ignore auto-attacks, NPC allies, and abilities based on user-entered flags.
    if (entry.lineType === 'ability' && ignoreTimelineAbilityEntry(entry, args))
      continue;

    // Ignore AoE spam
    if (lastEntry.time === entry.time) {
      if (entry.abilityId && lastEntry.abilityId && entry.abilityId === lastEntry.abilityId)
        continue;
    }

    // Ignore targetable lines if not specified
    if (entry.lineType === 'targetable' && !args.include_targetable)
      continue;

    // Find out how long it's been since the last ability.
    const lineTime = Date.parse(entry.time);
    const lastTimeDiff = lineTime - lastAbilityTime;
    const timeInfo = findTimeDifferences(lastTimeDiff);

    // If the user entered phase information,
    // process it and store it off.
    const phases: { [name: string]: number } = {};
    if (args.phase) {
      for (const phase of args.phase) {
        const ability = phase.split(':')[0];
        const time = phase.split(':')[1];
        if (ability && time)
          phases[ability] = parseInt(time);
      }
    }

    // Set the time, adjusting to phases if necessary.
    const abilityName = entry.abilityName ?? 'Unknown';
    const phaseTime = phases[abilityName] ?? timelinePosition;
    if (
      !(entry.lineType === 'ability' && Object.keys(phases).includes(abilityName))
    ) {
      timelinePosition += timeInfo.diffSeconds;
    } else if (abilityName && Object.keys(phases).includes(abilityName)) {
      timelinePosition = phaseTime;
      delete phases[abilityName];
    }

    // We're done manipulating time, so save where we are for the next loop.
    lastAbilityTime = lineTime;

    if (entry.lineType !== 'nameToggle') {
      const ability = entry.abilityName ?? 'Unknown';
      const abilityId = entry.abilityId ?? 'Unknown';
      const combatant = entry.combatant ?? 'Unknown';
      const newEntry = `${
        timelinePosition.toFixed(1)
      } "${ability}" sync / 1[56]:[^:]*:${combatant}:${abilityId}:/`;
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

const printTimelineToConsole = (entryList: string[]): void => {
  if (entryList.length > 0)
    console.log(entryList.join('\n'));
};

const writeTimelineToFile = (entryList: string[], fileName: string, force: boolean): void => {
  const flags = force ? 'wx' : 'w';
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
    writer.close();
  }
};

const makeTimeline = async () => {
  if (args.file) {
    const collector = await makeCollectorFromPrepass(args.file);
    if (args.search_fights === -1) {
      TLFuncs.printCollectedFights(collector);
      process.exit(0);
    }
    if (args.search_zones === -1) {
      TLFuncs.printCollectedZones(collector);
      process.exit(0);
    }
    // All fights are 1-indexed on collectors,
    // so we subtract 1 from the user's 1-indexed selection.
    if (args.search_fights) {
      const fight = collector.fights[args.search_fights - 1];
      if (!fight) {
        console.error('No fight found at specified index');
        process.exit(-1);
      }
      const startTime = fight.startTime;
      const endTime = fight.endTime;
      // All encounters on a collector will guaranteed have a start/end time,
      // but Typescript doesn't know that.
      if (!(startTime && endTime)) {
        console.error('Missing start or end time at specified index.');
        process.exit(1);
      }
      const baseEntries = await extractTLEntries(
        args.file,
        startTime,
        endTime,
        args.include_targetable as string[],
      );
      const assembled = assembleTimelineStrings(fight, baseEntries, startTime, args);
      if (args.output_file && typeof args.output_file === 'string') {
        const force = args.force !== undefined;
        writeTimelineToFile(assembled, args.output_file, force);
      }
      if (!args.output_file)
        printTimelineToConsole(assembled);
      process.exit(0);
    }
  }
};

void makeTimeline();
