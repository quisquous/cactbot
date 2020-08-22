'use strict';

class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalDispatch = window.dispatchOverlayEvent;
    this.originalAdd = window.addOverlayListener;
    this.originalRemove = window.removeOverlayListener;
    this.originalCall = window.callOverlayHandler;
    this.timestampOffset = 0;

    window.dispatchOverlayEvent = this.dispatch.bind(this);
    window.addOverlayListener = this.add.bind(this);
    window.removeOverlayListener = this.remove.bind(this);
    window.callOverlayHandler = this.call.bind(this);

    emulator.on('tick', (timestampOffset) => {
      this.timestampOffset = timestampOffset;
    });
    emulator.on('preSeek currentEncounterChanged', (timestampOffset) => {
      this.timestampOffset = 0;
    });
  }

  dispatch(msg) {
    return this.originalDispatch(msg);
  }

  add(event, cb) {
    return this.originalAdd(event, cb);
  }

  remove(event, cb) {
    return this.originalRemove(event, cb);
  }

  call(msg) {
    if (msg.call === 'getCombatants') {
      return new Promise((res) => {
        let combatants = [];
        let tracker = this.emulator.currentEncounter.encounter.combatantTracker;
        let timestamp = this.emulator.currentEncounter.encounter.startTimestamp +
          this.timestampOffset;

        for (let id in tracker.combatants) {
          let combatant = tracker.combatants[id];
          // nextSignificantState is a bit inefficient but given that this isn't run every tick
          // we can afford to be a bit inefficient for readability's sake
          let combatantState = combatant.nextSignificantState(timestamp);
          if (msg.ids && msg.ids.includes(id))
            combatants.push(combatantState);
          else if (msg.names && msg.names.includes(tracker.combatants[id].name))
            combatants.push(combatantState);
        }
        res({
          combatants: combatants,
        });
      });
    }
    return this.originalCall(msg);
  }
}
