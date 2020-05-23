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
      }[data.displayLang];
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
        fr: 'Dispersez-vous en croix',
        ja: '散開',
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
            fr: 'Intérieur, dispersez-vous',
            ja: '中で散開',
            cn: '中间散开',
            ko: '보스 가까이 탱 약산개',
          };
        }
        return {
          en: 'In, Stack Behind',
          de: 'Rein, hinten stacken',
          fr: 'Intérieur, packez derrière',
          ja: '背面集合',
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
        fr: 'Dispersez les zones au sol',
        ja: '離れて散開',
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
        fr: 'Packez-vous avec votre partenaire',
        ja: '相方とスタック',
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
        fr: 'Packez-vous devant le tank',
        ja: '左右に分かれて内側へ',
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
            fr: 'Passez la marque à un DPS',
            ja: 'DPSに移して',
            cn: '传毒DPS',
            ko: '딜러한테 표식 넘기기',
          };
        }
        return {
          en: 'Pass Prey to Tank',
          de: 'Marker einem Tank geben',
          fr: 'Passez la marque à un Tank',
          ja: 'タンクに移して',
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
        fr: 'Prenez la marque du healer',
        ja: 'ヒーラーからマーカー取って',
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
        fr: 'Allez à l\'extérieur de votre orbe',
        ja: 'ピュアレイを外へ誘導',
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
        fr: 'Attirez les lasers à l\'extérieur',
        cn: '外侧吃激光',
        ko: '원/힐 레이저 바깥으로 유도',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Sphere': 'Arkane Sphäre',
        'Eden Prime': 'Prim-Eden',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'Delta Attack': 'Delta-Attacke',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Eden\'s Blizzard III': 'Eden-Eisga',
        'Eden\'s Fire III': 'Eden-Feuga',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eden\'s Thunder III': 'Eden-Blitzga',
        'Eternal Breath': 'Ewiger Atem',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Himmelsdonner',
        'Mana Boost': 'Mana-Verstärker',
        'Mana Burst': 'Mana-Knall',
        'Mana Slice': 'Mana-Hieb',
        'Paradisal Dive': 'Paradiessturz',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Primeval Stasis': 'Urzeitliche Stase',
        'Pure Beam': 'Läuternder Strahl',
        'Pure Light': 'Läuterndes Licht',
        'Regained Blizzard III': 'Wiedergewonnenes Eisga',
        'Regained Fire III': 'Wiedergewonnenes Feuga',
        'Regained Thunder III': 'Wiedergewonnenes Blitzga',
        'Spear Of Paradise': 'Paradiesspeer',
        'Vice And Virtue': 'Laster und Tugend',
        'Vice of Apathy': 'Laster der Apathie',
        'Vice of Greed': 'Laster der Gier',
        'Vice of Pride': 'Laster des Hochmuts',
        'Vice of Sloth': 'Laster der Faulheit',
        'Vice of Thievery': 'Laster der Habgier',
        'Vice of Vanity': 'Laster der Eitelkeit',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Fetters': 'Gefesselt',
        'Healing Magic Down': 'Heilmagie -',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Poison': 'Gift',
        'Prey': 'Markiert',
        'Slippery Prey': 'Unmarkierbar',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arcane Sphere': 'Sphère Arcanique',
        'Eden Prime': 'Primo-Éden',
        'Guardian of Paradise': 'Gardien du jardin',
      },
      'replaceText': {
        '\\!': ' !',
        'Delta Attack': 'Attaque Delta',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Eden\'s Blizzard III': 'Méga Glace édénique',
        'Eden\'s Fire III': 'Méga Feu édénique',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eden\'s Thunder III': 'Méga Foudre édénique',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Ravageur de paradis',
        'Mana Boost': 'Amplificateur de mana',
        'Mana Burst': 'Explosion de mana',
        'Mana Slice': 'Taillade de mana',
        'Paradisal Dive': 'Piqué du paradis',
        'Paradise Lost': 'Paradis perdu',
        'Paradise Regained': 'Paradis retrouvé',
        'Primeval Stasis': 'Stase primordiale',
        'Pure Beam': 'Rayon purificateur',
        'Pure Light': 'Lumière purificatrice',
        'Regained Blizzard III': 'Méga Glace retrouvée',
        'Regained Fire III': 'Méga Feu retrouvé',
        'Regained Thunder III': 'Méga Foudre retrouvée',
        'Spear of Paradise': 'Lance du paradis',
        'Vice And Virtue': 'Vice et vertu',
        'Vice of Apathy': 'Péché d\'apathie',
        'Vice of Greed': 'Péché d\'avarice',
        'Vice of Pride': 'Péché d\'orgueil',
        'Vice of Sloth': 'Péché de paresse',
        'Vice of Thievery': 'Péché de larcin',
        'Vice of Vanity': 'Péché de vanité',
      },
      '~effectNames': {
        'Bleeding': 'Saignement',
        'Fetters': 'Attache',
        'Healing Magic Down': 'Malus de soin',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Paradise Regained': 'Paradis retrouvé',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Poison': 'Poison',
        'Prey': 'Marquage',
        'Slippery Prey': 'Marquage Impossible',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sphere': '立体魔法陣',
        'Eden Prime': 'エデン・プライム',
        'Guardian of Paradise': 'エデン・ガーデナー',
      },
      'replaceText': {
        'Delta Attack': 'デルタアタック',
        'Dimensional Shift': 'ディメンションシフト',
        'Eden\'s Blizzard III': 'エデン・ブリザガ',
        'Eden\'s Fire III': 'エデン・ファイガ',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eden\'s Thunder III': 'エデン・サンダガ',
        'Eternal Breath': 'エターナル・ブレス',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Heavensunder': 'ヘヴンサンダー',
        'Mana Boost': 'マナブースター',
        'Mana Burst': 'マナバースト',
        'Mana Slice': 'マナスラッシュ',
        'Paradisal Dive': 'パラダイスダイブ',
        'Paradise Lost': 'パラダイスロスト',
        'Paradise Regained': 'パラダイスリゲイン',
        'Primeval Stasis': 'プライムイーバルステーシス',
        'Pure Beam': 'ピュアレイ',
        'Pure Light': 'ピュアライト',
        'Regained Blizzard III': 'リゲイン・ブリザガ',
        'Regained Fire III': 'リゲイン・ファイガ',
        'Regained Thunder III': 'リゲイン・サンダガ',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
        'Vice of Apathy': 'ヴァイス・オブ・アパシー',
        'Vice of Greed': 'ヴァイス・オブ・グリード',
        'Vice of Pride': 'ヴァイス・オブ・プライド',
        'Vice of Sloth': 'ヴァイス・オブ・スロース',
        'Vice of Thievery': 'ヴァイス・オブ・シーヴァリィ',
        'Vice of Vanity': 'ヴァイス・オブ・ヴァニティー',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Fetters': '拘束',
        'Healing Magic Down': '回復魔法効果低下',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Paradise Regained': 'パラダイスリゲイン',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Poison': '毒',
        'Prey': 'マーキング',
        'Slippery Prey': 'マーキング対象外',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arcane Sphere': '立体魔法阵',
        'Eden Prime': '至尊伊甸',
        'Guardian of Paradise': '伊甸守护者',
      },
      'replaceText': {
        'Delta Attack (Cross)': '三角攻击(角落)',
        'Delta Attack (Donut)': '三角攻击(月环)',
        'Delta Attack': '三角攻击',
        'Dimensional Shift': '空间转换',
        'Eden\'s Blizzard III': '伊甸冰封',
        'Eden\'s Fire III': '伊甸爆炎',
        'Eden\'s Flare': '伊甸核爆',
        'Eden\'s Gravity': '伊甸重力',
        'Eden\'s Thunder III': '伊甸暴雷',
        'Eternal Breath': '永恒吐息',
        'Fragor Maximus': '极大爆炸',
        'Heavensunder': '天国分断',
        'Mana Boost': '魔力增幅',
        'Mana Burst': '魔力爆发',
        'Mana Slice': '魔力斩击',
        'Paradisal Dive': '乐园冲',
        'Paradise Lost': '失乐园',
        'Paradise Regained': '复乐园',
        'Primeval Stasis': '原初停滞',
        'Pure Beam': '净土射线',
        'Pure Light': '净土之光',
        'Regained Blizzard III': '复乐园冰封',
        'Regained Fire III': '复乐园爆炎',
        'Regained Thunder III': '复乐园暴雷',
        'Spear [oO]f Paradise': '乐园之枪',
        'Vice [oO]f Vanity': '虚荣之恶',
        'Vice And Virtue (D)': '恶习与美德(DPS)',
        'Vice And Virtue (H)': '恶习与美德(奶妈)',
        'Vice And Virtue (T)': '恶习与美德(坦克)',
        'Vice And Virtue! (D)': '恶习与美德！(DPS)',
        'Vice And Virtue! (H)': '恶习与美德！(奶妈)',
        'Vice And Virtue! (T)': '恶习与美德！(坦克)',
        'Vice and Virtue': '恶习与美德',
        'Vice of Apathy': '冷漠之恶',
        'Vice of Greed': '贪婪之恶',
        'Vice of Pride': '傲慢之恶',
        'Vice of Sloth': '怠惰之恶',
        'Vice of Thievery': '盗窃之恶',
      },
      '~effectNames': {
        'Bleeding': '出血',
        'Fetters': '拘束',
        'Healing Magic Down': '治疗魔法效果降低',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Paradise Regained': '复乐园',
        'Physical Vulnerability Up': '物理受伤加重',
        'Poison': '中毒',
        'Prey': '猎物',
        'Slippery Prey': '非目标',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sphere': '입체 마법진',
        'Eden Prime': '에덴 프라임',
        'Guardian of Paradise': '에덴 정원사',
      },
      'replaceText': {
        'Cross': '십자',
        'Delta Attack': '델타 공격',
        'Dimensional Shift': '차원 전환',
        'Donut': '중앙',
        'Eden\'s Blizzard III': '에덴 블리자가',
        'Eden\'s Fire III': '에덴 파이가',
        'Eden\'s Flare': '에덴 플레어',
        'Eden\'s Gravity': '에덴 그라비데',
        'Eden\'s Thunder III': '에덴 선더가',
        'Eternal Breath': '영원의 숨결',
        'Fragor Maximus': '우주 탄생',
        'Heavensunder': '천국의 낙뢰',
        'Mana Boost': '마나 강화',
        'Mana Burst': '마나 폭발',
        'Mana Slice': '마나 베기',
        'Paradisal Dive': '낙원 강하',
        'Paradise Lost': '실낙원',
        'Paradise Regained': '복낙원',
        'Primeval Stasis': '태초의 안정',
        'Pure Beam': '완전한 광선',
        'Pure Light': '완전한 빛',
        'Regained Blizzard III': '되찾은 블리자가',
        'Regained Fire III': '되찾은 파이가',
        'Regained Thunder III': '되찾은 선더가',
        'Spear of Paradise': '낙원의 창',
        'Vice and Virtue': '선과 악',
        'Vice of Apathy': '냉담의 악덕',
        'Vice of Greed': '탐욕의 악덕',
        'Vice of Pride': '교만의 악덕',
        'Vice of Sloth': '나태의 악덕',
        'Vice of Thievery': '도둑질의 악덕',
        'Vice of Vanity': '허영의 악덕',
      },
      '~effectNames': {
        'Bleeding': '고통',
        'Fetters': '구속',
        'Healing Magic Down': '회복마법 효과 감소',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Paradise Regained': '복낙원',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Poison': '독',
        'Prey': '표식',
        'Slippery Prey': '표식 대상 제외',
      },
    },
  ],
}];
