import { Lang } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import Regexes from '../../resources/regexes';
import { translateRegex, translateText } from '../../resources/translations';
import { LooseTimelineTrigger, TriggerAutoConfig } from '../../types/trigger';

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
  id: string;
  time: number;
  name: string;
  text: string;
  activeTime?: number;
  lineNumber?: number;
  duration?: number;
  sortKey: number;
  isDur?: boolean;
  style?: { [key: string]: string };
  sync?: Sync;
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
  event: Event;
  jump?: number;
  // TODO: could consider "maybe" jumps here to say "Ability?".
  // TODO: also it'd be nice to be able to `forcejump` with out a `sync //`
  jumpType?: 'force' | 'normal';
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

  // A set of names which will not be notified about.
  public ignores: { [ignoreId: string]: boolean } = {};
  // Sorted by event occurrence time.
  public events: Event[] = [];
  // Sorted by event occurrence time.
  public texts: Text[] = [];
  // Sorted by sync.start time.
  public syncStarts: Sync[] = [];
  // Sorted by sync.end time.
  public syncEnds: Sync[] = [];
  // Sorted by event occurrence time.
  public forceJumps: Sync[] = [];
  // Sorted by line.
  public errors: Error[] = [];
  // Map of encountered label names to their time.
  private labelToTime: { [name: string]: number } = {};
  // Map of encountered syncs to the label they are jumping to.
  private labelToSync: { [name: string]: Sync[] } = {};

  constructor(
    text: string,
    replacements: TimelineReplacement[],
    triggers: LooseTimelineTrigger[],
    styles?: TimelineStyle[],
    options?: RaidbossOptions,
    zoneId?: number,
  ) {
    this.options = options ?? defaultOptions;
    this.perTriggerAutoConfig = this.options.PerTriggerAutoConfig;
    this.replacements = replacements;

    this.timelineConfig = typeof zoneId === 'number'
      ? this.options.PerZoneTimelineConfig[zoneId] ?? {}
      : {};
    for (const text of this.timelineConfig.Ignore ?? [])
      this.ignores[text] = true;

    let uniqueId = 0;
    for (const event of this.timelineConfig.Add ?? []) {
      this.events.push({
        id: `${++uniqueId}`,
        time: event.time,
        name: event.text,
        text: event.text,
        duration: event.duration,
        activeTime: 0,
        sortKey: 0,
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
      jumpCommand:
        /(?:[^#]*?\s)?(?<text>(?<command>(?:force|)jump)\s+(?:"(?<label>\w*)"|(?<seconds>[0-9]+(?:\.[0-9]+)?)))(?:\s.*)?$/,
      label: /^(?<time>[0-9]+(?:\.[0-9]+)?)\s+(?<text>label\s+"(?<label>\w*)")\s*$/,
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
        if (ignore.id !== undefined)
          this.ignores[ignore.id] = true;
        continue;
      }

      match = regexes.tts.exec(line);
      if (match && match['groups']) {
        const tts = match['groups'];
        if (tts.id === undefined || tts.beforeSeconds === undefined || tts.command === undefined)
          throw new UnreachableCode();
        // TODO: Support alert sounds?
        if (tts.command === 'sound')
          continue;
        const ttsItems = texts[tts.id] || [];
        texts[tts.id] = ttsItems;
        ttsItems.push({
          type: 'tts',
          secondsBefore: parseFloat(tts.beforeSeconds),
          text: tts.text ?? tts.id,
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
        if (
          popupText.type === undefined || popupText.id === undefined ||
          popupText.beforeSeconds === undefined
        )
          throw new UnreachableCode();
        const popupTextItems = texts[popupText.id] || [];
        texts[popupText.id] = popupTextItems;
        const type = popupText.type;
        if (type !== 'info' && type !== 'alert' && type !== 'alarm')
          continue;
        popupTextItems.push({
          type: type,
          secondsBefore: parseFloat(popupText.beforeSeconds),
          text: popupText.text ?? popupText.id,
        });
        continue;
      }

      match = regexes.label.exec(line);
      if (match && match['groups']) {
        const parsedLine = match['groups'];
        if (parsedLine.time === undefined || parsedLine.label === undefined)
          throw new UnreachableCode();
        const seconds = parseFloat(parsedLine.time);
        const label = parsedLine.label;
        this.labelToTime[label] = seconds;
        continue;
      }

      match = regexes.line.exec(line);
      if (!(match && match['groups'])) {
        this.errors.push({
          lineNumber: lineNumber,
          line: originalLine,
          error: 'Invalid format',
        });
        continue;
      }
      const parsedLine = match['groups'];
      // Technically the name can be empty
      if (
        parsedLine.text === undefined || parsedLine.time === undefined ||
        parsedLine.name === undefined
      )
        throw new UnreachableCode();
      line = line.replace(parsedLine.text, '').trim();
      // There can be # in the ability name, but probably not in the regex.
      line = line.replace(regexes.commentLine, '').trim();

      const seconds = parseFloat(parsedLine.time);
      const e: Event = {
        id: `${++uniqueid}`,
        time: seconds,
        // The original ability name in the timeline.  Used for hideall, infotext, etc.
        name: parsedLine.name,
        // The text to display.  Not used for any logic.
        text: this.GetReplacedText(parsedLine.name),
        activeTime: 0,
        lineNumber: lineNumber,
        sortKey: 0,
      };
      if (line) {
        let commandMatch = regexes.durationCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const durationCommand = commandMatch['groups'];
          if (durationCommand.text === undefined || durationCommand.seconds === undefined)
            throw new UnreachableCode();
          line = line.replace(durationCommand.text, '').trim();
          e.duration = parseFloat(durationCommand.seconds);
        }

        commandMatch = regexes.syncCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const syncCommand = commandMatch['groups'];
          if (syncCommand.text === undefined || syncCommand.regex === undefined)
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
            event: e,
          };
          e.sync = sync;
          if (syncCommand.args !== undefined) {
            let argMatch = regexes.windowCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const windowCommand = argMatch['groups'];
              if (windowCommand.text === undefined || windowCommand.end === undefined)
                throw new UnreachableCode();
              line = line.replace(windowCommand.text, '').trim();
              if (windowCommand.start !== undefined) {
                sync.start = seconds - parseFloat(windowCommand.start);
                sync.end = seconds + parseFloat(windowCommand.end);
              } else {
                sync.start = seconds - parseFloat(windowCommand.end) / 2;
                sync.end = seconds + parseFloat(windowCommand.end) / 2;
              }
            }
            argMatch = regexes.jumpCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const jumpCommand = argMatch['groups'];
              if (jumpCommand.text === undefined)
                throw new UnreachableCode();
              line = line.replace(jumpCommand.text, '').trim();

              if (jumpCommand.seconds !== undefined)
                sync.jump = parseFloat(jumpCommand.seconds);
              else if (jumpCommand.label !== undefined)
                (this.labelToSync[jumpCommand.label] ??= []).push(sync);
              else
                throw new UnreachableCode();
              if (jumpCommand.command === 'forcejump')
                sync.jumpType = 'force';
              else
                sync.jumpType = 'normal';
            }
          }
          this.syncStarts.push(sync);
          this.syncEnds.push(sync);
          if (sync.jumpType === 'force')
            this.forceJumps.push(sync);
        }
      }
      // If there's text left that isn't a comment then we didn't parse that text so report it.
      if (line && !regexes.comment.exec(line)) {
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
        const text = `No match for timeline trigger ${
          trigger.regex?.source ??
            ''
        } in ${trigger.id ?? ''}`;
        this.errors.push({ error: text });
        console.error(`*** ERROR: ${text}`);
      }
    }

    // Validate that all the jumps go to labels that exist.
    for (const [label, syncs] of Object.entries(this.labelToSync)) {
      const destination = this.labelToTime[label];
      if (destination === undefined) {
        const text = `No label named ${label} found to jump to`;
        for (const sync of syncs) {
          this.errors.push({
            error: text,
            lineNumber: sync.lineNumber,
          });
        }
        continue;
      }
      for (const sync of syncs)
        sync.jump = destination;
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
        const autoConfig = trigger.id !== undefined && this.perTriggerAutoConfig[trigger.id] || {};
        const beforeSeconds = autoConfig['BeforeSeconds'] ?? trigger.beforeSeconds;

        // TODO: also put these before any forcejump as well; this will solve
        // having to care about this at runtime.
        // e.g. if the beforeSeconds would put the text prior to the jump destination
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
        return parseInt(a.id) - parseInt(b.id);
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
    this.forceJumps.sort((a, b) => {
      return a.time - b.time;
    });
  }

  private GetReplacedText(text: string): string {
    // Anything in the timeline config takes precedence over timelineReplace sections in
    // the trigger file.  It is also a full replacement, vs the regex-style GetReplacedHelper.
    const rename = this.timelineConfig?.Rename?.[text];
    if (rename !== undefined)
      return rename;

    const replaceLang = this.options.TimelineLanguage ?? this.options.ParserLanguage ?? 'en';
    return translateText(text, replaceLang, this.replacements);
  }

  private GetReplacedSync(sync: string): string {
    const replaceLang = this.options.ParserLanguage ?? 'en';
    return translateRegex(sync, replaceLang, this.replacements);
  }

  public GetMissingTranslationsToIgnore(): RegExp[] {
    return [
      '--Reset--',
      '--sync--',
      'Start',
      '^ ?21:',
      '^( ?257)? 101:',
      '^(\\(\\?\\<timestamp\\>\\^\\.\\{14\\}\\)) (1B|21|23):',
      '^(\\^\\.\\{14\\})? ?(1B|21|23):',
      '^::\\y{AbilityCode}:$',
      '^\\.\\*$',
      '^ 1\\[56\\]:\\[\\^:\\]\\*:\\[\\^:\\]\\*:',
      '^( ?260)? 104:',
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
