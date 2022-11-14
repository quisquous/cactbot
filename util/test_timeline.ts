import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { Namespace } from 'argparse';
import chalk from 'chalk';

import { RaidbossData } from '../types/data';
import { LooseTriggerSet, TimelineTrigger } from '../types/trigger';
import LineEvent from '../ui/raidboss/emulator/data/network_log_converter/LineEvent';
import LogRepository from '../ui/raidboss/emulator/data/network_log_converter/LogRepository';
import ParseLine from '../ui/raidboss/emulator/data/network_log_converter/ParseLine';
import defaultRaidbossOptions from '../ui/raidboss/raidboss_options';
import { Timeline, TimelineUI } from '../ui/raidboss/timeline';
import { Event, Sync, Text } from '../ui/raidboss/timeline_parser';

import { walkDirSync } from './file_utils';
import { LogUtilArgParse } from './logtools/arg_parser';
import { printCollectedFights } from './logtools/encounter_printer';
import { EncounterCollector } from './logtools/encounter_tools';

const rootDir = 'ui/raidboss/data';

const defaultDriftWarn = 0.2;
const defaultDriftFail = 1.0;

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
  timeline: string,
  driftWarn: number,
  driftFail: number,
): Promise<void> => {
  const repo = new LogRepository();
  const lineEvents = lines.map((line) => ParseLine.parse(repo, line)).filter((l) =>
    l !== undefined
  ) as LineEvent[];
  return await testLineEvents(lineEvents, timeline, driftWarn, driftFail);
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
  const importPath = '../' + path.relative(process.cwd(), triggersFile).replace('.ts', '.js');
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

  const startTimestamp = lines[0]?.timestamp ?? 0;

  testTimeline.timebase = startTimestamp;
  testTimeline._OnUpdateTimer(startTimestamp);

  for (const line of lines) {
    testTimeline.OnLogLine(line.convertedLine, line.timestamp);
    const baseTimestamp = testTimeline.timebase || startTimestamp || line.timestamp;
    const fightNow = (line.timestamp - baseTimestamp) / 1000;

    testTimeline.SyncTo(fightNow, line.timestamp);
    testTimeline._OnUpdateTimer(line.timestamp);
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

  if (ui.triggers.length > 0) {
    console.log('Triggers:');

    for (const trigger of ui.triggers) {
      const delta = (trigger.timestamp - trigger.timebase) / 1000 - trigger.text.time;
      const invertedDelta = delta * -1;
      const sign = invertedDelta > 0 ? '+' : ' ';
      console.log(
        chalk.green(`%s | %s`),
        `${sign}${invertedDelta.toFixed(3)}`.padStart(12),
        trigger.trigger.id,
      );
    }
  }
};

class TestTimelineNamespaceRequired extends Namespace {
  // FFLogs params
  'report': string | null;
  'key': string | null;
  'fight': string | null;

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

const testTimelineFileFunc = async (args: TestTimelineNamespace): Promise<void> => {
  if (typeof args.file !== 'string' || !fs.existsSync(args.file)) {
    console.error('Must pass a valid file with -f');
    return;
  }

  if (typeof args.timeline !== 'string' || findTriggersFile(args.timeline) === undefined) {
    console.error('Must pass a valid timeline file with -t');
    return;
  }

  const file = args.file;
  const timeline = args.timeline;
  const driftWarn = args.drift_warning ?? defaultDriftWarn;
  const driftFail = args.drift_failure ?? defaultDriftFail;

  if (typeof args.start === 'string' || typeof args.end === 'string') {
    await testTimelineFileStartEnd(args, file, timeline);
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

  return testLineArray(fight.logLines ?? [], timeline, driftWarn, driftFail);
};

const testTimelineFileStartEnd = async (
  args: TestTimelineNamespace,
  logFilePath: string,
  timeline: string,
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
  return await testLineEvents(lineEvents, timeline, driftWarn, driftFail);
};

const testTimelineReportFunc = (_args: TestTimelineNamespace): Promise<void> => {
  throw new Error('FFLogs report testing is not implemented yet');
};

const testTimelineFunc = async (args: TestTimelineNamespace): Promise<void> => {
  if (typeof args.file === 'string')
    return testTimelineFileFunc(args);
  if (typeof args.report === 'string')
    return testTimelineReportFunc(args);

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

  public triggers: {
    trigger: Partial<TimelineTrigger<RaidbossData>>;
    matches: RegExpExecArray;
    text: Text;
    timestamp: number;
    timebase: number;
  }[] = [];

  public fightNow = 0;

  public constructor(protected override timeline: TestTimeline) {
    super();
  }

  public override OnSyncTime(fightNow: number, _running: boolean): void {
    this.fightNow = fightNow;
  }

  public override OnTrigger(
    trigger: Partial<TimelineTrigger<RaidbossData>>,
    matches: RegExpExecArray,
    currentTime: number,
  ): void {
    const foundText = this.timeline.texts.find((text) =>
      text.type === 'trigger' && text.trigger === trigger
    );
    if (!foundText) {
      console.error(chalk.red(`Trigger fired ${trigger.id ?? '???'} with no matched texts entry!`));
      return;
    }
    this.triggers.push({
      trigger: trigger,
      text: foundText,
      matches: matches,
      timestamp: currentTime,
      timebase: this.timeline.timebase,
    });
  }
}

void main();
