'use strict';

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
        if (firstTimestamp !== null) {
          if (timestamp < firstTimestamp && firstTimestamp - timestamp > 1000 * 60 * 60 * 12)
            timestamp = timestamp + 1000 * 60 * 60 * 24;
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

    let petNames = EmulatorCommon.cactbotLanguages[this.language].kPetNames;

    for (let i = 0; i < this.logLines.length; ++i) {
      let line = this.logLines[i];
      let res = LogEventHandler.isMatchStart(line.line);
      if (res) {
        this.startStatus.add(res.groups.StartType);
        if (res.groups.StartIn >= 0)
          this.engageAt = Math.min(line.timestamp + res.groups.StartIn, this.engageAt);
      } else {
        res = LogEventHandler.isMatchEnd(line.line);
        if (res) {
          this.endStatus = res.groups.EndType;
        } else {
          res = EmulatorCommon.eventDetailsRegexes['15'].exec(line.line);
          if (!res)
            res = EmulatorCommon.eventDetailsRegexes['16'].exec(line.line);
          if (res) {
            if (res.groups.sourceId.startsWith('1') ||
              (res.groups.sourceId.startsWith('4') && petNames.includes(res.groups.source))) {
              // Player or pet ability
              if (res.groups.targetId.startsWith('4') && !petNames.includes(res.groups.target)) {
                // Targetting non player or pet
                this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);
              }
            } else if (res.groups.sourceId.startsWith('4') && !petNames.includes(res.groups.source)) {
              // Non-player ability
              if (res.groups.targetId.startsWith('1') || petNames.includes(res.groups.target)) {
                // Targetting player or pet
                this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);
              }
            }
          }
        }
      }
      if (res && res.groups && res.groups.language)
        this.language = res.groups.language || this.language;
    }

    if (this.firstPlayerAbility === Number.MAX_SAFE_INTEGER)
      this.firstPlayerAbility = null;

    if (this.firstEnemyAbility === Number.MAX_SAFE_INTEGER)
      this.firstEnemyAbility = null;

    if (this.engageAt === Number.MAX_SAFE_INTEGER)
      this.engageAt = null;

    this.combatantTracker = new CombatantTracker(this.encounterDay, this.logLines, this.language);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;

    if (this.engageAt !== null)
      this.initialOffset = this.engageAt - this.startTimestamp;
    else if (this.firstPlayerAbility !== null)
      this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
    else if (this.firstEnemyAbility !== null)
      this.initialOffset = this.firstEnemyAbility - this.startTimestamp;

    this.startStatus = [...this.startStatus].sort().join(', ');
    this.initialOffset = this.initialOffset === Number.MAX_SAFE_INTEGER ? 0 : this.initialOffset;
  }
}
