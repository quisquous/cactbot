'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(1\)$/,
  timelineFile: 't6.txt',
  triggers: [
    {
      id: 'T6 Thorn Whip',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:(\y{Name}):....:....:0012:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:(\y{Name}):....:....:0012:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:(\y{Name}):....:....:0012:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:(\y{Name}):....:....:0012:/,
      run: function(data, matches) {
        data.thornMap = data.thornMap || {};
        data.thornMap[matches[1]] = data.thornMap[matches[1]] || [];
        data.thornMap[matches[1]].push(matches[2]);
        data.thornMap[matches[2]] = data.thornMap[matches[2]] || [];
        data.thornMap[matches[2]].push(matches[1]);
      },
    },
    {
      id: 'T6 Thorn Whip',
      regex: / 1[56]:\y{ObjectId}:Rafflesia:879:Thorn Whip:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Rafflesia:879:Dornenpeitsche:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Rafflesia:879:Fouet de ronces:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:ラフレシア:879:ソーンウィップ:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        let partners = data.thornMap[data.me];
        if (!partners) {
          return {
            en: 'Thorns on YOU',
          };
        }
        if (partners.length == 1) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ')',
          };
        }
        if (partners.length == 2) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
          };
        }
        return {
          en: 'Thorns (' + partners.length + ' people)',
        };
      },
      run: function(data) {
        delete data.thornMap;
      },
    },
    {
      id: 'T6 Honey On',
      regex: Regexes.gainsEffect({ effect: 'Honey-Glazed', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Honigsüß', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Mielleux', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '蜂蜜', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '蜂蜜', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '벌꿀', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.honey = true;
      },
    },
    {
      id: 'T6 Honey Off',
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Honey-Glazed/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Honigsüß/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Mielleux/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of 蜂蜜/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        delete data.honey;
      },
    },
    {
      id: 'T6 Flower',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000D:/,
      alarmText: function(data) {
        if (data.honey) {
          return {
            en: 'Devour: Get Eaten',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.honey)
          return;

        if (data.me == matches[1]) {
          return {
            en: 'Devour: Jump In New Thorns',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.honey || data.me == matches[1])
          return;

        return {
          en: 'Avoid Devour',
        };
      },
    },
    {
      id: 'T6 Phase 2',
      regex: / 0D:Rafflesia HP at 70%/,
      sound: 'Long',
    },
    {
      id: 'T6 Blighted',
      regex: / 14:79D:Rafflesia starts using Blighted Bouquet/,
      regexDe: / 14:79D:Rafflesia starts using Mehltau-Bouquet/,
      regexFr: / 14:79D:Rafflesia starts using Bouquet Mildiousé/,
      regexJa: / 14:79D:ラフレシア starts using ブライテッドブーケ/,
      alarmText: {
        en: 'STOP',
      },
    },
    {
      id: 'T6 Phase 3',
      regex: / 14:79E:Rafflesia starts using Leafstorm/,
      regexDe: / 14:79E:Rafflesia starts using Blättersturm/,
      regexFr: / 14:79E:Rafflesia starts using Tempête De Feuilles/,
      regexJa: / 14:79E:ラフレシア starts using リーフストーム/,
      condition: function(data) {
        return !data.seenLeafstorm;
      },
      sound: 'Long',
      run: function(data) {
        data.seenLeafstorm = true;
      },
    },
    {
      id: 'T6 Swarm',
      regex: / 14:86C:Rafflesia starts using Acid Rain/,
      regexDe: / 14:86C:Rafflesia starts using Säureregen/,
      regexFr: / 14:86C:Rafflesia starts using Pluie Acide/,
      regexJa: / 14:86C:ラフレシア starts using アシッドレイン/,
      infoText: {
        en: 'Stack for Acid',
      },
    },
    {
      id: 'T6 Swarm',
      regex: / 15:\y{ObjectId}:Rafflesia:7A0:Swarm:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Rafflesia:7A0:Fähenfurz:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Rafflesia:7A0:Nuée:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ラフレシア:7A0:スウォーム:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer' || data.job == 'BLU';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Swarm on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Swarm on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T6 Rotten Stench',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000E:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Share Laser (on YOU)',
          };
        }
        return {
          en: 'Share Laser (on ' + data.ShortName(matches[1]) + ')',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge is no longer sealed': 'Der Zugang zum Narbenrand öffnet sich wieder',
        'Scar\'s Edge will be sealed off': 'bis sich der Zugang zum Narbenrand schließt',
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
        'Engage!': 'À l\'attaque !',
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge is no longer sealed': 'Ouverture du Huis de la Marque',
        'Scar\'s Edge will be sealed off': 'Fermeture du Huis de la Marque',
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
        'Spit': 'Crachat morbide',
        'Swarm': 'Nuée',
        'Thorn Whip': 'Fouet de ronces',
        'Viscid Emission': 'Émission visqueuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Rafflesia': 'ラフレシア',
        'Scar\'s Edge is no longer sealed': 'Scar\'s Edge is no longer sealed', // FIXME
        'Scar\'s Edge will be sealed off': 'Scar\'s Edge will be sealed off', // FIXME
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
  ],
}];



