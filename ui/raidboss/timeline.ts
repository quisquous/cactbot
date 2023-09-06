import { commonNetRegex } from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
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

// Hi, sorry about this whole class.  This is all pretty old code and honestly could
// probably all be entirely rewritten at this point if anybody has the time or brain.
//
// This TimelineController class is involved in playing back the timeline efficiently.
// As it says on the tin, it's the controller here and HtmlTimelineUI is the view.
// The UI does very little and relies on TimelineController to manually add and remove
// timer bars as necessary.  It does some animations when things are removed, but
// only when it's been told to remove them.
//
// When any time is resynced even slightly, then all of the bars are removed and readded
// with new times.  (This could probably be better to just update them in place!).
// Similarly, any jump (even with lookahead) can't do any UI animations or anything
// because the lookahead bars don't know anything about the new bars at the jump location.
// This is kind of jarring but hopefully most people don't notice it.
//
// Things are also very precarious in terms of how this class walks through things.
// If this.activeEvents is out of sync or unsorted, then it will clog up and new bars
// will not be able to be added.  Durations are extremely awkward as they are manually
// added once their original event has passed.  This means that if you ever jump
// to a new location with an ongoing duration from the past, it will not appear.
// It also has some issues if the duration extends past the jump (see comments inline).
// Also because of this, we have to look through every event all the time to figure
// out if there's a duration to care about (and probably we could figure this out
// ahead of time like we do with placing text events + beforeSeconds at the correct
// place in the timeline).
//
// There's also no testing, sorry.

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

const initialNextEventState = {
  index: 0,
  minFightNow: 0,
  timeOffset: 0,
  sortKeyOffset: 0,
  jumpCount: 0,
} as const;

export class Timeline {
  private replacements: TimelineReplacement[];

  private activeText: string;

  protected activeSyncs: Sync[];
  private activeEvents: Event[];
  private activeLastForceJumpSync?: Sync;

  public ignores: { [ignoreId: string]: boolean };
  public events: Event[];
  public texts: Text[];
  public syncStarts: Sync[];
  public syncEnds: Sync[];
  public forceJumps: Sync[];

  public timebase = 0;

