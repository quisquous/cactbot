class RaidEmulatorWebSocket {
  /**
   * @type {RaidEmulator}
   */
  emulator;

  originalDispatch;
  originalAdd;
  originalRemove;
  originalCall;

  timestampOffset;

  constructor(emulator) {
    this.emulator = emulator;
    this.originalDispatch = window.dispatchOverlayEvent;
    this.originalAdd = window.addOverlayListener;
    this.originalRemove = window.removeOverlayListener;
    this.originalCall = window.callOverlayHandler;

    window.dispatchOverlayEvent = this.Dispatch.bind(this);
    window.addOverlayListener = this.Add.bind(this);
    window.removeOverlayListener = this.Remove.bind(this);
    window.callOverlayHandler = this.Call.bind(this);

    emulator.on('tick', (timestampOffset) => {
      this.timestampOffset = timestampOffset;
    });
  }

  dispatch(msg) {
    return this.originaldispatch(msg);
  }

  Add(event, cb) {
    return this.originalAdd(event, cb);
  }

  Remove(event, cb) {
    return this.originalRemove(event, cb);
  }

  Call(msg) {
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