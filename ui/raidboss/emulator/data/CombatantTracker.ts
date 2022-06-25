import { Lang } from '../../../../resources/languages';
import PetNamesByLang from '../../../../resources/pet_names';

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

    if (combatant.states[this.firstTimestamp])
      return;

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

    if (isLineEvent0x03(line)) {
      if (line.npcBaseId !== undefined)
        combatant.npcBaseId = parseInt(line.npcBaseId);
      if (line.npcNameId !== undefined)
        combatant.npcNameId = parseInt(line.npcNameId);
      if (line.ownerId !== undefined)
        combatant.ownerId = parseInt(line.ownerId);
    }

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
  }

  addCombatantFromTargetLine(line: LineEventTarget, extractedState: Partial<CombatantState>): void {
    const combatant = this.combatants[line.targetId] ??
      this.initCombatant(line.targetId, line.targetName);

    if (combatant.states[this.firstTimestamp])
      return;

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
  }

  extractStateFromLine(line: LineEventSource): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.x !== undefined && !isNaN(line.x))
      state.posX = line.x;
    if (line.y !== undefined && !isNaN(line.y))
      state.posY = line.y;
    if (line.z !== undefined && !isNaN(line.z))
      state.posZ = line.z;
    if (line.heading !== undefined && !isNaN(line.heading))
      state.heading = line.heading;
    if (line.targetable !== undefined)
      state.targetable = line.targetable;
    if (line.hp !== undefined && !isNaN(line.hp))
      state.hp = line.hp;
    if (line.maxHp !== undefined && !isNaN(line.maxHp))
      state.maxHp = line.maxHp;
    if (line.mp !== undefined && !isNaN(line.mp))
      state.mp = line.mp;
    if (line.maxMp !== undefined && !isNaN(line.maxMp))
      state.maxMp = line.maxMp;

    if (line.decEvent === 4)
      state.targetable = false;

    return state;
  }

  extractStateFromTargetLine(line: LineEventTarget): Partial<CombatantState> {
    const state: Partial<CombatantState> = {};

    if (line.targetX !== undefined && !isNaN(line.targetX))
      state.posX = line.targetX;
    if (line.targetY !== undefined && !isNaN(line.targetY))
      state.posY = line.targetY;
    if (line.targetZ !== undefined && !isNaN(line.targetZ))
      state.posZ = line.targetZ;
    if (line.targetHeading !== undefined && !isNaN(line.targetHeading))
      state.heading = line.targetHeading;
    if (line.targetHp !== undefined && !isNaN(line.targetHp))
      state.hp = line.targetHp;
    if (line.targetMaxHp !== undefined && !isNaN(line.targetMaxHp))
      state.maxHp = line.targetMaxHp;
    if (line.targetMp !== undefined && !isNaN(line.targetMp))
      state.mp = line.targetMp;
    if (line.targetMaxMp !== undefined && !isNaN(line.targetMaxMp))
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
    if (this.mainCombatantID !== undefined)
      return this.combatants[this.mainCombatantID]?.name ?? 'Unknown';
    return 'Unknown';
  }
}
