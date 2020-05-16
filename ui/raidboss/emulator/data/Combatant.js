'use strict';

class Combatant {
  constructor(id, name) {
    this.id = id;
    this.name = '';
    this.server = '';
    this.setName(name);
    this.states = {};
    this.significantStates = [];
    this.latestTimestamp = null;
    this.job = null;
    this.level = null;
  }

  setName(name) {
    if (name === '')
      return;

    let parts = name.split('(');
    this.name = parts[0];
    if (parts.length > 1)
      this.server = parts[1].replace(/\)$/, '');
  }

  hasState(timestamp) {
    return this.states[timestamp] !== undefined;
  }

  pushState(timestamp, State) {
    this.states[timestamp] = State;
    this.latestTimestamp = timestamp;
    if (!this.significantStates.includes(timestamp))
      this.significantStates.push(timestamp);
  }

  nextSignificantState(timestamp) {
    // Shortcut out if this is significant or if there's no higher significant state
    let index = this.significantStates.indexOf(timestamp);
    let lastSignificantStateindex = this.significantStates.length - 1;
    if (index >= 0 && index < lastSignificantStateindex)
      return this.states[this.significantStates[index + 1]];
    else if (index === lastSignificantStateindex ||
        timestamp > this.significantStates[lastSignificantStateindex])
      return this.states[this.significantStates[lastSignificantStateindex]];

    for (let i = 0; i < this.significantStates.length; ++i) {
      if (this.significantStates[i] > timestamp)
        return this.states[this.significantStates[i]];
    }
    return this.states[this.significantStates[this.significantStates.length - 1]];
  }

  pushPartialState(timestamp, props) {
    if (this.states[timestamp] !== undefined) {
      Object.keys(this.states[timestamp]).filter((k) => {
        return props[k] !== undefined;
      }).forEach((k) => {
        if (k === 'Visible')
          this.states[timestamp][k] = props[k];
        else
          this.states[timestamp][k] = Number(props[k]);
      });
    } else {
      this.states[timestamp] = this.states[this.latestTimestamp].partialClone(props);
      this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);
    }
    let lastSignificantStatetimestamp = this.significantStates[this.significantStates.length - 1];
    let oldStateJSON = JSON.stringify(this.states[lastSignificantStatetimestamp]);
    let newStateJSON = JSON.stringify(this.states[timestamp]);

    if (lastSignificantStatetimestamp !== timestamp && newStateJSON !== oldStateJSON)
      this.significantStates.push(timestamp);
  }

  getState(timestamp) {
    if (this.states[timestamp] !== undefined)
      return this.states[timestamp];

    if (timestamp < this.significantStates[0])
      return this.states[this.significantStates[0]];

    let i = 0;
    for (; i < this.significantStates.length; ++i) {
      if (this.significantStates[i] > timestamp)
        return this.states[this.significantStates[i - 1]];
    }

    return this.states[this.significantStates[i - 1]];
  }
}
