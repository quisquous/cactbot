import fs from 'fs';
import path from 'path';

import { Namespace, SubParser } from 'argparse';
import chalk from 'chalk';
import inquirer, { QuestionCollection } from 'inquirer';

import { UnreachableCode } from '../resources/not_reached';
import { RaidbossData } from '../types/data';
import { LooseTriggerSet, TimelineTrigger } from '../types/trigger';
import LineEvent from '../ui/raidboss/emulator/data/network_log_converter/LineEvent';
import LogRepository from '../ui/raidboss/emulator/data/network_log_converter/LogRepository';
import ParseLine from '../ui/raidboss/emulator/data/network_log_converter/ParseLine';
import defaultRaidbossOptions from '../ui/raidboss/raidboss_options';
import { Timeline, TimelineUI } from '../ui/raidboss/timeline';
import { Event, Sync, Text } from '../ui/raidboss/timeline_parser';

import { walkDirSync } from './file_utils';

import { ActionChoiceType } from '.';

const rootDir = 'ui/raidboss/data';

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

const testFile = async (
  logFilePath: string,
  start: string,
  end: string,
  timelineName: string,
  driftWarn: number,
  driftFail: number,
): Promise<void> => {
  if (!fs.existsSync(logFilePath)) {
    console.error(`Couldn\'t find '${logFilePath}', aborting.`);
    process.exit(-2);
  }
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) {
    console.error(`Invalid start datetime '${start}', aborting.`);
    process.exit(-2);
  }
  const endDate = new Date(end);
  if (isNaN(endDate.getTime())) {
    console.error(`Invalid start datetime '${end}', aborting.`);
    process.exit(-2);
  }
  const allLines = fs.readFileSync(logFilePath).toString().split('\n');
  const repo = new LogRepository();
  const lineEvents = allLines.map((line) => ParseLine.parse(repo, line)).filter((l) =>
    l !== undefined
  ) as LineEvent[];
  return await testLineEvents(
    lineEvents.filter((l) =>
      l.timestamp >= startDate.getTime() && l.timestamp <= endDate.getTime()
    ),
    timelineName,
    driftWarn,
    driftFail
  );
};

const testLineArray = async (
  lines: string[],
  timelineName: string,
  driftWarn: number,
  driftFail: number
): Promise<void> => {
  const repo = new LogRepository();
  const lineEvents = lines.map((line) => ParseLine.parse(repo, line)).filter((l) =>
    l !== undefined
  ) as LineEvent[];
  return await testLineEvents(lineEvents, timelineName, driftWarn, driftFail);
};

// TODO: Temporary assert
console.assert(testLineArray);

