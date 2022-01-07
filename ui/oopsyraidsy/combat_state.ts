import { DamageTracker } from './damage_tracker';

// Handles when to start and stop combat.
// Outside callers (e.g. DamageTracker) can call StartCombat/StopCombat as needed from
// various sources (lines, events) and this will apply hysteresis to only emit
// OnStartEncounter/OnStopEncounter events back to DamageTracker on edge transitions.
export class CombatState {
  public startTime?: number;
  public stopTime?: number;

  constructor(private damageTracker: DamageTracker) {
    this.Reset();
  }

  Reset(): void {
    this.startTime = undefined;
    this.stopTime = undefined;
  }

  StartCombat(timestamp: number): void {
    // Wiping / in combat state / damage are all racy with each other.
    // One potential ordering:
    //   -in combat: false
    //   -wipe
    //   -belated death/damage <-- this damage shouldn't start
    //   -damage (early pull) <-- this damage should
    //   -in combat: true
    // Therefore, suppress "start combat" after wipes within a short
    // period of time.  Gross.
    if (this.startTime !== undefined)
      return;
    const kMinimumSecondsAfterWipe = 5;
    if (this.stopTime && timestamp - this.stopTime < 1000 * kMinimumSecondsAfterWipe)
      return;
    this.startTime = timestamp;
    this.stopTime = undefined;

    this.damageTracker.OnStartEncounter(timestamp);
  }

  StopCombat(timestamp: number): void {
    if (this.stopTime !== undefined)
      return;
    this.startTime = undefined;
    this.stopTime = timestamp;
    this.damageTracker.OnStopEncounter(timestamp);
  }
}
