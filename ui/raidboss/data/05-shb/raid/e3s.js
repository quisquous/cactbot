'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Inundation \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章3\)$/,
  },
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave/,
      beforeSeconds: 2,
      infoText: {
        en: 'Line Stack',
        de: 'In einer Linie sammeln',
        fr: 'Packé en ligne',
        ja: '直線スタック',
        cn: '直线分摊',
      },
    },
    {
      id: 'E3S Spilling Wave',
      regex: /Spilling Wave/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Tank Cleaves, Move Front',
        de: 'Tank Cleaves, nach vorne bewegen',
        fr: 'Tank cleave, allez devant',
        ja: '拡散くるよ',
        cn: '坦克放陨石，向前集合',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      regex: / 14:3FDC:Leviathan starts using Tidal Roar/,
      regexCn: / 14:3FDC:利维亚桑 starts using 怒潮咆哮/,
      regexDe: / 14:3FDC:Leviathan starts using Schrei der Gezeiten/,
      regexFr: / 14:3FDC:Léviathan starts using Vague Rugissante/,
      regexJa: / 14:3FDC:リヴァイアサン starts using タイダルロア/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
      },
    },
    {
      id: 'E3S Tidal Rage',
      regex: / 14:3FDE:Leviathan starts using Tidal Rage/,
      regexCn: / 14:3FDE:利维亚桑 starts using 怒潮肆虐/,
      regexDe: / 14:3FDE:Leviathan starts using Wütende Flut/,
      regexFr: / 14:3FDE:Léviathan starts using Furie Des Marées/,
      regexJa: / 14:3FDE:リヴァイアサン starts using タイダルレイジ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
      },
    },
    {
      id: 'E3S Tidal Wave Look',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexCn: / 14:3FF1:利维亚桑 starts using 巨浪/,
      regexDe: / 14:3FF1:Leviathan starts using Flutwelle/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      regexJa: / 14:3FF1:リヴァイアサン starts using タイダルウェイブ/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        de: 'Nach Welle ausschau halten',
        fr: 'Repérez la vague',
        ja: 'タイダルウェーブくるよ',
        cn: '看浪',
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexCn: / 14:3FF1:利维亚桑 starts using 巨浪/,
      regexDe: / 14:3FF1:Leviathan starts using Flutwelle/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      regexJa: / 14:3FF1:リヴァイアサン starts using タイダルウェイブ/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      suppressSeconds: 10,
      alarmText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
            ja: 'スイッチ',
            cn: '换T！',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank buster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            fr: 'Tank busters',
            ja: 'タンクバスター',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEF:Leviathan starts using Undersea Quake/,
      regexCn: / 14:3FEF:利维亚桑 starts using 海底地震/,
      regexDe: / 14:3FEF:Leviathan starts using Unterwasserbeben/,
      regexFr: / 14:3FEF:Léviathan starts using Séisme Sous-Marin/,
      regexJa: / 14:3FEF:リヴァイアサン starts using アンダーシークエイク/,
      alertText: {
        en: 'Get Middle',
        de: 'Geh in die Mitte',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
        cn: '中间',
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEE:Leviathan starts using Undersea Quake/,
      regexCn: / 14:3FEE:利维亚桑 starts using 海底地震/,
      regexDe: / 14:3FEE:Leviathan starts using Unterwasserbeben/,
      regexFr: / 14:3FEE:Léviathan starts using Séisme Sous-Marin/,
      regexJa: / 14:3FEE:リヴァイアサン starts using アンダーシークエイク/,
      alarmText: {
        en: 'Go Outside',
        de: 'Geh nach Ausen',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
        cn: '两侧',
      },
    },
    {
      id: 'E3S Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      regexCn: / 14:3FE2:利维亚桑 starts using 猛烈波动/,
      regexDe: / 14:3FE2:Leviathan starts using Tosende Wogen/,
      regexFr: / 14:3FE2:Léviathan starts using Pulsation Sauvage/,
      regexJa: / 14:3FE2:リヴァイアサン starts using 猛烈なる波動/,
      infoText: {
        en: 'Stack, Bait Puddles',
        de: 'Sammeln, Flächen ködern',
        fr: 'Packé, évitez zone au sol',
        ja: '集合',
        cn: '集合',
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      regexCn: / 14:3FE2:利维亚桑 starts using 猛烈波动/,
      regexDe: / 14:3FE2:Leviathan starts using Tosende Wogen/,
      regexFr: / 14:3FE2:Léviathan starts using Pulsation Sauvage/,
      regexJa: / 14:3FE2:リヴァイアサン starts using 猛烈なる波動/,
      delaySeconds: 2.9,
      infoText: {
        en: 'Drop Puddles Outside',
        de: 'Flächen drausen ablegen',
        fr: 'Placez les flaques à l\'extérieur',
        ja: '散開',
        cn: '散开',
      },
    },
    {
      id: 'E3S Roiling Pulse',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      regexCn: / 14:3FE4:利维亚桑 starts using 剧烈波动/,
      regexDe: / 14:3FE4:Leviathan starts using Wüstende Wogen/,
      regexFr: / 14:3FE4:Léviathan starts using Pulsation Ravageuse/,
      regexJa: / 14:3FE4:リヴァイアサン starts using 苛烈なる波動/,
      infoText: {
        en: 'Stack, Bait Puddles',
        de: 'Sammeln, Flächen ködern',
        fr: 'Packé, évitez zone au sol',
        ja: '集合',
        cn: '集合',
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      regexCn: / 14:3FE4:利维亚桑 starts using 剧烈波动/,
      regexDe: / 14:3FE4:Leviathan starts using Wüstende Wogen/,
      regexFr: / 14:3FE4:Léviathan starts using Pulsation Ravageuse/,
      regexJa: / 14:3FE4:リヴァイアサン starts using 苛烈なる波動/,
      delaySeconds: 2.9,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Flare To Outside Corner',
            de: 'Flare in die äuseren Ecken',
            fr: 'Brasier dans un coin extérieur',
            ja: '隅にフレア',
            cn: '外侧角落放核爆',
          };
        }
        return {
          en: 'Stack Outside, Avoid Flares',
          de: 'Auserhalb sammeln, Flares vermeiden',
          fr: 'Packé à l\'extérieur, évitez les brasiers',
          ja: '前で集合',
          cn: '外侧集合躲避核爆',
        };
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: / 14:3FFE:Leviathan starts using Stormy Horizon/,
      regexCn: / 14:3FFE:利维亚桑 starts using 大暴风雨/,
      regexDe: / 14:3FFE:Leviathan starts using Stürmische See/,
      regexFr: / 14:3FFE:Léviathan starts using Mer Déchaînée/,
      regexJa: / 14:3FFE:リヴァイアサン starts using 大時化/,
      infoText: {
        en: 'Panto Puddles x5',
        de: 'Panto Flächen x5',
        fr: 'Panto x5',
        ja: 'パント5回',
        cn: '处理水圈 x5',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexCn: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:利维亚桑:....:....:005A:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Léviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Tether on YOU',
        de: 'Black Smoker Verbindung auf DIR',
        fr: 'Lien sur VOUS',
        ja: '線ついた',
        cn: '水圈连线',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexCn: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:利维亚桑:....:....:005A:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Léviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      run: function(data, matches) {
        data.vent = data.vent || [];
        data.vent.push(matches[1]);
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Leviathan:....:....:005A:/,
      regexCn: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:利维亚桑:....:....:005A:/,
      regexDe: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Leviathan:....:....:005A:/,
      regexFr: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Léviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      condition: function(data) {
        return data.vent.length == 2 && data.vent.indexOf(data.me) == -1 && data.role != 'tank';
      },
      infoText: {
        en: 'Pop alternating bubbles',
        de: 'Flächen abwechselnd nehmen',
        fr: 'Absorbez les bulles en alternance',
        ja: '水出た',
        cn: '交替踩圈',
      },
    },
    {
      id: 'E3S Surging Waters',
      regex: Regexes.gainsEffect({ effect: 'Surging Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Erdrückung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Écrasantes' }),
      regexJa: Regexes.gainsEffect({ effect: '強圧の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '强压之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Initial knockback on YOU',
        de: 'Initialer Knockback auf DIR',
        fr: 'Pousée initiale sur VOUS',
        ja: '最初のノックバック',
        cn: '初始击退点名',
      },
    },
    {
      // TODO probably need to call out knockbacks later
      // TODO maybe tell other people about stacking for knockbacks
      id: 'E3S Sundering Waters',
      regex: Regexes.gainsEffect({ effect: 'Sundering Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Zerstörung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Fracturantes' }),
      regexJa: Regexes.gainsEffect({ effect: '断絶の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '断绝之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: function(data, matches) {
        let seconds = matches.duration;
        if (seconds <= 8) {
          return {
            en: 'Knockback on YOU',
            de: 'Knockback auf Dir',
            fr: 'Pousée sur VOUS',
            ja: '自分にノックバック',
            cn: '击退点名',
          };
        }
      },
      infoText: function(data, matches) {
        let seconds = matches.duration;
        if (seconds <= 8)
          return;
        if (seconds <= 21) {
          return {
            en: 'Late First Knockback',
            de: 'Erster reinigender Knockback',
            fr: 'Poussée tardive 1',
            ja: '遅ノックバック1',
            cn: '迟击退点名 #1',
          };
        }
        return {
          en: 'Late Second Knockback',
          de: 'Zweiter reinigender Knockback',
          fr: 'Poussée tardive 2',
          ja: '遅ノックバック2',
          cn: '迟击退点名 #2',
        };
      },
    },
    {
      // 29 seconds
      id: 'E3S Scouring Waters',
      regex: Regexes.gainsEffect({ effect: 'Scouring Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Böen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Dévastatrices' }),
      regexJa: Regexes.gainsEffect({ effect: '暴風の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '暴风之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Defamation',
        de: 'Defamation',
        fr: 'Médisance',
        ja: '暴風',
        cn: '暴风',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: Regexes.gainsEffect({ effect: 'Scouring Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Böen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Dévastatrices' }),
      regexJa: Regexes.gainsEffect({ effect: '暴風の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '暴风之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 22,
      infoText: {
        en: 'Avoid Knockback, Move to Back',
        de: 'Vermeide Knockback, dann nach hinten bewegen',
        fr: 'Evitez la pousée, allez à l\'arrière',
        ja: '後ろへ',
        cn: '后方放大圈',
      },
    },
    {
      id: 'E3S Smothering Waters',
      regex: Regexes.gainsEffect({ effect: 'Smothering Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Ertränkung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Submergeantes' }),
      regexJa: Regexes.gainsEffect({ effect: '溺没の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '溺没之兆' }),
      condition: function(data, matches) {
        // first tsunami stack is 25 seconds
        // second tsunami stack is 13 seconds
        // Everybody is in first stack, but tanks not in the second.
        return parseFloat(matches.duration) > 15 || data.role != 'tank';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Packé',
        ja: 'スタック',
        cn: '集合',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: Regexes.gainsEffect({ effect: 'Scouring Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Böen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Dévastatrices' }),
      regexJa: Regexes.gainsEffect({ effect: '暴風の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '暴风之兆' }),
      condition: function(data, matches) {
        return data.me != matches.target;
      },
      delaySeconds: 25,
      infoText: {
        en: 'Move In, Avoid Defamation',
        de: 'Rein gehen, vermeide Defamation',
        fr: 'Sous le boss, évitez la médisance',
        ja: '前にノックバック',
        cn: '靠近躲避',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: Regexes.gainsEffect({ effect: 'Sweeping Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Auflösung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Pulvérisantes' }),
      regexJa: Regexes.gainsEffect({ effect: '拡散の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '扩散之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Tank Cone',
        de: 'Tank Kegel',
        fr: 'Cône tank',
        ja: '断絶',
        cn: '坦克三角',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: Regexes.gainsEffect({ effect: 'Sweeping Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Auflösung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Pulvérisantes' }),
      regexJa: Regexes.gainsEffect({ effect: '拡散の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '扩散之兆' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'tank';
      },
      delaySeconds: 13,
      suppressSeconds: 1,
      infoText: {
        en: 'Tank Cone',
        de: 'Tank Kegel',
        fr: 'Cône tank',
        ja: '断絶',
        cn: '坦克三角',
      },
    },
    {
      id: 'E3S Refreshed',
      regex: / 14:400F:Leviathan starts using Refreshing Shower/,
      regexCn: / 14:400F:利维亚桑 starts using 水之觉醒/,
      regexDe: / 14:400F:Leviathan starts using Erwachen der Tiefen/,
      regexFr: / 14:400F:Léviathan starts using Éveil De L'[eE]au/,
      regexJa: / 14:400F:リヴァイアサン starts using 水の覚醒/,
      run: function(data) {
        data.refreshed = true;
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      regexCn: / 14:3FEB:利维亚桑 starts using 临时洋流/,
      regexDe: / 14:3FEB:Leviathan starts using Unstete Gezeiten/,
      regexFr: / 14:3FEB:Léviathan starts using Courant Évanescent/,
      regexJa: / 14:3FEB:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'Front left / Back right',
        de: 'Vorne Links / Hinten Rechts',
        fr: 'Avant gauche / Arrière droite',
        ja: '左前 / 右後ろ',
        cn: '前左 / 后右',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      regexCn: / 14:3FEA:利维亚桑 starts using 临时洋流/,
      regexDe: / 14:3FEA:Leviathan starts using Unstete Gezeiten/,
      regexFr: / 14:3FEA:Léviathan starts using Courant Évanescent/,
      regexJa: / 14:3FEA:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'Front right / Back left',
        de: 'Vorne Rechts / Hinten Links',
        fr: 'Avant droit / Arrière gauche',
        ja: '右前 / 左後ろ',
        cn: '前右 / 后左',
      },
    },
    {
      // Note: there are different abilities for the followup
      // temporary current, but there's only a 1 second cast time.
      // The original has a 6 second cast time and 4 seconds before
      // the next one.
      id: 'E3S Front Left Temporary Current 2',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      regexCn: / 14:3FEA:利维亚桑 starts using 临时洋流/,
      regexDe: / 14:3FEA:Leviathan starts using Unstete Gezeiten/,
      regexFr: / 14:3FEA:Léviathan starts using Courant Évanescent/,
      regexJa: / 14:3FEA:リヴァイアサン starts using テンポラリーカレント/,
      condition: function(data) {
        return data.refreshed;
      },
      delaySeconds: 6.2,
      alertText: {
        en: 'Front left / Back right',
        de: 'Vorne Links / Hinten Rechts',
        fr: 'Avant gauche / Arrière droite',
        ja: '左前 / 右後ろ',
        cn: '前左 / 后右',
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      regexCn: / 14:3FEB:利维亚桑 starts using 临时洋流/,
      regexDe: / 14:3FEB:Leviathan starts using Unstete Gezeiten/,
      regexFr: / 14:3FEB:Léviathan starts using Courant Évanescent/,
      regexJa: / 14:3FEB:リヴァイアサン starts using テンポラリーカレント/,
      condition: function(data) {
        return data.refreshed;
      },
      delaySeconds: 6.2,
      alertText: {
        en: 'Front right / Back left',
        de: 'Vorne Rechts / Hinten Links',
        fr: 'Avant droit / Arrière gauche',
        ja: '右前 / 左後ろ',
        cn: '前右 / 后左',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Leviathan': 'Leviathan',
        'Engage!': 'Start!',
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'Unterwasserbeben',
        'Tsunami': 'Sturzflut',
        'Tidal Wave': 'Flutwelle',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Rage': 'Wütende Flut',
        'The Storm': 'Durch den Mahlstrom',
        'The Calm': 'Versenkende Flut',
        'Temporary Current': 'Unstete Gezeiten',
        'Swirling Tsunami': 'Wirbelnde Sturzflut',
        'Sweeping Tsunami': 'Auflösende Sturzflut',
        'Surging Tsunami': 'Erdrückende Sturzflut',
        'Sundering Tsunami': 'Zerstörende Sturzflut',
        'Stormy Horizon': 'Stürmische See',
        'Spinning Dive': 'Drehsprung',
        'Spilling Wave': 'Schäumende Welle',
        'Smothering Tsunami': 'Ertränkende Sturzflut',
        'Scouring Tsunami': 'Böige Sturzflut',
        'Roiling Pulse': 'Wüstende Wogen',
        'Rip Current': 'Brandungsrückstrom',
        'Refreshing Shower': 'Erwachen der Tiefen',
        'Plunging Wave': 'Donnernde Welle',
        'Monster Wave': 'Monsterwelle',
        'Maelstrom': 'Mahlstrom',
        'Killer Wave': 'Tödliche Welle',
        'Hydrothermal Vent': 'Hydrothermale Quelle',
        'Hot Water': 'Heißes Wasser',
        'Freak Wave': 'Gigantische Welle',
        'Enrage': 'Finalangriff',
        'Drenching Pulse': 'Tosende Wogen',
        'Breaking Wave': 'Schmetternde Welle',
        'Black Smokers': 'Schwarzer Raucher',
        'Backbreaking Wave': 'Verwüstende Welle',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
      },
      '~effectNames': {
        'Swirling Waters': 'Omen des Wasserwirbels',
        'Sweeping Waters': 'Omen der Auflösung',
        'Surging Waters': 'Omen der Erdrückung',
        'Sundering Waters': 'Omen der Zerstörung',
        'Splashing Waters': 'Omen des Sturms',
        'Smothering Waters': 'Omen der Ertränkung',
        'Scouring Waters': 'Omen der Böen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Heavy': 'Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Leviathan': 'Léviathan',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'Séisme sous-marin',
        'Tsunami': 'Tsunami',
        'Tidal Wave': 'Raz-de-marée',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Rage': 'Furie des marées',
        'The Storm': 'Spirale du chaos',
        'The Calm': 'Onde naufrageuse',
        'Temporary Current': 'Courant évanescent',
        'Swirling Tsunami': 'Tsunami tournoyant',
        'Sweeping Tsunami': 'Tsunami pulvérisant',
        'Surging Tsunami': 'Tsunami écrasant',
        'Sundering Tsunami': 'Tsunami fracturant',
        'Stormy Horizon': 'Mer déchaînée',
        'Spinning Dive': 'Piqué tournant',
        'Spilling Wave': 'Vague déversante',
        'Smothering Tsunami': 'Tsunami submergeant',
        'Scouring Tsunami': 'Tsunami dévastateur',
        'Roiling Pulse': 'Pulsation ravageuse',
        'Rip Current': 'Courant d\'arrachement',
        'Refreshing Shower': 'Éveil de l\'eau',
        'Plunging Wave': 'Vague plongeante',
        'Monster Wave': 'Vague monstrueuse',
        'Maelstrom': 'Maelström',
        'Killer Wave': 'Vague meurtrière',
        'Hydrothermal Vent': 'Cheminées hydrothermales',
        'Hot Water': 'Eau bouillante',
        'Freak Wave': 'Vague gigantesque',
        'Enrage': 'Enrage',
        'Drenching Pulse': 'Pulsation sauvage',
        'Breaking Wave': 'Vague brisante',
        'Black Smokers': 'Fumeurs noirs',
        'Backbreaking Wave': 'Vague dévastatrice',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Swirling Waters': 'Eaux tournoyantes',
        'Sweeping Waters': 'Eaux pulvérisantes',
        'Surging Waters': 'Eaux écrasantes',
        'Sundering Waters': 'Eaux fracturantes',
        'Splashing Waters': 'Eaux déferlantes',
        'Smothering Waters': 'Eaux submergeantes',
        'Scouring Waters': 'Eaux dévastatrices',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Heavy': 'Pesanteur',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Leviathan': 'リヴァイアサン',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'アンダーシークエイク',
        'Tsunami': '大海嘯',
        'Tidal Wave': 'タイダルウェイブ',
        'Tidal Roar': 'タイダルロア',
        'Tidal Rage': 'タイダルレイジ',
        'The Storm': '混沌の渦動',
        'The Calm': '沈溺の波動',
        'Temporary Current': 'テンポラリーカレント',
        'Swirling Tsunami': '渦動の大海嘯',
        'Sweeping Tsunami': '拡散の大海嘯',
        'Surging Tsunami': '強圧の大海嘯',
        'Sundering Tsunami': '断絶の大海嘯',
        'Stormy Horizon': '大時化',
        'Spinning Dive': 'スピニングダイブ',
        'Spilling Wave': 'スピリングウェイブ',
        'Smothering Tsunami': '溺没の大海嘯',
        'Scouring Tsunami': '暴風の大海嘯',
        'Roiling Pulse': '苛烈なる波動',
        'Rip Current': 'リップカレント',
        'Refreshing Shower': '水の覚醒',
        'Plunging Wave': 'プランジングウェイブ',
        'Monster Wave': 'モンスターウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Killer Wave': 'キラーウェイブ',
        'Hydrothermal Vent': 'ハイドロサーマルベント',
        'Hot Water': '熱水',
        'Freak Wave': 'フリークウェイブ',
        'Drenching Pulse': '猛烈なる波動',
        'Breaking Wave': 'ブレーキングウェイブ',
        'Black Smokers': 'ブラックスモーカー',
        'Backbreaking Wave': 'バックブレーキングウェイブ',
      },
      '~effectNames': {
        'Swirling Waters': '渦動の兆し',
        'Sweeping Waters': '拡散の兆し',
        'Surging Waters': '強圧の兆し',
        'Sundering Waters': '断絶の兆し',
        'Splashing Waters': '強風の兆し',
        'Smothering Waters': '溺没の兆し',
        'Scouring Waters': '暴風の兆し',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Heavy': 'ヘヴィ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Leviathan': '利维亚桑',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'Undersea Quake': '海底地震',
        'Tidal Wave': '巨浪',
        'Tidal Roar': '怒潮咆哮',
        'Tidal Rage': '怒潮肆虐',
        'The Storm': '雷切',
        'The Calm': '沉溺波动',
        'Temporary Current': '临时洋流',
        'Swirling Tsunami': '涡动大海啸',
        'Sweeping Tsunami': '扩散大海啸',
        'Surging Tsunami': '强压大海啸',
        'Sundering Tsunami': '断绝大海啸',
        'Stormy Horizon': '大暴风雨',
        'Spinning Dive': '旋转下潜',
        'Spilling Wave': '崩碎波',
        'Smothering Tsunami': '溺没大海啸',
        'Scouring Tsunami': '暴风大海啸',
        'Tsunami': '大海啸',
        'Roiling Pulse': '剧烈波动',
        'Rip Current': '裂流',
        'Refreshing Shower': '水之觉醒',
        'Plunging Wave': '卷跃波',
        'Monster Wave': '疯狗浪',
        'Maelstrom': '漩涡',
        'Killer Wave': '杀人浪',
        'Hydrothermal Vent': '海底热泉',
        'Hot Water': '热水',
        'Freak Wave': '畸形波',
        'Drenching Pulse': '猛烈波动',
        'Breaking Wave': '破碎波',
        'Black Smokers': '黑色烟柱',
        'Backbreaking Wave': '返破碎波',
        '--targetable--': '--可选中--',
        '--untargetable--': '--无法选中--',
      },
      '~effectNames': {
        'Swirling Waters': '涡动之兆',
        'Sweeping Waters': '扩散之兆',
        'Surging Waters': '强压之兆',
        'Sundering Waters': '断绝之兆',
        'Splashing Waters': '强风之兆',
        'Smothering Waters': '溺没之兆',
        'Scouring Waters': '暴风之兆',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Heavy': '加重',
      },
    },
  ],
}];
