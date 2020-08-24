'use strict';

class RaidEmulatorTimelineUI extends TimelineUI {
  constructor(options) {
    super(options);
    this.emulatedTimerBars = [];
    this.emulatedTimeOffset = 0;
    this.emulatedStatus = 'pause';
    this.$barContainer = document.querySelector('.timer-bar-container');
    this.$progressTemplate = document.querySelector('template.progress').content.firstElementChild;
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
      this.timeline && this.timeline.emulatedSync(emulator.currentTimestamp);
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
      this.timeline && this.timeline.emulatedSync(time);
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

    bar.$leftLabel.textContent = bar.event.text;
    bar.$rightLabel.textContent = rightText;
    bar.$bar.ariaValueNow = barElapsed;
    bar.$bar.style.width = barProg + '%';
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
    this.debugElement = document.createElement('div');
  }

  // Overrride
  OnAddTimer(fightNow, e, channeling) {
    if (this.emulatedTimerBars.filter((bar) => bar.event.id === e.id).length)
      return;

    let end = (e.time - fightNow) * 1000;
    let start = end - (this.options.ShowTimerBarsAtSeconds * 1000);
    let $progress = this.$progressTemplate.cloneNode(true);
    let bar = {
      $progress: $progress,
      $bar: $progress.querySelector('.progress-bar'),
      $leftLabel: $progress.querySelector('.timer-bar-left-label'),
      $rightLabel: $progress.querySelector('.timer-bar-right-label'),
      start: this.emulatedTimeOffset + start,
      style: !channeling ? 'fill' : 'empty',
      duration: (channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds) * 1000,
      event: e,
      forceRemoveAt: 0,
    };

    bar.forceRemoveAt = bar.start + bar.duration;

    if (this.options.KeepExpiredTimerBarsForSeconds)
      bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;

    bar.$bar.ariaValueMax = bar.duration;
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
