class RaidEmulator extends EventBus {
  static PlaybackSpeed = 10;

  Playing = false;
  CurrentTimestamp = null;
  CurrentLogLineIndex = null;
  LastLogTimestamp = null;

  /**
   * @type {AnalyzedEncounter}
   */
  currentEncounter;

  /**
   * @type {Encounter[]}
   */
  encounters;

  constructor() {
    super();
    this.encounters = [];
    this.currentEncounter = null;
  }
  addEncounter(encounter) {
    this.encounters.push(encounter);
  }
  SetCurrent(index) {
    this.currentEncounter = new AnalyzedEncounter(this.encounters[index]);
    this.currentEncounter.Analyze(this.popupText).then(() => {
      this.dispatch('currentEncounterChanged', this.currentEncounter);
    });
  }
  setCurrentByID(ID) {
    let index = this.encounters.findIndex((v) => {
      return v.ID === ID;
    });
    if (index === -1) {
      return false;
    }
    this.SetCurrent(index);
  }

  selectPerspective(ID) {
    this.currentEncounter.selectPerspective(ID);
    this.seek(this.CurrentTimestamp);
  }

  play() {
    if (this.currentEncounter === null) {
      return false;
    }
    this.CurrentTimestamp = this.CurrentTimestamp || -1;
    this.CurrentLogLineIndex = this.CurrentLogLineIndex || -1;
    // Use setInterval since it should account for differences in execution time automagically
    this.Playing = window.setInterval(this.Tick.bind(this), RaidEmulator.PlaybackSpeed);
    this.dispatch('play');
    return true;
  }

  pause() {
    window.clearInterval(this.Playing);
    this.Playing = null;
    this.dispatch('pause');
    return true;
  }

  async seek(time) {
    await this.dispatch('preSeek', time);
    this.CurrentLogLineIndex = -1;
    let logs = [];
    let offsets = [];
    for (let i = this.CurrentLogLineIndex + 1; i < this.currentEncounter.logLines.length; ++i) {
      if (this.currentEncounter.logLines[i].Offset <= time) {
        logs.push(this.currentEncounter.logLines[i].Line);
        offsets.push(this.currentEncounter.logLines[i].Offset);
        this.LastLogTimestamp = this.currentEncounter.logLines[i].Timestamp;
        ++this.CurrentLogLineIndex;
        await this.dispatch('midSeek', this.currentEncounter.logLines[i].Offset, this.currentEncounter.logLines[i].Line);
        continue;
      }
      break;
    }
    this.CurrentTimestamp = time;
    if (logs.length) {
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });
    }
    await this.dispatch('postSeek', time);
    await this.dispatch('tick', this.CurrentTimestamp, this.LastLogTimestamp);
  }

  async Tick() {
    if (this.CurrentLogLineIndex + 1 >= this.currentEncounter.logLines.length) {
      this.pause();
      return;
    }
    let logs = [];
    let offsets = [];
    for (let i = this.CurrentLogLineIndex + 1; i < this.currentEncounter.logLines.length; ++i) {
      if (this.currentEncounter.logLines[i].Offset <= this.CurrentTimestamp + RaidEmulator.PlaybackSpeed) {
        logs.push(this.currentEncounter.logLines[i].Line);
        offsets.push(this.currentEncounter.logLines[i].Offset);
        this.LastLogTimestamp = this.currentEncounter.logLines[i].Timestamp;
        ++this.CurrentLogLineIndex;
        continue;
      }
      break;
    }
    this.CurrentTimestamp += RaidEmulator.PlaybackSpeed;
    if (logs.length) {
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });
    }
    await this.dispatch('tick', this.CurrentTimestamp, this.LastLogTimestamp);
  }

  setPopupText(popupText) {
    this.popupText = popupText;
  }
};
