import fs from 'fs';
import readline from 'readline';

import NetRegexes from '../../resources/netregexes';
import { NetMatches } from '../../types/net_matches';

import { LogUtilArgParse, TimelineArgs } from './arg_parser';
import { EncounterCollector, TLFuncs } from './encounter_tools';

// TODO: Add support for auto-commenting repeated abilities
// that can't be synced but should be visible.

// TODO: Add support for assigning sync windows to specific abilities,
// with or without phase conditions.

// TODO: Add support for auto-generating loops.

// TODO: Add FFLogs report parsing support.

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
const ignoredCombatants = [
  'Eos',
  'Selene',
  'Garuda-Egi',
  'Titan-Egi',
  'Ifrit-Egi',
  'Carbuncle',
  'Ruby Ifrit',
  'Emerald Garuda',
  'Topaz Titan',
  'Emerald Carbuncle',
  'Topaz Carbuncle',
  'Ruby Carbuncle',
  'Moonstone Carbuncle',
  'Rook Autoturret',
  'Bishop Autoturret',
  'Demi-Bahamut',
  'Demi-Phoenix',
  'Earthly Star',
  'Seraph',
  'Automaton Queen',
  'Bunshin',
  'Esteem',
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
];

const timeStampValidate = (timeStr?: string) => {
  if (timeStr === undefined)
    return false;
  return /\d{2}:\d{2}:\d{2}\.\d{3}/.test(timeStr);
};

const timelineParse = new LogUtilArgParse();

timelineParse.parser.addArgument(['--output-file', '-of'], {
  nargs: '?',
  type: 'string',
  help: 'Optional location to write timeline to file.',
});

timelineParse.parser.addArgument(['--start', '-s'], {
  nargs: '?',
  type: 'string',
  help: 'Timestamp to start assembling an encounter timeline, e.g. 12:34:56.789',
});

timelineParse.parser.addArgument(['--end', '-e'], {
  nargs: '?',
  type: 'string',
  help: 'Timestamp to end assembling an encounter timeline, e.g. 12:34:56.789',
});

timelineParse.parser.addArgument(['--ignore-id', '-ii'], {
  nargs: '?',
  constant: [],
  help: 'Ability IDs to ignore, e.g. 27EF',
});

timelineParse.parser.addArgument(['--ignore-ability', '-ia'], {
  nargs: '+',
  constant: [],
  help: 'Ability names to ignore, e.g. Attack',
});

timelineParse.parser.addArgument(['--ignore-combatant', '-ic'], {
  nargs: '*',
  constant: [],
  help: 'Combatant names to ignore, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--only-combatant', '-oc'], {
  nargs: '*',
  constant: [],
  help: 'Only the listed combatants will generate timeline data, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--phase', '-p'], {
  nargs: '?',
  type: 'string',
  help: 'Abilities that indicate a new phase, and the time to jump to, e.g. 28EC:1000',
});

