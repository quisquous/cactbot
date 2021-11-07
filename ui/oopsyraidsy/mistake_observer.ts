import { OopsyMistake } from '../../types/oopsy';

export interface MistakeObserver {
  OnMistakeObj: (m: OopsyMistake) => void;
  StartNewACTCombat: () => void;
  OnChangeZone: (zoneName: string, zoneId: number) => void;
}
