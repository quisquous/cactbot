import { ChangeZoneEvent, InCombatChangedEvent, PlayerChangedEvent } from './events';

export {};

declare global {
  type ShadowRootMode = 'open' | 'closed';

  interface ShadowRootInit {
    mode: ShadowRootMode;
    delegatesFocus?: boolean;
  }

  interface ShadowRoot extends DocumentFragment, DocumentOrShadowRoot {
    host: HTMLElement;
    mode: ShadowRootMode;
  }

  interface Element {
    attachShadow: (shadowRootInitDict: ShadowRootInit) => ShadowRoot;

    shadowRoot: ShadowRoot | null;

    createShadowRoot: () => ShadowRoot;
  }

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


// todo: complete this type
export interface PlayerChangedEvent {
  detail: _playerChangedDetail<'WAR', WAR>
      | _playerChangedDetail<'RDM', RDM>
      | _playerChangedDetail<'DRK', DRK>
      | _playerChangedDetail<'GNB', GNB>;
}


