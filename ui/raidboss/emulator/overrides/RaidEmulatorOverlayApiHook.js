import { callOverlayHandler, addOverlayListener, removeOverlayListener, setCallOverlayHandlerOverride } from '../../../../resources/overlay_plugin_api';

const cachedCactbotCalls = ['cactbotLoadUser', 'cactbotLoadData'];
const excludedReqProps = ['source'];
const excludedRespProps = ['rseq'];

const getKey = (msg) => {
  const clonedMsg = JSON.parse(JSON.stringify(msg));
  for (const prop of excludedReqProps)
    delete clonedMsg[prop];
  return JSON.stringify(clonedMsg);
};

const toCache = (data) => {
  const clonedData = JSON.parse(JSON.stringify(data));
  for (const prop of excludedRespProps)
    delete clonedData[prop];
  return clonedData;
};

export default class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalCall = setCallOverlayHandlerOverride(this.call.bind(this));
    this.currentLogTime = 0;
    this.connected = false;

    this.cachedData = JSON.parse(window.localStorage.getItem('raidEmulatorCachedCalls')) || {};

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

  async call(msg) {
    if (msg.call === 'getCombatants') {
      return await this._getCombatantsOverride(msg);
    } else if (cachedCactbotCalls.includes(msg.call)) {
      if (!this.connected) {
        if (this.hasCachedCactbotCall(msg))
          return await this._cactbotCachedCall(msg);
      } else {
        return await this._cacheCall(msg);
      }
    }

    return await this.originalCall(msg);
  }

  async _getCombatantsOverride(msg) {
    const tracker = this.emulator.currentEncounter.encounter.combatantTracker;
    const timestamp = this.currentLogTime;

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
        c.OwnerID = parseInt(lines[0].ownerId);
        c.BNpcNameID = parseInt(lines[0].npcNameId);
        c.BNpcID = parseInt(lines[0].npcBaseId);
      }
    });
    return {
      combatants: combatants,
    };
  }

  async _cacheCall(msg) {
    const key = getKey(msg);
    return new Promise((res) => {
      this.originalCall(msg).then((data) => {
        this.cachedData[key] = toCache(data);
        window.localStorage.setItem('raidEmulatorCachedCalls', JSON.stringify(this.cachedData));
        res(data);
      });
    });
  }

  hasCachedCactbotCall(msg) {
    const key = getKey(msg);
    return key in this.cachedData;
  }

  async _cactbotCachedCall(msg) {
    const key = getKey(msg);
    return this.cachedData[key];
  }
}
