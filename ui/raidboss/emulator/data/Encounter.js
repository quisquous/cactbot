class Encounter {
  constructor(encounterDay, encounterZone, logLines) {
    this.ID = null;
    this.logLines = logLines;
    this.encounterZone = encounterZone;
    this.encounterDay = encounterDay;
    this.Initialize();
  }

  Initialize() {
    this.language = 'en';
    this.initialOffset = Number.MAX_SAFE_INTEGER;
    this.endStatus = 'Unknown';
    this.startStatus = new Set();
    this.engageAt = Number.MAX_SAFE_INTEGER;
    this.firstPlayerAbility = Number.MAX_SAFE_INTEGER;
    this.firstEnemyAbility = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.logLines.length; ++i) {
      let res;
      if (res = LogEventHandler.IsMatchStart(this.logLines[i])) {
        let Timestamp = +new Date(this.encounterDay + ' ' + res.groups.LineTimestamp);
        this.startStatus.add(res.groups.StartType);
        if (res.groups.StartIn >= 0) {
          this.engageAt = Math.min(Timestamp + res.groups.StartIn, this.engageAt);
        }
      } else if (res = LogEventHandler.IsMatchEnd(this.logLines[i])) {
        this.endStatus = res.groups.EndType;
      } else if (res = LogEventHandler.IsMatchEnd(this.logLines[i])) {
        this.endStatus = res.groups.EndType;
      } else if ((res = EmulatorCommon.EventDetailsRegexes['15'].exec(this.logLines[i])) ||
        (res = EmulatorCommon.EventDetailsRegexes['16'].exec(this.logLines[i]))) {
        let Timestamp = +new Date(this.encounterDay + ' ' + res.groups.LineTimestamp);
        if (res.groups.SourceID.startsWith('1') ||
          (res.groups.SourceID.startsWith('4') && EmulatorCommon.PetNames.includes(res.groups.SourceName))) {
          // Player or pet ability
          if (res.groups.TargetID.startsWith('4') && !EmulatorCommon.PetNames.includes(res.groups.TargetName)) {
            // Targetting non player or pet
            this.firstPlayerAbility = Math.min(this.firstPlayerAbility, Timestamp);
          }
        } else if (res.groups.SourceID.startsWith('4') && !EmulatorCommon.PetNames.includes(res.groups.SourceName)) {
          // Non-player ability
          if (res.groups.TargetID.startsWith('1') || EmulatorCommon.PetNames.includes(res.groups.TargetName)) {
            // Targetting player or pet
            this.firstEnemyAbility = Math.min(this.firstEnemyAbility, Timestamp);
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
