import { Lang } from '../../../../resources/languages';
import PetNamesByLang from '../../../../resources/pet_names';
import Util from '../../../../resources/util';

import Combatant from './Combatant';
import CombatantJobSearch from './CombatantJobSearch';
import CombatantState from './CombatantState';
import LineEvent, {
  isLineEvent0x03,
  isLineEvent0x105,
  isLineEventAbility,
  isLineEventJobLevel,
  isLineEventSource,
  isLineEventTarget,
  LineEventSource,
  LineEventTarget,
} from './network_log_converter/LineEvent';
import { LineEvent0x105 } from './network_log_converter/LineEvent0x105';

export default class CombatantTracker {
  language: Lang;
  firstTimestamp: number;
  lastTimestamp: number;
  combatants: { [id: string]: Combatant } = {};
  partyMembers: string[] = [];
  enemies: string[] = [];
  others: string[] = [];
  pets: string[] = [];
  mainCombatantID?: string;
  constructor(logLines: LineEvent[], language: Lang) {
    this.language = language;
    this.firstTimestamp = Number.MAX_SAFE_INTEGER;
    this.lastTimestamp = 0;
    this.initialize(logLines);
  }

  initialize(logLines: LineEvent[]): void {
    this.firstTimestamp = logLines[0]?.timestamp ?? 0;
    this.lastTimestamp = logLines.slice(-1)[0]?.timestamp ?? 0;

    const eventTracker: { [key: string]: number } = {};

    for (const line of logLines) {
      if (isLineEventSource(line)) {
        const state = this.extractStateFromLine(line);

        this.addCombatantFromSourceLine(line, state);
        eventTracker[line.id] = eventTracker[line.id] ?? 0;
        ++eventTracker[line.id];
        this.combatants[line.id]?.pushPartialState(line.timestamp, state);
      }

      if (isLineEventTarget(line)) {
        const state = this.extractStateFromTargetLine(line);

        this.addCombatantFromTargetLine(line, state);
        eventTracker[line.targetId] = eventTracker[line.targetId] ?? 0;
        ++eventTracker[line.targetId];
        this.combatants[line.targetId]?.pushPartialState(line.timestamp, state);
      }

      if (isLineEvent0x105(line)) {
        this.addCombatantFromCombatantMemoryLine(line);
        eventTracker[line.idHex] = eventTracker[line.idHex] ?? 0;
        ++eventTracker[line.idHex];
        this.combatants[line.idHex]?.pushPartialState(line.timestamp, line.state);
      }
    }

    // Finalize combatants, cleaning up state information
    for (const combatant of Object.values(this.combatants))
      combatant.finalize();

    // Figure out party/enemy/other status
    const petNames = PetNamesByLang[this.language];
    this.others = this.others.filter((ID) => {
      if (
        this.combatants[ID]?.nextState(0).Job !== undefined &&
        this.combatants[ID]?.nextState(0).Job !== 0 &&
        ID.startsWith('1')
      ) {
        this.partyMembers.push(ID);
        return false;
      } else if (petNames.includes(this.combatants[ID]?.nextState(0).Name ?? '')) {
        this.pets.push(ID);
        return false;
      } else if ((eventTracker[ID] ?? 0) > 0) {
        this.enemies.push(ID);
        return false;
      }
      return true;
    });

    // Main combatant is the one that took the most actions
    this.mainCombatantID = this.enemies.sort((l, r) => {
      return (eventTracker[r] ?? 0) - (eventTracker[l] ?? 0);
    })[0];
  }

  addCombatantFromCombatantMemoryLine(line: LineEvent0x105): void {
    if (this.combatants[line.idHex] === undefined)
      this.initCombatant(line.idHex);
  }

  addCombatantFromSourceLine(line: LineEventSource, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.id] ?? this.initCombatant(line.id);

    let initState: Partial<CombatantState> | undefined = combatant.getTempState(
      this.firstTimestamp,
    );

    const newState = new CombatantState(extractedState, initState?.targetable ?? false);

    if (line.name !== undefined)
      newState.setName(line.name);

    initState = combatant.pushPartialState(this.firstTimestamp, newState);

    if (isLineEventJobLevel(line)) {
      initState.Job ??= Util.jobToJobEnum(line.job);
      initState.Level ??= line.level;
    }

