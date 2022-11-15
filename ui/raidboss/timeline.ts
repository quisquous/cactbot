import { commonNetRegex } from '../../resources/netregexes';
import { LocaleRegex } from '../../resources/translations';
import { LogEvent } from '../../types/event';
import { CactbotBaseRegExp } from '../../types/net_trigger';
import { LooseTimelineTrigger, RaidbossFileData } from '../../types/trigger';

import { PopupTextGenerator } from './popup-text';
import { RaidbossOptions } from './raidboss_options';
import {
  Event,
  Sync,
  Text,
  TimelineParser,
  TimelineReplacement,
  TimelineStyle,
} from './timeline_parser';

const kBig = 1000000000; // Something bigger than any fight length in seconds.

const activeText = {
  en: 'Active:',
  de: 'Aktiv:',
  fr: 'Active :',
  ja: '(進行):',
  cn: '(进行中):',
  ko: '시전중:',
};

export class TimelineUI {
  protected timeline: Timeline | null = null;

  protected Init(): void {
    /* noop */
  }

  protected AddDebugInstructions(): void {
    /* noop */
  }

  public SetPopupTextInterface(_popupText: PopupTextGenerator): void {
    /* noop */
  }

  protected Reset(): void {
    /* noop */
  }

  public SetTimeline(timeline: Timeline | null): void {
    this.Init();
    this.Reset();

    this.timeline = timeline;
    if (this.timeline)
      this.timeline.ui = this;
  }

  public OnAddTimer(_fightNow: number, _e: Event, _channeling: boolean): void {
    /* noop */
  }

  public OnTimerExpiresSoon(_id: number): void {
    /* noop */
  }

  public OnRemoveTimer(_e: Event, _expired: boolean, _force = false): void {
    /* noop */
  }

  public OnShowInfoText(_text: string, _currentTime: number): void {
    /* noop */
  }

  public OnShowAlertText(_text: string, _currentTime: number): void {
    /* noop */
  }

  public OnShowAlarmText(_text: string, _currentTime: number): void {
    /* noop */
  }

  public OnSpeakTTS(_text: string, _currentTime: number): void {
    /* noop */
  }

  public OnTrigger(
    _trigger: LooseTimelineTrigger,
    _matches: RegExpExecArray | null,
    _currentTime: number,
  ): void {
    /* noop */
  }

  public OnSyncTime(_fightNow: number, _running: boolean): void {
    /* noop */
  }
}

export class Timeline {
  private replacements: TimelineReplacement[];

  private activeText: string;

  protected activeSyncs: Sync[];
  private activeEvents: Event[];

  public ignores: { [ignoreId: string]: boolean };
  public events: Event[];
  public texts: Text[];
  public syncStarts: Sync[];
  public syncEnds: Sync[];

  public timebase = 0;

  private nextEvent = 0;
  private nextText = 0;
  private nextSyncStart = 0;
  private nextSyncEnd = 0;

  private updateTimer = 0;

  public ui?: TimelineUI;

  constructor(
    text: string,
    replacements: TimelineReplacement[],
    triggers: LooseTimelineTrigger[],
    styles: TimelineStyle[],
    private options: RaidbossOptions,
    private zoneId: number,
  ) {
    this.replacements = replacements;

    const lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    this.activeText = lang in activeText ? activeText[lang] : activeText['en'];

    // Not sorted.
    this.activeSyncs = [];
    // Sorted by event occurrence time.
    this.activeEvents = [];
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

    this.LoadFile(text, triggers, styles);
    this.Stop();
  }

  private LoadFile(text: string, triggers: LooseTimelineTrigger[], styles: TimelineStyle[]): void {
    const parsed = new TimelineParser(
      text,
      this.replacements,
      triggers,
      styles,
      this.options,
      this.zoneId,
    );
    this.ignores = parsed.ignores;
    this.events = parsed.events;
    this.texts = parsed.texts;
    this.syncStarts = parsed.syncStarts;
    this.syncEnds = parsed.syncEnds;
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

    this.ui?.OnSyncTime(fightNow, false);
  }

