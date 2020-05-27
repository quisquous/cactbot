'use strict';

class CombatantTracker {
  constructor(encounterDay, logLines, language) {
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
    this.initialize(encounterDay, logLines);
    delete this.initialStates;
  }

  initialize(encounterDay, logLines) {
    let keyedLogLines = {};
    let allTimestamps = [];
    // First pass: Get list of combatants, figure out where they
    // start at if possible, build our keyed log lines
    for (let i = 0; i < logLines.length; ++i) {
      let logLine = logLines[i];
      let rawLine = logLine.line;
      let line = EmulatorCommon.logLineRegex.exec(rawLine);
      let lineTimestamp = new Date(encounterDay + ' ' + line[1]).getTime();

      // Probably not the best way to fix the midnight wraparound bug, but it should work
      if (this.firstTimestamp !== Number.MAX_SAFE_INTEGER) {
        if (lineTimestamp < this.firstTimestamp &&
            this.firstTimestamp - lineTimestamp > 1000 * 60 * 60 * 12)
          lineTimestamp = lineTimestamp + 1000 * 60 * 60 * 24;
      }

      let lineEvent = line[2];
      let eventParts = line[3].split(':');
      if (!allTimestamps.includes(lineTimestamp))
        allTimestamps.push(lineTimestamp);

      this.firstTimestamp = Math.min(this.firstTimestamp, lineTimestamp);
      this.lastTimestamp = Math.max(this.lastTimestamp, lineTimestamp);

      keyedLogLines[lineTimestamp + '_' + i] = rawLine;

      switch (lineEvent) {
      case '03':
        this.addCombatantFromAddCombatant(lineTimestamp, lineEvent, rawLine);
        break;
      case '04':
      {
        let m = Regexes.removingCombatant({
          capture: true,
        }).exec(rawLine);
        if (m !== null) {
          this.addCombatant(lineTimestamp,
              m.groups.id, m.groups.name,
              lineEvent);
        }
        break;
      }
      case '15':
      case '16':
        this.addCombatantsFromAbility(lineTimestamp, lineEvent, rawLine);
        break;
      case '1A':
      case '1B':
      case '1E':
        // @TODO: Is this split/slice/join correct?
        this.addCombatant(lineTimestamp,
            eventParts[0], eventParts[1].split(' ').slice(0, 2).join(' '),
            lineEvent);
        break;
      case '22':
      case '23':
        this.addCombatant(lineTimestamp,
            eventParts[0], eventParts[1],
            lineEvent);
        this.addCombatant(lineTimestamp,
            eventParts[2], eventParts[3],
            lineEvent);
        break;
      case '26':
        this.addCombatantFromNetworkStatus(lineTimestamp,
            eventParts[0], eventParts[1],
            lineEvent, rawLine);
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
          state.visible,
          Number(state.HP),
          Number(state.maxHP),
          Number(state.MP),
          Number(state.maxMP),
      ));
    }

