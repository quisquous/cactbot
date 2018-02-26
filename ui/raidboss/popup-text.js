"use strict";

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
  }

  SetTimelineLoader(timelineLoader) {
    this.timelineLoader = timelineLoader;
  }

  OnPlayerChange(e) {
    if (this.job != e.detail.job || this.me != e.detail.name)
      this.OnJobChange(e);
  }

  OnDataFilesRead(e) {
    this.triggerSets = Options.Triggers;
    for (var filename in e.detail.files) {
      // Reads from the data/triggers/ directory.
      if (!filename.startsWith('triggers/'))
        continue;

      var text = e.detail.files[filename];
      var json;
      try {
        json = eval(text);
      } catch (exception) {
        console.log('Error parsing JSON from ' + filename + ': ' + exception);
        continue;
      }
      if (typeof json != "object" || !(json.length >= 0)) {
        console.log('Unexpected JSON from ' + filename + ', expected an array');
        continue;
      }
      for (var i = 0; i < json.length; ++i) {
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
    var timelineFiles = [];
    var timelines = [];
    var replacements = [];
    this.resetWhenOutOfCombat = true;

    // Recursively/iteratively process timeline entries for triggers.
    // Functions get called with data, arrays get iterated, strings get appended.
    var addTimeline = (function(obj) {
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; ++i)
          addTimeline(obj[i]);
      } else if (typeof(obj) == 'function') {
        addTimeline(obj(this.data));
      } else if (obj) {
        timelines.push(obj);
      }
    }).bind(this);

    var locale = this.options.Language || 'en';
    // construct something like regexEn or regexFr.
    var regexLocale = 'regex' + locale.charAt(0).toUpperCase() + locale.slice(1);

    for (var i = 0; i < this.triggerSets.length; ++i) {
      var set = this.triggerSets[i];
      if (this.zoneName.search(set.zoneRegex) >= 0) {
        // Adjust triggers for the locale.
        for (var j = 0; j < set.triggers.length; ++j) {
          // Add an additional resolved regex here to save
          // time later.  This will clobber each time we
          // load this, but that's ok.
          var trigger = set.triggers[j];
          // Locale-based regex takes precedence.
          var regex = trigger[regexLocale] ? trigger[regexLocale] : trigger.regex;
          trigger.localRegex = Regexes.Parse(regex);
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
        if (set.resetWhenOutOfCombat !== undefined)
          this.resetWhenOutOfCombat &= set.resetWhenOutOfCombat;
      }
    }

    this.timelineLoader.SetTimelines(timelineFiles, timelines, replacements);
  }

  OnJobChange(e) {
    this.me = e.detail.name;
    this.job = e.detail.job;
    if (this.job.search(/^(WAR|DRK|PLD|MRD|GLD)$/) >= 0)
      this.role = 'tank';
    else if (this.job.search(/^(WHM|SCH|AST|CNJ)$/) >= 0)
      this.role = 'healer';
    else if (this.job.search(/^(MNK|NIN|DRG|SAM|ROG|LNC|PUG)$/) >= 0)
      this.role = 'dps-melee';
    else if (this.job.search(/^(BLM|SMN|RDM|THM|ACN)$/) >= 0)
      this.role = 'dps-caster';
    else if (this.job.search(/^(BRD|MCH|ARC)$/) >= 0)
      this.role = 'dps-ranged';
    else if (this.job.search(/^(CRP|BSM|ARM|GSM|LTW|WVR|ALC|CUL)$/) >= 0)
      this.role = 'crafting';
    else if (this.job.search(/^(MIN|BOT|FSH)$/) >= 0)
      this.role = 'gathering';
    else {
      this.role = '';
      console.log("Unknown job role")
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

    if (name in Options.PlayerNicks) {
      return Options.PlayerNicks[name];
    }
    var idx = name.indexOf(' ');
    return idx < 0 ? name : name.substr(0, idx);
  }

  Reset() {
    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      ShortName: this.ShortNamify,
      StopCombat: (function() { this.SetInCombat(false); }).bind(this),
      ParseLocaleFloat: function(s) { return Regexes.ParseLocaleFloat(s); },
    };
    this.StopTimers();
    this.triggerSuppress = {};
  }

  StopTimers() {
    for (var i = 0; i < this.timers.length; ++i)
      window.clearTimeout(this.timers[i]);
    this.timers = [];
  }

  OnLog(e) {
    for (var i = 0; i < e.detail.logs.length; i++) {
      var log = e.detail.logs[i];

      for (var j = 0; j < this.triggers.length; ++j) {
        var trigger = this.triggers[j];
        var r = log.match(trigger.localRegex);
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

    var now = +new Date();
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > now) {
        return;
      }
      delete this.triggerSuppress[trigger.id];
    }

    var triggerOptions = trigger.id && this.options.PerTriggerOptions[trigger.id] || {};

    var condition = triggerOptions.Condition || trigger.condition;
    if (condition) {
      if (!condition(this.data, matches))
        return;
    }

    if ('preRun' in trigger)
      trigger.preRun(this.data, matches);

    var that = this;

    var ValueOrFunction = (function(f) {
      var result = (typeof(f) == "function") ? f(this.data, matches) : f;
      // All triggers return either a string directly, or an object
      // whose keys are different locale names.  For simplicity, this is
      // valid to do for any trigger entry that can handle a function.
      // In case anybody wants to encapsulate any fancy grammar, the values
      // in this object can also be functions.
      if (result !== Object(result))
        return result;
      var lang = this.options.Language || 'en';
      if (result[lang])
        return ValueOrFunction(result[lang]);
      // For partially localized results where this localization doesn't
      // exist, prefer English over nothing.
      return ValueOrFunction(result['en']);
    }).bind(this);

    var showText = this.options.TextAlertsEnabled;
    var playSounds = this.options.SoundAlertsEnabled;
    var playSpeech = this.options.SpokenAlertsEnabled;
    var userDisabled = trigger.id && this.options.DisabledTriggers[trigger.id];
    var delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds) : 0;
    var duration = 'durationSeconds' in trigger ? ValueOrFunction(trigger.durationSeconds) : 3;
    var suppress = 'suppressSeconds' in trigger ? ValueOrFunction(trigger.suppressSeconds) : 0;
    if (trigger.id && suppress > 0) {
      this.triggerSuppress[trigger.id] = now + suppress * 1000;
    }

    if (triggerOptions) {
      if ('SpeechAlert' in triggerOptions)
        playSpeech = triggerOptions.SpeechAlert;
      if ('SoundAlert' in triggerOptions)
        playSounds = triggerOptions.SoundAlert;
      if ('TextAlert' in triggerOptions)
        showText = triggerOptions.TextAlert;
    }

    var f = function() {
      var soundUrl = '';
      var soundVol = 1;
      var ttsText = '';

      var addText = function(container, e) {
        container.appendChild(e);
        if (container.children.length > this.kMaxRowsOfText)
          container.removeChild(container.children[0]);
      }
      var removeText = function(container, e) {
        for (var i = 0; i < container.children.length; ++i) {
          if (container.children[i] == e) {
            container.removeChild(e);
            break;
          }
        }
      }
      var makeTextElement = function(text, className) {
        var div = document.createElement('div');
        div.classList.add(className);
        div.classList.add('animate-text');
        div.innerText = text;
        return div;
      }

      // If sound is specified it overrides alarm/alert/info sounds.
      // Otherwise, if multiple alarm/alert/info are specified
      // it will pick one sound in the order of alarm > alert > info.
      var soundUrl = ValueOrFunction(trigger.sound);

      var alarmText = triggerOptions.AlarmText || trigger.alarmText;
      if (alarmText) {
        var text = ValueOrFunction(alarmText);
        if (text && !userDisabled && showText) {
          var holder = that.alarmText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'alarm-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.AlarmSound;
            soundVol = that.options.AlarmSoundVolume;
          }
        }
      }
      var alertText = triggerOptions.AlertText || trigger.alertText;
      if (alertText) {
        var text = ValueOrFunction(alertText);
        if (text && !userDisabled && showText) {
          var holder = that.alertText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'alert-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.AlertSound;
            soundVol = that.options.AlertSoundVolume;
          }
        }
      }
      var infoText = triggerOptions.InfoText || trigger.infoText;
      if (infoText) {
        var text = ValueOrFunction(infoText);
        if (text && !userDisabled && showText) {
          var holder = that.infoText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'info-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!soundUrl) {
            soundUrl = that.options.InfoSound;
            soundVol = that.options.InfoSoundVolume;
          }
        }
      }

      var tts = triggerOptions.TTSText || trigger.tts;
      if (tts && playSpeech) {
        var text = ValueOrFunction(tts);
        if (text && !userDisabled)
          ttsText = text;
      }

      if (trigger.sound && soundUrl) {
        var namedSound = soundUrl + 'Sound';
        var namedSoundVolume = soundUrl + 'SoundVolume';
        if (namedSound in that.options) {
          soundUrl = that.options[namedSound];
          if (namedSoundVolume in that.options)
            soundVol = that.options[namedSoundVolume];
        }
        if ('soundVolume' in trigger)
          soundVol = ValueOrFunction(trigger.soundVolume);
      }

      soundUrl = triggerOptions.SoundOverride || soundUrl;
      soundVol = triggerOptions.VolumeOverride || soundVol;

      // Text to speech overrides all other sounds.  This is so
      // that a user who prefers tts can still get the benefit
      // of infoText triggers without tts entries by turning
      // on (speech=true, text=true, sound=true) but this will
      // not cause tts to play over top of sounds or noises.
      if (soundUrl && playSounds && !userDisabled && !ttsText) {
        var audio = new Audio(soundUrl);
        audio.volume = soundVol;
        audio.play();
      }

      if (ttsText && !userDisabled) {
        var cmd = { 'say': ttsText };
        OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify(cmd));
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
    this.OnPlayerChange({ detail: { name : 'ME' } });
    this.OnZoneChange({ detail: { zoneName: zone } });
    this.OnLog({ detail: { logs : ['abcdefgh', log, 'hgfedcba']}});
  }
};

class PopupTextGenerator {
  constructor(popupText) { this.popupText = popupText; }

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
}

var gPopupText;

document.addEventListener("onPlayerChangedEvent", function(e) {
  gPopupText.OnPlayerChange(e);
});
document.addEventListener("onZoneChangedEvent", function(e) {
  gPopupText.OnZoneChange(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  gPopupText.OnInCombatChange(e.detail.inGameCombat);
});
document.addEventListener("onLogEvent", function(e) {
  gPopupText.OnLog(e);
});
document.addEventListener("onDataFilesRead", function(e) {
  gPopupText.OnDataFilesRead(e);
});
