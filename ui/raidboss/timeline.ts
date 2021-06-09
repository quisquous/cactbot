import { commonReplacement } from './common_replacement';
import Regexes, { Regex, Network6dParams } from '../../resources/regexes';
import { LocaleRegex } from '../../resources/translations';
import { UnreachableCode } from '../../resources/not_reached';
import { RaidbossOptions } from './raidboss_options';
import { Lang } from '../../resources/languages';
import TimerBar from '../../resources/timerbar';
import { LogEvent } from '../../types/event';
import { LooseTimelineTrigger, TriggerAutoConfig } from '../../types/trigger';

const kBig = 1000000000; // Something bigger than any fight length in seconds.

const timelineInstructions = {
  en: [
    'These lines are',
    'debug timeline entries.',
    'If you lock the overlay,',
    'they will disappear!',
    'Real timelines automatically',
    'appear when supported.',
  ],
  de: [
    'Diese Zeilen sind',
    'Timeline Debug-Einträge.',
    'Wenn du das Overlay sperrst,',
    'werden sie verschwinden!',
    'Echte Timelines erscheinen automatisch,',
    'wenn sie unterstützt werden.',
  ],
  fr: [
    'Ces lignes sont',
    'des timelines de test.',
    'Si vous bloquez l\'overlay,',
    'elles disparaîtront !',
    'Les vraies Timelines',
    'apparaîtront automatiquement.',
  ],
  ja: [
    'こちらはデバッグ用の',
    'タイムラインです。',
    'オーバーレイをロックすれば、',
    'デバッグ用テキストも消える',
    'サポートするゾーンにはタイム',
    'ラインを動的にロードする。',
  ],
  cn: [
    '显示在此处的是',
    '调试用时间轴。',
    '将此悬浮窗锁定',
    '则会立刻消失',
    '真实的时间轴会根据',
    '当前区域动态加载并显示',
  ],
  ko: [
    '이 막대바는 디버그용',
    '타임라인 입니다.',
    '오버레이를 위치잠금하면,',
    '이 막대바도 사라집니다.',
    '지원되는 구역에서 타임라인이',
    '자동으로 표시됩니다.',
  ],
};

const activeText = {
  en: 'Active:',
  de: 'Aktiv:',
  fr: 'Active :',
  ja: '(進行):',
  cn: '(进行中):',
  ko: '시전중:',
};

type Replacement = {
  locale: string;
  replaceSync: { [key: string]: string };
  replaceText: { [key: string]: string };
};

type Style = {
  style: { [key: string]: string };
  regex: RegExp;
}

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
}

type Error = {
  lineNumber?: number;
  line?: string;
  error: string;
}

export type Sync = {
  id: number;
  origRegexStr: string;
  regex: RegExp;
  start: number;
  end: number;
  time: number;
  lineNumber: number;
  jump?: number;
}

type ParsedPopupText = {
  type: 'info' | 'alert' | 'alarm' | 'tts';
  secondsBefore?: number;
  text: string;
}

type ParsedTriggerText = {
  type: 'trigger';
  secondsBefore?: number;
  text?: string;
  matches: RegExpExecArray | null;
  trigger: LooseTimelineTrigger;
}

type ParsedText = ParsedPopupText | ParsedTriggerText;

type Text = ParsedText & { time: number };

type AddTimerCallback = (fightNow: number, durationEvent: Event, channeling: boolean) => void;
type PopupTextCallback = (text: string) => void;
type TriggerCallback =
    (trigger: LooseTimelineTrigger, matches: RegExpExecArray | null) => void;

// TODO: Duplicated in 'jobs'
const computeBackgroundColorFrom = (element: HTMLElement, classList: string): string => {
  const div = document.createElement('div');
  const classes = classList.split('.');
  for (const cls of classes)
    div.classList.add(cls);
  element.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  element.removeChild(div);
  return color;
};

