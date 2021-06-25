import { UnreachableCode } from '../../../../resources/not_reached';
import { RaidbossOptions } from '../../raidboss_options';
import EventBus from '../EventBus';
import RaidEmulatorPopupText from '../overrides/RaidEmulatorPopupText';

import AnalyzedEncounter from './AnalyzedEncounter';
import Encounter from './Encounter';

export default class RaidEmulator extends EventBus {
  static readonly playbackSpeed = 10;

  encounters: Encounter[] = [];
  currentEncounter?: AnalyzedEncounter;
  playingInterval?: number;
  currentLogLineIndex?: number;
  currentLogTime?: number;
  lastLogLineTime?: number;
  lastTickTime?: number;
  popupText?: RaidEmulatorPopupText;

  constructor(public options: RaidbossOptions) {
    super();
    this.options = options;
    this.encounters = [];
  }

  addEncounter(encounter: Encounter): void {
    this.encounters.push(encounter);
  }

  private setCurrent(enc: Encounter): void {
    // If language was autodetected from the encounter, set the current ParserLanguage
    // appropriately
    if (enc.language)
      this.options.ParserLanguage = enc.language;

    this.currentEncounter = new AnalyzedEncounter(this.options, enc, this);
    void this.dispatch('preCurrentEncounterChanged', this.currentEncounter);
    void this.currentEncounter.analyze().then(() => {
      void this.dispatch('currentEncounterChanged', this.currentEncounter);
    });
  }

  setCurrentByID(id: number): boolean {
    const enc = this.encounters.find((v) => v.id === id);
    if (!enc)
      return false;

    this.setCurrent(enc);
    return true;
  }

  selectPerspective(id: string): void {
    if (!this.currentEncounter || !this.popupText)
      throw new UnreachableCode();
    this.currentEncounter.selectPerspective(id, this.popupText);
    if (this.currentLogTime !== undefined)
      void this.seekTo(this.currentLogTime);
  }

  play(): boolean {
    if (!this.currentEncounter)
      return false;

    const firstIndex = this.currentEncounter.encounter.firstLineIndex;

    this.currentLogTime = this.currentLogTime ??
      this.currentEncounter.encounter.logLines[firstIndex]?.timestamp;
    this.currentLogLineIndex = this.currentLogLineIndex || firstIndex - 1;
    this.lastTickTime = Date.now();
    // Need to use a local function make eslint happy, or ignore the eslint rule here?
    const handler = () => {
      void this.tick();
    };
    this.playingInterval = window.setInterval(handler, RaidEmulator.playbackSpeed);
    void this.dispatch('play');
    return true;
  }

  pause(): boolean {
    window.clearInterval(this.playingInterval);
    this.lastTickTime = undefined;
    this.playingInterval = undefined;
    void this.dispatch('pause');
    return true;
  }

  async seek(timeOffset: number): Promise<void> {
    if (!this.currentEncounter || !this.currentEncounter.encounter)
      throw new UnreachableCode();

    const seekTimestamp = this.currentEncounter.encounter.startTimestamp + timeOffset;
    await this.seekTo(seekTimestamp);
  }

  async seekTo(seekTimestamp: number): Promise<void> {
    if (!this.currentEncounter || !this.currentEncounter.encounter)
      throw new UnreachableCode();

    await this.dispatch('preSeek', seekTimestamp);
    this.currentLogLineIndex = -1;
    let logs = [];
    const playing = this.playingInterval !== undefined;
    if (playing)
      this.pause();
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
      const line = this.currentEncounter.encounter.logLines[i];
      if (!line)
        throw new UnreachableCode();

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

  async tick(): Promise<void> {
    if (this.currentLogLineIndex === undefined || !this.currentEncounter ||
      this.lastTickTime === undefined || this.currentLogTime === undefined ||
      !this.currentEncounter.encounter)
      throw new UnreachableCode();
    if (this.currentLogLineIndex + 1 >= this.currentEncounter.encounter.logLines.length) {
      this.pause();
      return;
    }
    if (this.playingInterval === undefined)
      return;
    const logs = [];
    const timeDiff = Date.now() - this.lastTickTime;
    const lastTimestamp = this.currentLogTime + timeDiff;
    for (let i = this.currentLogLineIndex + 1;
      i < this.currentEncounter.encounter.logLines.length;
      ++i) {
      const line = this.currentEncounter.encounter.logLines[i];
      if (!line)
        throw new UnreachableCode();
      if (line.timestamp <= lastTimestamp) {
        logs.push(this.currentEncounter.encounter.logLines[i]);
        this.lastLogLineTime = line.timestamp;
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

  setPopupText(popupText: RaidEmulatorPopupText): void {
    this.popupText = popupText;
  }
}
