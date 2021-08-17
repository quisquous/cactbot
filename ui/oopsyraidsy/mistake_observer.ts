import { EventResponses } from '../../types/event';

export interface MistakeObserver {
  SetInCombat: (inCombat: boolean) => void;
  AddLine: (iconClass: string, text: string, time: string) => void;
  StartNewACTCombat: () => void;
  OnChangeZone: (e: EventResponses['ChangeZone']) => void;
}
