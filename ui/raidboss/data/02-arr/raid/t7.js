'use strict';

[{
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn2,
  timelineFile: 't7.txt',
  triggers: [
    {
      id: 'T7 Ram',
      netRegex: NetRegexes.startsUsing({ id: '860', source: 'Proto-Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '860', source: 'Proto-Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '860', source: 'Protochimère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '860', source: 'プロトキマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '860', source: '原型奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '860', source: '프로토 키마이라', capture: false }),
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Ram\'s Voice',
        de: 'Verstumme Stimme des Widders',
        fr: 'Interrompez Voix du bélier',
        ja: '沈黙: 氷結の咆哮',
        cn: '沉默寒冰咆哮',
      },
    },
    {
      id: 'T7 Dragon',
      netRegex: NetRegexes.startsUsing({ id: '861', source: 'Proto-Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '861', source: 'Proto-Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '861', source: 'Protochimère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '861', source: 'プロトキマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '861', source: '原型奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '861', source: '프로토 키마이라', capture: false }),
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Dragon\'s Voice',
        de: 'Verstumme Stimme des Drachens',
        fr: 'Interrompez Voix du dragon',
        ja: '沈黙: 雷電の咆哮',
        cn: '沉默雷电咆哮',
      },
    },
    {
      id: 'T7 Tail Slap',
      netRegex: NetRegexes.ability({ id: '7A8', source: 'Melusine' }),
      netRegexDe: NetRegexes.ability({ id: '7A8', source: 'Melusine' }),
      netRegexFr: NetRegexes.ability({ id: '7A8', source: 'Mélusine' }),
      netRegexJa: NetRegexes.ability({ id: '7A8', source: 'メリュジーヌ' }),
      netRegexCn: NetRegexes.ability({ id: '7A8', source: '美瑠姬奴' }),
      netRegexKo: NetRegexes.ability({ id: '7A8', source: '멜뤼진' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.job == 'BLU';
      },
      delaySeconds: 6,
      suppressSeconds: 5,
      infoText: {
        en: 'Tail Slap in 10',
        de: 'Schweifklapser in 10',
        fr: 'Gifle caudale dans 10s',
        ja: 'まもなくテールスラップ',
        cn: '10秒内死刑',
      },
    },
    {
      id: 'T7 Renaud',
      netRegex: NetRegexes.addedCombatant({ name: 'Renaud', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Renaud', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Renaud', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ルノー', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '雷诺', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '르노', capture: false }),
      infoText: {
        en: 'Renaud Add',
        de: 'Renaud Add',
        fr: 'Add Renaud',
        ja: '雑魚：ルノー',
        cn: '雷诺出现',
      },
    },
    {
      id: 'T7 Cursed Voice',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C3' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        return matches.duration - 3;
      },
      alertText: {
        en: 'Voice Soon',
        de: 'Stimme Der Verwünschung bald',
        fr: 'Voix du maléfice bientôt',
        ja: 'まもなく呪詛の声',
        cn: '诅咒之声即将判定',
      },
    },
    {
      id: 'T7 Cursed Shriek',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      durationSeconds: 3,
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shriek on YOU',
            de: 'Schrei Der Verwünschung auf DIR',
            fr: 'Cri du maléfice sur VOUS',
            ja: '自分に呪詛の叫声',
            cn: '诅咒之嚎点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Shriek on ' + data.ShortName(matches.target),
            de: 'Schrei Der Verwünschung auf ' + data.ShortName(matches.target),
            fr: 'Cri du maléfice sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'に呪詛の叫声',
            cn: '诅咒之嚎点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T7 Cursed Shriek Reminder',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      delaySeconds: 7,
      durationSeconds: 3,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shriek Soon',
            de: 'Schrei Der Verwünschung bald',
            fr: 'Cri du maléfice bientôt',
            ja: 'まもなく呪詛の叫声',
            cn: '诅咒之嚎即将判定',
          };
        }
        return {
          en: 'Dodge Shriek',
          de: 'Schrei Der Verwünschung ausweichen',
          fr: 'Esquivez le cri maudit',
          ja: '呪詛の叫声に避け',
          cn: '躲避诅咒之嚎',
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
      netRegex: NetRegexes.startsUsing({ id: '7BB', source: 'Lamia Prosector', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7BB', source: 'Lamia-Prosektorin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7BB', source: 'Lamia Dissectrice', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7BB', source: 'ラミア・プロセクター', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7BB', source: '拉米亚解剖女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7BB', source: '라미아 시체해부자', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'T7 Petrifaction 2',
      netRegex: NetRegexes.startsUsing({ id: '7B1', source: 'Melusine', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7B1', source: 'Melusine', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7B1', source: 'Mélusine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7B1', source: 'メリュジーヌ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7B1', source: '美瑠姬奴', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7B1', source: '멜뤼진', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'T7 Tail',
      netRegex: NetRegexes.startsUsing({ id: '7B2', source: 'Melusine', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7B2', source: 'Melusine', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7B2', source: 'Mélusine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7B2', source: 'メリュジーヌ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7B2', source: '美瑠姬奴', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7B2', source: '멜뤼진', capture: false }),
      alertText: {
        en: 'Venomous Tail',
        de: 'Venomschweif',
        fr: 'Queue venimeuse',
        ja: 'ベノモステール',
        cn: '猛毒之尾',
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
        'Proto-Chimera': 'Proto-Chimära',
        'Renaud': 'Renaud',
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
        'Sacrifice': 'Aufopferung',
        'Tail Slap': 'Schweifklapser',
        'Venomous Tail': 'Venomschweif',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bioweapon Storage': 'l\'entrepôt d\'armes biologiques',
        'Lamia Prosector': 'Lamia Dissectrice',
        'Melusine': 'Mélusine',
        'Proto-Chimera': 'Protochimère',
        'Renaud': 'Renaud',
      },
      'replaceText': {
        'Circle Blade': 'Lame circulaire',
        'Circle Of Flames': 'Cercle de flammes',
        'Cursed Shriek': 'Cri maudit',
        'Cursed Voice': 'Voix maudite',
        'Deathdancer Add': 'Add Danseuse de mort',
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
      'replaceSync': {
        'Bioweapon Storage': '生体管理区',
        'Lamia Prosector': 'ラミア・プロセクター',
        'Melusine': 'メリュジーヌ',
        'Proto-Chimera': 'プロトキマイラ',
        'Renaud': 'ルノー',
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
        'Sacrifice': 'サクリファイス',
        'Tail Slap': 'テールスラップ',
        'Venomous Tail': 'ベノモステール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bioweapon Storage': '生体管理区',
        'Lamia Prosector': '拉米亚解剖女王',
        'Melusine': '美瑠姬奴',
        'Proto-Chimera': '原型奇美拉',
        'Renaud': '雷诺',
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
      'replaceSync': {
        'Bioweapon Storage': '생체 관리 구역',
        'Lamia Prosector': '라미아 시체해부자',
        'Melusine': '멜뤼진',
        'Proto-Chimera': '프로토 키마이라',
        'Renaud': '르노',
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
        'Sacrifice': '희생',
        'Tail Slap': '꼬리치기',
        'Venomous Tail': '맹독 꼬리',
      },
    },
  ],
}];
