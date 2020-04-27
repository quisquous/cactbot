class Encounter {
  constructor(encounterDay, encounterZone, logLines) {
    this.id = null;
    this.encounterZone = encounterZone;
    this.encounterDay = encounterDay;
    let firstTimestamp = null;
    if (typeof logLines[0] !== 'object') {
      // Extract the required info from log lines for playback, two passes.
      // First pass just to figure out the earliest timestamp.
      logLines = logLines.map((line) => {
        let matches = AnalyzedEncounter.lineTimestampRegex.exec(line);
        let timestamp = +new Date(encounterDay + ' ' + matches[1]);
        // Probably not the best way to fix the midnight wraparound bug, but it should work
        if(firstTimestamp !== null) {
          if (timestamp < firstTimestamp && firstTimestamp - timestamp > 1000*60*60*12) {
            timestamp = timestamp + 1000*60*60*24;
          }
        }
        firstTimestamp = firstTimestamp || timestamp;
        firstTimestamp = Math.min(firstTimestamp, timestamp);
        return {
          timestamp: timestamp,
          line: line,
        };
      });
      this.logLines = logLines.map((line) => {
        line.offset = line.timestamp - firstTimestamp;
        return line;
      });
    } else {
      this.logLines = logLines;
    }
    this.initialize();
  }

  initialize() {
    this.language = 'en';
    this.initialOffset = Number.MAX_SAFE_INTEGER;
    this.endStatus = 'Unknown';
    this.startStatus = new Set();
    this.engageAt = Number.MAX_SAFE_INTEGER;
    this.firstPlayerAbility = Number.MAX_SAFE_INTEGER;
    this.firstEnemyAbility = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.logLines.length; ++i) {
      let res;
      let line = this.logLines[i];
      if (res = LogEventHandler.IsMatchStart(line.line)) {
        this.startStatus.add(res.groups.StartType);
        if (res.groups.StartIn >= 0) {
          this.engageAt = Math.min(line.timestamp + res.groups.StartIn, this.engageAt);
        }
      } else if (res = LogEventHandler.IsMatchEnd(line.line)) {
        this.endStatus = res.groups.EndType;
      } else if (res = LogEventHandler.IsMatchEnd(line.line)) {
        this.endStatus = res.groups.EndType;
      } else if ((res = EmulatorCommon.EventDetailsRegexes['15'].exec(line.line)) ||
        (res = EmulatorCommon.EventDetailsRegexes['16'].exec(line.line))) {
        if (res.groups.source_id.startsWith('1') ||
          (res.groups.source_id.startsWith('4') && EmulatorCommon.PetNames.includes(res.groups.source_name))) {
          // Player or pet ability
          if (res.groups.target_id.startsWith('4') && !EmulatorCommon.PetNames.includes(res.groups.target_name)) {
            // Targetting non player or pet
            this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);
          }
        } else if (res.groups.source_id.startsWith('4') && !EmulatorCommon.PetNames.includes(res.groups.source_name)) {
          // Non-player ability
          if (res.groups.target_id.startsWith('1') || EmulatorCommon.PetNames.includes(res.groups.target_name)) {
            // Targetting player or pet
            this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);
          }
        }
      }
      if (res && res.groups && res.groups.Language && EmulatorCommon.Languages.includes(res.groups.Language)) {
        this.language = res.groups.Language || this.language;
      }
    }

    this.firstPlayerAbility = this.firstPlayerAbility === Number.MAX_SAFE_INTEGER ? null : this.firstPlayerAbility;
    this.firstEnemyAbility = this.firstEnemyAbility === Number.MAX_SAFE_INTEGER ? null : this.firstEnemyAbility;
    this.engageAt = this.engageAt === Number.MAX_SAFE_INTEGER ? null : this.engageAt;

    this.combatantTracker = new CombatantTracker(this.encounterDay, this.logLines);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;

    if (this.engageAt !== null) {
      this.initialOffset = this.engageAt - this.startTimestamp;
    } else if (this.firstPlayerAbility !== null) {
      this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
    } else if (this.firstEnemyAbility !== null) {
      this.initialOffset = this.firstEnemyAbility - this.startTimestamp;
    }

    this.startStatus = [...this.startStatus].sort().join(', ');
    this.initialOffset = this.initialOffset === Number.MAX_SAFE_INTEGER ? 0 : this.initialOffset;
  }
};
