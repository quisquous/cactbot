'use strict';

// There should be (at most) six lines of instructions.
const raidbossInstructions = {
  en: [
    'Instructions as follows:',
    'This is debug text for resizing.',
    'It goes away when you lock the overlay',
    'along with the blue background.',
    'Timelines and triggers will show up in supported zones.',
    'Test raidboss with a /countdown in Summerford Farms.',
  ],
  de: [
    'Anweisungen wie folgt:',
    'Dies ist ein Debug-Text zur Größenänderung.',
    'Er verschwindet, wenn du das Overlay sperrst,',
    'zusammen mit dem blauen Hintergrund.',
    'Timeline und Trigger werden in den unterstützten Zonen angezeigt.',
    'Testen Sie Raidboss mit einem /countdown in Sommerfurt-Höfe.',
  ],
  ja: [
    '操作手順：',
    'デバッグ用のテキストです。',
    '青色のオーバーレイを',
    'ロックすれば消える。',
    'サポートするゾーンにタイムラインとトリガーテキストが表示できる。',
    'サマーフォード庄に/countdownコマンドを実行し、raidbossをテストできる。',
  ],
  cn: [
    '请按以下步骤操作：',
    '这是供用户调整悬浮窗大小的调试用文本',
    '当你锁定此蓝色背景的悬浮窗',
    '该文本即会消失。',
    '在支持的区域中会自动加载时间轴和触发器。',
    '可在盛夏农庄使用/countdown命令测试该raidboss模块。',
  ],
  ko: [
    '<조작 설명>',
    '크기 조정을 위한 디버그 창입니다',
    '파란 배경과 이 텍스트는',
    '오버레이를 위치잠금하면 사라집니다',
    '지원되는 구역에서 타임라인과 트리거가 표시됩니다',
    '여름여울 농장에서 초읽기를 실행하여 테스트 해볼 수 있습니다',
  ],
};

// Because apparently people don't understand uppercase greek letters,
// add a special case to not uppercase them.
function triggerUpperCase(str) {
  if (!str)
    return str;
  if (typeof str === 'number')
    return str;
  return str.replace(/[^αβγδ]/g, (x) => x.toUpperCase());
}

function onTriggerException(trigger, e) {
  let str = 'Error in trigger: ' + (trigger.id ? trigger.id : '[unknown trigger id]');

  if (trigger.filename)
    str += ' (' + trigger.filename + ')';
  console.error(str);

  let lines = e.stack.split('\n');
  for (let i = 0; i < lines.length; ++i)
    console.error(lines[i]);
}

class PopupText {
  constructor(options) {
    this.options = options;
    this.triggers = [];
    this.netTriggers = [];
    this.timers = {};
    this.currentTriggerID = 0;
    this.inCombat = false;
    this.resetWhenOutOfCombat = true;
    this.infoText = document.getElementById('popup-text-info');
    this.alertText = document.getElementById('popup-text-alert');
    this.alarmText = document.getElementById('popup-text-alarm');

    this.parserLang = this.options.ParserLanguage || 'en';
    this.displayLang = this.options.AlertsLanguage || this.options.DisplayLanguage || this.options.ParserLanguage || 'en';

    if (this.options.IsRemoteRaidboss || this.options.BrowserTTS) {
      this.ttsEngine = new BrowserTTSEngine(this.displayLang);
      this.ttsSay = function(text) {
        this.ttsEngine.play(text);
      };
    } else {
      this.ttsSay = function(text) {
        let cmd = { 'call': 'cactbotSay', 'text': text };
        window.callOverlayHandler(cmd);
      };
    }

    // check to see if we need user interaction to play audio
    // only if audio is enabled in options
    if (Options.AudioAllowed)
      AutoplayHelper.CheckAndPrompt();

    this.partyTracker = new PartyTracker();

    this.kMaxRowsOfText = 2;

    this.Reset();
    this.AddDebugInstructions();
    this.HookOverlays();
  }

  AddDebugInstructions() {
    const lang = this.displayLang in raidbossInstructions ? this.displayLang : 'en';
    const instructions = raidbossInstructions[lang];
    for (let i = 0; i < instructions.length; ++i) {
      const elem = document.getElementById(`instructions-${i}`);
      if (!elem)
        return;
      elem.innerHTML = instructions[i];
    }
  }

