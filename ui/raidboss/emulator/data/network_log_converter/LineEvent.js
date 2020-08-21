'use strict';

/**
 * Generic class to track an FFXIV log line
 */
class LineEvent {
  constructor(repo, line, parts) {
    this.offset = 0; // To be calculated later

    this.parts = parts;

    this.decEvent = parseInt(this.parts[0]);
    this.hexEvent = zeroPad(this.decEvent.toString(16).toUpperCase());

    this.timestamp = +new Date(this.parts[1]);

    this.networkLine = line;
    repo.updateTimestamp(this.timestamp);
  }

  convert() {
    this.convertedLine = this.prefix() + (this.parts.join(':')).replace('|', ':');
  }

  prefix() {
    return '[' + timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';
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

    damage = zeroPad(damage, 8);
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


LineEvent.jobIDToName = {
  '00': 'N/A',
  '01': 'Gla',
  '02': 'Pgl',
  '03': 'Mrd',
  '04': 'Lnc',
  '05': 'Arc',
  '06': 'Cnj',
  '07': 'Thm',
  '08': 'Crp',
  '09': 'Bsm',
  '0A': 'Arm',
  '0B': 'Gsm',
  '0C': 'Ltw',
  '0D': 'Wvr',
  '0E': 'Alc',
  '0F': 'Cul',
  '1A': 'Acn',
  '1B': 'Smn',
  '1C': 'Sch',
  '1D': 'Rog',
  '1E': 'Nin',
  '1F': 'Mch',
  '10': 'Min',
  '11': 'Btn',
  '12': 'Fsh',
  '13': 'Pld',
  '14': 'Mnk',
  '15': 'War',
  '16': 'Drg',
  '17': 'Brd',
  '18': 'Whm',
  '19': 'Blm',
  '20': 'Drk',
  '21': 'Ast',
  '22': 'Sam',
  '23': 'Rdm',
  '24': 'Blu',
  '25': 'Gnb',
  '26': 'Dnc',
};
