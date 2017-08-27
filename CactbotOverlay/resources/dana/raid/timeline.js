"use strict";

// Options
var kShowTimerBarsAtSeconds = 30;
var kKeepExpiredTimerBarsForSeconds = 0.7;
var kBarExpiresSoonSeconds = 8;
var kMaxNumberOfTimerBars = 4;
var kBarWidth = 220;
var kBarHeight = 20;
var kBarFontSize = 14;
var kBarColor = '#88f';
var kBarExpiresSoonColor = '#f88';

// This class reads the format of ACT Timeline plugin, described here:
// http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin
// There are a some extensions to the original format:
//
// # Allows you to specify a regular expression, which when matched the timeline file
// # will be used.  If more than one file has a matching regex for the current zone, an
// # arbitrary one will be used (don't do that). This is useful when the FFXIV plugin
// # does not know the name of the zone yet, but you want to specify the name for once
// # it becomes known. If this isn't specified, the name of the file (excluding the
// # extention) will be used instead, and must fully match the zone name.
// zone "zone-regex"
class Timeline {
  constructor(zoneRegex, text) {
    /*
    // This needs CefBrowserSettings.web_security_disabled = true.
    var file = new XMLHttpRequest();
    file.open("GET", filename, false);
    file.onreadystatechange = function() {
      console.log("readyState " + file.readyState + " status " + file.status);
      if(file.readyState === 4) {
        if(file.status === 200 || file.status == 0) {
          var text = file.responseText;
          LoadFile(text);
        }
      }
    }
    file.send(null);
    */
    // A regex for what zone(s) to use the timeline for. Can be overridden
    // inside the text data.
    this.zoneRegex = zoneRegex;
    // A set of names which will not be notified about.
    this.ignores = {};
    // Sorted by event occurance time.
    this.events = [];
    // Sorted by sync.start time.
    this.syncStarts = [];
    // Sorted by sync.end time.
    this.syncEnds = [];
    // Not sorted.
    this.activeSyncs = [];
    // Sorted by event occurance time.
    this.activeEvents = [];
    this.LoadFile(text);
    this.Stop();
  }
    
  LoadFile(text) {
    this.events = [];
    this.syncStarts = [];
    this.syncEnds = [];
    
    var uniqueid = 1;
    
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];
      // Drop comments.
      var comment = line.indexOf('#');
      if (comment >= 0)
        line = line.substring(0, comment);
      line = line.trim();

