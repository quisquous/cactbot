'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(2\)$/,
  timelineFile: 't7.txt',
  triggers: [
    {
      id: 'T7 Ram',
      regex: Regexes.startsUsing({ id: '860', source: 'Proto-Chimera', capture: false }),
      regexDe: Regexes.startsUsing({ id: '860', source: 'Proto-Chimära', capture: false }),
      regexFr: Regexes.startsUsing({ id: '860', source: 'Protochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: '860', source: 'プロトキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '860', source: '原型奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: '860', source: '프로토 키마이라', capture: false }),
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Ram\'s Voice',
        fr: 'Silence Voix du bélier',
      },
    },
    {
      id: 'T7 Dragon',
      regex: Regexes.startsUsing({ id: '861', source: 'Proto-Chimera', capture: false }),
      regexDe: Regexes.startsUsing({ id: '861', source: 'Proto-Chimära', capture: false }),
      regexFr: Regexes.startsUsing({ id: '861', source: 'Protochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: '861', source: 'プロトキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '861', source: '原型奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: '861', source: '프로토 키마이라', capture: false }),
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Dragon\'s Voice',
        fr: 'Silence Voix du dragon',
      },
    },
    {
      id: 'T7 Tail Slap',
      regex: Regexes.ability({ id: '7A8', source: 'Melusine' }),
      regexDe: Regexes.ability({ id: '7A8', source: 'Melusine' }),
      regexFr: Regexes.ability({ id: '7A8', source: 'Mélusine' }),
      regexJa: Regexes.ability({ id: '7A8', source: 'メリュジーヌ' }),
      regexCn: Regexes.ability({ id: '7A8', source: '美瑠姬奴' }),
      regexKo: Regexes.ability({ id: '7A8', source: '멜뤼진' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.job == 'BLU';
      },
      delaySeconds: 6,
      suppressSeconds: 5,
      infoText: {
        en: 'Tail Slap in 10',
        fr: 'Gifle caudale dans 10',
      },
    },
    {
      id: 'T7 Renaud',
      regex: Regexes.addedCombatant({ name: 'Renaud', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Renaud', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Renaud', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ルノー', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '雷诺', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '르노', capture: false }),
      infoText: {
        en: 'Renaud Add',
        fr: 'Add Renaud',
      },
    },
    {
      id: 'T7 Voice',
      regex: Regexes.gainsEffect({ effect: 'Cursed Voice' }),
      regexDe: Regexes.gainsEffect({ effect: 'Stimme Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Voix Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の声' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之声' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 목소리' }),
      delaySeconds: function(data, matches) {
        return matches.duration - 3;
      },
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Voice Soon',
        fr: 'Voix bientôt',
      },
    },
    {
      id: 'T7 Shriek',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek' }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침' }),
      durationSeconds: 3,
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shriek on YOU',
            fr: 'Cri sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Shriek on ' + data.ShortName(matches.target),
            fr: 'Cri sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T7 Shriek Reminder',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek' }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침' }),
      delaySeconds: 7,
      durationSeconds: 3,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shriek Soon',
            fr: 'Cri bientôt',
          };
        }
        return {
          en: 'Dodge Shriek',
          fr: 'Esquivez le cri',
        };
      },
    },
    {
      id: 'T7 Phase 2',
      regex: Regexes.hasHP({ name: 'Melusine', hp: '79', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Melusine', hp: '79', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Mélusine', hp: '79', capture: false }),
      regexJa: Regexes.hasHP({ name: 'メリュジーヌ', hp: '79', capture: false }),
      regexCn: Regexes.hasHP({ name: '美瑠姬奴', hp: '79', capture: false }),
      regexKo: Regexes.hasHP({ name: '멜뤼진', hp: '79', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T7 Phase 3',
      regex: Regexes.hasHP({ name: 'Melusine', hp: '59', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Melusine', hp: '59', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Mélusine', hp: '59', capture: false }),
      regexJa: Regexes.hasHP({ name: 'メリュジーヌ', hp: '59', capture: false }),
      regexCn: Regexes.hasHP({ name: '美瑠姬奴', hp: '59', capture: false }),
      regexKo: Regexes.hasHP({ name: '멜뤼진', hp: '59', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T7 Phase 4',
      regex: Regexes.hasHP({ name: 'Melusine', hp: '34', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Melusine', hp: '34', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Mélusine', hp: '34', capture: false }),
      regexJa: Regexes.hasHP({ name: 'メリュジーヌ', hp: '34', capture: false }),
      regexCn: Regexes.hasHP({ name: '美瑠姬奴', hp: '34', capture: false }),
      regexKo: Regexes.hasHP({ name: '멜뤼진', hp: '34', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T7 Petrifaction 1',
      regex: Regexes.startsUsing({ id: '7BB', source: 'Lamia Prosector', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7BB', source: 'Lamia-Prosektorin', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7BB', source: 'Lamia Dissectrice', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7BB', source: 'ラミア・プロセクター', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7BB', source: '拉米亚解剖女王', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7BB', source: '라미아 시체해부자', capture: false }),
      alertText: {
        en: 'Look Away!',
        fr: 'Regardez ailleurs !',
      },
    },
    {
      id: 'T7 Petrifaction 2',
      regex: Regexes.startsUsing({ id: '7B1', source: 'Melusine', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7B1', source: 'Melusine', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7B1', source: 'Mélusine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7B1', source: 'メリュジーヌ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7B1', source: '美瑠姬奴', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7B1', source: '멜뤼진', capture: false }),
      alertText: {
        en: 'Look Away!',
        fr: 'Regardez ailleurs !',
      },
    },
    {
      id: 'T7 Tail',
      regex: Regexes.startsUsing({ id: '7B2', source: 'Melusine', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7B2', source: 'Melusine', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7B2', source: 'Mélusine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7B2', source: 'メリュジーヌ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7B2', source: '美瑠姬奴', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7B2', source: '멜뤼진', capture: false }),
      alertText: {
        en: 'Venomous Tail',
        fr: 'Queue venimeuse',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bioweapon Storage': 'Biowaffen-Magazin',
        'Lamia Prosector': 'Lamia-Prosektorin',
        'Melusine': 'Melusine',
      },
      'replaceText': {
        'Circle Blade': 'Kreisklinge',
        'Circle Of Flames': 'Feuerkreis',
        'Cursed Shriek': 'Schrei der Verwünschung',
        'Cursed Voice': 'Stimme der Verwünschung',
        'Deathdancer': 'Todestänzerin',
        'Frenzy': 'Verve',
        'Petrifaction': 'Versteinerung',
        'Red Lotus Blade': 'Rote Lotosklinge',
        'Sacrifice': 'Opferung',
        'Tail Slap': 'Schweifklapser',
        'Venomous Tail': 'Venomschweif',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bioweapon Storage': 'l\'Entrepôt d\'armes biologiques',
        'Lamia Prosector': 'Lamia dissectrice',
        'Melusine': 'Mélusine',
      },
      'replaceText': {
        'Circle Blade': 'Lame circulaire',
        'Circle Of Flames': 'Cercle de flammes',
        'Cursed Shriek': 'Cri maudit',
        'Cursed Voice': 'Voix maudite',
        'Deathdancer': 'Danseuse de mort',
        'Frenzy': 'Frénésie',
        'Petrifaction': 'Pétrification',
        'Red Lotus Blade': 'Lame lotus rouge',
        'Sacrifice': 'Sacrifice',
        'Tail Slap': 'Gifle caudale',
        'Venomous Tail': 'Queue venimeuse',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Lamia Prosector': 'ラミア・プロセクター',
        'Melusine': 'メリュジーヌ',
      },
      'replaceText': {
        'Circle Blade': 'サークルブレード',
        'Circle Of Flames': 'サークル・オブ・フレイム',
        'Cursed Shriek': '呪詛の叫声',
        'Cursed Voice': '呪詛の声',
        'Deathdancer': 'デスダンサー',
        'Frenzy': '熱狂',
        'Petrifaction': 'ペトリファクション',
        'Red Lotus Blade': 'レッドロータス',
        'Sacrifice': '生贄',
        'Tail Slap': 'テールスラップ',
        'Venomous Tail': 'ベノモステール',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Lamia Prosector': '拉米亚解剖女王',
        'Melusine': '美瑠姬奴',
      },
      'replaceText': {
        'Circle Blade': '回旋斩',
        'Circle Of Flames': '地层断裂',
        'Cursed Shriek': '诅咒之嚎',
        'Cursed Voice': '诅咒之声',
        'Deathdancer': '死亡舞师',
        'Frenzy': '狂热',
        'Petrifaction': '石化',
        'Red Lotus Blade': '红莲',
        'Sacrifice': '献祭',
        'Tail Slap': '尾部猛击',
        'Venomous Tail': '猛毒之尾',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Lamia Prosector': '라미아 시체해부자',
        'Melusine': '멜뤼진',
      },
      'replaceText': {
        'Circle Blade': '회전 베기',
        'Circle Of Flames': '화염의 원',
        'Cursed Shriek': '저주의 외침',
        'Cursed Voice': '저주의 목소리',
        'Deathdancer': '죽음무용수',
        'Frenzy': '열광',
        'Petrifaction': '석화',
        'Red Lotus Blade': '홍련의 칼날',
        'Sacrifice': '제물',
        'Tail Slap': '꼬리치기',
        'Venomous Tail': '맹독 꼬리',
      },
    },
  ],
}];
