'use strict';

/**
 * Generic class to track an FFXIV log line
 */
class LineEvent {
  constructor(repo, line, parts) {
    this.offset = 0; // To be calculated later

    this.parts = parts;

    this.decEvent = parseInt(this.parts[0]);
    this.hexEvent = EmulatorCommon.zeroPad(this.decEvent.toString(16).toUpperCase());

    this.timestamp = +new Date(this.parts[1]);

    this.networkLine = line;
    repo.updateTimestamp(this.timestamp);
  }

  convert() {
    this.convertedLine = this.prefix() + (this.parts.join(':')).replace('|', ':');
  }

  prefix() {
    return '[' + EmulatorCommon.timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';
  }

  static isDamageHallowed(damage) {
    return parseInt(damage, 16) & parseInt('1000', 16);
  }

  static isDamageBig(damage) {
    return parseInt(damage, 16) & parseInt('4000', 16);
  }

  static calculateDamage(damage) {
    if (LineEvent.isDamageHallowed(damage))
      return 0;

    damage = EmulatorCommon.zeroPad(damage, 8);
    let parts = [
      damage.substr(0, 2),
      damage.substr(2, 2),
      damage.substr(4, 2),
      damage.substr(6, 2),
    ];

    if (!LineEvent.isDamageBig(damage))
      return parseInt(parts.slice(0, 2).reverse().join(''), 16);

    return parseInt(
        parts[3] +
      parts[0] +
      (parseInt(parts[1], 16) - parseInt(parts[3], 16)
      ).toString(16), 16);
  }
}
