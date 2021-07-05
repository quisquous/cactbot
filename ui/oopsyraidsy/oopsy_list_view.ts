import { EventResponses } from '../../types/event';

export interface OopsyListView {
  SetInCombat: (inCombat: boolean) => void;
  AddLine: (iconClass: string, text: string, time: string) => void;
  StartNewACTCombat: () => void;
  OnChangeZone: (e: EventResponses['ChangeZone']) => void;
}
