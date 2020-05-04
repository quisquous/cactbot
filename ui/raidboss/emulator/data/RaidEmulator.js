'use strict';

class RaidEmulator extends EventBus {
  constructor() {
    super();
    this.encounters = [];
    this.currentEncounter = null;
    this.playing = false;
    this.currentTimestamp = null;
    this.currentLogLineIndex = null;
    this.lastLogTimestamp = null;
  }
  addEncounter(encounter) {
    this.encounters.push(encounter);
  }
  setCurrent(index) {
    this.currentEncounter = new AnalyzedEncounter(this.encounters[index], this);
    this.currentEncounter.Analyze(this.popupText).then(() => {
      this.dispatch('currentEncounterChanged', this.currentEncounter);
    });
  }
  setCurrentByID(id) {
    let index = this.encounters.findIndex((v) => v.id === id);
    if (index === -1)
      return false;

    this.setCurrent(index);
    return true;
  }

  selectPerspective(ID) {
    this.currentEncounter.selectPerspective(ID);
    this.seek(this.currentTimestamp);
  }

  play() {
    if (this.currentEncounter === null)
      return false;

    this.currentTimestamp = this.currentTimestamp || -1;
    this.currentLogLineIndex = this.currentLogLineIndex || -1;
    // Use setInterval since it should account for differences in execution time automagically
    this.playing = window.setInterval(this.tick.bind(this), RaidEmulator.playbackSpeed);
    this.dispatch('play');
    return true;
  }

  pause() {
    window.clearInterval(this.playing);
    this.playing = null;
    this.dispatch('pause');
    return true;
  }

  async seek(time) {
    await this.dispatch('preSeek', time);
    this.currentLogLineIndex = -1;
    let logs = [];
    let offsets = [];
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
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
    if (logs.length)
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });

    await this.dispatch('postSeek', time);
    await this.dispatch('tick', this.currentTimestamp, this.lastLogTimestamp);
  }

  async tick() {
    if (this.currentLogLineIndex + 1 >= this.currentEncounter.encounter.logLines.length) {
      this.pause();
      return;
    }
    let logs = [];
    let offsets = [];
    let lastTimestamp = this.currentTimestamp + RaidEmulator.playbackSpeed;
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
      if (this.currentEncounter.encounter.logLines[i].offset <= lastTimestamp) {
        logs.push(this.currentEncounter.encounter.logLines[i].line);
        offsets.push(this.currentEncounter.encounter.logLines[i].offset);
        this.lastLogTimestamp = this.currentEncounter.encounter.logLines[i].timestamp;
        ++this.currentLogLineIndex;
        continue;
      }
      break;
    }
    this.currentTimestamp += RaidEmulator.playbackSpeed;
    if (logs.length)
      await this.dispatch('EmitLogs', { logs: logs, offsets: offsets });

    await this.dispatch('tick', this.currentTimestamp, this.lastLogTimestamp);
  }

  setPopupText(popupText) {
    this.popupText = popupText;
  }
}

RaidEmulator.playbackSpeed = 10;
