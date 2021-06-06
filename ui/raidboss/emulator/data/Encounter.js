import CombatantTracker from './CombatantTracker';
import LogEventHandler from './LogEventHandler';
import PetNamesByLang from '../../../../resources/pet_names';
import EmulatorCommon from '../EmulatorCommon';
import LogRepository from './network_log_converter/LogRepository';
import NetworkLogConverter from './NetworkLogConverter';

const isPetName = (name, language = undefined) => {
  if (language)
    return PetNamesByLang[language].includes(name);

  for (const lang in PetNamesByLang) {
    if (PetNamesByLang[lang].includes(name))
      return true;
  }

  return false;
};

export default class Encounter {
  constructor(encounterDay, encounterZoneId, encounterZoneName, logLines) {
    this.version = Encounter.encounterVersion;
    this.id = null;
    this.encounterZoneId = encounterZoneId;
    this.encounterZoneName = encounterZoneName;
    this.encounterDay = encounterDay;
    this.logLines = logLines;
  }

  initialize() {
    this.initialOffset = Number.MAX_SAFE_INTEGER;
    this.endStatus = 'Unknown';
    this.startStatus = new Set();
    this.engageAt = Number.MAX_SAFE_INTEGER;
    this.firstPlayerAbility = Number.MAX_SAFE_INTEGER;
    this.firstEnemyAbility = Number.MAX_SAFE_INTEGER;

    this.firstLineIndex = 0;

    for (let i = 0; i < this.logLines.length; ++i) {
      const line = this.logLines[i];
      let res = EmulatorCommon.matchStart(line.networkLine);
      if (res) {
        this.firstLineIndex = i;
        this.startStatus.add(res.groups.StartType);
        const startIn = parseInt(res.groups.StartIn);
        if (startIn >= 0)
          this.engageAt = Math.min(line.timestamp + startIn, this.engageAt);
      } else {
        res = EmulatorCommon.matchEnd(line.networkLine);
        if (res) {
          this.endStatus = res.groups.EndType;
        } else if (line.id && line.targetId) {
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
      if (res && res.groups && res.groups.language)
        this.language = res.groups.language || this.language;
    }

    this.language = this.language || 'en';

    if (this.firstPlayerAbility === Number.MAX_SAFE_INTEGER)
      this.firstPlayerAbility = null;

    if (this.firstEnemyAbility === Number.MAX_SAFE_INTEGER)
      this.firstEnemyAbility = null;

    if (this.engageAt === Number.MAX_SAFE_INTEGER)
      this.engageAt = null;

    this.combatantTracker = new CombatantTracker(this.logLines, this.language);
    this.startTimestamp = this.combatantTracker.firstTimestamp;
    this.endTimestamp = this.combatantTracker.lastTimestamp;
    this.duration = this.endTimestamp - this.startTimestamp;

    if (this.initialOffset === Number.MAX_SAFE_INTEGER) {
      if (this.engageAt !== null)
        this.initialOffset = this.engageAt - this.startTimestamp;
      else if (this.firstPlayerAbility !== null)
        this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
      else if (this.firstEnemyAbility !== null)
        this.initialOffset = this.firstEnemyAbility - this.startTimestamp;
      else
        this.initialOffset = 0;
    }

    this.playbackOffset = this.logLines[this.firstLineIndex].offset;

    this.startStatus = [...this.startStatus].sort().join(', ');
  }

  shouldPersistFight() {
    return this.firstPlayerAbility > 0 && this.firstEnemyAbility > 0;
  }

  upgrade(version) {
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

Encounter.encounterVersion = 1;