  HookOverlays() {
    addOverlayListener('PartyChanged', (e) => {
      this.partyTracker.onPartyChanged(e);
    });
    addPlayerChangedOverrideListener(Options.PlayerNameOverride, (e) => {
      this.OnPlayerChange(e);
    });
    addOverlayListener('ChangeZone', (e) => {
      this.OnChangeZone(e);
    });
    addOverlayListener('onInCombatChangedEvent', (e) => {
      this.OnInCombatChange(e.detail.inGameCombat);
    });
    addOverlayListener('onLogEvent', (e) => {
      this.OnLog(e);
    });
    addOverlayListener('LogLine', (e) => {
      this.OnNetLog(e);
    });
  }

  SetTimelineLoader(timelineLoader) {
    this.timelineLoader = timelineLoader;
  }

  OnPlayerChange(e) {
    if (this.job != e.detail.job || this.me != e.detail.name)
      this.OnJobChange(e);
    this.data.currentHP = e.detail.currentHP;
  }

  OnDataFilesRead(e) {
    this.triggerSets = Options.Triggers;
    for (let filename in e.detail.files) {
      if (!filename.endsWith('.js'))
        continue;

      let text = e.detail.files[filename];
      let json;
      try {
        json = eval(text);
      } catch (exception) {
        console.log('Error parsing JSON from ' + filename + ': ' + exception);
        continue;
      }
      if (typeof json != 'object' || !(json.length >= 0)) {
        console.log('Unexpected JSON from ' + filename + ', expected an array');
        continue;
      }
      for (let i = 0; i < json.length; ++i) {
        if (!('triggers' in json[i])) {
          console.log('Unexpected JSON from ' + filename + ', expected a triggers');
          continue;
        }
        if (typeof json[i].triggers != 'object' || !(json[i].triggers.length >= 0)) {
          console.log('Unexpected JSON from ' + filename + ', expected triggers to be an array');
          continue;
        }
        json[i].filename = filename;
      }
      Array.prototype.push.apply(this.triggerSets, json);
    }
  }

  OnChangeZone(e) {
    if (this.zoneName !== e.zoneName) {
      this.zoneName = e.zoneName;
      this.zoneId = e.zoneID;
      this.ReloadTimelines();
    }
  }

