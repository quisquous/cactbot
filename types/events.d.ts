export interface ChangeZoneEvent {
  zoneName: string;
  zoneID: number;
}

export interface InCombatChangedEvent {
  detail: {
    inACTCombat: boolean;
    inGameCombat: boolean;
  };
}

