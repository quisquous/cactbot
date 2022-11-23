import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { Namespace } from 'argparse';
import chalk from 'chalk';

import { logDefinitionsVersions } from '../../resources/netlog_defs';
import { LooseTriggerSet } from '../../types/trigger';
import LineEvent from '../../ui/raidboss/emulator/data/network_log_converter/LineEvent';
import LogRepository from '../../ui/raidboss/emulator/data/network_log_converter/LogRepository';
import ParseLine from '../../ui/raidboss/emulator/data/network_log_converter/ParseLine';
import defaultRaidbossOptions from '../../ui/raidboss/raidboss_options';
import { Timeline, TimelineUI } from '../../ui/raidboss/timeline';
import { Event, Sync } from '../../ui/raidboss/timeline_parser';
import { walkDirSync } from '../file_utils';

import { LogUtilArgParse } from './arg_parser';
import { printCollectedFights } from './encounter_printer';
import { EncounterCollector } from './encounter_tools';
import FFLogs, { FFLogsParsedEntry } from './fflogs';

const rootDir = 'ui/raidboss/data';

const defaultDriftWarn = 0.2;
const defaultDriftFail = 1.0;

const maxFieldId = (fields: { [fieldName: string]: number }): number => {
  return Math.max(...Object.values(fields));
};

const maxAbilityFieldId = maxFieldId(logDefinitionsVersions.latest.Ability.fields);
const maxStartsUsingFieldId = maxFieldId(logDefinitionsVersions.latest.StartsUsing.fields);

const findTriggersFile = (shortName: string): string | undefined => {
  // strip extensions if provided.
  shortName = shortName.replace(/\.(?:[jt]s|txt)$/, '').split(path.sep).join(path.posix.sep);

  let found = undefined;
  walkDirSync(rootDir, (filename) => {
    if (filename.endsWith(`${shortName}.js`) || filename.endsWith(`${shortName}.ts`))
      found = filename;
  });
  return found;
};

const testLineArray = async (
  lines: string[],
  timelineName: string,
  driftWarn: number,
  driftFail: number,
): Promise<void> => {
  const repo = new LogRepository();
  const lineEvents = lines.map((line) => ParseLine.parse(repo, line)).filter((l) =>
    l !== undefined
  ) as LineEvent[];
  return await testLineEvents(lineEvents, timelineName, driftWarn, driftFail);
};

const testLineEvents = async (
  lines: LineEvent[],
  timelineName: string,
  driftWarn: number,
  driftFail: number,
): Promise<void> => {
  const triggersFile = findTriggersFile(timelineName);
  if (triggersFile === undefined) {
    console.error(`Couldn\'t find '${timelineName}', aborting.`);
    process.exit(-2);
  }

  const timelineFile = triggersFile.replace(/\.[jt]s$/, '.txt');
  if (!fs.existsSync(timelineFile)) {
    console.error(`Couldn\'t find '${timelineFile}', aborting.`);
    process.exit(-2);
  }

  // TODO: this block is very duplicated with a number of other scripts.
  const importPath = `../../${path.relative(process.cwd(), triggersFile).replace('.ts', '.js')}`;
  // TODO: Fix dynamic imports in TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const triggerSet = (await import(importPath))?.default as LooseTriggerSet;
  const replacements = triggerSet.timelineReplace ?? [];
  const timelineText = fs.readFileSync(timelineFile).toString();

  const linesString = timelineText.split('\n');

  const zoneId = Array.isArray(triggerSet.zoneId) ? triggerSet.zoneId[0] : triggerSet.zoneId;

  const testTimeline = new TestTimeline(
    timelineText,
    replacements,
    triggerSet.timelineTriggers ?? [],
    triggerSet.timelineStyles ?? [],
    defaultRaidbossOptions,
    zoneId ?? -1,
  );

  // Remove all ignores
  testTimeline.ignores = {};

  const ui = new TestTimelineUI(testTimeline);

  testTimeline.ui = ui;

  const startTimestamp = lines[0]?.timestamp;
  if (lines.length === 0 || startTimestamp === undefined) {
    console.error(`No lines to test`);
    process.exit(-2);
  }

  testTimeline.timebase = startTimestamp;

  for (const line of lines) {
    // Update timer before the log line so that active syncs are up to date.
    testTimeline._OnUpdateTimer(line.timestamp);
    // If this log line matches, it will OnSync and adjust the time as needed.
    testTimeline.OnLogLine(line.convertedLine, line.timestamp);
  }

  console.log('Timeline:');

  for (const record of ui.records) {
    const lineNumber = record.event.lineNumber ?? -1;
    if (record.type === 'missed') {
      console.log(
        chalk.redBright(`      Missed | %s | %s`),
        `${lineNumber}`.padStart(4),
        linesString[lineNumber - 1] ?? '',
      );
      continue;
    }

    const lineStr = linesString[lineNumber - 1] ?? '';
    const delta = (record.timestamp - record.timebase) / 1000 - record.event.time;
    const invertedDelta = delta * -1;
    const sign = invertedDelta > 0 ? '+' : ' ';

    const isDriftFail = Math.abs(delta) > driftFail;
    const isDriftWarn = Math.abs(delta) > driftWarn;
    const color = isDriftFail
      ? 'red'
      : isDriftWarn
      ? 'yellow'
      : 'green';
    console.log(
      chalk[color](`%s | %s | %s`),
      `${sign}${invertedDelta.toFixed(3)}`.padStart(12),
      `${lineNumber}`.padStart(4),
      lineStr,
    );
  }
};