// This class reads the format of ACT Timeline plugin, described in
// docs/TimelineGuide.md
export class Timeline {
  private options: RaidbossOptions;
  private perTriggerAutoConfig: { [triggerId: string]: TriggerAutoConfig };
  private activeText: string;
  private replacements: Replacement[];

  private ignores: { [ignoreId: string]: boolean };
  public events: Event[];
  private texts: Text[];
  public syncStarts: Sync[];
  private syncEnds: Sync[];
  private activeSyncs: Sync[];
  private activeEvents: Event[];
  public errors: Error[];

  public timebase = 0;

  private nextEvent = 0;
  private nextText = 0;
  private nextSyncStart = 0;
  private nextSyncEnd = 0;

  private addTimerCallback: AddTimerCallback | null = null;
  private removeTimerCallback: ((e: Event, expired: boolean) => void) | null = null;
  private showInfoTextCallback: PopupTextCallback | null = null;
  private showAlertTextCallback: PopupTextCallback | null = null;
  private showAlarmTextCallback: PopupTextCallback | null = null;
  private speakTTSCallback: PopupTextCallback | null = null;
  private triggerCallback: TriggerCallback | null = null;
  private syncTimeCallback: ((fightNow: number, running: boolean) => void) | null = null;

  private updateTimer = 0;

  constructor(text: string, replacements: Replacement[], triggers: LooseTimelineTrigger[],
      styles: Style[], options: RaidbossOptions) {
    this.options = options || {};
    this.perTriggerAutoConfig = this.options['PerTriggerAutoConfig'] || {};
    this.replacements = replacements;

    const lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    this.activeText = lang in activeText ? activeText[lang] : activeText['en'];

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
    // Not sorted.
    this.activeSyncs = [];
    // Sorted by event occurrence time.
    this.activeEvents = [];
    // Sorted by line.
    this.errors = [];
    this.LoadFile(text, triggers, styles);
    this.Stop();
  }

  private GetReplacedHelper(text: string, replaceKey: 'replaceSync' | 'replaceText', replaceLang: Lang, isGlobal: boolean): string {
    if (!this.replacements)
      return text;

    for (const r of this.replacements) {
      if (r.locale && r.locale !== replaceLang)
        continue;
      if (!r[replaceKey])
        continue;
      for (const [key, value] of Object.entries(r[replaceKey]))
        text = text.replace(Regexes.parse(key), value);
    }
    // Common Replacements
    const replacement = commonReplacement[replaceKey];
    if (!replacement)
      return text;
    for (const [key, value] of Object.entries(replacement)) {
      const repl = value[replaceLang];
      if (!repl)
        continue;
      const regex = isGlobal ? Regexes.parseGlobal(key) : Regexes.parse(key);
      text = text.replace(regex, repl);
    }
    return text;
  }

