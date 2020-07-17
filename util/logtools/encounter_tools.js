'use strict';

let ZoneId = require('../../resources/zone_id.js');
let NetRegexes = require('../../resources/netregexes.js');

let replacements = require('../../ui/raidboss/common_replacement.js');
let commonReplacement = replacements.commonReplacement;
let syncKeys = replacements.syncKeys;

// TODO: add some error checking that a zone has been found before a fight.
// This can happen on partial logs.

class EncounterFinder {
  constructor() {
    this.currentZone = null;
    this.currentFight = null;

    this.regex = {
      changeZone: NetRegexes.changeZone(),
      cactbotWipe: NetRegexes.echo({ line: 'cactbot wipe.*?' }),
      win: NetRegexes.network6d({ command: '40000003' }),
      wipe: NetRegexes.network6d({ command: '40000010' }),
      commence: NetRegexes.network6d({ command: '4000000[16]' }),
      playerAttackingMob: NetRegexes.ability({ sourceId: '1.{7}', targetId: '4.{7}' }),
      mobAttackingPlayer: NetRegexes.ability({ sourceId: '4.{7}', targetId: '1.{7}' }),
    };

    // TODO: handle sealing / unsealing properly, use this to start/stop fights / pick names
    for (const keyName in syncKeys) {
      const key = syncKeys[keyName];
      this.regex[keyName] = {
        en: key,
      };
      for (const lang in commonReplacement[key])
        this.regex[keyName][lang] = commonReplacement[key][lang];
    }
  }

  process(line) {
    let m;

    m = line.match(this.regex.changeZone);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Zone' });
        this.currentFight = null;
      }
      if (this.currentZone !== null)
        this.onEndZone(line, this.currentZone, m.groups);

      this.currentZone = m.groups.name;
      this.onStartZone(line, this.currentZone, m.groups);
      return;
    }

    m = line.match(this.regex.cactbotWipe);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'CactbotWipe' });
        this.currentFight = null;
      }
      return;
    }

    m = line.match(this.regex.wipe);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Wipe' });
        this.currentFight = null;
      }
      return;
    }

    m = line.match(this.regex.win);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Win' });
        this.currentFight = null;
      }
      return;
    }

    if (this.currentFight === null) {
      m = line.match(this.regex.playerAttackingMob);
      if (!m)
        m = line.match(this.regex.mobAttackingPlayer);
      if (m) {
        this.currentFight = this.currentZone;
        this.onStartFight(line, this.currentFight, m.groups);
        return;
      }
    }
  }

  onStartZone(line, name, matches) {}
  onEndZone(line, name, matches) {}
  onStartFight(line, name, matches) {}
  onEndFight(line, name, matches) {}
}

class EncounterCollector extends EncounterFinder {
  constructor() {
    super();
    this.zones = [];
    this.fights = [];

    this.lastZone = null;
    this.lastFight = null;
  }

  dateFromMatches(matches) {
    return new Date(Date.parse(matches.timestamp));
  }

  onStartZone(line, name, matches) {
    this.lastZone = {
      name: name,
      startLine: line,
      zoneId: matches.id,
      startTime: this.dateFromMatches(matches),
    };
  }

  onEndZone(line, name, matches) {
    this.lastZone.endLine = line;
    this.lastZone.endTime = this.dateFromMatches(matches);

    this.zones.push(this.lastZone);
    this.lastZone = null;
  }

  onStartFight(line, name, matches) {
    this.lastFight = {
      name: name,
      startLine: line,
      startTime: this.dateFromMatches(matches),
    };
  }

  onEndFight(line, name, matches) {
    this.lastFight.endLine = line;
    this.lastFight.endTime = this.dateFromMatches(matches);
    this.lastFight.endType = matches.endType;
    // In case we found something better.
    this.lastFight.name = name;

    this.fights.push(this.lastFight);
    this.lastFight = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EncounterFinder: EncounterFinder,
    EncounterCollector: EncounterCollector,
  };
}