class TestTimelineNamespaceRequired extends Namespace {
  // FFLogs params
  'report_id': string | null;
  'report_fight': number | null;
  'key': string | null;

  // Network log file params
  'file': string | null;
  'start': string | null;
  'end': string | null;
  'search_fights': number | null;

  // Filtering params
  'timeline': string | null;

  // Output format params
  'drift_failure': number;
  'drift_warning': number;
}

type TestTimelineNamespace = Partial<TestTimelineNamespaceRequired>;

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

const testTimelineFileFunc = async (
  args: TestTimelineNamespace,
  timelineName: string,
): Promise<void> => {
  if (typeof args.file !== 'string' || !fs.existsSync(args.file)) {
    console.error('Must pass a valid file with -f');
    return;
  }

  const file = args.file;
  const driftWarn = args.drift_warning ?? defaultDriftWarn;
  const driftFail = args.drift_failure ?? defaultDriftFail;

  if (typeof args.start === 'string' || typeof args.end === 'string') {
    await testTimelineFileStartEnd(args, file, timelineName);
    return;
  }

  const searchFightsIdx = args['search_fights'];
  const collector = await makeCollectorFromPrepass(file, true);

  if (typeof searchFightsIdx !== 'number' || searchFightsIdx <= 0) {
    printCollectedFights(collector);
    return;
  }

  // All fights are 1-indexed on collectors,
  // so we subtract 1 from the user's 1-indexed selection.
  const fight = collector.fights[searchFightsIdx - 1];
  if (fight === undefined) {
    console.error(`No fight found at specified index ${searchFightsIdx}`);
    return;
  }

  if (fight === undefined) {
    console.error('Undefined fight');
    return;
  }

  return testLineArray(fight.logLines ?? [], timelineName, driftWarn, driftFail);
};

const testTimelineFileStartEnd = async (
  args: TestTimelineNamespace,
  logFilePath: string,
  timelineName: string,
): Promise<void> => {
  if (typeof args.start !== 'string') {
    console.error(`Invalid start datetime '${args.start ?? 'null'}', aborting.`);
    return;
  }
  if (typeof args.end !== 'string') {
    console.error(`Invalid start datetime '${args.end ?? 'null'}', aborting.`);
    return;
  }
  if (!fs.existsSync(logFilePath)) {
    console.error(`Couldn\'t find '${logFilePath}', aborting.`);
    process.exit(-2);
  }
  const startDate = new Date(args.start);
  if (isNaN(startDate.getTime())) {
    console.error(`Invalid start datetime '${args.start}', aborting.`);
    process.exit(-2);
  }
  const endDate = new Date(args.end);
  if (isNaN(endDate.getTime())) {
    console.error(`Invalid start datetime '${args.end}', aborting.`);
    process.exit(-2);
  }
  const allLines = fs.readFileSync(logFilePath).toString().split('\n');

  const repo = new LogRepository();
  const lineEvents = allLines.map((line) => ParseLine.parse(repo, line)).filter((l) => {
    const timestamp = l?.timestamp;
    if (timestamp === undefined)
      return false;
    return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
  }) as LineEvent[];

  const driftWarn = args.drift_warning ?? defaultDriftWarn;
  const driftFail = args.drift_failure ?? defaultDriftFail;
  return await testLineEvents(lineEvents, timelineName, driftWarn, driftFail);
};

const convertFFLogsEntryIntoNetworkLog = (entry: FFLogsParsedEntry): string => {
  // Note: this is a simplified ISO timestamp (i.e. ending in Z, no timezone)
  // which is not what ACT emits, but is easier to generate here, and works
  // with the cactbot pipeline, so leaving it as-is rather than generating
  // a more real line.
  const timeStr = new Date(entry.timestamp).toISOString();
  const enemyId = '40000000';

  // Generate fake network log lines.  This generates enough information for a timeline
  // line to match it, and has blanks for all of the other fields.
  if (entry.type === 'cast') {
    return [
      '21',
      timeStr,
      enemyId,
      entry.combatant,
      entry.abilityId,
      entry.abilityName,
      ...Array<string>(maxAbilityFieldId).fill(''),
    ].slice(0, maxAbilityFieldId).join('|');
  } else if (entry.type === 'begincast') {
    return [
      '20',
      timeStr,
      enemyId,
      entry.combatant,
      entry.abilityId,
      entry.abilityName,
      ...Array<string>(maxStartsUsingFieldId).fill(''),
    ].slice(0, maxStartsUsingFieldId).join('|');
  }

  // If some other type (for some reason), emit a fake debug line.
  // No timelines will use this, but it might be helpful for debugging.
  return [
    '254',
    timeStr,
    JSON.stringify(entry),
    '',
  ].join('|');
};

