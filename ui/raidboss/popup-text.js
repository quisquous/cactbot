'use strict';

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

    this.kMaxRowsOfText = 2;

    this.Reset();
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
      // Reads from the data/triggers/ directory.
      if (!filename.startsWith('triggers/'))
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
      }
      Array.prototype.push.apply(this.triggerSets, json);
    }
  }

  OnZoneChange(e) {
    this.zoneName = e.detail.zoneName;
    this.ReloadTimelines();
  }

  ReloadTimelines() {
    // Datafiles, job, and zone must be loaded.
    if (!this.triggerSets || !this.me || !this.zoneName)
      return;

    this.Reset();

    // Drop the triggers and timelines from the previous zone, so we can add new ones.
    this.triggers = [];
    let timelineFiles = [];
    let timelines = [];
    let replacements = [];
    let timelineTriggers = [];
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
      if (this.zoneName.search(set.zoneRegex) >= 0) {
        // Adjust triggers for the locale.
        if (set.triggers) {
          for (let j = 0; j < set.triggers.length; ++j) {
            // Add an additional resolved regex here to save
            // time later.  This will clobber each time we
            // load this, but that's ok.
            let trigger = set.triggers[j];

            if (!trigger.regex)
              console.error('Trigger ' + trigger.id + ': has no regex property specified');

            // Locale-based regex takes precedence.
            let regex = trigger[regexLocale] ? trigger[regexLocale] : trigger.regex;
            if (!regex) {
              console.error('Trigger ' + trigger.id + ': undefined ' + regexLocale);
              continue;
            }
            trigger.localRegex = Regexes.Parse(regex);
          }
        }
        // Save the triggers from each set that matches.
        Array.prototype.push.apply(this.triggers, set.triggers);
        // And set the timeline files/timelines from each set that matches.
        if (set.timelineFile)
          timelineFiles.push(set.timelineFile);
        if (set.timeline)
          addTimeline(set.timeline);
        if (set.timelineReplace)
          Array.prototype.push.apply(replacements, set.timelineReplace);
        if (set.timelineTriggers)
          Array.prototype.push.apply(timelineTriggers, set.timelineTriggers);
        if (set.resetWhenOutOfCombat !== undefined)
          this.resetWhenOutOfCombat &= set.resetWhenOutOfCombat;
      }
    }

    this.timelineLoader.SetTimelines(timelineFiles, timelines, replacements, timelineTriggers);
  }

  OnJobChange(e) {
    this.me = e.detail.name;
    this.job = e.detail.job;
    if (this.job.search(/^(WAR|DRK|PLD|MRD|GLD)$/) >= 0) {
      this.role = 'tank';
    } else if (this.job.search(/^(WHM|SCH|AST|CNJ)$/) >= 0) {
      this.role = 'healer';
    } else if (this.job.search(/^(MNK|NIN|DRG|SAM|ROG|LNC|PUG)$/) >= 0) {
      this.role = 'dps-melee';
    } else if (this.job.search(/^(BLM|SMN|RDM|THM|ACN)$/) >= 0) {
      this.role = 'dps-caster';
    } else if (this.job.search(/^(BRD|MCH|ARC)$/) >= 0) {
      this.role = 'dps-ranged';
    } else if (this.job.search(/^(CRP|BSM|ARM|GSM|LTW|WVR|ALC|CUL)$/) >= 0) {
      this.role = 'crafting';
    } else if (this.job.search(/^(MIN|BOT|FSH)$/) >= 0) {
      this.role = 'gathering';
    } else {
      this.role = '';
      console.log('Unknown job role');
    }

    this.ReloadTimelines();
  }

  OnInCombatChange(inCombat) {
    if (inCombat || this.resetWhenOutOfCombat)
      this.SetInCombat(inCombat);
  }

  SetInCombat(inCombat) {
    // Stop timers when stopping combat to stop any active timers that
    // are delayed.  However, also reset when starting combat.
    // This prevents late attacks from affecting |data| which
    // throws off the next run, potentially.
    if (!inCombat)
      this.timelineLoader.StopCombat();

    if (this.inCombat == inCombat)
      return;
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

    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      lang: locale,
      currentHP: preserveHP,
      ShortName: this.ShortNamify,
      StopCombat: () => this.SetInCombat(false),
      ParseLocaleFloat: parseFloat,
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
    if (!this.options.AlertsEnabled)
      return;
    if ('disabled' in trigger && trigger.disabled)
      return;

    let now = +new Date();
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > now)
        return;

      delete this.triggerSuppress[trigger.id];
    }

    let triggerOptions = trigger.id && this.options.PerTriggerOptions[trigger.id] || {};

    let condition = triggerOptions.Condition || trigger.condition;
    if (condition) {
      if (!condition(this.data, matches))
        return;
    }

    if ('preRun' in trigger)
      trigger.preRun(this.data, matches);

    let that = this;

    let ValueOrFunction = (function(f) {
      let result = (typeof(f) == 'function') ? f(this.data, matches) : f;
      // All triggers return either a string directly, or an object
      // whose keys are different locale names.  For simplicity, this is
      // valid to do for any trigger entry that can handle a function.
      // In case anybody wants to encapsulate any fancy grammar, the values
      // in this object can also be functions.
      if (result !== Object(result))
        return result;
      let lang = this.options.Language || 'en';
      if (result[lang])
        return ValueOrFunction(result[lang]);
      // For partially localized results where this localization doesn't
      // exist, prefer English over nothing.
      return ValueOrFunction(result['en']);
    }).bind(this);

    let showText = this.options.TextAlertsEnabled;
    let playSounds = this.options.SoundAlertsEnabled;
    let playSpeech = this.options.SpokenAlertsEnabled;
    let userDisabled = trigger.id && this.options.DisabledTriggers[trigger.id];
    let delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds) : 0;
    let duration = 'durationSeconds' in trigger ? ValueOrFunction(trigger.durationSeconds) : 3;
    let suppress = 'suppressSeconds' in trigger ? ValueOrFunction(trigger.suppressSeconds) : 0;
    if (trigger.id && suppress > 0)
      this.triggerSuppress[trigger.id] = now + suppress * 1000;


    if (triggerOptions) {
      if ('SpeechAlert' in triggerOptions)
        playSpeech = triggerOptions.SpeechAlert;
      if ('SoundAlert' in triggerOptions)
        playSounds = triggerOptions.SoundAlert;
      if ('TextAlert' in triggerOptions)
        showText = triggerOptions.TextAlert;
    }

    if (userDisabled) {
      playSpeech = false;
      playSounds = false;
      showText = false;
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
      let soundVol = 1;

      let defaultTTSText;

      let alarmText = triggerOptions.AlarmText || trigger.alarmText;
      if (alarmText) {
        let text = ValueOrFunction(alarmText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          let holder = that.alarmText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'alarm-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.AlarmSound;
            soundVol = that.options.AlarmSoundVolume;
          }
        }
      }
      let alertText = triggerOptions.AlertText || trigger.alertText;
      if (alertText) {
        let text = ValueOrFunction(alertText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          let holder = that.alertText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'alert-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.AlertSound;
            soundVol = that.options.AlertSoundVolume;
          }
        }
      }
      let infoText = triggerOptions.InfoText || trigger.infoText;
      if (infoText) {
        let text = ValueOrFunction(infoText);
        defaultTTSText = defaultTTSText || text;
        if (text && showText) {
          let holder = that.infoText.getElementsByClassName('holder')[0];
          let div = makeTextElement(text, 'info-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.InfoSound;
            soundVol = that.options.InfoSoundVolume;
          }
        }
      }

      // Priority audio order:
      // * user disabled (play nothing)
      // * if tts options are enabled globally or for this trigger:
      //   * user trigger tts override
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
      if ('TTSText' in triggerOptions)
        ttsText = ValueOrFunction(triggerOptions.TTSText);
      else if ('tts' in trigger)
        ttsText = ValueOrFunction(trigger.tts);
      else
        ttsText = defaultTTSText;

      if (trigger.sound && soundUrl) {
        let namedSound = soundUrl + 'Sound';
        let namedSoundVolume = soundUrl + 'SoundVolume';
        if (namedSound in that.options) {
          soundUrl = that.options[namedSound];
          if (namedSoundVolume in that.options)
            soundVol = that.options[namedSoundVolume];
        }
      }

      if ('soundVolume' in trigger)
        soundVol = ValueOrFunction(trigger.soundVolume);

      soundUrl = triggerOptions.SoundOverride || soundUrl;
      soundVol = triggerOptions.VolumeOverride || soundVol;

      // Text to speech overrides all other sounds.  This is so
      // that a user who prefers tts can still get the benefit
      // of infoText triggers without tts entries by turning
      // on (speech=true, text=true, sound=true) but this will
      // not cause tts to play over top of sounds or noises.
      if (ttsText && playSpeech) {
        ttsText = ttsText.replace(/[#!]/, '');
        let cmd = { 'say': ttsText };
        OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify(cmd));
      } else if (soundUrl && playSounds) {
        let audio = new Audio(soundUrl);
        audio.volume = soundVol;
        audio.play();
      }

      if ('run' in trigger)
        trigger.run(that.data, matches);
    };
    if (!delay)
      f();
    else
      this.timers.push(window.setTimeout(f, delay * 1000));
  }

  Test(zone, log) {
    this.OnPlayerChange({ detail: { name: 'ME' } });
    this.OnZoneChange({ detail: { zoneName: zone } });
    this.OnLog({ detail: { logs: ['abcdefgh', log, 'hgfedcba'] } });
  }
};

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

document.addEventListener('onPlayerChangedEvent', function(e) {
  gPopupText.OnPlayerChange(e);
});
document.addEventListener('onZoneChangedEvent', function(e) {
  gPopupText.OnZoneChange(e);
});
document.addEventListener('onInCombatChangedEvent', function(e) {
  gPopupText.OnInCombatChange(e.detail.inGameCombat);
});
document.addEventListener('onLogEvent', function(e) {
  gPopupText.OnLog(e);
});
document.addEventListener('onDataFilesRead', function(e) {
  gPopupText.OnDataFilesRead(e);
});