    if (isLineEventAbility(line)) {
      if (initState.Job === undefined && !line.id.startsWith('4') && line.abilityId !== undefined) {
        const foundJob = CombatantJobSearch.getJob(line.abilityId);
        if (foundJob)
          initState.Job = Util.jobToJobEnum(foundJob);
      }
    }

    if (isLineEvent0x03(line)) {
      if (line.npcBaseId !== undefined)
        initState.BNpcID = parseInt(line.npcBaseId);
      if (line.npcNameId !== undefined)
        initState.BNpcNameID = parseInt(line.npcNameId);
      if (line.ownerId !== undefined)
        initState.OwnerID = parseInt(line.ownerId);
    }
  }

  addCombatantFromTargetLine(line: LineEventTarget, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.targetId] ??
      this.initCombatant(line.targetId);

    let initState: Partial<CombatantState> | undefined = combatant.getTempState(
      this.firstTimestamp,
    );

    const newState = new CombatantState(extractedState, initState?.targetable ?? false);

    if (line.targetName !== undefined)
      newState.setName(line.targetName);

    initState = combatant.pushPartialState(this.firstTimestamp, newState);
  }

  extractStateFromLine(line: LineEventSource): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.id !== undefined)
      state.ID = parseInt(line.id, 16);
    if (line.x !== undefined && !isNaN(line.x))
      state.PosX = line.x;
    if (line.y !== undefined && !isNaN(line.y))
      state.PosY = line.y;
    if (line.z !== undefined && !isNaN(line.z))
      state.PosZ = line.z;
    if (line.heading !== undefined && !isNaN(line.heading))
      state.Heading = line.heading;
    if (line.targetable !== undefined)
      state.targetable = line.targetable;
    if (line.hp !== undefined && !isNaN(line.hp))
      state.CurrentHP = line.hp;
    if (line.maxHp !== undefined && !isNaN(line.maxHp))
      state.MaxHP = line.maxHp;
    if (line.mp !== undefined && !isNaN(line.mp))
      state.CurrentMP = line.mp;
    if (line.maxMp !== undefined && !isNaN(line.maxMp))
      state.MaxMP = line.maxMp;

    if (line.decEvent === 4)
      state.targetable = false;

    return state;
  }

  extractStateFromTargetLine(line: LineEventTarget): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.targetId !== undefined)
      state.ID = parseInt(line.targetId, 16);
    if (line.targetX !== undefined && !isNaN(line.targetX))
      state.PosX = line.targetX;
    if (line.targetY !== undefined && !isNaN(line.targetY))
      state.PosY = line.targetY;
    if (line.targetZ !== undefined && !isNaN(line.targetZ))
      state.PosZ = line.targetZ;
    if (line.targetHeading !== undefined && !isNaN(line.targetHeading))
      state.Heading = line.targetHeading;
    if (line.targetHp !== undefined && !isNaN(line.targetHp))
      state.CurrentHP = line.targetHp;
    if (line.targetMaxHp !== undefined && !isNaN(line.targetMaxHp))
      state.MaxHP = line.targetMaxHp;
    if (line.targetMp !== undefined && !isNaN(line.targetMp))
      state.CurrentMP = line.targetMp;
    if (line.targetMaxMp !== undefined && !isNaN(line.targetMaxMp))
      state.MaxMP = line.targetMaxMp;

    return state;
  }

  initCombatant(id: string): Combatant {
    let combatant = this.combatants[id];
    if (combatant === undefined) {
      combatant = this.combatants[id] = new Combatant();
      this.others.push(id);
    }
    return combatant;
  }

  getMainCombatantName(): string {
    const defaultName = 'Unknown';
    if (this.mainCombatantID !== undefined) {
      // This gets called when persisting to indexedDB, after it has been returned from the worker
      // As such, prototypes aren't applied to combatants
      // Re-apply the prototype if needed
      const combatantObject = this.combatants[this.mainCombatantID];
      if (!combatantObject)
        return defaultName;

      if (Object.getPrototypeOf(combatantObject) !== Combatant.prototype)
        Object.setPrototypeOf(combatantObject, Combatant.prototype);

      return combatantObject.firstState.Name ?? defaultName;
    }
    return defaultName;
  }
}
