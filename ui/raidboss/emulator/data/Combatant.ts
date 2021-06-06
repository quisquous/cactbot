import CombatantState from './CombatantState';

export default class Combatant {
  id: string;
  name = '';
  server = '';
  states: { [timestamp: number]: CombatantState } = {};
  significantStates: number[] = [];
  latestTimestamp = -1;
  job?: string;
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
    // This is a bit ugly but despite checking that the state exists in the `if` conditions,
    // typescript doesn't infer that these indexed values exist.
    if (index >= 0 && index < lastSignificantStateIndex) {
      const nextStateIndex = this.significantStates[index + 1] as number;
      return this.states[nextStateIndex] as CombatantState;
    } else if (index === lastSignificantStateIndex ||
        timestamp > (this.significantStates[lastSignificantStateIndex] ?? 0)) {
      const nextStateIndex = this.significantStates[lastSignificantStateIndex] as number;
      return this.states[nextStateIndex] as CombatantState;
    }

    for (let i = 0; i < this.significantStates.length; ++i) {
      if (this.significantStates[i] as number > timestamp)
        return this.states[this.significantStates[i] as number] as CombatantState;
    }

    const nextState = this.significantStates[this.significantStates.length - 1] as number;
    return this.states[nextState] as CombatantState;
  }

  pushPartialState(timestamp: number, props: Partial<CombatantState>): void {
    if (this.states[timestamp] === undefined) {
      // Clone the last state before this timestamp
      const stateTimestamp = this.significantStates
        .filter((s) => s < timestamp)
        .sort((a, b) => b - a)[0] ?? this.significantStates[0] as number;
      this.states[timestamp] = (this.states[stateTimestamp] as CombatantState).partialClone(props);
    } else {
      this.states[timestamp] = (this.states[timestamp] as CombatantState).partialClone(props);
    }
    this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);

    const lastSignificantStatetimestamp =
      this.significantStates[this.significantStates.length - 1] as number;
    const oldStateJSON = JSON.stringify(this.states[lastSignificantStatetimestamp]);
    const newStateJSON = JSON.stringify(this.states[timestamp]);

    if (lastSignificantStatetimestamp !== timestamp && newStateJSON !== oldStateJSON)
      this.significantStates.push(timestamp);
  }

  getState(timestamp: number): CombatantState {
    if (this.states[timestamp] !== undefined)
      return this.states[timestamp] as CombatantState;

    if (timestamp < (this.significantStates[0] as number))
      return this.states[this.significantStates[0] as number] as CombatantState;

    let i = 0;
    for (; i < this.significantStates.length; ++i) {
      if ((this.significantStates[i] as number) > timestamp)
        return this.states[this.significantStates[i - 1] as number] as CombatantState;
    }

    return this.states[this.significantStates[i - 1] as number] as CombatantState;
  }
}
