import { Lang } from '../resources/languages';
import { Job } from './job';

declare global {
  interface DocumentEventMap {
    'onOverlayStateUpdate': CustomEvent<{ isLocked: boolean }>;
  }

  interface Window {
    __OverlayCallback: (msg: AnyEventResponse) => void;
    dispatchOverlayEvent?: (msg: AnyEventResponse) => void;
    OverlayPluginApi: {
      ready: boolean;
      callHandler: (msg: string, cb?: (value: string) => unknown) => void;
    };
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { overlayApi } from '/path/to/overlay_api';`
     *
     * and use `overlayApi.on`
     */
    addOverlayListener: (event: EventType, cb: AnyListenerCallback) => void;
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { overlayApi } from '/path/to/overlay_api';`
     *
     * and use `overlayApi.off`
     */
    removeOverlayListener: (event: EventType, cb: AnyListenerCallback) => void;
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { overlayApi } from '/path/to/overlay_api';`
     *
     * and use `overlayApi.call`
     */
    callOverlayHandler: (msg: AnyHandlerRequest) => Promise<unknown>;
  }
}

interface Party {
  id: string;
  name: string;
  worldId: number;
  job: number;
  inParty: boolean;
}

interface JobDetail {
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

type LogEvent = {
  type: 'onLogEvent';
  detail: {
    logs: string[];
  };
};

interface EventMap {
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

type EventResponses = {
  [event in keyof EventMap]: Parameters<EventMap[event]>[0];
};

type EventType = keyof EventMap;

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
type SavedConfigEntry = string | number | boolean | [ SavedConfigEntry] |
   { [nestedName: string]: SavedConfigEntry };
type SavedConfig = {
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
interface PluginCombatantState {
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

// #region Listeners

type EventCallback = {
  [type in EventType]: (msg: EventResponses[type]) => void;
};

type AnyEventResponse = {
  type: EventType;
  rseq?: number;
} & EventResponses[EventType];

// #endregion

// #region Handlers

type HandlerRequest = {
  'subscribe': {
    call?: 'subscribe';
    rseq?: number;
    events: string[];
  };
  'getCombatants': {
    call?: 'getCombatants';
    rseq?: number;
    ids?: number[];
    names?: string[];
    props?: string[];
  };
  // TODO: add OverlayPlugin build-in handlers
  // Cactbot
  // TODO: fill up all handler types
  'cactbotReloadOverlays': {
    call?: 'cactbotReloadOverlays';
    rseq?: number;
  };
  'cactbotLoadUser': {
    call?: 'cactbotLoadUser';
    rseq?: number;
    source: string;
    overlayName: string;
  };
  'cactbotRequestPlayerUpdate': {
    call?: 'cactbotRequestPlayerUpdate';
    rseq?: number;
  };
  'cactbotRequestState': {
    call?: 'cactbotRequestState';
    rseq?: number;
  };
  'cactbotSay': {
    call?: 'cactbotSay';
    rseq?: number;
    text: string;
  };
  'cactbotSaveData': {
    call?: 'cactbotSaveData';
    rseq?: number;
  };
  'cactbotLoadData': {
    call?: 'cactbotLoadData';
    rseq?: number;
    overlay: string;
  };
  'cactbotChooseDirectory': {
    call?: 'cactbotChooseDirectory';
    rseq?: number;
  };
};

type HandlerResponse = {
  'subscribe': null;
  'getCombatants': { combatants: PluginCombatantState[] };
  'cactbotReloadOverlays': null;
  'cactbotLoadUser': { detail: CactbotLoadUserRet };
  'cactbotRequestPlayerUpdate': null;
  'cactbotRequestState': null;
  'cactbotSay': null;
  'cactbotSaveData': null;
  'cactbotLoadData': { data: SavedConfig } | null;
  'cactbotChooseDirectory': { data?: string };
};

type HandlerType = keyof HandlerRequest;

type HandlerFunc = {
  [type in HandlerType]: (msg: HandlerRequest[type]) => Promise<HandlerResponse[type]>;
};

type AnyHandlerRequest = {
  call: HandlerType;
};

type AnyHandlerResponse = {
  type: HandlerType;
  rseq?: number;
} & HandlerResponse[HandlerType];

type AnyCallObj = {
  type: HandlerType | EventType;
};

type AnyResponse = (AnyHandlerResponse & AnyCallObj) | (AnyEventResponse & AnyCallObj);

// #region Window declaration

type AnyListenerCallback = EventCallback[EventType];

// #endregion

// #endregion
