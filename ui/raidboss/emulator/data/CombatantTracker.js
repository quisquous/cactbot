import Combatant from './Combatant';
import CombatantJobSearch from './CombatantJobSearch';
import CombatantState from './CombatantState';
import { isLineEventJobLevel, isLineEventAbility, isLineEventSource, isLineEventTarget } from './network_log_converter/LineEvent';
import PetNamesByLang from '../../../../resources/pet_names';

export default class CombatantTracker {
  constructor(logLines, language) {
    this.language = language;
    this.firstTimestamp = Number.MAX_SAFE_INTEGER;
    this.lastTimestamp = 0;
    this.combatants = {};
    this.partyMembers = [];
    this.enemies = [];
    this.others = [];
    this.pets = [];
    this.mainCombatantID = null;
    this.initialStates = {};
    this.initialize(logLines);
    delete this.initialStates;
  }

  initialize(logLines) {
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
      const state = this.initialStates[id];
      this.combatants[id].pushState(this.firstTimestamp, new CombatantState(
          Number(state.posX),
          Number(state.posY),
          Number(state.posZ),
          Number(state.heading),
          state.targetable,
          Number(state.hp),
          Number(state.maxHp),
          Number(state.mp),
          Number(state.maxMp),
      ));
    }

    // Second pass: Analyze combatant information for tracking
    const eventTracker = {};
    for (let i = 0; i < logLines.length; ++i) {
      const line = logLines[i];
      let state = this.extractStateFromLine(line);
      if (state) {
        eventTracker[line.id] = eventTracker[line.id] || 0;
        ++eventTracker[line.id];
        this.combatants[line.id].pushPartialState(line.timestamp, state);
      }
      state = this.extractStateFromTargetLine(line);
      if (state) {
        eventTracker[line.targetId] = eventTracker[line.targetId] || 0;
        ++eventTracker[line.targetId];
        this.combatants[line.targetId].pushPartialState(line.timestamp, state);
      }
    }

    // Figure out party/enemy/other status
    const petNames = PetNamesByLang[this.language];
    this.others = this.others.filter((ID) => {
      if (this.combatants[ID].job !== null &&
        this.combatants[ID].job !== 'NONE' &&
        ID.startsWith('1')) {
        this.partyMembers.push(ID);
        return false;
      } else if (petNames.includes(this.combatants[ID].name)) {
        this.pets.push(ID);
        return false;
      } else if (eventTracker[ID] > 0) {
        this.enemies.push(ID);
        return false;
      }
      return true;
    });

    // Main combatant is the one that took the most actions
    this.mainCombatantID = this.enemies.sort((l, r) => {
      return eventTracker[r] - eventTracker[l];
    })[0] || null;
  }

  addCombatantFromLine(line) {
    if (!line.id)
      return;

    this.initCombatant(line.id, line.name, line.timestamp);
    const initState = this.initialStates[line.id];

    const extractedState = this.extractStateFromLine(line);

    initState.timestamp = Math.min(initState.timestamp, line.timestamp);
    initState.posX = initState.posX || extractedState.posX || null;
    initState.posY = initState.posY || extractedState.posY || null;
    initState.posZ = initState.posZ || extractedState.posZ || null;
    initState.heading = initState.heading || extractedState.heading || null;
    initState.targetable = initState.targetable || extractedState.targetable || false;
    initState.hp = initState.hp || extractedState.hp || null;
    initState.maxHp = initState.maxHp || extractedState.maxHp || null;
    initState.mp = initState.mp || extractedState.mp || null;
    initState.maxMp = initState.maxMp || extractedState.maxMp || null;

    if (isLineEventJobLevel(line)) {
      this.combatants[line.id].job = this.combatants[line.id].job || line.job;
      this.combatants[line.id].level = this.combatants[line.id].level || line.level;
    }

    if (isLineEventAbility(line)) {
      if (!this.combatants[line.id].job && !line.id.startsWith('4') && line.abilityId !== undefined)
        this.combatants[line.id].job = CombatantJobSearch.getJob(line.abilityId);
    }

    if (this.combatants[line.id].job)
      this.combatants[line.id].job = this.combatants[line.id].job.toUpperCase();
  }

  addCombatantFromTargetLine(line) {
    if (!line.targetId)
      return;

    this.initCombatant(line.targetId, line.targetName, line.timestamp);
    const initState = this.initialStates[line.targetId];

    const extractedState = this.extractStateFromTargetLine(line);

    initState.posX = initState.posX || extractedState.posX || null;
    initState.posY = initState.posY || extractedState.posY || null;
    initState.posZ = initState.posZ || extractedState.posZ || null;
    initState.heading = initState.heading || extractedState.heading || null;
    initState.hp = initState.hp || extractedState.hp || null;
    initState.maxHp = initState.maxHp || extractedState.maxHp || null;
    initState.mp = initState.mp || extractedState.mp || null;
    initState.maxMp = initState.maxMp || extractedState.maxMp || null;
  }

  extractStateFromLine(line) {
    if (!line.id)
      return false;

    const state = {};

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
      state.maxMP = line.maxMp;

    return state;
  }

  extractStateFromTargetLine(line) {
    if (!line.targetId)
      return false;

    const state = {};

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

  initCombatant(ID, name, timestamp) {
    if (this.combatants[ID] === undefined) {
      this.combatants[ID] = new Combatant(ID, name);
      this.others.push(ID);
      this.initialStates[ID] = {
        timestamp: timestamp,
        posX: null,
        posY: null,
        posZ: null,
        heading: null,
        targetable: true,
        hp: null,
        maxHp: null,
        mp: null,
        maxMp: null,
      };
    } else if (this.combatants[ID].name === '') {
      this.combatants[ID].name = name;
    }
  }

  getMainCombatantName() {
    if (this.mainCombatantID)
      return this.combatants[this.mainCombatantID].name;
    return 'Unknown';
  }
}
