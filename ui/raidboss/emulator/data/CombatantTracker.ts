import { Lang } from '../../../../resources/languages';
import PetNamesByLang from '../../../../resources/pet_names';

import Combatant from './Combatant';
import CombatantJobSearch from './CombatantJobSearch';
import CombatantState from './CombatantState';
import LineEvent, {
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

    // Figure out party/enemy/other status
    const petNames = PetNamesByLang[this.language];
    this.others = this.others.filter((ID) => {
      if (
        this.combatants[ID]?.job !== undefined &&
        this.combatants[ID]?.job !== 'NONE' &&
        ID.startsWith('1')
      ) {
        this.partyMembers.push(ID);
        return false;
      } else if (petNames.includes(this.combatants[ID]?.name ?? '')) {
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

    // Finalize combatants, cleaning up state information
    for (const combatant of Object.values(this.combatants))
      combatant.finalize();
  }

  addCombatantFromSourceLine(line: LineEventSource, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.id] ?? this.initCombatant(line.id, line.name);
    const initState: Partial<CombatantState> = combatant.states[this.firstTimestamp] ?? {};

    initState.posX = initState.posX ?? extractedState.posX;
    initState.posY = initState.posY ?? extractedState.posY;
    initState.posZ = initState.posZ ?? extractedState.posZ;
    initState.heading = initState.heading ?? extractedState.heading;
    initState.targetable = initState.targetable ?? extractedState.targetable;
    initState.hp = initState.hp ?? extractedState.hp;
    initState.maxHp = initState.maxHp ?? extractedState.maxHp;
    initState.mp = initState.mp ?? extractedState.mp;
    initState.maxMp = initState.maxMp ?? extractedState.maxMp;

    if (isLineEventJobLevel(line)) {
      combatant.job = this.combatants[line.id]?.job ?? line.job;
      combatant.level = this.combatants[line.id]?.level ?? line.level;
    }

    if (isLineEventAbility(line)) {
      if (!combatant.job && !line.id.startsWith('4') && line.abilityId !== undefined)
        combatant.job = CombatantJobSearch.getJob(line.abilityId);
    }

    if (!combatant.states[this.firstTimestamp]) {
      combatant.pushState(
        this.firstTimestamp,
        new CombatantState(
          Number(initState.posX),
          Number(initState.posY),
          Number(initState.posZ),
          Number(initState.heading),
          initState.targetable ?? true,
          Number(initState.hp),
          Number(initState.maxHp),
          Number(initState.mp),
          Number(initState.maxMp),
        ),
      );
    } else {
      combatant.pushPartialState(this.firstTimestamp, initState);
    }
  }

  addCombatantFromTargetLine(line: LineEventTarget, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.targetId] ??
      this.initCombatant(line.targetId, line.targetName);
    const initState: Partial<CombatantState> = combatant.states[this.firstTimestamp] ?? {};

    initState.posX = initState.posX ?? extractedState.posX;
    initState.posY = initState.posY ?? extractedState.posY;
    initState.posZ = initState.posZ ?? extractedState.posZ;
    initState.heading = initState.heading ?? extractedState.heading;
    initState.hp = initState.hp ?? extractedState.hp;
    initState.maxHp = initState.maxHp ?? extractedState.maxHp;
    initState.mp = initState.mp ?? extractedState.mp;
    initState.maxMp = initState.maxMp ?? extractedState.maxMp;
    initState.targetable = initState.targetable ?? extractedState.targetable ?? true;

    if (!combatant.states[this.firstTimestamp]) {
      combatant.pushState(
        this.firstTimestamp,
        new CombatantState(
          Number(initState.posX),
          Number(initState.posY),
          Number(initState.posZ),
          Number(initState.heading),
          initState.targetable ?? true,
          Number(initState.hp),
          Number(initState.maxHp),
          Number(initState.mp),
          Number(initState.maxMp),
        ),
      );
    } else {
      combatant.pushPartialState(this.firstTimestamp, initState);
    }
  }

  extractStateFromLine(line: LineEventSource): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.x !== undefined)
      state.posX = line.x;
    if (line.y !== undefined)
      state.posY = line.y;
    if (line.z !== undefined)
      state.posZ = line.z;
    if (line.heading !== undefined)
      state.heading = line.heading;
    if (line.targetable !== undefined)
      state.targetable = line.targetable;
    if (line.hp !== undefined)
      state.hp = line.hp;
    if (line.maxHp !== undefined)
      state.maxHp = line.maxHp;
    if (line.mp !== undefined)
      state.mp = line.mp;
    if (line.maxMp !== undefined)
      state.maxMp = line.maxMp;

    if (line.decEvent === 4)
      state.targetable = false;

    return state;
  }

  extractStateFromTargetLine(line: LineEventTarget): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.targetX !== undefined)
      state.posX = line.targetX;
    if (line.targetY !== undefined)
      state.posY = line.targetY;
    if (line.targetZ !== undefined)
      state.posZ = line.targetZ;
    if (line.targetHeading !== undefined)
      state.heading = line.targetHeading;
    if (line.targetHp !== undefined)
      state.hp = line.targetHp;
    if (line.targetMaxHp !== undefined)
      state.maxHp = line.targetMaxHp;
    if (line.targetMp !== undefined)
      state.mp = line.targetMp;
    if (line.targetMaxMp !== undefined)
      state.maxMp = line.targetMaxMp;

    return state;
  }

  initCombatant(id: string, name: string): Combatant {
    let combatant = this.combatants[id];
    if (combatant === undefined) {
      combatant = this.combatants[id] = new Combatant(id, name);
      this.others.push(id);
    } else if (combatant.name === '') {
      combatant.setName(name);
    }
    return combatant;
  }

  getMainCombatantName(): string {
    if (this.mainCombatantID)
      return this.combatants[this.mainCombatantID]?.name ?? 'Unknown';
    return 'Unknown';
  }
}
