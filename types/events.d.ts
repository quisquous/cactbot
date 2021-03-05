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


export interface RDM {
  whiteMana: number;
  blackMana: number;
}

export interface WAR {
  beast: number;
}

export interface DRK {
  blood: number;
  darksideMilliseconds: number;
  darkArts: number;
  livingShadowMilliseconds: number;
}

export interface GNB {
  cartridges: number;
  continuationState: number;
}

export interface PLD {
  oath: number;
}

export interface BRD {
  songName: string;
  songProcs: number;
  soulGauge: number;
  songMilliseconds: number;
}

export interface DNC {
  // todo: don't know
  feathers;
  esprit: number;
  steps;
  currentStep;
}

export interface NIN {
  hutonMilliseconds: number;
  ninkiAmount: number;
}
