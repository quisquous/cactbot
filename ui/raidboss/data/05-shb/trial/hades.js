'use strict';

[{
  zoneRegex: /^(The Dying Gasp|哈迪斯歼灭战)$/,
  timelineFile: 'hades.txt',
  triggers: [
    {
      id: 'Hades Phase Tracker',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexCn: / 14:4180:哈迪斯 starts using 诸神之战/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      run: function(data) {
        data.neoHades = true;
      },
    },
    {
      id: 'Hades Ravenous Assault',
      regex: / 14:4158:Hades starts using Ravenous Assault on (\y{Name})/,
      regexCn: / 14:4158:哈迪斯 starts using 贪婪突袭 on (\y{Name})/,
      regexDe: / 14:4158:Hades starts using Fegefeuer der Helden on (\y{Name})/,
      regexFr: / 14:4158:Hadès starts using Assaut [aA]charné on (\y{Name})/,
      regexJa: / 14:4158:ハーデス starts using ラヴェナスアサルト on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑 ->' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Away From ' + data.ShortName(matches[1]),
          de: 'Weg von ' + data.ShortName(matches[1]),
          fr: 'Loin de ' + data.ShortName(matches[1]),
          cn: '远离 ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Hades Bad Faith Left',
      regex: / 14:4149:Hades starts using Bad Faith/,
      regexCn: / 14:4149:哈迪斯 starts using 失信/,
      regexDe: / 14:4149:Hades starts using Maske des Grolls/,
      regexFr: / 14:4149:Hadès starts using Mauvaise [fF]oi/,
      regexJa: / 14:4149:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'Hades Bad Faith Right',
      regex: / 14:414A:Hades starts using Bad Faith/,
      regexCn: / 14:414A:哈迪斯 starts using 失信/,
      regexDe: / 14:414A:Hades starts using Maske des Grolls/,
      regexFr: / 14:414A:Hadès starts using Mauvaise [fF]oi/,
      regexJa: / 14:414A:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'Hades Broken Faith',
      regex: / 14:414D:Hades starts using Broken Faith/,
      regexCn: / 14:414D:哈迪斯 starts using 背信/,
      regexDe: / 14:414D:Hades starts using Maske der Trauer/,
      regexFr: / 14:414D:Hadès starts using Foi [bB]risée/,
      regexJa: / 14:414D:ハーデス starts using ブロークンフェイス/,
      alertText: {
        en: 'Dodge Giant Circles',
        de: 'Weiche dem großen Kreis aus',
        fr: 'Evitez les cercles géants',
        cn: '躲避大圈',
      },
    },
    {
      id: 'Hades Echo Right',
      regex: / 14:4164:Hades starts using Echo [Oo]f [Tt]he Lost/,
      regexCn: / 14:4164:哈迪斯 starts using 逝者的回声/,
      regexDe: / 14:4164:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4164:Hadès starts using Écho [dD]es [dD]isparus/,
      regexJa: / 14:4164:ハーデス starts using エコー・オブ・ザ・ロスト/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Gauche',
        cn: '右',
      },
    },
    {
      id: 'Hades Echo Left',
      regex: / 14:4163:Hades starts using Echo [Oo]f [Tt]he Lost/,
      regexCn: / 14:4163:哈迪斯 starts using 逝者的回声/,
      regexDe: / 14:4163:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4163:Hadès starts using Écho [dD]es [dD]isparus/,
      regexJa: / 14:4163:ハーデス starts using エコー・オブ・ザ・ロスト/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'Hades Titanomachy',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexCn: / 14:4180:哈迪斯 starts using 诸神之战/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'Hades Shadow Stream',
      regex: / 14:415C:Hades starts using Shadow Stream/,
      regexCn: / 14:415C:哈迪斯 starts using 暗影流/,
      regexDe: / 14:415C:Hades starts using Schattenstrom/,
      regexFr: / 14:415C:Hadès starts using Flux [dD]e Ténèbres/,
      regexJa: / 14:415C:ハーデス starts using シャドウストリーム/,
      alertText: {
        en: 'Go Outside',
        de: 'Raus gehen',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
        cn: '两侧躲避',
      },
    },
    {
      id: 'Hades Purgation',
      regex: / 14:4170:Hades starts using Polydegmon's Purgation/,
      regexCn: / 14:4170:哈迪斯 starts using 冥王净化/,
      regexDe: / 14:4170:Hades starts using Schlag des Polydegmon/,
      regexFr: / 14:4170:Hadès starts using Assaut [dD]u Polydegmon/,
      regexJa: / 14:4170:ハーデス starts using ポリデグモンストライク/,
      alertText: {
        en: 'Get Middle',
        de: 'In die Mitte gehen',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
        cn: '中间躲避',
      },
    },
    {
      id: 'Hades Doom',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Doom/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 死亡宣告/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Verhängnis/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Glas/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 死の宣告/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Cleanse Doom In Circle',
        de: 'Entferne Verhängnis mit den Kreisen',
        fr: 'Dispell le Glas',
        cn: '踩光圈',
      },
    },
    {
      id: 'Hades Wail of the Lost Right',
      regex: / 14:4166:Hades starts using Wail [Oo]f [Tt]he Lost/,
      regexCn: / 14:4166:哈迪斯 starts using 逝者的哀嚎/,
      regexDe: / 14:4166:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4166:Hadès starts using Lamentation [dD]es [dD]isparus/,
      regexJa: / 14:4166:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: {
        en: 'Right Knockback',
        de: 'Rechter Knockback',
        fr: 'Poussée à droite',
        cn: '右侧击退',
      },
    },
    {
      id: 'Hades Wail of the Lost Left',
      regex: / 14:4165:Hades starts using Wail [Oo]f [Tt]he Lost/,
      regexCn: / 14:4165:哈迪斯 starts using 逝者的哀嚎/,
      regexDe: / 14:4165:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4165:Hadès starts using Lamentation [dD]es [dD]isparus/,
      regexJa: / 14:4165:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: {
        en: 'Left Knockback',
        de: 'Linker Knockback',
        fr: 'Poussée à gauche',
        cn: '左侧击退',
      },
    },
    {
      id: 'Hades Dual Strike Healer',
      regex: / 14:4161:Hades starts using Dual Strike/,
      regexCn: / 14:4161:哈迪斯 starts using 双重强袭/,
      regexDe: / 14:4161:Hades starts using Doppelschlag/,
      regexFr: / 14:4161:Hadès starts using Frappe [rR]edoublée/,
      regexJa: / 14:4161:ハーデス starts using デュアルストライク/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Busters',
        de: 'Tank Buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '坦克死刑',
      },
    },
    {
      id: 'Hades Dual Strike',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.neoHades && data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster Spread',
        de: 'Tank Buster verteilen',
        fr: 'Tankbuster, séparez-vous',
        cn: '坦克死刑分散',
      },
    },
    {
      id: 'Hades Hellborn Yawp',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0028:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Marker Outside',
        de: 'Marker ausen ablegen',
        fr: 'Posez la marque à l\'extérieur',
        cn: '外侧放点名',
      },
    },
    {
      id: 'Hades Fetters',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Fetters on YOU',
        cn: '锁链点名',
      },
    },
    {
      id: 'Hades Gaol',
      regex: / 15:\y{ObjectId}:Hades:417F:/,
      regexCn: / 15:\y{ObjectId}:哈迪斯:417F:/,
      regexDe: / 15:\y{ObjectId}:Hades:417F:/,
      regexFr: / 15:\y{ObjectId}:Hadès:417F:/,
      regexJa: / 15:\y{ObjectId}:ハーデス:417F:/,
      delaySeconds: 2,
      infoText: {
        en: 'Kill Jail',
        de: 'Gefängniss zerstören',
        fr: 'Dégommez la prison',
        cn: '攻击牢狱',
      },
    },
    {
      id: 'Hades Nether Blast / Dark Eruption',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Hades Ancient Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return !data.neoHades && data.me == matches[1];
      },
      alertText: {
        en: 'Spread (Don\'t Stack!)',
        de: 'Verteilen (Ohne stacken)',
        fr: 'Dispersez-vous (non packé)',
        cn: '分散（不要重合!）',
      },
    },
    {
      id: 'Hades Ancient Water III',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Stack on YOU',
        de: 'Sammeln auf DIR',
        fr: 'Package sur VOUS',
        cn: '点名集合',
      },
    },
    {
      id: 'Hades Ancient Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:(0060|003E):/,
      condition: function(data) {
        return !data.neoHades;
      },
      run: function(data, matches) {
        data.ancient = data.ancient || {};
        data.ancient[matches[1]] = matches[2];
      },
    },
    {
      id: 'Hades Ancient No Marker',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:003E:/,
      delaySeconds: 0.5,
      infoText: function(data) {
        if (data.ancient[data.me])
          return;
        let name = Object.keys(data.ancient).find((key) => data.ancient[key] === '003E');
        return {
          en: 'Stack on ' + data.ShortName(name),
          de: 'Sammeln auf ' + data.ShortName(name),
          fr: 'Package sur ' + data.ShortName(name),
          cn: '靠近 ' + data.ShortName(name) + ' 集合',
        };
      },
    },
    {
      id: 'Hades Ancient Cleanup',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:003E:/,
      delaySeconds: 10,
      run: function(data) {
        delete data.ancient;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hades': 'Hades',
        'Engage!': 'Start!',
        'Shadow .f .he Ancients': 'Schatten der Alten',
      },
      'replaceText': {
        'Adds': 'Adds',
        'Gaol Add': 'Gefängniss Add',
        'Ancient Aero': 'Wind der Alten',
        'Ancient Dark IV': 'Neka der Alten',
        'Ancient Darkness': 'Dunkelung der Alten',
        'Ancient Water III': 'Aquaga der Alten',
        'Bad Faith': 'Maske des Grolls',
        'Black Cauldron': 'Schwarzer Kessel',
        'Broken Faith': 'Maske der Trauer',
        'Captivity': 'Gefangenschaft',
        'Chorus Of The Lost': 'Chor der Verlorenen',
        'Dark Eruption': 'Dunkle Eruption',
        'Doom': 'Verhängnis',
        'Double': 'Doppel',
        'Dual Strike': 'Doppelschlag',
        'Echo Of The Lost': 'Echo der Verlorenen',
        'Enrage': 'Finalangriff',
        'Hellborn Yawp': 'Höllenschrei',
        'Life In Captivity': 'Leben in Gefangenschaft',
        'Nether Blast': 'Schattenböe',
        'Polydegmon\'s Purgation': 'Schlag des Polydegmon',
        'Ravenous Assault': 'Fegefeuer der Helden',
        'Shadow Spread': 'Dunkle Schatten',
        'Shadow Stream': 'Schattenstrom',
        'Stream/Purgation?': 'Schattenstrom/Schlag des Polydegmon',
        '--targetable--': '--anvisierbar--',
        'The Dark Devours': 'Fressende Finsternis',
        'Titanomachy': 'Titanomachie',
        '--untargetable--': '--nicht anvisierbar--',
        '--fetters--': '--fesseln--',
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hades': '哈迪斯',
        'Engage!': '战斗开始！',
        'Shadow .f .he Ancients': '古代人之影',
      },
      'replaceText': {
        'Adds': '小怪',
        'Gaol Add': '',
        'Ancient Aero': '古代疾风',
        'Ancient Dark IV': '古代冥暗',
        'Ancient Darkness': '古代黑暗',
        'Ancient Water III': '古代狂水',
        'Bad Faith': '失信',
        'Black Cauldron': '暗黑之釜',
        'Broken Faith': '背信',
        'Captivity': '囚禁',
        'Chorus Of The Lost': '逝者的合唱',
        'Dark Eruption': '暗炎喷发',
        'Doom': '死亡宣告',
        'Double': '双重',
        'Dual Strike': '双重强袭',
        'Echo Of The Lost': '逝者的回声',
        'Enrage': '狂暴',
        'Hellborn Yawp': '地狱之声',
        'Life In Captivity': '囚禁生命',
        'Nether Blast': '幽冥冲击',
        'Polydegmon\'s Purgation': '冥王净化',
        'Ravenous Assault': '贪婪突袭',
        'Shadow Spread': '暗影扩散',
        'Shadow Stream': '暗影流',
        'Stream/Purgation?': '暗影流/冥王净化',
        '--targetable--': '--可选中--',
        'The Dark Devours': '黑暗侵蚀',
        'Titanomachy': '诸神之战',
        '--untargetable--': '--不可选中--',
        '--fetters--': '--锁链--',
        'Wail Of The Lost': '逝者的哀嚎',
      },
    },
  ],
}];
