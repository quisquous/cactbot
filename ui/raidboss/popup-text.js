'use strict';

// Because apparently people don't understand uppercase greek letters,
// add a special case to not uppercase them.
function triggerUpperCase(str) {
  if (!str)
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
    this.timers = {};
    this.CurrentTriggerID = 0;
    this.inCombat = false;
    this.resetWhenOutOfCombat = true;
    this.infoText = document.getElementById('popup-text-info');
    this.alertText = document.getElementById('popup-text-alert');
    this.alarmText = document.getElementById('popup-text-alarm');

    if (this.options.BrowserTTS) {
      this.ttsEngine = new BrowserTTSEngine();
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
    if (Options.audioAllowed)
      AutoplayHelper.CheckAndPrompt();

    this.partyTracker = new PartyTracker();
    addOverlayListener('PartyChanged', (e) => {
      this.partyTracker.onPartyChanged(e);
    });

    this.kMaxRowsOfText = 2;

    this.Reset();

    addOverlayListener('onPlayerChangedEvent', (e) => {
      this.OnPlayerChange(e);
    });
    addOverlayListener('onZoneChangedEvent', (e) => {
      this.OnZoneChange(e);
    });
    addOverlayListener('onInCombatChangedEvent', (e) => {
      this.OnInCombatChange(e.detail.inGameCombat);
    });
    addOverlayListener('onLogEvent', (e) => {
      this.OnLog(e);
    });
  }

  SetTimelineLoader(timelineLoader) {
    this.timelineLoader = timelineLoader;
  }

  OnPlayerChange(e) {
    // allow override of player via query parameter
    // only apply override if player is in party
    if (Options.PlayerNameOverride !== null) {
      let tmpJob = null;
      if (Options.PlayerJobOverride !== null)
        tmpJob = Options.PlayerJobOverride;
      else if (this.partyTracker.inParty(Options.PlayerNameOverride))
        tmpJob = this.partyTracker.jobName(this.me);
      // if there's any issue with looking up player name for
      // override, don't perform override
      if (tmpJob !== null) {
        e.detail.job = tmpJob;
        e.detail.name = Options.PlayerNameOverride;
      }
    }
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
        if (!('zoneRegex' in json[i])) {
          console.log('Unexpected JSON from ' + filename + ', expected a zoneRegex');
          continue;
        }
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

  OnZoneChange(e) {
    if (this.zoneName !== e.detail.zoneName) {
      this.zoneName = e.detail.zoneName;
      this.ReloadTimelines();
    }
  }

  ReloadTimelines() {
    if (!this.triggerSets || !this.me || !this.zoneName || !this.timelineLoader.IsReady())
      return;

    this.Reset();

    // Drop the triggers and timelines from the previous zone, so we can add new ones.
    this.triggers = [];
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
      } else if (typeof (obj) == 'function') {
        addTimeline(obj(this.data));
      } else if (obj) {
        timelines.push(obj);
      }
    }).bind(this);

    let locale = this.options.Language || 'en';
    // construct something like regexEn or regexFr.
    let regexLocale = 'regex' + locale.charAt(0).toUpperCase() + locale.slice(1);

    for (let i = 0; i < this.triggerSets.length; ++i) {
      let set = this.triggerSets[i];

      // zoneRegex can be either a regular expression
      let zoneRegex = set.zoneRegex;
      if (typeof zoneRegex !== 'object') {
        console.error('zoneRegex must be translatable object or regexp: ' + JSON.stringify(set.zoneRegex));
        continue;
      } else if (!(zoneRegex instanceof RegExp)) {
        let locale = this.options.Language || 'en';
        if (locale in zoneRegex) {
          zoneRegex = zoneRegex[locale];
        } else if ('en' in zoneRegex) {
          zoneRegex = zoneRegex['en'];
        } else {
          console.error('unknown zoneRegex locale: ' + JSON.stringify(set.zoneRegex));
          continue;
        }

        if (!(zoneRegex instanceof RegExp)) {
          console.error('zoneRegex must be regexp: ' + JSON.stringify(set.zoneRegex));
          continue;
        }
      }

      if (this.zoneName.search(zoneRegex) >= 0) {
        if (this.options.Debug) {
          if (set.filename)
            console.log('Loading ' + set.filename);
          else
            console.log('Loading user triggers for zone');
        }
        // Adjust triggers for the locale.
        if (set.triggers && this.options.AlertsEnabled) {
          // Filter out disabled triggers
          let enabledTriggers = set.triggers.filter((trigger) => !('disabled' in trigger && trigger.disabled));

          for (let j = 0; j < enabledTriggers.length; ++j) {
            // Add an additional resolved regex here to save
            // time later.  This will clobber each time we
            // load this, but that's ok.
            let trigger = enabledTriggers[j];
            trigger.filename = set.filename;

            if (!trigger.regex)
              console.error('Trigger ' + trigger.id + ': has no regex property specified');

            // Locale-based regex takes precedence.
            let regex = trigger[regexLocale] ? trigger[regexLocale] : trigger.regex;
            if (!regex) {
              console.error('Trigger ' + trigger.id + ': undefined ' + regexLocale);
              continue;
            }
            trigger.localRegex = Regexes.parse(regex);
          }

          // Save the triggers from each set that matches.
          this.triggers.push(...enabledTriggers);
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

    if (name in Options.PlayerNicks)
      return Options.PlayerNicks[name];

    let idx = name.indexOf(' ');
    return idx < 0 ? name : name.substr(0, idx);
  }

  Reset() {
    let locale = this.options.Language || 'en';
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
      lang: locale,
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
    for (let i in this.timers.length)
      this.timers[i] = false;
  }

  OnLog(e) {
    for (let i = 0; i < e.detail.logs.length; i++) {
      let log = e.detail.logs[i];
      if (log.indexOf('00:0038:cactbot wipe') >= 0)
        this.SetInCombat(false);

      for (let j = 0; j < this.triggers.length; ++j) {
        let trigger = this.triggers[j];
        let r = log.match(trigger.localRegex);
        if (r != null)
          this.OnTrigger(trigger, r);
      }
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

    if (!this._OnTriggerInternal_CheckSuppressed(trigger, now))
      return;

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if ((matches != undefined) && (matches.groups != undefined))
      matches = matches.groups;

    // Set up a helper object so we don't have to throw
    // a ton of info back and forth between subfunctions
    let TriggerHelper = this._OnTriggerInternal_GetHelper(trigger, matches, now);

    if (!this._OnTriggerInternal_Condition(TriggerHelper))
      return;

    this._OnTriggerInternal_PreRun(TriggerHelper);

    // Evaluate for delay here, but run delay later
    let DelayPromise = this._OnTriggerInternal_DelaySeconds(TriggerHelper);
    this._OnTriggerInternal_DurationSeconds(TriggerHelper);
    this._OnTriggerInternal_SuppressSeconds(TriggerHelper);

    DelayPromise.then(() => {
      this._OnTriggerInternal_Promise(TriggerHelper).then(() => {
        this._OnTriggerInternal_Sound(TriggerHelper);
        this._OnTriggerInternal_SoundVolume(TriggerHelper);
        this._OnTriggerInternal_Response(TriggerHelper);
        this._OnTriggerInternal_AlarmText(TriggerHelper);
        this._OnTriggerInternal_AlertText(TriggerHelper);
        this._OnTriggerInternal_InfoText(TriggerHelper);

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
        this._OnTriggerInternal_GroupTTS(TriggerHelper);
        this._OnTriggerInternal_TTS(TriggerHelper);
        this._OnTriggerInternal_PlayAudio(TriggerHelper);
        this._OnTriggerInternal_Run(TriggerHelper);
      });
    });
  }

  // Build a default TriggerHelper object for this trigger
  _OnTriggerInternal_GetHelper(trigger, matches, now) {
    let TriggerHelper;
    // Separate the creation and assignment to let the ValueOrFunction method work properly
    TriggerHelper = {
      Trigger: trigger,
      Now: now,
      ValueOrFunction: (f) => {
        let result = (typeof (f) == 'function') ? f(this.data, TriggerHelper.Matches) : f;
        // All triggers return either a string directly, or an object
        // whose keys are different locale names.  For simplicity, this is
        // valid to do for any trigger entry that can handle a function.
        // In case anybody wants to encapsulate any fancy grammar, the values
        // in this object can also be functions.
        if (result !== Object(result))
          return result;
        let lang = this.options.AlertsLanguage || this.options.Language || 'en';
        if (result[lang])
          return TriggerHelper.ValueOrFunction(result[lang]);
        // For partially localized results where this localization doesn't
        // exist, prefer English over nothing.
        return TriggerHelper.ValueOrFunction(result['en']);
      },
      TriggerOptions: trigger.id && this.options.PerTriggerOptions[trigger.id] || {},
      TriggerAutoConfig: trigger.id && this.options.PerTriggerAutoConfig[trigger.id] || {},
      // This setting onyl suppresses output, trigger still runs for data/logic purposes
      UserSuppressedOutput: trigger.id && this.options.DisabledTriggers[trigger.id],
      Matches: matches,
      Response: undefined,
      // Default options
      SoundUrl: undefined,
      SoundVol: undefined,
      TriggerSoundVol: undefined,
      DefaultTTSText: undefined,
      TextAlertsEnabled: this.options.TextAlertsEnabled,
      SoundAlertsEnabled: this.options.SoundAlertsEnabled,
      SpokenAlertsEnabled: this.options.SpokenAlertsEnabled,
      GroupSpokenAlertsEnabled: this.options.GroupSpokenAlertsEnabled,
      Duration: undefined,
      TTSText: undefined,
    };

    this._OnTriggerInternal_HelperDefaults(TriggerHelper);

    return TriggerHelper;
  }

  _OnTriggerInternal_CheckSuppressed(trigger, when) {
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > when)
        return false;

      delete this.triggerSuppress[trigger.id];
    }
    return true;
  }

  _OnTriggerInternal_Condition(TriggerHelper) {
    let condition = TriggerHelper.TriggerOptions.Condition || TriggerHelper.Trigger.condition;
    if (condition) {
      if (!condition(this.data, TriggerHelper.Matches))
        return false;
    }
    return true;
  }

  // Set defaults for TriggerHelper object (anything that won't change based on
  // other trigger functions running)
  _OnTriggerInternal_HelperDefaults(TriggerHelper) {
    if (TriggerHelper.TriggerAutoConfig) {
      if ('TextAlertsEnabled' in TriggerHelper.TriggerAutoConfig)
        TriggerHelper.TextAlertsEnabled = TriggerHelper.TriggerAutoConfig.TextAlertsEnabled;
      if ('SoundAlertsEnabled' in TriggerHelper.TriggerAutoConfig)
        TriggerHelper.SoundAlertsEnabled = TriggerHelper.TriggerAutoConfig.SoundAlertsEnabled;
      if ('SpokenAlertsEnabled' in TriggerHelper.TriggerAutoConfig)
        TriggerHelper.SpokenAlertsEnabled = TriggerHelper.TriggerAutoConfig.SpokenAlertsEnabled;
    }

    if (TriggerHelper.TriggerOptions) {
      if ('TextAlert' in TriggerHelper.TriggerOptions)
        TriggerHelper.TextAlertsEnabled = TriggerHelper.TriggerOptions.TextAlert;
      if ('SoundAlert' in TriggerHelper.TriggerOptions)
        TriggerHelper.SoundAlertsEnabled = TriggerHelper.TriggerOptions.SoundAlert;
      if ('SpeechAlert' in TriggerHelper.TriggerOptions)
        TriggerHelper.SpokenAlertsEnabled = TriggerHelper.TriggerOptions.SpeechAlert;
      if ('GroupSpeechAlert' in TriggerHelper.TriggerOptions)
        TriggerHelper.GroupSpokenAlertsEnabled = TriggerHelper.TriggerOptions.GroupSpeechAlert;
    }

    if (TriggerHelper.UserSuppressedOutput) {
      TriggerHelper.TextAlertsEnabled = false;
      TriggerHelper.SoundAlertsEnabled = false;
      TriggerHelper.SpokenAlertsEnabled = false;
      TriggerHelper.GroupSpokenAlertsEnabled = false;
    }
    if (!this.options.audioAllowed) {
      TriggerHelper.SoundAlertsEnabled = false;
      TriggerHelper.SpokenAlertsEnabled = false;
      TriggerHelper.GroupSpokenAlertsEnabled = false;
    }
  }

  _OnTriggerInternal_PreRun(TriggerHelper) {
    if ('preRun' in TriggerHelper.Trigger)
      TriggerHelper.Trigger.preRun(this.data, matches);
  }

  _OnTriggerInternal_DelaySeconds(TriggerHelper) {
    let delay = 'delaySeconds' in TriggerHelper.Trigger ? TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.delaySeconds) : 0;
    let TriggerID = this.CurrentTriggerID++;
    this.timers[TriggerID] = true;
    return new Promise((res, rej) => {
      if (delay > 0) {
        window.setTimeout(() => {
          if (this.timers[TriggerID])
            res();
          else
            rej();
          delete this.timers[TriggerID];
        }, delay * 1000);
      } else {
        delete this.timers[TriggerID];
        res();
      }
    });
  }

  _OnTriggerInternal_DurationSeconds(TriggerHelper) {
    TriggerHelper.Duration = {
      FromTrigger: TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.durationSeconds),
      alarmText: this.options.DisplayAlarmTextForSeconds,
      alertText: this.options.DisplayAlertTextForSeconds,
      infoText: this.options.DisplayInfoTextForSeconds,
    };
  }

  _OnTriggerInternal_SuppressSeconds(TriggerHelper) {
    let suppress = 'suppressSeconds' in TriggerHelper.Trigger ? TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.suppressSeconds) : 0;
    if (TriggerHelper.Trigger.id && suppress > 0)
      this.triggerSuppress[TriggerHelper.Trigger.id] = TriggerHelper.Now + (suppress * 1000);
  }

  _OnTriggerInternal_Promise(TriggerHelper) {
    let promise = null;
    if ('promise' in TriggerHelper.Trigger) {
      if (typeof TriggerHelper.Trigger.promise === 'function') {
        promise = TriggerHelper.Trigger.promise(this.data, TriggerHelper.Matches);
        // Make sure we actually get a Promise back from the function
        if (Promise.resolve(promise) !== promise) {
          console.error('Trigger ' + TriggerHelper.Trigger.id + ': promise function did not return a promise');
          promise = null;
        }
      } else {
        console.error('Trigger ' + TriggerHelper.Trigger.id + ': promise defined but not a function');
      }
    }
    if (promise === null) {
      promise = new Promise((res) => {
        res();
      });
    }
    return promise;
  }

  _OnTriggerInternal_Sound(TriggerHelper) {
    TriggerHelper.SoundUrl = TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.sound);
  }

  _OnTriggerInternal_SoundVolume(TriggerHelper) {
    TriggerHelper.TriggerSoundVol =
      TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.soundVolume);
  }

  _OnTriggerInternal_Response(TriggerHelper) {
    let response = {};
    if (TriggerHelper.Trigger.response) {
      // Can't use ValueOrFunction here as r returns a non-localizable object.
      let r = TriggerHelper.Trigger.response;
      response = (typeof (r) == 'function') ? r(this.data, TriggerHelper.Matches) : r;

      // Turn falsy values into a default no-op response.
      if (!response)
        response = {};
    }
    TriggerHelper.Response = response;
  }

  _OnTriggerInternal_AlarmText(TriggerHelper) {
    this._AddTextFor('alarmText', TriggerHelper);
  }

  _OnTriggerInternal_AlertText(TriggerHelper) {
    this._AddTextFor('alertText', TriggerHelper);
  }

  _OnTriggerInternal_InfoText(TriggerHelper) {
    this._AddTextFor('infoText', TriggerHelper);
  }

  _OnTriggerInternal_GroupTTS(TriggerHelper) {
    if (TriggerHelper.GroupSpokenAlertsEnabled) {
      if ('GroupTTSText' in TriggerHelper.TriggerOptions)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.TriggerOptions.GroupTTSText);
      else if ('groupTTS' in TriggerHelper.Trigger)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.Trigger.groupTTS);
      else if ('groupTTS' in TriggerHelper.Response)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.Response.groupTTS);
    }
  }

  _OnTriggerInternal_TTS(TriggerHelper) {
    if (!TriggerHelper.GroupSpokenAlertsEnabled || typeof TriggerHelper.TTSText === 'undefined') {
      if ('TTSText' in TriggerHelper.TriggerOptions)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.TriggerOptions.TTSText);
      else if ('tts' in TriggerHelper.Trigger)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.Trigger.tts);
      else if ('tts' in TriggerHelper.Response)
        TriggerHelper.TTSText = ValueOrFunction(TriggerHelper.Response.TTSText);
      else
        TriggerHelper.TTSText = TriggerHelper.DefaultTTSText;
    }
  }

  _OnTriggerInternal_PlayAudio(TriggerHelper) {
    if (TriggerHelper.Trigger.sound && TriggerHelper.SoundUrl) {
      let namedSound = TriggerHelper.SoundUrl + 'Sound';
      let namedSoundVolume = TriggerHelper.SoundUrl + 'SoundVolume';
      if (namedSound in this.options) {
        TriggerHelper.SoundUrl = this.options[namedSound];
        if (namedSoundVolume in this.options)
          TriggerHelper.SoundVol = this.options[namedSoundVolume];
      }
    }

    TriggerHelper.SoundUrl = TriggerHelper.TriggerOptions.SoundOverride || TriggerHelper.SoundUrl;
    TriggerHelper.SoundVol = TriggerHelper.TriggerOptions.VolumeOverride ||
      TriggerHelper.TriggerSoundVol || TriggerHelper.SoundVol;

    // Text to speech overrides all other sounds.  This is so
    // that a user who prefers tts can still get the benefit
    // of infoText triggers without tts entries by turning
    // on (speech=true, text=true, sound=true) but this will
    // not cause tts to play over top of sounds or noises.
    if (TriggerHelper.TTSText && TriggerHelper.SpokenAlertsEnabled) {
      // Heuristics for auto tts.
      // * In case this is an integer.
      TriggerHelper.TTSText = TriggerHelper.TTSText.toString();
      // * Remove a bunch of chars.
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace(/[#!]/g, '');
      // * slashes between mechanics
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace('/', ' ');
      // * arrows helping visually simple to understand e.g. ↖ Front left / Back right ↘
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace(/[↖-↙]/g, '');
      // * Korean TTS reads wrong with '1번째'
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace('1번째', '첫번째');
      // * arrows at the front or the end are directions, e.g. "east =>"
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace(/[-=]>\s*$/g, '');
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace(/^\s*<[-=]/g, '');
      // * arrows in the middle are a sequence, e.g. "in => out => spread"
      let lang = this.options.AlertsLanguage || this.options.Language || 'en';
      let arrowReplacement = {
        en: ' then ',
        cn: '然后',
        de: ' dann ',
        fr: ' puis ',
        ja: 'や',
        ko: ' 그리고 ',
      };
      TriggerHelper.TTSText = TriggerHelper.TTSText.replace(/\s*(<[-=]|[=-]>)\s*/g, arrowReplacement[lang]);
      this.ttsSay(TriggerHelper.TTSText);
    } else if (TriggerHelper.SoundUrl && TriggerHelper.SoundAlertsEnabled) {
      this._PlayAudioFile(TriggerHelper.SoundUrl, TriggerHelper.SoundVol);
    }
  }

  _OnTriggerInternal_Run(TriggerHelper) {
    if ('run' in TriggerHelper.Trigger)
      TriggerHelper.Trigger.run(this.data, TriggerHelper.Matches);
  }

  _AddText(container, e) {
    container.appendChild(e);
    if (container.children.length > this.kMaxRowsOfText)
      container.removeChild(container.children[0]);
  }

  _AddTextFor(TextType, TriggerHelper) {
    let UpperTextType = TextType[0].toUpperCase() + TextType.slice(1);
    let textObj = TriggerHelper.TriggerOptions[UpperTextType] ||
      TriggerHelper.Trigger[TextType] || TriggerHelper.Response[TextType];
    if (textObj) {
      let text = TriggerHelper.ValueOrFunction(textObj);
      TriggerHelper.DefaultTTSText = TriggerHelper.DefaultTTSText || text;
      if (text && TriggerHelper.TextAlertsEnabled) {
        text = triggerUpperCase(text);
        let holder = this[TextType].getElementsByClassName('holder')[0];
        let div = this._MakeTextElement(text, TextType.split('T')[0] + '-text');
        this._AddText(holder, div);
        this._ScheduleRemoveText(holder, div,
            (TriggerHelper.Duration.FromTrigger || TriggerHelper.Duration[TextType]));

        if (!TriggerHelper.SoundUrl) {
          TriggerHelper.SoundUrl = this.options[UpperTextType.split('T')[0] + 'Sound'];
          TriggerHelper.SoundVol = this.options[UpperTextType.split('T')[0] + 'SoundVolume'];
        }
      }
    }
  }

  _MakeTextElement(text, className) {
    let div = document.createElement('div');
    div.classList.add(className);
    div.classList.add('animate-text');
    div.innerText = text;
    return div;
  }

  _ScheduleRemoveText(container, e, delay) {
    window.setTimeout(() => {
      for (let i = 0; i < container.children.length; ++i) {
        if (container.children[i] == e) {
          container.removeChild(e);
          break;
        }
      }
    }, delay * 1000);
  }

  _PlayAudioFile(URL, Volume) {
    let audio = new Audio(URL);
    audio.volume = Volume;
    audio.play();
  }

  Test(zone, log) {
    this.OnPlayerChange({ detail: { name: 'ME' } });
    this.OnZoneChange({ detail: { zoneName: zone } });
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
