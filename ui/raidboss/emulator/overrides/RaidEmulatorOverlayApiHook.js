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
          combatantState.ID = combatant.id;
          combatantState.Name = combatant.name;
          combatantState.Level = combatant.level;
          combatantState.Job = combatant.job;
          if ((msg.ids && msg.ids.length) || (msg.names && msg.names.length)) {
            if (msg.ids && msg.ids.includes(parseInt(id, 16)))
              combatants.push(combatantState);
            else if (msg.names && msg.names.includes(tracker.combatants[id].name))
              combatants.push(combatantState);
          } else {
            combatants.push(combatantState);
          }
        }
        // @TODO: Move this to track properly
        combatants.forEach((c) => {
          const lines = this.emulator.currentEncounter.encounter.logLines
            .filter((l) => l.decEvent === 3 && l.id === c.ID);
          if (lines.length > 0) {
            c.OwnerID = parseInt(lines[0].parts[6]);
            c.BNpcNameID = parseInt(lines[0].parts[9]);
            c.BNpcID = parseInt(lines[0].parts[10]);
          }
        });
        res({
          combatants: combatants,
        });
      });
    }
    return this.originalCall(msg);
  }
}