      var match = line.match(/^zone \"([^"]+)\"$/);
      if (match != null) {
        this.zoneRegex = match[1];
        continue;
      }
      
      match = line.match(/^hideall \"([^"]+)\"$/);
      if (match != null) {
        this.ignores[match[1]] = true;
        continue;
      }
      
      match = line.match(/^([0-9]+(?:\.[0-9]+)?)\s+"(.*?)"(\s+(.*))?/);
      if (match == null) continue;
      
      var seconds = parseFloat(match[1]);
      var o = {
        id: uniqueid++,
        time: seconds,
        sortTime: seconds,
        name: match[2],
        activeTime: 0,
      };
      var commands = match[3];
      if (commands) {
        var commandMatch = commands.match(/duration ([0-9]+(?:\.[0-9]+)?)(\s.*)?$/);
        if (commandMatch)
          o.duration = parseFloat(commandMatch[1]);
        commandMatch = commands.match(/sync \/(.*)\/(\s.*)?$/);
        if (commandMatch) {
          var sync = {
            id: uniqueid,
            regex: new RegExp(commandMatch[1]),
            start: seconds - 2.5,
            end: seconds + 2.5,
            time: seconds,
          }
          if (commandMatch[2]) {
            var argMatch = commandMatch[2].match(/window (([0-9]+(?:\.[0-9]+)?),)?([0-9]+(?:\.[0-9]+)?)(\s.*)?$/);
            if (argMatch) {
              if (argMatch[2]) {
                sync.start = seconds - parseFloat(argMatch[2]);
                sync.end = seconds + parseFloat(argMatch[3]);
              } else {
                sync.start = seconds - (parseFloat(argMatch[3]) / 2);
                sync.end = seconds + (parseFloat(argMatch[3]) / 2);
              }
            }
            argMatch = commandMatch[2].match(/jump ([0-9]+(?:\.[0-9]+)?)(\s.*)?$/);
            if (argMatch)
              sync.jump = parseFloat(argMatch[1]);
          }
          this.syncStarts.push(sync);
          this.syncEnds.push(sync);
        }
      }
      this.events.push(o);
    }
    
    this.events.sort(function(a, b) { return a.time - b.time });
    this.syncStarts.sort(function(a, b) { return a.start - b.start });
    this.syncEnds.sort(function(a, b) { return a.end - b.end });
  }
  
  Stop() {
    this.timebase = null;

    this.nextEvent = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;

    var fightNow = 0;
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._ClearTimers();
    this._CancelUpdate();
  }

  SyncTo(fightNow) {
   // This records the actual time which aligns with "0" in the timeline.
    this.timebase = new Date(new Date() - fightNow * 1000);
    
    this.nextEvent = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;
    
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._ClearTimers();
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }
  
  _CollectActiveSyncs(fightNow) {
    this.activeSyncs = [];
    for (var i = this.nextSyncEnd; i < this.syncEnds.length; ++i) {
      if (this.syncEnds[i].start <= fightNow)
        this.activeSyncs.push(this.syncEnds[i]);
    }
  }
  
  OnLogLine(line) {
    for (var i = 0; i < this.activeSyncs.length; ++i) {
      var sync = this.activeSyncs[i];
      if (line.search(sync.regex) >= 0) {
        if ('jump' in sync) {
          if (!sync.jump)
            this.Stop();
          else
            this.SyncTo(sync.jump);
        } else {
          this.SyncTo(sync.time);
        }
        break;
      }
    }
  }
  
  _AdvanceTimeTo(fightNow) {
    while (this.nextEvent < this.events.length && this.events[this.nextEvent].time <= fightNow)
      ++this.nextEvent;
    while (this.nextSyncStart < this.syncStarts.length && this.syncStarts[this.nextSyncStart].start <= fightNow)
      ++this.nextSyncStart;
    while (this.nextSyncEnd < this.syncEnds.length && this.syncEnds[this.nextSyncEnd].end <= fightNow)
      ++this.nextSyncEnd;
  }
  
  _ClearTimers() {
    if (this.removeTimerCallback) {
      for (var i = 0; i < this.activeEvents.length; ++i)
        this.removeTimerCallback(this.activeEvents[i], false);
    }
    this.activeEvents = [];
  }

  _RemoveExpiredTimers(fightNow) {
    while (this.activeEvents.length && this.activeEvents[0].time <= fightNow) {
      if (this.removeTimerCallback)
        this.removeTimerCallback(this.activeEvents[0], true);
      this.activeEvents.splice(0, 1);
    }
  }
  
  _AddDurationTimers(fightNow) {
    var sort = false;
    var events = [];
    for (var i = 0; i < this.activeEvents.length; ++i) {
      var e = this.activeEvents[i];
      if (e.time <= fightNow && e.duration) {
        var durationEvent = {
          id: e.id,
          time: e.time + e.duration,
          sortTime: e.time,
          name: 'Active: ' + e.name,
        };
        events.push(durationEvent);
        this.activeEvents.splice(i, 1);
        if (this.addTimerCallback)
          this.addTimerCallback(fightNow, durationEvent, true);
        sort = true;
        --i;
      }
    }
    if (events.length)
      Array.prototype.push.apply(this.activeEvents, events);
      this.activeEvents.sort(function(a, b) { return a.time - b.time });
  }
  
  _AddUpcomingTimers(fightNow) {
    while (this.nextEvent < this.events.length && this.activeEvents.length < kMaxNumberOfTimerBars) {
      var e = this.events[this.nextEvent];
      if (e.time - fightNow > kShowTimerBarsAtSeconds)
        break;
      if (fightNow < e.time && !(e.name in this.ignores)) {
        this.activeEvents.push(e);
        if (this.addTimerCallback)
          this.addTimerCallback(fightNow, e, false);
      }
      ++this.nextEvent;
    }
  }

  _CancelUpdate() {
    if (this.updateTimer) {
      window.clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }
  
  _ScheduleUpdate(fightNow) {
    console.assert(this.timebase, "_ScheduleUpdate called while stopped");

    var kBig = 1000000000; // Something bigger than any fight length in seconds.
    var nextEventStarting = kBig;
    var nextEventEnding = kBig;
    var nextSyncStarting = kBig;
    var nextSyncEnding = kBig;
    
    if (this.nextEvent < this.events.length) {
      var nextEventEndsAt = this.events[this.nextEvent].time
      console.assert(nextEventStarting > fightNow, "nextEvent wasn't updated before calling _ScheduleUpdate")
      // There might be more events than we can show, so the next event might be in
      // the past. If that happens, then ignore it, as we can't use that for our timer.
      var showNextEventAt = nextEventEndsAt - kShowTimerBarsAtSeconds;
      if (showNextEventAt > fightNow)
        nextEventStarting = showNextEventAt;
    }
    if (this.activeEvents.length > 0) {
      nextEventEnding = this.activeEvents[0].time;
      console.assert(nextEventEnding > fightNow, "Expired activeEvents weren't pruned before calling _ScheduleUpdate")
    }
    if (this.nextSyncStart < this.syncStarts.length) {
      nextSyncStarting = this.syncStarts[this.nextSyncStart].start;
      console.assert(nextSyncStarting > fightNow, "nextSyncStart wasn't updated before calling _ScheduleUpdate")
    }
    if (this.nextSyncEnd < this.syncEnds.length) {
      nextSyncEnding = this.syncEnds[this.nextSyncEnd].end;
      console.assert(nextSyncEnding > fightNow, "nextSyncEnd wasn't updated before calling _ScheduleUpdate")
    }
    
    var nextTime = Math.min(nextEventStarting, Math.min(nextEventEnding, Math.min(nextSyncStarting, nextSyncEnding)));
    if (nextTime != kBig) {
      console.assert(nextTime > fightNow, "nextTime is in the past")
      this.updateTimer = window.setTimeout(this._OnUpdateTimer.bind(this), (nextTime - fightNow) * 1000);
    }
  }
  
  _OnUpdateTimer() {
    console.assert(this.timebase, "_OnTimerUpdate called while stopped");

    // This is the number of seconds into the fight (subtracting Dates gives milliseconds).
    var fightNow = (new Date() - this.timebase) / 1000;
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    this._AddDurationTimers(fightNow);
    this._RemoveExpiredTimers(fightNow);
    this._AddUpcomingTimers(fightNow);
    this._ScheduleUpdate(fightNow);
  }

  SetAddTimer(c) { this.addTimerCallback = c; }
  SetRemoveTimer(c) { this.removeTimerCallback = c; }
};

