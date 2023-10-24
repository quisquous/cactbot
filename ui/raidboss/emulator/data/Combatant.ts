import { UnreachableCode } from '../../../../resources/not_reached';

import CombatantState from './CombatantState';

export default class Combatant {
  private tempStates?: { [timestamp: number]: Partial<CombatantState> } = {};
  private states: { [timestamp: number]: CombatantState } = {};
  // State indexes are stored both in forward and reverse sequence
  // This prevents having to clone the array and reverse it every frame of playback,
  // or alternatively to have to loop through the array in reverse to find the target
  // timestamp. A slight increase in memory usage of 2-3kb to make the code
  // more readable.
  private stateIndexes: number[] = [];
  private reverseStateIndexes: number[] = [];

  public get firstStateTimestamp(): number {
    const firstIndex = this.stateIndexes[0];
    if (firstIndex === undefined)
      throw new UnreachableCode();
    return firstIndex;
  }

  public get lastStateTimestamp(): number {
    const lastIndex = this.stateIndexes.slice(-1)[0];
    if (lastIndex === undefined)
      throw new UnreachableCode();
    return lastIndex;
  }

  public get firstState(): CombatantState {
    const firstStateIndex = this.firstStateTimestamp;
    return this.getState(firstStateIndex);
  }

  public setState(state: CombatantState, timestamp: number): CombatantState {
    return this.states[timestamp] = state;
  }

  hasState(timestamp: number): boolean {
    return this.states[timestamp] !== undefined;
  }

  nextState(timestamp: number): CombatantState {
    // If timestamp is a state already, return it
    if (this.stateIndexes.includes(timestamp))
      return this.getState(timestamp);

    // Shortcut out if this timestamp is before the first or after the last timestamp
    if (timestamp < this.firstStateTimestamp)
      return this.getState(this.firstStateTimestamp);
    else if (timestamp > this.lastStateTimestamp)
      return this.getState(this.lastStateTimestamp);

    const stateTimestamp = this.stateIndexes.find((ts) => ts > timestamp);

    if (stateTimestamp === undefined)
      throw new UnreachableCode();

    return this.getState(stateTimestamp);
  }

  previousState(timestamp: number): CombatantState {
    // If timestamp is a state already, return it
    if (this.stateIndexes.includes(timestamp))
      return this.getState(timestamp);

    // Shortcut out if this timestamp is before the first or after the last timestamp
    if (timestamp < this.firstStateTimestamp)
      return this.getState(this.firstStateTimestamp);
    else if (timestamp > this.lastStateTimestamp)
      return this.getState(this.lastStateTimestamp);

    const stateTimestamp = this.reverseStateIndexes.find((ts) => ts < timestamp);

    if (stateTimestamp === undefined)
      throw new UnreachableCode();

    return this.getState(stateTimestamp);
  }

  getState(timestamp: number): CombatantState {
    const stateByTimestamp = this.states[timestamp];
    if (stateByTimestamp)
      return stateByTimestamp;

    return this.previousState(timestamp);
  }

  getTempState(timestamp: number): Partial<CombatantState> | undefined {
    if (!this.tempStates)
      throw new Error('Invalid Combatant state');
    return this.tempStates[timestamp];
  }

  pushPartialState(timestamp: number, props: Partial<CombatantState>): Partial<CombatantState> {
    if (!this.tempStates)
      throw new Error('Invalid Combatant state');

    if (this.tempStates[timestamp] === undefined)
      return this.tempStates[timestamp] = props;

    const state = this.tempStates[timestamp];
    if (!state)
      throw new UnreachableCode();
    return this.tempStates[timestamp] = { ...state, ...props };
  }

  finalize(): void {
    if (!this.tempStates)
      throw new Error('Invalid Combatant state');
    const stateEntries = Object.entries(this.tempStates)
      .sort((left, right) => left[0].localeCompare(right[0]));
    if (stateEntries.length < 1)
      return;
    const lastState = {
      key: parseInt(stateEntries[0]?.[0] ?? '0'),
      state: new CombatantState(
        stateEntries[0]?.[1] ?? {},
        stateEntries[0]?.[1]?.targetable ?? false,
      ),
      json: JSON.stringify(stateEntries[0]?.[1]),
    };

    this.states[lastState.key] = lastState.state;
    this.stateIndexes.push(lastState.key);

    for (const state of stateEntries.slice(1)) {
      const curKey = parseInt(state[0] ?? '0');
      let curState = lastState.state.partialClone(state[1]);
      const curJson = JSON.stringify(curState);

      if (curJson !== lastState.json) {
        lastState.state = curState;
      } else {
        // Re-use state to reduce memory usage
        curState = lastState.state;
      }

      this.states[curKey] = curState;
      this.stateIndexes.push(curKey);
    }

    this.reverseStateIndexes = [...this.stateIndexes].reverse();

    delete this.tempStates;
  }
}
