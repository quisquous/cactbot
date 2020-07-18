'use strict';

[{
  zoneRegex: {
    en: /^The Second Coil Of Bahamut - Turn \(1\)$/,
    cn: /^巴哈姆特大迷宫 \(入侵之章1\)$/,
  },
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn1,
  timelineFile: 't6.txt',
  triggers: [
    {
      id: 'T6 Thorn Whip Collect',
      netRegex: NetRegexes.tether({ id: '0012' }),
      run: function(data, matches) {
        data.thornMap = data.thornMap || {};
        data.thornMap[matches.source] = data.thornMap[matches.source] || [];
        data.thornMap[matches.source].push(matches.target);
        data.thornMap[matches.target] = data.thornMap[matches.target] || [];
        data.thornMap[matches.target].push(matches.source);
      },
    },
    {
      id: 'T6 Thorn Whip',
      netRegex: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexDe: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexFr: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexJa: NetRegexes.ability({ id: '879', source: 'ラフレシア' }),
      netRegexCn: NetRegexes.ability({ id: '879', source: '大王花' }),
      netRegexKo: NetRegexes.ability({ id: '879', source: '라플레시아' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        let partners = data.thornMap[data.me];
        if (!partners) {
          return {
            en: 'Thorns on YOU',
            de: 'Dornenpeitsche auf DIR',
            fr: 'Ronces sur VOUS',
            cn: '荆棘点名',
          };
        }
        if (partners.length == 1) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ')',
            de: 'Dornenpeitsche mit (' + data.ShortName(partners[0]) + ')',
            fr: 'Ronces avec (' + data.ShortName(partners[0]) + ')',
            cn: '荆棘与(' + data.ShortName(partners[0]) + ')',
          };
        }
        if (partners.length == 2) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
            de: 'Dornenpeitsche mit (' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
            fr: 'Ronces avec (' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
            cn: '荆棘与(' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
          };
        }
        return {
          en: 'Thorns (' + partners.length + ' people)',
          de: 'Dornenpeitsche mit (' + partners.length + ' Personen)',
          fr: 'Ronces (' + partners.length + ' personne)',
          cn: '荆棘(' + partners.length + ' people)',
        };
      },
      run: function(data) {
        delete data.thornMap;
      },
    },
    {
      // Honey-Glazed
      id: 'T6 Honey On',
      netRegex: NetRegexes.gainsEffect({ effectId: '1BE' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.honey = true;
      },
    },
    {
      id: 'T6 Honey Off',
      netRegex: NetRegexes.losesEffect({ effectId: '1BE' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        delete data.honey;
      },
    },
    {
      id: 'T6 Flower',
      netRegex: NetRegexes.headMarker({ id: '000D' }),
      alarmText: function(data) {
        if (data.honey) {
          return {
            en: 'Devour: Get Eaten',
            de: 'Verschlingen: Gefressen werden',
            fr: 'Dévoration : Faites-vous manger',
            cn: '捕食点名',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.honey)
          return;

        if (data.me == matches.target) {
          return {
            en: 'Devour: Jump In New Thorns',
            de: 'Verschlingen: Spring in die neuen Dornen',
            fr: 'Dévoration : Sautez dans les ronces',
            cn: '去新荆棘',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.honey || data.me == matches.target)
          return;

        return {
          en: 'Avoid Devour',
          de: 'Weiche Verschlingen aus',
          fr: 'Évitez Dévoration',
          cn: '躲开吞食',
        };
      },
    },
    {
      id: 'T6 Phase 2',
      regex: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ラフレシア', hp: '70', capture: false }),
      regexCn: Regexes.hasHP({ name: '大王花', hp: '70', capture: false }),
      regexKo: Regexes.hasHP({ name: '라플레시아', hp: '70', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T6 Blighted',
      netRegex: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '79D', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '79D', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '79D', source: '라플레시아', capture: false }),
      response: Responses.stopEverything(),
    },
    {
      id: 'T6 Phase 3',
      netRegex: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '79E', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '79E', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '79E', source: '라플레시아', capture: false }),
      condition: function(data) {
        return !data.seenLeafstorm;
      },
      sound: 'Long',
      run: function(data) {
        data.seenLeafstorm = true;
      },
    },
    {
      id: 'T6 Swarm Stack',
      netRegex: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '86C', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '86C', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '86C', source: '라플레시아', capture: false }),
      infoText: {
        en: 'Stack for Acid',
        de: 'Sammeln für Säure-Blubberblase',
        fr: 'Packez-vous pour Pluie acide',
        cn: '集合引导酸雨',
      },
    },
    {
      id: 'T6 Swarm',
      netRegex: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexDe: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexFr: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexJa: NetRegexes.ability({ id: '7A0', source: 'ラフレシア' }),
      netRegexCn: NetRegexes.ability({ id: '7A0', source: '大王花' }),
      netRegexKo: NetRegexes.ability({ id: '7A0', source: '라플레시아' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer' || data.job == 'BLU';
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Swarm on YOU',
            de: 'Fähenfurz auf DIR',
            fr: 'Nuée sur VOUS',
            cn: '蜂群点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Swarm on ' + data.ShortName(matches.target),
            de: 'Fähenfurz auf ' + data.ShortName(matches.target),
            fr: 'Nuée sur ' + data.ShortName(matches.target),
            cn: '蜂群点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T6 Rotten Stench',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Share Laser (on YOU)',
            de: 'Geteilter Laser (auf DIR)',
            fr: 'Partagez le laser (sur VOUS)',
            cn: '分摊激光点名',
          };
        }
        return {
          en: 'Share Laser (on ' + data.ShortName(matches.target) + ')',
          de: 'Geteilter Laser (auf ' + data.ShortName(matches.target) + ')',
          fr: 'Partage de laser (sur ' + data.ShortName(matches.target) + ')',
          cn: '分摊激光点(on ' + data.ShortName(matches.target) + ')',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge': 'Narbenrand',
      },
      'replaceText': {
        'Acid Rain': 'Säureregen',
        'Blighted Bouquet': 'Mehltau-Bouquet',
        'Bloody Caress': 'Vampirranke',
        'Briary Growth': 'Wuchernde Dornen',
        'Devour': 'Verschlingen',
        'Floral Trap': 'Saugfalle',
        'Leafstorm': 'Blättersturm',
        'Rotten Stench': 'Fauler Gestank',
        'Spit': 'Ausspeien',
        'Swarm': 'Fähenfurz',
        'Thorn Whip': 'Dornenpeitsche',
        'Viscid Emission': 'Klebsporen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge': 'l\'Huis de la Marque',
      },
      'replaceText': {
        'Acid Rain': 'Pluie acide',
        'Blighted Bouquet': 'Bouquet mildiousé',
        'Bloody Caress': 'Caresse sanglante',
        'Briary Growth': 'Poussée de tige',
        'Devour': 'Dévoration',
        'Floral Trap': 'Piège floral',
        'Leafstorm': 'Tempête de feuilles',
        'Rotten Stench': 'Pestilence nauséabonde',
        'Spit': 'Crachat',
        'Swarm': 'Nuée',
        'Thorn Whip': 'Fouet de ronces',
        'Viscid Emission': 'Émission visqueuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rafflesia': 'ラフレシア',
        'Scar\'s Edge': '傷跡の門戸',
      },
      'replaceText': {
        'Acid Rain': '酸性雨',
        'Blighted Bouquet': 'ブライテッドブーケ',
        'Bloody Caress': 'ブラッディカレス',
        'Briary Growth': 'ブライアリーグロウス',
        'Devour': '捕食',
        'Floral Trap': 'フローラルトラップ',
        'Leafstorm': 'リーフストーム',
        'Rotten Stench': 'ロトンステンチ',
        'Spit': '吐出す',
        'Swarm': 'スウォーム',
        'Thorn Whip': 'ソーンウィップ',
        'Viscid Emission': 'ヴィシドエミッション',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rafflesia': '大王花',
        'Scar\'s Edge': '破损的门前',
      },
      'replaceText': {
        'Acid Rain': '酸雨',
        'Blighted Bouquet': '凋零的花香',
        'Bloody Caress': '血腥的爱抚',
        'Briary Growth': '荆棘丛生',
        'Devour': '捕食',
        'Floral Trap': '鲜花陷阱',
        'Leafstorm': '绿叶风暴',
        'Rotten Stench': '腐烂恶臭',
        'Spit': '呕吐',
        'Swarm': '招蜂香气',
        'Thorn Whip': '荆棘鞭',
        'Viscid Emission': '胶质排放物',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rafflesia': '라플레시아',
        'Scar\'s Edge': '상흔의 입구',
      },
      'replaceText': {
        'Acid Rain': '산성비',
        'Blighted Bouquet': '시든 꽃다발',
        'Bloody Caress': '피의 애무',
        'Briary Growth': '자라는 가시나무',
        'Devour': '포식',
        'Floral Trap': '향기의 덫',
        'Leafstorm': '잎사귀 폭풍',
        'Rotten Stench': '썩은 냄새',
        'Spit': '뱉기',
        'Swarm': '벌레 떼',
        'Thorn Whip': '가시채찍',
        'Viscid Emission': '점액 배출',
      },
    },
  ],
}];
