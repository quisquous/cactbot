'use strict';

class RaidEmulatorTimeline extends Timeline {
  constructor(text, replacements, triggers, styles, options) {
    super(text, replacements, triggers, styles, options);
    this.emulatedTimeOffset = 0;
    this.emulatedFightSync = 0;
    this.emulatedFightSyncLastOffset = 0;
    this.emulatedStatus = 'pause';
  }

  bindTo(emulator) {
    emulator.on('tick', (timestampOffset, lastLogTimestamp) => {
      this.emulatedTimeOffset = timestampOffset;
    });
    emulator.on('play', () => {
      this.emulatedStatus = 'play';
    });
    emulator.on('pause', () => {
      this.emulatedStatus = 'pause';
    });
  }

  emulatedSync(timestampOffset) {
    if (!this.emulatedFightSyncLastOffset)
      return;

    this.SyncTo(this.emulatedFightSync +
      ((timestampOffset - this.emulatedFightSyncLastOffset) / 1000));
    this._OnUpdateTimer();
  }

  // Override
  _ScheduleUpdate(fightNow) {
  }

  // Override
  SyncTo(fightNow) {
    super.SyncTo(fightNow);

    this.emulatedFightSync = fightNow;
    this.emulatedFightSyncLastOffset = this.emulatedTimeOffset;
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = RaidEmulatorTimeline;