  private GetReplacedText(text: string): string {
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

  private LoadFile(text: string, triggers: LooseTimelineTrigger[], styles: Style[]): void {
    this.events = [];
    this.syncStarts = [];
    this.syncEnds = [];

    let uniqueid = 1;
    const texts: { [id: string]: ParsedText[] } = {};
    const regexes = {
      comment: /^\s*#/,
      commentLine: /#.*$/,
      durationCommand: /(?:[^#]*?\s)?(?<text>duration\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(\s.*)?$/,
      ignore: /^hideall\s+\"(?<id>[^"]+)\"$/,
      jumpCommand: /(?:[^#]*?\s)?(?<text>jump\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
      line: /^(?<text>(?<time>[0-9]+(?:\.[0-9]+)?)\s+"(?<name>.*?)")(\s+(.*))?/,
      popupText: /^(?<type>info|alert|alarm)text\s+\"(?<id>[^"]+)\"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)(?:\s+\"(?<text>[^"]+)\")?$/,
      soundAlert: /^define\s+soundalert\s+"[^"]*"\s+"[^"]*"$/,
      speaker: /define speaker "[^"]*"(\s+"[^"]*")?\s+(-?[0-9]+(?:\.[0-9]+)?)\s+(-?[0-9]+(?:\.[0-9]+)?)/,
      syncCommand: /(?:[^#]*?\s)?(?<text>sync\s*\/(?<regex>.*)\/)(?<args>\s.*)?$/,
      tts: /^alertall\s+"(?<id>[^"]*)"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)\s+(?<command>sound|speak\s+"[^"]*")\s+"(?<text>[^"]*)"$/,
      windowCommand: /(?:[^#]*?\s)?(?<text>window\s+(?:(?<start>[0-9]+(?:\.[0-9]+)?),)?(?<end>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
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
        const text = `No match for timeline trigger ${trigger.regex?.source ?? ''} in ${trigger.id ?? ''}`;
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

  public Stop(): void {
    this.timebase = 0;

    this.nextEvent = 0;
    this.nextText = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;

    const fightNow = 0;
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._ClearTimers();
    this._CancelUpdate();

    if (this.syncTimeCallback)
      this.syncTimeCallback(fightNow, false);
  }

  protected SyncTo(fightNow: number, currentTime: number): void {
    // This records the actual time which aligns with "0" in the timeline.
    const newTimebase = new Date(currentTime - fightNow * 1000).valueOf();
    // Skip syncs that are too close.  Many syncs happen on abilities that
    // hit 8 to 24 people, and so this is a lot of churn.
    if (Math.abs(newTimebase - this.timebase) <= 2)
      return;
    this.timebase = newTimebase;

    this.nextEvent = 0;
    this.nextText = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;

    // This will skip text events without running them.
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    // Clear all timers except any synthetic duration events.
    // This is because if the sync goes even a hair into the future, then
    // the duration ending event will get dropped here.

    // FIXME: we could be smarter here and know ahead of time where all the duration
    // events are, so that we could skip ahead into the future where a duration
    // event has started but not expired and have that work properly.
    this._AddDurationTimers(fightNow);
    this._ClearExceptRunningDurationTimers(fightNow);

    this._AddUpcomingTimers(fightNow);
    this._CancelUpdate();
    this._ScheduleUpdate(fightNow);

    if (this.syncTimeCallback)
      this.syncTimeCallback(fightNow, true);
  }

  private _CollectActiveSyncs(fightNow: number): void {
    this.activeSyncs = [];
    for (let i = this.nextSyncEnd; i < this.syncEnds.length; ++i) {
      const syncEnd = this.syncEnds[i];
      if (syncEnd && syncEnd.start <= fightNow)
        this.activeSyncs.push(syncEnd);
    }
  }

  public OnLogLine(line: string, currentTime: number): void {
    for (const sync of this.activeSyncs) {
      if (line.search(sync.regex) >= 0) {
        if ('jump' in sync) {
          if (!sync.jump)
            this.Stop();
          else
            this.SyncTo(sync.jump, currentTime);
        } else {
          this.SyncTo(sync.time, currentTime);
        }
        break;
      }
    }
  }

  private _AdvanceTimeTo(fightNow: number): void {
    let event = this.events[this.nextEvent];
    while (this.nextEvent < this.events.length && event && event.time <= fightNow)
      event = this.events[++this.nextEvent];
    let text = this.texts[this.nextText];
    while (this.nextText < this.texts.length && text && text.time <= fightNow)
      text = this.texts[++this.nextText];
    let syncStart = this.syncStarts[this.nextSyncStart];
    while (this.nextSyncStart < this.syncStarts.length && syncStart && syncStart.start <= fightNow)
      syncStart = this.syncStarts[++this.nextSyncStart];
    let syncEnd = this.syncEnds[this.nextSyncEnd];
    while (this.nextSyncEnd < this.syncEnds.length && syncEnd && syncEnd.end <= fightNow)
      syncEnd = this.syncEnds[++this.nextSyncEnd];
  }

  private _ClearTimers(): void {
    if (this.removeTimerCallback) {
      for (const activeEvent of this.activeEvents)
        this.removeTimerCallback(activeEvent, false);
    }
    this.activeEvents = [];
  }

  private _ClearExceptRunningDurationTimers(fightNow: number): void {
    const durationEvents = [];
    for (const event of this.activeEvents) {
      if (event.isDur && event.time > fightNow) {
        durationEvents.push(event);
        continue;
      }
      if (this.removeTimerCallback)
        this.removeTimerCallback(event, false);
    }

    this.activeEvents = durationEvents;
  }

  private _RemoveExpiredTimers(fightNow: number): void {
    let activeEvent = this.activeEvents[0];
    while (this.activeEvents.length && activeEvent && activeEvent.time <= fightNow) {
      if (this.removeTimerCallback)
        this.removeTimerCallback(activeEvent, true);
      this.activeEvents.splice(0, 1);
      activeEvent = this.activeEvents[0];
    }
  }

  private _AddDurationTimers(fightNow: number): void {
    const events = [];
    for (let i = 0; i < this.activeEvents.length; ++i) {
      const e = this.activeEvents[i];
      if (e && e.time <= fightNow && e.duration) {
        const durationEvent: Event = {
          id: e.id,
          time: e.time + e.duration,
          sortKey: e.sortKey,
          name: e.name,
          text: `${this.activeText} ${e.text}`,
          isDur: true,
        };
        events.push(durationEvent);
        this.activeEvents.splice(i, 1);
        if (this.addTimerCallback)
          this.addTimerCallback(fightNow, durationEvent, true);
        --i;
      }
    }
    if (events.length)
      Array.prototype.push.apply(this.activeEvents, events);
    this.activeEvents.sort((a, b) => {
      return a.time - b.time;
    });
  }

  private _AddUpcomingTimers(fightNow: number): void {
    while (this.nextEvent < this.events.length &&
        this.activeEvents.length < this.options.MaxNumberOfTimerBars) {
      const e = this.events[this.nextEvent];
      if (!e)
        break;
      if (e.time - fightNow > this.options.ShowTimerBarsAtSeconds)
        break;
      if (fightNow < e.time && !(e.name in this.ignores)) {
        this.activeEvents.push(e);
        if (this.addTimerCallback)
          this.addTimerCallback(fightNow, e, false);
      }
      ++this.nextEvent;
    }
  }

  private _AddPassedTexts(fightNow: number): void {
    while (this.nextText < this.texts.length) {
      const t = this.texts[this.nextText];
      if (!t)
        break;
      if (t.time > fightNow)
        break;
      if (t.type === 'info') {
        if (this.showInfoTextCallback)
          this.showInfoTextCallback(t.text);
      } else if (t.type === 'alert') {
        if (this.showAlertTextCallback)
          this.showAlertTextCallback(t.text);
      } else if (t.type === 'alarm') {
        if (this.showAlarmTextCallback)
          this.showAlarmTextCallback(t.text);
      } else if (t.type === 'tts') {
        if (this.speakTTSCallback)
          this.speakTTSCallback(t.text);
      } else if (t.type === 'trigger') {
        if (this.triggerCallback)
          this.triggerCallback(t.trigger, t.matches);
      }
      ++this.nextText;
    }
  }

  private _CancelUpdate(): void {
    if (this.updateTimer) {
      window.clearTimeout(this.updateTimer);
      this.updateTimer = 0;
    }
  }

  protected _ScheduleUpdate(fightNow: number): void {
    console.assert(this.timebase, '_ScheduleUpdate called while stopped');

    let nextEventStarting = kBig;
    let nextTextOccurs = kBig;
    let nextEventEnding = kBig;
    let nextSyncStarting = kBig;
    let nextSyncEnding = kBig;

    if (this.nextEvent < this.events.length) {
      const nextEvent = this.events[this.nextEvent];
      if (nextEvent) {
        const nextEventEndsAt = nextEvent.time;
        console.assert(nextEventStarting > fightNow, 'nextEvent wasn\'t updated before calling _ScheduleUpdate');
        // There might be more events than we can show, so the next event might be in
        // the past. If that happens, then ignore it, as we can't use that for our timer.
        const showNextEventAt = nextEventEndsAt - this.options.ShowTimerBarsAtSeconds;
        if (showNextEventAt > fightNow)
          nextEventStarting = showNextEventAt;
      }
    }
    if (this.nextText < this.texts.length) {
      const nextText = this.texts[this.nextText];
      if (nextText) {
        nextTextOccurs = nextText.time;
        console.assert(nextTextOccurs > fightNow, 'nextText wasn\'t updated before calling _ScheduleUpdate');
      }
    }
    if (this.activeEvents.length > 0) {
      const activeEvent = this.activeEvents[0];
      if (activeEvent) {
        nextEventEnding = activeEvent.time;
        console.assert(nextEventEnding > fightNow, 'Expired activeEvents weren\'t pruned before calling _ScheduleUpdate');
      }
    }
    if (this.nextSyncStart < this.syncStarts.length) {
      const syncStarts = this.syncStarts[this.nextSyncStart];
      if (syncStarts) {
        nextSyncStarting = syncStarts.start;
        console.assert(nextSyncStarting > fightNow, 'nextSyncStart wasn\'t updated before calling _ScheduleUpdate');
      }
    }
    if (this.nextSyncEnd < this.syncEnds.length) {
      const syncEnds = this.syncEnds[this.nextSyncEnd];
      if (syncEnds) {
        nextSyncEnding = syncEnds.end;
        console.assert(nextSyncEnding > fightNow, 'nextSyncEnd wasn\'t updated before calling _ScheduleUpdate');
      }
    }

    const nextTime = Math.min(nextEventStarting, nextEventEnding, nextTextOccurs,
        nextSyncStarting, nextSyncEnding);
    if (nextTime !== kBig) {
      console.assert(nextTime > fightNow, 'nextTime is in the past');
      this.updateTimer = window.setTimeout(
          () => {
            this._OnUpdateTimer(Date.now());
          },
          (nextTime - fightNow) * 1000);
    }
  }

  public _OnUpdateTimer(currentTime: number): void {
    console.assert(this.timebase, '_OnTimerUpdate called while stopped');

    // This is the number of seconds into the fight (subtracting Dates gives milliseconds).
    const fightNow = (currentTime - this.timebase) / 1000;
    // Send text events now or they'd be skipped by _AdvanceTimeTo().
    this._AddPassedTexts(fightNow);
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._AddDurationTimers(fightNow);
    this._RemoveExpiredTimers(fightNow);
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }

  public SetAddTimer(c: AddTimerCallback | null): void {
    this.addTimerCallback = c;
  }
  public SetRemoveTimer(c: ((e: Event, expired: boolean) => void) | null): void {
    this.removeTimerCallback = c;
  }
  public SetShowInfoText(c: PopupTextCallback | null): void {
    this.showInfoTextCallback = c;
  }
  public SetShowAlertText(c: PopupTextCallback | null): void {
    this.showAlertTextCallback = c;
  }
  public SetShowAlarmText(c: PopupTextCallback | null): void {
    this.showAlarmTextCallback = c;
  }
  public SetSpeakTTS(c: PopupTextCallback | null): void {
    this.speakTTSCallback = c;
  }
  public SetTrigger(c: TriggerCallback | null): void {
    this.triggerCallback = c;
  }
  public SetSyncTime(c: ((fightNow: number, running: boolean) => void) | null): void {
    this.syncTimeCallback = c;
  }
}

interface PopupText {
  Info: PopupTextCallback;
  Alert: PopupTextCallback;
  Alarm: PopupTextCallback;
  TTS: PopupTextCallback;
  Trigger: TriggerCallback;
}

export class TimelineUI {
  private init: boolean;
  private lang: Lang;

  private root: HTMLElement | null = null;
  private barColor: string | null = null;
  private barExpiresSoonColor: string | null = null;
  private timerlist: HTMLElement | null = null;

  private activeBars: { [activebar: string]: TimerBar } = {};
  private expireTimers: { [expireTimer: string]: number } = {};

  private debugElement: HTMLElement | null = null;
  private debugFightTimer: TimerBar | null = null;

  protected timeline: Timeline | null = null;

  private popupText?: PopupText;

  constructor(protected options: RaidbossOptions) {
    this.options = options;
    this.init = false;
    this.lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    this.AddDebugInstructions();
  }

  protected Init(): void {
    if (this.init)
      return;
    this.init = true;

    this.root = document.getElementById('timeline-container');
    if (!this.root)
      throw new Error('can\'t find timeline-container');

    this.root.classList.add(`lang-${this.lang}`);
    if (this.options.Skin)
      this.root.classList.add(`skin-${this.options.Skin}`);

    this.barColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color');
    this.barExpiresSoonColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color.soon');

    this.timerlist = document.getElementById('timeline');
    if (this.timerlist)
      this.timerlist.style.gridTemplateRows = `repeat(${this.options.MaxNumberOfTimerBars}, min-content)`;

    this.activeBars = {};
    this.expireTimers = {};
  }

  protected AddDebugInstructions(): void {
    const lang = this.lang in timelineInstructions ? this.lang : 'en';
    const instructions = timelineInstructions[lang];

    // Helper for positioning/resizing when locked.
    const helper = document.getElementById('timeline-resize-helper');
    if (!helper)
      return;
    const rows = Math.max(6, this.options.MaxNumberOfTimerBars);
    helper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let i = 0; i < this.options.MaxNumberOfTimerBars; ++i) {
      const helperBar = document.createElement('div');
      if (!helperBar)
        continue;
      helperBar.classList.add('text');
      helperBar.classList.add('resize-helper-bar');
      helperBar.classList.add('timeline-bar-color');
      if (i < 1)
        helperBar.classList.add('soon');
      if (i < instructions.length)
        helperBar.innerText = instructions[i] ?? '';
      else
        helperBar.innerText = `${i + 1}`;
      helper.appendChild(helperBar);
    }

    // For simplicity in code, always make debugElement valid,
    // however it does not exist in the raid emulator.
    this.debugElement = document.getElementById('timeline-debug');
    if (!this.debugElement)
      this.debugElement = document.createElement('div');
  }

  public SetPopupTextInterface(popupText: PopupText): void {
    this.popupText = popupText;
  }

  public SetTimeline(timeline: Timeline | null): void {
    this.Init();
    if (this.timeline) {
      this.timeline.SetAddTimer(null);
      this.timeline.SetRemoveTimer(null);
      this.timeline.SetShowInfoText(null);
      this.timeline.SetShowAlertText(null);
      this.timeline.SetShowAlarmText(null);
      this.timeline.SetSpeakTTS(null);
      this.timeline.SetTrigger(null);
      this.timeline.SetSyncTime(null);
      while (this.timerlist && this.timerlist.lastChild)
        this.timerlist.removeChild(this.timerlist.lastChild);
      if (this.debugElement)
        this.debugElement.innerHTML = '';
      this.debugFightTimer = null;
      this.activeBars = {};
    }

    this.timeline = timeline;
    if (this.timeline) {
      this.timeline.SetAddTimer(this.OnAddTimer.bind(this));
      this.timeline.SetRemoveTimer(this.OnRemoveTimer.bind(this));
      this.timeline.SetShowInfoText(this.OnShowInfoText.bind(this));
      this.timeline.SetShowAlertText(this.OnShowAlertText.bind(this));
      this.timeline.SetShowAlarmText(this.OnShowAlarmText.bind(this));
      this.timeline.SetSpeakTTS(this.OnSpeakTTS.bind(this));
      this.timeline.SetTrigger(this.OnTrigger.bind(this));
      this.timeline.SetSyncTime(this.OnSyncTime.bind(this));
    }
  }

  protected OnAddTimer(fightNow: number, e: Event, channeling: boolean): void {
    const div = document.createElement('div');
    const bar = document.createElement('timer-bar');
    div.classList.add('timer-bar');
    div.appendChild(bar);
    bar.duration = `${channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds}`;
    bar.value = `${e.time - fightNow}`;
    bar.righttext = 'remain';
    bar.lefttext = e.text;
    bar.toward = 'right';
    bar.stylefill = !channeling ? 'fill' : 'empty';

    if (e.style)
      bar.applyStyles(e.style);

    if (!channeling && e.time - fightNow > this.options.BarExpiresSoonSeconds) {
      bar.fg = this.barColor;
      window.setTimeout(
          this.OnTimerExpiresSoon.bind(this, e.id),
          (e.time - fightNow - this.options.BarExpiresSoonSeconds) * 1000);
    } else {
      bar.fg = this.barExpiresSoonColor;
    }

    // Adding a timer with the same id immediately removes the previous.
    const activeBar = this.activeBars[e.id];
    if (activeBar) {
      const div = activeBar.parentNode;
      div?.parentNode?.removeChild(div);
    }

    if (e.sortKey)
      div.style.order = e.sortKey.toString();
    div.id = e.id.toString();
    this.timerlist?.appendChild(div);
    this.activeBars[e.id] = bar;
    if (e.id in this.expireTimers) {
      window.clearTimeout(this.expireTimers[e.id]);
      delete this.expireTimers[e.id];
    }
  }

  private OnTimerExpiresSoon(id: number): void {
    const bar = this.activeBars[id];
    if (bar)
      bar.fg = this.barExpiresSoonColor;
  }

  protected OnRemoveTimer(e: Event, expired: boolean): void {
    if (expired && this.options.KeepExpiredTimerBarsForSeconds) {
      this.expireTimers[e.id] = window.setTimeout(
          this.OnRemoveTimer.bind(this, e, false),
          this.options.KeepExpiredTimerBarsForSeconds * 1000);
      return;
    } else if (e.id in this.expireTimers) {
      window.clearTimeout(this.expireTimers[e.id]);
      delete this.expireTimers[e.id];
    }

    const bar = this.activeBars[e.id];
    if (!bar)
      return;

    const div = bar.parentNode;
    const element = document.getElementById(e.id.toString());
    if (!element)
      return;

    const removeBar = () => {
      div?.parentNode?.removeChild(div);
      delete this.activeBars[e.id];
    };
    element.classList.add('animate-timer-bar-removed');
    if (window.getComputedStyle(element).animationName !== 'none') {
      // Wait for animation to finish
      element.addEventListener('animationend', removeBar);
    } else {
      removeBar();
    }
  }

  private OnShowInfoText(text: string): void {
    if (this.popupText)
      this.popupText.Info(text);
  }

  private OnShowAlertText(text: string): void {
    if (this.popupText)
      this.popupText.Alert(text);
  }

  private OnShowAlarmText(text: string): void {
    if (this.popupText)
      this.popupText.Alarm(text);
  }

  private OnSpeakTTS(text: string): void {
    if (this.popupText)
      this.popupText.TTS(text);
  }

  private OnTrigger(trigger: LooseTimelineTrigger, matches: RegExpExecArray | null): void {
    if (this.popupText)
      this.popupText.Trigger(trigger, matches);
  }

  private OnSyncTime(fightNow: number, running: boolean): void {
    if (!this.options.Debug || !this.debugElement)
      return;

    if (!running) {
      if (this.debugFightTimer)
        this.debugElement.removeChild(this.debugFightTimer);
      this.debugFightTimer = null;
      return;
    }

    if (!this.debugFightTimer) {
      this.debugFightTimer = document.createElement('timer-bar');
      this.debugFightTimer.width = '100px';
      this.debugFightTimer.height = '17px';
      this.debugFightTimer.duration = `${kBig}`;
      this.debugFightTimer.lefttext = 'elapsed';
      this.debugFightTimer.toward = 'right';
      this.debugFightTimer.stylefill = 'fill';
      this.debugFightTimer.bg = 'transparent';
      this.debugFightTimer.fg = 'transparent';
      this.debugElement.appendChild(this.debugFightTimer);
    }

    // Force this to be reset.
    this.debugFightTimer.elapsed = '0';
    this.debugFightTimer.elapsed = fightNow.toString();
  }
}

