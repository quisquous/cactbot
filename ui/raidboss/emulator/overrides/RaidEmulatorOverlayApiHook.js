import { callOverlayHandler, addOverlayListener, removeOverlayListener, setCallOverlayHandlerOverride } from '../../../../resources/overlay_plugin_api';

export default class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalCall = setCallOverlayHandlerOverride(this.call.bind(this)),
    this.timestampOffset = 0;

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
          if (msg.ids && msg.ids.includes(parseInt(id, 16)))
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