const testLineEvents = async (
  lines: LineEvent[],
  timelineName: string,
  driftWarn: number,
  driftFail: number
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

  const lastLogTimestamp = lines[lines.length - 1]?.timestamp ?? 0;

  testTimeline.timebase = startTimestamp;
  testTimeline._OnUpdateTimer(startTimestamp);

  for (const line of lines) {
    testTimeline.OnLogLine(line.convertedLine, line.timestamp);
    const baseTimestamp = testTimeline.timebase || startTimestamp || line.timestamp;
    const fightNow = (line.timestamp - baseTimestamp) / 1000;

    testTimeline.SyncTo(fightNow, line.timestamp);
    testTimeline._OnUpdateTimer(line.timestamp);
  }

  const allMissedEvents = testTimeline.events.filter((event) =>
    // Only include events that did not fire
    ui.events.find((event2) => event.id === event2.event.id) === undefined &&
    // Only include events with a time greater than 0, excludes "Start"/"--Reset--"/etc
    event.time > 0 &&
    // Only include events that are within the fight's timebase based on start/end lines
    event.time * 1000 <= lastLogTimestamp - testTimeline.timebase &&
    // Only include events that have a sync/jump
    testTimeline.syncEnds.find((sync) => sync.id === event.id)
  );

  console.log('Timeline:');

  const sortedEvents = [
    ...ui.events
  ].sort((l, r) => l.timestamp - r.timestamp);

  let sortedMissedEvents = [
    ...allMissedEvents
  ].sort((l, r) => l.time - r.time).map((event) => {
    return {
      sync: testTimeline.syncEnds.find((sync) => sync.id === event.id),
      event: event,
    };
  });

  for (const firedEvent of sortedEvents) {
    const missedEvents = sortedMissedEvents.filter((event) =>
      event.event.lineNumber !== undefined && firedEvent.event.lineNumber !== undefined &&
      event.event.lineNumber < firedEvent.event.lineNumber
    );
    if (missedEvents.length) {
      sortedMissedEvents = sortedMissedEvents.filter((e) => !missedEvents.includes(e));
      for (const missedEvent of missedEvents) {
        const lineNumber = missedEvent.event.lineNumber ?? -1;
        console.log(
          chalk.red(`      Missed | %s | %s`),
          `${lineNumber}`.padStart(4),
          linesString[lineNumber - 1] ?? ''
        );
      }
    }
    const lineNumber = firedEvent.event.lineNumber ?? -1;
    const lineStr = linesString[lineNumber - 1] ?? '';
    const delta = (firedEvent.timestamp - firedEvent.timebase) / 1000 - firedEvent.event.time;
    const invertedDelta = delta * -1;
    const sign = invertedDelta > 0 ? '+' : ' ';
    const lowWindow = firedEvent.sync.start - firedEvent.sync.time;
    const highWindow = firedEvent.sync.end - firedEvent.sync.time;
    const color =
      delta < lowWindow - driftFail || delta > highWindow + driftFail ? 'red'
      : delta < lowWindow - driftWarn || delta > highWindow + driftWarn ? 'redBright' : 'green';
    console.log(
      chalk[color](`%s | %s | %s`),
      `${sign}${invertedDelta.toFixed(3)}`.padStart(12),
      `${lineNumber}`.padStart(4),
      lineStr);
  }

  if (sortedMissedEvents.length) {
    for (const missedEvent of sortedMissedEvents) {
      const lineNumber = missedEvent.event.lineNumber ?? -1;
      console.log(
        chalk.red(`      Missed | %s | %s`),
        `${lineNumber}`.padStart(4),
        linesString[lineNumber - 1] ?? ''
      );
    }
  }

  console.log('Triggers:');

  for (const trigger of ui.triggers) {
    const delta = (trigger.timestamp - trigger.timebase) / 1000 - trigger.text.time;
    const invertedDelta = delta * -1;
    const sign = invertedDelta > 0 ? '+' : ' ';
    console.log(
      chalk.green(`%s | %s`),
      `${sign}${invertedDelta.toFixed(3)}`.padStart(12),
      trigger.trigger.id);
  }
};

type TestTimelineNamespaceInterface = {
  // FFLogs params
  'report': string | null;
  'key': string | null;
  'fight': string | null;

  // Network log file params
  'file': string | null;
  'start': string | null;
  'end': string | null;
  'search_fights': string | null;

  // Filtering params
  'timeline': string | null;

  // Output format params
  'drift_failure': number;
  'drift_warning': number;
};

class TestTimelineNamespace extends Namespace implements TestTimelineNamespaceInterface {
  'report': string | null;
  'key': string | null;
  'fight': string | null;
  'file': string | null;
  'start': string | null;
  'end': string | null;
  'search_fights': string | null;
  'timeline': string | null;
  'drift_failure' = 1;
  'drift_warning' = 0.2;
}

type TestTimelineInquirerType = {
  [name in keyof TestTimelineNamespaceInterface]: TestTimelineNamespaceInterface[name];
};

type FileOrReportInquirerType = {
  fileOrReport: 'file' | 'report';
};

