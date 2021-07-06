import { Lang } from '../resources/languages';

import { Job } from './job';

declare global {
  interface DocumentEventMap {
    'onOverlayStateUpdate': CustomEvent<{ isLocked: boolean }>;
  }
}
export interface Party {
  id: string;
  name: string;
  worldId: number;
  job: number;
  inParty: boolean;
}

export interface JobDetail {
  'PLD': { oath: number };
  'WAR': { beast: number };
  'DRK': {
    blood: number;
    darksideMilliseconds: number;
    darkArts: 1 | 0;
    livingShadowMilliseconds: number;
  };
  'GNB': {
    cartridges: number;
    continuationState: string;
  };
  'WHM': {
    lilyStacks: number;
    lilyMilliseconds: number;
    bloodlilyStacks: number;
  };
  'SCH': {
    aetherflowStacks: number;
    fairyGauge: number;
    fairyMilliseconds: number;
    fairyStatus: number;
  };
  'AST': {
    heldCard: 'Balance' | 'Bole' | 'Arrow' | 'Spear' | 'Ewer' | 'Spire';
    arcanums: string;
  };
  'PGL': {
    lightningMilliseconds: number;
    lightningStacks: number;
  };
  'MNK': {
    lightningStacks: number;
    lightningMilliseconds: number;
    chakraStacks: number;
    lightningTimerFrozen: boolean;
  };
  'DRG': {
    eyesAmount: number;
    bloodMilliseconds: number;
    lifeMilliseconds: number;
  };
  'NIN': {
    hutonMilliseconds: number;
    ninkiAmount: number;
  };
  'SAM': {
    kenki: number;
    meditationStacks: number;
    setsu: boolean;
    getsu: boolean;
    ka: boolean;
  };
  'BRD': {
    songName: 'Ballad' | 'Paeon' | 'Minuet' | 'None';
    songMilliseconds: number;
    songProcs: number;
    soulGauge: number;
  };
  'MCH': {
    overheatMilliseconds: number;
    batteryMilliseconds: number;
    heat: number;
    battery: number;
    lastBatteryAmount: number;
    overheatActive: boolean;
    robotActive: boolean;
  };
  'DNC': {
    feathers: number;
    esprit: number;
    currentStep: number;
    steps: string;
  };
  'THM': {
    umbralMilliseconds: number;
    umbralStacks: number;
  };
  'BLM': {
    umbralMilliseconds: number;
    umbralStacks: number;
    enochian: boolean;
    umbralHearts: number;
    foulCount: number;
    nextPolyglotMilliseconds: number;
  };
  'ACN': {
    aetherflowStacks: number;
  };
  'SMN': {
    stanceMilliseconds: number;
    bahamutStance: 5 | 0;
    bahamutSummoned: 1 | 0;
    aetherflowStacks: number;
    dreadwyrmStacks: number;
    phoenixReady: number;
  };
  'RDM': {
    whiteMana: number;
    blackMana: number;
  };
}

export interface EventMap {
  // #region OverlayPlugin built-in Event
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

