import { callOverlayHandler, addOverlayListener, removeOverlayListener, setOverride } from '../../../../resources/overlay_plugin_api';

export default class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalDispatch = window.dispatchOverlayEvent;
    this.originalAdd = addOverlayListener;
    this.originalRemove = removeOverlayListener;
    this.originalCall = callOverlayHandler;
    this.timestampOffset = 0;

    setOverride({
      addOverlayListenerOverride: this.add.bind(this),
      removeOverlayListenerOverride: this.remove.bind(this),
      callOverlayHandlerOverride: this.call.bind(this),
      dispatchOverlayEventOverride: this.add.bind(this),
    });

    emulator.on('tick', (timestampOffset) => {
      this.timestampOffset = timestampOffset;
    });
    emulator.on('preSeek', (timestampOffset) => {
      this.timestampOffset = 0;
    });
    emulator.on('preCurrentEncounterChanged', (encounter) => {
      this.timestampOffset = 0;
      encounter.on('analyzeLine', (log) => {
        this.timestampOffset = log.offset;
      });
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
      const tracker = this.emulator.currentEncounter.encounter.combatantTracker;
      const timestamp = this.emulator.currentEncounter.encounter.startTimestamp +
        this.timestampOffset;
      return new Promise((res) => {
        const combatants = [];

        for (const id in tracker.combatants) {
          const combatant = tracker.combatants[id];
          // nextSignificantState is a bit inefficient but given that this isn't run every tick
          // we can afford to be a bit inefficient for readability's sake
          const combatantState = combatant.nextSignificantState(timestamp).toPluginState();
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
