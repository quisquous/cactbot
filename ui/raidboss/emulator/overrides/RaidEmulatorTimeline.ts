import { LooseTimelineTrigger } from '../../../../types/trigger';
import { RaidbossOptions } from '../../raidboss_options';
import { Timeline, TimelineReplacement, TimelineStyle } from '../../timeline';
import RaidEmulator from '../data/RaidEmulator';

export default class RaidEmulatorTimeline extends Timeline {
  emulatedStatus = 'pause';
  emulator?: RaidEmulator;
  constructor(text: string, replacements: TimelineReplacement[], triggers: LooseTimelineTrigger[],
      styles: TimelineStyle[], options: RaidbossOptions) {
    super(text, replacements, triggers, styles, options);
  }

  bindTo(emulator: RaidEmulator): void {
    this.emulator = emulator;
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
  }

  emulatedSync(currentLogTime: number): void {
    if (!currentLogTime)
      return;

    // This is a bit complicated due to jumps in timelines. If we've already got a timebase,
    // fightNow needs to be calculated based off of that instead of initialOffset
    // timebase = 0 when not set
    const baseTimestamp = this.timebase ||
      this.emulator?.currentEncounter?.encounter?.initialTimestamp ||
      currentLogTime;
    const fightNow = (currentLogTime - baseTimestamp) / 1000;

    this.SyncTo(fightNow, currentLogTime);
    this._OnUpdateTimer(currentLogTime);
  }

  _ScheduleUpdate(_fightNow: number): void {
    // Override
  }
}
