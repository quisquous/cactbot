export type Lang = 'en' | 'de' | 'fr' | 'ja' | 'cn' | 'ko';

export interface Party {
  id: string;
  name: string;
  worldId: number;
  job: number;
  inParty: boolean;
}

export interface EventMap {
  // OverlayPlugin build-in
  'CombatData': () => void;
  'LogLine': (ev: { line: string[]; rawLine: string }) => void;
  'ChangeZone': (ev: { zoneID: string }) => void;
  'ChangePrimaryPlayer': (ev: { charID: string; charName: string }) => void;
  'OnlineStatusChanged': (ev: { target: string; rawStatus: number; status: string }) => void;
  'PartyChanged': (ev: { party: Party[] }) => void;
  'BroadcastMessage': (ev: { source: string; msg: unknown }) => void;
  // Cactbot
  // Fill up all event types
  'onForceReload': () => void;
  'onGameExistsEvent': () => void;
  'onGameActiveChangedEvent': () => void;
  'onLogEvent': () => void;
  'onImportLogEvent': () => void;
  'onInCombatChangedEvent': () => void;
  'onZoneChangedEvent': () => void;
  'onFateEvent': () => void;
  'onCEEvent': () => void;
  'onPlayerDied': () => void;
  'onPartyWipe': () => void;
  'onPlayerChangedEvent': () => void;
  'onUserFileChanged': () => void;
}

export type EventType = keyof EventMap;

export interface HandlerMap {
  // OutputPlugin build-in
  'subscribe': (msg: {
    call: 'subscribe';
    events: string[];
  }) => Promise<void>;
  // TODO: add OverlayPlugin build-in handlers
  // Cactbot
  // TODO: fill up all handler types
  'cactbotReloadOverlays': () => void;
  'cactbotLoadUser': () => void;
  'cactbotRequestPlayerUpdate': () => void;
  'cactbotRequestState': () => void;
  'cactbotSay': () => void;
  'cactbotSaveData': () => void;
  'cactbotLoadData': () => void;
  'cactbotChooseDirectory': () => void;
}

export type HandlerType = keyof HandlerMap;
