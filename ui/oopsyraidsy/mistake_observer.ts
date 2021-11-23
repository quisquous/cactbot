import { OopsyMistake } from '../../types/oopsy';

export type ViewEvent = {
  timestamp: number;
  type: 'Mistake';
  mistake: OopsyMistake;
} | {
  timestamp: number;
  type: 'StartEncounter';
} | {
  timestamp: number;
  type: 'ChangeZone';
  zoneName: string;
  zoneId: number;
};

export interface MistakeObserver {
  OnEvent: (event: ViewEvent) => void;
  OnSyncEvents: (events: ViewEvent[]) => void;
}