  protected SyncTo(fightNow: number, currentTime: number, _sync?: Sync): void {
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

    this.ui?.OnSyncTime(fightNow, true);
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
      if (sync.regex.test(line)) {
        if ('jump' in sync) {
          if (!sync.jump) {
            this.SyncTo(0, currentTime, sync);
            this.Stop();
          } else {
            this.SyncTo(sync.jump, currentTime, sync);
          }
        } else {
          this.SyncTo(sync.time, currentTime, sync);
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
    for (const activeEvent of this.activeEvents)
      this.ui?.OnRemoveTimer(activeEvent, false);
    this.activeEvents = [];
  }

  private _ClearExceptRunningDurationTimers(fightNow: number): void {
    const durationEvents = [];
    for (const event of this.activeEvents) {
      if (event.isDur && event.time > fightNow) {
        durationEvents.push(event);
        continue;
      }
      this.ui?.OnRemoveTimer(event, false, true);
    }

    this.activeEvents = durationEvents;
  }

  private _RemoveExpiredTimers(fightNow: number): void {
    let activeEvent = this.activeEvents[0];
    while (this.activeEvents.length && activeEvent && activeEvent.time <= fightNow) {
      this.ui?.OnRemoveTimer(activeEvent, true);
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
        this.ui?.OnAddTimer(fightNow, durationEvent, true);
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
    while (
      this.nextEvent < this.events.length &&
      this.activeEvents.length < this.options.MaxNumberOfTimerBars
    ) {
      const e = this.events[this.nextEvent];
      if (!e)
        break;
      if (e.time - fightNow > this.options.ShowTimerBarsAtSeconds)
        break;
      if (fightNow < e.time && !(e.name in this.ignores)) {
        this.activeEvents.push(e);
        this.ui?.OnAddTimer(fightNow, e, false);
      }
      ++this.nextEvent;
    }
  }

  private _AddPassedTexts(fightNow: number, currentTime: number): void {
    while (this.nextText < this.texts.length) {
      const t = this.texts[this.nextText];
      if (!t)
        break;
      if (t.time > fightNow)
        break;
      if (t.type === 'info')
        this.ui?.OnShowInfoText(t.text, currentTime);
      else if (t.type === 'alert')
        this.ui?.OnShowAlertText(t.text, currentTime);
      else if (t.type === 'alarm')
        this.ui?.OnShowAlarmText(t.text, currentTime);
      else if (t.type === 'tts')
        this.ui?.OnSpeakTTS(t.text, currentTime);
      else if (t.type === 'trigger')
        this.ui?.OnTrigger(t.trigger, t.matches, currentTime);
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
        console.assert(
          nextEventStarting > fightNow,
          'nextEvent wasn\'t updated before calling _ScheduleUpdate',
        );
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
        console.assert(
          nextTextOccurs > fightNow,
          'nextText wasn\'t updated before calling _ScheduleUpdate',
        );
      }
    }
    if (this.activeEvents.length > 0) {
      const activeEvent = this.activeEvents[0];
      if (activeEvent) {
        nextEventEnding = activeEvent.time;
        console.assert(
          nextEventEnding > fightNow,
          'Expired activeEvents weren\'t pruned before calling _ScheduleUpdate',
        );
      }
    }
    if (this.nextSyncStart < this.syncStarts.length) {
      const syncStarts = this.syncStarts[this.nextSyncStart];
      if (syncStarts) {
        nextSyncStarting = syncStarts.start;
        console.assert(
          nextSyncStarting > fightNow,
          'nextSyncStart wasn\'t updated before calling _ScheduleUpdate',
        );
      }
    }
    if (this.nextSyncEnd < this.syncEnds.length) {
      const syncEnds = this.syncEnds[this.nextSyncEnd];
      if (syncEnds) {
        nextSyncEnding = syncEnds.end;
        console.assert(
          nextSyncEnding > fightNow,
          'nextSyncEnd wasn\'t updated before calling _ScheduleUpdate',
        );
      }
    }

    const nextTime = Math.min(
      nextEventStarting,
      nextEventEnding,
      nextTextOccurs,
      nextSyncStarting,
      nextSyncEnding,
    );
    if (nextTime !== kBig) {
      console.assert(nextTime > fightNow, 'nextTime is in the past');
      this.updateTimer = window.setTimeout(
        () => {
          this._OnUpdateTimer(Date.now());
        },
        (nextTime - fightNow) * 1000,
      );
    }
  }

  public _OnUpdateTimer(currentTime: number): void {
    console.assert(this.timebase, '_OnTimerUpdate called while stopped');

    // This is the number of seconds into the fight (subtracting Dates gives milliseconds).
    const fightNow = (currentTime - this.timebase) / 1000;
    // Send text events now or they'd be skipped by _AdvanceTimeTo().
    this._AddPassedTexts(fightNow, currentTime);
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._AddDurationTimers(fightNow);
    this._RemoveExpiredTimers(fightNow);
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }
}

export class TimelineController {
  protected timelines: { [filename: string]: string };

  private suppressNextEngage: boolean;
  private wipeRegex: CactbotBaseRegExp<'ActorControl'>;
  protected activeTimeline: Timeline | null = null;

  constructor(
    protected options: RaidbossOptions,
    protected ui: TimelineUI,
    raidbossDataFiles: RaidbossFileData,
  ) {
    this.options = options;
    this.ui = ui;

    this.timelines = {};
    for (const [filename, file] of Object.entries(raidbossDataFiles)) {
      if (!filename.endsWith('.txt') || typeof file !== 'string')
        continue;
      this.timelines[filename] = file;
    }

    // Used to suppress any Engage! if there's a wipe between /countdown and Engage!.
    this.suppressNextEngage = false;
    this.wipeRegex = commonNetRegex.wipe;
  }

  public SetPopupTextInterface(popupText: PopupTextGenerator): void {
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

  public SetActiveTimeline(
    timelineFiles: string[],
    timelines: string[],
    replacements: TimelineReplacement[],
    triggers: LooseTimelineTrigger[],
    styles: TimelineStyle[],
    zoneId: number,
  ): void {
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

    if (text) {
      this.activeTimeline = new Timeline(
        text,
        replacements,
        triggers,
        styles,
        this.options,
        zoneId,
      );
    }
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

  public SetTimelines(
    timelineFiles: string[],
    timelines: string[],
    replacements: TimelineReplacement[],
    triggers: LooseTimelineTrigger[],
    styles: TimelineStyle[],
    zoneId: number,
  ): void {
    this.timelineController.SetActiveTimeline(
      timelineFiles,
      timelines,
      replacements,
      triggers,
      styles,
      zoneId,
    );
  }

  public IsReady(): boolean {
    return this.timelineController.IsReady();
  }

  public StopCombat(): void {
    this.timelineController.SetInCombat(false);
  }
}
