"use strict";

class PopupText {
  constructor(options) {
    this.options = options;
    this.init = false;
    this.triggers = [];
    this.timers = [];

    this.kMaxRowsOfText = 2;
  }

  OnPlayerChange(e) {
    if (!this.init) {
      this.init = true;
      this.infoText = document.getElementById('popup-text-info');
      this.alertText = document.getElementById('popup-text-alert');
      this.alarmText = document.getElementById('popup-text-alarm');
    }

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
    if (!this.triggerSets) return;  // No data files were loaded.

    this.triggers = [];
    for (var i = 0; i < this.triggerSets.length; ++i) {
      var set = this.triggerSets[i];
      if (e.detail.zoneName.search(set.zoneRegex) >= 0)
        Array.prototype.push.apply(this.triggers, set.triggers);
    }
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

    // Jobs/names can't change in combat, so reset the data now.
    this.Reset();
  }

  OnInCombat(e) {
    // If we're in a boss fight and combat ends, ignore that.
    // Otherwise consider it a fight reset.
    if (!e.detail.inCombat && !this.inBossFight)
      this.Reset();
  }

  OnBossFightStart(e) {
    this.inBossFight = true;
  }

  OnBossFightEnd(e) {
    this.inBossFight = false;
    this.Reset();
  }

  Reset() {
    this.data = { me: this.me, job: this.job, role: this.role };
    for (var i = 0; i < this.timers.length; ++i)
      window.clearTimeout(this.timers[i]);
    this.timers = [];
  }

  OnLog(e) {
    if (!this.init)
      return;

    for (var i = 0; i < e.detail.logs.length; i++) {
      var log = e.detail.logs[i];

      for (var j = 0; j < this.triggers.length; ++j) {
        var trigger = this.triggers[j];
        var r = log.match(Regexes.Parse(trigger.regex));
        if (r != null)
          this.OnTrigger(trigger, r);
      }
    }
  }

  OnTrigger(trigger, matches) {
    if (!this.options.PopupTextEnabled)
      return;
    if ('disabled' in trigger && trigger.disabled)
      return;
    if ('condition' in trigger) {
      if (!trigger.condition(this.data, matches))
        return;
    }

    var that = this;
    var ValueOrFunction = function(f) {
      return (typeof(f) == "function") ? f(that.data, matches) : f;
    }

    var userDisabled = trigger.id && this.options.DisabledTriggers[trigger.id];
    var delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds) : 0;
    var duration = 'durationSeconds' in trigger ? ValueOrFunction(trigger.durationSeconds) : 3;

    var f = function() {
      var textSound = '';
      var textVol = 1;

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

      if ('infoText' in trigger) {
        var text = ValueOrFunction(trigger.infoText);
        if (text && !userDisabled) {
          var holder = that.infoText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'info-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!('sound' in trigger)) {
            textSound = that.options.InfoSound;
            textVol = that.options.InfoSoundVolume;
          }
        }
      }
      if ('alertText' in trigger) {
        var text = ValueOrFunction(trigger.alertText);
        if (text && !userDisabled) {
          var holder = that.alertText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'alert-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!('sound' in trigger)) {
            textSound = that.options.AlertSound;
            textVol = that.options.AlertSoundVolume;
          }
        }
      }
      if ('alarmText' in trigger) {
        var text = ValueOrFunction(trigger.alarmText);
        if (text && !userDisabled) {
          var holder = that.alarmText.getElementsByClassName('holder')[0];
          var div = makeTextElement(text, 'alarm-text');
          addText.bind(that)(holder, div);
          window.setTimeout(removeText.bind(that, holder, div), duration * 1000);

          if (!('sound' in trigger)) {
            textSound = that.options.AlarmSound;
            textVol = that.options.AlarmSoundVolume;
          }
        }
      }

      if (textSound) {
        var audio = new Audio(textSound);
        audio.volume = textVol;
        audio.play();
      }

      if (trigger.sound && !userDisabled) {
        var url = trigger.sound;
        var volume = 1;

        var namedSound = trigger.sound + 'Sound';
        var namedSoundVolume = trigger.sound + 'SoundVolume';
        if (namedSound in that.options) {
          url = that.options[namedSound];
          if (namedSoundVolume in that.options)
            volume = that.options[namedSoundVolume];
        }
        if ('soundVolume' in trigger)
          volume = trigger.soundVolume;

        var audio = new Audio(url);
        audio.volume = volume;
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
    });
  }

  Alert(text) {
    this.popupText.OnTrigger({
      alertText: text,
    });
  }

  Alarm(text) {
    this.popupText.OnTrigger({
      alarmText: text,
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
  gPopupText.OnInCombat(e);
});
document.addEventListener("onBossFightStart", function(e) {
  gPopupText.OnBossFightStart(e);
});
document.addEventListener("onBossFightEnd", function(e) {
  gPopupText.OnBossFightEnd(e);
});
document.addEventListener("onLogEvent", function(e) {
  gPopupText.OnLog(e);
});
document.addEventListener("onDataFilesRead", function(e) {
  gPopupText.OnDataFilesRead(e);
});
