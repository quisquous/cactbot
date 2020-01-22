'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Inundation \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章3\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(3\)$/,
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
        ko: '쉐어징 모이기',
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
        ko: '탱버, 앞으로 이동',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      regex: Regexes.startsUsing({ id: '3FDC', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FDC', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FDC', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FDC', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FDC', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FDC', source: '리바이어선', capture: false }),
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
      id: 'E3S Tidal Rage',
      regex: Regexes.startsUsing({ id: '3FDE', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FDE', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FDE', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FDE', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FDE', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FDE', source: '리바이어선', capture: false }),
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
      id: 'E3S Tidal Wave Look',
      regex: Regexes.startsUsing({ id: '3FF1', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FF1', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FF1', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FF1', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FF1', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FF1', source: '리바이어선', capture: false }),
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        de: 'Nach Welle ausschau halten',
        fr: 'Repérez la vague',
        ja: 'タイダルウェーブくるよ',
        cn: '看浪',
        ko: '해일 위치 확인',
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      regex: Regexes.startsUsing({ id: '3FF1', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FF1', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FF1', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FF1', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FF1', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FF1', source: '리바이어선', capture: false }),
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: Regexes.headMarker({ id: '0017' }),
      suppressSeconds: 10,
      alarmText: function(data, matches) {
        if (matches.target != data.me && data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
            ja: 'スイッチ',
            cn: '换T！',
            ko: '탱 교대!',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank buster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            fr: 'Tank busters',
            ja: 'タンクバスター',
            cn: '死刑',
            ko: '탱버',
          };
        }
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: Regexes.startsUsing({ id: '3FEF', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEF', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEF', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEF', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEF', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEF', source: '리바이어선', capture: false }),
      alertText: {
        en: 'Get Middle',
        de: 'Geh in die Mitte',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
        cn: '中间',
        ko: '가운데로',
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: Regexes.startsUsing({ id: '3FEE', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEE', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEE', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEE', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEE', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEE', source: '리바이어선', capture: false }),
      alarmText: {
        en: 'Go Outside',
        de: 'Geh nach Ausen',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
        cn: '两侧',
        ko: '양옆으로',
      },
    },
    {
      id: 'E3S Flare',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
        ko: '플레어 대상자',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: Regexes.startsUsing({ id: '3FE2', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FE2', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FE2', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FE2', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FE2', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FE2', source: '리바이어선', capture: false }),
      infoText: {
        en: 'Stack, Bait Puddles',
        de: 'Sammeln, Flächen ködern',
        fr: 'Packé, évitez zone au sol',
        ja: '集合',
        cn: '集合',
        ko: '모이기',
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      regex: Regexes.startsUsing({ id: '3FE2', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FE2', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FE2', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FE2', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FE2', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FE2', source: '리바이어선', capture: false }),
      delaySeconds: 2.9,
      infoText: {
        en: 'Drop Puddles Outside',
        de: 'Flächen drausen ablegen',
        fr: 'Placez les flaques à l\'extérieur',
        ja: '散開',
        cn: '散开',
        ko: '산개',
      },
    },
    {
      id: 'E3S Roiling Pulse',
      regex: Regexes.startsUsing({ id: '3FE4', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FE4', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FE4', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FE4', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FE4', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FE4', source: '리바이어선', capture: false }),
      infoText: {
        en: 'Stack, Bait Puddles',
        de: 'Sammeln, Flächen ködern',
        fr: 'Packé, évitez zone au sol',
        ja: '集合',
        cn: '集合',
        ko: '모이기',
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      regex: Regexes.startsUsing({ id: '3FE4', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FE4', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FE4', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FE4', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FE4', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FE4', source: '리바이어선', capture: false }),
      delaySeconds: 2.9,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Flare To Outside Corner',
            de: 'Flare in die äuseren Ecken',
            fr: 'Brasier dans un coin extérieur',
            ja: '隅にフレア',
            cn: '外侧角落放核爆',
            ko: '플레어 양옆 뒤로 유도',
          };
        }
        return {
          en: 'Stack Outside, Avoid Flares',
          de: 'Auserhalb sammeln, Flares vermeiden',
          fr: 'Packé à l\'extérieur, évitez les brasiers',
          ja: '前で集合',
          cn: '外侧集合躲避核爆',
          ko: '양옆 앞으로 모이고, 플레어 피하기',
        };
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: Regexes.startsUsing({ id: '3FFE', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FFE', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FFE', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FFE', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FFE', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FFE', source: '리바이어선', capture: false }),
      infoText: {
        en: 'Panto Puddles x5',
        de: 'Panto Flächen x5',
        fr: 'Panto x5',
        ja: 'パント5回',
        cn: '处理水圈 x5',
        ko: '발밑장판 5회',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      regex: Regexes.tether({ id: '005A', target: 'Leviathan' }),
      regexDe: Regexes.tether({ id: '005A', target: 'Leviathan' }),
      regexFr: Regexes.tether({ id: '005A', target: 'Léviathan' }),
      regexJa: Regexes.tether({ id: '005A', target: 'リヴァイアサン' }),
      regexCn: Regexes.tether({ id: '005A', target: '利维亚桑' }),
      regexKo: Regexes.tether({ id: '005A', target: '리바이어선' }),
      condition: function(data, matches) {
        return data.me == matches.source;
      },
      alertText: {
        en: 'Puddle Tether on YOU',
        de: 'Black Smoker Verbindung auf DIR',
        fr: 'Lien sur VOUS',
        ja: '線ついた',
        cn: '水圈连线',
        ko: '선 대상자',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: Regexes.tether({ id: '005A', target: 'Leviathan' }),
      regexDe: Regexes.tether({ id: '005A', target: 'Leviathan' }),
      regexFr: Regexes.tether({ id: '005A', target: 'Léviathan' }),
      regexJa: Regexes.tether({ id: '005A', target: 'リヴァイアサン' }),
      regexCn: Regexes.tether({ id: '005A', target: '利维亚桑' }),
      regexKo: Regexes.tether({ id: '005A', target: '리바이어선' }),
      run: function(data, matches) {
        data.vent = data.vent || [];
        data.vent.push(matches.source);
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: Regexes.tether({ id: '005A', target: 'Leviathan', capture: false }),
      regexDe: Regexes.tether({ id: '005A', target: 'Leviathan', capture: false }),
      regexFr: Regexes.tether({ id: '005A', target: 'Léviathan', capture: false }),
      regexJa: Regexes.tether({ id: '005A', target: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.tether({ id: '005A', target: '利维亚桑', capture: false }),
      regexKo: Regexes.tether({ id: '005A', target: '리바이어선', capture: false }),
      condition: function(data) {
        return data.vent.length == 2 && data.vent.indexOf(data.me) == -1 && data.role != 'tank';
      },
      infoText: {
        en: 'Pop alternating bubbles',
        de: 'Flächen abwechselnd nehmen',
        fr: 'Absorbez les bulles en alternance',
        ja: '水出た',
        cn: '交替踩圈',
        ko: '물장판 밟기',
      },
    },
    {
      id: 'E3S Surging Waters',
      regex: Regexes.gainsEffect({ effect: 'Surging Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Erdrückung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Écrasantes' }),
      regexJa: Regexes.gainsEffect({ effect: '強圧の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '强压之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '강압의 징조' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Initial knockback on YOU',
        de: 'Initialer Knockback auf DIR',
        fr: 'Pousée initiale sur VOUS',
        ja: '最初のノックバック',
        cn: '初始击退点名',
        ko: '첫 넉백 대상자',
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
      regexKo: Regexes.gainsEffect({ effect: '단절의 징조' }),
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
            ko: '넉백 대상자',
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
            ko: '늦은 넉백 대상자 1',
          };
        }
        return {
          en: 'Late Second Knockback',
          de: 'Zweiter reinigender Knockback',
          fr: 'Poussée tardive 2',
          ja: '遅ノックバック2',
          cn: '迟击退点名 #2',
          ko: '늦은 넉백 대상자 2',
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
      regexKo: Regexes.gainsEffect({ effect: '폭풍의 징조' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Defamation',
        de: 'Defamation',
        fr: 'Médisance',
        ja: '暴風',
        cn: '暴风',
        ko: '폭풍 대상자',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: Regexes.gainsEffect({ effect: 'Scouring Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Böen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Dévastatrices' }),
      regexJa: Regexes.gainsEffect({ effect: '暴風の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '暴风之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '폭풍의 징조' }),
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
        ko: '넉백 피해서 뒤로 이동',
      },
    },
    {
      id: 'E3S Smothering Waters',
      regex: Regexes.gainsEffect({ effect: 'Smothering Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Ertränkung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Submergeantes' }),
      regexJa: Regexes.gainsEffect({ effect: '溺没の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '溺没之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '익몰의 징조' }),
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
        ko: '모이기',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: Regexes.gainsEffect({ effect: 'Scouring Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Böen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Dévastatrices' }),
      regexJa: Regexes.gainsEffect({ effect: '暴風の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '暴风之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '폭풍의 징조' }),
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
        ko: '안으로 이동, 폭풍 피하기',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: Regexes.gainsEffect({ effect: 'Sweeping Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Auflösung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Pulvérisantes' }),
      regexJa: Regexes.gainsEffect({ effect: '拡散の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '扩散之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '확산의 징조' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Tank Cone',
        de: 'Tank Kegel',
        fr: 'Cône tank',
        ja: '断絶',
        cn: '坦克三角',
        ko: '확산의 징조 대상자',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: Regexes.gainsEffect({ effect: 'Sweeping Waters' }),
      regexDe: Regexes.gainsEffect({ effect: 'Omen Der Auflösung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Eaux Pulvérisantes' }),
      regexJa: Regexes.gainsEffect({ effect: '拡散の兆し' }),
      regexCn: Regexes.gainsEffect({ effect: '扩散之兆' }),
      regexKo: Regexes.gainsEffect({ effect: '확산의 징조' }),
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
        ko: '확산: 탱 멀리 / 대상자 앞으로',
      },
    },
    {
      id: 'E3S Refreshed',
      regex: Regexes.startsUsing({ id: '400F', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '400F', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '400F', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '400F', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '400F', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '400F', source: '리바이어선', capture: false }),
      run: function(data) {
        data.refreshed = true;
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: Regexes.startsUsing({ id: '3FEB', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEB', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEB', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEB', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEB', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEB', source: '리바이어선', capture: false }),
      infoText: {
        en: 'Front left / Back right',
        de: 'Vorne Links / Hinten Rechts',
        fr: 'Avant gauche / Arrière droite',
        ja: '左前 / 右後ろ',
        cn: '前左 / 后右',
        ko: '↖왼쪽 / 오른쪽↘',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: Regexes.startsUsing({ id: '3FEA', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEA', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEA', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEA', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEA', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEA', source: '리바이어선', capture: false }),
      infoText: {
        en: 'Front right / Back left',
        de: 'Vorne Rechts / Hinten Links',
        fr: 'Avant droit / Arrière gauche',
        ja: '右前 / 左後ろ',
        cn: '前右 / 后左',
        ko: '↗오른쪽 / 왼쪽↙',
      },
    },
    {
      // Note: there are different abilities for the followup
      // temporary current, but there's only a 1 second cast time.
      // The original has a 6 second cast time and 4 seconds before
      // the next one.
      id: 'E3S Front Left Temporary Current 2',
      regex: Regexes.startsUsing({ id: '3FEA', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEA', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEA', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEA', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEA', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEA', source: '리바이어선', capture: false }),
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
        ko: '↖왼쪽 / 오른쪽↘',
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      regex: Regexes.startsUsing({ id: '3FEB', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FEB', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FEB', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FEB', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FEB', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FEB', source: '리바이어선', capture: false }),
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
        ko: '↗오른쪽 / 왼쪽↙',
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
    {
      'locale': 'ko',
      'replaceSync': {
        'Leviathan': '리바이어선',
        'Engage!': '전투 시작!',
      },
      'replaceText': {
        'Undersea Quake': '해저 지진',
        'Tidal Wave': '해일',
        'Tidal Roar': '바다의 포효',
        'Tidal Rage': '바다의 분노',
        'The Storm': '전멸기 / 혼돈의 파동',
        'The Calm': '익몰의 파동',
        'Temporary Current': '순간 해류',
        'Swirling Tsunami': '와동의 대해일',
        'Sweeping Tsunami': '확산의 대해일',
        'Surging Tsunami': '강압의 대해일',
        'Sundering Tsunami': '단절의 대해일',
        'Stormy Horizon': '풍랑',
        'Spinning Dive': '고속 돌진',
        'Spilling Wave': '붕괴파',
        'Smothering Tsunami': '익몰의 대해일',
        'Scouring Tsunami': '폭풍의 대해일',
        'Tsunami': '대해일',
        'Roiling Pulse': '가열찬 파동',
        'Rip Current': '이안류',
        'Refreshing Shower': '물의 각성',
        'Plunging Wave': '저돌적인 물결',
        'Monster Wave': '마물의 물결',
        'Maelstrom': '대격동',
        'Killer Wave': '치명적인 물결',
        'Hydrothermal Vent': '열수 분출구',
        'Hot Water': '열수',
        'Freak Wave': '기괴한 물결',
        'Enrage': '전멸기',
        'Drenching Pulse': '맹렬한 파동',
        'Backbreaking Wave': '험난한 물결',
        'Breaking Wave': '파괴의 물결',
        'Black Smokers': '해저 간헐천',
        '--untargetable--': '--타겟불가능--',
        '--targetable--': '--타겟가능--',
      },
      '~effectNames': {
        'Swirling Waters': '소용돌이의 징조',
        'Sweeping Waters': '확산의 징조',
        'Surging Waters': '강압의 징조',
        'Sundering Waters': '단절의 징조',
        'Splashing Waters': '강풍의 징조',
        'Smothering Waters': '익몰의 징조',
        'Scouring Waters': '폭풍의 징조',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Heavy': '과중력',
      },
    },
  ],
}];