export class TimelineController {
  private timelines: { [filename: string]: string };

  private suppressNextEngage: boolean;
  private wipeRegex: Regex<Network6dParams>;
  private activeTimeline: Timeline | null = null;

  constructor(private options: RaidbossOptions, private ui: TimelineUI,
      raidbossDataFiles: { [filename: string]: string }) {
    this.options = options;
    this.ui = ui;

    this.timelines = {};
    for (const [filename, file] of Object.entries(raidbossDataFiles)) {
      if (!filename.endsWith('.txt'))
        continue;
      this.timelines[filename] = file;
    }

    // Used to suppress any Engage! if there's a wipe between /countdown and Engage!.
    this.suppressNextEngage = false;
    this.wipeRegex = Regexes.network6d({ command: '40000010' });
  }

  public SetPopupTextInterface(popupText: PopupText): void {
    this.ui.SetPopupTextInterface(popupText);
  }

  public SetInCombat(inCombat: boolean): void {
    // Wipe lines come before combat is false, but because OnLogEvent doesn't process
    // lines when out of combat, suppress any engages that come before the next countdown
    // just as a safety, especially for old ARR content where wipe lines don't happen.
    if (!inCombat)
      this.suppressNextEngage = true;
    if (!inCombat && this.activeTimeline)
      this.activeTimeline.Stop();
  }

