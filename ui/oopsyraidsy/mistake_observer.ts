import { EventResponses } from '../../types/event';
import { OopsyMistake } from '../../types/oopsy';

export interface MistakeObserver {
  SetInCombat: (inCombat: boolean) => void;
  OnMistakeObj: (m: OopsyMistake) => void;
  StartNewACTCombat: () => void;
  OnChangeZone: (e: EventResponses['ChangeZone']) => void;
}
