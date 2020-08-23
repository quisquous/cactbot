'use strict';

class CombatantTracker {
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
    let keyedLogLines = {};
    // First pass: Get list of combatants, figure out where they
    // start at if possible, build our keyed log lines
    for (let i = 0; i < logLines.length; ++i) {
      const line = logLines[i];
      this.firstTimestamp = Math.min(this.firstTimestamp, line.timestamp);
      this.lastTimestamp = Math.max(this.lastTimestamp, line.timestamp);

      keyedLogLines[line.timestamp + '_' + i] = line;

      switch (line.hexEvent) {
      // Source/target events
      case '14':
      case '15':
      case '16':
      case '19':
      case '1A':
      case '1D':
      case '1E':
      case '22':
      case '23':
        this.addCombatantFromLine(line);
        this.addCombatantFromTargetLine(line);
        break;

      default:
        this.addCombatantFromLine(line);
        break;
      }
    }

    let sortedTimestamps = Object.keys(keyedLogLines).sort();

    // Between passes: Create our initial combatant states
    for (let id in this.initialStates) {
      let state = this.initialStates[id];
      this.combatants[id].pushState(this.firstTimestamp, new CombatantState(
          Number(state.posX),
          Number(state.posY),
          Number(state.posZ),
          Number(state.heading),
          state.targetable,
          Number(state.HP),
          Number(state.maxHP),
          Number(state.MP),
          Number(state.maxMP),
      ));
    }

    // Second pass: Analyze combatant information for tracking
    let eventTracker = {};
    for (let i = 0; i < sortedTimestamps.length; ++i) {
      let line = keyedLogLines[sortedTimestamps[i]];
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
    let petNames = PetNamesByLang[this.language];
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
    let initState = this.initialStates[line.id];

    let extractedState = this.extractStateFromLine(line);

    initState.timestamp = Math.min(initState.timestamp, line.timestamp);
    initState.posX = initState.posX || extractedState.posX || null;
    initState.posY = initState.posY || extractedState.posY || null;
    initState.posZ = initState.posZ || extractedState.posZ || null;
    initState.heading = initState.heading || extractedState.heading || null;
    initState.targetable = initState.targetable || extractedState.targetable || false;
    initState.HP = initState.HP || extractedState.HP || null;
    initState.maxHP = initState.maxHP || extractedState.maxHP || null;
    initState.MP = initState.MP || extractedState.MP || null;
    initState.maxMP = initState.maxMP || extractedState.maxMP || null;

    this.combatants[line.id].job = this.combatants[line.id].job || extractedState.job || null;
    this.combatants[line.id].level = this.combatants[line.id].level || extractedState.level || null;

    if (line.abilityId && !this.combatants[line.id].job && !line.id.startsWith('4'))
      this.combatants[line.id].job = CombatantJobSearch.getJob(line.abilityId);

    if (this.combatants[line.id].job)
      this.combatants[line.id].job = this.combatants[line.id].job.toUpperCase();
  }

  addCombatantFromTargetLine(line) {
    if (!line.targetId)
      return;

    this.initCombatant(line.targetId, line.targetName, line.timestamp);
    let initState = this.initialStates[line.targetId];

    let extractedState = this.extractStateFromTargetLine(line);

    initState.posX = initState.posX || extractedState.posX || null;
    initState.posY = initState.posY || extractedState.posY || null;
    initState.posZ = initState.posZ || extractedState.posZ || null;
    initState.heading = initState.heading || extractedState.heading || null;
    initState.HP = initState.HP || extractedState.HP || null;
    initState.maxHP = initState.maxHP || extractedState.maxHP || null;
    initState.MP = initState.MP || extractedState.MP || null;
    initState.maxMP = initState.maxMP || extractedState.maxMP || null;
  }

  extractStateFromLine(line) {
    if (!line.id)
      return false;

    let state = {};

    if (line.x !== undefined) state.posX = line.x;
    if (line.y !== undefined) state.posY = line.y;
    if (line.z !== undefined) state.posZ = line.z;
    if (line.heading !== undefined) state.heading = line.heading;
    if (line.targetable !== undefined) state.targetable = line.targetable;
    if (line.hp !== undefined) state.HP = line.hp;
    if (line.maxHp !== undefined) state.maxHP = line.maxHp;
    if (line.mp !== undefined) state.MP = line.mp;
    if (line.maxMp !== undefined) state.maxMP = line.maxMp;
    if (line.jobName !== undefined) state.job = line.jobName;
    if (line.level !== undefined) state.level = line.level;

    return state;
  }

  extractStateFromTargetLine(line) {
    if (!line.targetId)
      return false;

    let state = {};

    if (line.targetX !== undefined) state.posX = line.targetX;
    if (line.targetY !== undefined) state.posY = line.targetY;
    if (line.targetZ !== undefined) state.posZ = line.targetZ;
    if (line.targetHeading !== undefined) state.heading = line.targetHeading;
    if (line.targetHp !== undefined) state.HP = line.targetHp;
    if (line.targetMaxHp !== undefined) state.maxHP = line.targetMaxHp;
    if (line.targetMp !== undefined) state.MP = line.targetMp;
    if (line.targetMaxMp !== undefined) state.maxMP = line.targetMaxMp;

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
        HP: null,
        maxHP: null,
        MP: null,
        maxMP: null,
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