  private nextEventState: {
    index: number;
    minFightNow: number;
    timeOffset: number;
    sortKeyOffset: number;
    jumpCount: number;
  } = { ...initialNextEventState };
  private nextText = 0;
  private nextSyncStart = 0;
  private nextSyncEnd = 0;
  private nextForceJump = 0;

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
    // Sorted by event occurrence time.
    this.forceJumps = [];

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
    this.forceJumps = parsed.forceJumps;
  }

  public Stop(): void {
    this.timebase = 0;

    this.nextEventState = { ...initialNextEventState };
    this.nextText = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;
    this.nextForceJump = 0;

    const fightNow = 0;
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._ClearTimers();
    this._CancelUpdate();

    this.ui?.OnSyncTime(fightNow, false);
  }

  protected SyncTo(fightNow: number, currentTime: number, _sync?: Sync): void {
    // If we ever sync somewhere else, then remove any active overhanging windows from force jumps.
    this.activeLastForceJumpSync = undefined;

    // This records the actual time which aligns with "0" in the timeline.
    const newTimebase = new Date(currentTime - fightNow * 1000).valueOf();
    // Skip syncs that are too close.  Many syncs happen on abilities that
    // hit 8 to 24 people, and so this is a lot of churn.
    if (Math.abs(newTimebase - this.timebase) <= 2)
      return;
    this.timebase = newTimebase;

    this.nextEventState = { ...initialNextEventState };
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

    if (
      this.activeLastForceJumpSync !== undefined &&
      this.activeLastForceJumpSync.start <= fightNow &&
      this.activeLastForceJumpSync.end > fightNow
    ) {
      this.activeSyncs.push(this.activeLastForceJumpSync);
    } else {
      this.activeLastForceJumpSync = undefined;
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
    // This function advances time to fightNow without processing any events.
    let event = this.events[this.nextEventState.index];
    while (
      this.nextEventState.index < this.events.length && event &&
      event.time + this.nextEventState.timeOffset <= fightNow
    )
      event = this.events[++this.nextEventState.index];
    let text = this.texts[this.nextText];
    while (this.nextText < this.texts.length && text && text.time <= fightNow)
      text = this.texts[++this.nextText];
    let syncStart = this.syncStarts[this.nextSyncStart];
    while (this.nextSyncStart < this.syncStarts.length && syncStart && syncStart.start <= fightNow)
      syncStart = this.syncStarts[++this.nextSyncStart];
    let syncEnd = this.syncEnds[this.nextSyncEnd];
    while (this.nextSyncEnd < this.syncEnds.length && syncEnd && syncEnd.end <= fightNow)
      syncEnd = this.syncEnds[++this.nextSyncEnd];
    let forceJump = this.forceJumps[this.nextForceJump];
    while (this.nextForceJump < this.forceJumps.length && forceJump && forceJump.time <= fightNow)
      forceJump = this.forceJumps[++this.nextForceJump];
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
          // FIXME: it is incorrect to have a duration timer share an id with its non-duration
          // origin when the duration extends across the end of a short loop.  Re-adding the
          // non-duration origin will remove (due to same id) the ongoing duration timer.
          // HOWEVER, there's also various issues (sortKey is incorrect, and activeEvent.time
          // also needs to be adjusted) so for now we'll work around this by just not supporting
          // durations that extend across jumps.
          //
          // Example timeline:
          //   3 "Loop Target"
          //   7 "Long Duration Event" duration 100
          //   8 "Jump Backwards to Loop Target" sync /etc/ jump 3
          id: e.id,
          time: e.time + e.duration,
          sortKey: e.sortKey,
          name: e.name,
          text: `${this.activeText} ${e.text}`,
          isDur: true,
        };
        events.push(durationEvent);
        this.activeEvents.splice(i, 1);
        this.ui?.OnRemoveTimer(e, false, true);
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
      this.nextEventState.index < this.events.length &&
      this.activeEvents.length < this.options.MaxNumberOfTimerBars
    ) {
      const e = this.events[this.nextEventState.index];
      if (e === undefined)
        throw new UnreachableCode();

      // If we have too many bars, just hold at this next event state
      // until space frees up and we can start processing again.
      const timeUntilEvent = e.time + this.nextEventState.timeOffset - fightNow;
      if (timeUntilEvent > this.options.ShowTimerBarsAtSeconds)
        break;

      ++this.nextEventState.index;

      // If this event is before a forced jump or has already happened, skip.
      if (e.time <= this.nextEventState.minFightNow || timeUntilEvent <= 0)
        continue;

      if (!(e.name in this.ignores)) {
        const activeEvent: Event = {
          ...e,
          id: `${e.id}-${this.nextEventState.jumpCount}`,
          time: e.time + this.nextEventState.timeOffset,
          sortKey: e.sortKey + this.nextEventState.sortKeyOffset,
        };
        this.activeEvents.push(activeEvent);
        this.ui?.OnAddTimer(fightNow, activeEvent, false);
      }

      const sync = e.sync;
      if (sync?.jumpType === 'force' && sync?.jump !== undefined) {
        this.nextEventState.index = 0;
        this.nextEventState.minFightNow = sync.jump;
        this.nextEventState.timeOffset += sync.time - sync.jump;
        this.nextEventState.jumpCount++;
        // All events are numbered with a sort key.  We could find the max sort key of all
        // timeline entries and multiply by jump count to get an ordering such that
        // all sort keys at a higher jump count sort after previous ones.  However,
        // since we doing a forced jump lookahead at this point, we will never see anything higher
        // than `e.sortKey`, so we can use that as a max.  Once the timeline syncs for any
        // reason, we'll be back to jumpCount=0 and normal sort keys.  Sadly, this will not
        // be true if we ever fix the duration bug across loops (see comments inline)
        // but it's a band-aid for now, sorry.  Probably HtmlTimelineUI needs smarter ordering.
        this.nextEventState.sortKeyOffset = e.sortKey * this.nextEventState.jumpCount;
      }
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

    if (this.nextEventState.index < this.events.length) {
      const nextEvent = this.events[this.nextEventState.index];
      if (nextEvent) {
        const nextEventEndsAt = nextEvent.time + this.nextEventState.timeOffset;
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

    const forceEnd = this.activeLastForceJumpSync?.end;
    if (forceEnd !== undefined && forceEnd < nextSyncEnding)
      nextSyncEnding = forceEnd;

    const nextTime = Math.min(
      nextEventStarting,
      nextEventEnding,
      nextTextOccurs,
      nextSyncStarting,
      nextSyncEnding,
    );
    if (nextTime === kBig)
      return;

    console.assert(nextTime > fightNow, 'nextTime is in the past');
    this._CancelUpdate();
    this.updateTimer = window.setTimeout(
      () => this._OnUpdateTimer(Date.now()),
      (nextTime - fightNow) * 1000,
    );
  }

  public _OnUpdateTimer(currentTime: number): void {
    console.assert(this.timebase, '_OnTimerUpdate called while stopped');
    // Round to ~30ms precision to avoid micro changes of fightNow from 10 to 10.003.
    // Also round *up*, as these timers are always scheduled for the next event
    // and it doesn't make sense to schedule something for 0.8s out and then
    // round down to 0.799s and need another timer to have that text complete.
    const fightNow = Math.ceil(32 * (currentTime - this.timebase) / 1000) / 32;

    // Unlike other jumps which happen "immediately", an unconditional jump may have happened
    // in the past (+/- some timer variation).  Should we just consider that the update
    // always happens exactly at the time it should?
    const unconditionalJump = this._CheckUnconditionalJump(fightNow);
    if (unconditionalJump) {
      const jumpSource = unconditionalJump.time;
      this._AddPassedTexts(jumpSource, currentTime);
      const jumpDest = unconditionalJump.jump;
      if (jumpDest === undefined)
        throw new UnreachableCode();
      const offset = fightNow - jumpSource;
      this.SyncTo(jumpDest, currentTime - offset);

      // Handle "overhanging" windows on unconditional jumps, by rewriting:
      //   old: 500.0 sync /something/ window 20,10 jump 300
      //   new: 300.0 sync /something window 0,10 jump 300
      this.activeLastForceJumpSync = {
        ...unconditionalJump,
        time: jumpDest,
        start: jumpDest,
        end: unconditionalJump.end - unconditionalJump.time + jumpDest,
        jumpType: 'normal',
      };

      this._OnUpdateTimer(currentTime);
      return;
    }

    // Send text events now or they'd be skipped by _AdvanceTimeTo().
    this._AddPassedTexts(fightNow, currentTime);
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._AddDurationTimers(fightNow);
    this._RemoveExpiredTimers(fightNow);
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }

  public _CheckUnconditionalJump(fightNow: number): Sync | undefined {
    const forceJump = this.forceJumps[this.nextForceJump];
    if (forceJump && forceJump.time <= fightNow)
      return forceJump;
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
      if (name !== undefined)
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
