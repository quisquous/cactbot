"use strict";

// Layout.
var kAurasIconPosX = 150;
var kAurasIconPosY = 0;
var kAurasIconSizeW = 40;
var kAurasIconSizeH = 40;
var kAurasIconBorderWidth = 1;
var kAurasIconTextW = 100;

class Auras {
  constructor() {
    this.init = false;
    this.inBossFight = false;
    this.icon = null;
    this.iconText = null;
    this.infoText = null;
    this.alertText = null;
    this.alarmText = null;
    this.data = {};
    this.triggers = [];
  }

  OnPlayerChange(e) {
    if (this.init)
      return;
    this.init = true;
    this.me = e.detail.name;

    this.icon = document.getElementById('auras-icon');
    this.iconText = document.getElementById('auras-text-bottom');
    this.infoText = document.getElementById('auras-text-info');
    this.alertText = document.getElementById('auras-text-alert');
    this.alarmText = document.getElementById('auras-text-alarm');
  }

  OnZoneChange(e) {
    this.triggers = [];
    for (var zone in kAurasTriggers) {
      if (e.detail.zoneName.search(zone) >= 0)
        this.triggers = this.triggers.concat(kAurasTriggers[zone]);
    }
  }

  OnInCombat(e) {
    // If we're in a boss fight and combat ends, ignore that.
    // Otherwise consider it a fight reset.
    if (!e.detail.inCombat && !this.inBossFight)
      this.data = {};
  }

  OnBossFightStart(e) {
    console.log("fight start !");
    this.inBossFight = true;
  }

  OnBossFightEnd(e) {
    console.log("fight end !");
    this.inBossFight = false;
    this.data = {};
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
      if ('icon' in trigger) {
        that.icon.classList.remove('hide');
        that.iconText.classList.remove('hide');
        var url = trigger.icon in gAurasIcons ? gAurasIcons[trigger.icon] : trigger.icon;
        that.icon.style.backgroundImage = 'url("' + url + '")';
        if ('iconBorderColor' in trigger)
          that.icon.style.borderColor = trigger.iconBorderColor;
        else
          that.icon.style.borderColor = 'rgb(0, 0, 0)';
        if ('iconText' in trigger) {
          that.iconText.innerText = ValueOrFunction(trigger.iconText);
        } else {
          that.iconText.innerText = '';
        }
        if ('iconTextColor' in trigger)
          that.iconText.style.color = trigger.iconTextColor;
        else
          that.iconText.style.color = 'rba(255, 255, 255)';

        window.clearTimeout(that.iconTimer);
        that.iconTimer = window.setTimeout(function() {
          that.icon.classList.add('hide');
          that.iconText.classList.add('hide');
        }, duration * 1000);
      }

      var textSound = '';

      if ('infoText' in trigger) {
        var text = ValueOrFunction(trigger.infoText);
        if (text) {
          that.infoText.classList.remove('hide');
          that.infoText.style.animationName = 'zoom-in-out';
          that.infoText.style.animationDuration = '300ms';
          that.infoText.style.animationTimingFunction = 'linear';
          that.infoText.innerText = text;
          textSound = 'sound' in trigger ? '' : gAurasSounds.Info;

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
          textSound = 'sound' in trigger ? '' : gAurasSounds.Alert;

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
          textSound = 'sound' in trigger ? '' : gAurasSounds.Alarm;

          window.clearTimeout(that.alarmTextTimer);
          that.alarmTextTimer = window.setTimeout(function() {
            that.alarmText.classList.add('hide');
          }, duration * 1000);
        }
      }

      if (textSound)
        new Audio(textSound).play();

      if ('sound' in trigger && trigger.sound) {
        var url = trigger.sound in gAurasSounds ? gAurasSounds[trigger.sound] : trigger.sound;
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

var gAuras = new Auras();

document.addEventListener("onPlayerChangedEvent", function(e) {
  gAuras.OnPlayerChange(e);
});
document.addEventListener("onZoneChangedEvent", function(e) {
  gAuras.OnZoneChange(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  gAuras.OnInCombat(e);
});
document.addEventListener("onBossFightStart", function(e) {
  gAuras.OnBossFightStart(e);
});
document.addEventListener("onBossFightEnd", function(e) {
  gAuras.OnBossFightEnd(e);
});
document.addEventListener("onLogEvent", function(e) {
  gAuras.OnLog(e);
});

// Testing...
window.onload = function() {
  //window.setTimeout(function() { gAuras.Test('Unknown Zone (2Ba)', ':Exdeath uses The Decisive Battle.') }, 0);
  //window.setTimeout(function() { gAuras.Test('Unknown Zone (2Ba)', ':Exdeath begins casting Fire III.') }, 0);
  //window.setTimeout(function() { gAuras.Test('Unknown Zone (2Ba)', ':test:trigger:') }, 1000);
};
