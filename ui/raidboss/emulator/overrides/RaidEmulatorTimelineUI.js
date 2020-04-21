class RaidEmulatorTimelineUI extends TimelineUI {

  emulatedTimerBars = [];
  emulatedTimeOffset = 0;
  $barContainer;
  emulatedStatus = 'Pause';

  constructor(options) {
    super(options);
    this.$barContainer = jQuery('.timer-bar-container');
  }

  Init() {
    if (this.init)
      return;
    this.init = true;
    this.timerlist = { clear: () => { } };

    this.activeBars = {};
    this.expireTimers = {};
  }

  BindTo(emulator) {
    emulator.on('Tick', (timestampOffset, lastLogTimestamp) => {
      this.emulatedTimeOffset = timestampOffset;
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        this.UpdateBar(bar, timestampOffset);
      }
      let toRemove = this.emulatedTimerBars.filter((bar) => bar.forceRemoveAt <= timestampOffset);
      for (let i in toRemove) {
        let bar = toRemove[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = this.emulatedTimerBars.filter((bar) => bar.forceRemoveAt > timestampOffset);
      this.timeline.timebase && this.timeline._OnUpdateTimer();
    });
    emulator.on('Play', () => {
      this.emulatedStatus = 'Play';
      this.timeline.timebase && this.timeline.SyncTo(this.timeline.emulatedFightSync);
    });
    emulator.on('Pause', () => {
      this.emulatedStatus = 'Pause';
    });
    let tmpPopupText;
    emulator.on('PreSeek', (time) => {
      this.timeline.Stop();
      this.emulatedTimeOffset = time;
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = [];
      tmpPopupText = this.timeline.popupText;
      this.timeline.popupText = null;
    });
    emulator.on('PostSeek', (time) => {
      this.timeline.popupText = tmpPopupText;
      this.timeline.timebase && this.timeline.SyncTo(this.timeline.emulatedFightSync);
      for (let i in this.emulatedTimerBars) {
        let bar = this.emulatedTimerBars[i];
        this.UpdateBar(bar, timestampOffset);
      }
    });
  }

  UpdateBar(bar, timestampOffset) {
    let barElapsed = timestampOffset - bar.start;
    let barProg = Math.min((barElapsed / bar.duration) * 100, 100);
    if (bar.style === 'empty') {
      barProg = 100 - barProg;
    }
    let rightText = (bar.duration - barElapsed) / 1000;
    if (barProg >= 100) {
      rightText = '';
    }
    bar.$leftLabel.text(bar.event.text);
    bar.$rightLabel.text(rightText);
    bar.$bar.attr('aria-valuenow', barElapsed);
    bar.$bar.css('width', barProg + '%');
  }

  InitDebugUI() {
    this.debugElement = {};
  }

  OnAddTimer(fightNow, e, channeling) {
    if (this.emulatedTimerBars.filter((bar) => bar.event.id === e.id).length) {
      return;
    }
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

    bar.forceRemoveAt = bar.start + bar.duration + (this.options.KeepExpiredTimerBarsForSeconds * 1000);

    bar.$progress.append(bar.$bar, bar.$leftLabel, bar.$rightLabel);
    bar.$bar.attr('aria-valuemax', bar.duration);
    this.emulatedTimerBars.push(bar);
    this.$barContainer.append(bar.$progress);
    this.UpdateBar(bar, this.emulatedTimeOffset);
  }

  OnRemoveTimer(e, expired) {
    let bars = this.emulatedTimerBars.filter((bar) => bar.event.id === e.id);
    if (bars.length < 1) {
      return;
    }
    if (expired) {
      if (this.options.KeepExpiredTimerBarsForSeconds)
        bars[0].forceRemoveAt = this.emulatedTimeOffset + (this.options.KeepExpiredTimerBarsForSeconds * 1000);
      else
        bars[0].forceRemoveAt = this.emulatedTimeOffset;
    }
  }

}