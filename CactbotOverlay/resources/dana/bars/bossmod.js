"use strict";

/* 
{ // Example trigger.
  // Regular expression to match against.
  regex: /trigger-regex-here/,
  // Either seconds or position is specified. Seconds is fixed. Position is parsed as a float from the regex.
  durationSeconds: 3,
  durationPosition: 2,
  // Time to wait before showing it once the regex is seen.
  delaySeconds: 0,
  // Icon to show.
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhE',
  // How to scale the icon. fill = fill box on both axes, scale = fill box on one axis
  iconScale: 'fill',
  // Color of border.
  borderColor: '#000',
  // Text to show below the icon.
  test: 'DO STUFF',
  // Color of the text.
  textColor: '#000',
  // Sound file to play.
  sound: '',
  // Volume between 0 and 1 to play |sound|.
  soundVolume: 1,
  // Function to run.
  run: function() { do stuff.. },
},
*/

// Triggers.
var kBossModTriggers = {
  // Global zone
  '.' : [
  ],
  // O4S
  'Unknown Zone \\(2Ba\\)' : [
    { // Inner Flood (move out).
      regex: /:240E:Neo Exdeath starts using/,
      durationSeconds: 3,
      icon: kIconMoveOut,
      text: 'OUTSIDE',
    },
    { // Outer Flood (move in).
      regex: /:240F:Neo Exdeath starts using/,
      durationSeconds: 3,
      icon: kIconMoveIn,
      text: 'INSIDE',
    },
  ],
};

// Layout.
var kBossModIconPosX = 0;
var kBossModIconPosY = 0;
var kBossModIconSizeW = 40;
var kBossModIconSizeH = 40;
var kBossModIconBorderWidth = 1;
var kBossModIconTextW = 100;

class BossMod {
  constructor() {
    this.init = false;
    this.container = null;
    this.icon = null;
    this.text = null;
    this.data = {};
    this.triggers = [];
  }

  OnPlayerChange(e) {
    if (this.init)
      return;
    this.init = true;
    this.me = e.detail.name;

    var root = document.getElementById('container');
    this.container = document.createElement('div');
    this.icon = document.createElement('div');
    this.text = document.createElement('div');
    root.appendChild(this.container);
    this.container.appendChild(this.icon);
    this.container.appendChild(this.text);

    this.container.style.left = kBossModIconPosX;
    this.container.style.top = kBossModIconPosY;
    this.icon.style.position = 'absolute';
    this.icon.style.left = Math.abs(kBossModIconTextW - (kBossModIconSizeW + kBossModIconBorderWidth)) / 2;
    this.icon.style.width = kBossModIconSizeW;
    this.icon.style.height = kBossModIconSizeH;
    this.text.style.position = 'absolute';
    this.text.style.top = kBossModIconSizeH + 4;
    this.text.style.width = kBossModIconTextW;

    this.container.style.display = "none";
    this.container.style.position = "absolute";
    this.icon.style.borderWidth = kBossModIconBorderWidth;
    this.icon.style.borderStyle = "solid";
    this.icon.style.backgroundColor = "rgb(255, 255, 255)";
    this.icon.style.backgroundPosition = "center center";
    this.text.classList.add('text');
    this.text.style.textAlign = 'center';
  }

  OnZoneChange(e) {
    this.triggers = [];
    for (var zone in kBossModTriggers) {
      if (e.detail.zoneName.search(zone) >= 0)
        this.triggers = this.triggers.concat(kBossModTriggers[zone]);
    }
  }

  OnBossFightEnd(e) {
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

  OnTrigger(trigger, regex) {
    var delay = 'delaySeconds' in trigger ? trigger.delaySeconds : 0;
    var duration = 0;
    if ('durationSeconds' in trigger) {
      duration = trigger.durationSeconds;
    } else {
      console.assert('durationPosition' in trigger, "Either durationSeconds or durationPosition must be present for " + bossModTrigger);
      duration = regex[trigger.durationPosition];
    }

    var that = this;
    window.setTimeout(function() {
      window.clearTimeout(that.bossModTimer);
      that.bossModTimer = window.setTimeout(function() {
        if (that.container != null)
          that.container.style.display = 'none';
      }, duration * 1000);
      if ('icon' in trigger) {
        that.container.style.display = 'block';
        that.icon.style.display = 'block';
        that.icon.style.backgroundImage = 'url("' + trigger.icon + '")';
        if ('iconScale' in trigger && trigger.iconScale == 'scale')
          that.icon.style.backgroundSize = Math.min(kBossModIconSizeW, kBossModIconSizeH) + "px";
        else
          that.icon.style.backgroundSize = Math.max(kBossModIconSizeW, kBossModIconSizeH) + "px";
        if ('borderColor' in trigger)
          that.icon.style.borderColor = trigger.borderColor;
        else
          that.icon.style.borderColor = 'rgb(0, 0, 0)';
      } else {
        that.icon.style.display = 'none';
      }
      if ('text' in trigger) {
        that.text.style.display = 'block';
        that.container.style.display = 'block';
        that.text.innerText = trigger.text;
      } else {
        that.text.style.display = 'none';
      }
      if ('textColor' in trigger)
        that.text.style.color = trigger.textColor;
      else
        that.text.style.color = 'rba(255, 255, 255)';
      if ('sound' in trigger) {
        var audio = new Audio(trigger.sound);
        if ('soundVolume' in trigger)
          audio.volume = trigger.soundVolume;
        audio.play();
      }
      if ('run' in trigger)
        trigger.run();
    }, delay * 1000);
  }
};

var gBossMod = new BossMod();

document.addEventListener("onPlayerChangedEvent", function(e) {
  gBossMod.OnPlayerChange(e);
});
document.addEventListener("onZoneChangedEvent", function(e) {
  gBossMod.OnZoneChange(e);
});
document.addEventListener("onBossFightEnd", function(e) {
  gBossMod.OnBossFightEnd(e);
});
document.addEventListener("onLogEvent", function(e) {
  gBossMod.OnLog(e);
});

// Testing...
/*
window.onload = function() {
  gBossMod.OnPlayerChange({ detail: { name : 'ME' } });
  gBossMod.OnZoneChange({ detail: { zoneName: 'Unknown Zone (2Ba)' } });
  gBossMod.OnLog({ detail: { logs : [':240E:Neo Exdeath starts using', ]}});
};
*/