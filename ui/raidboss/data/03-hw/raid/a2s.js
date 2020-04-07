'use strict';

// TODO: could consider keeping track of the gobbie driver?
// Nothing in the logs for when you get in, other than removing combatanat.
// FDE, FDF, FE0, FE1 are all skills you use when inside.
// 12C0, FE2 are exploding it and getting out.
// There aren't may triggers, so maybe worth just keeping the global callouts
// for bombs and stuns.

[{
  zoneRegex: {
    en: /^Alexander - The Cuff Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章2\)$/,
  },
  timelineFile: 'a2s.txt',
  timelineTriggers: [
    {
      id: 'A2S Breakblock',
      regex: /(?:Brainhurt|Bodyhurt) Breakblock/,
      regexFr: /(?:Spirituel|Corporel) Blindage/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      infoText: {
        en: 'Stun Soon',
        de: 'Bald unterbrechen',
        fr: 'Stun bientôt',
        cn: '马上眩晕',
      },
    },
  ],
  triggers: [
    {
      id: 'A2S Bomb',
      regex: Regexes.addedCombatant({ name: 'Bomb', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Bombe', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Bombe', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '爆弾', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '炸弹', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '폭탄', capture: false }),
      alertText: {
        en: 'Bomb',
        de: 'Bombe',
        fr: 'Bombe',
        cn: '炸弹出现',
      },
    },
    {
      id: 'A2S Prey',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      regexDe: Regexes.ability({ source: 'Gob-Witwe Ix', id: '1413' }),
      regexFr: Regexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      regexJa: Regexes.ability({ source: 'Ix号ゴブリウィドー', id: '1413' }),
      regexCn: Regexes.ability({ source: '9号哥布林黑寡妇', id: '1413' }),
      regexKo: Regexes.ability({ source: 'Ix호 고블린거미', id: '1413' }),
      condition: function(data) {
        return data.role == 'healer' || data.job == 'blu';
      },
      suppressSeconds: 10,
      infoText: function(data, matches) {
        return {
          en: 'Keep ' + data.ShortName(matches.target) + ' topped',
          fr: 'Maintenez ' + data.ShortName(matches.target) + ' Max PV',
          cn: '保持' + data.ShortName(matches.target) + '满血',
        };
      },
    },
    {
      id: 'A2S Prey You',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      regexDe: Regexes.ability({ source: 'Gob-Witwe Ix', id: '1413' }),
      regexFr: Regexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      regexJa: Regexes.ability({ source: 'Ix号ゴブリウィドー', id: '1413' }),
      regexCn: Regexes.ability({ source: '9号哥布林黑寡妇', id: '1413' }),
      regexKo: Regexes.ability({ source: 'Ix호 고블린거미', id: '1413' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: {
        en: 'Boomcannon on YOU',
        de: 'Großeknall auf DIR',
        fr: 'Double cannon sur VOUS',
        cn: '死刑点名',
      },
    },
    {
      id: 'A2S Soldier Spawn',
      regex: Regexes.addedCombatant({ name: 'Gordian Soldier', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Gordios-Soldat', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Soldat Gordien', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ゴルディオス・ソルジャー', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '戈耳狄士兵', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '고르디우스 병사', capture: false }),
      run: function(data) {
        delete data.bangyzoom;
      },
    },
    {
      id: 'A2S Bangyzoom',
      regex: Regexes.ability({ id: 'FD9', target: 'Gordian Soldier', capture: false }),
      regexDe: Regexes.ability({ id: 'FD9', target: 'Gordios-Soldat', capture: false }),
      regexFr: Regexes.ability({ id: 'FD9', target: 'Soldat Gordien', capture: false }),
      regexJa: Regexes.ability({ id: 'FD9', target: 'ゴルディオス・ソルジャー', capture: false }),
      regexCn: Regexes.ability({ id: 'FD9', target: '戈耳狄士兵', capture: false }),
      regexKo: Regexes.ability({ id: 'FD9', target: '고르디우스 병사', capture: false }),
      condition: function(data) {
        return !data.bangyzoom;
      },
      infoText: {
        en: 'Stun Soldier',
        de: 'unterbreche Soldat',
        fr: 'Stun sur le soldat',
        cn: '眩晕士兵',
      },
      run: function(data) {
        data.bangyzoom = true;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'fr',
      'replaceSync': {
        'Boomtype Magitek Gobwalker G-VII': 'Gobblindé magitek G-VII Boumbardier',
        'Giant Bomb': 'Bombe géante',
        'Gordian Hardhelm': 'Casque-dur gordien',
        'Gordian Hardmind': 'Cerveau-dur gordien',
        'Gordian Soldier': 'Soldat gordien',
        'Gordian Sniper': 'Sniper gordien',
        'Jagd Doll': 'Poupée jagd',
        'King Gobtank G-IV': 'Gobtank G-IV roi',
        'Magitek Gobwidow G-IX': 'Gobmygale magitek G-IX',
      },
      'replaceText': {
        'mid': 'milieu',
        'NW': 'NO',
        'SW': 'SO',
        'Bangyzoom': 'Ordre d\'attaque',
        'Blitzstrahl': 'Blitzstrahl',
        'Bodyhurt Breakblock': 'Blindage corporel',
        'Brainhurt Breakblock': 'Blindage spirituel',
        'Boomcannon': 'Double cannon',
        'Carpet Bomb': 'Tapis de bombes',
        'Explosion': 'Explosion',
        'Hardhelm': 'Casque-dur',
        'Hardmind': 'Cerveau-dur',
        'Giant Bomb': 'Bombe géante',
        'Gobwalker': 'Gobblindé',
        'Gobwidow': 'Gobmygale',
        'Jagd Doll': 'Poupée jagd',
        'Kaltstrahl': 'Kaltstrahl',
        'Massive Explosion Enrage': 'Grosse Explosion Enrage',
        'Sniper': 'Sniper',
        'Soldier': 'Soldat',
        'Wave': 'Vague',
      },
    },
  ],
}];
