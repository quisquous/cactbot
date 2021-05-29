import { callOverlayHandler, addOverlayListener, removeOverlayListener, setCallOverlayHandlerOverride } from '../../../../resources/overlay_plugin_api';

export default class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalCall = setCallOverlayHandlerOverride(this.call.bind(this));
    this.currentLogTime = 0;

    emulator.on('tick', (currentLogTime) => {
      this.currentLogTime = currentLogTime;
    });
    emulator.on('preSeek', (currentLogTime) => {
      this.currentLogTime = 0;
    });
    emulator.on('preCurrentEncounterChanged', (encounter) => {
      this.currentLogTime = 0;
      encounter.on('analyzeLine', (log) => {
        this.currentLogTime = log.timestamp;
      });
    });
  }

  call(msg) {
    if (msg.call === 'getCombatants') {
      const tracker = this.emulator.currentEncounter.encounter.combatantTracker;
      const timestamp = this.currentLogTime;
      return new Promise((res) => {
        const combatants = [];
        const hasIds = msg.ids !== undefined && msg.ids.length > 0;
        const hasNames = msg.names !== undefined && msg.names.length > 0;

        for (const [id, combatant] of Object.entries(tracker.combatants)) {
          // nextSignificantState is a bit inefficient but given that this isn't run every tick
          // we can afford to be a bit inefficient for readability's sake
          const combatantState = {
            ID: combatant.id,
            Name: combatant.name,
            Level: combatant.level,
            Job: combatant.job,
            ...combatant.nextSignificantState(timestamp).toPluginState(),
          };
          if (!hasIds && !hasNames)
            combatants.push(combatantState);
          else if (hasIds && msg.ids.includes(parseInt(id, 16)))
            combatants.push(combatantState);
          else if (hasNames && msg.names.includes(tracker.combatants[id].name))
            combatants.push(combatantState);
        }
        // @TODO: Move this to track properly on the Combatant object
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
