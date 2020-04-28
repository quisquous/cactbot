'use strict';

class RaidEmulatorTimelineUI extends TimelineUI {
  constructor(options) {
    super(options);
    this.emulatedTimerBars = [];
    this.emulatedTimeOffset = 0;
    this.emulatedStatus = 'pause';
    this.$barContainer = jQuery('.timer-bar-container');
  }

  bindTo(emulator) {
    emulator.on('tick', (timestampOffset, lastLogTimestamp) => {
      this.emulatedTimeOffset = timestampOffset;
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        this.updateBar(bar, timestampOffset);
      }
      let toRemove = this.emulatedTimerBars.filter((bar) => bar.forceRemoveAt <= timestampOffset);
      for (let i in toRemove) {
        let bar = toRemove[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = this.emulatedTimerBars.filter((bar) => {
        return bar.forceRemoveAt > timestampOffset;
      });
      this.timeline && this.timeline.timebase && this.timeline._OnUpdateTimer();
    });
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
      this.timeline && this.timeline.EmulatedSync(emulator.currentTimestamp);
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
    let tmpPopupText;
    emulator.on('preSeek', (time) => {
      this.timeline && this.timeline.Stop();
      this.emulatedTimeOffset = time;
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = [];
      this.timeline && (tmpPopupText = this.timeline.popupText);
      this.timeline && (this.timeline.popupText = null);
    });
    emulator.on('postSeek', (time) => {
      this.timeline && (this.timeline.popupText = tmpPopupText);
      this.timeline && this.timeline.EmulatedSync(time);
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        this.updateBar(bar, time);
      }
    });
    emulator.on('currentEncounterChanged', () => {
      this.timeline && this.timeline.Stop();
      this.emulatedTimeOffset = 0;
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = [];
    });
  }

  updateBar(bar, timestampOffset) {
    let barElapsed = timestampOffset - bar.start;
    let barProg = Math.min((barElapsed / bar.duration) * 100, 100);
    if (bar.style === 'empty')
      barProg = 100 - barProg;

    let rightText = ((bar.duration - barElapsed) / 1000).toFixed(1);
    if (barProg >= 100)
      rightText = '';

    bar.$leftLabel.text(bar.event.text);
    bar.$rightLabel.text(rightText);
    bar.$bar.attr('aria-valuenow', barElapsed);
    bar.$bar.css('width', barProg + '%');
  }

  // Overrride
  Init() {
    if (this.init)
      return;
    this.init = true;
    this.timerlist = { clear: () => { } };

    this.activeBars = {};
    this.expireTimers = {};
  }

  // Overrride
  InitDebugUI() {
    this.debugElement = {};
  }

  // Overrride
  OnAddTimer(fightNow, e, channeling) {
    if (this.emulatedTimerBars.filter((bar) => bar.event.id === e.id).length)
      return;

    let end = (e.time - fightNow) * 1000;
    let start = end - (this.options.ShowTimerBarsAtSeconds * 1000);
    let bar = {
      $progress: jQuery('<div class="progress mb-1"></div>'),
      $bar: jQuery('<div class="progress-bar"></div>'),
      $leftLabel: jQuery('<div class="timer-bar-left-label"></div>'),
      $rightLabel: jQuery('<div class="timer-bar-right-label"></div>'),
      start: this.emulatedTimeOffset + start,
      style: !channeling ? 'fill' : 'empty',
      duration: (channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds) * 1000,
      event: e,
      forceRemoveAt: 0,
    };

    bar.forceRemoveAt = bar.start + bar.duration;

    if (this.options.KeepExpiredTimerBarsForSeconds)
      bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;

    bar.$progress.append(bar.$bar, bar.$leftLabel, bar.$rightLabel);
    bar.$bar.attr('aria-valuemax', bar.duration);
    this.emulatedTimerBars.push(bar);
    this.$barContainer.append(bar.$progress);
    this.updateBar(bar, this.emulatedTimeOffset);
  }

  // Overrride
  OnRemoveTimer(e, expired) {
    let bars = this.emulatedTimerBars.filter((bar) => bar.event.id === e.id);
    if (bars.length < 1)
      return;

    if (expired) {
      bars[0].forceRemoveAt = this.emulatedTimeOffset;
      if (this.options.KeepExpiredTimerBarsForSeconds)
        bars[0].forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;
    }
  }
}
