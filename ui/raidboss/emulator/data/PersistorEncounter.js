export default class PersistorEncounter {
  constructor(encounter) {
    this.id = encounter.id;
    this.name = encounter.combatantTracker.getMainCombatantName();
    this.start = encounter.startTimestamp;
    this.offset = encounter.initialOffset;
    this.startStatus = encounter.startStatus;
    this.endStatus = encounter.endStatus;
    this.zoneId = encounter.encounterZoneId;
    this.zoneName = encounter.encounterZoneName;
    this.duration = encounter.endTimestamp - encounter.startTimestamp;
  }
}
