class RaidEmulatorWebSocket {
  /**
   * @type {RaidEmulator}
   */
  emulator;

  originalDispatch;
  originalAdd;
  originalRemove;
  originalCall;

  timestampOffset = 0;

  constructor(emulator) {
    this.emulator = emulator;
    this.originalDispatch = window.dispatchOverlayEvent;
    this.originalAdd = window.addOverlayListener;
    this.originalRemove = window.removeOverlayListener;
    this.originalCall = window.callOverlayHandler;

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
        /**
         * @type {CombatantTracker}
         */
        let tracker = this.emulator.currentEncounter.encounter.combatantTracker;
        let timestamp = this.emulator.currentEncounter.encounter.startTimestamp + this.timestampOffset;
        for (let ID in tracker.combatants) {
          if (msg.ids && msg.ids.includes(ID)) {
            combatants.push(Combatant.prototype.NextSignificantState.apply(tracker.combatants[ID], [timestamp]));
          } else if (msg.names && msg.names.includes(tracker.combatants[ID].Name)) {
            combatants.push(Combatant.prototype.NextSignificantState.apply(tracker.combatants[ID], [timestamp]));
          }
        }
        res({
          combatants: combatants,
        });
      });
    } else {
      return this.originalCall(msg);
    }
  }
}