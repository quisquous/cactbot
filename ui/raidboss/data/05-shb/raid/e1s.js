'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Resurrection \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章1\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(1\)$/,
  },
  zoneId: ZoneId.EdensGateResurrectionSavage,
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
      netRegex: NetRegexes.startsUsing({ id: '3D70', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D70', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D70', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D70', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D70', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D70', source: '에덴 프라임', capture: false }),
      run: function(data) {
        if (!data.viceCount) {
          data.viceCount = 1;
          data.vice = 'dps';
        }
      },
    },
    {
      id: 'E1S Paradise Regained',
      netRegex: NetRegexes.gainsEffect({ target: 'Eden Prime', effectId: '7B6', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Prim-Eden', effectId: '7B6', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Primo-Éden', effectId: '7B6', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'エデン・プライム', effectId: '7B6', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '至尊伊甸', effectId: '7B6', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '에덴 프라임', effectId: '7B6', capture: false }),
      run: function(data) {
        data.paradise = true;
      },
    },
    {
      id: 'E1S Paradise Regained But Lost',
      netRegex: NetRegexes.losesEffect({ target: 'Eden Prime', effectId: '7B6', capture: false }),
      netRegexDe: NetRegexes.losesEffect({ target: 'Prim-Eden', effectId: '7B6', capture: false }),
      netRegexFr: NetRegexes.losesEffect({ target: 'Primo-Éden', effectId: '7B6', capture: false }),
      netRegexJa: NetRegexes.losesEffect({ target: 'エデン・プライム', effectId: '7B6', capture: false }),
      netRegexCn: NetRegexes.losesEffect({ target: '至尊伊甸', effectId: '7B6', capture: false }),
      netRegexKo: NetRegexes.losesEffect({ target: '에덴 프라임', effectId: '7B6', capture: false }),
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      netRegex: NetRegexes.startsUsing({ id: '3D70', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D70', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D70', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D70', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D70', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D70', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Fragor Maximus',
      netRegex: NetRegexes.startsUsing({ id: '3D8B', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D8B', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D8B', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D8B', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D8B', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D8B', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Dimensional Shift',
      netRegex: NetRegexes.startsUsing({ id: '3D7F', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D7F', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D7F', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D7F', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D7F', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D7F', source: '에덴 프라임', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Spear Of Paradise',
      netRegex: NetRegexes.startsUsing({ id: '3D88', source: 'Eden Prime' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D88', source: 'Prim-Eden' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D88', source: 'Primo-Éden' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D88', source: 'エデン・プライム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D88', source: '至尊伊甸' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D88', source: '에덴 프라임' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E1S Eden\'s Flare',
      netRegex: NetRegexes.startsUsing({ id: '3D73', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D73', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D73', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D73', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D73', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D73', source: '에덴 프라임', capture: false }),
      response: Responses.getUnder('alert'),
    },
    {
      id: 'E1S Delta Attack 1',
      netRegex: NetRegexes.startsUsing({ id: '44F4', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '44F4', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '44F4', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '44F4', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '44F4', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '44F4', source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '44F8', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '44F8', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '44F8', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '44F8', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '44F8', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '44F8', source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'], source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3D7A', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D7A', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D7A', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D7A', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D7A', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D7A', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      netRegex: NetRegexes.startsUsing({ id: '44EE', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '44EE', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '44EE', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '44EE', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '44EE', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '44EE', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      netRegex: NetRegexes.startsUsing({ id: '3D78', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D78', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D78', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D78', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D78', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D78', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      netRegex: NetRegexes.startsUsing({ id: '44F0', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '44F0', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '44F0', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '44F0', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '44F0', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '44F0', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      netRegex: NetRegexes.startsUsing({ id: '3D7D', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D7D', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D7D', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D7D', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D7D', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D7D', source: '에덴 프라임', capture: false }),
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      netRegex: NetRegexes.headMarker({ id: '00AE' }),
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
      netRegex: NetRegexes.startsUsing({ id: '3D7A', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D7A', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D7A', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D7A', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D7A', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D7A', source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '00AE' }),
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
      netRegex: NetRegexes.startsUsing({ id: '3D78', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D78', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D78', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D78', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D78', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D78', source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '840' }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '840', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3D8D', source: 'Guardian Of Paradise' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D8D', source: 'Hüter Von Eden' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D8D', source: 'Gardien Du Jardin' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D8D', source: 'エデン・ガーデナー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D8D', source: '伊甸守护者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D8D', source: '에덴 정원사' }),
      condition: function(data) {
        return data.CanSilence();
      },
      suppressSeconds: 1,
      response: Responses.interrupt(),
    },
    {
      id: 'E1S Pure Light',
      netRegex: NetRegexes.startsUsing({ id: '3D8A', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D8A', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D8A', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D8A', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D8A', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D8A', source: '에덴 프라임', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'E1S Pure Beam 1',
      netRegex: NetRegexes.startsUsing({ id: '3D80', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D80', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D80', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D80', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D80', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D80', source: '에덴 프라임', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3D82', source: 'Eden Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3D82', source: 'Prim-Eden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3D82', source: 'Primo-Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3D82', source: 'エデン・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3D82', source: '至尊伊甸', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3D82', source: '에덴 프라임', capture: false }),
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
        'Eden Prime': 'Prim-Eden',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'Delta Attack': 'Delta-Attacke',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eternal Breath': 'Ewiger Atem',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Himmelsdonner',
        'Mana Burst': 'Mana-Knall',
        'Mana Slice': 'Mana-Hieb',
        'Paradisal Dive': 'Paradiessturz',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Pure Beam': 'Läuternder Strahl',
        'Pure Light': 'Läuterndes Licht',
        'Spear Of Paradise': 'Paradiesspeer',
        'Vice And Virtue': 'Laster und Tugend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Eden Prime': 'Primo-Éden',
        'Guardian of Paradise': 'Gardien du jardin',
      },
      'replaceText': {
        '\\!': ' !',
        'Delta Attack': 'Attaque Delta',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Ravageur de paradis',
        'Mana Burst': 'Explosion de mana',
        'Mana Slice': 'Taillade de mana',
        'Paradisal Dive': 'Piqué du paradis',
        'Paradise Lost': 'Paradis perdu',
        'Paradise Regained': 'Paradis retrouvé',
        'Pure Beam': 'Rayon purificateur',
        'Pure Light': 'Lumière purificatrice',
        'Spear of Paradise': 'Lance du paradis',
        'Vice And Virtue': 'Vice et vertu',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Eden Prime': 'エデン・プライム',
        'Guardian of Paradise': 'エデン・ガーデナー',
      },
      'replaceText': {
        'Delta Attack': 'デルタアタック',
        'Dimensional Shift': 'ディメンションシフト',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eternal Breath': 'エターナル・ブレス',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Heavensunder': 'ヘヴンサンダー',
        'Mana Burst': 'マナバースト',
        'Mana Slice': 'マナスラッシュ',
        'Paradisal Dive': 'パラダイスダイブ',
        'Paradise Lost': 'パラダイスロスト',
        'Paradise Regained': 'パラダイスリゲイン',
        'Pure Beam': 'ピュアレイ',
        'Pure Light': 'ピュアライト',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Eden Prime': '至尊伊甸',
        'Guardian of Paradise': '伊甸守护者',
      },
      'replaceText': {
        'Delta Attack': '三角攻击',
        'Dimensional Shift': '空间转换',
        'Eden\'s Flare': '伊甸核爆',
        'Eden\'s Gravity': '伊甸重力',
        'Eternal Breath': '永恒吐息',
        'Fragor Maximus': '极大爆炸',
        'Heavensunder': '天国分断',
        'Mana Burst': '魔力爆发',
        'Mana Slice': '魔力斩击',
        'Paradisal Dive': '乐园冲',
        'Paradise Lost': '失乐园',
        'Paradise Regained': '复乐园',
        'Pure Beam': '净土射线',
        'Pure Light': '净土之光',
        'Spear of Paradise': '乐园之枪',
        'Vice and Virtue': '恶习与美德',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Eden Prime': '에덴 프라임',
        'Guardian of Paradise': '에덴 정원사',
      },
      'replaceText': {
        'Cross': '십자',
        'Delta Attack': '델타 공격',
        'Dimensional Shift': '차원 전환',
        'Donut': '중앙',
        'Eden\'s Flare': '에덴 플레어',
        'Eden\'s Gravity': '에덴 그라비데',
        'Eternal Breath': '영원의 숨결',
        'Fragor Maximus': '우주 탄생',
        'Heavensunder': '천국의 낙뢰',
        'Mana Burst': '마나 폭발',
        'Mana Slice': '마나 베기',
        'Paradisal Dive': '낙원 강하',
        'Paradise Lost': '실낙원',
        'Paradise Regained': '복낙원',
        'Pure Beam': '완전한 광선',
        'Pure Light': '완전한 빛',
        'Spear of Paradise': '낙원의 창',
        'Vice and Virtue': '선과 악',
      },
    },
  ],
}];
