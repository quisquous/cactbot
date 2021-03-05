import {
  BRD,
  ChangeZoneEvent,
  DRK,
  GNB,
  InCombatChangedEvent, PLD,
  RDM,
  WAR,
} from './events';

export {};

declare global {
  declare function callOverlayHandler(param: { call: 'cactbotSay'; text: string } | { call: 'cactbotRequestState' }): void

  declare function addOverlayListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void
  ): void;

  declare function addOverlayListener<K extends keyof JobTypeMap>(
      type: 'onPlayerChangedEvent',
      listener: (this: Window, ev: PlayerChangedEvent<K, CustomEventMap[K]>) => void
  ): void;
}


interface CustomEventMap {
  'ChangeZone': ChangeZoneEvent;
  'onInCombatChangedEvent': InCombatChangedEvent;
  'EnmityTargetData': { Target: { Name: string; ID: number; Distance: number } };
  'onGameExistsEvent': { detail: { exists: boolean } };
  'onGameActiveChangedEvent': null;
  'onLogEvent': { detail: { logs: string[] } };
  'onUserFileChanged': { file: string };
  'FileChanged': { file: string };
}

interface _playerChangedDetail<K, D> {
  currentHP: number;
  currentMP: number;
  currentShield: number;
  maxHP: number;
  maxMP: number;
  level: number;
  maxCP: number;
  maxGP: number;
  currentCP: number;
  currentGP: number;
  job: K;
  debugJob: string;
  jobDetail: D;

  pos: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  bait: number;
}


// todo: complete this type
export interface PlayerChangedEvent {
  detail: _playerChangedDetail<'WAR', WAR>
      | _playerChangedDetail<'RDM', RDM>
      | _playerChangedDetail<'DRK', DRK>
      | _playerChangedDetail<'GNB', GNB>
      | _playerChangedDetail<'PLD', PLD>
      | _playerChangedDetail<'BRD', BRD>;
}


