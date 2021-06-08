import Combatant from './Combatant';
import CombatantJobSearch from './CombatantJobSearch';
import CombatantState from './CombatantState';
import PetNamesByLang from '../../../../resources/pet_names';
import LineEvent, { isLineEventJobLevel, isLineEventAbility, isLineEventSource, isLineEventTarget, LineEventSource, LineEventTarget } from './network_log_converter/LineEvent';
import { Lang } from 'resources/languages';

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
  initialStates: { [id: string]: Partial<CombatantState> } = {};
  constructor(logLines: LineEvent[], language: Lang) {
    this.language = language;
    this.firstTimestamp = Number.MAX_SAFE_INTEGER;
    this.lastTimestamp = 0;
    this.initialize(logLines);
    // Clear initialStates after we initialize, we don't need it anymore
    this.initialStates = {};
  }

  initialize(logLines: LineEvent[]): void {
    // First pass: Get list of combatants, figure out where they
    // start at if possible
    for (const line of logLines) {
      this.firstTimestamp = Math.min(this.firstTimestamp, line.timestamp);
      this.lastTimestamp = Math.max(this.lastTimestamp, line.timestamp);

      if (isLineEventSource(line))
        this.addCombatantFromLine(line);

      if (isLineEventTarget(line))
        this.addCombatantFromTargetLine(line);
    }

    // Between passes: Create our initial combatant states
    for (const id in this.initialStates) {
      const state = this.initialStates[id] ?? {};
      this.combatants[id]?.pushState(this.firstTimestamp, new CombatantState(
          Number(state.posX),
          Number(state.posY),
          Number(state.posZ),
          Number(state.heading),
          state.targetable ?? false,
          Number(state.hp),
          Number(state.maxHp),
          Number(state.mp),
          Number(state.maxMp),
      ));
    }

    // Second pass: Analyze combatant information for tracking
    const eventTracker: { [key: string]: number } = {};
    for (const line of logLines) {
      if (isLineEventSource(line)) {
        const state = this.extractStateFromLine(line);
        if (state) {
          eventTracker[line.id] = eventTracker[line.id] ?? 0;
          ++eventTracker[line.id];
          this.combatants[line.id]?.pushPartialState(line.timestamp, state);
        }
      }
      if (isLineEventTarget(line)) {
        const state = this.extractStateFromTargetLine(line);
        if (state) {
          eventTracker[line.targetId] = eventTracker[line.targetId] ?? 0;
          ++eventTracker[line.targetId];
          this.combatants[line.targetId]?.pushPartialState(line.timestamp, state);
        }
      }
    }

    // Figure out party/enemy/other status
    const petNames = PetNamesByLang[this.language];
    this.others = this.others.filter((ID) => {
      if (this.combatants[ID]?.job !== undefined &&
        this.combatants[ID]?.job !== 'NONE' &&
        ID.startsWith('1')) {
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
  }

  addCombatantFromLine(line: LineEventSource): void {
    const combatant = this.initCombatant(line.id, line.name);
    const initState = this.initialStates[line.id] ?? {};

    const extractedState = this.extractStateFromLine(line) ?? {};

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

    if (combatant.job)
      combatant.job = combatant.job.toUpperCase();
  }

  addCombatantFromTargetLine(line: LineEventTarget): void {
    this.initCombatant(line.targetId, line.targetName);
    const initState = this.initialStates[line.targetId] ?? {};

    const extractedState = this.extractStateFromTargetLine(line) ?? {};

    initState.posX = initState.posX ?? extractedState.posX;
    initState.posY = initState.posY ?? extractedState.posY;
    initState.posZ = initState.posZ ?? extractedState.posZ;
    initState.heading = initState.heading ?? extractedState.heading;
    initState.hp = initState.hp ?? extractedState.hp;
    initState.maxHp = initState.maxHp ?? extractedState.maxHp;
    initState.mp = initState.mp ?? extractedState.mp;
    initState.maxMp = initState.maxMp ?? extractedState.maxMp;
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
      this.initialStates[id] = {
        targetable: true,
      };
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
