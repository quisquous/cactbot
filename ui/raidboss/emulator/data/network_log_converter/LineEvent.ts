import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

/**
 * Generic class to track an FFXIV log line
 */
export default class LineEvent {
  public offset = 0;
  public decEvent: number;
  public hexEvent: string;
  public timestamp: number;
  public networkLine: string;
  public convertedLine = '';
  public invalid = false;
  public index = 0;

  constructor(repo: LogRepository, line: string, public parts: string[]) {
    this.decEvent = parseInt(this.parts[0] || '');
    this.hexEvent = EmulatorCommon.zeroPad(this.decEvent.toString(16).toUpperCase());

    this.timestamp = +new Date(this.parts[1] || '');

    this.networkLine = line;
    repo.updateTimestamp(this.timestamp);
  }

  convert(_: LogRepository): void {
    this.convertedLine = this.prefix() + (this.parts.join(':')).replace('|', ':');
  }

  prefix(): string {
    return '[' + EmulatorCommon.timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';
  }

  static isDamageHallowed(damage: string): boolean {
    return (parseInt(damage, 16) & parseInt('1000', 16)) > 0;
  }

  static isDamageBig(damage: string): boolean {
    return (parseInt(damage, 16) & parseInt('4000', 16)) > 0;
  }

  static calculateDamage(damage: string): number {
    if (LineEvent.isDamageHallowed(damage))
      return 0;

    damage = EmulatorCommon.zeroPad(damage, 8);
    const parts = [
      damage.substr(0, 2),
      damage.substr(2, 2),
      damage.substr(4, 2),
      damage.substr(6, 2),
    ] as const;

    if (!LineEvent.isDamageBig(damage))
      return parseInt(parts.slice(0, 2).reverse().join(''), 16);

    return parseInt(
        (parts[3] + parts[0]) +
      (parseInt(parts[1], 16) - parseInt(parts[3], 16)
      ).toString(16), 16);
  }
}
