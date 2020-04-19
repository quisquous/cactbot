class CombatantTracker {
  static LogLineRegex = /^\[(\d\d:\d\d:\d\d.\d\d\d)\] ([0-9A-Z]+):(.*)$/i;
  static AddRemoveCombatantRegex = /:(?:Added new|Removing) combatant ([^:]+?)\.  /i;
  static EventDetailsRegexes = {
    '03': /^[^ ]+ 03:(?<SourceID>[^:]+):Added new combatant (?<SourceName>[^:]+)\.  Job: (?<Job>[^:]+) Level: (?<Level>[^:]+) Max HP: (?<SourceMaxHP>\d+) Max MP: (?<SourceMaxMP>\d+) Pos: \((?<SourcePosX>[^,)]+),(?<SourcePosY>[^,)]+),(?<SourcePosZ>[^,)]+)\)/i,
    '04': /^[^ ]+ 04:(?<SourceID>[^:]+):Removing combatant (?<SourceName>[^:]+)\.  Max HP: (?<SourceMaxHP>\d+)\. Pos: \((?<SourcePosX>[^,]+),(?<SourcePosY>[^,]+),(?<SourcePosZ>[^,)]+)\)/i,
    '15': /^[^ ]+ 15:(?<SourceID>[^:]*?):(?<SourceName>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<TargetID>[^:]*?):(?<TargetName>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<TargetHP>[^:]*?):(?<TargetMaxHP>[^:]*?):(?<TargetMP>[^:]*?):(?<TargetMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<TargetPosX>[^:]*?):(?<TargetPosY>[^:]*?):(?<TargetPosZ>[^:]*?):(?<TargetHeading>[^:]*?):(?<SourceHP>[^:]*?):(?<SourceMaxHP>[^:]*?):(?<SourceMP>[^:]*?):(?<SourceMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<SourcePosX>[^:]*?):(?<SourcePosY>[^:]*?):(?<SourcePosZ>[^:]*?):(?<SourceHeading>[^:]*?):/i,
    '16': /^[^ ]+ 16:(?<SourceID>[^:]*?):(?<SourceName>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<TargetID>[^:]*?):(?<TargetName>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<TargetHP>[^:]*?):(?<TargetMaxHP>[^:]*?):(?<TargetMP>[^:]*?):(?<TargetMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<TargetPosX>[^:]*?):(?<TargetPosY>[^:]*?):(?<TargetPosZ>[^:]*?):(?<TargetHeading>[^:]*?):(?<SourceHP>[^:]*?):(?<SourceMaxHP>[^:]*?):(?<SourceMP>[^:]*?):(?<SourceMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<SourcePosX>[^:]*?):(?<SourcePosY>[^:]*?):(?<SourcePosZ>[^:]*?):(?<SourceHeading>[^:]*?):/i,
    '26': /^[^ ]+ 26:(?<SourceID>[^:]+):[^:]*:[^:]+:(?<SourceHP>[^:]+):(?<SourceMaxHP>[^:]+):(?<SourceMP>[^:]+):(?<SourceMaxMP>[^:]+)/i,
  };

  constructor(encounterDay, logLines) {
    this.firstTimestamp = Number.MAX_SAFE_INTEGER;
    this.lastTimestamp = 0;
    this.combatants = {};
    this.partyMembers = [];
    this.enemies = [];
    this.others = [];
    this.mainCombatantID = null;
    this.initialStates = {};
    this.Initialize(encounterDay, logLines);
    delete this.initialStates;
  }

  Initialize(encounterDay, logLines) {
    let keyedLogLines = {};
    // First pass: Get list of combatants, figure out where they start at if possible, build our keyed log lines
    for (let i = 0; i < logLines.length; ++i) {
      let line = CombatantTracker.LogLineRegex.exec(logLines[i]);
      let lineTimestamp = new Date(encounterDay + ' ' + line[1]).getTime();
      let lineEvent = line[2];
      let eventParts = line[3].split(':');

      this.firstTimestamp = Math.min(this.firstTimestamp, lineTimestamp);
      this.lastTimestamp = Math.max(this.lastTimestamp, lineTimestamp);

      keyedLogLines[lineTimestamp + '_' + i + '_' + logLines[i]] = logLines[i];

      switch (lineEvent) {
        case '03':
        case '04':
          {
            eventParts = line[3].split(':', 2);
            let combatantParts = CombatantTracker.AddRemoveCombatantRegex.exec(logLines[i]);
            if (combatantParts !== null) {
              this.AddCombatant(lineTimestamp, eventParts[0], combatantParts[1], lineEvent, logLines[i]);
            }
            break;
          }
        case '15':
        case '16':
          this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1], lineEvent, logLines[i]);
          this.AddCombatant(lineTimestamp, eventParts[4], eventParts[5], lineEvent, logLines[i]);
          break;
        case '1A':
        case '1B':
        case '1E':
          this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1].split(' ').slice(0, 2).join(' '), lineEvent, logLines[i]);
          break;
        case '22':
        case '23':
          this.AddCombatant(lineTimestamp, eventParts[0], eventParts[1], lineEvent, logLines[i]);
          this.AddCombatant(lineTimestamp, eventParts[2], eventParts[3], lineEvent, logLines[i]);
          break;
      }
    }

    let sortedTimestamps = Object.keys(keyedLogLines).sort();

    // Between passes: Create our initial combatant states
    Object.entries(this.initialStates).forEach((a) => {
      this.combatants[a[0]].PushState(this.firstTimestamp, new CombatantState(
        Number(this.initialStates[a[0]].PosX),
        Number(this.initialStates[a[0]].PosY),
        Number(this.initialStates[a[0]].PosZ),
        Number(this.initialStates[a[0]].Heading),
        this.initialStates[a[0]].Visible,
        Number(this.initialStates[a[0]].HP),
        Number(this.initialStates[a[0]].MaxHP),
        Number(this.initialStates[a[0]].MP),
        Number(this.initialStates[a[0]].MaxMP)
      ));
    });

    // Second pass: Analyze combatant information for tracking
    let eventTracker = {};
    for (let i = 0; i < sortedTimestamps.length; ++i) {
      let line = CombatantTracker.LogLineRegex.exec(keyedLogLines[sortedTimestamps[i]]);
      let lineTimestamp = new Date(encounterDay + ' ' + line[1]).getTime();
      let lineEvent = line[2];
      if (CombatantTracker.EventDetailsRegexes.hasOwnProperty(lineEvent)) {
        let eventParts = CombatantTracker.EventDetailsRegexes[lineEvent].exec(keyedLogLines[sortedTimestamps[i]]);
        if (eventParts !== null) {
          if (lineEvent === '15' || lineEvent === '16') {
            eventTracker[eventParts.groups.SourceID] = eventTracker[eventParts.groups.SourceID] || 0;
            ++eventTracker[eventParts.groups.SourceID];
          }
          this.UpdateCombatantState(lineTimestamp, eventParts, 'Source');
          this.UpdateCombatantState(lineTimestamp, eventParts, 'Target');
          this.FillInCombatantStates(lineTimestamp,
            [eventParts.groups.SourceID, eventParts.groups.TargetID].filter((v) => {
              return v !== undefined;
            })
          );
        }
      }
    }
    this.others = this.others.filter((ID) => {
      if (this.combatants[ID].Job !== null) {
        this.partyMembers.push(ID);
        return false;
      } else if (eventTracker[ID] > 0) {
        this.enemies.push(ID);
        return false;
      }
      return true;
    });
    this.mainCombatantID = this.enemies.sort((l, r) => {
      return eventTracker[r] - eventTracker[l];
    })[0];
  }

  AddCombatant(Timestamp, ID, Name, Event, Line) {
    if (!this.combatants.hasOwnProperty(ID) && ID !== '' && Name !== '') {
      this.combatants[ID] = new Combatant(ID, Name);
      this.others.push(ID);
      this.initialStates[ID] = {
        Timestamp: Timestamp,
        PosX: null,
        PosY: null,
        PosZ: null,
        Heading: null,
        Visible: null,
        HP: null,
        MaxHP: null,
        MP: null,
        MaxMP: null,
      };
    }

    if (CombatantTracker.EventDetailsRegexes.hasOwnProperty(Event)) {
      let eventParts = CombatantTracker.EventDetailsRegexes[Event].exec(Line);

      if (ID !== '' && Name !== '') {
        switch (Event) {
          case '03':
            if (eventParts.groups.Job !== 'N/A' && this.initialStates[ID].Job === null) {
              this.combatants[ID].Job = eventParts.groups.Job;
            }
            if (this.initialStates[ID].Level === null) {
              this.combatants[ID].Level = eventParts.groups.Level;
            }
            break;
          case '15':
          case '16':
            if (eventParts.groups.SourceID === ID && this.combatants[ID].Job === null && !ID.startsWith('4')) {
              this.combatants[ID].Job = CombatantJobSearch.GetJob(eventParts.groups.AbilityID);
            }
            break;
        }
      }

      let src = eventParts.groups.SourceID === ID ? 'Source' : 'Target';
      if (eventParts.groups[src + 'ID'] !== '' && eventParts.groups[src + 'Name'] !== '') {
        Object.keys(eventParts.groups).filter((k) => {
          return k.startsWith(src);
        }).forEach((k) => {
          let iKey = k.substr(src.length);
          if (this.initialStates[ID].Timestamp >= Timestamp || this.initialStates[ID][iKey] === null) {
            this.initialStates[ID][iKey] = eventParts.groups[k];
          }
        });
        if (this.initialStates[ID].Timestamp <= Timestamp || this.initialStates[ID].Visible === null) {
          this.initialStates[ID].Visible = this.initialStates[ID].Visible || Event !== '03';
        }
      }
    }
  }

  UpdateCombatantState(Timestamp, Event, Prefix) {
    if (Event.groups[Prefix + 'ID'] !== undefined && Event.groups[Prefix + 'ID'] !== '' && Event.groups[Prefix + 'Name'] !== '') {
      let props = {};
      Object.keys(Event.groups).filter((k) => {
        return k.startsWith(Prefix);
      }).forEach((k) => {
        props[k.substr(Prefix.length)] = Number(Event.groups[k]);
      });
      let ID = Event.groups[Prefix + 'ID'];

      this.combatants[ID].PushPartialState(Timestamp, props);
    }
  }

  FillInCombatantStates(Timestamp, SkipIDs) {
    for (let ID in this.combatants) {
      if (SkipIDs.includes(ID)) {
        return;
      }
      this.combatants[ID].PushPartialState(Timestamp, {});
    };
  }
}