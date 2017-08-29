"use strict";

class PopupText {
  constructor() {
    this.init = false;
    this.triggers = [];
  }

  OnPlayerChange(e) {
    if (!this.init) {
      this.init = true;
      this.infoText = document.getElementById('popup-text-info');
      this.alertText = document.getElementById('popup-text-alert');
      this.alarmText = document.getElementById('popup-text-alarm');

      this.namedSounds = {
        Info: '../../resources/sounds/BigWigs/Info.ogg',
        Alert: '../../resources/sounds/BigWigs/Alert.ogg',
        Alarm: '../../resources/sounds/BigWigs/Alarm.ogg',
        Long: '../../resources/sounds/BigWigs/Long.ogg',
      };
    }

    if (this.job != e.detail.job || this.me != e.detail.name)
      this.OnJobChange(e);
  }

  OnDataFilesRead(e) {
    this.triggerSets = [];
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
    else {
      this.role = '';
      console.log("Unknown job role")
    }

    // Jobs/names can't change in combat, so reset the data now.
    this.data = { me: this.me, job: this.job, role: this.role };
  }

  OnInCombat(e) {
    // If we're in a boss fight and combat ends, ignore that.
    // Otherwise consider it a fight reset.
    if (!e.detail.inCombat && !this.inBossFight)
      this.data = { me: this.me, job: this.job, role: this.role };
  }

  OnBossFightStart(e) {
    console.log("fight start !");
    this.inBossFight = true;
  }

  OnBossFightEnd(e) {
    console.log("fight end !");
    this.inBossFight = false;
    this.data = { me: this.me, job: this.job, role: this.role };
  }

  OnLog(e) {
    if (!this.init)
      return;
    for (var i = 0; i < e.detail.logs.length; i++) {
      var log = e.detail.logs[i];

      for (var j = 0; j < this.triggers.length; ++j) {
        var trigger = this.triggers[j];
        var r = log.match(trigger.regex);
        if (r != null)
          this.OnTrigger(trigger, r);
      }
    }
  }

  OnTrigger(trigger, matches) {
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

    var delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds) : 0;
    var duration = 'durationSeconds' in trigger ? ValueOrFunction(trigger.durationSeconds) : 3;

    var f = function() {
      var textSound = '';

      if ('infoText' in trigger) {
        var text = ValueOrFunction(trigger.infoText);
        if (text) {
          that.infoText.classList.remove('hide');
          that.infoText.style.animationName = 'zoom-in-out';
          that.infoText.style.animationDuration = '300ms';
          that.infoText.style.animationTimingFunction = 'linear';
          that.infoText.innerText = text;
          textSound = 'sound' in trigger ? '' : that.namedSounds.Info;

          window.clearTimeout(that.infoTextTimer);
          that.infoTextTimer = window.setTimeout(function() {
            that.infoText.classList.add('hide');
          }, duration * 1000);
        }
      }
      if ('alertText' in trigger) {
        var text = ValueOrFunction(trigger.alertText);
        if (text) {
          that.alertText.classList.remove('hide');
          that.alertText.style.animationName = 'zoom-in-out';
          that.alertText.style.animationDuration = '300ms';
          that.alertText.style.animationTimingFunction = 'linear';
          that.alertText.innerText = text;
          textSound = 'sound' in trigger ? '' : that.namedSounds.Alert;

          window.clearTimeout(that.alertTextTimer);
          that.alertTextTimer = window.setTimeout(function() {
            that.alertText.classList.add('hide');
          }, duration * 1000);
        }
      }
      if ('alarmText' in trigger) {
        var text = ValueOrFunction(trigger.alarmText);
        if (text) {
          that.alarmText.classList.remove('hide');
          that.alarmText.style.animationName = 'zoom-in-out';
          that.alarmText.style.animationDuration = '300ms';
          that.infoText.style.animationTimingFunction = 'linear';
          that.alarmText.innerText = text;
          textSound = 'sound' in trigger ? '' : that.namedSounds.Alarm;

          window.clearTimeout(that.alarmTextTimer);
          that.alarmTextTimer = window.setTimeout(function() {
            that.alarmText.classList.add('hide');
          }, duration * 1000);
        }
      }

      if (textSound)
        new Audio(textSound).play();

      if ('sound' in trigger && trigger.sound) {
        var url = trigger.sound in this.namedSounds ? this.namedSounds[trigger.sound] : trigger.sound;
        var audio = new Audio(url);
        if ('soundVolume' in trigger)
          audio.volume = trigger.soundVolume;
        audio.play();
      }

      if ('run' in trigger)
        trigger.run(that.data, matches);
    };
    if (!delay)
      f();
    else
      window.setTimeout(f, delay * 1000);
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

var gPopupText = new PopupText();

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

// Testing...
//window.onload = function() {
  //window.setTimeout(function() { gPopupText.Test('Unknown Zone (2Ba)', ':Exdeath uses The Decisive Battle.') }, 0);
  //window.setTimeout(function() { gPopupText.Test('Unknown Zone (2Ba)', ':Exdeath begins casting Fire III.') }, 0);
  //window.setTimeout(function() { gPopupText.Test('Unknown Zone (2Ba)', ':test:trigger:') }, 1000);
//};
