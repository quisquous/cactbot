import EventBus from '../EventBus';
import AnalyzedEncounter from './AnalyzedEncounter';

export default class RaidEmulator extends EventBus {
  constructor(options) {
    super();
    this.options = options;
    this.encounters = [];
    this.currentEncounter = null;
    this.playingInterval = null;
    this.currentLogLineIndex = null;
    this.lastLogLineTime = null;
    this.lastTickTime = null;
  }
  addEncounter(encounter) {
    this.encounters.push(encounter);
  }
  setCurrent(index) {
    const enc = this.encounters[index];

    // If language was autodetected from the encounter, set the current ParserLanguage
    // appropriately
    if (enc.language)
      this.options.ParserLanguage = enc.language;

    this.currentEncounter = new AnalyzedEncounter(this.options, enc, this);
    this.dispatch('preCurrentEncounterChanged', this.currentEncounter);
    this.currentEncounter.analyze().then(() => {
      this.dispatch('currentEncounterChanged', this.currentEncounter);
    });
  }
  setCurrentByID(id) {
    const index = this.encounters.findIndex((v) => v.id === id);
    if (index === -1)
      return false;

    this.setCurrent(index);
    return true;
  }

  selectPerspective(ID) {
    this.currentEncounter.selectPerspective(ID, this.popupText);
    this.seekTo(this.currentLogTime);
  }

  play() {
    if (this.currentEncounter === null)
      return false;

    const firstIndex = this.currentEncounter.encounter.firstLineIndex;

    this.currentLogTime = this.currentLogTime ||
      this.currentEncounter.encounter.logLines[firstIndex].timestamp;
    this.currentLogLineIndex = this.currentLogLineIndex || firstIndex - 1;
    this.lastTickTime = Date.now();
    this.playingInterval = window.setInterval(this.tick.bind(this), RaidEmulator.playbackSpeed);
    this.dispatch('play');
    return true;
  }

  pause() {
    window.clearInterval(this.playingInterval);
    this.lastTickTime = null;
    this.playingInterval = null;
    this.dispatch('pause');
    return true;
  }

  async seek(timeOffset) {
    const seekTimestamp = this.currentEncounter.encounter.startTimestamp + timeOffset;
    return await this.seekTo(seekTimestamp);
  }

  async seekTo(seekTimestamp) {
    await this.dispatch('preSeek', seekTimestamp);
    this.currentLogLineIndex = -1;
    let logs = [];
    const playing = this.playingInterval !== null;
    if (playing)
      this.pause();
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
      const line = this.currentEncounter.encounter.logLines[i];
      if (line.timestamp <= seekTimestamp) {
        logs.push(line);
        // Bunch emitted lines for performance reasons
        if (logs.length > 100) {
          await this.dispatch('emitLogs', { logs: logs });
          logs = [];
        }
        this.currentLogTime = this.lastLogLineTime = line.timestamp;
        ++this.currentLogLineIndex;
        await this.dispatch('midSeek', line);
        continue;
      }
      break;
    }

    // Emit any remaining lines if needed
    if (logs.length) {
      await this.dispatch('emitLogs', { logs: logs });
      await this.dispatch('midSeek', logs.pop());
    }

    await this.dispatch('postSeek', seekTimestamp);
    await this.dispatch('tick', this.currentLogTime, this.lastLogLineTime);
    if (playing)
      this.play();
  }

  async tick() {
    if (this.currentLogLineIndex + 1 >= this.currentEncounter.encounter.logLines.length) {
      this.pause();
      return;
    }
    if (this.playingInterval === null)
      return;
    const logs = [];
    const timeDiff = Date.now() - this.lastTickTime;
    const lastTimestamp = this.currentLogTime + timeDiff;
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
      if (this.currentEncounter.encounter.logLines[i].timestamp <= lastTimestamp) {
        logs.push(this.currentEncounter.encounter.logLines[i]);
        this.lastLogLineTime = this.currentEncounter.encounter.logLines[i].timestamp;
        ++this.currentLogLineIndex;
        continue;
      }
      break;
    }
    this.currentLogTime += timeDiff;
    this.lastTickTime += timeDiff;
    if (logs.length)
      await this.dispatch('emitLogs', { logs: logs });

    await this.dispatch('tick', this.currentLogTime, this.lastLogLineTime);
  }

  setPopupText(popupText) {
    this.popupText = popupText;
  }
}

RaidEmulator.playbackSpeed = 10;
