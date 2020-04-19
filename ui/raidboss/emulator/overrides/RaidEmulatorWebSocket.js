class RaidEmulatorWebSocket {
  /**
   * @type {RaidEmulator}
   */
  emulator;

  originalDispatch;
  originalAdd;
  originalRemove;
  originalCall;

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

    emulator.on('Tick', (timestamp) => {
      this.timestamp = timestamp;
    });
  }

  Dispatch(msg) {
    return this.originalDispatch(msg);
  }

  Add(event, cb) {
    return this.originalAdd(event, cb);
  }

  Remove(event, cb) {
    return this.originalRemove(event, cb);
  }

  Call(msg) {
    if(msg.call === 'getCombatants') {
      return new Promise((res) => {
        let combatants = [];
        /**
         * @type {CombatantTracker}
         */
        let tracker = this.emulator.currentEncounter.encounter.combatantTracker;
        tracker.combatants.forEach((c) => {
          if(msg.ids && msg.ids.includes(c.ID)) {
            combatants.push(c.NextSignificantState(this.timestamp));
          } else if(msg.names && msg.names.includes(c.Name)) {
            combatants.push(c.NextSignificantState(this.timestamp));
          }
        });
        res({
          combatants: combatants,
        });
      });
    } else {
      return this.originalCall(msg);
    }
  }
}