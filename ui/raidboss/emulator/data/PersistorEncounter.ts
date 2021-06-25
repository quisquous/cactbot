import { UnreachableCode } from '../../../../resources/not_reached';

import Encounter from './Encounter';

export default class PersistorEncounter {
  id: number;
  name: string;
  start: number;
  offset: number;
  startStatus: string;
  endStatus: string;
  zoneId: string;
  zoneName: string;
  duration: number;

  constructor(encounter: Encounter) {
    if (!encounter.combatantTracker)
      throw new UnreachableCode();
    this.id = encounter.id ?? 0;
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
