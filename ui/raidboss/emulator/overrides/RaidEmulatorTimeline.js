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

  EmulatedSync(timestampOffset) {
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
    console.debug('SyncTo: ' + fightNow);
    // @TODO: This entire thing needs re-done, ugh.
    // This records the actual time which aligns with "0" in the timeline.
    let newTimebase = new Date((new Date() - fightNow * 1000));
    // Skip syncs that are too close.  Many syncs happen on abilities that
    // hit 8 to 24 people, and so this is a lot of churn.
    if (Math.abs(newTimebase - this.timebase) <= 2)
      return;

    this.emulatedFightSync = fightNow;
    this.emulatedFightSyncLastOffset = this.emulatedTimeOffset;
    this.timebase = newTimebase;

    this.nextEvent = 0;
    this.nextText = 0;
    this.nextSyncStart = 0;
    this.nextSyncEnd = 0;

    // This will skip text events without running them.
    this._AdvanceTimeTo(fightNow);
    this._CollectActiveSyncs(fightNow);

    // Clear all timers except any synthetic duration events.
    // This is because if the sync goes even a hair into the future, then
    // the duration ending event will get dropped here.

    // FIXME: we could be smarter here and know ahead of time where all the duration
    // events are, so that we could skip ahead into the future where a duration
    // event has started but not expired and have that work properly.
    this._AddDurationTimers(fightNow);
    this._ClearExceptRunningDurationTimers(fightNow);

    this._AddUpcomingTimers(fightNow);
    this._CancelUpdate();
    this._ScheduleUpdate(fightNow);

    if (this.syncTimeCallback)
      this.syncTimeCallback(fightNow, true);
  }
}
