'use strict';

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: {
    en: /^Alphascape V1\.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(阿尔法幻境1\)$/,
    ko: /^차원의 틈 오메가: 알파편\(영웅\) \(1\)$/,
  },
  zoneId: ZoneId.AlphascapeV10Savage,
  timelineFile: 'o9s.txt',
  triggers: [
    // General actions
    {
      id: 'O9S Chaotic Dispersion',
      netRegex: NetRegexes.startsUsing({ id: '3170', source: 'Chaos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3170', source: 'Chaos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3170', source: 'Chaos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3170', source: 'カオス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3170', source: '卡奥斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3170', source: '카오스' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O9S Longitudinal Implosion',
      netRegex: NetRegexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3172', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3172', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3172', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3172', source: '카오스', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3173', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3173', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3173', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3173', source: '카오스', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3171', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3171', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3171', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3171', source: '카오스', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'O9S Orbs Fiend',
      netRegex: NetRegexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '317D', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '317D', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '317D', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '317D', source: '카오스', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3186', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3186', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3186', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'fire';
      },
    },
    {
      id: 'O9S Entropy Spread',
      netRegex: NetRegexes.gainsEffect({ effectId: '640' }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '640' }),
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
      netRegex: NetRegexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3180', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3180', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3180', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3180', source: '카오스', capture: false }),
      condition: function(data) {
        return data.phaseType == 'fire';
      },
      // Each big bang has its own cast, so suppress.
      suppressSeconds: 1,
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
      netRegex: NetRegexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3187', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3187', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3187', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3187', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'water';
      },
    },
    {
      id: 'O9S Dynamic Fluid 1',
      netRegex: NetRegexes.gainsEffect({ effectId: '641', capture: false }),
      condition: function(data) {
        return data.phaseType == 'water';
      },
      delaySeconds: 5,
      suppressSeconds: 1,
      // T/H get 10s & DPS get 17s
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
      netRegex: NetRegexes.gainsEffect({ effectId: '641', capture: false }),
      condition: function(data) {
        return data.phaseType == 'water';
      },
      // T/H get 10s & DPS get 17s
      delaySeconds: 12,
      suppressSeconds: 1,
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
      netRegex: NetRegexes.gainsEffect({ effectId: '641', capture: false }),
      condition: function(data) {
        return data.phaseType == 'enrage';
      },
      // enrage -> 6s
      delaySeconds: 1,
      suppressSeconds: 1,
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
      netRegex: NetRegexes.headMarker({ id: '0057' }),
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
      netRegex: NetRegexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3188', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3188', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3188', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3188', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'wind';
      },
    },
    {
      id: 'O9S Headwind',
      netRegex: NetRegexes.gainsEffect({ effectId: '642' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.wind = 'head';
      },
    },
    {
      id: 'O9S Tailwind',
      netRegex: NetRegexes.gainsEffect({ effectId: '643' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.wind = 'tail';
      },
    },
    {
      id: 'O9S Cyclone Knockback',
      netRegex: NetRegexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '318F', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '318F', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '318F', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '318F', source: '카오스', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3189', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3189', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3189', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3189', source: '카오스', capture: false }),
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'earth';
      },
    },
    {
      id: 'O9S Accretion',
      netRegex: NetRegexes.gainsEffect({ effectId: '644', capture: false }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '645' }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '645' }),
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
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '318A', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '318A', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '318A', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '318A', source: '카오스', capture: false }),
      preRun: function(data) {
        data.phaseType = 'orb';
      },
    },
    {
      id: 'O9S Orb Entropy',
      netRegex: NetRegexes.gainsEffect({ effectId: '640' }),
      condition: function(data, matches) {
        return matches.target != data.me && data.phaseType == 'orb';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      suppressSeconds: 10,
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
      netRegex: NetRegexes.gainsEffect({ effectId: '641' }),
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
      netRegex: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3186', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3186', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3186', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3186', source: '카오스', capture: false }),
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
      },
      'replaceText': {
        'Big Bang': 'Quantengravitation',
        'Blaze': 'Flamme',
        'Bowels of Agony': 'Quälende Eingeweide',
        'Chaotic Dispersion': 'Chaos-Dispersion',
        'Cyclone': 'Tornado',
        'Damning Edict': 'Verdammendes Edikt',
        'Earthquake': 'Erdbeben',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock(?! )': 'Einschlag',
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',
        'Soul of Chaos': 'Chaosseele',
        'Stray Earth': 'Chaoserde',
        'Stray Flames': 'Chaosflammen',
        'Stray Gusts': 'Chaosböen',
        'Stray Spray': 'Chaosspritzer',
        'Tsunami': 'Tsunami',
        'Umbra Smash': 'Schattenschlag',
        '\\(ALL\\)': '(ALLE)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
      },
      'replaceText': {
        'Big Bang': 'Saillie',
        'Blaze': 'Fournaise',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Grand séisme',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock(?! )': 'Impact',
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        'Soul of Chaos': 'Âme du chaos',
        'Stray Earth': 'Terre du chaos',
        'Stray Flames': 'Flammes du chaos',
        'Stray Gusts': 'Vent du chaos',
        'Stray Spray': 'Eaux du chaos',
        'Tsunami': 'Raz-de-marée',
        'Umbra Smash': 'Fracas ombral',
        '\\(ALL\\)': '(Tous)',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Chaos': 'カオス',
      },
      'replaceText': {
        'Big Bang': '突出',
        'Blaze': 'ほのお',
        'Bowels of Agony': 'バウル・オブ・アゴニー',
        'Chaotic Dispersion': 'カオティックディスパーション',
        'Cyclone': 'たつまき',
        'Damning Edict': 'ダミングイーディクト',
        'Earthquake': 'じしん',
        'Fiendish Orbs': '追尾せよ',
        'Knock(?! )': '着弾',
        'Soul of Chaos': 'ソウル・オブ・カオス',
        'Stray Earth': '混沌の土',
        'Stray Flames': '混沌の炎',
        'Stray Gusts': '混沌の風',
        'Stray Spray': '混沌の水',
        'Tsunami': 'つなみ',
        'Umbra Smash': 'アンブラスマッシュ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chaos': '卡奥斯',
      },
      'replaceText': {
        'Big Bang': '돌출',
        'Blaze': '烈焰',
        'Bowels of Agony': '深层痛楚',
        'Chaotic Dispersion': '散布混沌',
        'Cyclone': '龙卷风',
        'Damning Edict': '诅咒敕令',
        'Earthquake': '地震',
        'Fiendish Orbs': '追踪',
        'Knock(?! )': '中弹',
        'Long/Lat Implosion': '经/纬聚爆',
        'Soul of Chaos': '混沌之魂',
        'Stray Earth': '混沌之土',
        'Stray Flames': '混沌之炎',
        'Stray Gusts': '混沌之风',
        'Stray Spray': '混沌之水',
        'Tsunami': '海啸',
        'Umbra Smash': '本影爆碎',
        '\\(ALL\\)': '\\(全部\\)',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chaos': '카오스',
      },
      'replaceText': {
        'Big Bang': '돌출하라',
        'Blaze': '화염',
        'Bowels of Agony': '고통의 심핵',
        'Chaotic Dispersion': '혼돈 유포',
        'Cyclone': '회오리',
        'Damning Edict': '파멸 포고',
        'Earthquake': '지진',
        'Fiendish Orbs': '추격하라',
        'Knock(?! )': '착탄',
        'Long/Lat Implosion': '가로/세로 내파',
        'Soul of Chaos': '혼돈의 영혼',
        'Stray Earth': '혼돈의 흙',
        'Stray Flames': '혼돈의 불',
        'Stray Gusts': '혼돈의 바람',
        'Stray Spray': '혼돈의 물',
        'Tsunami': '해일',
        'Umbra Smash': '그림자 타격',
        '\\(ALL\\)': '(모두)',
      },
    },
  ],
}];
