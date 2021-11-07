import { EventResponses } from '../../types/event';
import { OopsyMistake } from '../../types/oopsy';

export interface MistakeObserver {
  OnMistakeObj: (m: OopsyMistake) => void;
  StartNewACTCombat: () => void;
  OnChangeZone: (e: EventResponses['ChangeZone']) => void;
}
