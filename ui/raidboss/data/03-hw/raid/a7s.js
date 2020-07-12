'use strict';

// TODO: stun call for True Heart sprint ability?

// TODO: can we figure out jails from the location of the tethering gobbie?
// TODO: you can figure out who it is from who the bomb is on, but 8 blu <_<
// Red jail can stay up forever.  The same color can be in different spots.
// Is it possible that for each jail phase, each color is in the same spot?
// One data point:
//   Jail 1: purple(NE), red (NW), green (SE), white (NE)
//   Jail 2: red(NW), green (SW), white (SW), purple (NW)
//   Jail 3: green (NE), purple (SE), red (SW), white (SE)
//   * in this example jail 1 red persisted through jail 1 green/white, but jail 2 red did not.
// Alarums and Lumbertype Magitek get added too late to be useful.

// Timeline:
// Jail 1:
//   Option 1: (bomb on healer)
//     green tether / white prey
//     purple tether / red prey
//   Option 2: (bomb on melee)
//     purple tether / red prey
//     green tether / white prey
// Cat Phase 1
// Jail 2:
//   Option 1: (bomb on healer)
//     red tether / green prey
//     white tether / purple prey
//   Option 2: (bomb on ranged/caster)
//     white tether / purple prey
//     red tether / green prey
// Hammertime
// Cat Phase 2
// Jail 3:
//   Option 1: (2x bombs)
//     green tether / purple prey
//     red tether / white prey
//   Option 2: (sizzlebeam on OT)
//     red tether / white prey
//     green tether / purple prey