    // Second pass: Analyze combatant information for tracking
    let eventTracker = {};
    for (let i = 0; i < sortedTimestamps.length; ++i) {
      let line = EmulatorCommon.logLineRegex.exec(keyedLogLines[sortedTimestamps[i]]);
      let timestamp = new Date(encounterDay + ' ' + line[1]).getTime();
      let event = line[2];
      if (EmulatorCommon.eventDetailsRegexes[event] !== undefined) {
        let eventParts =
          EmulatorCommon.eventDetailsRegexes[event].exec(keyedLogLines[sortedTimestamps[i]]);
        if (eventParts !== null) {
          if (event === '15' || event === '16') {
            let sourceId = eventParts.groups.sourceId;
            let targetId = eventParts.groups.targetId;
            eventTracker[sourceId] = eventTracker[sourceId] || 0;
            ++eventTracker[sourceId];
            let state = this.extractStateFromAbility(timestamp, sourceId, event, line, eventParts);

            if (state !== null) {
              if (eventParts.groups.source !== '')
                this.combatants[sourceId].setName(eventParts.groups.source);
              this.combatants[sourceId].pushPartialState(timestamp, state);
            }
            state = this.extractStateFromAbility(timestamp, targetId, event, line, eventParts);

            if (state !== null) {
              if (eventParts.groups.target !== '')
                this.combatants[targetId].setName(eventParts.groups.target);
              this.combatants[targetId].pushPartialState(timestamp, state);
            }
          } else if (event === '26') {
            let targetId = eventParts.groups.targetId;
            let state = this.extractStateFromNetworkStatus(timestamp, targetId,
                event, line, eventParts);

            if (state !== null) {
              if (eventParts.groups.target !== '')
                this.combatants[targetId].setName(eventParts.groups.target);
              this.combatants[targetId].pushPartialState(timestamp, state);
            }
          } else if (event === '03' || event === '04') {
            let ID = eventParts.groups.id;
            let state = this.extractStateFromAddRemove(timestamp, ID, event, line, eventParts);

            if (state !== null) {
              if (eventParts.groups.name !== '')
                this.combatants[ID].setName(eventParts.groups.name);
              this.combatants[ID].pushPartialState(timestamp, state);
            }
          }
          continue;
        }
      }
    }

