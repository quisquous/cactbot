class Combatant {
  constructor(ID, Name) {
    this.ID = ID;
    this.Name = Name;
    this.States = {};
    this.SignificantStates = [];
    this.LatestTimestamp = null;
    this.Job = null;
    this.Level = null;
  }

  PushState(Timestamp, State) {
    this.States[Timestamp] = State;
    this.LatestTimestamp = Timestamp;
    if (!this.SignificantStates.includes(Timestamp)) {
      this.SignificantStates.push(Timestamp);
    }
  }

  LatestState() {
    return this.States[this.LatestTimestamp];
  }

  ClosestSignificantState(Timestamp) {
    //Shortcut out if this is significant
    if (this.SignificantStates.includes(Timestamp)) {
      return this.States[Timestamp];
    }

    let ClosestTimestamp = this.SignificantStates[0];
    let Diff = Math.abs(Timestamp - ClosestTimestamp);
    for (let i = 1; i < this.SignificantStates.length; ++i) {
      let TempDiff = Math.abs(Timestamp - this.SignificantStates[i]);
      if (TempDiff < Diff) {
        Diff = TempDiff;
        ClosestTimestamp = this.SignificantStates[i];
      } else {
        break;
      }
    }
    return this.States[ClosestTimestamp];
  }

  PreviousSignificantState(Timestamp) {
    //Shortcut out if this is significant or if there's no lower significant state
    let Index = this.SignificantStates.indexOf(Timestamp);
    if (Index > 0) {
      return this.States[this.SignificantStates[Index - 1]];
    } else if (Index === 0 || Timestamp < this.SignificantStates[0]) {
      return this.States[this.SignificantStates[0]];
    }
    let i = 0;
    for (; i < this.SignificantStates.length; ++i) {
      if (this.SignificantStates[i] > Timestamp) {
        return this.States[this.SignificantStates[i - 1]];
      }
    }
    return this.States[this.SignificantStates[i - 1]];
  }

  NextSignificantState(Timestamp) {
    //Shortcut out if this is significant or if there's no higher significant state
    let Index = this.SignificantStates.indexOf(Timestamp);
    let LastSignificantStateIndex = this.SignificantStates.length - 1;
    if (Index >= 0 && Index < LastSignificantStateIndex) {
      return this.States[this.SignificantStates[Index + 1]];
    } else if (Index === LastSignificantStateIndex || Timestamp > this.SignificantStates[LastSignificantStateIndex]) {
      return this.States[this.SignificantStates[LastSignificantStateIndex]];
    }
    let i = 0;
    for (; i < this.SignificantStates.length; ++i) {
      if (this.SignificantStates[i] > Timestamp) {
        return this.States[this.SignificantStates[i]];
      }
    }
    return this.States[this.SignificantStates[i]];
  }

  PushPartialState(Timestamp, Props) {
    if (this.States[Timestamp] !== undefined) {
      Object.keys(this.States[Timestamp]).filter((k) => {
        return Props.hasOwnProperty(k);
      }).forEach((k) => {
        if (k === 'Visible') {
          this.States[Timestamp][k] = Props[k];
        } else {
          this.States[Timestamp][k] = Number(Props[k]);
        }
      });
    } else {
      this.States[Timestamp] = this.States[this.LatestTimestamp].PartialClone(Props);
    }
    let LastSignificantStateTimestamp = this.SignificantStates[this.SignificantStates.length - 1];
    if (LastSignificantStateTimestamp !== Timestamp &&
      JSON.stringify(this.States[Timestamp]) !== JSON.stringify(this.States[LastSignificantStateTimestamp])) {
      this.SignificantStates.push(Timestamp);
    }
  }
}