'use strict';

class Encounter {
  constructor(encounterDay, encounterZone, logLines) {
    this.id = null;
    this.encounterZone = encounterZone;
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

    for (let i = 0; i < this.logLines.length; ++i) {
      let line = this.logLines[i];
      // @TODO: Change this to use network line instead of converted line
      let res = LogEventHandler.isMatchStart(line.networkLine);
      if (res) {
        this.startStatus.add(res.groups.StartType);
        if (res.groups.StartIn >= 0)
          this.engageAt = Math.min(line.timestamp + res.groups.StartIn, this.engageAt);
      } else {
        res = LogEventHandler.isMatchEnd(line.networkLine);
        if (res) {
          this.endStatus = res.groups.EndType;
        } else if (line.targetId) {
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
