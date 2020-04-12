'use strict';

// Because apparently people don't understand uppercase greek letters,
// only uppercase alphabetic letters.
function triggerUpperCase(str) {
  if (!str)
    return str;
  return str.replace(/\w/g, (x) => x.toUpperCase());
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
    this.timers = [];
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
      } else if (typeof(obj) == 'function') {
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
        if (set.triggers) {
          for (let j = 0; j < set.triggers.length; ++j) {
            // Add an additional resolved regex here to save
            // time later.  This will clobber each time we
            // load this, but that's ok.
            let trigger = set.triggers[j];
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
        }
        // Save the triggers from each set that matches.
        Array.prototype.push.apply(this.triggers, set.triggers);
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
          Array.prototype.push.apply(replacements, set.timelineReplace);
        if (set.timelineTriggers)
          Array.prototype.push.apply(timelineTriggers, set.timelineTriggers);
        if (set.timelineStyles)
          Array.prototype.push.apply(timelineStyles, set.timelineStyles);
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
    for (let i = 0; i < this.timers.length; ++i)
      window.clearTimeout(this.timers[i]);
    this.timers = [];
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
    if (!this.options.AlertsEnabled)
      return;
    if ('disabled' in trigger && trigger.disabled)
      return;

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if ((matches != undefined) && (matches.groups != undefined))
      matches = matches.groups;

    let now = +new Date();
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > now)
        return;

      delete this.triggerSuppress[trigger.id];
    }

    let triggerOptions = trigger.id && this.options.PerTriggerOptions[trigger.id] || {};
    let triggerAutoConfig = trigger.id && this.options.PerTriggerAutoConfig[trigger.id] || {};

    let condition = triggerOptions.Condition || trigger.condition;
    if (condition) {
      if (!condition(this.data, matches))
        return;
    }

    if ('preRun' in trigger)
      trigger.preRun(this.data, matches);

    let ValueOrFunction = (f) => {
      let result = (typeof(f) == 'function') ? f(this.data, matches) : f;
      // All triggers return either a string directly, or an object
      // whose keys are different locale names.  For simplicity, this is
      // valid to do for any trigger entry that can handle a function.
      // In case anybody wants to encapsulate any fancy grammar, the values
      // in this object can also be functions.
      if (result !== Object(result))
        return result;
      let lang = this.options.AlertsLanguage || this.options.Language || 'en';
      if (result[lang])
        return ValueOrFunction(result[lang]);
      // For partially localized results where this localization doesn't
      // exist, prefer English over nothing.
      return ValueOrFunction(result['en']);
    };

    let showText = this.options.TextAlertsEnabled;
    let playSounds = this.options.SoundAlertsEnabled;
    let playSpeech = this.options.SpokenAlertsEnabled;
    let playGroupSpeech = this.options.GroupSpokenAlertsEnabled;

    let userDisabled = trigger.id && this.options.DisabledTriggers[trigger.id];
    let delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds) : 0;
    let duration = {
      fromTrigger: ValueOrFunction(trigger.durationSeconds),
      alarmText: this.options.DisplayAlarmTextForSeconds,
      alertText: this.options.DisplayAlertTextForSeconds,
      infoText: this.options.DisplayInfoTextForSeconds,
    };
    let suppress = 'suppressSeconds' in trigger ? ValueOrFunction(trigger.suppressSeconds) : 0;
    if (trigger.id && suppress > 0)
      this.triggerSuppress[trigger.id] = now + suppress * 1000;

    // FIXME: this is quite gross that PerTriggerOptions does not use the same fields as
    // options.  Ideally we should smush everything down into a single trigger object.
    // Auto config here has a separate property mostly as a convenience to users who
    // most likely will redefine it, clobbering settings from the config tool.
    // Ideally, these would be the same.
    if (triggerAutoConfig) {
      if ('SpokenAlertsEnabled' in triggerAutoConfig)
        playSpeech = triggerAutoConfig.SpokenAlertsEnabled;
      if ('SoundAlertsEnabled' in triggerAutoConfig)
        playSounds = triggerAutoConfig.SoundAlertsEnabled;
      if ('TextAlertsEnabled' in triggerAutoConfig)
        showText = triggerAutoConfig.TextAlertsEnabled;
    }

    if (triggerOptions) {
      if ('GroupSpeechAlert' in triggerOptions)
        playGroupSpeech = triggerOptions.GroupSpeechAlert;
      if ('SpeechAlert' in triggerOptions)
        playSpeech = triggerOptions.SpeechAlert;
      if ('SoundAlert' in triggerOptions)
        playSounds = triggerOptions.SoundAlert;
      if ('TextAlert' in triggerOptions)
        showText = triggerOptions.TextAlert;
    }

    if (userDisabled) {
      playSpeech = false;
      playGroupSpeech = false;
      playSounds = false;
      showText = false;
    }
    if (!this.options.audioAllowed) {
      playSpeech = false;
      playGroupSpeech = false;
      playSounds = false;
    }

    let f = () => {
      let addText = (container, e) => {
        container.appendChild(e);
        if (container.children.length > this.kMaxRowsOfText)
          container.removeChild(container.children[0]);
      };
      let removeText = (container, e) => {
        for (let i = 0; i < container.children.length; ++i) {
          if (container.children[i] == e) {
            container.removeChild(e);
            break;
          }
        }
      };

      let makeTextElement = function(text, className) {
        let div = document.createElement('div');
        div.classList.add(className);
        div.classList.add('animate-text');
        div.innerText = text;
        return div;
      };

      // If sound is specified it overrides alarm/alert/info sounds.
      // Otherwise, if multiple alarm/alert/info are specified
      // it will pick one sound in the order of alarm > alert > info.
      let soundUrl = ValueOrFunction(trigger.sound);
      let triggerSoundVol = ValueOrFunction(trigger.soundVolume);
      let soundVol = 1;

      let defaultTTSText;

      let response = {};
      if (trigger.response) {
        // Can't use ValueOrFunction here as r returns a non-localizable object.
        let r = trigger.response;
        response = (typeof(r) == 'function') ? r(this.data, matches) : r;

        // Turn falsy values into a default no-op response.
        if (!response)
          response = {};
      }

      let alarmText = triggerOptions.AlarmText || trigger.alarmText || response.alarmText;
      if (alarmText) {
        let text = ValueOrFunction(alarmText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          text = triggerUpperCase(text);
          let holder = this.alarmText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'alarm-text');
          addText.bind(this)(holder, div);
          window.setTimeout(
              removeText.bind(this, holder, div),
              (duration.fromTrigger || duration.alarmText) * 1000,
          );

          if (!soundUrl) {
            soundUrl = this.options.AlarmSound;
            soundVol = this.options.AlarmSoundVolume;
          }
        }
      }

      let alertText = triggerOptions.AlertText || trigger.alertText || response.alertText;
      if (alertText) {
        let text = ValueOrFunction(alertText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          text = triggerUpperCase(text);
          let holder = this.alertText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'alert-text');
          addText.bind(this)(holder, div);
          window.setTimeout(
              removeText.bind(this, holder, div),
              (duration.fromTrigger || duration.alertText) * 1000,
          );

          if (!soundUrl) {
            soundUrl = this.options.AlertSound;
            soundVol = this.options.AlertSoundVolume;
          }
        }
      }

      let infoText = triggerOptions.InfoText || trigger.infoText || response.infoText;
      if (infoText) {
        let text = ValueOrFunction(infoText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          let holder = this.infoText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'info-text');
          addText.bind(this)(holder, div);
          window.setTimeout(
              removeText.bind(this, holder, div),
              (duration.fromTrigger || duration.infoText) * 1000,
          );

          if (!soundUrl) {
            soundUrl = this.options.InfoSound;
            soundVol = this.options.InfoSoundVolume;
          }
        }
      }

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
      let ttsText;


      if (playGroupSpeech) {
        if ('GroupTTSText' in triggerOptions)
          ttsText = ValueOrFunction(triggerOptions.GroupTTSText);
        else if ('groupTTS' in trigger)
          ttsText = ValueOrFunction(trigger.groupTTS);
        else if ('groupTTS' in response)
          ttsText = ValueOrFunction(response.groupTTS);
      }

      if (!playGroupSpeech || typeof ttsText === 'undefined') {
        if ('TTSText' in triggerOptions)
          ttsText = ValueOrFunction(triggerOptions.TTSText);
        else if ('tts' in trigger)
          ttsText = ValueOrFunction(trigger.tts);
        else if ('tts' in response)
          ttsText = ValueOrFunction(response.TTSText);
        else
          ttsText = defaultTTSText;
      }
      if (trigger.sound && soundUrl) {
        let namedSound = soundUrl + 'Sound';
        let namedSoundVolume = soundUrl + 'SoundVolume';
        if (namedSound in this.options) {
          soundUrl = this.options[namedSound];
          if (namedSoundVolume in this.options)
            soundVol = this.options[namedSoundVolume];
        }
      }

      soundUrl = triggerOptions.SoundOverride || soundUrl;
      soundVol = triggerOptions.VolumeOverride || triggerSoundVol || soundVol;

      // Text to speech overrides all other sounds.  This is so
      // that a user who prefers tts can still get the benefit
      // of infoText triggers without tts entries by turning
      // on (speech=true, text=true, sound=true) but this will
      // not cause tts to play over top of sounds or noises.
      if (ttsText && playSpeech) {
        // Heuristics for auto tts.
        // * In case this is an integer.
        ttsText = ttsText.toString();
        // * Remove a bunch of chars.
        ttsText = ttsText.replace(/[#!]/g, '');
        // * slashes between mechanics
        ttsText = ttsText.replace('/', ' ');
        // * arrows helping visually simple to understand e.g. ↖ Front left / Back right ↘
        ttsText = ttsText.replace(/[↖-↙]/g, '');
        // * Korean TTS reads wrong with '1번째'
        ttsText = ttsText.replace('1번째', '첫번째');
        // * arrows at the front or the end are directions, e.g. "east =>"
        ttsText = ttsText.replace(/[-=]>\s*$/g, '');
        ttsText = ttsText.replace(/^\s*<[-=]/g, '');
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
        ttsText = ttsText.replace(/\s*(<[-=]|[=-]>)\s*/g, arrowReplacement[lang]);
        this.ttsSay(ttsText);
      } else if (soundUrl && playSounds) {
        let audio = new Audio(soundUrl);
        audio.volume = soundVol;
        audio.play();
      }

      if ('run' in trigger)
        trigger.run(this.data, matches);
    };

    let promiseThenTrigger = () => {
      // Put the resolution of the `promise` field inside this function so that
      // It occurs after delaySeconds.
      let promise = null;
      if ('promise' in trigger) {
        if (typeof trigger.promise === 'function') {
          promise = trigger.promise(this.data, matches);
          // Make sure we actually get a Promise back from the function
          if (Promise.resolve(promise) !== promise) {
            console.error('Trigger ' + trigger.id + ': promise function did not return a promise');
            promise = null;
          }
        } else {
          console.error('Trigger ' + trigger.id + ': promise defined but not a function');
        }
      }

      let runTriggerBody = () => {
        try {
          f();
        } catch (e) {
          onTriggerException(trigger, e);
        }
      };

      // Only if there is a promise, run the trigger asynchronously.
      // Otherwise, run it immediately.  Otherwise, multiple triggers
      // might run their condition/preRun prior to all of the alerts.
      if (promise)
        promise.then(runTriggerBody);
      else
        runTriggerBody();
    };

    // Run immediately?
    if (!delay) {
      promiseThenTrigger();
      return;
    }

    this.timers.push(window.setTimeout(promiseThenTrigger,
        delay * 1000));
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
