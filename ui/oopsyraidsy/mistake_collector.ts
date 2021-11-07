import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver } from './mistake_observer';

// Collector: forwards observer calls to all observers
// TODO: also store events and broadcast as needed.
export class MistakeCollector {
  private observers: MistakeObserver[] = [];

  AddObserver(observer: MistakeObserver): void {
    this.observers.push(observer);
  }

  OnMistakeObj(timestamp: number, m?: OopsyMistake): void {
    if (!m)
      return;
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'Mistake',
        mistake: m,
      });
    }
  }

  StartEncounter(timestamp: number): void {
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'StartEncounter',
      });
    }
  }

  OnChangeZone(timestamp: number, zoneName: string, zoneId: number): void {
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'ChangeZone',
        zoneName: zoneName,
        zoneId: zoneId,
      });
    }
  }
}
