'use strict';

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: {
    en: /^Alphascape V1\.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(阿尔法幻境1\)$/,
    ko: /^차원의 틈 오메가: 알파편\(영웅\) \(1\)$/,
  },
  timelineFile: 'o9s.txt',
  triggers: [
    // General actions
    {
      id: 'O9S Chaotic Dispersion',
      regex: Regexes.startsUsing({ id: '3170', source: 'Chaos' }),
      regexDe: Regexes.startsUsing({ id: '3170', source: 'Chaos' }),
      regexFr: Regexes.startsUsing({ id: '3170', source: 'Chaos' }),
      regexJa: Regexes.startsUsing({ id: '3170', source: 'カオス' }),
      regexCn: Regexes.startsUsing({ id: '3170', source: '卡奥斯' }),
      regexKo: Regexes.startsUsing({ id: '3170', source: '카오스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
            ko: '탱버 대상자',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tank-Wechsel',
            fr: 'Tank Swap',
            ja: 'スイッチ',
            cn: '换T',
            ko: '탱 교대',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑-> ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + ' 탱버',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
            ko: '탱버',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'tank swap',
            de: 'tenk wechsel',
            fr: 'tank swap',
            ja: 'スイッチ',
            cn: '换T',
            ko: '탱 교대',
          };
        }
      },
    },
    {
      id: 'O9S Longitudinal Implosion',
      regex: Regexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3172', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3172', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3172', source: '카오스', capture: false }),
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Front/Back -> Sides',
            de: 'Stirb Vorne/Hinten -> Seiten',
            fr: 'Devant/Derrière puis Côtés',
            ja: '縦 -> 横で死ぬ',
            cn: '死：前后 -> 左右',
            ko: '앞뒤 -> 양옆 (디버프)',
          };
        }
      },
      infoText: function(data) {
        if (!data.primordialCrust) {
          return {
            en: 'Sides -> Front/Back',
            de: 'Seiten -> Vorne/Hinten',
            fr: 'Côtés puis Devant/Derrière',
            ja: '横 -> 縦',
            cn: '左右 -> 前后',
            ko: '양옆 -> 앞뒤',
          };
        }
      },
      tts: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'die on back',
            de: 'hinten dran',
            fr: 'aller derrière',
            ja: '縦から',
            cn: '前后找死',
            ko: '뒤에서 맞기 (디버프)',
          };
        }
        return {
          en: 'go to sides',
          de: 'an die Seiten',
          fr: 'aller sur les cotés',
          ja: '横から',
          cn: '左右闪避',
          ko: '양옆으로',
        };
      },
    },
    {
      id: 'O9S Latitudinal Implosion',
      regex: Regexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3173', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3173', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3173', source: '카오스', capture: false }),
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Sides -> Front/Back',
            de: 'Stirb an Seiten -> Vorne/Hinten',
            fr: 'Devant/Derrière puis Côtés',
            ja: '横 -> 縦で死ぬ',
            cn: '死：左右 -> 前后',
            ko: '양옆 -> 앞뒤 (디버프)',
          };
        }
      },
      infoText: function(data) {
        if (!data.primordialCrust) {
          return {
            en: 'Front/Back -> Sides',
            de: 'Vorne/Hinten -> Seiten',
            fr: 'Devant/Derrière puis Côtés',
            ja: '縦 -> 横',
            cn: '前后 -> 左右',
            ko: '앞뒤 -> 양옆',
          };
        }
      },
      tts: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'die on sides',
            de: 'an die Seiten',
            fr: 'aller sur les cotés',
            ja: '横から',
            cn: '左右找死',
            ko: '양옆 (디버프)',
          };
        }
        return {
          en: 'go to back',
          de: 'hinten dran',
          fr: 'aller derrière',
          ja: '縦から',
          cn: '前后闪避',
          ko: '뒤로 이동',
        };
      },
    },
    {
      id: 'O9S Damning Edict',
      regex: Regexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3171', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3171', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3171', source: '카오스', capture: false }),
      infoText: {
        en: 'Get Behind',
        de: 'Hinten dran',
        fr: 'Derrière le boss',
        ja: '背面へ',
        ko: '뒤로 이동',
      },
    },
    {
      id: 'O9S Orbs Fiend',
      regex: Regexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '317D', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '317D', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '317D', source: '카오스', capture: false }),
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Orb Tethers',
            de: 'Kugel-Verbindungen',
            fr: 'Récupérez l\'orbe',
            ja: '線出たよ',
            cn: '接线',
            ko: '구슬 연결',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Orb Tethers',
            de: 'Kugel-Verbindungen',
            fr: 'Récupérez l\'orbe',
            ja: '線出たよ',
            cn: '坦克接线注意治疗',
            ko: '구슬 연결',
          };
        }
      },
    },
    // Fire Path
    {
      id: 'O9S Fire Phase Tracking',
      regex: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3186', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3186', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3186', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'fire';
      },
    },
    {
      id: 'O9S Entropy Spread',
      regex: Regexes.gainsEffect({ effect: 'Entropy' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosflammen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Flammes Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の炎' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之炎' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 불' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      preRun: function(data) {
        data.entropyCount = data.entropyCount || 0;
        data.entropyCount += 1;
      },
      delaySeconds: function(data, matches) {
        // Warn dps earlier to stack.
        if (data.role != 'tank' && data.role != 'healer' && data.entropyCount == 2)
          return parseFloat(matches.duration) - 12;
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data) {
        if (data.phaseType == 'enrage' || data.phaseType == 'orb' || data.entropyCount == 1) {
          return {
            en: 'Spread',
            de: 'Verteilen',
            fr: 'Ecartez-vous',
            ja: '散開',
            cn: '分散',
            ko: '산개',
          };
        } else if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread and Stay',
            de: 'Verteilen und bleiben',
            fr: 'Ecartez-vous et restez',
            ja: '散開して待機',
            cn: '分散并停留',
            ko: '산개하고 가만히',
          };
        }
        // DPS entropy #2
        return {
          en: 'Stack and Stay Out',
          de: 'Stack und Bleiben',
          fr: 'Packez-vous et restez',
          ja: '中央に集合',
          cn: '中间集合',
          ko: '산개하고 바깥에 있기',
        };
      },
      run: function(data) {
        if (data.phaseType == 'orb' || data.entropyCount == 2)
          delete data.entropyCount;
      },
    },
    {
      id: 'O9S Entropy Avoid Hit',
      regex: Regexes.gainsEffect({ effect: 'Entropy' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosflammen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Flammes Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の炎' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之炎' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 불' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phaseType == 'fire';
      },
      delaySeconds: function(data, matches) {
        // Folks get either the 24 second or the 10 second.
        // So, delay for the opposite minus 5.
        let seconds = parseFloat(matches.duration);
        // Got 24 seconds (dps)
        if (seconds > 11)
          return 5;
        // Got 10 seconds (tank)
        return 19;
      },
      infoText: {
        en: 'Hide Middle',
        de: 'Zur Mitte',
        fr: 'Allez au centre',
        ja: '中央へ',
        cn: '中间躲避',
        ko: '중앙으로 모이기',
      },
    },
    {
      id: 'O9S Fire Big Bang',
      regex: Regexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3180', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3180', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3180', source: '카오스', capture: false }),
      // Each big bang has its own cast, so suppress.
      suppressSeconds: 1,
      condition: function(data) {
        return data.phaseType == 'fire';
      },
      alertText: {
        en: 'Hide Middle',
        de: 'Zur Mitte',
        fr: 'Allez au centre',
        ja: '中央へ',
        cn: '中间躲避',
        ko: '중앙으로 모이기',
      },
    },
    // Water Path
    {
      id: 'O9S Water Phase Tracking',
      regex: Regexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3187', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3187', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3187', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'water';
      },
    },
    {
      id: 'O9S Dynamic Fluid 1',
      regex: Regexes.gainsEffect({ effect: 'Dynamic Fluid', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosspritzer', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Du Chaos', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の水', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之水', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 물', capture: false }),
      condition: function(data) {
        return data.phaseType == 'water';
      },
      suppressSeconds: 1,
      // T/H get 10s & DPS get 17s
      delaySeconds: 5,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Packez-vous',
        ja: 'スタック',
        cn: '集合放月环',
        ko: '도넛 쉐어',
      },
    },
    {
      id: 'O9S Dynamic Fluid 2',
      regex: Regexes.gainsEffect({ effect: 'Dynamic Fluid', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosspritzer', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Du Chaos', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の水', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之水', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 물', capture: false }),
      condition: function(data) {
        return data.phaseType == 'water';
      },
      suppressSeconds: 1,
      // T/H get 10s & DPS get 17s
      delaySeconds: 12,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Packez-vous',
        ja: 'スタック',
        cn: '集合放月环',
        ko: '도넛 쉐어',
      },
    },
    {
      id: 'O9S Dynamic Fluid 3',
      regex: Regexes.gainsEffect({ effect: 'Dynamic Fluid', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosspritzer', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Du Chaos', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の水', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之水', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 물', capture: false }),
      condition: function(data) {
        return data.phaseType == 'enrage';
      },
      suppressSeconds: 1,
      // enrage -> 6s
      delaySeconds: 1,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Packez-vous',
        ja: 'スタック',
        cn: '集合放月环',
        ko: '도넛 쉐어',
      },
    },
    {
      id: 'O9S Knock Down Marker',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: function(data) {
        if (data.phaseType == 'water') {
          return {
            en: 'Drop Outside',
            de: 'Gehe Nord / Süd',
            fr: 'Allez au Nord/Sud',
            ja: 'メテオ捨てて',
            cn: '远离放点名',
            ko: '바깥으로 빼기',
          };
        } else if (data.phaseType == 'wind') {
          return {
            en: 'Drop Outside + Knockback',
            de: 'Geh nächste Ecke nah am Tornado',
            fr: 'Déposez dans les coins',
            ja: 'メテオ捨てて + ノックバック',
            cn: '远离放点名 + 冲回人群',
            ko: '바깥으로 빼기 + 넉백',
          };
        }
      },
    },
    // Wind Path
    {
      id: 'O9S Wind Phase Tracking',
      regex: Regexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3188', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3188', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3188', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'wind';
      },
    },
    {
      id: 'O9S Headwind',
      regex: Regexes.gainsEffect({ effect: 'Headwind' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosböen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Vent Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の風' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之风' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 바람' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.wind = 'head';
      },
    },
    {
      id: 'O9S Tailwind',
      regex: Regexes.gainsEffect({ effect: 'Tailwind' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaossturm' }),
      regexFr: Regexes.gainsEffect({ effect: 'Vent Contraire Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の逆風' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之逆风' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 역풍' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.wind = 'tail';
      },
    },
    {
      id: 'O9S Cyclone Knockback',
      regex: Regexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '318F', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '318F', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '318F', source: '카오스', capture: false }),
      alarmText: function(data) {
        if (data.wind == 'head') {
          return {
            en: 'Back to Tornado',
            de: 'Rücken zum Tornado',
            fr: 'Regardez vers l\'extérieur',
            cn: '背对龙卷风',
            ko: '토네이도 뒤돌기',
          };
        }
        if (data.wind == 'tail') {
          return {
            en: 'Face the Tornado',
            de: 'Zum Tornado hin',
            fr: 'Regardez la tornade',
            cn: '面对龙卷风',
            ko: '토네이도 바라보기',
          };
        }
      },
      run: function(data) {
        delete data.wind;
      },
    },
    // Earth Path
    {
      id: 'O9S Earth Phase Tracking',
      regex: Regexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3189', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3189', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3189', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'earth';
      },
    },
    {
      id: 'O9S Accretion',
      regex: Regexes.gainsEffect({ effect: 'Accretion', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaossumpf', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Bourbier Du Chaos', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の泥土', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之泥土', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 진흙', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 10,
      infoText: function(data) {
        if (data.phaseType != 'earth') {
          return {
            en: 'Heal All to Full',
            de: 'Alle vollheilen',
            fr: 'Soignez tout le monde full vie',
            ja: 'HP戻して',
            cn: '奶满全队',
            ko: '전원 체력 풀피로',
          };
        }
        return {
          en: 'Heal Tanks/Healers to full',
          de: 'Tanks/Heiler vollheilen',
          fr: 'Soignez Heals/Tanks full vie',
          ja: 'HP戻して',
          cn: '奶满T奶',
          ko: '탱/힐 체력 풀피로',
        };
      },
    },
    {
      id: 'O9S Primordial Crust',
      regex: Regexes.gainsEffect({ effect: 'Primordial Crust' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaoserde' }),
      regexFr: Regexes.gainsEffect({ effect: 'Terre Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の土' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之土' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 흙' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.phaseType != 'orb';
      },
      infoText: {
        en: 'Die on next mechanic',
        de: 'An nächster Mechanik tödlichen Schaden nehmen',
        fr: 'Mourrez sur la prochaine mécanique',
        ja: '次のギミックで死んでね',
        cn: '想办法找死',
        ko: '다음 기믹에 맞기 (디버프)',
      },
      run: function(data) {
        data.primordialCrust = true;
      },
    },
    {
      id: 'O9S Primordial Crust Cleanup',
      regex: Regexes.gainsEffect({ effect: 'Primordial Crust' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaoserde' }),
      regexFr: Regexes.gainsEffect({ effect: 'Terre Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の土' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之土' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 흙' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 30,
      run: function(data) {
        delete data.primordialCrust;
      },
    },
    {
      id: 'O9S Earth Stack Marker',
      regex: Regexes.headMarker({ id: '003E', capture: false }),
      suppressSeconds: 10,
      infoText: {
        en: 'Stack with partner',
        de: 'Stacks verteilen',
        fr: 'Packez-vous en binôme',
        cn: '与伙伴重合',
        ko: '파트너랑 모이기',
      },
    },

    // Orb Phase
    {
      id: 'O9S Orb Phase Tracking',
      regex: Regexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '318A', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '318A', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '318A', source: '카오스', capture: false }),
      preRun: function(data) {
        data.phaseType = 'orb';
      },
    },
    {
      id: 'O9S Orb Entropy',
      regex: Regexes.gainsEffect({ effect: 'Entropy' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosflammen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Flammes Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の炎' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之炎' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 불' }),
      condition: function(data, matches) {
        return matches.target != data.me && data.phaseType == 'orb';
      },
      suppressSeconds: 10,
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      alertText: function(data) {
        if (data.head == 'wind') {
          return {
            en: 'Back to DPS',
            de: 'Rücken zum DPS',
            fr: 'Dos au DPS',
            ja: 'DPSの後ろへ',
            cn: '背对DPS',
            ko: '딜러한테서 뒤돌기',
          };
        }
      },
      run: function(data) {
        delete data.wind;
      },
    },
    {
      id: 'O9S Orb Dynamic Fluid',
      regex: Regexes.gainsEffect({ effect: 'Dynamic Fluid' }),
      regexDe: Regexes.gainsEffect({ effect: 'Chaosspritzer' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Du Chaos' }),
      regexJa: Regexes.gainsEffect({ effect: '混沌の水' }),
      regexCn: Regexes.gainsEffect({ effect: '混沌之水' }),
      regexKo: Regexes.gainsEffect({ effect: '혼돈의 물' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phaseType == 'orb';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: {
        en: 'Hit DPS with Water',
        de: 'töte deinen DPS',
        fr: 'Tuez les DPS',
        ja: '水当てて',
        cn: '水环害死DPS',
        ko: '딜러 물 맞기',
      },
    },

    // Enrage Phase
    {
      id: 'O9S Enrage Phase Tracking',
      regex: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3186', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3186', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3186', source: '카오스', capture: false }),
      run: function(data) {
        data.blazeCount = data.blazeCount || 0;
        data.blazeCount++;
        if (data.blazeCount >= 3)
          data.phaseType = 'enrage';
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Chaossphäre',
        'dark crystal': 'dunkl(?:e|er|es|en) Kristall',
      },
      'replaceText': {
        'Big Bang': 'Quantengravitation',
        'Blaze': 'Flamme',
        'Bowels of Agony': 'Quälende Eingeweide',
        'Chaosphere': 'Chaossphäre',
        'Chaotic Dispersion': 'Chaos-Dispersion',
        'Cyclone': 'Tornado',
        'Damning Edict': 'Verdammendes Edikt',
        'Earthquake': 'Erdbeben',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock Down': 'Niederschmettern',
        'Knock(?! )': 'Einschlag',
        'Latitudinal Implosion': 'Horizontale Implosion',
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',
        'Longitudinal Implosion': 'Vertikale Implosion',
        'Orbshadow': 'Kugelschatten',
        'Shockwave': 'Schockwelle',
        'Soul of Chaos': 'Chaosseele',
        'Stray Earth': 'Chaoserde',
        'Stray Flames': 'Chaosflammen',
        'Stray Gusts': 'Chaosböen',
        'Stray Spray': 'Chaosspritzer',
        'Tsunami': 'Tsunami',
        'Umbra Smash': 'Schattenschlag',
        '\\(ALL\\)': '(ALLE)',
      },
      '~effectNames': {
        'Accretion': 'Chaossumpf',
        'Dynamic Fluid': 'Chaosspritzer',
        'Entropy': 'Chaosflammen',
        'Headwind': 'Chaosböen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Primordial Crust': 'Chaoserde',
        'Tailwind': 'Chaossturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Sphère de chaos',
        'dark crystal': 'cristal noir',
      },
      'replaceText': {
        'Big Bang': 'Saillie',
        'Blaze': 'Fournaise',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaosphere': 'Sphère de chaos',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Grand séisme',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock Down': 'Ordre d\'impact',
        'Knock(?! )': 'Impact',
        'Latitudinal Implosion': 'Implosion horizontale',
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        'Longitudinal Implosion': 'Implosion verticale',
        'Orbshadow': 'Poursuite',
        'Shockwave': 'Onde de choc',
        'Soul of Chaos': 'Âme du chaos',
        'Stray Earth': 'Terre du chaos',
        'Stray Flames': 'Flammes du chaos',
        'Stray Gusts': 'Vent du chaos',
        'Stray Spray': 'Eaux du chaos',
        'Tsunami': 'Raz-de-marée',
        'Umbra Smash': 'Fracas ombral',
        '\\(ALL\\)': '(Tous)',
      },
      '~effectNames': {
        'Accretion': 'Bourbier du chaos',
        'Dynamic Fluid': 'Eaux du chaos',
        'Entropy': 'Flammes du chaos',
        'Headwind': 'Vent du chaos',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Primordial Crust': 'Terre du chaos',
        'Tailwind': 'Vent contraire du chaos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chaos': 'カオス',
        'Chaosphere': 'カオススフィア',
        'dark crystal': '黒水晶',
      },
      'replaceText': {
        'Big Bang': '突出',
        'Blaze': 'ほのお',
        'Bowels of Agony': 'バウル・オブ・アゴニー',
        'Chaosphere': 'カオススフィア',
        'Chaotic Dispersion': 'カオティックディスパーション',
        'Cyclone': 'たつまき',
        'Damning Edict': 'ダミングイーディクト',
        'Earthquake': 'じしん',
        'Fiendish Orbs': '追尾せよ',
        'Knock Down': '着弾せよ',
        'Knock(?! )': '着弾',
        'Latitudinal Implosion': 'ホリゾンタルインプロージョン',
        'Long/Lat Implosion': 'Long/Lat Implosion', // FIXME
        'Longitudinal Implosion': 'ヴァーティカルインプロージョン',
        'Orbshadow': '追尾',
        'Shockwave': '衝撃波',
        'Soul of Chaos': 'ソウル・オブ・カオス',
        'Stray Earth': '混沌の土',
        'Stray Flames': '混沌の炎',
        'Stray Gusts': '混沌の風',
        'Stray Spray': '混沌の水',
        'Tsunami': 'つなみ',
        'Umbra Smash': 'アンブラスマッシュ',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': '混沌の泥土',
        'Dynamic Fluid': '混沌の水',
        'Entropy': '混沌の炎',
        'Headwind': '混沌の風',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Primordial Crust': '混沌の土',
        'Tailwind': '混沌の逆風',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chaos': '卡奥斯',
        'Chaosphere': '混沌晶球',
        'dark crystal': '黑水晶',
      },
      'replaceText': {
        'Big Bang': '돌출',
        'Blaze': '烈焰',
        'Bowels of Agony': '深层痛楚',
        'Chaosphere': '混沌晶球',
        'Chaotic Dispersion': '散布混沌',
        'Cyclone': '龙卷风',
        'Damning Edict': '诅咒敕令',
        'Earthquake': '地震',
        'Fiendish Orbs': '追踪',
        'Knock Down': '中弹',
        'Knock(?! )': 'Knock', // FIXME
        'Latitudinal Implosion': '纬度聚爆',
        'Long/Lat Implosion': '经/纬聚爆', // FIXME
        'Longitudinal Implosion': '经度聚爆',
        'Orbshadow': '追踪',
        'Shockwave': '冲击波',
        'Soul of Chaos': '混沌之魂',
        'Stray Earth': '混沌之土',
        'Stray Flames': '混沌之炎',
        'Stray Gusts': '混沌之风',
        'Stray Spray': '混沌之水',
        'Tsunami': '海啸',
        'Umbra Smash': '本影爆碎',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': '混沌之泥土',
        'Dynamic Fluid': '混沌之水',
        'Entropy': '混沌之炎',
        'Headwind': '混沌之风',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Physical Vulnerability Up': '物理受伤加重',
        'Primordial Crust': '混沌之土',
        'Tailwind': '混沌之逆风',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chaos': '카오스',
        'Chaosphere': '혼돈의 구체',
        'dark crystal': '흑수정',
      },
      'replaceText': {
        'Big Bang': '돌출하라',
        'Blaze': '화염',
        'Bowels of Agony': '고통의 심핵',
        'Chaosphere': '혼돈의 구체',
        'Chaotic Dispersion': '혼돈 유포',
        'Cyclone': '회오리',
        'Damning Edict': '파멸 포고',
        'Earthquake': '지진',
        'Fiendish Orbs': '추격하라',
        'Knock Down': '착탄하라',
        'Knock(?! )': '착탄',
        'Latitudinal Implosion': '가로 내파',
        'Long/Lat Implosion': '가로/세로 내파',
        'Longitudinal Implosion': '세로 내파',
        'Orbshadow': '추격',
        'Shockwave': '충격파',
        'Soul of Chaos': '혼돈의 영혼',
        'Stray Earth': '혼돈의 흙',
        'Stray Flames': '혼돈의 불',
        'Stray Gusts': '혼돈의 바람',
        'Stray Spray': '혼돈의 물',
        'Tsunami': '해일',
        'Umbra Smash': '그림자 타격',
        '\\(ALL\\)': '(모두)',
      },
      '~effectNames': {
        'Accretion': '혼돈의 진흙',
        'Dynamic Fluid': '혼돈의 물',
        'Entropy': '혼돈의 불',
        'Headwind': '혼돈의 바람',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Primordial Crust': '혼돈의 흙',
        'Tailwind': '바람몰이',
      },
    },
  ],
}];