const testTimelineFileFunc = (args: TestTimelineNamespace): Promise<void> => {
  const questions: QuestionCollection<TestTimelineInquirerType> = [
    {
      type: 'string',
      name: 'file',
      message: 'Input a network log file path: ',
      default: args.file,
      when: () => typeof args.file !== 'string',
      validate: (input: string) => {
        if (fs.existsSync(input))
          return true;

        return false;
      },
    },
    {
      type: 'fuzzypath',
      name: 'timeline',
      message: 'Input a valid trigger JavaScript filename: ',
      rootPath: 'ui',
      suggestOnly: true,
      default: args.timeline ?? '',
      when: () => typeof args.timeline !== 'string',
      validate: (input: string) => {
        if (findTriggersFile(input) !== undefined)
          return true;

        return `Could not find trigger file ${input}`;
      },
    },
    {
      type: 'input',
      name: 'start',
      message: 'Input a start timestamp: ',
      default: args.start,
      when: () => {
        const dateStr = args.start;
        if (dateStr === null)
          return true;
        return isNaN(new Date(dateStr).getTime());
      },
    },
    {
      type: 'input',
      name: 'end',
      message: 'Input an end timestamp: ',
      default: args.end,
      when: () => {
        const dateStr = args.end;
        if (dateStr === null)
          return true;
        return isNaN(new Date(dateStr).getTime());
      },
    },
  ] as const;

  return inquirer.prompt<TestTimelineInquirerType>(questions)
    .then((answers) => {
      const timeline = answers.timeline ?? args.timeline ?? '';
      const file = answers.file ?? args.file ?? '';
      const start = answers.start ?? args.start ?? '';
      const end = answers.end ?? args.end ?? '';
      const driftWarn = answers.drift_warning ?? args.drift_warning ?? '';
      const driftFail = answers.drift_failure ?? args.drift_failure ?? '';
      if (
        typeof timeline === 'string' && typeof file === 'string' &&
        typeof start === 'string' && typeof end === 'string'
      )
        return testFile(file, start, end, timeline, driftWarn, driftFail);
  });
};

const testTimelineReportFunc = (_args: TestTimelineNamespace): Promise<void> => {
  throw new Error('FFLogs report testing is not implemented yet');
};

const testTimelineFunc = (args: Namespace): Promise<void> => {
  if (!(args instanceof TestTimelineNamespace))
    throw new UnreachableCode();
  const questions = [
    {
      type: 'list',
      name: 'fileOrReport',
      message: 'Testing a network log file or an FFLogs report?',
      choices: [{
        name: 'Network Log File',
        value: 'file',
      }, {
        name: 'FFLogs Report',
        value: 'report',
      }],
      default: args.file !== null ? 'file' : args.report !== null ? 'report' : '',
      when: () => typeof args.file !== 'string' && typeof args.report !== 'string',
    },
  ] as const;

  return inquirer.prompt<FileOrReportInquirerType>(questions)
    .then((answers) => {
    if (answers.fileOrReport === 'file' || args.file !== null)
      return testTimelineFileFunc(args);

    return testTimelineReportFunc(args);
  });
};

export const registerTestTimeline = (
  actionChoices: ActionChoiceType,
  subparsers: SubParser,
): void => {
  actionChoices.testTimeline = {
    name: 'Translate Raidboss timeline',
    callback: testTimelineFunc,
    namespace: TestTimelineNamespace,
  };
  const parser = subparsers.addParser('testTimeline', {
    description: actionChoices.testTimeline.name,
  });

  // Add main input vector, fflogs report or network log file
  const group = parser.addMutuallyExclusiveGroup();
  group.addArgument(['-r', '--report'], { help: 'The ID of an FFLogs report' });
  group.addArgument(
      ['-f',
      '--file'],
      {
      type: 'string',
      help: 'The path of the log file',
      }
  );

  // Report arguments
  parser.addArgument(
      ['-k',
      '--key'], {
      help: 'The FFLogs API key to use, from https://www.fflogs.com/accounts/changeuser',
      type: 'string',
  });
  parser.addArgument(
      ['-rf',
      '--fight'], {
      type: 'int',
      help: 'Fight ID of the report to use. Defaults to longest in the report',
  });

  // Log file arguments
  parser.addArgument(
      ['-s',
      '--start'], {
        type: 'string',
      help: 'Timestamp of the start, e.g. \'12:34:56.789',
  });
  parser.addArgument(
      ['-e', '--end'], { type: 'string', help: 'Timestamp of the end, e.g. \'12:34:56.789' });
  parser.addArgument(
      ['-lf',
      '--search_fights'], {
      nargs: '?',
      constant: -1,
      type: 'int',
      help: 'Encounter in log to use, e.g. \'1\'. If no number is specified, returns a list of encounters.',
  });

  // Filtering arguments
  parser.addArgument(
      ['-t',
      '--timeline'], {
        type: 'string',
      help: 'The filename of the timeline to test against, e.g. ultima_weapon_ultimate',
  });

  // Output Format arguments
  parser.addArgument(
      ['-df',
      '--drift_failure'], {
      nargs: '?',
      defaultValue: 1,
      type: 'float',
      help: 'If an entry misses its timestamp by more than this value in seconds, it is displayed in red. Defaults to 1.',
  });
  parser.addArgument(
      ['-dw',
      '--drift_warning'], {
      nargs: '?',
      defaultValue: 0.2,
      type: 'float',
      help: 'If an entry misses its timestamp by more than this value in seconds, it is displayed in yellow. Defaults to 0.2.',
  });
};

