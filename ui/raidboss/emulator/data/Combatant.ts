import { UnreachableCode } from '../../../../resources/not_reached';
import { Job } from '../../../../types/job';

import CombatantState from './CombatantState';

export default class Combatant {
  id: string;
  name = '';
  server = '';
  states: { [timestamp: number]: CombatantState } = {};
  significantStates: number[] = [];
  latestTimestamp = -1;
  job?: Job;
  jobId?: number;
  level?: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.setName(name);
  }

  setName(name: string): void {
    // Sometimes network lines arrive after the combatant has been cleared
    // from memory in the client, so the network line will have a valid ID
    // but the name will be blank. Since we're tracking the name for the
    // entire fight and not on a state-by-state basis, we don't want to
    // blank out a name in this case.
    // If a combatant actually has a blank name, that's still allowed by
    // the constructor.
    if (name === '')
      return;

    const parts = name.split('(');
    this.name = parts[0] ?? '';
    if (parts.length > 1)
      this.server = parts[1]?.replace(/\)$/, '') ?? '';
  }

  hasState(timestamp: number): boolean {
    return this.states[timestamp] !== undefined;
  }

  pushState(timestamp: number, state: CombatantState): void {
    this.states[timestamp] = state;
    this.latestTimestamp = timestamp;
    if (!this.significantStates.includes(timestamp))
      this.significantStates.push(timestamp);
  }

  nextSignificantState(timestamp: number): CombatantState {
    // Shortcut out if this is significant or if there's no higher significant state
    const index = this.significantStates.indexOf(timestamp);
    const lastSignificantStateIndex = this.significantStates.length - 1;
    // If timestamp is a significant state already, and it's not the last one, return the next
    if (index >= 0 && index < lastSignificantStateIndex)
      return this.getStateByIndex(index + 1);
    // If timestamp is the last significant state or the timestamp is past the last significant
    // state, return the last significant state
    else if (
      index === lastSignificantStateIndex ||
      timestamp > (this.significantStates[lastSignificantStateIndex] ?? 0)
    )
      return this.getStateByIndex(lastSignificantStateIndex);

    for (let i = 0; i < this.significantStates.length; ++i) {
      const stateIndex = this.significantStates[i];
      if (stateIndex && stateIndex > timestamp)
        return this.getStateByIndex(i);
    }

    return this.getStateByIndex(this.significantStates.length - 1);
  }

  pushPartialState(timestamp: number, props: Partial<CombatantState>): void {
    if (this.states[timestamp] === undefined) {
      // Clone the last state before this timestamp
      let stateTimestamp = this.significantStates[0] ?? timestamp;
      // It's faster to start at the last timestamp and work our way backwards
      // since realistically timestamp skew is only a couple ms at most
      // Additionally, because cloning a 3000+ element array a few thousand times is slow,
      // don't for-in over a reverse of the array
      for (let i = this.significantStates.length - 1; i >= 0; --i) {
        const ts = this.significantStates[i] ?? 0;
        if (ts <= timestamp) {
          stateTimestamp = ts;
          break;
        }
      }

      if (stateTimestamp === undefined)
        throw new UnreachableCode();
      const state = this.states[stateTimestamp];
      if (!state)
        throw new UnreachableCode();
      this.states[timestamp] = state.partialClone(props);
    } else {
      const state = this.states[timestamp];
      if (!state)
        throw new UnreachableCode();
      this.states[timestamp] = state.partialClone(props);
    }
    this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);

    const lastSignificantStateTimestamp = this.significantStates[this.significantStates.length - 1];
    if (!lastSignificantStateTimestamp)
      throw new UnreachableCode();
    const oldState = this.states[lastSignificantStateTimestamp];
    const newState = this.states[timestamp];
    if (!oldState || !newState)
      throw new UnreachableCode();

    if (
      lastSignificantStateTimestamp !== timestamp &&
      oldState.json &&
      oldState.json !== newState.json
    ) {
      delete oldState.json;
      this.significantStates.push(timestamp);
    }
  }

  getState(timestamp: number): CombatantState {
    const stateByTimestamp = this.states[timestamp];
    if (stateByTimestamp)
      return stateByTimestamp;

    const initialTimestamp = this.significantStates[0];
    if (initialTimestamp === undefined)
      throw new UnreachableCode();
    if (timestamp < initialTimestamp)
      return this.getStateByIndex(0);

    let i = 0;
    for (; i < this.significantStates.length; ++i) {
      const prevTimestamp = this.significantStates[i];
      if (prevTimestamp === undefined)
        throw new UnreachableCode();
      if (prevTimestamp > timestamp)
        return this.getStateByIndex(i - 1);
    }

    return this.getStateByIndex(i - 1);
  }

  finalize(): void {
    for (const state of Object.values(this.states))
      delete state.json;

    if (!this.significantStates.includes(this.latestTimestamp))
      this.significantStates.push(this.latestTimestamp);
  }

  // Should only be called when `index` is valid.
  private getStateByIndex(index: number): CombatantState {
    const stateIndex = this.significantStates[index];
    if (stateIndex === undefined)
      throw new UnreachableCode();
    const state = this.states[stateIndex];
    if (state === undefined)
      throw new UnreachableCode();
    return state;
  }
}
