import { Lang, isLang } from '../../../../resources/languages';
import { UnreachableCode } from '../../../../resources/not_reached';
import PetNamesByLang from '../../../../resources/pet_names';
import EmulatorCommon, { MatchEndInfo, MatchStartInfo } from '../EmulatorCommon';

import CombatantTracker from './CombatantTracker';
import LineEvent, { isLineEventSource, isLineEventTarget } from './network_log_converter/LineEvent';
import LogRepository from './network_log_converter/LogRepository';
import NetworkLogConverter from './NetworkLogConverter';

const isPetName = (name: string, language?: Lang) => {
  if (language)
    return PetNamesByLang[language].includes(name);

  for (const lang in PetNamesByLang) {
    if (!isLang(lang))
      throw new UnreachableCode();
    if (PetNamesByLang[lang].includes(name))
      return true;
  }

  return false;
};

const isValidTimestamp = (timestamp: number) => {
  return timestamp > 0 && timestamp < Number.MAX_SAFE_INTEGER;
};

export default class Encounter {
  private static readonly encounterVersion = 1;
  public id?: number;
  version: number;
  initialOffset = Number.MAX_SAFE_INTEGER;
  endStatus = 'Unknown';
  startStatus = 'Unknown';
  private engageAt = Number.MAX_SAFE_INTEGER;
  private firstPlayerAbility = Number.MAX_SAFE_INTEGER;
  private firstEnemyAbility = Number.MAX_SAFE_INTEGER;
  firstLineIndex = 0;
  combatantTracker?: CombatantTracker;
  startTimestamp = 0;
  endTimestamp = 0;
  duration = 0;
  playbackOffset = 0;
  language: Lang = 'en';
  initialTimestamp = Number.MAX_SAFE_INTEGER;

  constructor(
      public encounterDay: string,
      public encounterZoneId: string,
      public encounterZoneName: string,
      public logLines: LineEvent[]) {
    this.version = Encounter.encounterVersion;
  }

  initialize(): void {
    const startStatuses = new Set<string>();

    this.logLines.forEach((line, i) => {
      if (!line)
        throw new UnreachableCode();

      let res: MatchStartInfo | MatchEndInfo | undefined =
          EmulatorCommon.matchStart(line.networkLine);
      if (res) {
        this.firstLineIndex = i;
        if (res.StartType)
          startStatuses.add(res.StartType);
        const startIn = parseInt(res.StartIn);
        if (startIn >= 0)
          this.engageAt = Math.min(line.timestamp + startIn, this.engageAt);
      } else {
        res = EmulatorCommon.matchEnd(line.networkLine);
        if (res) {
          if (res.EndType)
            this.endStatus = res.EndType;
        } else if (isLineEventSource(line) && isLineEventTarget(line)) {
          if (line.id.startsWith('1') ||
            (line.id.startsWith('4') && isPetName(line.name, this.language))) {
            // Player or pet ability
            if (line.targetId.startsWith('4') && !isPetName(line.targetName, this.language)) {
              // Targetting non player or pet
              this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);
            }
          } else if (line.id.startsWith('4') && !isPetName(line.name, this.language)) {
            // Non-player ability
            if (line.targetId.startsWith('1') || isPetName(line.targetName, this.language)) {
              // Targetting player or pet
              this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);
            }
          }
        }
      }
      const matchedLang = res?.language;
      if (isLang(matchedLang))
        this.language = matchedLang;
    });

    this.combatantTracker = new CombatantTracker(this.logLines, this.language);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;

    if (this.initialOffset === Number.MAX_SAFE_INTEGER) {
      if (this.engageAt < Number.MAX_SAFE_INTEGER)
        this.initialOffset = this.engageAt - this.startTimestamp;
      else if (this.firstPlayerAbility < Number.MAX_SAFE_INTEGER)
        this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
      else if (this.firstEnemyAbility < Number.MAX_SAFE_INTEGER)
        this.initialOffset = this.firstEnemyAbility - this.startTimestamp;
      else
        this.initialOffset = 0;
    }

    this.initialTimestamp = this.startTimestamp + this.initialOffset;

    const firstLine = this.logLines[this.firstLineIndex];

    if (firstLine && firstLine.offset)
      this.playbackOffset = firstLine.offset;

    this.startStatus = [...startStatuses].sort().join(', ');
  }

  shouldPersistFight(): boolean {
    return isValidTimestamp(this.firstPlayerAbility) && isValidTimestamp(this.firstEnemyAbility);
  }

  upgrade(version: number): boolean {
    if (Encounter.encounterVersion <= version)
      return false;

    const repo = new LogRepository();
    const converter = new NetworkLogConverter();
    this.logLines = converter.convertLines(
        this.logLines.map((l) => l.networkLine),
        repo,
    );
    this.version = Encounter.encounterVersion;
    this.initialize();

    return true;
  }
}
