import { setOverlayHandlerOverride } from '../../../../resources/overlay_plugin_api';
import { OverlayHandlerRequests, OverlayHandlerResponses, PluginCombatantState } from '../../../../types/event';
import AnalyzedEncounter from '../data/AnalyzedEncounter';
import LineEvent, { isLineEventSource } from '../data/network_log_converter/LineEvent';
import { LineEvent0x03 } from '../data/network_log_converter/LineEvent0x03';
import RaidEmulator from '../data/RaidEmulator';

export default class RaidEmulatorOverlayApiHook {
  currentLogTime = 0;
  connected = false;
  constructor(private emulator: RaidEmulator) {
    setOverlayHandlerOverride('getCombatants', this._getCombatantsOverride.bind(this));

    emulator.on('tick', (currentLogTime: number) => {
      this.currentLogTime = currentLogTime;
    });
    emulator.on('preSeek', () => {
      this.currentLogTime = 0;
    });
    emulator.on('preCurrentEncounterChanged', (encounter: AnalyzedEncounter) => {
      this.currentLogTime = 0;
      encounter.on('analyzeLine', (log: LineEvent) => {
        this.currentLogTime = log.timestamp;
      });
    });
  }

  _getCombatantsOverride(
      msg: OverlayHandlerRequests['getCombatants'],
  ): OverlayHandlerResponses['getCombatants'] {
    return new Promise<{ combatants: PluginCombatantState[] }>((res) => {
      const curEnc = this.emulator.currentEncounter;
      const tracker = curEnc?.encounter.combatantTracker;
      if (!curEnc || !tracker) {
        res({ combatants: [] });
        return;
      }
      const timestamp = this.currentLogTime;

      const combatants: PluginCombatantState[] = [];
      const ids = msg.ids ?? [];
      const names = msg.names ?? [];
      const hasIds = ids.length > 0;
      const hasNames = names.length > 0;

      for (const [id, combatant] of Object.entries(tracker.combatants)) {
        // If this combatant didn't exist at this point, skip them
        const firstStateStamp = combatant.significantStates[0];
        const lastStateStamp = combatant.significantStates.slice(-1)[0];
        if (!firstStateStamp || !lastStateStamp)
          continue;
        if (firstStateStamp > timestamp || lastStateStamp < timestamp)
          continue;

        const idNum = parseInt(id, 16);
        // nextSignificantState is a bit inefficient but given that this isn't run every tick
        // we can afford to be a bit inefficient for readability's sake
        const combatantState = {
          ID: idNum,
          Name: combatant.name,
          Level: combatant.level,
          Job: combatant.jobId,
          ...combatant.nextSignificantState(timestamp).toPluginState(),
        };
        if (!hasIds && !hasNames)
          combatants.push(combatantState);
        else if (hasIds && ids.includes(idNum))
          combatants.push(combatantState);
        else if (hasNames && names.includes(combatant.name))
          combatants.push(combatantState);
      }
      // @TODO: Move this to track properly on the Combatant object
      combatants.forEach((c) => {
        const lines = curEnc.encounter.logLines
          .filter((l) => l.decEvent === 3 && isLineEventSource(l) && parseInt(l.id, 16) === c.ID);
        const baseLine = lines[0];
        if (baseLine) {
          const line = baseLine as LineEvent0x03;
          c.OwnerID = parseInt(line.ownerId);
          c.BNpcNameID = parseInt(line.npcNameId);
          c.BNpcID = parseInt(line.npcBaseId);
        }
      });
      res({
        combatants: combatants,
      });
    });
  }
}
