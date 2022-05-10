import { Lang } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import Regexes from '../../resources/regexes';
import { LooseTimelineTrigger, TriggerAutoConfig } from '../../types/trigger';

import { commonReplacement } from './common_replacement';
import defaultOptions, { RaidbossOptions, TimelineConfig } from './raidboss_options';

export type TimelineReplacement = {
  locale: Lang;
  missingTranslations?: boolean;
  replaceSync?: { [regexString: string]: string };
  replaceText?: { [timelineText: string]: string };
};

export type TimelineStyle = {
  style: { [key: string]: string };
  regex: RegExp;
};

export type Event = {
  id: number;
  time: number;
  name: string;
  text: string;
  activeTime?: number;
  lineNumber?: number;
  duration?: number;
  sortKey?: number;
  isDur?: boolean;
  style?: { [key: string]: string };
};

export type Error = {
  lineNumber?: number;
  line?: string;
  error: string;
};

export type Sync = {
  id: number;
  origRegexStr: string;
  regex: RegExp;
  start: number;
  end: number;
  time: number;
  lineNumber: number;
  jump?: number;
};

type ParsedPopupText = {
  type: 'info' | 'alert' | 'alarm' | 'tts';
  secondsBefore?: number;
  text: string;
};

type ParsedTriggerText = {
  type: 'trigger';
  secondsBefore?: number;
  text?: string;
  matches: RegExpExecArray | null;
  trigger: LooseTimelineTrigger;
};

export type ParsedText = ParsedPopupText | ParsedTriggerText;

export type Text = ParsedText & { time: number };

// This class reads the format of ACT Timeline plugin, described in
// docs/TimelineGuide.md
export class TimelineParser {
  protected options: RaidbossOptions;
  protected perTriggerAutoConfig: { [triggerId: string]: TriggerAutoConfig };
  protected replacements: TimelineReplacement[];
  private timelineConfig: TimelineConfig;

  public ignores: { [ignoreId: string]: boolean };
  public events: Event[];
  public texts: Text[];
  public syncStarts: Sync[];
  public syncEnds: Sync[];
  public errors: Error[];

  constructor(
    text: string,
    replacements: TimelineReplacement[],
    triggers: LooseTimelineTrigger[],
    styles?: TimelineStyle[],
    options?: RaidbossOptions,
    zoneId?: number,
  ) {
    this.options = options ?? defaultOptions;
    this.perTriggerAutoConfig = this.options['PerTriggerAutoConfig'] || {};
    this.replacements = replacements;

    // A set of names which will not be notified about.
    this.ignores = {};
    // Sorted by event occurrence time.
    this.events = [];
    // Sorted by event occurrence time.
    this.texts = [];
    // Sorted by sync.start time.
    this.syncStarts = [];
    // Sorted by sync.end time.
    this.syncEnds = [];
    // Sorted by line.
    this.errors = [];

    this.timelineConfig = typeof zoneId === 'number'
      ? this.options.PerZoneTimelineConfig[zoneId] ?? {}
      : {};
    for (const text of this.timelineConfig.Ignore ?? [])
      this.ignores[text] = true;

    let uniqueId = 1;
    for (const event of this.timelineConfig.Add ?? []) {
      this.events.push({
        id: uniqueId++,
        time: event.time,
        name: event.text,
        text: event.text,
        duration: event.duration,
        activeTime: 0,
      });
    }

    this.parse(text, triggers, styles ?? [], uniqueId);
  }

