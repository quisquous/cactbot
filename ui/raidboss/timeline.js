import { commonReplacement } from './common_replacement';
import Regexes from '../../resources/regexes';
import { LocaleRegex } from '../../resources/translations';

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

function computeBackgroundColorFrom(element, classList) {
  const div = document.createElement('div');
  const classes = classList.split('.');
  for (let i = 0; i < classes.length; ++i)
    div.classList.add(classes[i]);
  element.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  element.removeChild(div);
  return color;
}

// This class reads the format of ACT Timeline plugin, described in
// docs/TimelineGuide.md
export class Timeline {
  constructor(text, replacements, triggers, styles, options) {
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

  GetReplacedHelper(text, replaceKey, replaceLang, isGlobal) {
    if (!this.replacements)
      return text;

    for (const r of this.replacements) {
      if (r.locale && r.locale !== replaceLang)
        continue;
      if (!r[replaceKey])
        continue;
      const keys = Object.keys(r[replaceKey]);
      for (const key of keys)
        text = text.replace(Regexes.parse(key), r[replaceKey][key]);
    }
    // Common Replacements
    for (const key in commonReplacement[replaceKey]) {
      const repl = commonReplacement[replaceKey][key][replaceLang];
      if (!repl)
        continue;
      const regex = isGlobal ? Regexes.parseGlobal(key) : Regexes.parse(key);
      text = text.replace(regex, repl);
    }
    return text;
  }

  GetReplacedText(text) {
    if (!this.replacements)
      return text;

    const replaceLang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    const isGlobal = false;
    return this.GetReplacedHelper(text, 'replaceText', replaceLang, isGlobal);
  }

  GetReplacedSync(sync) {
    if (!this.replacements)
      return sync;

    const replaceLang = this.options.ParserLanguage || 'en';
    const isGlobal = true;
    return this.GetReplacedHelper(sync, 'replaceSync', replaceLang, isGlobal);
  }

  GetMissingTranslationsToIgnore() {
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

  LoadFile(text, triggers, styles) {
    this.events = [];
    this.syncStarts = [];
    this.syncEnds = [];

    let uniqueid = 1;
    const texts = {};
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
    if (triggers) {
      for (const trigger of triggers) {
        if (trigger.regex)
          trigger.regex = Regexes.parse(trigger.regex);
      }
    }

    const lines = text.split('\n');
    for (let i = 0; i < lines.length; ++i) {
      const lineNumber = i + 1;
      let line = lines[i];
      line = line.trim();
      // Drop comments and empty lines.
      if (!line || regexes.comment.test(line))
        continue;
      const originalLine = line;

      let match = regexes.ignore.exec(line);
      if (match && match['groups']) {
        const ignore = match['groups'];
        this.ignores[ignore.id] = true;
        continue;
      }

      match = regexes.tts.exec(line);
      if (match && match['groups']) {
        const tts = match['groups'];
        // TODO: Support alert sounds?
        if (tts.command === 'sound')
          continue;
        texts[tts.id] = texts[tts.id] || [];
        texts[tts.id].push({
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
        texts[popupText.id] = texts[popupText.id] || [];
        texts[popupText.id].push({
          type: popupText.type,
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
      line = line.replace(parsedLine.text, '').trim();
      // There can be # in the ability name, but probably not in the regex.
      line = line.replace(regexes.commentLine, '').trim();

      const seconds = parseFloat(parsedLine.time);
      const e = {
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
          line = line.replace(durationCommand.text, '').trim();
          e.duration = parseFloat(durationCommand.seconds);
        }

        commandMatch = regexes.syncCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const syncCommand = commandMatch['groups'];
          line = line.replace(syncCommand.text, '').trim();
          const sync = {
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
        console.log('Unknown content \'' + line + '\' in timeline: ' + originalLine);
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
    if (triggers) {
      for (const trigger of triggers) {
        let found = false;
        for (const event of this.events) {
          if (trigger.regex && trigger.regex.test(event.name)) {
            found = true;
            break;
          }
        }
        if (!found) {
          const text = `No match for timeline trigger ${trigger.regex} in ${trigger.id}`;
          this.errors.push({ error: text });
          console.error(`*** ERROR: ${text}`);
        }
      }
    }

    for (const e of this.events) {
      if (e.name in texts) {
        for (const matchedTextEvent of texts[e.name]) {
          const t = {
            type: matchedTextEvent.type,
            time: e.time - matchedTextEvent.secondsBefore,
            text: matchedTextEvent.text,
          };
          this.texts.push(t);
        }
      }

      // Rather than matching triggers at run time, pre-match all the triggers
      // against timeline text and insert them as text events to run.
      if (triggers) {
        for (const trigger of triggers) {
          const m = trigger.regex.exec(e.name);
          if (!m)
            continue;

          // TODO: beforeSeconds should support being a function.
          const autoConfig = trigger.id && this.perTriggerAutoConfig[trigger.id] || {};
          const configOverride = autoConfig['BeforeSeconds'];
          const beforeSeconds = configOverride ? configOverride : trigger.beforeSeconds;

          this.texts.push({
            type: 'trigger',
            time: e.time - (beforeSeconds || 0),
            trigger: trigger,
            matches: m,
          });
        }
      }

      if (styles) {
        for (const style of styles) {
          if (!style.regex.test(e.name))
            continue;
          Object.assign(e, { style: style.style });
        }
      }
    }

    // Sort by time, but when the time is the same, sort by file order.
    // Then assign a sortKey to each event so that we can maintain that order.
    this.events.sort((a, b) => {
      if (a.time === b.time) return a.id - b.id;
      return a.time - b.time;
    });
    for (let i = 0; i < this.events.length; ++i)
      this.events[i].sortKey = i;

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

  Stop() {
    this.timebase = null;

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

  SyncTo(fightNow, currentTime) {
    // This records the actual time which aligns with "0" in the timeline.
    const newTimebase = new Date(currentTime - fightNow * 1000);
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

  _CollectActiveSyncs(fightNow) {
    this.activeSyncs = [];
    for (let i = this.nextSyncEnd; i < this.syncEnds.length; ++i) {
      if (this.syncEnds[i].start <= fightNow)
        this.activeSyncs.push(this.syncEnds[i]);
    }
  }

  OnLogLine(line, currentTime) {
    for (let i = 0; i < this.activeSyncs.length; ++i) {
      const sync = this.activeSyncs[i];
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

  _AdvanceTimeTo(fightNow) {
    while (this.nextEvent < this.events.length && this.events[this.nextEvent].time <= fightNow)
      ++this.nextEvent;
    while (this.nextText < this.texts.length && this.texts[this.nextText].time <= fightNow)
      ++this.nextText;
    while (this.nextSyncStart < this.syncStarts.length &&
        this.syncStarts[this.nextSyncStart].start <= fightNow)
      ++this.nextSyncStart;

    while (this.nextSyncEnd < this.syncEnds.length &&
        this.syncEnds[this.nextSyncEnd].end <= fightNow)
      ++this.nextSyncEnd;
  }

  _ClearTimers() {
    if (this.removeTimerCallback) {
      for (let i = 0; i < this.activeEvents.length; ++i)
        this.removeTimerCallback(this.activeEvents[i], false);
    }
    this.activeEvents = [];
  }

  _ClearExceptRunningDurationTimers(fightNow) {
    const durationEvents = [];
    for (let i = 0; i < this.activeEvents.length; ++i) {
      if (this.activeEvents[i].isDur && this.activeEvents[i].time > fightNow) {
        durationEvents.push(this.activeEvents[i]);
        continue;
      }
      if (this.removeTimerCallback)
        this.removeTimerCallback(this.activeEvents[i], false);
    }

    this.activeEvents = durationEvents;
  }

  _RemoveExpiredTimers(fightNow) {
    while (this.activeEvents.length && this.activeEvents[0].time <= fightNow) {
      if (this.removeTimerCallback)
        this.removeTimerCallback(this.activeEvents[0], true);
      this.activeEvents.splice(0, 1);
    }
  }

  _AddDurationTimers(fightNow) {
    const events = [];
    for (let i = 0; i < this.activeEvents.length; ++i) {
      const e = this.activeEvents[i];
      if (e.time <= fightNow && e.duration) {
        const durationEvent = {
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

  _AddUpcomingTimers(fightNow) {
    while (this.nextEvent < this.events.length &&
        this.activeEvents.length < this.options.MaxNumberOfTimerBars) {
      const e = this.events[this.nextEvent];
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

  _AddPassedTexts(fightNow) {
    while (this.nextText < this.texts.length) {
      const t = this.texts[this.nextText];
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

  _CancelUpdate() {
    if (this.updateTimer) {
      window.clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }

  _ScheduleUpdate(fightNow) {
    console.assert(this.timebase, '_ScheduleUpdate called while stopped');

    const kBig = 1000000000; // Something bigger than any fight length in seconds.
    let nextEventStarting = kBig;
    let nextTextOccurs = kBig;
    let nextEventEnding = kBig;
    let nextSyncStarting = kBig;
    let nextSyncEnding = kBig;

    if (this.nextEvent < this.events.length) {
      const nextEventEndsAt = this.events[this.nextEvent].time;
      console.assert(nextEventStarting > fightNow, 'nextEvent wasn\'t updated before calling _ScheduleUpdate');
      // There might be more events than we can show, so the next event might be in
      // the past. If that happens, then ignore it, as we can't use that for our timer.
      const showNextEventAt = nextEventEndsAt - this.options.ShowTimerBarsAtSeconds;
      if (showNextEventAt > fightNow)
        nextEventStarting = showNextEventAt;
    }
    if (this.nextText < this.texts.length) {
      nextTextOccurs = this.texts[this.nextText].time;
      console.assert(nextTextOccurs > fightNow, 'nextText wasn\'t updated before calling _ScheduleUpdate');
    }
    if (this.activeEvents.length > 0) {
      nextEventEnding = this.activeEvents[0].time;
      console.assert(nextEventEnding > fightNow, 'Expired activeEvents weren\'t pruned before calling _ScheduleUpdate');
    }
    if (this.nextSyncStart < this.syncStarts.length) {
      nextSyncStarting = this.syncStarts[this.nextSyncStart].start;
      console.assert(nextSyncStarting > fightNow, 'nextSyncStart wasn\'t updated before calling _ScheduleUpdate');
    }
    if (this.nextSyncEnd < this.syncEnds.length) {
      nextSyncEnding = this.syncEnds[this.nextSyncEnd].end;
      console.assert(nextSyncEnding > fightNow, 'nextSyncEnd wasn\'t updated before calling _ScheduleUpdate');
    }

    const nextTime = Math.min(nextEventStarting, Math.min(nextEventEnding,
        Math.min(nextTextOccurs, Math.min(nextSyncStarting, nextSyncEnding))));
    if (nextTime !== kBig) {
      console.assert(nextTime > fightNow, 'nextTime is in the past');
      this.updateTimer = window.setTimeout(
          () => {
            this._OnUpdateTimer(+new Date());
          },
          (nextTime - fightNow) * 1000);
    }
  }

  _OnUpdateTimer(currentTime) {
    console.assert(this.timebase, '_OnTimerUpdate called while stopped');

    // This is the number of seconds into the fight (subtracting Dates gives milliseconds).
    const fightNow = (currentTime - this.timebase) / 1000;
    // Send text events now or they'd be skipped by _AdvanceTimeTo().
    this._AddPassedTexts(fightNow, true);
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._AddDurationTimers(fightNow);
    this._RemoveExpiredTimers(fightNow);
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }

  SetAddTimer(c) {
    this.addTimerCallback = c;
  }
  SetRemoveTimer(c) {
    this.removeTimerCallback = c;
  }
  SetShowInfoText(c) {
    this.showInfoTextCallback = c;
  }
  SetShowAlertText(c) {
    this.showAlertTextCallback = c;
  }
  SetShowAlarmText(c) {
    this.showAlarmTextCallback = c;
  }
  SetSpeakTTS(c) {
    this.speakTTSCallback = c;
  }
  SetTrigger(c) {
    this.triggerCallback = c;
  }
  SetSyncTime(c) {
    this.syncTimeCallback = c;
  }
}

export class TimelineUI {
  constructor(options) {
    this.options = options;
    this.init = false;
    this.lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    this.AddDebugInstructions();
  }

  Init() {
    if (this.init)
      return;
    this.init = true;

    this.root = document.getElementById('timeline-container');
    this.root.classList.add('lang-' + this.lang);
    if (this.options.Skin)
      this.root.classList.add('skin-' + this.options.Skin);

    this.barColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color');
    this.barExpiresSoonColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color.soon');

    this.timerlist = document.getElementById('timeline');
    this.timerlist.style.gridTemplateRows = 'repeat(' + this.options.MaxNumberOfTimerBars + ', 1fr)';
    this.activeBars = {};
    this.expireTimers = {};
  }

  AddDebugInstructions() {
    const lang = this.lang in timelineInstructions ? this.lang : 'en';
    const instructions = timelineInstructions[lang];

    // Helper for positioning/resizing when locked.
    const helper = document.getElementById('timeline-resize-helper');
    const rows = Math.max(6, this.options.MaxNumberOfTimerBars);
    helper.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';

    for (let i = 0; i < this.options.MaxNumberOfTimerBars; ++i) {
      const helperBar = document.createElement('div');
      helperBar.classList.add('text');
      helperBar.classList.add('resize-helper-bar');
      helperBar.classList.add('timeline-bar-color');
      if (i < 1)
        helperBar.classList.add('soon');
      if (i < instructions.length)
        helperBar.innerText = instructions[i];
      else
        helperBar.innerText = i + 1;
      helper.appendChild(helperBar);
    }

    // For simplicity in code, always make debugElement valid,
    // however it does not exist in the raid emulator.
    this.debugElement = document.getElementById('timeline-debug');
    if (!this.debugElement)
      this.debugElement = document.createElement('div');
  }

  SetPopupTextInterface(popupText) {
    this.popupText = popupText;
  }

  SetTimeline(timeline) {
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
      while (this.timerlist.lastChild)
        this.timerlist.removeChild(this.timerlist.lastChild);
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

  OnAddTimer(fightNow, e, channeling) {
    const div = document.createElement('div');
    const bar = document.createElement('timer-bar');
    div.classList.add('timer-bar');
    div.appendChild(bar);
    bar.duration = channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds;
    bar.value = e.time - fightNow;
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
    if (this.activeBars[e.id]) {
      const div = this.activeBars[e.id].parentNode;
      div.parentNode.removeChild(div);
    }

    div.style.order = e.sortKey;
    div.id = e.id;
    this.timerlist.appendChild(div);
    this.activeBars[e.id] = bar;
    if (e.id in this.expireTimers) {
      window.clearTimeout(this.expireTimers[e.id]);
      delete this.expireTimers[e.id];
    }
  }

  OnTimerExpiresSoon(id) {
    if (id in this.activeBars)
      this.activeBars[id].fg = this.barExpiresSoonColor;
  }

  OnRemoveTimer(e, expired) {
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
    const div = bar.parentNode;
    div.parentNode.removeChild(div);
    delete this.activeBars[e.id];
  }

  OnShowInfoText(text) {
    if (this.popupText)
      this.popupText.Info(text);
  }

  OnShowAlertText(text) {
    if (this.popupText)
      this.popupText.Alert(text);
  }

  OnShowAlarmText(text) {
    if (this.popupText)
      this.popupText.Alarm(text);
  }

  OnSpeakTTS(text) {
    if (this.popupText)
      this.popupText.TTS(text);
  }

  OnTrigger(trigger, matches) {
    if (this.popupText)
      this.popupText.Trigger(trigger, matches);
  }

  OnSyncTime(fightNow, running) {
    if (!this.options.Debug)
      return;

    if (!running) {
      if (this.debugFightTimer)
        this.debugElement.removeChild(this.debugFightTimer);
      delete this.debugFightTimer;
      return;
    }

    if (!this.debugFightTimer) {
      this.debugFightTimer = document.createElement('timer-bar');
      this.debugFightTimer.width = '100px';
      this.debugFightTimer.height = '17px';
      this.debugFightTimer.duration = 10000; // anything big
      this.debugFightTimer.lefttext = 'elapsed';
      this.debugFightTimer.toward = 'right';
      this.debugFightTimer.stylefill = 'fill';
      this.debugFightTimer.bg = 'transparent';
      this.debugFightTimer.fg = 'transparent';
      this.debugElement.appendChild(this.debugFightTimer);
    }

    // Force this to be reset.
    this.debugFightTimer.elapsed = 0;
    this.debugFightTimer.elapsed = fightNow;
  }
}

export class TimelineController {
  constructor(options, ui, raidbossDataFiles) {
    this.options = options;
    this.ui = ui;

    this.timelines = {};
    for (const f in raidbossDataFiles) {
      if (!f.endsWith('.txt'))
        continue;
      this.timelines[f] = raidbossDataFiles[f];
    }

    // Used to suppress any Engage! if there's a wipe between /countdown and Engage!.
    this.suppressNextEngage = false;
    this.wipeRegex = Regexes.network6d({ command: '40000010' });
  }

  SetPopupTextInterface(popupText) {
    this.ui.SetPopupTextInterface(popupText);
  }

  SetInCombat(inCombat) {
    // Wipe lines come before combat is false, but because OnLogEvent doesn't process
    // lines when out of combat, suppress any engages that come before the next countdown
    // just as a safety, especially for old ARR content where wipe lines don't happen.
    if (!inCombat)
      this.suppressNextEngage = true;
    if (!inCombat && this.activeTimeline)
      this.activeTimeline.Stop();
  }

  OnLogEvent(e) {
    if (!this.activeTimeline)
      return;

    const currentTime = +new Date();

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

  SetActiveTimeline(timelineFiles, timelines, replacements, triggers, styles) {
    this.activeTimeline = null;

    let text = '';

    // Get the text from each file in |timelineFiles|.
    for (let i = 0; i < timelineFiles.length; ++i) {
      const name = timelineFiles[i];
      if (name in this.timelines)
        text = text + '\n' + this.timelines[name];
      else
        console.log('Timeline file not found: ' + name);
    }
    // Append text from each block in |timelines|.
    for (let i = 0; i < timelines.length; ++i)
      text = text + '\n' + timelines[i];

    if (text)
      this.activeTimeline = new Timeline(text, replacements, triggers, styles, this.options);
    this.ui.SetTimeline(this.activeTimeline);
  }

  IsReady() {
    return this.timelines !== null;
  }
}

export class TimelineLoader {
  constructor(timelineController) {
    this.timelineController = timelineController;
  }

  SetTimelines(timelineFiles, timelines, replacements, triggers, styles) {
    this.timelineController.SetActiveTimeline(
        timelineFiles,
        timelines,
        replacements,
        triggers,
        styles,
    );
  }

  IsReady() {
    return this.timelineController.IsReady();
  }

  StopCombat() {
    this.timelineController.SetInCombat(false);
  }
}
