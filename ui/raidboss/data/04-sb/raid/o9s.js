'use strict';

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: /^(Alphascape V1\.0 \(Savage\)|欧米茄零式时空狭缝 \(阿尔法幻境1\))$/,
  timelineFile: 'o9s.txt',
  triggers: [
    // General actions
    {
      id: 'O9S Chaotic Dispersion',
      regex: / 14:3170:Chaos starts using Chaotic Dispersion on (\y{Name})/,
      regexCn: / 14:3170:卡奥斯 starts using 散布混沌 on (\y{Name})/,
      regexDe: / 14:3170:Chaos starts using Chaos-Dispersion on (\y{Name})/,
      regexFr: / 14:3170:Chaos starts using Dispersion Chaotique on (\y{Name})/,
      regexJa: / 14:3170:カオス starts using カオティックディスパーション on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tank-Wechsel',
            fr: 'Tank Swap',
            ja: 'スイッチ',
            cn: '换T',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑-> ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'tank swap',
            de: 'tenk wechsel',
            fr: 'tank swap',
            ja: 'スイッチ',
            cn: '换T',
          };
        }
      },
    },
    {
      id: 'O9S Longitudinal Implosion',
      regex: / 14:3172:Chaos starts using Longitudinal Implosion/,
      regexDe: / 14:3172:Chaos starts using Vertikale Implosion/,
      regexFr: / 14:3172:Chaos starts using Implosion Verticale/,
      regexJa: / 14:3172:カオス starts using ヴァーティカルインプロージョン/,
      regexCn: / 14:3172:卡奥斯 starts using 经度聚爆/,
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Front/Back -> Sides',
            de: 'Stirb Vorne/Hinten -> Seiten',
            fr: 'Devant/Derrière puis Côtés',
            ja: '縦 -> 横で死ぬ',
            cn: '死：前后 -> 左右',
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
          };
        }
        return {
          en: 'go to sides',
          de: 'an die Seiten',
          fr: 'aller sur les cotés',
          ja: '横から',
          cn: '左右闪避',
        };
      },
    },
    {
      id: 'O9S Latitudinal Implosion',
      regex: / 14:3173:Chaos starts using Latitudinal Implosion/,
      regexDe: / 14:3173:Chaos starts using Horizontale Implosion/,
      regexFr: / 14:3173:Chaos starts using Implosion Horizontale/,
      regexJa: / 14:3173:カオス starts using ホリゾンタルインプロージョン/,
      regexCn: / 14:3173:卡奥斯 starts using 纬度聚爆/,
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Sides -> Front/Back',
            de: 'Stirb an Seiten -> Vorne/Hinten',
            fr: 'Devant/Derrière puis Côtés',
            ja: '横 -> 縦で死ぬ',
            cn: '死：左右 -> 前后',
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
          };
        }
        return {
          en: 'go to back',
          de: 'hinten dran',
          fr: 'aller derrière',
          ja: '縦から',
          cn: '前后闪避',
        };
      },
    },
    {
      id: 'O9S Damning Edict',
      regex: / 14:3171:Chaos starts using Damning Edict/,
      regexDe: / 14:3171:Chaos starts using Verdammendes Edikt/,
      regexFr: / 14:3171:Chaos starts using Décret Accablant/,
      regexJa: / 14:3171:カオス starts using ダミングイーディクト/,
      regexCn: / 14:3171:卡奥斯 starts using 诅咒敕令/,
      infoText: {
        en: 'Get Behind',
        de: 'Hinten dran',
        fr: 'Derrière le boss',
        ja: '背面へ',
      },
    },
    {
      id: 'O9S Orbs Fiend',
      regex: / 14:317D:Chaos starts using Fiendish Orbs/,
      regexDe: / 14:317D:Chaos starts using Höllenkugeln/,
      regexFr: / 14:317D:Chaos starts using Ordre De Poursuite/,
      regexJa: / 14:317D:カオス starts using 追尾せよ/,
      regexCn: / 14:317D:卡奥斯 starts using 追踪/,
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Orb Tethers',
            de: 'Kugel-Verbindungen',
            fr: 'Récupérez l\'orbe',
            ja: '線出たよ',
            cn: '接线',
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
          };
        }
      },
    },

    // Fire Path
    {
      id: 'O9S Fire Phase Tracking',
      regex: / 14:3186:Chaos starts using Blaze/,
      regexDe: / 14:3186:Chaos starts using Flamme/,
      regexFr: / 14:3186:Chaos starts using Flammes/,
      regexJa: / 14:3186:カオス starts using ほのお/,
      regexCn: / 14:3186:卡奥斯 starts using 烈焰/,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'fire';
      },
    },
    {
      id: 'O9S Entropy Spread',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Entropy from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaosflammen from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Flammes du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の炎 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌之炎 from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      preRun: function(data) {
        data.entropyCount = data.entropyCount || 0;
        data.entropyCount += 1;
      },
      delaySeconds: function(data, matches) {
        // Warn dps earlier to stack.
        if (data.role != 'tank' && data.role != 'healer' && data.entropyCount == 2)
          return parseFloat(matches[2]) - 12;
        return parseFloat(matches[2]) - 5;
      },
      alertText: function(data) {
        if (data.phaseType == 'enrage' || data.phaseType == 'orb' || data.entropyCount == 1) {
          return {
            en: 'Spread',
            de: 'Verteilen',
            fr: 'Ecartez-vous',
            ja: '散開',
            cn: '分散',
          };
        } else if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread and Stay',
            de: 'Verteilen und bleiben',
            fr: 'Ecartez-vous et restez',
            ja: '散開して待機',
            cn: '分散并停留',
          };
        }
        // DPS entropy #2
        return {
          en: 'Stack and Stay Out',
          de: 'Stack und Bleiben',
          fr: 'Packez-vous et restez',
          ja: '中央に集合',
          cn: '中间集合',
        };
      },
      run: function(data) {
        if (data.phaseType == 'orb' || data.entropyCount == 2)
          delete data.entropyCount;
      },
    },
    {
      id: 'O9S Entropy Avoid Hit',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Entropy from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaosflammen from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Flammes du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の炎 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_640|混沌之炎) from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phaseType == 'fire';
      },
      delaySeconds: function(data, matches) {
        // Folks get either the 24 second or the 10 second.
        // So, delay for the opposite minus 5.
        let seconds = parseFloat(matches[2]);
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
      },
    },
    {
      id: 'O9S Fire Big Bang',
      regex: / 14:3180:Chaos starts using Big Bang/,
      regexDe: / 14:3180:Chaos starts using Quantengravitation/,
      regexFr: / 14:3180:Chaos starts using Saillie/,
      regexJa: / 14:3180:カオス starts using 突出/,
      regexCn: / 14:3180:卡奥斯 starts using 顶起 /,
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
      },
    },

    // Water Path
    {
      id: 'O9S Water Phase Tracking',
      regex: / 14:3187:Chaos starts using Tsunami/,
      regexDe: / 14:3187:Chaos starts using Tsunami/,
      regexFr: / 14:3187:Chaos starts using Raz-De-Marée/,
      regexJa: / 14:3187:カオス starts using つなみ/,
      regexCn: / 14:3187:卡奥斯 starts using 海啸 /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'water';
      },
    },
    {
      id: 'O9S Dynamic Fluid 1',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Dynamic Fluid from/,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Chaosspritzer from/,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Eaux Du Chaos from/,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 混沌の水 from/,
      regexCn: / 1A:\y{ObjectId}:\y{Name} gains the effect of (?:Unknown_641|混沌之水) from/,
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
      },
    },
    {
      id: 'O9S Dynamic Fluid 2',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Dynamic Fluid from/,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Chaosspritzer from/,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Eaux du chaos from/,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 混沌の水 from/,
      regexCn: / 1A:\y{ObjectId}:\y{Name} gains the effect of (?:Unknown_641|混沌之水) from/,
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
      },
    },
    {
      id: 'O9S Dynamic Fluid 3',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Dynamic Fluid from/,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Chaosspritzer from/,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Eaux du chaos from/,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 混沌の水 from/,
      regexCn: / 1A:\y{ObjectId}:\y{Name} gains the effect of (?:Unknown_641|混沌之水) from/,
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
      },
    },
    {
      id: 'O9S Knock Down Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: function(data) {
        if (data.phaseType == 'water') {
          return {
            en: 'Drop Outside',
            de: 'Gehe Nord / Süd',
            fr: 'Allez au Nord/Sud',
            ja: 'メテオ捨てて',
            cn: '远离放点名',
          };
        } else if (data.phaseType == 'wind') {
          return {
            en: 'Drop Outside + Knockback',
            de: 'Geh nächste Ecke nah am Tornado',
            fr: 'Déposez dans les coins',
            ja: 'メテオ捨てて + ノックバック',
            cn: '远离放点名 + 冲回人群',
          };
        }
      },
    },

    // Wind Path
    {
      id: 'O9S Wind Phase Tracking',
      regex: / 14:3188:Chaos starts using Cyclone/,
      regexDe: / 14:3188:Chaos starts using Tornado/,
      regexFr: / 14:3188:Chaos starts using Tornade/,
      regexJa: / 14:3188:カオス starts using たつまき/,
      regexCn: / 14:3188:卡奥斯 starts using 龙卷风 /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'wind';
      },
    },
    {
      id: 'O9S Headwind',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Headwind from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaosböen from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Vent du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の風 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_642|混沌之风) from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.wind = 'head';
      },
    },
    {
      id: 'O9S Tailwind',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Tailwind from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaossturm from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Vent contraire du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の逆風 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_643|混沌之逆风) from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.wind = 'tail';
      },
    },
    {
      id: 'O9S Cyclone Knockback',
      regex: / 14:318F:Chaos starts using Cyclone/,
      regexDe: / 14:318F:Chaos starts using Tornado/,
      regexFr: / 14:318F:Chaos starts using Tornade/,
      regexJa: / 14:318F:カオス starts using たつまき/,
      regexCn: / 14:318F:卡奥斯 starts using 龙卷风/,
      alarmText: function(data) {
        if (data.wind == 'head') {
          return {
            en: 'Back to Tornado',
            de: 'Rücken zum Tornado',
            fr: 'Regardez vers l\'extérieur',
            cn: '背对龙卷风',
          };
        }
        if (data.wind == 'tail') {
          return {
            en: 'Face the Tornado',
            de: 'Zum Tornado hin',
            fr: 'Regardez la tornade',
            cn: '面对龙卷风',
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
      regex: / 14:3189:Chaos starts using Earthquake/,
      regexDe: / 14:3189:Chaos starts using Erdbeben/,
      regexFr: / 14:3189:Chaos starts using Séisme/,
      regexJa: / 14:3189:カオス starts using じしん/,
      regexCn: / 14:3189:卡奥斯 starts using 地震/,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'earth';
      },
    },
    {
      id: 'O9S Accretion',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Accretion/,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Chaossumpf/,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Bourbier du chaos/,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 混沌の泥土/,
      regexCn: / 1A:\y{ObjectId}:\y{Name} gains the effect of (?:Unknown_644|混沌之泥土)/,
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
          };
        }
        return {
          en: 'Heal Tanks/Healers to full',
          de: 'Tanks/Heiler vollheilen',
          fr: 'Soignez Heals/Tanks full vie',
          ja: 'HP戻して',
          cn: '奶满T奶',
        };
      },
    },
    {
      id: 'O9S Primordial Crust',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Primordial Crust/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaoserde/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Terre du chaos/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の土/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_645|混沌之土)/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.phaseType != 'orb';
      },
      infoText: {
        en: 'Die on next mechanic',
        de: 'An nächster Mechanik tödlichen Schaden nehmen',
        fr: 'Mourrez sur la prochaine mécanique',
        ja: '次のギミックで死んでね',
        cn: '想办法找死',
      },
      run: function(data) {
        data.primordialCrust = true;
      },
    },
    {
      // Primordial Crust Cleanup
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Primordial Crust/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaoserde/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Terre du chaos/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の土/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_645|混沌之土)/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 30,
      run: function(data) {
        delete data.primordialCrust;
      },
    },
    {
      id: 'O9S Earth Stack Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      suppressSeconds: 10,
      infoText: {
        en: 'Stack with partner',
        de: 'Stacks verteilen',
        fr: 'Packez-vous en binôme',
        cn: '与伙伴重合',
      },
    },

    // Orb Phase
    {
      id: 'O9S Orb Phase Tracking',
      regex: / 14:318A:Chaos starts using Bowels Of Agony/,
      regexDe: / 14:318A:Chaos starts using Quälende Eingeweide/,
      regexFr: / 14:318A:Chaos starts using Entrailles De L'Agonie/,
      regexJa: / 14:318A:カオス starts using バウル・オブ・アゴニー/,
      regexCn: / 14:318A:卡奥斯 starts using /,
      preRun: function(data) {
        data.phaseType = 'orb';
      },
    },
    {
      id: 'O9S Orb Entropy',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Entropy from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaosflammen from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Flammes du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の炎 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_640|混沌之炎) from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] != data.me && data.phaseType == 'orb';
      },
      suppressSeconds: 10,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 3;
      },
      alertText: function(data) {
        if (data.head == 'wind') {
          return {
            en: 'Back to DPS',
            de: 'Rücken zum DPS',
            fr: 'Dos au DPS',
            ja: 'DPSの後ろへ',
            cn: '背对DPS',
          };
        }
      },
      run: function(data) {
        delete data.wind;
      },
    },
    {
      id: 'O9S Orb Dynamic Fluid',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Dynamic Fluid from .* for (\y{Float}) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaosspritzer from .* for (\y{Float}) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Eaux du chaos from .* for (\y{Float}) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 混沌の水 from .* for (\y{Float}) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_641|混沌之水) from .* for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phaseType == 'orb';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 5;
      },
      infoText: {
        en: 'Hit DPS with Water',
        de: 'töte deinen DPS',
        fr: 'Tuez les DPS',
        ja: '水当てて',
        cn: '水环害死DPS',
      },
    },

    // Enrage Phase
    {
      id: 'O9S Enrage Phase Tracking',
      regex: / 14:3186:Chaos starts using Blaze/,
      regexDe: / 14:3186:Chaos starts using Flamme/,
      regexFr: / 14:3186:Chaos starts using Flammes/,
      regexJa: / 14:3186:カオス starts using ほのお/,
      regexCn: / 14:3186:卡奥斯 starts using 烈焰/,
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
        'Engage!': 'Start!',
        'dark crystal': 'dunkler Kristall',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Big Bang': 'Quantengravitation',
        'Blaze': 'Flamme',
        'Bowels of Agony': 'Quälende Eingeweide',
        'Chaosphere': 'Chaossphäre',
        'Chaotic Dispersion': 'Chaos-Dispersion',
        'Cyclone': 'Tornado',
        'Damning Edict': 'Verdammendes Edikt',
        'Earthquake': 'Erdbeben',
        'Enrage': 'Finalangriff',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock': 'Einschlag',
        'Knock Down': 'Niederschmettern',
        'Latitudinal Implosion': 'Horizontale Implosion',
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
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',

        // FIXME
        '\\(ALL\\)': '(ALL)',
      },
      '~effectNames': {
        'Accretion': 'Chaossumpf',
        'Dynamic Fluid': 'Chaosspritzer',
        'Entropy': 'Chaosflammen',
        'Headwind': 'Chaosböen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Primordial Crust': 'Chaoserde',
        'Tailwind': 'Chaossturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Sphère De Chaos',
        'Engage!': 'À l\'attaque',
        'Dark crystal': 'Cristal noir',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Big Bang': 'Saillie',
        'Blaze': 'Flammes',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaosphere': 'Sphère de chaos',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Séisme',
        'Enrage': 'Enrage',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock': 'Impact',
        'Knock Down': 'Ordre d\'impact',
        'Latitudinal Implosion': 'Implosion horizontale',
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
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        '\\(ALL\\)': '(Tous)',
      },
      '~effectNames': {
        'Accretion': 'Bourbier du chaos',
        'Dynamic Fluid': 'Eaux du chaos',
        'Entropy': 'Flammes du chaos',
        'Headwind': 'Vent du chaos',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Primordial Crust': 'Terre du chaos',
        'Tailwind': 'Vent contraire du chaos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chaos': 'カオス',
        'Chaosphere': 'カオススフィア',
        'Engage!': '戦闘開始！',
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
        'Knock': '着弾',
        'Knock Down': '着弾せよ',
        'Latitudinal Implosion': 'ホリゾンタルインプロージョン',
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

        // FIXME
        'Long/Lat Implosion': 'Long/Lat Implosion',
        '\\(ALL\\)': '(ALL)',
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
        'Dark Crystal': '黑水晶',
        'Dark crystal': '黑水晶',
        'Engage!': '战斗开始！',
        'dark crystal': '黑水晶',
      },
      'replaceText': {
        'Big Bang': '顶起',
        'Blaze': '烈焰',
        'Bowels of Agony': '深层痛楚',
        'Chaosphere': '混沌晶球',
        'Chaotic Dispersion': '散布混沌',
        'Cyclone': '龙卷风',
        'Damning Edict': '诅咒敕令',
        'Earthquake': '地震',
        'Fiendish Orbs': '追踪',
        'Knock': '中弹',
        'Knock Down': '中弹',
        'Latitudinal Implosion': '纬度聚爆',
        'Longitudinal Implosion': '经度聚爆',
        'Orbshadow': '追踪',
        'Shockwave': '冲击波',
        'Soul of Chaos': '混沌之魂',
        'Stray Flames': '混沌之炎',
        'Stray Spray': '混沌之水',
        'Tsunami': '海啸',
        'Umbra Smash': '本影爆碎',
        'attack': '攻击',
        'Long/Lat Implosion': '经/纬聚爆',
        '\\(ALL\\)': '(所有)',
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
  ],
}];
