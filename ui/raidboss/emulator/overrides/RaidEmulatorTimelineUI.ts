import { TimelineUI } from '../../timeline';

export default class RaidEmulatorTimelineUI extends TimelineUI {
  constructor(options) {
    super(options);
    this.emulatedTimerBars = [];
    this.emulatedStatus = 'pause';
    this.$barContainer = document.querySelector('.timer-bar-container');
    this.$progressTemplate = document.querySelector('template.progress').content.firstElementChild;
  }

  bindTo(emulator) {
    emulator.on('tick', (currentLogTime, lastLogLineTime) => {
      for (const i in this.emulatedTimerBars) {
        const bar = this.emulatedTimerBars[i];
        this.updateBar(bar, currentLogTime);
      }
      const toRemove = this.emulatedTimerBars
        .filter((bar) => bar.forceRemoveAt <= currentLogTime);
      for (const i in toRemove) {
        const bar = toRemove[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = this.emulatedTimerBars.filter((bar) => {
        return bar.forceRemoveAt > currentLogTime;
      });
      this.timeline && this.timeline.timebase && this.timeline._OnUpdateTimer(lastLogLineTime);
    });
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
      this.timeline && this.timeline.emulatedSync(emulator.currentLogTime);
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
    let tmpPopupText;
    emulator.on('preSeek', (time) => {
      this.timeline && this.timeline.Stop();
      for (const i in this.emulatedTimerBars) {
        const bar = this.emulatedTimerBars[i];
        bar.$progress.remove();
      }
      this.emulatedTimerBars = [];
      this.timeline && (tmpPopupText = this.timeline.popupText);
      this.timeline && (this.timeline.popupText = null);
    });
    emulator.on('postSeek', (currentLogTime) => {
      this.timeline && (this.timeline.popupText = tmpPopupText);
      this.timeline && this.timeline.emulatedSync(currentLogTime);
      for (const i in this.emulatedTimerBars) {
        const bar = this.emulatedTimerBars[i];
        this.updateBar(bar, currentLogTime);
      }
    });
    emulator.on('currentEncounterChanged', this.stop.bind(this));
  }

  stop() {
    this.timeline && this.timeline.Stop();
    for (const i in this.emulatedTimerBars) {
      const bar = this.emulatedTimerBars[i];
      bar.$progress.remove();
    }
    this.emulatedTimerBars = [];
  }

  updateBar(bar, currentLogTime) {
    const barElapsed = currentLogTime - bar.start;
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

  // Override
  Init() {
    if (this.init)
      return;
    this.init = true;
    this.timerlist = { clear: () => { } };

    this.activeBars = {};
    this.expireTimers = {};
  }

  // Override
  AddDebugInstructions() {
    this.debugElement = document.createElement('div');
  }

  // Override
  OnAddTimer(fightNow, e, channeling) {
    const end = this.timeline.timebase + (e.time * 1000);
    const start = end - (this.options.ShowTimerBarsAtSeconds * 1000);
    const $progress = this.$progressTemplate.cloneNode(true);
    const bar = {
      $progress: $progress,
      $bar: $progress.querySelector('.progress-bar'),
      $leftLabel: $progress.querySelector('.timer-bar-left-label'),
      $rightLabel: $progress.querySelector('.timer-bar-right-label'),
      start: start,
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
    this.updateBar(bar);
  }

  // Override
  OnRemoveTimer(e, expired) {
    const bars = this.emulatedTimerBars.filter((bar) => bar.event.id === e.id);

    bars.forEach((bar) => {
      bar.forceRemoveAt = this.timeline.timebase;

      if (expired && this.options.KeepExpiredTimerBarsForSeconds)
        bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;
    });
  }
}
