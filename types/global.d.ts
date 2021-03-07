import { Job } from './job';

export type Lang = 'en' | 'de' | 'fr' | 'ja' | 'cn' | 'ko';

type Nullable<T> = T | null;

export interface Party {
  id: string;
  name: string;
  worldId: number;
  job: number;
  inParty: boolean;
}

export interface EventMap {
  // OverlayPlugin build-in
  'CombatData': (ev: {
    type: 'CombatData';
  }) => void;
  'LogLine': (ev: {
    type: 'LogLine';
    line: string[];
    rawLine: string;
  }) => void;
  'ChangeZone': (ev: {
    type: 'ChangeZone';
    zoneID: number;
    zoneName: string;
  }) => void;
  'ChangePrimaryPlayer': (ev: {
    type: 'ChangePrimaryPlayer';
    charID: string;
    charName: string;
  }) => void;
  'OnlineStatusChanged': (ev: {
    type: 'OnlineStatusChanged';
    target: string; rawStatus:
    number; status: string;
  }) => void;
  'PartyChanged': (ev: {
    type: 'PartyChanged';
    party: Party[];
  }) => void;
  'BroadcastMessage': (ev: {
    type: 'BroadcastMessage';
    source: string;
    msg: unknown;
  }) => void;
  // Cactbot
  // Fill up all event types
  'onForceReload': (ev: {
    type: 'onForceReload';
  }) => void;
  'onGameExistsEvent': (ev: {
    type: 'onGameExistsEvent';
  }) => void;
  'onGameActiveChangedEvent': (ev: {
    type: 'onGameActiveChangedEvent';
  }) => void;
  'onLogEvent': (ev: {
    type: 'onLogEvent';
  }) => void;
  'onImportLogEvent': (ev: {
    type: 'onImportLogEvent';
  }) => void;
  'onInCombatChangedEvent': (ev: {
    type: 'onInCombatChangedEvent';
  }) => void;
  'onZoneChangedEvent': (ev: {
    type: 'onZoneChangedEvent';
  }) => void;
  'onFateEvent': (ev: {
    type: 'onFateEvent';
  }) => void;
  'onCEEvent': (ev: {
    type: 'onCEEvent';
  }) => void;
  'onPlayerDied': (ev: {
    type: 'onPlayerDied';
  }) => void;
  'onPartyWipe': (ev: {
    type: 'onPartyWipe';
  }) => void;
  'onPlayerChangedEvent': (ev: {
    type: 'onPlayerChangedEvent';
    detail: {
      name: string;
      job: Job;
      level: number;
      currentHP: number;
      maxHP: number;
      currentMP: number;
      maxMP: number;
      currentCP: number;
      maxCP: number;
      currentGP: number;
      maxGP: number;
      currentShield: number;
      // type jobDetail
      pos: {
        x: number;
        y: number;
        z: number;
      };
      rotation: number;
      bait: number;
      debugJob: string;
    };
  }
  ) => void;
  'onUserFileChanged': (ev: {
    type: 'onUserFileChanged';
  }) => void;
}

export type EventType = keyof EventMap;
