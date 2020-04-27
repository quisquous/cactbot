class Combatant {
  id;
  name;
  states;
  significantStates;
  latesttimestamp;
  job;
  level;

  constructor(id, name) {
    this.id = id;
    this.name = name.split('(')[0];
    this.states = {};
    this.significantStates = [];
    this.latesttimestamp = null;
    this.job = null;
    this.level = null;
  }

  pushState(timestamp, State) {
    this.states[timestamp] = State;
    this.latesttimestamp = timestamp;
    if (!this.significantStates.includes(timestamp)) {
      this.significantStates.push(timestamp);
    }
  }

  nextSignificantState(timestamp) {
    //Shortcut out if this is significant or if there's no higher significant state
    let index = this.significantStates.indexOf(timestamp);
    let lastSignificantStateindex = this.significantStates.length - 1;
    if (index >= 0 && index < lastSignificantStateindex) {
      return this.states[this.significantStates[index + 1]];
    } else if (index === lastSignificantStateindex || timestamp > this.significantStates[lastSignificantStateindex]) {
      return this.states[this.significantStates[lastSignificantStateindex]];
    }
    let i = 0;
    for (; i < this.significantStates.length; ++i) {
      if (this.significantStates[i] > timestamp) {
        return this.states[this.significantStates[i]];
      }
    }
    return this.states[this.significantStates[i]];
  }

  pushPartialState(timestamp, props) {
    if (this.states[timestamp] !== undefined) {
      Object.keys(this.states[timestamp]).filter((k) => {
        return props.hasOwnProperty(k);
      }).forEach((k) => {
        if (k === 'Visible') {
          this.states[timestamp][k] = props[k];
        } else {
          this.states[timestamp][k] = Number(props[k]);
        }
      });
    } else {
      this.states[timestamp] = this.states[this.latesttimestamp].PartialClone(props);
      this.latesttimestamp = Math.max(this.latesttimestamp,timestamp);
    }
    let lastSignificantStatetimestamp = this.significantStates[this.significantStates.length - 1];
    if (lastSignificantStatetimestamp !== timestamp &&
      JSON.stringify(this.states[timestamp]) !== JSON.stringify(this.states[lastSignificantStatetimestamp])) {
      this.significantStates.push(timestamp);
    }
  }

  getState(timestamp) {
    if (this.states[timestamp] !== undefined) {
      return this.states[timestamp];
    }
    if (timestamp < this.significantStates[0]) {
      return this.states[this.significantStates[0]];
    }
    let i = 0;
    for (; i < this.significantStates.length; ++i) {
      if (this.significantStates[i] > timestamp) {
        return this.states[this.significantStates[i - 1]];
      }
    }
    return this.states[this.significantStates[i - 1]];
  }
}