  ReloadTimelines() {
    if (!this.triggerSets || !this.me || !this.zoneName || !this.timelineLoader.IsReady())
      return;

    this.Reset();

    // Drop the triggers and timelines from the previous zone, so we can add new ones.
    this.triggers = [];
    this.netTriggers = [];
    let timelineFiles = [];
    let timelines = [];
    let replacements = [];
    let timelineTriggers = [];
    let timelineStyles = [];
    this.resetWhenOutOfCombat = true;

    // Recursively/iteratively process timeline entries for triggers.
    // Functions get called with data, arrays get iterated, strings get appended.
    let addTimeline = (function(obj) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; ++i)
          addTimeline(obj[i]);
      } else if (typeof obj == 'function') {
        addTimeline(obj(this.data));
      } else if (obj) {
        timelines.push(obj);
      }
    }).bind(this);

    // construct something like regexEn or regexFr.
    let langSuffix = this.parserLang.charAt(0).toUpperCase() + this.parserLang.slice(1);
    let regexParserLang = 'regex' + langSuffix;
    let netRegexParserLang = 'netRegex' + langSuffix;

    for (const set of this.triggerSets) {
      // zoneRegex can be undefined, a regex, or translatable object of regex.
      const haveZoneRegex = 'zoneRegex' in set;
      const haveZoneId = 'zoneId' in set;
      if (!haveZoneRegex && !haveZoneId || haveZoneRegex && haveZoneId) {
        console.error(`Trigger set must include exactly one of zoneRegex or zoneId property`);
        continue;
      }

      if (set.zoneId) {
        if (set.zoneId !== ZoneId.MatchAll && set.zoneId !== this.zoneId)
          continue;
      } else if (set.zoneRegex) {
        let zoneRegex = set.zoneRegex;
        if (typeof zoneRegex !== 'object') {
          console.error('zoneRegex must be translatable object or regexp: ' + JSON.stringify(set.zoneRegex));
          continue;
        } else if (!(zoneRegex instanceof RegExp)) {
          if (this.parserLang in zoneRegex) {
            zoneRegex = zoneRegex[this.parserLang];
          } else if ('en' in zoneRegex) {
            zoneRegex = zoneRegex['en'];
          } else {
            console.error('unknown zoneRegex parser language: ' + JSON.stringify(set.zoneRegex));
            continue;
          }

          if (!(zoneRegex instanceof RegExp)) {
            console.error('zoneRegex must be regexp: ' + JSON.stringify(set.zoneRegex));
            continue;
          }
        }
        if (this.zoneName.search(Regexes.parse(zoneRegex)) < 0)
          continue;
      }

      if (this.options.Debug) {
        if (set.filename)
          console.log('Loading ' + set.filename);
        else
          console.log('Loading user triggers for zone');
      }
      // Adjust triggers for the parser language.
      if (set.triggers && this.options.AlertsEnabled) {
        // Filter out disabled triggers
        let enabledTriggers = set.triggers.filter((trigger) => !('disabled' in trigger && trigger.disabled));

        for (let trigger of enabledTriggers) {
          // Add an additional resolved regex here to save
          // time later.  This will clobber each time we
          // load this, but that's ok.
          trigger.filename = set.filename;

          if (!trigger.regex && !trigger.netRegex) {
            console.error('Trigger ' + trigger.id + ': has no regex property specified');
            continue;
          }

          // parser-language-based regex takes precedence.
          let regex = trigger[regexParserLang] || trigger.regex;
          if (regex) {
            trigger.localRegex = Regexes.parse(regex);
            this.triggers.push(trigger);
          }

          let netRegex = trigger[netRegexParserLang] || trigger.netRegex;
          if (netRegex) {
            trigger.localNetRegex = Regexes.parse(netRegex);
            this.netTriggers.push(trigger);
          }

          if (!regex && !netRegex) {
            console.error('Trigger ' + trigger.id + ': missing regex and netRegex');
            continue;
          }
        }
      }

      // And set the timeline files/timelines from each set that matches.
      if (set.timelineFile) {
        if (set.filename) {
          let dir = set.filename.substring(0, set.filename.lastIndexOf('/'));
          timelineFiles.push(dir + '/' + set.timelineFile);
        } else {
          console.error('Can\'t specify timelineFile in non-manifest file:' + set.timelineFile);
        }
      }
      if (set.timeline)
        addTimeline(set.timeline);
      if (set.timelineReplace)
        replacements.push(...set.timelineReplace);
      if (set.timelineTriggers)
        timelineTriggers.push(...set.timelineTriggers);
      if (set.timelineStyles)
        timelineStyles.push(...set.timelineStyles);
      if (set.resetWhenOutOfCombat !== undefined)
        this.resetWhenOutOfCombat &= set.resetWhenOutOfCombat;
    }

    this.timelineLoader.SetTimelines(
        timelineFiles,
        timelines,
        replacements,
        timelineTriggers,
        timelineStyles,
    );
  }

  OnJobChange(e) {
    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTimelines();
  }

  OnInCombatChange(inCombat) {
    if (this.inCombat == inCombat)
      return;

    if (inCombat || this.resetWhenOutOfCombat)
      this.SetInCombat(inCombat);
  }

  SetInCombat(inCombat) {
    if (this.inCombat == inCombat)
      return;

    // Stop timers when stopping combat to stop any active timers that
    // are delayed.  However, also reset when starting combat.
    // This prevents late attacks from affecting |data| which
    // throws off the next run, potentially.
    this.inCombat = inCombat;
    if (!this.inCombat) {
      this.StopTimers();
      this.timelineLoader.StopCombat();
    }
    if (this.inCombat)
      this.Reset();
  }

  ShortNamify(name) {
    // TODO: make this unique among the party in case of first name collisions.
    // TODO: probably this should be a general cactbot utility.
    if (typeof name !== 'string') {
      console.error('called ShortNamify with non-string');
      return '???';
    }

    if (name in Options.PlayerNicks)
      return Options.PlayerNicks[name];

    let idx = name.indexOf(' ');
    return idx < 0 ? name : name.substr(0, idx);
  }

  Reset() {
    let preserveHP = 0;
    if (this.data && this.data.currentHP)
      preserveHP = this.data.currentHP;

    // TODO: make a breaking change at some point and
    // make all this style consistent, sorry.
    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      party: this.partyTracker,
      lang: this.parserLang,
      parserLang: this.parserLang,
      displayLang: this.displayLang,
      currentHP: preserveHP,
      options: Options,
      ShortName: this.ShortNamify,
      StopCombat: () => this.SetInCombat(false),
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
    };
    this.StopTimers();
    this.triggerSuppress = {};
  }

  StopTimers() {
    this.timers = {};
  }

  OnLog(e) {
    for (let log of e.detail.logs) {
      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (let trigger of this.triggers) {
        let r = log.match(trigger.localRegex);
        if (r != null)
          this.OnTrigger(trigger, r);
      }
    }
  }

  OnNetLog(e) {
    let log = e.rawLine;
    for (let trigger of this.netTriggers) {
      let r = log.match(trigger.localNetRegex);
      if (r != null)
        this.OnTrigger(trigger, r);
    }
  }

  OnTrigger(trigger, matches) {
    try {
      this.OnTriggerInternal(trigger, matches);
    } catch (e) {
      onTriggerException(trigger, e);
    }
  }

  OnTriggerInternal(trigger, matches) {
    let now = +new Date();

    if (this._onTriggerInternalCheckSuppressed(trigger, now))
      return;

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if ((matches != undefined) && (matches.groups != undefined))
      matches = matches.groups;

    // Set up a helper object so we don't have to throw
    // a ton of info back and forth between subfunctions
    let triggerHelper = this._onTriggerInternalGetHelper(trigger, matches, now);

    if (!this._onTriggerInternalCondition(triggerHelper))
      return;

    this._onTriggerInternalPreRun(triggerHelper);

    // Evaluate for delay here, but run delay later
    let delayPromise = this._onTriggerInternalDelaySeconds(triggerHelper);
    this._onTriggerInternalDurationSeconds(triggerHelper);
    this._onTriggerInternalSuppressSeconds(triggerHelper);

    let triggerPostDelay = () => {
      let promise = this._onTriggerInternalPromise(triggerHelper);
      let triggerPostPromise = () => {
        this._onTriggerInternalSound(triggerHelper);
        this._onTriggerInternalSoundVolume(triggerHelper);
        this._onTriggerInternalResponse(triggerHelper);
        this._onTriggerInternalAlarmText(triggerHelper);
        this._onTriggerInternalAlertText(triggerHelper);
        this._onTriggerInternalInfoText(triggerHelper);

        // Priority audio order:
        // * user disabled (play nothing)
        // * if tts options are enabled globally or for this trigger:
        //   * user groupTTS trigger groupTTS/tts override
        //   * groupTTS entries in the trigger
        //   * user TTS triggers tts override
        //   * tts entries in the trigger
        //   * default alarm tts
        //   * default alert tts
        //   * default info tts
        // * if sound options are enabled globally or for this trigger:
        //   * user trigger sound overrides
        //   * sound entries in the trigger
        //   * alarm noise
        //   * alert noise
        //   * info noise
        // * else, nothing
        //
        // In general, tts comes before sounds and user overrides come
        // before defaults.  If a user trigger or tts entry is specified as
        // being valid but empty, this will take priority over the default
        // tts texts from alarm/alert/info and will prevent tts from playing
        // and allowing sounds to be played instead.
        this._onTriggerInternalGroupTTS(triggerHelper);
        this._onTriggerInternalTTS(triggerHelper);
        this._onTriggerInternalPlayAudio(triggerHelper);
        this._onTriggerInternalRun(triggerHelper);
      };

      // The trigger body must run synchronously when there is no promise.
      if (promise)
        promise.then(triggerPostPromise, () => {});
      else
        triggerPostPromise();
    };

    // The trigger body must run synchronously when there is no delay.
    if (delayPromise)
      delayPromise.then(triggerPostDelay, () => {});
    else
      triggerPostDelay();
  }

  // Build a default triggerHelper object for this trigger
  _onTriggerInternalGetHelper(trigger, matches, now) {
    let triggerHelper;
    // Separate the creation and assignment to let the ValueOrFunction method work properly
    triggerHelper = {
      trigger: trigger,
      now: now,
      valueOrFunction: (f) => {
        let result = (typeof (f) == 'function') ? f(this.data, triggerHelper.matches) : f;
        // All triggers return either a string directly, or an object
        // whose keys are different parser language based names.  For simplicity,
        // this is valid to do for any trigger entry that can handle a function.
        // In case anybody wants to encapsulate any fancy grammar, the values
        // in this object can also be functions.
        if (typeof result !== 'object' || result === null)
          return result;
        return triggerHelper.valueOrFunction(result[this.displayLang] || result['en']);
      },
      triggerOptions: trigger.id && this.options.PerTriggerOptions[trigger.id] || {},
      triggerAutoConfig: trigger.id && this.options.PerTriggerAutoConfig[trigger.id] || {},
      // This setting only suppresses output, trigger still runs for data/logic purposes
      userSuppressedOutput: trigger.id && this.options.DisabledTriggers[trigger.id],
      matches: matches,
      response: undefined,
      // Default options
      soundUrl: undefined,
      soundVol: undefined,
      triggerSoundVol: undefined,
      defaultTTSText: undefined,
      textAlertsEnabled: this.options.TextAlertsEnabled,
      soundAlertsEnabled: this.options.SoundAlertsEnabled,
      spokenAlertsEnabled: this.options.SpokenAlertsEnabled,
      GroupSpokenAlertsEnabled: this.options.GroupSpokenAlertsEnabled,
      duration: undefined,
      ttsText: undefined,
    };

    this._onTriggerInternalHelperDefaults(triggerHelper);

    return triggerHelper;
  }

  _onTriggerInternalCheckSuppressed(trigger, when) {
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > when)
        return true;

      delete this.triggerSuppress[trigger.id];
    }
    return false;
  }

  _onTriggerInternalCondition(triggerHelper) {
    let condition = triggerHelper.triggerOptions.Condition || triggerHelper.trigger.condition;
    if (condition) {
      if (!condition(this.data, triggerHelper.matches))
        return false;
    }
    return true;
  }

  // Set defaults for triggerHelper object (anything that won't change based on
  // other trigger functions running)
  _onTriggerInternalHelperDefaults(triggerHelper) {
    if (triggerHelper.triggerAutoConfig) {
      if ('TextAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.textAlertsEnabled = triggerHelper.triggerAutoConfig.TextAlertsEnabled;
      if ('SoundAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.soundAlertsEnabled = triggerHelper.triggerAutoConfig.SoundAlertsEnabled;
      if ('SpokenAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.spokenAlertsEnabled = triggerHelper.triggerAutoConfig.SpokenAlertsEnabled;
    }

    if (triggerHelper.triggerOptions) {
      if ('TextAlert' in triggerHelper.triggerOptions)
        triggerHelper.textAlertsEnabled = triggerHelper.triggerOptions.TextAlert;
      if ('SoundAlert' in triggerHelper.triggerOptions)
        triggerHelper.soundAlertsEnabled = triggerHelper.triggerOptions.SoundAlert;
      if ('SpeechAlert' in triggerHelper.triggerOptions)
        triggerHelper.spokenAlertsEnabled = triggerHelper.triggerOptions.SpeechAlert;
      if ('GroupSpeechAlert' in triggerHelper.triggerOptions)
        triggerHelper.groupSpokenAlertsEnabled = triggerHelper.triggerOptions.GroupSpeechAlert;
    }

    if (triggerHelper.userSuppressedOutput) {
      triggerHelper.textAlertsEnabled = false;
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }
    if (!this.options.AudioAllowed) {
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }
  }

  _onTriggerInternalPreRun(triggerHelper) {
    if ('preRun' in triggerHelper.trigger)
      triggerHelper.trigger.preRun(this.data, triggerHelper.matches);
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    let delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    if (!delay || delay <= 0)
      return null;

    let triggerID = this.currentTriggerID++;
    this.timers[triggerID] = true;
    return new Promise((res, rej) => {
      window.setTimeout(() => {
        if (this.timers[triggerID])
          res();
        else if (rej)
          rej();
        delete this.timers[triggerID];
      }, delay * 1000);
    });
  }

  _onTriggerInternalDurationSeconds(triggerHelper) {
    triggerHelper.duration = {
      fromTrigger: triggerHelper.valueOrFunction(triggerHelper.trigger.durationSeconds),
      alarmText: this.options.DisplayAlarmTextForSeconds,
      alertText: this.options.DisplayAlertTextForSeconds,
      infoText: this.options.DisplayInfoTextForSeconds,
    };
  }

  _onTriggerInternalSuppressSeconds(triggerHelper) {
    let suppress = 'suppressSeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.suppressSeconds) : 0;
    if (triggerHelper.trigger.id && suppress > 0)
      this.triggerSuppress[triggerHelper.trigger.id] = triggerHelper.now + (suppress * 1000);
  }

  _onTriggerInternalPromise(triggerHelper) {
    let promise = null;
    if ('promise' in triggerHelper.trigger) {
      if (typeof triggerHelper.trigger.promise === 'function') {
        promise = triggerHelper.trigger.promise(this.data, triggerHelper.matches);
        // Make sure we actually get a Promise back from the function
        if (Promise.resolve(promise) !== promise) {
          console.error('Trigger ' + triggerHelper.trigger.id + ': promise function did not return a promise');
          promise = null;
        }
      } else {
        console.error('Trigger ' + triggerHelper.trigger.id + ': promise defined but not a function');
      }
    }
    return promise;
  }

  _onTriggerInternalSound(triggerHelper) {
    triggerHelper.soundUrl = triggerHelper.valueOrFunction(triggerHelper.trigger.sound);
  }

  _onTriggerInternalSoundVolume(triggerHelper) {
    triggerHelper.triggerSoundVol =
      triggerHelper.valueOrFunction(triggerHelper.trigger.soundVolume);
  }

  _onTriggerInternalResponse(triggerHelper) {
    let response = {};
    if (triggerHelper.trigger.response) {
      // Can't use ValueOrFunction here as r returns a non-localizable object.
      let r = triggerHelper.trigger.response;
      response = (typeof (r) == 'function') ? r(this.data, triggerHelper.matches) : r;

      // Turn falsy values into a default no-op response.
      if (!response)
        response = {};
    }
    triggerHelper.response = response;
  }

  _onTriggerInternalAlarmText(triggerHelper) {
    this._addTextFor('alarm', triggerHelper);
  }

  _onTriggerInternalAlertText(triggerHelper) {
    this._addTextFor('alert', triggerHelper);
  }

  _onTriggerInternalInfoText(triggerHelper) {
    this._addTextFor('info', triggerHelper);
  }

  _onTriggerInternalGroupTTS(triggerHelper) {
    if (triggerHelper.groupSpokenAlertsEnabled) {
      if ('GroupTTSText' in triggerHelper.triggerOptions) {
        triggerHelper.ttsText =
          triggerHelper.valueOrFunction(triggerHelper.triggerOptions.GroupTTSText);
      } else if ('groupTTS' in triggerHelper.trigger) {
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.trigger.groupTTS);
      } else if ('groupTTS' in triggerHelper.response) {
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.response.groupTTS);
      }
    }
  }

  _onTriggerInternalTTS(triggerHelper) {
    if (!triggerHelper.groupSpokenAlertsEnabled || typeof triggerHelper.ttsText === 'undefined') {
      if ('TTSText' in triggerHelper.triggerOptions)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.triggerOptions.TTSText);
      else if ('tts' in triggerHelper.trigger)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.trigger.tts);
      else if ('tts' in triggerHelper.response)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.response.TTSText);
      else
        triggerHelper.ttsText = triggerHelper.defaultTTSText;
    }
  }

  _onTriggerInternalPlayAudio(triggerHelper) {
    if (triggerHelper.trigger.sound && triggerHelper.soundUrl) {
      let namedSound = triggerHelper.soundUrl + 'Sound';
      let namedSoundVolume = triggerHelper.soundUrl + 'SoundVolume';
      if (namedSound in this.options) {
        triggerHelper.soundUrl = this.options[namedSound];
        if (namedSoundVolume in this.options)
          triggerHelper.soundVol = this.options[namedSoundVolume];
      }
    }

    triggerHelper.soundUrl = triggerHelper.triggerOptions.SoundOverride || triggerHelper.soundUrl;
    triggerHelper.soundVol = triggerHelper.triggerOptions.VolumeOverride ||
      triggerHelper.triggerSoundVol || triggerHelper.soundVol;

    // Text to speech overrides all other sounds.  This is so
    // that a user who prefers tts can still get the benefit
    // of infoText triggers without tts entries by turning
    // on (speech=true, text=true, sound=true) but this will
    // not cause tts to play over top of sounds or noises.
    if (triggerHelper.ttsText && triggerHelper.spokenAlertsEnabled) {
      // Heuristics for auto tts.
      // * In case this is an integer.
      triggerHelper.ttsText = triggerHelper.ttsText.toString();
      // * Remove a bunch of chars.
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[#!]/g, '');
      // * slashes between mechanics
      triggerHelper.ttsText = triggerHelper.ttsText.replace('/', ' ');
      // * tildes at the end for emphasis
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/~+$/, '');
      // * arrows helping visually simple to understand e.g. ↖ Front left / Back right ↘
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[↖-↙]/g, '');
      // * Korean TTS reads wrong with '1번째'
      triggerHelper.ttsText = triggerHelper.ttsText.replace('1번째', '첫번째');
      // * arrows at the front or the end are directions, e.g. "east =>"
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[-=]>\s*$/g, '');
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/^\s*<[-=]/g, '');
      // * arrows in the middle are a sequence, e.g. "in => out => spread"
      const arrowReplacement = {
        en: ' then ',
        cn: '然后',
        de: ' dann ',
        fr: ' puis ',
        ja: 'や',
        ko: ' 그리고 ',
      };
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/\s*(<[-=]|[=-]>)\s*/g,
          arrowReplacement[this.displayLang]);
      this.ttsSay(triggerHelper.ttsText);
    } else if (triggerHelper.soundUrl && triggerHelper.soundAlertsEnabled) {
      this._playAudioFile(triggerHelper.soundUrl, triggerHelper.soundVol);
    }
  }

  _onTriggerInternalRun(triggerHelper) {
    if ('run' in triggerHelper.trigger)
      triggerHelper.trigger.run(this.data, triggerHelper.matches);
  }

  _createTextFor(text, textType, lowerTextKey, duration) {
    // info-text
    let textElementClass = textType + '-text';
    if (textType !== 'info')
      text = triggerUpperCase(text);
    let holder = this[lowerTextKey].getElementsByClassName('holder')[0];
    let div = this._makeTextElement(text, textElementClass);

    holder.appendChild(div);
    if (holder.children.length > this.kMaxRowsOfText)
      holder.removeChild(holder.children[0]);

    window.setTimeout(() => {
      if (holder.contains(div))
        holder.removeChild(div);
    }, duration * 1000);
  }

  _addTextFor(textType, triggerHelper) {
    // Info
    let textTypeUpper = textType[0].toUpperCase() + textType.slice(1);
    // infoText
    let lowerTextKey = textType + 'Text';
    // InfoText
    let upperTextKey = textTypeUpper + 'Text';
    let textObj = triggerHelper.triggerOptions[upperTextKey] ||
      triggerHelper.trigger[lowerTextKey] || triggerHelper.response[lowerTextKey];
    if (textObj) {
      let text = triggerHelper.valueOrFunction(textObj);
      triggerHelper.defaultTTSText = triggerHelper.defaultTTSText || text;
      if (text && triggerHelper.textAlertsEnabled) {
        this._createTextFor(text, textType, lowerTextKey,
            (triggerHelper.duration.fromTrigger || triggerHelper.duration[lowerTextKey]));
        if (!triggerHelper.soundUrl) {
          triggerHelper.soundUrl = this.options[textTypeUpper + 'Sound'];
          triggerHelper.soundVol = this.options[textTypeUpper + 'SoundVolume'];
        }
      }
    }
  }

  _makeTextElement(text, className) {
    let div = document.createElement('div');
    div.classList.add(className);
    div.classList.add('animate-text');
    div.innerText = text;
    return div;
  }

  _playAudioFile(url, volume) {
    let audio = new Audio(url);
    audio.volume = volume || 1;
    audio.play();
  }

  Test(zone, log) {
    this.OnPlayerChange({ detail: { name: 'ME' } });
    this.OnChangeZone({ zoneName: zone });
    this.OnLog({ detail: { logs: ['abcdefgh', log, 'hgfedcba'] } });
  }
}

class PopupTextGenerator {
  constructor(popupText) {
    this.popupText = popupText;
  }

  Info(text) {
    this.popupText.OnTrigger({
      infoText: text,
      tts: text,
    });
  }

  Alert(text) {
    this.popupText.OnTrigger({
      alertText: text,
      tts: text,
    });
  }

  Alarm(text) {
    this.popupText.OnTrigger({
      alarmText: text,
      tts: text,
    });
  }

  TTS(text) {
    this.popupText.OnTrigger({
      infoText: text,
      tts: text,
    });
  }

  Trigger(trigger, matches) {
    this.popupText.OnTrigger(trigger, matches);
  }
}

let gPopupText;
