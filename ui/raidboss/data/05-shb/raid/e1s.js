'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Resurrection \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章1\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(1\)$/,
  },
  timelineFile: 'e1s.txt',
  timeline: [
    function(data) {
      let chance = 0.4;
      let time = '275';

      if (Math.random() >= chance)
        return;

      let goofs = {
        en: [
          'brb',
          ':zzz:',
          'LA HEE',
          'Quick Powernap',
          'brb making coffee',
          'Eden\'s Snoozefest',
          'rip enochian',
        ],
        de: [
          'brb',
          ':zzz:',
          'LA HEE',
          'Kurzer Powernap',
          'brb Kafee machen',
          'Eden\'s Schlaffest',
          'tschüss Henochisch',
        ],
        fr: [
          'Brb',
          ':zzz:',
          'LA HEE',
          'Courte sieste',
          'brb faire du café',
          'Eden\'s Dormez bien',
          'Rip énochien',
        ],
        cn: [
          '马上回来',
          '困了睡会儿',
          'LAHEE~',
          '冲杯咖啡',
          '圣诞快乐',
          '我柜子动了等下再玩',
          'CG',
        ],
      }[data.lang];
      if (!goofs)
        return;

      let goof = goofs[Math.floor(Math.random() * goofs.length)];
      return time + ' "' + goof + '"';
    },
  ],
  triggers: [
    {
      id: 'E1S Initial',
      regex: Regexes.startsUsing({ id: '3D70', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D70', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D70', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D70', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D70', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D70', source: '에덴 프라임', capture: false }),
      run: function(data) {
        if (!data.viceCount) {
          data.viceCount = 1;
          data.vice = 'dps';
        }
      },
    },
    {
      id: 'E1S Paradise Regained',
      regex: Regexes.gainsEffect({ target: 'Eden Prime', effect: 'Paradise Regained', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Prim-Eden', effect: 'Wiedergewonnenes Paradies', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Primo-Éden', effect: 'Paradis Retrouvé', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'エデン・プライム', effect: 'パラダイスリゲイン', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '至尊伊甸', effect: '复乐园', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '에덴 프라임', effect: '복낙원', capture: false }),
      run: function(data) {
        data.paradise = true;
      },
    },
    {
      id: 'E1S Paradise Regained But Lost',
      regex: Regexes.losesEffect({ target: 'Eden Prime', effect: 'Paradise Regained', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Prim-Eden', effect: 'Wiedergewonnenes Paradies', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'Primo-Éden', effect: 'Paradis Retrouvé', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'エデン・プライム', effect: 'パラダイスリゲイン', capture: false }),
      regexCn: Regexes.losesEffect({ target: '至尊伊甸', effect: '复乐园', capture: false }),
      regexKo: Regexes.losesEffect({ target: '에덴 프라임', effect: '복낙원', capture: false }),
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      regex: Regexes.startsUsing({ id: '3D70', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D70', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D70', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D70', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D70', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D70', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Fragor Maximus',
      regex: Regexes.startsUsing({ id: '3D8B', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D8B', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D8B', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D8B', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D8B', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D8B', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Dimensional Shift',
      regex: Regexes.startsUsing({ id: '3D7F', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D7F', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D7F', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D7F', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D7F', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D7F', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Spear Of Paradise',
      regex: Regexes.startsUsing({ id: '3D88', source: 'Eden Prime' }),
      regexDe: Regexes.startsUsing({ id: '3D88', source: 'Prim-Eden' }),
      regexFr: Regexes.startsUsing({ id: '3D88', source: 'Primo-Éden' }),
      regexJa: Regexes.startsUsing({ id: '3D88', source: 'エデン・プライム' }),
      regexCn: Regexes.startsUsing({ id: '3D88', source: '至尊伊甸' }),
      regexKo: Regexes.startsUsing({ id: '3D88', source: '에덴 프라임' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E1S Eden\'s Flare',
      regex: Regexes.startsUsing({ id: '3D73', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D73', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D73', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D73', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D73', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D73', source: '에덴 프라임', capture: false }),
      response: Responses.getUnder('alert'),
    },
    {
      id: 'E1S Delta Attack 1',
      regex: Regexes.startsUsing({ id: '44F4', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '44F4', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '44F4', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '44F4', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '44F4', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '44F4', source: '에덴 프라임', capture: false }),
      alertText: {
        en: 'Cross Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous en croix',
        cn: '四角躲避',
        ko: '산개',
      },
    },
    {
      id: 'E1S Delta Attack 2',
      regex: Regexes.startsUsing({ id: '44F8', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '44F8', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '44F8', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '44F8', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '44F8', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '44F8', source: '에덴 프라임', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Get In, Spread',
            de: 'Rein gehen, verteilen',
            ja: '中で散開',
            fr: 'Intérieur, écartez-vous',
            cn: '中间散开',
            ko: '보스 가까이 탱 약산개',
          };
        }
        return {
          en: 'In, Stack Behind',
          de: 'Rein, hinten stacken',
          ja: '背面集合',
          fr: 'Intérieur, packez derrière',
          cn: '背面集合',
          ko: '보스 가까이, 뒤에서 쉐어',
        };
      },
    },
    {
      // 44EF: dps1
      // 3D7A: dps2
      // 44EE: tank1
      // 3D78: tank2
      // 44F0: healer1
      // 3D7D: healer2
      id: 'E1S Vice and Virtue Tracker',
      regex: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: '에덴 프라임', capture: false }),
      run: function(data) {
        // Note: this happens *after* the marks, so is setting up vice for the next marks.
        data.viceCount++;
        let viceMap = {
          1: 'dps',
          2: 'tank',
          3: 'healer',

          4: 'tank',
          5: 'dps',
          6: 'healer',

          7: 'tank',
          8: 'dps',
          9: 'healer',

          // theoretically??
          10: 'tank',
          11: 'dps',
          12: 'healer',
        };
        data.vice = viceMap[data.viceCount];
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2 Tracker',
      regex: Regexes.startsUsing({ id: '3D7A', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D7A', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D7A', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D7A', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D7A', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D7A', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      regex: Regexes.startsUsing({ id: '44EE', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '44EE', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '44EE', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '44EE', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '44EE', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '44EE', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      regex: Regexes.startsUsing({ id: '3D78', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D78', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D78', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D78', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D78', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D78', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      regex: Regexes.startsUsing({ id: '44F0', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '44F0', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '44F0', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '44F0', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '44F0', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '44F0', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      regex: Regexes.startsUsing({ id: '3D7D', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D7D', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D7D', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D7D', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D7D', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D7D', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      regex: Regexes.headMarker({ id: '00AE' }),
      condition: function(data, matches) {
        return !data.paradise && data.vice == 'dps' && data.me == matches.target;
      },
      alertText: {
        en: 'Puddle Spread',
        de: 'Flächen verteilen',
        ja: '離れて散開',
        fr: 'Ecartez-vous',
        cn: '分散放圈',
        ko: '장판 유도 산개',
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: Regexes.startsUsing({ id: '3D7A', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D7A', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D7A', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D7A', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D7A', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D7A', source: '에덴 프라임', capture: false }),
      alertText: {
        en: 'Stack With Partner',
        de: 'Mit Partner stacken',
        ja: '相方とスタック',
        fr: 'Packez-vous avec votre partenaire',
        cn: '与搭档集合',
        ko: '쉐어뎀 파트너랑 모이기',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Mark',
      regex: Regexes.headMarker({ id: '00AE' }),
      condition: function(data, matches) {
        return data.vice == 'tank' && data.me == matches.target;
      },
      infoText: {
        en: 'Tank Laser on YOU',
        de: 'Tank Laser auf DIR',
        fr: 'Tank laser sur VOUS',
        ja: '自分にレーザー',
        cn: '坦克射线',
        ko: '탱 레이저 대상자',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Stack',
      regex: Regexes.startsUsing({ id: '3D78', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D78', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D78', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D78', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D78', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D78', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role != 'tank';
      },
      infoText: {
        en: 'Stack in front of tank',
        de: 'Vorne mit dem Tank stacken',
        ja: '左右に分かれて内側へ',
        fr: 'Packez-vous devant le tank',
        cn: 'T前集合',
        ko: '좌우 탱커 앞 산개',
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark YOU',
      regex: Regexes.gainsEffect({ effect: 'Prey' }),
      regexDe: Regexes.gainsEffect({ effect: 'Markiert' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marquage' }),
      regexJa: Regexes.gainsEffect({ effect: 'マーキング' }),
      regexCn: Regexes.gainsEffect({ effect: '猎物' }),
      regexKo: Regexes.gainsEffect({ effect: '표식' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.paradise) {
          return {
            en: 'Pass Prey to DPS',
            de: 'Marker einem DPS geben',
            ja: 'DPSに移して',
            fr: 'Donnez la marque à un DPS',
            cn: '传毒DPS',
            ko: '딜러한테 표식 넘기기',
          };
        }
        return {
          en: 'Pass Prey to Tank',
          de: 'Marker einem Tank geben',
          ja: 'タンクに移して',
          fr: 'Donnez la marque à un Tank',
          cn: '传毒坦克',
          ko: '탱커한테 표식 넘기기',
        };
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark Not You',
      regex: Regexes.gainsEffect({ effect: 'Prey', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Markiert', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Marquage', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: 'マーキング', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '猎物', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '표식', capture: false }),
      condition: function(data) {
        if (data.role == 'dps')
          return data.paradise;
        if (data.role == 'tank')
          return !data.paradise;
        return false;
      },
      suppressSeconds: 20,
      alertText: {
        en: 'Take prey from healer',
        de: 'Marker vom Heiler nehmen',
        ja: 'ヒーラーからマーカー取って',
        fr: 'Prenez la marque du healer',
        cn: '从奶妈拿毒',
        ko: '힐러한테서 표식 받기',
      },
    },
    {
      id: 'E1S Mana Boost',
      regex: Regexes.startsUsing({ id: '3D8D', source: 'Guardian Of Paradise' }),
      regexDe: Regexes.startsUsing({ id: '3D8D', source: 'Hüter Von Eden' }),
      regexFr: Regexes.startsUsing({ id: '3D8D', source: 'Gardien Du Jardin' }),
      regexJa: Regexes.startsUsing({ id: '3D8D', source: 'エデン・ガーデナー' }),
      regexCn: Regexes.startsUsing({ id: '3D8D', source: '伊甸守护者' }),
      regexKo: Regexes.startsUsing({ id: '3D8D', source: '에덴 정원사' }),
      condition: function(data) {
        return data.CanSilence();
      },
      suppressSeconds: 1,
      response: Responses.interrupt(),
    },
    {
      id: 'E1S Pure Light',
      regex: Regexes.startsUsing({ id: '3D8A', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D8A', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D8A', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D8A', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D8A', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D8A', source: '에덴 프라임', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'E1S Pure Beam 1',
      regex: Regexes.startsUsing({ id: '3D80', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D80', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D80', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D80', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D80', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D80', source: '에덴 프라임', capture: false }),
      infoText: {
        en: 'Get Outside Your Orb',
        de: 'Geh zu deinem Orb',
        ja: 'ピュアレイを外へ誘導',
        fr: 'Allez à l\'extérieur de votre orbe',
        cn: '球外站位',
        ko: '본인 레이저 바깥으로 유도',
      },
    },
    {
      id: 'E1S Pure Beam 2',
      regex: Regexes.startsUsing({ id: '3D82', source: 'Eden Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D82', source: 'Prim-Eden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D82', source: 'Primo-Éden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D82', source: 'エデン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D82', source: '至尊伊甸', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D82', source: '에덴 프라임', capture: false }),
      infoText: {
        en: 'Bait Orb Lasers Outside',
        de: 'Laser nach drausen ködern',
        fr: 'Placez les lasers à l\'extérieur',
        cn: '外侧吃激光',
        ko: '원/힐 레이저 바깥으로 유도',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Eden Prime': 'Prim-Eden',
        'Arcane Sphere': 'Arkane Sphäre',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'Vice of Vanity': 'Laster der Eitelkeit',
        'Vice of Thievery': 'Laster der Habgier',
        'Vice of Sloth': 'Laster der Faulheit',
        'Vice of Pride': 'Laster des Hochmuts',
        'Vice of Greed': 'Laster der Gier',
        'Vice of Apathy': 'Laster der Apathie',
        'Vice and Virtue': 'Laster und Tugend',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'Paradiesspeer',
        'Regained Thunder III': 'Wiedergewonnenes Blitzga',
        'Regained Fire III': 'Wiedergewonnenes Feuga',
        'Regained Blizzard III': 'Wiedergewonnenes Eisga',
        'Pure Light': 'Läuterndes Licht',
        'Pure Beam': 'Läuternder Strahl',
        'Primeval Stasis': 'Urzeitliche Stase',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradisal Dive': 'Paradiessturz',
        'Mana Slice': 'Mana-Hieb',
        'Mana Burst': 'Mana-Knall',
        'Mana Boost': 'Mana-Verstärker',
        'Heavensunder': 'Himmelsdonner',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Ewiger Atem',
        'Eden\'s Thunder III': 'Eden-Blitzga',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Fire III': 'Eden-Feuga',
        'Eden\'s Blizzard III': 'Eden-Eisga',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Delta Attack': 'Delta-Attacke',
        'Vice And Virtue': 'Laster und Tugend',
        'Spear Of Paradise': 'Paradiesspeer',
      },
      '~effectNames': {
        'Slippery Prey': 'Unmarkierbar',
        'Prey': 'Markiert',
        'Poison': 'Gift',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Healing Magic Down': 'Heilmagie -',
        'Fetters': 'Gefesselt',
        'Bleeding': 'Blutung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Eden Prime': 'Primo-Éden',
        'Arcane Sphere': 'Sphère Arcanique',
      },
      'replaceText': {
        'Vice of Vanity': 'Péché de vanité',
        'Vice of Thievery': 'Péché de larcin',
        'Vice of Sloth': 'Péché de paresse',
        'Vice of Pride': 'Péché d\'orgueil',
        'Vice of Greed': 'Péché d\'avarice',
        'Vice of Apathy': 'Péché d\'apathie',
        'Vice and Virtue': 'Vice et vertu',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'Lance du paradis',
        'Regained Thunder III': 'Méga Foudre retrouvée',
        'Regained Fire III': 'Méga Feu retrouvé',
        'Regained Blizzard III': 'Méga Glace retrouvée',
        'Pure Light': 'Lumière purificatrice',
        'Pure Beam': 'Rayon purificateur',
        'Primeval Stasis': 'Stase primordiale',
        'Paradise Regained': 'Paradis retrouvé',
        'Paradise Lost': 'Paradis perdu',
        'Paradisal Dive': 'Piqué du paradis',
        'Mana Slice': 'Taillade de mana',
        'Mana Burst': 'Explosion de mana',
        'Mana Boost': 'Amplificateur de mana',
        'Heavensunder': 'Ravageur de paradis',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Eden\'s Thunder III': 'Méga Foudre édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Fire III': 'Méga Feu édénique',
        'Eden\'s Blizzard III': 'Méga Glace édénique',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Delta Attack': 'Attaque Delta',
      },
      '~effectNames': {
        'Slippery Prey': 'Marquage Impossible',
        'Prey': 'Marquage',
        'Poison': 'Poison',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Healing Magic Down': 'Malus de soin',
        'Fetters': 'Attache',
        'Bleeding': 'Saignement',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Guardian of Paradise': 'エデン・ガーデナー',
        'Eden Prime': 'エデン・プライム',
        'Arcane Sphere': '立体魔法陣',
      },
      'replaceText': {
        'Vice of Vanity': 'ヴァイス・オブ・ヴァニティー',
        'Vice of Thievery': 'ヴァイス・オブ・シーヴァリィ',
        'Vice of Sloth': 'ヴァイス・オブ・スロース',
        'Vice of Pride': 'ヴァイス・オブ・プライド',
        'Vice of Greed': 'ヴァイス・オブ・グリード',
        'Vice of Apathy': 'ヴァイス・オブ・アパシー',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Regained Thunder III': 'リゲイン・サンダガ',
        'Regained Fire III': 'リゲイン・ファイガ',
        'Regained Blizzard III': 'リゲイン・ブリザガ',
        'Pure Light': 'ピュアライト',
        'Pure Beam': 'ピュアレイ',
        'Primeval Stasis': 'プライムイーバルステーシス',
        'Paradise Regained': 'パラダイスリゲイン',
        'Paradise Lost': 'パラダイスロスト',
        'Paradisal Dive': 'パラダイスダイブ',
        'Mana Slice': 'マナスラッシュ',
        'Mana Burst': 'マナバースト',
        'Mana Boost': 'マナブースター',
        'Heavensunder': 'ヘヴンサンダー',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Eternal Breath': 'エターナル・ブレス',
        'Eden\'s Thunder III': 'エデン・サンダガ',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Fire III': 'エデン・ファイガ',
        'Eden\'s Blizzard III': 'エデン・ブリザガ',
        'Dimensional Shift': 'ディメンションシフト',
        'Delta Attack': 'デルタアタック',
      },
      '~effectNames': {
        'Slippery Prey': 'マーキング対象外',
        'Prey': 'マーキング',
        'Poison': '毒',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Healing Magic Down': '回復魔法効果低下',
        'Fetters': '拘束',
        'Bleeding': 'ペイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Eden Prime': '至尊伊甸',
        'Arcane Sphere': '立体魔法阵',
        'Guardian of Paradise': '伊甸守护者',
      },
      'replaceText': {
        'Vice [oO]f Vanity': '虚荣之恶',
        'Vice of Thievery': '盗窃之恶',
        'Vice of Sloth': '怠惰之恶',
        'Vice of Pride': '傲慢之恶',
        'Vice of Greed': '贪婪之恶',
        'Vice of Apathy': '冷漠之恶',
        'Vice And Virtue! (T)': '恶习与美德！(坦克)',
        'Vice And Virtue! (D)': '恶习与美德！(DPS)',
        'Vice And Virtue! (H)': '恶习与美德！(奶妈)',
        'Vice And Virtue (T)': '恶习与美德(坦克)',
        'Vice And Virtue (D)': '恶习与美德(DPS)',
        'Vice And Virtue (H)': '恶习与美德(奶妈)',
        'Vice and Virtue': '恶习与美德',
        'Spear [oO]f Paradise': '乐园之枪',
        'Regained Thunder III': '复乐园暴雷',
        'Regained Fire III': '复乐园爆炎',
        'Regained Blizzard III': '复乐园冰封',
        'Pure Light': '净土之光',
        'Pure Beam': '净土射线',
        'Primeval Stasis': '原初停滞',
        'Paradise Regained': '复乐园',
        'Paradise Lost': '失乐园',
        'Paradisal Dive': '乐园冲',
        'Mana Slice': '魔力斩击',
        'Mana Burst': '魔力爆发',
        'Mana Boost': '魔力增幅',
        'Heavensunder': '天国分断',
        'Fragor Maximus': '极大爆炸',
        'Eternal Breath': '永恒吐息',
        'Eden\'s Thunder III': '伊甸暴雷',
        'Eden\'s Gravity': '伊甸重力',
        'Eden\'s Flare': '伊甸核爆',
        'Eden\'s Fire III': '伊甸爆炎',
        'Eden\'s Blizzard III': '伊甸冰封',
        'Dimensional Shift': '空间转换',
        'Delta Attack (Cross)': '三角攻击(角落)',
        'Delta Attack (Donut)': '三角攻击(月环)',
        'Delta Attack': '三角攻击',
      },
      '~effectNames': {
        'Slippery Prey': '非目标',
        'Fetters': '拘束',
        'Prey': '猎物',
        'Poison': '中毒',
        'Physical Vulnerability Up': '物理受伤加重',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Healing Magic Down': '治疗魔法效果降低',
        'Bleeding': '出血',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Eden Prime': '에덴 프라임',
        'Arcane Sphere': '입체 마법진',
        'Guardian of Paradise': '에덴의 수호자',
      },
      'replaceText': {
        'Vice of Vanity': '허영의 악덕',
        'Vice of Thievery': '도둑질의 악덕',
        'Vice of Sloth': '나태의 악덕',
        'Vice of Pride': '교만의 악덕',
        'Vice of Greed': '탐욕의 악덕',
        'Vice of Apathy': '냉담의 악덕',
        'Vice and Virtue': '선과 악',
        'Spear of Paradise': '낙원의 창',
        'Regained Thunder III': '되찾은 선더가',
        'Regained Fire III': '되찾은 파이가',
        'Regained Blizzard III': '되찾은 블리자가',
        'Pure Light': '완전한 빛',
        'Pure Beam': '완전한 광선',
        'Primeval Stasis': '태초의 안정',
        'Paradise Regained': '복낙원',
        'Paradise Lost': '실낙원',
        'Paradisal Dive': '낙원 강하',
        'Mana Slice': '마나 베기',
        'Mana Burst': '마나 폭발',
        'Mana Boost': '마나 강화',
        'Heavensunder': '천국의 낙뢰',
        'Fragor Maximus': '우주 탄생',
        'Eternal Breath': '영원의 숨결',
        'Eden\'s Thunder III': '에덴 선더가',
        'Eden\'s Gravity': '에덴 그라비데',
        'Eden\'s Flare': '에덴 플레어',
        'Eden\'s Fire III': '에덴 파이가',
        'Eden\'s Blizzard III': '에덴 블리자가',
        'Dimensional Shift': '차원 전환',
        'Delta Attack': '델타 공격',
        'Cross': '십자',
        'Donut': '중앙',
      },
      '~effectNames': {
        'Slippery Prey': '표식 대상 제외',
        'Prey': '표식',
        'Poison': '독',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Healing Magic Down': '회복마법 효과 감소',
        'Fetters': '구속',
        'Bleeding': '고통',
      },
    },
  ],
}];