class TimelineUI {
  constructor() {
    this.init = false;
  }
  
  Init() {
    if (this.init) return;
    this.init = true;
    
    this.root = document.getElementById('timeline-container');
    this.timerlist = document.getElementById('timeline');
    this.timerlist.maxnumber = kMaxNumberOfTimerBars;
    this.timerlist.rowcolsize = kMaxNumberOfTimerBars;
    this.timerlist.elementwidth = kBarWidth;
    this.timerlist.elementheight = kBarHeight + 2;
    this.timerlist.toward = "down right";
    this.activeBars = {};
    this.expireTimers = {};
  }

  SetTimeline(timeline) {
    this.Init();
    if (this.timeline) {
      this.timeline.SetAddTimer(null);
      this.timeline.SetRemoveTimer(null);
      this.timerlist.clear();
      this.activeBars = {};
    }

    this.timeline = timeline;
    if (this.timeline) {
      this.timeline.SetAddTimer(this.OnAddTimer.bind(this));
      this.timeline.SetRemoveTimer(this.OnRemoveTimer.bind(this));
    }
  }
  
  OnAddTimer(fightNow, e, channeling) {
    var div = document.createElement('div');
    var bar = document.createElement('timer-bar');
    div.appendChild(bar);
    div.style.fontSize = kBarFontSize;
    bar.width = kBarWidth;
    bar.height = kBarHeight;
    bar.duration = e.time - fightNow;
    bar.righttext = 'remain';
    bar.lefttext = e.name;
    bar.toward = 'right';
    bar.style = !channeling ? 'fill' : 'empty';

    if (!channeling && e.time - fightNow > kBarExpiresSoonSeconds) {
      bar.fg = kBarColor;
      window.setTimeout(this.OnTimerExpiresSoon.bind(this, e.id), (e.time - fightNow - kBarExpiresSoonSeconds) * 1000);
    } else {
      bar.fg = kBarExpiresSoonColor;
    }

    this.timerlist.addElement(e.id, div, e.sortTime);
    this.activeBars[e.id] = bar;
    if (e.id in this.expireTimers) {
      window.clearTimeout(this.expireTimers[e.id])
      delete this.expireTimers[e.id];
    }
  }
  