timelineParse.parser.addArgument(['--include-targetable', '-it'], {
  nargs: '*',
  constant: [],
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
for (const opt of ['search_fights', 'search_zones', 'fight_regex', 'zone_regex']) {
  if (args[opt] !== null)
    numExclusiveArgs++;
}
if (numExclusiveArgs !== 1)
  printHelpAndExit('Error: Must specify exactly one of -lf, -lz, or -fr\n');
if (args['fight_regex'] === '-1')
  printHelpAndExit('Error: -fr must specify a regex\n');
if (args['zone_regex'] === '-1')
  printHelpAndExit('Error: -zr must specify a regex\n');

if (args.file && numExclusiveArgs !== 1 && !(args.start && args.end)) {
  printHelpAndExit(
    'Error: -s and -e must be specified if not using one of -lf, -lz, -fr, or -zr\ ',
  );
}
if (args.start && !(typeof args.start === 'string' && timeStampValidate(args.start)))
  printHelpAndExit('Error: Timestamp must be entered exactly as HH:MM:SS.DDD, as 12:34:56:.789');
if (args.end && !(typeof args.end === 'string' && timeStampValidate(args.end)))
  printHelpAndExit('Error: Timestamp must be entered exactly as HH:MM:SS.DDD, as 12:34:56:.789');

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

const parseGameLogToEntry = (matches: NetMatches['GameLog']): TimelineEntry => {
  const entry: TimelineEntry = {
    time: matches.timestamp,
    lineType: 'zoneSeal',
    zoneSeal: { seal: matches.line, code: '0839' },
  };
  return entry;
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

const extractTLEntries = async (
  fileName: string,
  start: string,
  end: string,
  targetArray?: string[],
): Promise<TimelineEntry[]> => {
  const entries: TimelineEntry[] = [];
  let started = false;
  const lines: string[] = [];
  // Read out the relevant encounter lines in a pre-pass
  const file = readline.createInterface({
    input: fs.createReadStream(fileName),
  });

  for await (const line of file) {
    const lineTimeStamp = line.substring(14, 26);
    if (start === lineTimeStamp)
      started = start === lineTimeStamp;
    if (started)
      lines.push(line);
    if (end === lineTimeStamp)
      file.close();
  }

  // We have exactly the lines relevant to our encounter now.
  for (const line of lines) {
    // Cull non-relevant lines immediately.
    if (!['00', '21', '22', '34'].includes(line.substring(0, 2)))
      continue;

    // Check for zone seals.
    const gameLog = NetRegexes.gameLog().exec(line)?.groups;
    if (gameLog?.code === '0839' && gameLog.line.includes('will be sealed off')) {
      const glEntry = parseGameLogToEntry(gameLog);
      entries.push(glEntry);
      continue;
    }
    // Cull all remaining gameLog lines, as well as all lines not from enemies.
    // Nameplate change lines are retained.
    if (!['21', '22', '34'].includes(line.substring(0, 2)) || line.substring(37, 40) === '400')
      continue;

    // Make nameplate toggle lines if and only if the user has specified them.
    const targetable = NetRegexes.nameToggle().exec(line)?.groups;
    if (targetable) {
      if (targetArray?.length && targetArray.length > 0) {
        const targetEntry = parseNameToggleToEntry(targetable);
        entries.push(targetEntry);
      }
      continue;
    }

    // At this point, only enemy combat lines are left.
    const ability = NetRegexes.ability().exec(line)?.groups;
    if (ability) {
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
  }
  return entries;
};

const ignoreTimelineAbilityEntry = (entry: TimelineEntry, args: ExtendedArgs): boolean => {
  const abilityName = entry.abilityName;
  const abilityId = entry.abilityId;
  const combatant = entry.combatant;
  // Ignore auto-attacks named "attack"
  if (abilityName?.toLowerCase() === 'attack')
    return true;

  // Ignore abilities from NPC allies.
  if (combatant && ignoredCombatants.includes(combatant))
    return true;

  // Ignore abilities by name.
  if (abilityName && args['ignore-ability'] && args['ignore-ability'].includes(abilityName))
    return true;

  // Ignore abilities by ID
  if (abilityId && args['ignore-id'] && args['ignore-id'].includes(abilityId))
    return true;

  // Ignore combatants by name
  if (combatant && args['ignore-combatant'] && args['ignore-combatant'].includes(combatant))
    return true;

  // If only-combatants was specified, ignore all combatants not in the list.
  if (combatant && args['only-combatant'] && !args['only-combatant'].includes(combatant))
    return true;
  return false;
};

const findTimeDifferences = (lastTimeDiff: number): { diffSeconds: number; drift: number } => {
  let diffSeconds = lastTimeDiff % 1000000;
  const diffMicroSeconds = lastTimeDiff - diffSeconds;
  let drift = 0;

  // Find the difference in tenths of a second.
  const diffTenthSeconds = diffMicroSeconds / 100000;

  // Adjust full-second difference.
  diffSeconds += diffTenthSeconds;

  // Round up a tenth of a second.
  if (diffMicroSeconds > 60000) {
    diffSeconds += 0.1;
  } else if (diffMicroSeconds > 50000) {
    // Round up, warning of exceptional drift.
    diffSeconds += 0.1;
    drift = diffMicroSeconds - 100000;
  } else if (diffMicroSeconds > 40000) {
    // Round down, warning of exceptional drift
    drift = diffMicroSeconds;
  } else {
    // If <20ms then there's no need to adjust sec or drift
    true;
  }
  return { diffSeconds: diffSeconds, drift: drift };
};

const assembleTimelineStrings = (
  entries: TimelineEntry[],
  start: string,
  args: ExtendedArgs,
): string[] => {
  const assembled: string[] = [];
  let lastAbilityTime = parseInt(start);
  let lastEntry: TimelineEntry = { time: start ?? 'Unknown', lineType: 'None' };
  if (entries[0]?.zoneSeal) {
    const zoneMessage = TLFuncs.toProperCase(entries[0].zoneSeal.seal);
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
    if (entry.lineType === 'targetable' && !args['include-targetable'])
      continue;

    // Find out how long it's been since the last ability.
    const lineTime = TLFuncs.timeFromString(entry.time);
    const lastTimeDiff = lineTime - lastAbilityTime;
    const timeInfo = findTimeDifferences(lastTimeDiff);

    let timelinePosition = 0;

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
      const newEntry =
        `${timelinePosition} "${ability}" sync / 1[56]:[^:]*:${combatant}:${abilityId}:/`;
      assembled.push(newEntry);
    } else {
      const targetable = entry.targetable ? '--targetable--' : '--untargetable--';
      const newEntry = `${timelinePosition} "${targetable}"`;
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
    if (args['search_fights'] === -1) {
      TLFuncs.printCollectedFights(collector);
      process.exit(0);
    }
    if (args['search_zones'] === -1) {
      TLFuncs.printCollectedZones(collector);
      process.exit(0);
    }
    // All fights are 1-indexed on collectors,
    // so we subtract 1 from the user's 1-indexed selection.
    if (args['search_fights']) {
      const fight = collector.fights[args['search_fights'] - 1];
      if (!fight) {
        console.error('No fight found at specified index');
        process.exit(-1);
      }
      const startTime = TLFuncs.timeFromDate(fight.startTime);
      const endTime = TLFuncs.timeFromDate(fight.endTime);
      const baseEntries = await extractTLEntries(
        args.file,
        startTime,
        endTime,
        args['include-targetable'],
      );
      const assembled = assembleTimelineStrings(baseEntries, startTime, args);
      if (args['output-file'] && typeof args['output-file'] === 'string') {
        const force = args.force !== undefined;
        writeTimelineToFile(assembled, args['output-file'], force);
      }
      if (!args['output-file'])
        printTimelineToConsole(assembled);
      process.exit(0);
    }
  }
};

void makeTimeline();
