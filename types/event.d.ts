import { Lang } from './global';
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
    darkArts: boolean;
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
    lightningStacks: number;
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
  // #endregion

  // #region Cactbot Event
  // Fill up all event types
  'onForceReload': (ev: {
    type: 'onForceReload';
  }) => void;

  'onGameExistsEvent': (ev: {
    type: 'onGameExistsEvent';
    exists: boolean;
  }) => void;

  'onGameActiveChangedEvent': (ev: {
    type: 'onGameActiveChangedEvent';
    active: boolean;
  }) => void;

  'onLogEvent': (ev: {
    type: 'onLogEvent';
    logs: string[];
  }) => void;

  'onImportLogEvent': (ev: {
    type: 'onImportLogEvent';
    logs: string[];
  }) => void;

  'onInCombatChangedEvent': (ev: {
    type: 'onInCombatChangedEvent';
    inACTCombat: boolean;
    inGameCombat: boolean;
  }) => void;

  'onZoneChangedEvent': (ev: {
    type: 'onZoneChangedEvent';
    zoneName: string;
  }) => void;

  'onFateEvent': (ev: {
    type: 'onFateEvent';
    eventType: 'add' | 'update' | 'remove';
    fateID: number;
    progress: number;
  }) => void;

  'onCEEvent': (ev: {
    type: 'onCEEvent';
    eventType: 'add' | 'update' | 'remove';
    data: {
      popTime: number;
      timeRemaining: number;
      ceKey: number;
      numPlayers: number;
      status: number;
      progress: number;
    };
  }) => void;

  'onPlayerDied': (ev: {
    type: 'onPlayerDied';
  }) => void;

  'onPartyWipe': (ev: {
    type: 'onPartyWipe';
  }) => void;

  'onPlayerChangedEvent': <T extends Job>(ev: {
    type: 'onPlayerChangedEvent';
    detail: {
      name: string;
      job: T;
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
      jobDetail: JobDetail[T];
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
  // #endregion
}

export type EventType = keyof EventMap;

interface CactbotLoadUserRet {
  userLocation: string;
  localUserFiles: Record<string, string> | null;
  parserLanguage: Lang;
  systemLocale: string;
  displayLanguage: Lang;
  /** @deprecated for backwards compatibility, use parserLanguage instead */
  language: Lang;
}

export type IOverlayHandler = {
  // OutputPlugin build-in
  (msg: {
    call: 'subscribe';
    events: string[];
  }): Promise<null>;
  // TODO: add OverlayPlugin build-in handlers
  // Cactbot
  // TODO: fill up all handler types
  (msg: {
    call: 'cactbotReloadOverlays';
  }): Promise<null>;
  (msg: {
    call: 'cactbotLoadUser';
    source: string;
    overlayName: string;
  }): Promise<{ detail: CactbotLoadUserRet }>;
  (msg: {
    call: 'cactbotRequestPlayerUpdate';
  }): Promise<null>;
  (msg: {
    call: 'cactbotRequestState';
  }): Promise<null>;
  (msg: {
    call: 'cactbotSay';
    text: string;
  }): Promise<null>;
  (msg: {
    call: 'cactbotSaveData';
  }): Promise<null>;
  <T>(msg: {
    call: 'cactbotLoadData';
    overlay: string;
  }): Promise<{ data: T } | null>;
  <T>(msg: {
    call: 'cactbotChooseDirectory';
  }): Promise<{ data: T } | null>;
};