class TestTimeline extends Timeline {
  declare ui?: TestTimelineUI | undefined;

  protected override _ScheduleUpdate(_fightNow: number): void {
    /* noop */
  }

  public override SyncTo(fightNow: number, currentTime: number): void {
    super.SyncTo(fightNow, currentTime);
  }

  // TODO: Can't detect Sync events any other way, maybe OnSync should get the sync as a parameter?
  public override OnLogLine(line: string, currentTime: number): void {
    let syncMatch: Sync | undefined = undefined;
    for (const sync of this.activeSyncs) {
      if (line.search(sync.regex) >= 0) {
        syncMatch = sync;
        break;
      }
    }

    // Because TS won't allow the if below to narrow the type, since it's not const
    const syncMatchTyped = syncMatch;

    if (syncMatchTyped !== undefined &&
      this.ui !== undefined) {
      const origEvent = this.events.find((e) => e.id === syncMatchTyped.id);

      // Make sure we don't log multiple syncs for the same event ID and timestamp
      const foundEvent = this.ui?.events.find((uiEvent) => {
        return uiEvent.event.id === origEvent?.id && uiEvent.timestamp === currentTime;
      });

      if (foundEvent === undefined && origEvent !== undefined) {
        const event = {
          event: origEvent,
          sync: syncMatchTyped,
          timebase: this.timebase,
          timestamp: currentTime,
        };
        this.ui?.events.push(event);
      }
    }

    super.OnLogLine(line, currentTime);
  }
}

class TestTimelineUI extends TimelineUI {
  public events: {
    event: Event;
    sync: Sync;
    timestamp: number;
    timebase: number;
    removed?: boolean;
    expired?: boolean;
  }[] = [];

  public triggers: {
    trigger: Partial<TimelineTrigger<RaidbossData>>;
    matches: RegExpExecArray;
    text: Text;
    timestamp: number;
    timebase: number;
  }[] = [];

  public fightNow = 0;

  public constructor(protected override timeline: TestTimeline) {
    super(defaultRaidbossOptions);
  }
  public override OnSyncTime(fightNow: number, _running: boolean): void {
    this.fightNow = fightNow;
  }
  public override OnRemoveTimer(_e: Event, _expired: boolean, _force?: boolean): void {
    /* noop */
  }
  public override OnAddTimer(_fightNow: number, _e: Event, _channeling: boolean): void {
    /* noop */
  }
  public override OnShowInfoText(_text: string, _currentTime: number): void {
    /* noop */
  }
  public override OnShowAlertText(_text: string, _currentTime: number): void {
    /* noop */
  }
  public override OnShowAlarmText(_text: string, _currentTime: number): void {
    /* noop */
  }
  public override OnSpeakTTS(_text: string, _currentTime: number): void {
    /* noop */
  }
  public override OnTrigger(
    trigger: Partial<TimelineTrigger<RaidbossData>>,
    matches: RegExpExecArray,
    currentTime: number,
  ): void {
    const foundText = this.timeline.texts.find((text) => text.type === 'trigger' && text.trigger === trigger);
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
