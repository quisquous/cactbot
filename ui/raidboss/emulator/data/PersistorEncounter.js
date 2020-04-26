'use strict';

class PersistorEncounter {
  /**
   * @param {Encounter} encounter 
   */
  constructor(encounter) {
    this.ID = encounter.ID;
    this.Name = 'Unknown';
    if (encounter.combatantTracker.mainCombatantID !== null) {
      this.Name = encounter.combatantTracker.combatants[encounter.combatantTracker.mainCombatantID].Name;
    }
    this.Start = encounter.startTimestamp;
    this.Offset = encounter.initialOffset;
    this.StartStatus = encounter.startStatus;
    this.EndStatus = encounter.endStatus;
    this.Zone = encounter.encounterZone;
    this.Duration = encounter.endTimestamp - encounter.startTimestamp;
  }
}