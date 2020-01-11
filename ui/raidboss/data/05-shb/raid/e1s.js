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
      regex: / 14:3D70:Eden Prime starts using Eden's Gravity/,
      regexCn: / 14:3D70:至尊伊甸 starts using 伊甸重力/,
      regexDe: / 14:3D70:Prim-Eden starts using Eden-Gravitas/,
      regexFr: / 14:3D70:Primo-Éden starts using Gravité Édénique/,
      regexJa: / 14:3D70:エデン・プライム starts using エデン・グラビデ/,
      regexKo: / 14:3D70:에덴 프라임 starts using 에덴 그라비데/,
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
      regexKo: Regexes.gainsEffect({ target: '에덴 프라임', effect: 'Paradise Regained', capture: false }),
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
      regexKo: Regexes.losesEffect({ target: '에덴 프라임', effect: 'Paradise Regained', capture: false }),
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      regex: / 14:3D70:Eden Prime starts using Eden's Gravity/,
      regexCn: / 14:3D70:至尊伊甸 starts using 伊甸重力/,
      regexDe: / 14:3D70:Prim-Eden starts using Eden-Gravitas/,
      regexFr: / 14:3D70:Primo-Éden starts using Gravité Édénique/,
      regexJa: / 14:3D70:エデン・プライム starts using エデン・グラビデ/,
      regexKo: / 14:3D70:에덴 프라임 starts using 에덴 그라비데/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'E1S Fragor Maximus',
      regex: / 14:3D8B:Eden Prime starts using Fragor Maximus/,
      regexCn: / 14:3D8B:至尊伊甸 starts using 极大爆炸/,
      regexDe: / 14:3D8B:Prim-Eden starts using Fragor Maximus/,
      regexFr: / 14:3D8B:Primo-Éden starts using Fragor Maximus/,
      regexJa: / 14:3D8B:エデン・プライム starts using フラゴルマクシマス/,
      regexKo: / 14:3D8B:에덴 프라임 starts using 우주 탄생/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'E1S Dimensional Shift',
      regex: / 14:3D7F:Eden Prime starts using Dimensional Shift/,
      regexCn: / 14:3D7F:至尊伊甸 starts using 空间转换/,
      regexDe: / 14:3D7F:Prim-Eden starts using Dimensionsverschiebung/,
      regexFr: / 14:3D7F:Primo-Éden starts using Translation Dimensionnelle/,
      regexJa: / 14:3D7F:エデン・プライム starts using ディメンションシフト/,
      regexKo: / 14:3D7F:에덴 프라임 starts using 차원 전환/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'E1S Spear Of Paradise',
      regex: / 14:3D88:Eden Prime starts using Spear Of Paradise on (\y{Name})/,
      regexCn: / 14:3D88:至尊伊甸 starts using 乐园之枪 on (\y{Name})/,
      regexDe: / 14:3D88:Prim-Eden starts using Paradiesspeer on (\y{Name})/,
      regexFr: / 14:3D88:Primo-Éden starts using Lance [Dd]u [Pp]aradis on (\y{Name})/,
      regexJa: / 14:3D88:エデン・プライム starts using スピア・オブ・パラダイス on (\y{Name})/,
      regexKo: / 14:3D88:에덴 프라임 starts using 낙원의 창 on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'タンクスイッチ',
          cn: '换T！',
          ko: '탱 교대',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑点 ' + data.ShortName(matches[1]),
            ko: '"' + data.ShortName(matches[1]) + '" 탱버',
          };
        }
      },
    },
    {
      id: 'E1S Eden\'s Flare',
      regex: / 14:3D73:Eden Prime starts using Eden's Flare/,
      regexCn: / 14:3D73:至尊伊甸 starts using 伊甸核爆/,
      regexDe: / 14:3D73:Prim-Eden starts using Eden-Flare/,
      regexFr: / 14:3D73:Primo-Éden starts using Brasier Édénique/,
      regexJa: / 14:3D73:エデン・プライム starts using エデン・フレア/,
      regexKo: / 14:3D73:에덴 프라임 starts using 에덴 플레어/,
      alertText: {
        en: 'Under',
        de: 'Unter den Boss',
        fr: 'Sous le boss',
        ja: '中へ',
        cn: '脚下',
        ko: '보스 아래',
      },
    },
    {
      id: 'E1S Delta Attack 1',
      regex: / 14:44F4:Eden Prime starts using Delta Attack/,
      regexCn: / 14:44F4:至尊伊甸 starts using 三角攻击/,
      regexDe: / 14:44F4:Prim-Eden starts using Delta-Attacke/,
      regexFr: / 14:44F4:Primo-Éden starts using Attaque Delta/,
      regexJa: / 14:44F4:エデン・プライム starts using デルタアタック/,
      regexKo: / 14:44F4:에덴 프라임 starts using 델타 공격/,
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
      regex: / 14:44F8:Eden Prime starts using Delta Attack/,
      regexCn: / 14:44F8:至尊伊甸 starts using 三角攻击/,
      regexDe: / 14:44F8:Prim-Eden starts using Delta-Attacke/,
      regexFr: / 14:44F8:Primo-Éden starts using Attaque Delta/,
      regexJa: / 14:44F8:エデン・プライム starts using デルタアタック/,
      regexKo: / 14:44F8:에덴 프라임 starts using 델타 공격/,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Get In, Spread',
            de: 'Rein gehen, verteilen',
            ja: '中で散開',
            fr: 'Intérieur, écartez-vous',
            cn: '中间散开',
            ko: '보스 가까이 탱끼리 같이',
          };
        }
        return {
          en: 'In, Stack Behind',
          de: 'Rein, hinten stacken',
          ja: '背面集合',
          fr: 'Intérieur, pack derrière',
          cn: '背面集合',
          ko: '보스 가까이, 뒤쪽',
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
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):에덴 프라임 starts using 선과 악/,
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
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:3D7A:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:3D7A:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7A:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7A:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:3D7A:에덴 프라임 starts using 선과 악/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      regex: / 14:44EE:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:44EE:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:44EE:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:44EE:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:44EE:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:44EE:에덴 프라임 starts using 선과 악/,
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      regex: / 14:3D78:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:3D78:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:3D78:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D78:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D78:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:3D78:에덴 프라임 starts using 선과 악/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      regex: / 14:44F0:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:44F0:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:44F0:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:44F0:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:44F0:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:44F0:에덴 프라임 starts using 선과 악/,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      regex: / 14:3D7D:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:3D7D:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:3D7D:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7D:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7D:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:3D7D:에덴 프라임 starts using 선과 악/,
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
      regex: / 14:3D7A:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexCn: / 14:3D7A:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:3D7A:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7A:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7A:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:3D7A:에덴 프라임 starts using 선과 악/,
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
      regex: / 14:3D78:Eden Prime starts using Vice [Aa]d Virtue/,
      regexCn: / 14:3D78:至尊伊甸 starts using 恶习与美德/,
      regexDe: / 14:3D78:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D78:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D78:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      regexKo: / 14:3D78:에덴 프라임 starts using 선과 악/,
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
      regex: / 14:3D8D:Guardian Of Paradise starts using Mana Boost/,
      regexCn: / 14:3D8D:伊甸守护者 starts using 魔力增幅/,
      regexDe: / 14:3D8D:Hüter von Eden starts using Mana-Verstärker/,
      regexFr: / 14:3D8D:Gardien du Jardin starts using Amplificateur [dD]e [mM]ana/,
      regexJa: / 14:3D8D:エデン・ガーデナー starts using マナブースター/,
      regexKo: / 14:3D8D:Guardian Of Paradise starts using 마나 부스터/, // 기존 번역 참고 번역
      condition: function(data) {
        return data.CanSilence();
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Silence Guardian',
        de: 'Stumm auf Hüter ',
        ja: '沈黙',
        fr: 'Interrompez le gardien',
        cn: '沉默小怪',
        ko: '쫄 침묵',
      },
    },
    {
      id: 'E1S Pure Light',
      regex: / 14:3D8A:Eden Prime starts using Pure Light/,
      regexCn: / 14:3D8A:至尊伊甸 starts using 净土之光/,
      regexDe: / 14:3D8A:Prim-Eden starts using Läuterndes Licht/,
      regexFr: / 14:3D8A:Primo-Éden starts using Lumière [pP]urificatrice/,
      regexJa: / 14:3D8A:エデン・プライム starts using ピュアライト/,
      regexKo: / 14:3D8A:에덴 프라임 starts using 완전한 빛/,
      alertText: {
        en: 'Get Behind',
        de: 'Hinter den Boss',
        fr: 'Derrière le boss',
        ja: '背面へ',
        cn: '背面',
        ko: '보스 뒤로',
      },
    },
    {
      id: 'E1S Pure Beam 1',
      regex: / 14:3D80:Eden Prime starts using Pure Beam/,
      regexCn: / 14:3D80:至尊伊甸 starts using 净土射线/,
      regexDe: / 14:3D80:Prim-Eden starts using Läuternder Strahl/,
      regexFr: / 14:3D80:Primo-Éden starts using Rayon [pP]urificateur/,
      regexJa: / 14:3D80:エデン・プライム starts using ピュアレイ/,
      regexKo: / 14:3D80:에덴 프라임 starts using 완전한 광선/,
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
      regex: / 14:3D82:Eden Prime starts using Pure Beam/,
      regexCn: / 14:3D82:至尊伊甸 starts using 净土射线/,
      regexDe: / 14:3D82:Prim-Eden starts using Läuternder Strahl/,
      regexFr: / 14:3D82:Primo-Éden starts using Rayon [pP]urificateur/,
      regexJa: / 14:3D82:エデン・プライム starts using ピュアレイ/,
      regexKo: / 14:3D82:에덴 프라임 starts using 완전한 광선/,
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
        'Engage!': 'Start!',
        'Eden Prime': 'Prim-Eden',
        'Arcane Sphere': 'Arkane Sphäre',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'attack': 'Attacke',
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
        'Enrage': 'Finalangriff',
        'Eden\'s Thunder III': 'Eden-Blitzga',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Fire III': 'Eden-Feuga',
        'Eden\'s Blizzard III': 'Eden-Eisga',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Delta Attack': 'Delta-Attacke',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '--center--': '--mitte--',
        'Vice And Virtue': 'Laster und Tugend',
        'Spear Of Paradise': 'Paradiesspeer',
        '--corner--': '--ecke--',
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
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Eden Prime': 'Primo-Éden',
        'Arcane Sphere': 'Sphère Arcanique',
      },
      'replaceText': {
        'attack': 'Attaque',
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
        'Enrage': 'Enrage',
        'Eden\'s Thunder III': 'Méga Foudre édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Fire III': 'Méga Feu édénique',
        'Eden\'s Blizzard III': 'Méga Glace édénique',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Delta Attack': 'Attaque Delta',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        '--center--': '--Centre--',
        '--corner--': '--Coin--',
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
      'replaceSync': {
        'Guardian of Paradise': 'エデン・ガーデナー',
        'Engage!': '戦闘開始！',
        'Eden Prime': 'エデン・プライム',
        'Arcane Sphere': '立体魔法陣',
      },
      'replaceText': {
        'attack': '攻撃',
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
        'Engage!': '战斗开始！',
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
        'attack': '攻击',
        '--corner--': '--角落--',
        '--center--': '--中央--',
        '--untargetable--': '--无法选中--',
        '--targetable--': '--可选中--',
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
        'Engage!': '전투 시작!',
        'Eden Prime': '에덴 프라임',
        'Arcane Sphere': '입체 마법진',
        'Guardian of Paradise': '에덴의 수호자',
      },
      'replaceText': {
        'attack': '공격',
        'Vice of Vanity': '허영의 악덕',
        'Vice of Thievery': 'Vice of Thievery',
        'Vice of Sloth': 'Vice of Sloth',
        'Vice of Pride': 'Vice of Pride',
        'Vice of Greed': 'Vice of Greed',
        'Vice of Apathy': '냉담의 악덕',
        'Vice and Virtue': '선과 악',
        'Spear of Paradise': '낙원의 창',
        'Regained Thunder III': 'Regained 선더가',
        'Regained Fire III': 'Regained 파이가',
        'Regained Blizzard III': 'Regained 블리자가',
        'Pure Light': '완전한 빛',
        'Pure Beam': '완전한 광선',
        'Primeval Stasis': '태초의 안정',
        'Paradise Regained': 'Paradise Regained',
        'Paradise Lost': '실낙원',
        'Paradisal Dive': '낙원 강하',
        'Mana Slice': '마나 베기',
        'Mana Burst': '마나 폭발',
        'Mana Boost': '마나 부스터',
        'Heavensunder': '천국의 낙뢰',
        'Fragor Maximus': '우주 탄생',
        'Eternal Breath': '영원의 숨결',
        'Enrage': '전멸기',
        'Eden\'s Thunder III': '에덴 선더가',
        'Eden\'s Gravity': '에덴 그라비데',
        'Eden\'s Flare': '에덴 플레어',
        'Eden\'s Fire III': '에덴 파이가',
        'Eden\'s Blizzard III': '에덴 블리자가',
        'Dimensional Shift': '차원 전환',
        'Delta Attack': '델타 공격',
        '--corner--': '--모서리--',
        '--center--': '--중앙--',
        '--untargetable--': '--타겟불가능--',
        '--targetable--': '--타겟가능--',
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
