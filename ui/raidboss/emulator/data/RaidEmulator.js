class RaidEmulator extends EventBus {
  static PlaybackSpeed = 10;

  Playing = false;
  currentTimestamp = null;
  currentLogLineIndex = null;
  lastLogTimestamp = null;

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
  setCurrentByID(id) {
    let index = this.encounters.findIndex((v) => {
      return v.id === id;
    });
    if (index === -1) {
      return false;
    }
    this.SetCurrent(index);
    return true;
  }

  selectPerspective(ID) {
    this.currentEncounter.selectPerspective(ID);
    this.seek(this.currentTimestamp);
  }

  play() {
    if (this.currentEncounter === null) {
      return false;
    }
    this.currentTimestamp = this.currentTimestamp || -1;
    this.currentLogLineIndex = this.currentLogLineIndex || -1;
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
    this.currentLogLineIndex = -1;
    let logs = [];
    let offsets = [];
    for (let i = this.currentLogLineIndex + 1; i < this.currentEncounter.encounter.logLines.length; ++i) {
      if (this.currentEncounter.encounter.logLines[i].offset <= time) {
        logs.push(this.currentEncounter.encounter.logLines[i].line);
        offsets.push(this.currentEncounter.encounter.logLines[i].offset);
        this.lastLogTimestamp = this.currentEncounter.encounter.logLines[i].timestamp;
        ++this.currentLogLineIndex;
        await this.dispatch('midSeek', this.currentEncounter.encounter.logLines[i].offset, this.currentEncounter.encounter.logLines[i].line);
        continue;
      }
      break;
    }
    this.currentTimestamp = time;
    if (logs.length) {
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });
    }
    await this.dispatch('postSeek', time);
    await this.dispatch('tick', this.currentTimestamp, this.lastLogTimestamp);
  }

  async Tick() {
    if (this.currentLogLineIndex + 1 >= this.currentEncounter.encounter.logLines.length) {
      this.pause();
      return;
    }
    let logs = [];
    let offsets = [];
    for (let i = this.currentLogLineIndex + 1; i < this.currentEncounter.encounter.logLines.length; ++i) {
      if (this.currentEncounter.encounter.logLines[i].offset <= this.currentTimestamp + RaidEmulator.PlaybackSpeed) {
        logs.push(this.currentEncounter.encounter.logLines[i].line);
        offsets.push(this.currentEncounter.encounter.logLines[i].offset);
        this.lastLogTimestamp = this.currentEncounter.encounter.logLines[i].timestamp;
        ++this.currentLogLineIndex;
        continue;
      }
      break;
    }
    this.currentTimestamp += RaidEmulator.PlaybackSpeed;
    if (logs.length) {
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });
    }
    await this.dispatch('tick', this.currentTimestamp, this.lastLogTimestamp);
  }

  setPopupText(popupText) {
    this.popupText = popupText;
  }
};
