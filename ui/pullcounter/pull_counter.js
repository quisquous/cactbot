"use strict";

var Options = {
  Language: 'en',
};

var gPullCounter;

class PullCounter {
  constructor() {
    // Create stub element to avoid conditionals everywhere.
    this.element = document.createElement('div');
    this.zone = null;
    this.bossStarted = false;

    var cmd = JSON.stringify({getSaveData: ''});
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, cmd);
    this.ReloadTriggers();
  }

  SetElement(element) {
    this.element = element;
  }

  OnFightStart(boss) {
    this.pullCounts[boss.id] = (this.pullCounts[boss.id] || 0) + 1;
    this.bossStarted = true;

    this.element.innerText = this.pullCounts[boss.id];
    this.element.classList.remove('wipe');

    var cmd = JSON.stringify({setSaveData: JSON.stringify(this.pullCounts)});
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, cmd);
  }

  OnLogEvent(e) {
    if (this.bosses.length == 0 || this.bossStarted)
      return;
    for (var i = 0; i < e.detail.logs.length; ++i) {
      var log = e.detail.logs[i];
      if (this.countdownBoss && log.match(gLang.countdownEngageRegex())) {
        this.OnFightStart(this.countdownBoss);
        return;
      }
      for (var b = 0; b < this.bosses.length; ++b) {
        var boss = this.bosses[b]
        if (log.match(boss.startRegex)) {
          this.OnFightStart(boss);
          return;
        }
      }
    }
  }

  OnZoneChange(e) {
    this.element.innerText = '';
    this.zone = e.detail.zoneName;
    this.ReloadTriggers();
  }

  ReloadTriggers() {
    this.bosses = [];
    this.countdownBoss = null;
    if (!this.zone || !this.pullCounts)
      return;

    for (var i = 0; i < gBossFightTriggers.length; ++i) {
      var boss = gBossFightTriggers[i];
      if (!this.zone.match(boss.zoneRegex))
        continue;
      this.bosses.push(boss);
      if (boss.countdownStarts) {
        // Only one boss can be started with countdown in a zone.
        if (this.countdownBoss)
          console.error('Countdown boss conflict: ' + boss.id + ', ' + this.countdownBoss.id);
        this.countdownBoss = boss;
      }
    }
  }

  OnInCombatChange(e) {
    if (!e.detail.inGameCombat)
      this.bossStarted = false;
  }

  OnPartyWipe() {
    this.element.classList.add('wipe');
  }

  SetSaveData(e) {
    if (!e.detail.data)
      return;
    try {
      this.pullCounts = JSON.parse(e.detail.data);
    } catch(err) {
      console.error('onSendSaveData parse error: ' + err.message);
    }
    this.ReloadTriggers();
  }
}

gPullCounter = new PullCounter();

document.addEventListener("onLogEvent", function(e) {
  gPullCounter.OnLogEvent(e);
});

document.addEventListener("onZoneChangedEvent", function (e) {
  gPullCounter.OnZoneChange(e);
});

document.addEventListener("onInCombatChangedEvent", function (e) {
  gPullCounter.OnInCombatChange(e);
});

document.addEventListener("onPartyWipe", function () {
  gPullCounter.OnPartyWipe();
});

document.addEventListener("onSendSaveData", function (e) {
  gPullCounter.SetSaveData(e);
});

window.addEventListener('load', function (e) {
  gPullCounter.SetElement(document.getElementById('pullcounttext'));
});