[{
  zoneRegex: {
    en: /^Alexander - The Arm Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章3\)$/,
  },
  zoneId: ZoneId.AlexanderTheArmOfTheSonSavage,
  timelineNeedsFixing: true,
  timelineFile: 'a7s.txt',
  triggers: [
    {
      id: 'A7S Phase Counter',
      netRegex: NetRegexes.addedCombatant({ name: 'Shanoa', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Schwarz(?:e|er|es|en) Katze', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Chat-Noir', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'シャノア', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '샤노아', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '夏诺雅', capture: false }),
      run: function(data) {
        data.phase = data.phase || 0;
        data.phase++;
      },
    },
    {
      id: 'A7S Sizzlebeam',
      netRegex: NetRegexes.headMarker({ id: '0018' }),
      alertText: function(data, matches) {
        if (matches.target === data.me) {
          return {
            en: 'Sizzlebeam on YOU',
            de: 'Gobpartikelstrahl auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target !== data.me) {
          return {
            en: 'Sizzlebeam on ' + data.ShortName(matches.target),
            de: 'Gobpartikelstrahl auf ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A7S Sizzlespark',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Denkfix', id: '16F8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Quickthinx Le Cerveau', id: '16F8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '万能のクイックシンクス', id: '16F8', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '만능의 퀵싱크스', id: '16F8', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '万事通 奎克辛克斯', id: '16F8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe('info'),
    },
    {
      id: 'A7S Bomb Tether',
      netRegex: NetRegexes.tether({ source: 'Bomb', id: '001F' }),
      netRegexDe: NetRegexes.tether({ source: 'Bombe', id: '001F' }),
      netRegexFr: NetRegexes.tether({ source: 'Bombe', id: '001F' }),
      netRegexJa: NetRegexes.tether({ source: '爆弾', id: '001F' }),
      netRegexKo: NetRegexes.tether({ source: '폭탄', id: '001F' }),
      netRegexCn: NetRegexes.tether({ source: '炸弹', id: '001F' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Bomb Spread',
        de: 'Bomben verteilen',
      },
    },
    {
      id: 'A7S Jail Prey',
      netRegex: NetRegexes.headMarker({ id: '0029' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Jail Prey',
        de: 'Gefängnis Markierung',
      },
    },
    {
      id: 'A7S Jail Tether',
      // This does not include the initial tether, unfortunately.
      // This is another case of "added combatant with initial tether".
      netRegex: NetRegexes.tether({ source: 'Boomtype Magitek Gobwalker G-VII', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Gobumm-Stampfer Vii', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'Gobblindé Magitek G-Vii Boumbardier', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: 'Vii号ゴブリウォーカーB型', id: '0011' }),
      netRegexKo: NetRegexes.tether({ source: 'Vii호 고블린워커 B형', id: '0011' }),
      netRegexCn: NetRegexes.tether({ source: '爆破型7号哥布林战车', id: '0011' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      infoText: {
        en: 'Jail Tether',
        de: 'Gefängnis Verbindung',
      },
    },
    {
      id: 'A7S Kugelblitz',
      netRegex: NetRegexes.startsUsing({ source: 'Sturm Doll', id: '16FE' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Sturmpuppe', id: '16FE' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Poupée Sturm', id: '16FE' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シュツルムドール', id: '16FE' }),
      netRegexKo: NetRegexes.startsUsing({ source: '인형 폭기병', id: '16FE' }),
      netRegexCn: NetRegexes.startsUsing({ source: '风暴人偶', id: '16FE' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun(),
    },
    {
      id: 'A7S Zoomdoom Clear',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Denkfix', id: '16F4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Quickthinx Le Cerveau', id: '16F4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '万能のクイックシンクス', id: '16F4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '만능의 퀵싱크스', id: '16F4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '万事通 奎克辛克斯', id: '16F4', capture: false }),
      run: function(data) {
        delete data.grabbed;
        delete data.stickyloom;
      },
    },
    {
      id: 'A7S Gobbie Grab',
      netRegex: NetRegexes.ability({ source: 'Quickthinx Allthoughts', id: '15C0' }),
      netRegexDe: NetRegexes.ability({ source: 'Denkfix', id: '15C0' }),
      netRegexFr: NetRegexes.ability({ source: 'Quickthinx Le Cerveau', id: '15C0' }),
      netRegexJa: NetRegexes.ability({ source: '万能のクイックシンクス', id: '15C0' }),
      netRegexKo: NetRegexes.ability({ source: '만능의 퀵싱크스', id: '15C0' }),
      netRegexCn: NetRegexes.ability({ source: '万事通 奎克辛克斯', id: '15C0' }),
      run: function(data, matches) {
        data.grabbed = data.grabbed || [];
        data.grabbed.push(matches.target);
      },
    },
    {
      id: 'A7S Stickyloom',
      netRegex: NetRegexes.ability({ source: 'Boomtype Magitek Gobwalker G-VII', id: '16F2' }),
      netRegexDe: NetRegexes.ability({ source: 'Gobumm-Stampfer Vii', id: '16F2' }),
      netRegexFr: NetRegexes.ability({ source: 'Gobblindé Magitek G-Vii Boumbardier', id: '16F2' }),
      netRegexJa: NetRegexes.ability({ source: 'Vii号ゴブリウォーカーB型', id: '16F2' }),
      netRegexKo: NetRegexes.ability({ source: 'Vii호 고블린워커 B형', id: '16F2' }),
      netRegexCn: NetRegexes.ability({ source: '爆破型7号哥布林战车', id: '16F2' }),
      run: function(data, matches) {
        data.stickyloom = matches.target;
      },
    },
    {
      id: 'A7S Padlock',
      netRegex: NetRegexes.addedCombatant({ name: 'Padlock', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Vorhängeschloss', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Cadenas', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '錠前', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '자물쇠', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '牢门的锁', capture: false }),
      condition: function(data) {
        if (!data.grabbed)
          return false;
        // If you're not in a jail, kill the padlock.
        return !data.grabbed.includes(data.me) && data.stickyloom !== data.me;
      },
      infoText: {
        en: 'Break Padlock',
        de: 'Schloss zerstören',
      },
    },
    {
      id: 'A7S True Heart',
      netRegex: NetRegexes.ability({ source: 'Shanoa', id: '15EC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schwarz(?:e|er|es|en) Katze', id: '15EC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Chat-Noir', id: '15EC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シャノア', id: '15EC', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '샤노아', id: '15EC', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '夏诺雅', id: '15EC', capture: false }),
      alertText: {
        en: 'Kill Heart',
        de: 'Herz besiegen',
      },
    },
    {
      id: 'A7S Searing Wind',
      netRegex: NetRegexes.gainsEffect({ effectId: '178' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Searing Wind on YOU',
        de: 'Versengen auf DIR',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': 'Bombe',
        'Boomtype Magitek Gobwalker G-VII': 'Gobumm-Stampfer VII',
        'Padlock': 'Vorhängeschloss',
        'Quickthinx Allthoughts': 'Denkfix',
        'Shanoa': 'Schwarz(?:e|er|es|en) Katze',
        'Sturm Doll': 'Sturmpuppe',
      },
      'replaceText': {
        'Big Doll': 'Große Puppe',
        'Bomb(?!(s|en))': 'Bombe',
        'Bombs': 'Bomben',
        '(?<![Big|Small] )Doll': 'Puppe',
        'Flamethrower': 'Flammenwerfer',
        'Hammertime': 'Hammertime',
        'Jails': 'Gefängnisse',
        'Get Prey': 'Markierung hohlen',
        'Get Tether': 'Verbindung hohlen',
        'Kill Heart': 'Herz besiegen',
        'Resync': 'Resync',
        'Sizzlebeam': 'Gobpartikelstrahl',
        'Sizzlespark': 'Brutzelblitz',
        'Small Doll(?!s)': 'kleine Puppe',
        'Small Dolls': 'kleine Puppen',
        'Stun Heart': 'Herz unterbrechen',
        'Uplander Doom': 'Knallregen',
        'Zoomdoom': 'Gobrakete',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': 'bombe',
        'Boomtype Magitek Gobwalker G-VII': 'gobblindé magitek G-VII Boumbardier',
        'Padlock': 'cadenas',
        'Quickthinx Allthoughts': 'Quickthinx le Cerveau',
        'Shanoa': 'Chat-noir',
        'Sturm Doll': 'poupée sturm',
      },
      'replaceText': {
        'Bomb': 'bombe',
        'Flamethrower': 'Lance-flammes',
        'Sizzlebeam': 'Gobrayon',
        'Sizzlespark': 'Gobétincelle',
        'Uplander Doom': 'Fusillade',
        'Zoomdoom': 'Gobroquette',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '爆弾',
        'Boomtype Magitek Gobwalker G-VII': 'VII号ゴブリウォーカーB型',
        'Padlock': '錠前',
        'Quickthinx Allthoughts': '万能のクイックシンクス',
        'Shanoa': 'シャノア',
        'Sturm Doll': 'シュツルムドール',
      },
      'replaceText': {
        'Bomb': '爆弾',
        'Flamethrower': 'フレイムスロアー',
        'Sizzlebeam': 'ゴブ式波動砲',
        'Sizzlespark': 'ゴブリスパーク',
        'Uplander Doom': '一斉射撃',
        'Zoomdoom': 'ゴブロケット',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '炸弹',
        'Boomtype Magitek Gobwalker G-VII': '爆破型7号哥布林战车',
        'Padlock': '牢门的锁',
        'Quickthinx Allthoughts': '万事通 奎克辛克斯',
        'Shanoa': '夏诺雅',
        'Sturm Doll': '风暴人偶',
      },
      'replaceText': {
        'Bomb': '炸弹',
        'Flamethrower': '火焰喷射器',
        'Sizzlebeam': '哥布式波动炮',
        'Sizzlespark': '哥布林火花',
        'Uplander Doom': '齐射',
        'Zoomdoom': '哥布火箭',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '폭탄',
        'Boomtype Magitek Gobwalker G-VII': 'VII호 고블린워커 B형',
        'Padlock': '자물쇠',
        'Quickthinx Allthoughts': '만능의 퀵싱크스',
        'Shanoa': '샤노아',
        'Sturm Doll': '인형 폭기병',
      },
      'replaceText': {
        'Bomb': '폭탄',
        'Flamethrower': '화염 방사',
        'Sizzlebeam': '고블린식 파동포',
        'Sizzlespark': '고블린 불꽃',
        'Uplander Doom': '일제 사격',
        'Zoomdoom': '고블린 로켓',
      },
    },
  ],
}];
