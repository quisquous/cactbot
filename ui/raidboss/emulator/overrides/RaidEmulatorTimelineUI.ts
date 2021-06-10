import { UnreachableCode } from '../../../../resources/not_reached';
import { RaidbossOptions } from '../../../../ui/raidboss/raidboss_options';
import { TimelineUI, Event } from '../../timeline';
import RaidEmulator from '../data/RaidEmulator';
import RaidEmulatorTimeline from './RaidEmulatorTimeline';

interface EmulatorTimerBar {
  $progress: HTMLElement;
  $bar: HTMLDivElement;
  $leftLabel: HTMLElement;
  $rightLabel: HTMLElement;
  start: number;
  style: 'fill' | 'empty';
  duration: number;
  event: Event;
  forceRemoveAt: number;
}

export default class RaidEmulatorTimelineUI extends TimelineUI {
  emulatedTimerBars: EmulatorTimerBar[] = [];
  emulatedStatus = 'pause';
  $barContainer: HTMLElement;
  $progressTemplate: HTMLElement;
  constructor(options: RaidbossOptions) {
    super(options);
    const container = document.querySelector('.timer-bar-container');
    if (!(container instanceof HTMLElement))
      throw new UnreachableCode();
    this.$barContainer = container;
    const pTemplate = document.querySelector('template.progress');
    if (!(pTemplate instanceof HTMLTemplateElement))
      throw new UnreachableCode();
    if (!(pTemplate.content.firstElementChild instanceof HTMLElement))
      throw new UnreachableCode();
    this.$progressTemplate = pTemplate.content.firstElementChild;
  }

  bindTo(emulator: RaidEmulator): void {
    emulator.on('tick', (currentLogTime: number, lastLogLineTime: number) => {
      for (const bar of this.emulatedTimerBars)
        this.updateBar(bar, currentLogTime);

      const toRemove = this.emulatedTimerBars
        .filter((bar) => bar.forceRemoveAt <= currentLogTime);
      for (const bar of toRemove)
        bar.$progress.remove();

      this.emulatedTimerBars = this.emulatedTimerBars.filter((bar: EmulatorTimerBar) => {
        return bar.forceRemoveAt > currentLogTime;
      });
      this.timeline && this.timeline.timebase && this.timeline._OnUpdateTimer(lastLogLineTime);
    });
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
      if (this.timeline instanceof RaidEmulatorTimeline)
        this.timeline.emulatedSync(emulator.currentLogTime);
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
    emulator.on('preSeek', (_time) => {
      this.timeline && this.timeline.Stop();
      for (const bar of this.emulatedTimerBars)
        bar.$progress.remove();

      this.emulatedTimerBars = [];
    });
    emulator.on('postSeek', (currentLogTime) => {
      if (this.timeline instanceof RaidEmulatorTimeline)
        this.timeline.emulatedSync(currentLogTime);

      for (const bar of this.emulatedTimerBars)
        this.updateBar(bar, currentLogTime);
    });
    emulator.on('currentEncounterChanged', this.stop.bind(this));
  }

  stop(): void {
    this.timeline && this.timeline.Stop();
    for (const bar of this.emulatedTimerBars)
      bar.$progress.remove();

    this.emulatedTimerBars = [];
  }

  updateBar(bar: EmulatorTimerBar, currentLogTime: number): void {
    const barElapsed = currentLogTime - bar.start;
    let barProg = Math.min((barElapsed / bar.duration) * 100, 100);
    if (bar.style === 'empty')
      barProg = 100 - barProg;

    let rightText = ((bar.duration - barElapsed) / 1000).toFixed(1);
    if (barProg >= 100)
      rightText = '';

    bar.$leftLabel.textContent = bar.event.text;
    bar.$rightLabel.textContent = rightText;
    bar.$bar.style.width = `${barProg}%`;
  }

  Init(): void {
    // This space intentionally left blank
  }

  AddDebugInstructions(): void {
    // This space intentionally left blank
  }

  // Override
  protected OnAddTimer(fightNow: number, e: Event, channeling: boolean): void {
    if (!this.timeline)
      throw new UnreachableCode();

    const end = this.timeline.timebase + (e.time * 1000);
    const start = end - (this.options.ShowTimerBarsAtSeconds * 1000);
    const $progress = this.$progressTemplate.cloneNode(true);
    if (!($progress instanceof HTMLElement))
      throw new UnreachableCode();

    const $progBar = $progress.querySelector('.progress-bar');
    const $progLeft = $progress.querySelector('.timer-bar-left-label');
    const $progRight = $progress.querySelector('.timer-bar-right-label');

    if (!(
      $progBar instanceof HTMLDivElement &&
      $progLeft instanceof HTMLElement &&
      $progRight instanceof HTMLElement))
      throw new UnreachableCode();

    const bar: EmulatorTimerBar = {
      $progress: $progress,
      $bar: $progBar,
      $leftLabel: $progLeft,
      $rightLabel: $progRight,
      start: start,
      style: !channeling ? 'fill' : 'empty',
      duration: (channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds) * 1000,
      event: e,
      forceRemoveAt: 0,
    };

    bar.forceRemoveAt = bar.start + bar.duration;

    if (this.options.KeepExpiredTimerBarsForSeconds)
      bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;

    this.emulatedTimerBars.push(bar);
    this.$barContainer.append(bar.$progress);
    this.updateBar(bar, bar.start);
  }

  // Override
  OnRemoveTimer(e: Event, expired: boolean): void {
    const bars = this.emulatedTimerBars.filter((bar) => bar.event.id === e.id);

    bars.forEach((bar) => {
      if (!this.timeline)
        throw new UnreachableCode();

      bar.forceRemoveAt = this.timeline.timebase;

      if (expired && this.options.KeepExpiredTimerBarsForSeconds)
        bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;
    });
  }
}
