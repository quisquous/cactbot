'use strict';

[{
  zoneRegex: {
    en: /^The Dying Gasp$/,
    cn: /^哈迪斯歼灭战$/,
    ko: /^하데스 토벌전$/,
  },
  timelineFile: 'hades.txt',
  triggers: [
    {
      id: 'Hades Phase Tracker',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexCn: / 14:4180:哈迪斯 starts using 诸神之战/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      regexKo: / 14:4180:하데스 starts using 티타노마키아/,
      run: function(data) {
        data.neoHades = true;
      },
    },
    {
      id: 'Hades Ravenous Assault',
      regex: / 14:4158:Hades starts using Ravenous Assault on (\y{Name})/,
      regexCn: / 14:4158:哈迪斯 starts using 贪婪突袭 on (\y{Name})/,
      regexDe: / 14:4158:Hades starts using Fegefeuer der Helden on (\y{Name})/,
      regexFr: / 14:4158:Hadès starts using Assaut Acharné on (\y{Name})/,
      regexJa: / 14:4158:ハーデス starts using ラヴェナスアサルト on (\y{Name})/,
      regexKo: / 14:4158:하데스 starts using 탐욕스러운 공격 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑',
            ko: '탱크버스터 -> YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑 ->' + data.ShortName(matches[1]),
            ko: '탱버 ->' + data.ShortName(matches[1]),
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
          ko: data.ShortName(matches[1]) + ' 한테서 피하세요',
        };
      },
    },
    {
      id: 'Hades Bad Faith Left',
      regex: / 14:4149:Hades starts using Bad Faith/,
      regexCn: / 14:4149:哈迪斯 starts using 失信/,
      regexDe: / 14:4149:Hades starts using Maske des Grolls/,
      regexFr: / 14:4149:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:4149:ハーデス starts using バッドフェイス/,
      regexKo: / 14:4149:하데스 starts using 불신/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
        ko: '왼쪽',
      },
    },
    {
      id: 'Hades Bad Faith Right',
      regex: / 14:414A:Hades starts using Bad Faith/,
      regexCn: / 14:414A:哈迪斯 starts using 失信/,
      regexDe: / 14:414A:Hades starts using Maske des Grolls/,
      regexFr: / 14:414A:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:414A:ハーデス starts using バッドフェイス/,
      regexKo: / 14:414A:하데스 starts using 불신/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
        ko: '오른쪽',
      },
    },
    {
      id: 'Hades Broken Faith',
      regex: / 14:414D:Hades starts using Broken Faith/,
      regexCn: / 14:414D:哈迪斯 starts using 背信/,
      regexDe: / 14:414D:Hades starts using Maske der Trauer/,
      regexFr: / 14:414D:Hadès starts using Foi Brisée/,
      regexJa: / 14:414D:ハーデス starts using ブロークンフェイス/,
      regexKo: / 14:414D:하데스 starts using 배신/,
      alertText: {
        en: 'Dodge Giant Circles',
        de: 'Weiche dem großen Kreis aus',
        fr: 'Evitez les cercles géants',
        cn: '躲避大圈',
        ko: '대형장판피하기',
      },
    },
    {
      id: 'Hades Echo Right',
      regex: / 14:4164:Hades starts using Echo Of The Lost/,
      regexCn: / 14:4164:哈迪斯 starts using 逝者的回声/,
      regexDe: / 14:4164:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4164:Hadès starts using Écho Des Disparus/,
      regexJa: / 14:4164:ハーデス starts using エコー・オブ・ザ・ロスト/,
      regexKo: / 14:4164:하데스 starts using 상실의 메아리/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Gauche',
        cn: '右',
        ko: '오른쪽',
      },
    },
    {
      id: 'Hades Echo Left',
      regex: / 14:4163:Hades starts using Echo Of The Lost/,
      regexCn: / 14:4163:哈迪斯 starts using 逝者的回声/,
      regexDe: / 14:4163:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4163:Hadès starts using Écho Des Disparus/,
      regexJa: / 14:4163:ハーデス starts using エコー・オブ・ザ・ロスト/,
      regexKo: / 14:4163:하데스 starts using 상실의 메아리/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
        ko: '왼쪽',
      },
    },
    {
      id: 'Hades Titanomachy',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexCn: / 14:4180:哈迪斯 starts using 诸神之战/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      regexKo: / 14:4180:하데스 starts using 티타노마키아/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '광역',
      },
    },
    {
      id: 'Hades Shadow Stream',
      regex: / 14:415C:Hades starts using Shadow Stream/,
      regexCn: / 14:415C:哈迪斯 starts using 暗影流/,
      regexDe: / 14:415C:Hades starts using Schattenstrom/,
      regexFr: / 14:415C:Hadès starts using Flux De Ténèbres/,
      regexJa: / 14:415C:ハーデス starts using シャドウストリーム/,
      regexKo: / 14:415C:하데스 starts using 그림자 급류/,
      alertText: {
        en: 'Go Outside',
        de: 'Raus gehen',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
        cn: '两侧躲避',
        ko: '밖으로',
      },
    },
    {
      id: 'Hades Purgation',
      regex: / 14:4170:Hades starts using Polydegmon's Purgation/,
      regexCn: / 14:4170:哈迪斯 starts using 冥王净化/,
      regexDe: / 14:4170:Hades starts using Schlag des Polydegmon/,
      regexFr: / 14:4170:Hadès starts using Assaut Du Polydegmon/,
      regexJa: / 14:4170:ハーデス starts using ポリデグモンストライク/,
      regexKo: / 14:4170:하데스 starts using 폴리데그몬/,
      alertText: {
        en: 'Get Middle',
        de: 'In die Mitte gehen',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
        cn: '中间躲避',
        ko: '중앙으로',
      },
    },
    {
      id: 'Hades Doom',
      regex: Regexes.gainsEffect({ effect: 'Doom' }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis' }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas' }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告' }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Cleanse Doom In Circle',
        de: 'Entferne Verhängnis mit den Kreisen',
        fr: 'Dispell le Glas',
        cn: '踩光圈',
        ko: '모든 장판을 밟으세요',
      },
    },
    {
      id: 'Hades Wail of the Lost Right',
      regex: / 14:4166:Hades starts using Wail Of The Lost/,
      regexCn: / 14:4166:哈迪斯 starts using 逝者的哀嚎/,
      regexDe: / 14:4166:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4166:Hadès starts using Lamentation Des Disparus/,
      regexJa: / 14:4166:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      regexKo: / 14:4166:하데스 starts using 상실의 통곡/,
      infoText: {
        en: 'Right Knockback',
        de: 'Rechter Knockback',
        fr: 'Poussée à droite',
        cn: '右侧击退',
        ko: '오른쪽 넉백',
      },
    },
    {
      id: 'Hades Wail of the Lost Left',
      regex: / 14:4165:Hades starts using Wail Of The Lost/,
      regexCn: / 14:4165:哈迪斯 starts using 逝者的哀嚎/,
      regexDe: / 14:4165:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4165:Hadès starts using Lamentation Des Disparus/,
      regexJa: / 14:4165:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      regexKo: / 14:4165:하데스 starts using 상실의 통곡/,
      infoText: {
        en: 'Left Knockback',
        de: 'Linker Knockback',
        fr: 'Poussée à gauche',
        cn: '左侧击退',
        ko: '왼쪽 넉백',
      },
    },
    {
      id: 'Hades Dual Strike Healer',
      regex: / 14:4161:Hades starts using Dual Strike/,
      regexCn: / 14:4161:哈迪斯 starts using 双重强袭/,
      regexDe: / 14:4161:Hades starts using Doppelschlag/,
      regexFr: / 14:4161:Hadès starts using Frappe Redoublée/,
      regexJa: / 14:4161:ハーデス starts using デュアルストライク/,
      regexKo: / 14:4161:하데스 starts using 이중 타격/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Busters',
        de: 'Tank Buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱크버스터',
      },
    },
    {
      id: 'Hades Dual Strike',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return data.neoHades && data.me == matches.target;
      },
      alertText: {
        en: 'Tank Buster Spread',
        de: 'Tank Buster verteilen',
        fr: 'Tankbuster, séparez-vous',
        cn: '坦克死刑分散',
        ko: '탱버 산개',
      },
    },
    {
      id: 'Hades Hellborn Yawp',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Drop Marker Outside',
        de: 'Marker außen ablegen',
        fr: 'Posez la marque à l\'extérieur',
        cn: '外侧放点名',
        ko: '외곽으로',
      },
    },
    {
      id: 'Hades Fetters',
      regex: Regexes.headMarker({ id: '0078' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Fetters on YOU',
        de: 'Fessel auf DIR',
        cn: '锁链点名',
        ko: '선대상자 -> YOU',
      },
    },
    {
      id: 'Hades Gaol',
      regex: Regexes.ability({ id: '417F', source: 'Hades', capture: false }),
      regexDe: Regexes.ability({ id: '417F', source: 'Hades', capture: false }),
      regexFr: Regexes.ability({ id: '417F', source: 'Hadès', capture: false }),
      regexJa: Regexes.ability({ id: '417F', source: 'ハーデス', capture: false }),
      regexCn: Regexes.ability({ id: '417F', source: '哈迪斯', capture: false }),
      regexKo: Regexes.ability({ id: '417F', source: '하데스', capture: false }),
      delaySeconds: 2,
      infoText: {
        en: 'Kill Jail',
        de: 'Gefängniss zerstören',
        fr: 'Dégommez la prison',
        cn: '攻击牢狱',
        ko: '감옥',
      },
    },
    {
      id: 'Hades Nether Blast / Dark Eruption',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'Hades Ancient Darkness',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return !data.neoHades && data.me == matches.target;
      },
      alertText: {
        en: 'Spread (Don\'t Stack!)',
        de: 'Verteilen (Ohne stacken)',
        fr: 'Dispersez-vous (non packé)',
        cn: '分散（不要重合!）',
        ko: '산개（모이지마세요!）',
      },
    },
    {
      id: 'Hades Ancient Water III',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Stack on YOU',
        de: 'Sammeln auf DIR',
        fr: 'Package sur VOUS',
        cn: '点名集合',
        ko: '쉐어징 -> YOU',
      },
    },
    {
      id: 'Hades Ancient Collect',
      regex: Regexes.headMarker({ id: ['0060', '003E'] }),
      condition: function(data) {
        return !data.neoHades;
      },
      run: function(data, matches) {
        data.ancient = data.ancient || {};
        data.ancient[matches.target] = matches.id;
      },
    },
    {
      id: 'Hades Ancient No Marker',
      regex: Regexes.headMarker({ id: '003E', capture: false }),
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
          ko: '쉐어징대상자 -> ' + data.ShortName(name),
        };
      },
    },
    {
      id: 'Hades Ancient Cleanup',
      regex: Regexes.headMarker({ id: '003E', capture: false }),
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
    {
      'locale': 'ko',
      'replaceSync': {
        'Hades': '하데스',
        'Engage!': '전투 시작!',
        'Shadow .f .he Ancients': '고대인의 그림자',
      },
      'replaceText': {
        'Adds': '쫄',
        'Gaol Add': '감옥',
        'Ancient Aero': '에인션트 에어로',
        'Ancient Dark IV': '에인션트 다쟈',
        'Ancient Darkness': '에인션트 다크',
        'Ancient Water III': '에인션트 워터가',
        'Bad Faith': '불신',
        'Black Cauldron': '검은 도가니',
        'Broken Faith': '배신',
        'Captivity': '감금',
        'Chorus Of The Lost': '상실의 합창',
        'Dark Eruption': '황천의 불기둥',
        'Doom': '죽음의 선고',
        'Double': '이중 공격',
        'Dual Strike': '이중 타격',
        'Echo Of The Lost': '상실의 메아리',
        'Enrage': '전멸기',
        'Hellborn Yawp': '지옥의 아우성',
        'Life In Captivity': '감금된 삶',
        'Nether Blast': '지옥 강풍',
        'Polydegmon\'s Purgation': '폴리데그몬',
        'Ravenous Assault': '탐욕스러운 공격',
        'Shadow Spread': '그림자 전개',
        'Shadow Stream': '그림자 급류',
        'Stream/Purgation?': '그림자 급류/전개',
        '--targetable--': '--공격가능--',
        'The Dark Devours': '어둠의 침식',
        'Titanomachy': '티타노마키아',
        '--untargetable--': '--공격불가능--',
        '--fetters--': '--줄--',
        'Wail Of The Lost': '상실의 통곡',
      },
    },
  ],
}];
