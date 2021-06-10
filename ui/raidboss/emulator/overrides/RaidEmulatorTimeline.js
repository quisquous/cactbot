import { Timeline } from '../../timeline';

export default class RaidEmulatorTimeline extends Timeline {
  constructor(text, replacements, triggers, styles, options) {
    super(text, replacements, triggers, styles, options);
    this.emulatedStatus = 'pause';
  }

  bindTo(emulator) {
    this.emulator = emulator;
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
  }

  emulatedSync(currentLogTime) {
    if (!currentLogTime)
      return;

    // This is a bit complicated due to jumps in timelines. If we've already got a timebase,
    // fightNow needs to be calculated based off of that instead of initialOffset
    // timebase = 0 when not set
    const baseTimestamp = this.timebase ||
      this.emulator.currentEncounter.encounter.initialTimestamp;
    const fightNow = (currentLogTime - baseTimestamp) / 1000;

    this.SyncTo(fightNow, currentLogTime);
    this._OnUpdateTimer(currentLogTime);
  }

  // Override
  _ScheduleUpdate(fightNow) {
  }
}
