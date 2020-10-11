'use strict';

class Encounter {
  constructor(encounterDay, encounterZoneId, encounterZoneName, logLines) {
    this.id = null;
    this.encounterZoneId = encounterZoneId;
    this.encounterZoneName = encounterZoneName;
    this.encounterDay = encounterDay;
    this.logLines = logLines;
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

    let petNames = PetNamesByLang[this.language];

    this.firstLineIndex = 0;

    for (let i = 0; i < this.logLines.length; ++i) {
      let line = this.logLines[i];
      let res = LogEventHandler.isMatchStart(line.networkLine);
      if (res) {
        this.firstLineIndex = i;
        this.startStatus.add(res.groups.StartType);
        if (res.groups.StartIn >= 0)
          this.engageAt = Math.min(line.timestamp + res.groups.StartIn, this.engageAt);
      } else {
        res = LogEventHandler.isMatchEnd(line.networkLine);
        if (res) {
          this.endStatus = res.groups.EndType;
        } else if (line.id && line.targetId) {
          if (line.id.startsWith('1') ||
            (line.id.startsWith('4') && petNames.includes(line.name))) {
            // Player or pet ability
            if (line.targetId.startsWith('4') && !petNames.includes(line.targetName)) {
              // Targetting non player or pet
              this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);
            }
          } else if (line.id.startsWith('4') && !petNames.includes(line.name)) {
            // Non-player ability
            if (line.targetId.startsWith('1') || petNames.includes(line.targetName)) {
              // Targetting player or pet
              this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);
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

    this.combatantTracker = new CombatantTracker(this.logLines, this.language);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;

    if (this.initialOffset === Number.MAX_SAFE_INTEGER) {
      if (this.engageAt !== null)
        this.initialOffset = this.engageAt - this.startTimestamp;
      else if (this.firstPlayerAbility !== null)
        this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
      else if (this.firstEnemyAbility !== null)
        this.initialOffset = this.firstEnemyAbility - this.startTimestamp;
      else
        this.initialOffset = 0;
    }

    this.playbackOffset = this.logLines[this.firstLineIndex].offset;

    this.startStatus = [...this.startStatus].sort().join(', ');
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = Encounter;