    // Figure out party/enemy/other status
    let petNames = EmulatorCommon.cactbotLanguages[this.language].kPetNames;
    this.others = this.others.filter((ID) => {
      if (this.combatants[ID].job !== null || ID.startsWith('1')) {
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

  addCombatantFromAddCombatant(timestamp, event, line) {
    let eventParts = EmulatorCommon.eventDetailsRegexes[event].exec(line);

    if (eventParts === null)
      return;

    let ID = eventParts.groups.id;
    let name = eventParts.groups.name;

    this.initCombatant(ID, name, timestamp);

    if (eventParts.groups.job !== 'N/A' && this.combatants[ID].job === null && !ID.startsWith('4'))
      this.combatants[ID].job = eventParts.groups.job.toUpperCase();
    if (this.combatants[ID].level === null && eventParts.groups.level > 0)
      this.combatants[ID].level = eventParts.groups.level;

    let state = this.extractStateFromAddRemove(timestamp, ID, event, line, eventParts);
    if (state !== null)
      this.addCombatant(timestamp, ID, name, event, state);
  }

  extractStateFromAddRemove(timestamp, ID, event, line, eventParts = null) {
    eventParts = eventParts || EmulatorCommon.eventDetailsRegexes[event].exec(line);
    if (eventParts === null)
      return null;

    if (eventParts.groups.sourceId === ID && this.combatants[ID].job === null && !ID.startsWith('4'))
      this.combatants[ID].job = CombatantJobSearch.GetJob(eventParts.groups.abilityID);

    return {
      timestamp: timestamp,
      HP: eventParts.groups.hp,
      maxHP: eventParts.groups.hp,
      posX: eventParts.groups.x,
      posY: eventParts.groups.y,
      posZ: eventParts.groups.z,
    };
  }

  extractStateFromAbility(timestamp, ID, event, line, eventParts = null) {
    eventParts = eventParts || EmulatorCommon.eventDetailsRegexes[event].exec(line);
    if (eventParts === null)
      return null;

    if (eventParts.groups.sourceId === ID && this.combatants[ID].job === null && !ID.startsWith('4'))
      this.combatants[ID].job = CombatantJobSearch.GetJob(eventParts.groups.abilityID);

    let state = {
      timestamp: timestamp,
    };

    if (eventParts.groups.sourceId === ID) {
      state.HP = eventParts.groups.hp;
      state.maxHP = eventParts.groups.maxHp;
      state.MP = eventParts.groups.mp;
      state.maxMP = eventParts.groups.maxMp;
      state.posX = eventParts.groups.x;
      state.posY = eventParts.groups.y;
      state.posZ = eventParts.groups.z;
      state.heading = eventParts.groups.heading;
    } else {
      state.HP = eventParts.groups.targetHp;
      state.maxHP = eventParts.groups.targetMaxHp;
      state.MP = eventParts.groups.targetMp;
      state.maxMP = eventParts.groups.targetMaxMp;
      state.posX = eventParts.groups.targetX;
      state.posY = eventParts.groups.targetY;
      state.posZ = eventParts.groups.targetZ;
      state.heading = eventParts.groups.targetHeading;
    }

    return state;
  }

  addCombatantsFromAbility(timestamp, event, line) {
    let eventParts = EmulatorCommon.eventDetailsRegexes[event].exec(line);
    if (eventParts === null)
      return;

    this.addCombatantFromAbility(timestamp,
        eventParts.groups.sourceId, eventParts.groups.source,
        event, line, eventParts);

    if (eventParts.targetId !== 'E0000000') {
      this.addCombatantFromAbility(timestamp,
          eventParts.groups.targetId, eventParts.groups.target,
          event, line, eventParts);
    }
  }

  addCombatantFromAbility(timestamp, ID, name, event, line, eventParts) {
    this.initCombatant(ID, name, timestamp);

    let state = this.extractStateFromAbility(timestamp, ID, event, line, eventParts);
    if (state !== null)
      this.addCombatant(timestamp, ID, name, event, state);
  }

  extractStateFromNetworkStatus(timestamp, ID, event, line, eventParts = null) {
    eventParts = eventParts || EmulatorCommon.eventDetailsRegexes[event].exec(line);
    if (this.combatants[ID].job === null && !ID.startsWith('4'))
      this.combatants[ID].job = Util.jobEnumToJob(parseInt(eventParts.groups.job, 16));

    return {
      timestamp: timestamp,
      HP: eventParts.hp,
      maxHP: eventParts.maxHp,
      MP: eventParts.mp,
      maxMP: eventParts.maxMp,
      posX: eventParts.x,
      posY: eventParts.y,
      posZ: eventParts.z,
      heading: eventParts.heading,
    };
  }

  addCombatantFromNetworkStatus(timestamp, ID, name, event, line) {
    this.initCombatant(ID, name, timestamp);
    let state = this.extractStateFromNetworkStatus(timestamp, ID, event, line);
    if (state !== null)
      this.addCombatant(timestamp, ID, name, event, state);
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
        visible: null,
        HP: null,
        maxHP: null,
        MP: null,
        maxMP: null,
      };
    } else if (this.combatants[ID].name === '') {
      this.combatants[ID].name = name;
    }
  }

  addCombatant(timestamp, ID, name, event, state = {}) {
    this.initCombatant(ID, name, timestamp);

    let initState = this.initialStates[ID];
    for (let prop in state) {
      if (initState.timestamp >= timestamp || initState[prop] === undefined)
        initState[prop] = state[prop];
    }

    if (initState.timestamp <= timestamp || initState.visible === undefined)
      initState.visible = initState.visible || event !== '03';
  }

  UpdateCombatantState(timestamp, Event, Prefix) {
    if (Event.groups[Prefix + 'id'] !== undefined &&
        Event.groups[Prefix + 'id'] !== '' &&
        Event.groups[Prefix + 'name'] !== '') {
      let props = {};
      Object.keys(Event.groups).filter((k) => {
        return k.startsWith(Prefix);
      }).forEach((k) => {
        props[k.substr(Prefix.length)] = Number(Event.groups[k]);
      });
      let ID = Event.groups[Prefix + 'id'];

      this.combatants[ID].setName(Event.groups[Prefix + 'name']);
      this.combatants[ID].pushPartialState(timestamp, props);
    }
  }

  getMainCombatantName() {
    if (this.mainCombatantID)
      return this.combatants[this.mainCombatantID].name;
    return 'Unknown';
  }
}
