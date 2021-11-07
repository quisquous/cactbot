import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver } from './mistake_observer';

// Collector: forwards observer calls to all observers
// TODO: also handle syncing of events
export class MistakeCollector implements MistakeObserver {
  private observers: MistakeObserver[] = [];

  AddObserver(observer: MistakeObserver): void {
    this.observers.push(observer);
  }

  OnMistakeObj(m?: OopsyMistake): void {
    if (!m)
      return;
    for (const observer of this.observers)
      observer.OnMistakeObj(m);
  }

  StartNewACTCombat(): void {
    // TODO: This message should probably include the timestamp
    // for when combat started.  Starting here is not the right
    // time if this plugin is loaded while ACT is already in combat.
    for (const observer of this.observers)
      observer.StartNewACTCombat();
  }

  OnChangeZone(zoneName: string, zoneId: number): void {
    for (const observer of this.observers)
      observer.OnChangeZone(zoneName, zoneId);
  }
}
