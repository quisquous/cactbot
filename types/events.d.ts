import { Lang } from './global';

export interface LoadUserEvent {
  detail: {
    userLocation: string;
    localUserFiles: Record<string, string>;
    language: Lang;
    parserLanguage: Lang;
    displayLanguage: Lang;
    systemLocale: string;

  };
}

export interface OverlayStateUpdateEvent extends Event {
  detail: {
    isLocked: boolean;
  };
}
