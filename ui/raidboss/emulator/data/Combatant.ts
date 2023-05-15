import { UnreachableCode } from '../../../../resources/not_reached';

import CombatantState from './CombatantState';

export default class Combatant {
  tempStates?: { [timestamp: number]: Partial<CombatantState> } = {};
  states: { [timestamp: number]: CombatantState } = {};
  significantStates: number[] = [];

  hasState(timestamp: number): boolean {
    return this.states[timestamp] !== undefined;
  }

  pushState(timestamp: number, state: CombatantState): void {
    if (!this.tempStates)
      throw new Error('Invalid Combatant state');
    this.tempStates[timestamp] = state;
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
    if (!this.tempStates)
      throw new Error('Invalid Combatant state');
    if (this.tempStates[timestamp] === undefined) {
      this.tempStates[timestamp] = props;
    } else {
      const state = this.tempStates[timestamp];
      if (!state)
        throw new UnreachableCode();
      this.tempStates[timestamp] = { ...state, ...props };
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
    this.significantStates.push(lastState.key);

    for (const state of stateEntries.slice(1)) {
      const curKey = parseInt(state[0] ?? '0');
      let curState = lastState.state.partialClone(state[1]);
      const curJson = JSON.stringify(curState);

      if (curJson !== lastState.json) {
        this.significantStates.push(curKey);
        lastState.key = curKey;
        lastState.state = curState;
        lastState.json = curJson;
      } else {
        // Re-use state to reduce memory usage
        curState = lastState.state;
      }

      this.states[curKey] = curState;
    }

    delete this.tempStates;
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
