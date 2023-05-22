import { Lang } from '../../../../resources/languages';
import PetNamesByLang from '../../../../resources/pet_names';
import Util from '../../../../resources/util';

import Combatant from './Combatant';
import CombatantJobSearch from './CombatantJobSearch';
import CombatantState from './CombatantState';
import LineEvent, {
  isLineEvent0x03,
  isLineEventAbility,
  isLineEventJobLevel,
  isLineEventSource,
  isLineEventTarget,
  LineEventSource,
  LineEventTarget,
} from './network_log_converter/LineEvent';

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
    }

    // Finalize combatants, cleaning up state information
    for (const combatant of Object.values(this.combatants))
      combatant.finalize();

    // Figure out party/enemy/other status
    const petNames = PetNamesByLang[this.language];
    this.others = this.others.filter((ID) => {
      if (
        this.combatants[ID]?.nextSignificantState(0).Job !== undefined &&
        this.combatants[ID]?.nextSignificantState(0).Job !== 0 &&
        ID.startsWith('1')
      ) {
        this.partyMembers.push(ID);
        return false;
      } else if (petNames.includes(this.combatants[ID]?.nextSignificantState(0).Name ?? '')) {
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

  addCombatantFromSourceLine(line: LineEventSource, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.id] ?? this.initCombatant(line.id);

    let initState: CombatantState | undefined = combatant.states[this.firstTimestamp];

    if (!initState) {
      combatant.states[this.firstTimestamp] = initState = new CombatantState(extractedState, false);
    }

    combatant.states[this.firstTimestamp] =
      initState =
        new CombatantState({ ...extractedState, ...initState }, initState.targetable);

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

    if (line.name !== undefined)
      initState.setName(line.name);

    combatant.pushState(
      this.firstTimestamp,
      initState.fullClone(),
    );
  }

  addCombatantFromTargetLine(line: LineEventTarget, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.targetId] ??
      this.initCombatant(line.targetId);

    let initState: CombatantState | undefined = combatant.states[this.firstTimestamp];

    if (!initState) {
      combatant.states[this.firstTimestamp] = initState = new CombatantState(extractedState, false);
    }

    combatant.states[this.firstTimestamp] =
      initState =
        new CombatantState({ ...extractedState, ...initState }, initState.targetable);

    if (line.targetName !== undefined)
      initState.setName(line.targetName);

    combatant.pushState(
      this.firstTimestamp,
      initState.fullClone(),
    );
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
    const defualtName = 'Unknown';
    if (this.mainCombatantID) {
      // This gets called when persisting to indexedDB, after it has been returned from the worker
      // As such, prototypes aren't applied to combatants
      // so we can't use the shortcut for `nextSignificantState(0)`
      const combatantObject = this.combatants[this.mainCombatantID];
      if (!combatantObject)
        return defualtName;

      const state = Object.values(combatantObject.states)[0];
      if (!state)
        return defualtName;

      return state.Name ?? 'Unknown';
    }
    return defualtName;
  }
}