  OnTimerExpiresSoon(id) {
    if (id in this.activeBars)
      this.activeBars[id].fg = kBarExpiresSoonColor;
  }
  
  OnRemoveTimer(e, expired) {
    if (expired && kKeepExpiredTimerBarsForSeconds) {
      this.expireTimers[e.id] = window.setTimeout(this.OnRemoveTimer.bind(this, e, false), kKeepExpiredTimerBarsForSeconds * 1000);
      return;
    } else if (e.id in this.expireTimers) {
      window.clearTimeout(this.expireTimers[e.id])
      delete this.expireTimers[e.id];
    }
    this.timerlist.removeElement(e.id);
    delete this.activeBars[e.id];
  }
};

class TimelineController {
  constructor(ui) {
    this.ui = ui;
    this.dataFiles = {};
    this.timelines = [];
  }

  OnInCombat(e) {
    if (!e.detail.inCombat && !this.inBossFight)
      this.OnBossFightStop();
  }
  
  OnBossFightStart() {
    this.inBossFight = true;
  }

  OnBossFightStop() {
    this.inBossFight = false;
    if (this.timeline)
      this.activeTimeline.Stop();
  }

  OnLogEvent(e) {
    if (!this.activeTimeline)
      return;
    for (var i = 0; i < e.detail.logs.length; ++i)
      this.activeTimeline.OnLogLine(e.detail.logs[i]);
  }

  OnZoneChanged(e) {
    this.activeTimeline = null;
    for (var i = 0; i < this.timelines.length; ++i) {
      if (e.detail.zoneName.search(this.timelines[i].zoneRegex) >= 0) {
        this.activeTimeline = this.timelines[i];
        break;
      }
    }
    this.ui.SetTimeline(this.activeTimeline);
  }

  SetDataFiles(files) {
    this.timelines = [];
    for (var f in files) {
      var nameWithoutExtension = f.split('.').slice(0, -1).join('.');
      this.timelines.push(new Timeline('^' + nameWithoutExtension + '$', files[f]));
    }
  }
}

var gTimelineController = new TimelineController(new TimelineUI());

document.addEventListener("onZoneChangedEvent", function(e) {
  gTimelineController.OnZoneChanged(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  gTimelineController.OnInCombat(e);
});
document.addEventListener("onBossFightStart", function(e) {
  gTimelineController.OnBossFightStart();
});
document.addEventListener("onBossFightEnd", function(e) {
  gTimelineController.OnBossFightStop();
});
document.addEventListener("onLogEvent", function(e) {
  gTimelineController.OnLogEvent(e);
});
document.addEventListener("onDataFilesRead", function(e) {
  gTimelineController.SetDataFiles(e.detail.files);
});