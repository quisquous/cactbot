'use strict';

// TODO: could consider keeping track of the gobbie driver?
// Nothing in the logs for when you get in, other than removing combatanat.
// FDE, FDF, FE0, FE1 are all skills you use when inside.
// 12C0, FE2 are exploding it and getting out.
// There aren't many triggers, so maybe worth just keeping the global callouts
// for bombs and stuns.

[{
  zoneId: ZoneId.AlexanderTheCuffOfTheFatherSavage,
  timelineFile: 'a2s.txt',
  timelineTriggers: [
    {
      id: 'A2S Breakblock',
      regex: /(?:Brainhurt|Bodyhurt) Breakblock/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      infoText: {
        en: 'Stun Soon',
        de: 'Bald unterbrechen',
        fr: 'Stun bientôt',
        cn: '马上眩晕',
        ko: '곧 기절',
      },
    },
  ],
  triggers: [
    {
      id: 'A2S Bomb',
      netRegex: NetRegexes.addedCombatant({ name: 'Bomb', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Bombe', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Bombe', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '爆弾', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '炸弹', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '폭탄', capture: false }),
      alertText: {
        en: 'Bomb',
        de: 'Bombe',
        fr: 'Bombe',
        cn: '炸弹出现',
        ko: '폭탄',
      },
    },
    {
      id: 'A2S Prey',
      netRegex: NetRegexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      netRegexDe: NetRegexes.ability({ source: 'Gob-Witwe Ix', id: '1413' }),
      netRegexFr: NetRegexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      netRegexJa: NetRegexes.ability({ source: 'Ix号ゴブリウィドー', id: '1413' }),
      netRegexCn: NetRegexes.ability({ source: '9号哥布林黑寡妇', id: '1413' }),
      netRegexKo: NetRegexes.ability({ source: 'Ix호 고블린거미', id: '1413' }),
      condition: function(data) {
        return data.role == 'healer' || data.job == 'BLU';
      },
      suppressSeconds: 10,
      infoText: function(data, matches) {
        return {
          en: 'Keep ' + data.ShortName(matches.target) + ' topped',
          de: 'Halte HP von ' + data.ShortName(matches.target) + ' oben',
          fr: 'Maintenez ' + data.ShortName(matches.target) + ' Max PV',
          cn: '保持' + data.ShortName(matches.target) + '满血',
          ko: '"' + data.ShortName(matches.target) + '" 풀피 유지',
        };
      },
    },
    {
      id: 'A2S Prey You',
      netRegex: NetRegexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      netRegexDe: NetRegexes.ability({ source: 'Gob-Witwe Ix', id: '1413' }),
      netRegexFr: NetRegexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      netRegexJa: NetRegexes.ability({ source: 'Ix号ゴブリウィドー', id: '1413' }),
      netRegexCn: NetRegexes.ability({ source: '9号哥布林黑寡妇', id: '1413' }),
      netRegexKo: NetRegexes.ability({ source: 'Ix호 고블린거미', id: '1413' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: {
        en: 'Boomcannon on YOU',
        de: 'Großeknall auf DIR',
        fr: 'Double cannon sur VOUS',
        cn: '死刑点名',
        ko: '우레 포격 대상자',
      },
    },
    {
      id: 'A2S Soldier Spawn',
      netRegex: NetRegexes.addedCombatant({ name: 'Gordian Soldier', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gordios-Soldat', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Soldat Gordien', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ゴルディオス・ソルジャー', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '戈耳狄士兵', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '고르디우스 병사', capture: false }),
      run: function(data) {
        delete data.bangyzoom;
      },
    },
    {
      id: 'A2S Bangyzoom',
      netRegex: NetRegexes.ability({ id: 'FD9', target: 'Gordian Soldier', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'FD9', target: 'Gordios-Soldat', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'FD9', target: 'Soldat Gordien', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'FD9', target: 'ゴルディオス・ソルジャー', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'FD9', target: '戈耳狄士兵', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'FD9', target: '고르디우스 병사', capture: false }),
      condition: function(data) {
        return !data.bangyzoom;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Stun Soldier',
        de: 'unterbreche Soldat',
        fr: 'Stun sur le soldat',
        cn: '眩晕士兵',
        ko: '병사 기절시키기',
      },
      run: function(data) {
        data.bangyzoom = true;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Boomtype Magitek Gobwalker G-VII': 'Gobumm-Stampfer VII',
        'Giant Bomb': 'Trumpfbombe',
        'Gordian Hardhelm': 'Gordios-Harthelm',
        'Gordian Hardmind': 'Gordios-Sturschale',
        'Gordian Sniper': 'Indigohand-Scharfschütze',
        'Gordian Soldier': 'Gordios-Soldat',
        'Hangar 12': 'Lagerhalle 12',
        'Jagd Doll': 'Jagdpuppe',
        'King Gobtank G-IV': 'Königs-Gobmaschine IV',
        'Magitek Gobwidow G-IX': 'Gob-Witwe IX',
        '(?<!Giant )Bomb(?!e)': 'Bombe',
      },
      'replaceText': {
        'Blitzstrahl': 'Blitzstrahl',
        'Bodyhurt Breakblock': 'Dickewand für Großeschmerz',
        'Boomcannon': 'Großeknall',
        'Brainhurt Breakblock': 'Dickewand für Zaubernschmerz',
        'Carpet Bomb': 'Flächenbombardement',
        'Explosion': 'Explosion',
        'Gobwalker': 'Gob-Stampfer',
        'Gobwidow': 'Gob-Witwe',
        'Hardhelm': 'Harthelm',
        'Hardmind': 'Sturschale',
        'Jagd Doll': 'Jagdpuppe',
        'Kaltstrahl': 'Kaltstrahl',
        'Massive Explosion': 'Detonation',
        'Sniper': 'Scharfschütze',
        'Soldier': 'Soldat',
        'Wave': 'Welle',
        'mid': 'Mitte',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<!Giant )Bomb(?!e)': 'Bombe',
        'Boomtype Magitek Gobwalker G-VII': 'gobblindé magitek G-VII Boumbardier',
        'Giant Bomb': 'Bombe géante',
        'Gordian Hardhelm': 'Casque-dur gordien',
        'Gordian Hardmind': 'Cerveau-dur gordien',
        'Gordian Sniper': 'Sniper gordien',
        'Gordian Soldier': 'Soldat gordien',
        'Hangar 12': 'grand hangar GH-12',
        'Jagd Doll': 'Poupée jagd',
        'King Gobtank G-IV': 'Gobtank G-IV Roi',
        'Magitek Gobwidow G-IX': 'Gobmygale magitek G-IX',
      },
      'replaceText': {
        'Blitzstrahl': 'Blitzstrahl',
        'Bodyhurt Breakblock': 'Blindage corporel',
        'Boomcannon': 'Double canon',
        'Brainhurt Breakblock': 'Blindage spirituel',
        'Carpet Bomb': 'Tapis de bombes',
        'Explosion': 'Explosion',
        'Gobwalker': 'Gobblindé',
        'Gobwidow': 'Gobmygale',
        'Hardhelm': 'Casque-dur',
        'Hardmind': 'Cerveau-dur',
        'Jagd Doll': 'Poupée jagd',
        'Kaltstrahl': 'Kaltstrahl',
        'Massive Explosion': 'Explosion massive',
        '\\(NW\\)': '(NO)',
        '\\(SW\\)': '(SO)',
        'Sniper': 'Sniper',
        'Soldier': 'Soldat',
        'Wave': 'Vague',
        '\\(mid\\)': '(milieu)',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Boomtype Magitek Gobwalker G-VII': 'VII号ゴブリウォーカーB型',
        'Giant Bomb': '切り札',
        'Gordian Hardhelm': 'ゴルディオス・ハードヘルム',
        'Gordian Hardmind': 'ゴルディオス・ハードマインド',
        'Gordian Sniper': 'ゴルディオス・スナイパー',
        'Gordian Soldier': 'ゴルディオス・ソルジャー',
        'Hangar 12': '第12大型格納庫',
        'Jagd Doll': 'ヤークトドール',
        'King Gobtank G-IV': 'IV号キング・ゴブリタンク',
        'Magitek Gobwidow G-IX': 'IX号ゴブリウィドー',
      },
      'replaceText': {
        'Blitzstrahl': 'ブリッツシュトラール',
        'Bodyhurt Breakblock': 'ボディブレイクブロック',
        'Boomcannon': 'ブームカノン',
        'Brainhurt Breakblock': 'ブレインブレイクブロック',
        'Carpet Bomb': '絨毯爆撃',
        'Explosion': '爆発',
        'Jagd Doll': 'ヤークトドール',
        'Kaltstrahl': 'カルトシュトラール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Boomtype Magitek Gobwalker G-VII': '爆破型7号哥布林战车',
        'Giant Bomb': '最终炸弹',
        'Gordian Hardhelm': '戈耳狄硬盔兵',
        'Gordian Hardmind': '戈耳狄铁心兵',
        'Gordian Sniper': '戈耳狄狙击手',
        'Gordian Soldier': '戈耳狄士兵',
        'Hangar 12': '第12大型机库',
        'Jagd Doll': '狩猎人偶',
        'King Gobtank G-IV': '4号哥布林坦克王',
        'Magitek Gobwidow G-IX': '9号哥布林黑寡妇',
        '(?<!Giant )Bomb(?!e)': '炸弹',
      },
      'replaceText': {
        'Blitzstrahl': '迅光',
        'Bodyhurt Breakblock': '躯体防护',
        'Boomcannon': '爆炸加农炮',
        'Brainhurt Breakblock': '精神防护',
        'Carpet Bomb': '地毯式轰炸',
        '(?<!Massive )Explosion': '爆炸',
        'Gobwalker': '哥布林战车',
        'Gobwidow': '哥布林黑寡妇',
        'Hardhelm': '戈耳狄硬盔兵',
        'Hardmind': '戈耳狄铁心兵',
        'Jagd Doll': '狩猎人偶',
        'Kaltstrahl': '寒光',
        'Massive Explosion': '大爆炸',
        'Sniper': '戈耳狄狙击手',
        'Soldier': '戈耳狄士兵',
        'Wave': '波',
        '\\(mid\\)': '(中央)',
        '\\(N\\)': '(北)',
        '\\(NW\\)': '(西北)',
        '\\(NE\\)': '(东北)',
        '\\(S\\)': '(南)',
        '\\(SW\\)': '(西南)',
        '\\(SE\\)': '(东南)',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Boomtype Magitek Gobwalker G-VII': 'VII호 고블린워커 B형',
        'Giant Bomb': '대형 폭탄',
        'Gordian Hardhelm': '고르디우스 강화투구',
        'Gordian Hardmind': '고르디우스 강화두뇌',
        'Gordian Sniper': '고르디우스 저격수',
        'Gordian Soldier': '고르디우스 병사',
        'Hangar 12': '제12 대형 격납고',
        'Jagd Doll': '인형 수렵병',
        'King Gobtank G-IV': 'IV호 대왕 고블린탱크',
        'Magitek Gobwidow G-IX': 'IX호 고블린거미',
      },
      'replaceText': {
        'Blitzstrahl': '벼락',
        'Bodyhurt Breakblock': '육체 타격',
        'Boomcannon': '우레 포격',
        'Brainhurt Breakblock': '정신 타격',
        'Carpet Bomb': '융단폭격',
        '(?<!Massive )Explosion': '폭발',
        'Gobwalker': '고블린워커',
        'Gobwidow': '고블린거미',
        'Hardhelm': '강화투구',
        'Hardmind': '강화두뇌',
        'Jagd Doll': '인형 수렵병',
        'Kaltstrahl': '냉병기 공격',
        'Massive Explosion': '대폭발',
        'Sniper': '저격수',
        'Soldier': '병사',
        'Wave': '웨이브',
        '\\(mid\\)': '(중앙)',
        '\\(N\\)': '(북)',
        '\\(NW\\)': '(북서)',
        '\\(NE\\)': '(북동)',
        '\\(S\\)': '(남)',
        '\\(SW\\)': '(남서)',
        '\\(SE\\)': '(남동)',
      },
    },
  ],
}];
