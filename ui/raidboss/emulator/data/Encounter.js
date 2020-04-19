class Encounter {
  constructor(encounterDay, encounterZone, logLines) {
    this.ID = null;
    this.logLines = logLines;
    this.encounterZone = encounterZone;
    this.combatantTracker = new CombatantTracker(encounterDay, logLines);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;
    //this.Initialize();
  }
};
