'use strict';

class PersistorEncounter {
  constructor(encounter) {
    this.id = encounter.id;
    this.name = encounter.combatantTracker.getMainCombatantName();
    this.start = encounter.startTimestamp;
    this.offset = encounter.initialOffset;
    this.startStatus = encounter.startStatus;
    this.endStatus = encounter.endStatus;
    this.zone = encounter.encounterZone;
    this.duration = encounter.endTimestamp - encounter.startTimestamp;
  }
}