  public OnLogEvent(e: LogEvent): void {
    if (!this.activeTimeline)
      return;

    const currentTime = Date.now();

    for (const log of e.detail.logs) {
      if (LocaleRegex.countdownStart[this.options.ParserLanguage].test(log)) {
        // As you can't start a countdown while in combat, the next engage is real.
        this.suppressNextEngage = false;
      } else if (LocaleRegex.countdownEngage[this.options.ParserLanguage].test(log)) {
        // If we see an engage after a wipe, but before combat has started otherwise
        // (e.g. countdown > wipe > face pull > engage), don't process this engage line
        if (this.suppressNextEngage)
          continue;
      } else if (this.wipeRegex.test(log)) {
        // If we see a wipe, ignore the next engage.  If we see a countdown before that wipe,
        // we will clear this.  Therefore, this will only apply to active countdowns.
        this.suppressNextEngage = true;
      }
      this.activeTimeline.OnLogLine(log, currentTime);
    }
  }

  public SetActiveTimeline(timelineFiles: string[], timelines: string[],
      replacements: Replacement[], triggers: LooseTimelineTrigger[], styles: Style[]): void {
    this.activeTimeline = null;

    let text = '';

    // Get the text from each file in |timelineFiles|.
    for (const timelineFile of timelineFiles) {
      const name = this.timelines[timelineFile];
      if (name)
        text = `${text}\n${name}`;
      else
        console.log(`Timeline file not found: ${timelineFile}`);
    }
    // Append text from each block in |timelines|.
    for (const timeline of timelines)
      text = `${text}\n${timeline}`;

    if (text)
      this.activeTimeline = new Timeline(text, replacements, triggers, styles, this.options);
    this.ui.SetTimeline(this.activeTimeline);
  }

  public IsReady(): boolean {
    return this.timelines !== null;
  }
}

export class TimelineLoader {
  constructor(private timelineController: TimelineController) {
    this.timelineController = timelineController;
  }

  public SetTimelines(timelineFiles: string[], timelines: string[], replacements: Replacement[],
      triggers: LooseTimelineTrigger[], styles: Style[]): void {
    this.timelineController.SetActiveTimeline(
        timelineFiles,
        timelines,
        replacements,
        triggers,
        styles,
    );
  }

  public IsReady(): boolean {
    return this.timelineController.IsReady();
  }

  public StopCombat(): void {
    this.timelineController.SetInCombat(false);
  }
}
