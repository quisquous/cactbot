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

interface PlayerChangedRet {
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
  // TODO: Is there a cleaner way to do this? It would be better if there were a way to
  // determine which job was passed in with the event and explicitly use that JobDetail
  // Potentially add the job to the jobDetail passed back from the C# plugin, and use
  // that information to decide the type
  jobDetail: JobDetail['PLD'] & JobDetail['WAR'] & JobDetail['DRK'] & JobDetail['GNB'] & JobDetail['WHM'] &
    JobDetail['SCH'] & JobDetail['AST'] & JobDetail['PGL'] & JobDetail['MNK'] & JobDetail['DRG'] &
    JobDetail['NIN'] & JobDetail['SAM'] & JobDetail['BRD'] & JobDetail['MCH'] & JobDetail['DNC'] &
    JobDetail['THM'] & JobDetail['BLM'] & JobDetail['ACN'] & JobDetail['SMN'] & JobDetail['RDM'];
  pos: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  bait: number;
  debugJob: string;
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
  (msg: {
    call: 'cactbotLoadData';
    overlay: string;
  }): Promise<{ data: SavedConfig } | null>;
  <T>(msg: {
    call: 'cactbotChooseDirectory';
  }): Promise<{ data: T } | null>;
};
