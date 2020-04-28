'use strict';

class CombatantTracker {
  constructor(encounterDay, logLines) {
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
            this.firstTimestamp - lineTimestamp > 1000*60*60*12)
          lineTimestamp = lineTimestamp + 1000*60*60*24;
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
      case '04':
      {
        eventParts = line[3].split(':', 2);
        let combatantParts = CombatantTracker.AddRemoveCombatantRegex.exec(rawLine);
        if (combatantParts !== null)
          this.AddCombatant(lineTimestamp, eventParts[0], combatantParts[1], lineEvent, rawLine);
        break;
      }
      case '15':
      case '16':
        this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1], lineEvent, rawLine);
        this.AddCombatant(lineTimestamp, eventParts[4], eventParts[5], lineEvent, rawLine);
        break;
      case '1A':
      case '1B':
      case '1E':
        this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1].split(' ').slice(0, 2).join(' '), lineEvent, rawLine);
        break;
      case '22':
      case '23':
        this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1], lineEvent, rawLine);
        this.AddCombatant(lineTimestamp, eventParts[2], eventParts[3], lineEvent, rawLine);
        break;
      case '26':
        this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1], lineEvent, rawLine);
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
      let lineTimestamp = new Date(encounterDay + ' ' + line[1]).getTime();
      let lineEvent = line[2];
      if (EmulatorCommon.EventDetailsRegexes[lineEvent] !== undefined) {
        let eventParts =
          EmulatorCommon.EventDetailsRegexes[lineEvent].exec(keyedLogLines[sortedTimestamps[i]]);
        if (eventParts !== null) {
          if (lineEvent === '15' || lineEvent === '16') {
            let source_id = eventParts.groups.source_id;
            eventTracker[source_id] = eventTracker[source_id] || 0;
            ++eventTracker[source_id];
          }
          this.UpdateCombatantState(lineTimestamp, eventParts, 'source_');
          this.UpdateCombatantState(lineTimestamp, eventParts, 'target_');
          continue;
        }
      }
    }

    // Figure out party/enemy/other status
    this.others = this.others.filter((ID) => {
      if (this.combatants[ID].job !== null || ID.startsWith('1')) {
        this.partyMembers.push(ID);
        return false;
      } else if (EmulatorCommon.petNames.includes(this.combatants[ID].name)) {
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

  AddCombatant(timestamp, ID, Name, Event, line) {
    if (this.combatants[ID] === undefined && ID !== '' && Name !== '') {
      this.combatants[ID] = new Combatant(ID, Name);
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
    }

    if (EmulatorCommon.EventDetailsRegexes[Event] !== undefined) {
      let eventParts = EmulatorCommon.EventDetailsRegexes[Event].exec(line);

      if (ID !== '' && Name !== '') {
        switch (Event) {
        case '03':
          if (eventParts.groups.job !== 'N/A' && this.combatants[ID].job === null)
            this.combatants[ID].job = eventParts.groups.job.toUpperCase();
          if (this.combatants[ID].level === null && eventParts.groups.level > 0)
            this.combatants[ID].level = eventParts.groups.level;
          break;
        case '15':
        case '16':
          if (eventParts.groups.source_id === ID && this.combatants[ID].job === null && !ID.startsWith('4'))
            this.combatants[ID].job = CombatantJobSearch.GetJob(eventParts.groups.AbilityID);
          break;
        }
      }

      let src = eventParts.groups.source_id === ID ? 'source_' : 'target_';
      if (eventParts.groups[src + 'id'] !== '' && eventParts.groups[src + 'name'] !== '') {
        let initState = this.initialStates[ID];
        Object.keys(eventParts.groups).filter((k) => {
          return k.startsWith(src);
        }).forEach((k) => {
          let iKey = k.substr(src.length);
          if (initState.timestamp >= timestamp || initState[iKey] === null)
            initState[iKey] = eventParts.groups[k];
        });
        if (initState.timestamp <= timestamp || initState.visible === null)
          initState.visible = initState.visible || Event !== '03';
      }
    }
  }

  UpdateCombatantState(timestamp, Event, Prefix) {
    if (Event.groups[Prefix + 'id'] !== undefined && Event.groups[Prefix + 'id'] !== '' && Event.groups[Prefix + 'name'] !== '') {
      let props = {};
      Object.keys(Event.groups).filter((k) => {
        return k.startsWith(Prefix);
      }).forEach((k) => {
        props[k.substr(Prefix.length)] = Number(Event.groups[k]);
      });
      let ID = Event.groups[Prefix + 'id'];

      this.combatants[ID].pushPartialState(timestamp, props);
    }
  }

  getMainCombatantName() {
    if (this.mainCombatantID)
      return this.combatants[this.mainCombatantID].name;
    return 'Unknown';
  }
}

CombatantTracker.AddRemoveCombatantRegex = /:(?:Added new|Removing) combatant ([^:]+?)\. {2}/i;