const testTimelineReportFunc = async (
  args: TestTimelineNamespace,
  timelineName: string,
): Promise<void> => {
  if (typeof args.report_id !== 'string') {
    console.error(`Invalid report id ${args.report_id ?? 'null'}`);
    return;
  }
  if (typeof args.report_fight !== 'number') {
    console.error(`Invalid report fight ${args.report_fight ?? 'null'}`);
    return;
  }
  if (typeof args.key !== 'string') {
    console.error(`Invalid report key ${args.key ?? 'null'}`);
    return;
  }

  const entries = await FFLogs.parseReport(args.report_id, args.report_fight, args.key);

  const lines = entries.map(convertFFLogsEntryIntoNetworkLog);
  const driftWarn = args.drift_warning ?? defaultDriftWarn;
  const driftFail = args.drift_failure ?? defaultDriftFail;
  return await testLineArray(lines, timelineName, driftWarn, driftFail);
};

const testTimelineFunc = async (args: TestTimelineNamespace): Promise<void> => {
  if (typeof args.timeline !== 'string' || findTriggersFile(args.timeline) === undefined) {
    console.error('Must pass a valid timeline file with -t');
    return;
  }

  if (typeof args.file === 'string')
    return testTimelineFileFunc(args, args.timeline);
  if (typeof args.report_id === 'string')
    return testTimelineReportFunc(args, args.timeline);

  console.error('Must pass either -f or -r');
};

export const main = async (): Promise<void> => {
  const timelineParse = new LogUtilArgParse();
  const parser = timelineParse.parser;

  // Log file arguments
  parser.addArgument(
    ['-s', '--start'],
    {
      type: 'string',
      help: 'Timestamp of the start, e.g. \'12:34:56.789',
    },
  );
  parser.addArgument(
    ['-e', '--end'],
    { type: 'string', help: 'Timestamp of the end, e.g. \'12:34:56.789' },
  );

  // Output Format arguments
  parser.addArgument(
    ['-df', '--drift_failure'],
    {
      nargs: '?',
      defaultValue: defaultDriftFail,
      type: 'float',
      help:
        `If an entry misses its timestamp by more than this value in seconds, it is displayed in red. Defaults to ${
          defaultDriftFail.toFixed(1)
        }.`,
    },
  );
  parser.addArgument(
    ['-dw', '--drift_warning'],
    {
      nargs: '?',
      defaultValue: defaultDriftWarn,
      type: 'float',
      help:
        `If an entry misses its timestamp by more than this value in seconds, it is displayed in yellow. Defaults to ${
          defaultDriftWarn.toFixed(1)
        }.`,
    },
  );

  const args: TestTimelineNamespace = new TestTimelineNamespaceRequired({});
  timelineParse.parser.parseArgs(undefined, args);

  return testTimelineFunc(args);
};

class TestTimeline extends Timeline {
  declare ui?: TestTimelineUI | undefined;

  protected override _ScheduleUpdate(_fightNow: number): void {
    /* noop */
  }

  private AddRecords(currentTime: number, sync: Sync): void {
    const ui = this.ui;
    if (ui === undefined)
      return;

    const lastRecord = ui.records[ui.records.length - 1];
    const lastEventIdx = lastRecord?.event.sortKey;
    const currentEventIdx = sync.event.sortKey;

    // Ignore repeated syncs to the same id that are roughly at the same time.
    if (lastRecord?.event.sync?.id === sync.id) {
      const timelineTime = (currentTime - this.timebase) / 1000;
      const deltaSeconds = timelineTime - sync.event.time;
      const epsilonSeconds = 0.01;
      if (deltaSeconds < epsilonSeconds)
        return;
    }

    // Push records of any intermediate events that were skipped over.
    if (lastEventIdx !== undefined && currentEventIdx !== undefined) {
      // This naturally ignores jumps into the past.
      for (let idx = lastEventIdx + 1; idx < currentEventIdx; ++idx) {
        const event = this.events[idx];
        if (event === undefined)
          continue;
        // Skip text events with no sync.
        if (event.sync === undefined)
          continue;

        ui.records.push({
          event: event,
          timebase: this.timebase,
          timestamp: currentTime,
          type: 'missed',
        });
      }
    }

    ui.records.push({
      event: sync.event,
      timebase: this.timebase,
      timestamp: currentTime,
      type: 'sync',
    });
  }

  public override SyncTo(fightNow: number, currentTime: number, sync?: Sync): void {
    if (sync !== undefined)
      this.AddRecords(currentTime, sync);

    super.SyncTo(fightNow, currentTime, sync);
  }
}

type TimelineRecord = {
  event: Event;
  timestamp: number;
  timebase: number;
  type: 'sync' | 'missed';
};

class TestTimelineUI extends TimelineUI {
  public records: TimelineRecord[] = [];

  public fightNow = 0;

  public constructor(protected override timeline: TestTimeline) {
    super();
  }

  public override OnSyncTime(fightNow: number, _running: boolean): void {
    this.fightNow = fightNow;
  }
}

void main();