  private parse(
    text: string,
    triggers: LooseTimelineTrigger[],
    styles: TimelineStyle[],
    initialId: number,
  ): void {
    let uniqueid = initialId;
    const texts: { [id: string]: ParsedText[] } = {};
    const regexes = {
      comment: /^\s*#/,
      commentLine: /#.*$/,
      durationCommand: /(?:[^#]*?\s)?(?<text>duration\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(\s.*)?$/,
      ignore: /^hideall\s+\"(?<id>[^"]+)\"(?:\s*#.*)?$/,
      jumpCommand: /(?:[^#]*?\s)?(?<text>jump\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
      line: /^(?<text>(?<time>[0-9]+(?:\.[0-9]+)?)\s+"(?<name>.*?)")(\s+(.*))?/,
      popupText:
        /^(?<type>info|alert|alarm)text\s+\"(?<id>[^"]+)\"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)(?:\s+\"(?<text>[^"]+)\")?$/,
      soundAlert: /^define\s+soundalert\s+"[^"]*"\s+"[^"]*"$/,
      speaker:
        /define speaker "[^"]*"(\s+"[^"]*")?\s+(-?[0-9]+(?:\.[0-9]+)?)\s+(-?[0-9]+(?:\.[0-9]+)?)/,
      syncCommand: /(?:[^#]*?\s)?(?<text>sync\s*\/(?<regex>.*)\/)(?<args>\s.*)?$/,
      tts:
        /^alertall\s+"(?<id>[^"]*)"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)\s+(?<command>sound|speak\s+"[^"]*")\s+"(?<text>[^"]*)"$/,
      windowCommand:
        /(?:[^#]*?\s)?(?<text>window\s+(?:(?<start>[0-9]+(?:\.[0-9]+)?),)?(?<end>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
    };

    // Make all regexes case insensitive, and parse any special \y{} groups.
    for (const trigger of triggers ?? []) {
      if (trigger.regex)
        trigger.regex = Regexes.parse(trigger.regex);
    }

    const lines = text.split('\n');
    let lineNumber = 0;
    for (let line of lines) {
      ++lineNumber;
      line = line.trim();
      // Drop comments and empty lines.
      if (!line || regexes.comment.test(line))
        continue;
      const originalLine = line;

      let match = regexes.ignore.exec(line);
      if (match && match['groups']) {
        const ignore = match['groups'];
        if (ignore.id)
          this.ignores[ignore.id] = true;
        continue;
      }

      match = regexes.tts.exec(line);
      if (match && match['groups']) {
        const tts = match['groups'];
        if (!tts.id || !tts.beforeSeconds || !tts.command)
          throw new UnreachableCode();
        // TODO: Support alert sounds?
        if (tts.command === 'sound')
          continue;
        const ttsItems = texts[tts.id] || [];
        texts[tts.id] = ttsItems;
        ttsItems.push({
          type: 'tts',
          secondsBefore: parseFloat(tts.beforeSeconds),
          text: tts.text ? tts.text : tts.id,
        });
        continue;
      }
      match = regexes.soundAlert.exec(line);
      if (match)
        continue;
      match = regexes.speaker.exec(line);
      if (match)
        continue;

      match = regexes.popupText.exec(line);
      if (match && match['groups']) {
        const popupText = match['groups'];
        if (!popupText.type || !popupText.id || !popupText.beforeSeconds)
          throw new UnreachableCode();
        const popupTextItems = texts[popupText.id] || [];
        texts[popupText.id] = popupTextItems;
        const type = popupText.type;
        if (type !== 'info' && type !== 'alert' && type !== 'alarm')
          continue;
        popupTextItems.push({
          type: type,
          secondsBefore: parseFloat(popupText.beforeSeconds),
          text: popupText.text ? popupText.text : popupText.id,
        });
        continue;
      }
      match = regexes.line.exec(line);
      if (!(match && match['groups'])) {
        this.errors.push({
          lineNumber: lineNumber,
          line: originalLine,
          error: 'Invalid format',
        });
        console.log('Unknown timeline: ' + originalLine);
        continue;
      }
      const parsedLine = match['groups'];
      // Technically the name can be empty
      if (!parsedLine.text || !parsedLine.time || parsedLine.name === undefined)
        throw new UnreachableCode();
      line = line.replace(parsedLine.text, '').trim();
      // There can be # in the ability name, but probably not in the regex.
      line = line.replace(regexes.commentLine, '').trim();

      const seconds = parseFloat(parsedLine.time);
      const e: Event = {
        id: uniqueid++,
        time: seconds,
        // The original ability name in the timeline.  Used for hideall, infotext, etc.
        name: parsedLine.name,
        // The text to display.  Not used for any logic.
        text: this.GetReplacedText(parsedLine.name),
        activeTime: 0,
        lineNumber: lineNumber,
      };
      if (line) {
        let commandMatch = regexes.durationCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const durationCommand = commandMatch['groups'];
          if (!durationCommand.text || !durationCommand.seconds)
            throw new UnreachableCode();
          line = line.replace(durationCommand.text, '').trim();
          e.duration = parseFloat(durationCommand.seconds);
        }

        commandMatch = regexes.syncCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const syncCommand = commandMatch['groups'];
          if (!syncCommand.text || !syncCommand.regex)
            throw new UnreachableCode();
          line = line.replace(syncCommand.text, '').trim();
          const sync: Sync = {
            id: uniqueid,
            origRegexStr: syncCommand.regex,
            regex: Regexes.parse(this.GetReplacedSync(syncCommand.regex)),
            start: seconds - 2.5,
            end: seconds + 2.5,
            time: seconds,
            lineNumber: lineNumber,
          };
          if (syncCommand.args) {
            let argMatch = regexes.windowCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const windowCommand = argMatch['groups'];
              if (!windowCommand.text || !windowCommand.end)
                throw new UnreachableCode();
              line = line.replace(windowCommand.text, '').trim();
              if (windowCommand.start) {
                sync.start = seconds - parseFloat(windowCommand.start);
                sync.end = seconds + parseFloat(windowCommand.end);
              } else {
                sync.start = seconds - (parseFloat(windowCommand.end) / 2);
                sync.end = seconds + (parseFloat(windowCommand.end) / 2);
              }
            }
            argMatch = regexes.jumpCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const jumpCommand = argMatch['groups'];
              if (!jumpCommand.text || !jumpCommand.seconds)
                throw new UnreachableCode();
              line = line.replace(jumpCommand.text, '').trim();
              sync.jump = parseFloat(jumpCommand.seconds);
            }
          }
          this.syncStarts.push(sync);
          this.syncEnds.push(sync);
        }
      }
      // If there's text left that isn't a comment then we didn't parse that text so report it.
      if (line && !regexes.comment.exec(line)) {
        console.log(`Unknown content '${line}' in timeline: ${originalLine}`);
        this.errors.push({
          lineNumber: lineNumber,
          line: originalLine,
          error: 'Extra text',
        });
      } else {
        this.events.push(e);
      }
    }

    // Validate that all timeline triggers match something.
    for (const trigger of triggers ?? []) {
      let found = false;
      for (const event of this.events) {
        if (trigger.regex && trigger.regex.test(event.name)) {
          found = true;
          break;
        }
      }
      if (!found) {
        const text = `No match for timeline trigger ${trigger.regex?.source ??
          ''} in ${trigger.id ?? ''}`;
        this.errors.push({ error: text });
        console.error(`*** ERROR: ${text}`);
      }
    }

    for (const e of this.events) {
      for (const matchedTextEvent of texts[e.name] ?? []) {
        const type = matchedTextEvent.type;
        if (type !== 'info' && type !== 'alert' && type !== 'alarm')
          continue;
        this.texts.push({
          type: type,
          time: e.time - (matchedTextEvent.secondsBefore || 0),
          text: matchedTextEvent.text ?? '',
        });
      }

      // Rather than matching triggers at run time, pre-match all the triggers
      // against timeline text and insert them as text events to run.
      for (const trigger of triggers ?? []) {
        const m = trigger.regex?.exec(e.name);
        if (!m)
          continue;

        // TODO: beforeSeconds should support being a function.
        const autoConfig = trigger.id && this.perTriggerAutoConfig[trigger.id] || {};
        const beforeSeconds = autoConfig['BeforeSeconds'] ?? trigger.beforeSeconds;

        this.texts.push({
          type: 'trigger',
          time: e.time - (beforeSeconds || 0),
          trigger: trigger,
          matches: m,
        });
      }

      for (const style of styles ?? []) {
        if (!style.regex.test(e.name))
          continue;
        e.style = style.style;
      }
    }

    // Sort by time, but when the time is the same, sort by file order.
    // Then assign a sortKey to each event so that we can maintain that order.
    this.events.sort((a, b) => {
      if (a.time === b.time)
        return a.id - b.id;
      return a.time - b.time;
    });
    this.events.forEach((event, idx) => event.sortKey = idx);

    this.texts.sort((a, b) => {
      return a.time - b.time;
    });
    this.syncStarts.sort((a, b) => {
      return a.start - b.start;
    });
    this.syncEnds.sort((a, b) => {
      return a.end - b.end;
    });
  }

  private GetReplacedHelper(
    text: string,
    replaceKey: 'replaceSync' | 'replaceText',
    replaceLang: Lang,
    isGlobal: boolean,
  ): string {
    if (!this.replacements)
      return text;

    for (const r of this.replacements) {
      if (r.locale && r.locale !== replaceLang)
        continue;
      const reps = r[replaceKey];
      if (!reps)
        continue;
      for (const [key, value] of Object.entries(reps))
        text = text.replace(Regexes.parse(key), value);
    }
    // Common Replacements
    const replacement = commonReplacement[replaceKey];
    for (const [key, value] of Object.entries(replacement ?? {})) {
      const repl = value[replaceLang];
      if (!repl)
        continue;
      const regex = isGlobal ? Regexes.parseGlobal(key) : Regexes.parse(key);
      text = text.replace(regex, repl);
    }

    return text;
  }

  private GetReplacedText(text: string): string {
    // Anything in the timeline config takes precedence over timelineReplace sections in
    // the trigger file.  It is also a full replacement, vs the regex-style GetReplacedHelper.
    const rename = this.timelineConfig?.Rename?.[text];
    if (rename !== undefined)
      return rename;

    if (!this.replacements)
      return text;

    const replaceLang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    const isGlobal = false;
    return this.GetReplacedHelper(text, 'replaceText', replaceLang, isGlobal);
  }

  private GetReplacedSync(sync: string): string {
    if (!this.replacements)
      return sync;

    const replaceLang = this.options.ParserLanguage || 'en';
    const isGlobal = true;
    return this.GetReplacedHelper(sync, 'replaceSync', replaceLang, isGlobal);
  }

  public GetMissingTranslationsToIgnore(): RegExp[] {
    return [
      '--Reset--',
      '--sync--',
      'Start',
      '^ ?21:',
      '^(\\(\\?\\<timestamp\\>\\^\\.\\{14\\}\\)) (1B|21|23):',
      '^(\\^\\.\\{14\\})? ?(1B|21|23):',
      '^::\\y{AbilityCode}:$',
      '^\\.\\*$',
    ].map((x) => Regexes.parse(x));
  }

  // Utility function.  This could be a function on TimelineParser, but it seems weird to
  // store all of the original timeline texts unnecessarily when only config/utilities need it.
  public static Translate(
    timeline: TimelineParser,
    timelineText: string,
    syncErrors?: { [lineNumber: number]: boolean },
    textErrors?: { [lineNumber: number]: boolean },
  ): string[] {
    const lineToText: { [lineNumber: number]: Event } = {};
    const lineToSync: { [lineNumber: number]: Sync } = {};
    for (const event of timeline.events) {
      if (!event.lineNumber)
        continue;
      lineToText[event.lineNumber] = event;
    }
    for (const event of timeline.syncStarts)
      lineToSync[event.lineNumber] = event;

    // Combine replaced lines with errors.
    const timelineLines = timelineText.split(/\n/);
    const translatedLines: string[] = [];
    timelineLines.forEach((timelineLine, idx) => {
      const lineNumber = idx + 1;
      let line = timelineLine.trim();

      const lineText = lineToText[lineNumber];
      if (lineText)
        line = line.replace(` "${lineText.name}"`, ` "${lineText.text}"`);
      const lineSync = lineToSync[lineNumber];
      if (lineSync)
        line = line.replace(`sync /${lineSync.origRegexStr}/`, `sync /${lineSync.regex.source}/`);

      if (syncErrors?.[lineNumber])
        line += ' #MISSINGSYNC';
      if (textErrors?.[lineNumber])
        line += ' #MISSINGTEXT';
      translatedLines.push(line);
    });

    return translatedLines;
  }
}