  'FileChanged': (ev: {
    type: 'FileChanged';
    file: string;
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

  'EnmityTargetData': (ev: {
    type: 'EnmityTargetData';
    Target: {
      Name: string;
      ID: number;
      Distance: number;
      EffectiveDistance: number;
    };
  }) => void;
  // #endregion

  // #region Cactbot Event
  // Fill up all event types
  'onForceReload': (ev: {
    type: 'onForceReload';
  }) => void;

  'onGameExistsEvent': (ev: {
    type: 'onGameExistsEvent';
    detail: {
      exists: boolean;
    };
  }) => void;

  'onGameActiveChangedEvent': (ev: {
    type: 'onGameActiveChangedEvent';
    detail: {
      active: boolean;
    };
  }) => void;

  'onLogEvent': (ev: LogEvent) => void;

  'onImportLogEvent': (ev: {
    type: 'onImportLogEvent';
    detail: {
      logs: string[];
    };
  }) => void;

  'onInCombatChangedEvent': (ev: {
    type: 'onInCombatChangedEvent';
    detail: {
      inACTCombat: boolean;
      inGameCombat: boolean;
    };
  }) => void;

  'onZoneChangedEvent': (ev: {
    type: 'onZoneChangedEvent';
    detail: {
      zoneName: string;
    };
  }) => void;

  'onFateEvent': (ev: {
    type: 'onFateEvent';
    detail: {
      eventType: 'add' | 'update' | 'remove';
      fateID: number;
      progress: number;
    };
  }) => void;

  'onCEEvent': (ev: {
    type: 'onCEEvent';
    detail: {
      eventType: 'add' | 'update' | 'remove';
      data: {
        popTime: number;
        timeRemaining: number;
        ceKey: number;
        numPlayers: number;
        status: number;
        progress: number;
      };
    };
  }) => void;

  'onPlayerDied': (ev: {
    type: 'onPlayerDied';
  }) => void;

  'onPartyWipe': (ev: {
    type: 'onPartyWipe';
  }) => void;

  'onPlayerChangedEvent': (ev: {
    type: 'onPlayerChangedEvent';
    detail: PlayerChangedRet;
  }) => void;

  'onUserFileChanged': (ev: {
    type: 'onUserFileChanged';
    file: string;
  }) => void;
  // #endregion
}

export type EventResponses = {
  [event in keyof EventMap]: Parameters<EventMap[event]>[0];
};

export type LogEvent = {
  type: 'onLogEvent';
  detail: {
    logs: string[];
  };
};

export type EventType = keyof EventMap;

interface CactbotLoadUserRet {
  userLocation: string;
  localUserFiles: { [filename: string]: string } | null;
  parserLanguage: Lang;
  systemLocale: string;
  displayLanguage: Lang;
  /** @deprecated for backwards compatibility, use parserLanguage instead */
  language: Lang;
}

// Structured JSON data saved in OverlayPlugin config files.
export type SavedConfigEntry = string | number | boolean | [ SavedConfigEntry] |
   { [nestedName: string]: SavedConfigEntry };
export type SavedConfig = {
  [overlayName: string]: SavedConfigEntry;
};

type PlayerChangedJobDetails<T> = {
  job: T;
  jobDetail: JobDetail[T];
} | {
  job: Job;
  jobDetail: null;
}

type PlayerChangedBase = {
  name: string;
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
  pos: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  bait: number;
  debugJob: string;
};

type PlayerChangedRet = Job extends infer T ? T extends Job ?
  PlayerChangedJobDetails<T> & PlayerChangedBase : never : never;

// Member names taken from OverlayPlugin's MiniParse.cs
// Types taken from FFXIV parser plugin
export interface PluginCombatantState {
  CurrentWorldID?: number;
  WorldID?: number;
  WorldName?: string;
  BNpcID?: number;
  BNpcNameID?: number;
  PartyType?: number;
  ID?: number;
  OwnerID?: number;
  type?: number;
  Job?: number;
  Level?: number;
  Name?: string;
  CurrentHP: number;
  MaxHP: number;
  CurrentMP: number;
  MaxMP: number;
  PosX: number;
  PosY: number;
  PosZ: number;
  Heading: number;
}

type SubscribeHandler = (msg: {
  call: 'subscribe';
  events: string[];
}) => void;

type GetCombatantsHandler = (msg: {
  call: 'getCombatants';
  ids?: number[];
  names?: string[];
  props?: string[];
}) => { combatants: PluginCombatantState[] };

type CactbotReloadOverlaysHandler = (msg: {
  call: 'cactbotReloadOverlays';
}) => void;

type CactbotLoadUserHandler = (msg: {
  call: 'cactbotLoadUser';
  source: string;
  overlayName: string;
}) => { detail: CactbotLoadUserRet };

type CactbotRequestPlayerUpdateHandler = (msg: {
  call: 'cactbotRequestPlayerUpdate';
}) => void;

type CactbotRequestStateHandler = (msg: {
  call: 'cactbotRequestState';
}) => void;

type CactbotSayHandler = (msg: {
  call: 'cactbotSay';
  text: string;
}) => void;

type CactbotSaveDataHandler = (msg: {
  call: 'cactbotSaveData';
}) => void;

type CactbotLoadDataHandler = (msg: {
  call: 'cactbotLoadData';
  overlay: string;
}) => ({ data: SavedConfig } | undefined);

type CactbotChooseDirectoryHandler = <T>(msg: {
  call: 'cactbotChooseDirectory';
}) => ({ data: T } | undefined);

export type OverlayHandlerAll = {
  'subscribe': SubscribeHandler;
  'getCombatants': GetCombatantsHandler;
  'cactbotReloadOverlays': CactbotReloadOverlaysHandler;
  'cactbotLoadUser': CactbotLoadUserHandler;
  'cactbotRequestPlayerUpdate': CactbotRequestPlayerUpdateHandler;
  'cactbotRequestState': CactbotRequestStateHandler;
  'cactbotSay': CactbotSayHandler;
  'cactbotSaveData': CactbotSaveDataHandler;
  'cactbotLoadData': CactbotLoadDataHandler;
  'cactbotChooseDirectory': CactbotChooseDirectoryHandler;
};

export type OverlayHandlerTypes = keyof OverlayHandlerAll;

export type OverlayHandlerRequests = {
  [call in OverlayHandlerTypes]: Parameters<OverlayHandlerAll[call]>[0];
};

export type OverlayHandlerAnyRequest = OverlayHandlerRequests[OverlayHandlerTypes];

export type OverlayHandlerResponseTypes = {
  [call in OverlayHandlerTypes]: ReturnType<OverlayHandlerAll[call]>;
};

export type OverlayHandlerResponses = {
  [call in OverlayHandlerTypes]: Promise<OverlayHandlerResponseTypes[call]>;
};

export type OverlayHandlerAnyResponse = OverlayHandlerResponses[OverlayHandlerTypes];

export type OverlayHandlerFuncs = {
  [call in OverlayHandlerTypes]:
    (msg: Parameters<OverlayHandlerAll[call]>[0]) => OverlayHandlerResponses[call];
};

// Thanks, https://stackoverflow.com/a/50375286.
type UnionToIntersection<U> =
  (U extends U ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type IOverlayHandler = UnionToIntersection<OverlayHandlerFuncs[OverlayHandlerTypes]>;
