'use strict';

class PersistorEncounter {
  /**
   * @param {Encounter} encounter 
   */
  constructor(encounter) {
    this.id = encounter.id;
    this.name = 'Unknown';
    if (encounter.combatantTracker.mainCombatantID !== null) {
      this.name = encounter.combatantTracker.combatants[encounter.combatantTracker.mainCombatantID].name;
    }
    this.start = encounter.startTimestamp;
    this.offset = encounter.initialOffset;
    this.startStatus = encounter.startStatus;
    this.endStatus = encounter.endStatus;
    this.zone = encounter.encounterZone;
    this.duration = encounter.endTimestamp - encounter.startTimestamp;
  }
}