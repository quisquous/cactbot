'use strict';

// TODO
// better callouts for cycle
// tank provoke messages when cotank has flare

[{
  zoneRegex: /^(Eden's Gate: Descent \(Savage\)|伊甸零式希望乐园 \(觉醒之章2\))$/,
  timelineFile: 'e2s.txt',
  timelineTriggers: [
    {
      id: 'E2S Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 9,
      infoText: {
        en: 'Get Puddles',
        de: 'Flächen nehmen',
        fr: 'Prenez les rayons',
        ja: '踏む',
        cn: '踩圈',
      },
    },
    {
      id: 'E2S Buddy Circles',
      regex: /Light\/Dark Circles/,
      beforeSeconds: 5,
      alarmText: {
        en: 'Stack With Partner',
        de: 'Mit Partner stacken',
        fr: 'Packez-vous avec votre partenaire',
        ja: '白黒合わせて',
        cn: '黑白配',
      },
    },
  ],
  triggers: [
    {
      id: 'E2S Spell In Waiting Gain',
      regex: Regexes.gainsEffect({ effect: 'Spell-In-Waiting', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Verzögerung', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Déphasage Incantatoire', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: 'ディレイスペル', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '延迟咏唱', capture: false }),
      run: function(data) {
        data.waiting = true;
      },
    },
    {
      id: 'E2S Spell In Waiting Lose',
      regex: / 1E:\y{ObjectId}:Voidwalker loses the effect of Spell-In-Waiting/,
      regexCn: / 1E:\y{ObjectId}:虚无行者 loses the effect of 延迟咏唱/,
      regexDe: / 1E:\y{ObjectId}:Nichtswandler loses the effect of Verzögerung/,
      regexFr: / 1E:\y{ObjectId}:Marcheuse Du Néant loses the effect of Déphasage Incantatoire/,
      regexJa: / 1E:\y{ObjectId}:ヴォイドウォーカー loses the effect of ディレイスペル/,
      run: function(data) {
        data.waiting = false;
      },
    },
    {
      id: 'E2S Entropy',
      regex: / 14:3E6F:Voidwalker starts using Entropy/,
      regexCn: / 14:3E6F:虚无行者 starts using 熵/,
      regexDe: / 14:3E6F:Nichtswandler starts using Entropie/,
      regexFr: / 14:3E6F:Marcheuse Du Néant starts using Entropie/,
      regexJa: / 14:3E6F:ヴォイドウォーカー starts using エントロピー/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
        cn: 'AOE',
      },
    },
    {
      id: 'E2S Quietus',
      regex: / 14:3E71:Voidwalker starts using Quietus/,
      regexCn: / 14:3E71:虚无行者 starts using 寂灭/,
      regexDe: / 14:3E71:Nichtswandler starts using Quietus/,
      regexFr: / 14:3E71:Marcheuse Du Néant starts using Quietus/,
      regexJa: / 14:3E71:ヴォイドウォーカー starts using クワイタス/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
        cn: 'AOE',
      },
    },
    {
      id: 'E2S Shadowflame Tank',
      regex: / 14:3E6[12]:Voidwalker starts using Shadowflame on (\y{Name})/,
      regexCn: / 14:3E6[12]:虚无行者 starts using 暗影炎 on (\y{Name})/,
      regexDe: / 14:3E6[12]:Nichtswandler starts using Schattenflamme on (\y{Name})/,
      regexFr: / 14:3E6[12]:Marcheuse Du Néant starts using Flamme D'[oO]mbre on (\y{Name})/,
      regexJa: / 14:3E6[12]:ヴォイドウォーカー starts using シャドーフレイム on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
      },
    },
    {
      id: 'E2S Shadowflame Healer',
      regex: / 14:3E61:Voidwalker starts using Shadowflame/,
      regexCn: / 14:3E61:虚无行者 starts using 暗影炎/,
      regexDe: / 14:3E61:Nichtswandler starts using Schattenflamme/,
      regexFr: / 14:3E61:Marcheuse Du Néant starts using Flamme D'ombre/,
      regexJa: / 14:3E61:ヴォイドウォーカー starts using シャドーフレイム/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        de: 'Tank buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '死刑',
      },
    },
    {
      id: 'E2S Doomvoid Cleaver',
      regex: / 14:3E63:Voidwalker starts using Doomvoid Cleaver/,
      regexCn: / 14:3E63:虚无行者 starts using 末日虚无劈/,
      regexDe: / 14:3E63:Nichtswandler starts using Nichtsmarter-Schlachter/,
      regexFr: / 14:3E63:Marcheuse Du Néant starts using Couperet Du Néant Ravageur/,
      regexJa: / 14:3E63:ヴォイドウォーカー starts using ドゥームヴォイド・クリーバー/,
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
        cn: '分散站位',
      },
    },
    {
      id: 'E2S Doomvoid Guillotine',
      regex: / 14:3E4F:Voidwalker starts using Doomvoid Guillotine/,
      regexCn: / 14:3E4F:虚无行者 starts using 末日虚无断/,
      regexDe: / 14:3E4F:Nichtswandler starts using Nichtsmarter-Fallbeil/,
      regexFr: / 14:3E4F:Marcheuse Du Néant starts using Guillotine Du Néant Ravageur/,
      regexJa: / 14:3E4F:ヴォイドウォーカー starts using ドゥームヴォイド・ギロチン/,
      alertText: {
        en: 'Sides',
        de: 'Seiten',
        fr: 'Côtés',
        ja: '横へ',
        cn: '两侧',
      },
    },
    {
      id: 'E2S Doomvoid Slicer',
      regex: / 14:3E50:Voidwalker starts using Doomvoid Slicer/,
      regexCn: / 14:3E50:虚无行者 starts using 末日虚无切/,
      regexDe: / 14:3E50:Nichtswandler starts using Nichtsmarter-Sense/,
      regexFr: / 14:3E50:Marcheuse Du Néant starts using Entaille Du Néant Ravageur/,
      regexJa: / 14:3E50:ヴォイドウォーカー starts using ドゥームヴォイド・スライサー/,
      infoText: {
        en: 'Get Under',
        de: 'Unter den Boss',
        fr: 'Sous le boss',
        ja: '中へ',
        cn: '脚下',
      },
    },
    {
      id: 'E2S Empty Hate',
      regex: / 14:3E59:The Hand Of Erebos starts using Empty Hate/,
      regexCn: / 14:3E59:厄瑞玻斯的巨腕 starts using 空无的恶意/,
      regexDe: / 14:3E59:Arm Des Erebos starts using Gähnender Abgrund/,
      regexFr: / 14:3E59:Bras [dD]'[éÉ]rèbe starts using Vaine Malice/,
      regexJa: / 14:3E59:エレボスの巨腕 starts using 虚ろなる悪意/,
      infoText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
      },
    },
    {
      id: 'E2S Empty Rage',
      regex: / 14:3E6B:The Hand Of Erebos starts using Empty Rage/,
      regexCn: / 14:3E6B:厄瑞玻斯的巨腕 starts using 空无的恶念/,
      regexDe: / 14:3E6B:Arm Des Erebos starts using Lockende Leere/,
      regexFr: / 14:3E6B:Bras [dD]'[éÉ]rèbe starts using Vaine Cruauté/,
      regexJa: / 14:3E6B:エレボスの巨腕 starts using 虚ろなる害意/,
      alertText: {
        en: 'Away From Hand',
        de: 'Weg von der Hand',
        fr: 'Eloignez-vous de la main',
        ja: '手から離れて',
        cn: '远离手',
      },
    },
    {
      id: 'E2S Unholy Darkness No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR stacken',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' stacken',
          fr: 'Package sur ' + data.ShortName(matches[1]),
          ja: data.ShortName(matches[1]) + 'にスタック',
          cn: data.ShortName(matches[1]) + ' 处集合',
        };
      },
    },
    {
      id: 'E2S Unholy Darkness Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'stack';
      },
    },
    {
      id: 'E2S Unholy Darkness Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Stack',
        de: 'Verzögertes stacken',
        fr: 'Package retardé',
        ja: 'スタック(ディレイ)',
        cn: '延迟集合',
      },
    },
    {
      id: 'E2S Countdown Marker Unholy Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return !data.hellWind && data.spell[matches[1]] == 'stack';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR stacken',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' stacken',
          fr: 'Package sur ' + data.ShortName(matches[1]),
          ja: data.ShortName(matches[1]) + 'にスタック',
          cn: data.ShortName(matches[1]) + ' 处集合',
        };
      },
    },
    {
      id: 'E2S Dark Fire No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '散开',
      },
    },
    {
      id: 'E2S Dark Fire Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'fire';
      },
    },
    {
      id: 'E2S Dark Fire Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Fire',
        de: 'Verzögertes Feuer',
        fr: 'Feu retardé',
        ja: 'マーカーついた(ディレイ)',
        cn: '延迟火',
      },
    },
    {
      id: 'E2S Countdown Marker Fire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.spell[data.me] == 'fire';
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '散开',
      },
    },
    {
      id: 'E2S Shadoweye No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Look Away from ' + data.ShortName(matches[1]),
            de: 'Von ' + data.ShortName(matches[1]) + ' weg schauen',
            fr: 'Ne regardez pas '+ data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'を見ないで',
            cn: '背对 ' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Eye on YOU',
            de: 'Auge auf DIR',
            fr: 'Œil de l\'ombre sur VOUS',
            ja: '自分に目',
            cn: '石化眼点名',
          };
        }
      },
    },
    {
      id: 'E2S Shadoweye Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'eye';
      },
    },
    {
      id: 'E2S Shadoweye Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Shadoweye',
        de: 'Verzögertes Schattenauge',
        fr: 'Œil de l\'ombre retardé',
        ja: 'シャドウアイ(ディレイ)',
        cn: '延迟石化眼',
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Me',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.spell[matches[1]] == 'eye' && matches[1] == data.me;
      },
      suppressSeconds: 10,
      delaySeconds: 2,
      infoText: {
        en: 'Eye on YOU',
        de: 'Auge auf DIR',
        fr: 'Œil sur VOUS',
        ja: '自分に目',
        cn: '石化眼点名',
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Other',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.spell[matches[1]] == 'eye' && data.spell[data.me] != 'eye';
      },
      suppressSeconds: 10,
      delaySeconds: 2,
      // Let's just assume these people are stacked.
      // We could call out both names, but it's probably unnecessary.
      alertText: function(data, matches) {
        return {
          en: 'Look Away from ' + data.ShortName(matches[1]),
          de: 'Von ' + data.ShortName(matches[1]) + ' weg schauen',
          fr: 'Ne regardez pas ' + data.ShortName(matches[1]),
          ja: data.ShortName(matches[1]) + 'を見ないで',
          cn: '背对 ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E2S Flare No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      alertText: {
        en: 'Flare',
        de: 'Flare',
        fr: 'Brasier',
        ja: 'フレア捨てて',
        cn: '核爆',
      },
    },
    {
      id: 'E2S Flare Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'flare';
      },
    },
    {
      id: 'E2S Flare Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Flare',
        de: 'Verzögerte Flare',
        fr: 'Brasier retardé',
        ja: 'フレア(ディレイ)',
        cn: '延迟核爆',
      },
    },
    {
      id: 'E2S Countdown Marker Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.spell[data.me] == 'flare';
      },
      alertText: {
        en: 'Flare',
        de: 'Flare',
        fr: 'Brasier',
        ja: 'フレア捨てて',
        cn: '核爆',
      },
    },
    {
      id: 'E2S Countdown Marker Flare Healer',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches[1]] == 'flare' && data.spell[data.me] != 'flare';
      },
      suppressSeconds: 10,
      infoText: {
        en: 'Flare aoes',
        de: 'Flare aoes',
        fr: 'Dégâts de zone des Brasiers',
        ja: 'フレア AoE',
        cn: '核爆AOE',
      },
    },
    {
      id: 'E2S Hell Wind No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      // The "no waiting" version comes paired with a stack.
      alarmText: {
        en: 'Hell Wind: Get Out',
        de: 'Höllenwind: Raus gehen',
        fr: 'Vent infernal : Sortez',
        ja: 'ヘルウィンド: HP1になるよ',
        cn: '地狱之风：远离',
      },
      run: function(data) {
        data.hellWind = true;
      },
    },
    {
      id: 'E2S Hell Wind Cleanup',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      delaySeconds: 15,
      run: function(data) {
        delete data.hellWind;
      },
    },
    {
      id: 'E2S Hell Wind Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'wind';
      },
    },
    {
      id: 'E2S Hell Wind Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Hell Wind',
        de: 'Verzögerte Höllenwind',
        fr: 'Vent infernal retardé',
        ja: 'ヘルウィンド(ディレイ)',
        cn: '延迟地狱之风',
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role == 'healer')
          return false;
        return data.me == matches[1] && data.spell[data.me] == 'wind';
      },
      alertText: {
        en: 'Hell Wind: wait for heals',
        de: 'Höllenwind: Warte auf Heilung',
        fr: 'Vent infernal : attendez les soins',
        ja: 'ヘルウィンド: HP戻ってから',
        cn: '地狱之风：等奶',
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind Healer',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches[1]] == 'wind';
      },
      suppressSeconds: 10,
      infoText: {
        en: 'Heal Hell Wind Targets',
        de: 'Heile Höllenwind Ziele',
        fr: 'Soignez les cibles de Vent infernal',
        ja: 'HP戻して',
        cn: '奶地狱之风目标',
      },
    },
    {
      id: 'E2S Countdown Marker Cleanup',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.spell[matches[1]];
      },
    },
    {
      // TODO: add callouts for each of these
      id: 'E2S Cycle of Retribution',
      regex: / 14:4659:Voidwalker starts using Cycle Of Retribution/,
      regexCn: / 14:4659:虚无行者 starts using 复仇连续剑/,
      regexDe: / 14:4659:Nichtswandler starts using Vergeltendes Chaos/,
      regexFr: / 14:4659:Marcheuse Du Néant starts using Multi-[tT]aillade Vengeresse/,
      regexJa: / 14:4659:ヴォイドウォーカー starts using 復讐の連続剣/,
      infoText: {
        en: 'In, Protean, Sides',
        de: 'Rein, Himmelsrichtungen, Seiten',
        fr: 'Sous le boss, Position, Côtés',
        ja: '中 => 散開 => 横',
        cn: '脚下 => 站位 => 两侧',
      },
    },
    {
      id: 'E2S Cycle of Chaos',
      regex: / 14:40B9:Voidwalker starts using Cycle Of Chaos/,
      regexCn: / 14:40B9:虚无行者 starts using 混沌连续剑/,
      regexDe: / 14:40B9:Nichtswandler starts using Chronisches Chaos/,
      regexFr: / 14:40B9:Marcheuse Du Néant starts using Multi-[tT]aillade Chaotique/,
      regexJa: / 14:40B9:ヴォイドウォーカー starts using 混沌の連続剣/,
      infoText: {
        en: 'Sides, In, Protean',
        de: 'Seiten, Rein, Himmelsrichtungen',
        fr: 'Côtés, Sous le boss, Position',
        ja: '横 => 中 => 散開',
        cn: '两侧 => 脚下 => 站位',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Voidwalker': 'Nichtswandler',
        'Engage!': 'Start!',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Unknown Ability': 'Unknown Ability',
        'Unholy Darkness': 'Unheiliges Dunkel',
        'Spell-In-Waiting': 'Verzögerung',
        'Shadowflame': 'Schattenflamme',
        'Shadoweye': 'Schattenauge',
        'Quietus': 'Quietus',
        'Punishing Ray': 'Strafender Strahl',
        'Hell Wind': 'Höllenwind',
        'Flare': 'Flare',
        'Entropy': 'Entropie',
        'Enrage': 'Finalangriff',
        'Empty Rage': 'Lockende Leere',
        'Empty Hate': 'Gähnender Abgrund',
        'Doomvoid Slicer': 'Nichtsmarter-Sense',
        'Doomvoid Guillotine': 'Nichtsmarter-Fallbeil',
        'Doomvoid Cleaver': 'Nichtsmarter-Schlachter',
        'Dark Fire III': 'Dunkel-Feuga',
        'Cycle of Retribution': 'Vergeltendes Chaos',
        'Cycle of Chaos': 'Chronisches Chaos',
        'Light/Dark Circles': 'Licht/Dunkelheit Kreis',
        'Cleaver/Slicer': 'Schlachter/Sense',
        'Slicer/Guillotine': 'Sense/Fallbeil',
        'Guillotine/Cleaver': 'Fallbeil/Schlachter',
        'Cycle Of ?': '? Chaos',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
      },
      '~effectNames': {
        'Stone Curse': 'Steinfluch',
        'Spell-In-Waiting: Unholy Darkness': 'Verzögerung: Unheiliges Dunkel',
        'Spell-In-Waiting: Shadoweye': 'Verzögerung: Schattenauge',
        'Spell-In-Waiting: Hell Wind': 'Verzögerung: Höllenwind',
        'Spell-In-Waiting: Flare': 'Verzögerung: Flare',
        'Spell-In-Waiting: Dark Fire III': 'Verzögerung: Dunkel-Feuga',
        'Prey': 'Markiert',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Infirmity': 'Gebrechlichkeit',
        'Diabolic Curse': 'Diabolischer Fluch',
        'Damage Down': 'Schaden -',
        'Bleeding': 'Blutung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Voidwalker': 'Marcheuse Du Néant',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Unknown Ability': 'Unknown Ability',
        'Unholy Darkness': 'Miracle sombre',
        'Spell-In-Waiting': 'Déphasage incantatoire',
        'Shadowflame': 'Flamme d\'ombre',
        'Shadoweye': 'Œil de l\'ombre',
        'Quietus': 'Quietus',
        'Punishing Ray': 'Rayon punitif',
        'Hell Wind': 'Vent infernal',
        'Flare': 'Brasier',
        'Entropy': 'Entropie',
        'Enrage': 'Enrage',
        'Empty Rage': 'Vaine cruauté',
        'Empty Hate': 'Vaine malice',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Doomvoid Cleaver': 'Couperet du néant ravageur',
        'Dark Fire III': 'Méga Feu ténébreux',
        'Cycle of Retribution': 'Multi-taillade vengeresse',
        'Cycle of Chaos': 'Multi-taillade chaotique',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        'Slicer/Guillotine': 'Entaille/Guillotine',
        'Light/Dark Circles': 'Cercle Lumière/Ombre',
        'Cycle Of': 'Cycle',
        'Cleaver/Slicer': 'Couperet/Entaille',
        'Guillotine/Cleaver': 'Guillotine/Couperet',
      },
      '~effectNames': {
        'Stone Curse': 'Piège De Pierre',
        'Spell-In-Waiting: Unholy Darkness': 'Sort déphasé: Miracle sombre',
        'Spell-In-Waiting: Shadoweye': 'Sort déphasé: Œil de l\'ombre',
        'Spell-In-Waiting: Hell Wind': 'Sort déphasé: Vent infernal',
        'Spell-In-Waiting: Flare': 'Sort déphasé: Brasier',
        'Spell-In-Waiting: Dark Fire III': 'Sort déphasé: Méga Feu ténébreux',
        'Prey': 'Marquage',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Infirmity': 'Infirmité',
        'Diabolic Curse': 'Maléfice Du Néant',
        'Damage Down': 'Malus de dégâts',
        'Bleeding': 'Saignant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Voidwalker': 'ヴォイドウォーカー',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'attack': '攻撃',
        'Unknown Ability': 'Unknown Ability',
        'Unholy Darkness': 'ダークホーリー',
        'Spell-In-Waiting': 'ディレイスペル',
        'Shadowflame': 'シャドーフレイム',
        'Shadoweye': 'シャドウアイ',
        'Quietus': 'クワイタス',
        'Punishing Ray': 'パニッシュレイ',
        'Hell Wind': 'ヘルウィンド',
        'Flare': 'フレア',
        'Entropy': 'エントロピー',
        'Empty Rage': '虚ろなる害意',
        'Empty Hate': '虚ろなる悪意',
        'Doomvoid Slicer': 'ドゥームヴォイド・スライサー',
        'Doomvoid Guillotine': 'ドゥームヴォイド・ギロチン',
        'Doomvoid Cleaver': 'ドゥームヴォイド・クリーバー',
        'Dark Fire III': 'ダークファイガ',
        'Cycle of Retribution': '復讐の連続剣',
        'Cycle of Chaos': '混沌の連続剣',
      },
      '~effectNames': {
        'Stone Curse': '石化の呪い',
        'Spell-In-Waiting: Unholy Darkness': 'ディレイスペル: ダークホーリー',
        'Spell-In-Waiting: Shadoweye': 'ディレイスペル: シャドウアイ',
        'Spell-In-Waiting: Hell Wind': 'ディレイスペル: ヘルウィンド',
        'Spell-In-Waiting: Flare': 'ディレイスペル: フレア',
        'Spell-In-Waiting: Dark Fire III': 'ディレイスペル: ダークファイガ',
        'Prey': 'マーキング',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Infirmity': '虚弱',
        'Diabolic Curse': 'ヴォイドの呪詛',
        'Damage Down': 'ダメージ低下',
        'Bleeding': 'ペイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Hand Of Erebos': '厄瑞玻斯的巨腕',
        'Voidwalker': '虚无行者',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
        'Unholy Darkness': '黑暗神圣',
        'Spell-In-Waiting': '延迟咏唱',
        'Shadowflame': '暗影炎',
        'Shadoweye': '暗影之眼',
        'Quietus': '寂灭',
        'Punishing Ray': '惩戒之光',
        'Hell Wind': '地狱之风',
        'Flare': '核爆',
        'Entropy': '熵',
        'Empty Hate/Rage': '空无的恶意/恶念',
        'Empty Rage': '空无的恶念',
        'Empty Hate': '空无的恶意',
        'Slicer/Guillotine': '虚无切/虚无断',
        'Cleaver/Slicer?': '虚无劈/虚无切?',
        'Guillotine/Cleaver?': '虚无断/虚无劈?',
        'Light/Dark Circles': '黑白圈',
        'Doomvoid Slicer': '末日虚无切',
        'Doomvoid Guillotine': '末日虚无断',
        'Doomvoid Cleaver': '末日虚无劈',
        'Dark Fire III': '黑暗爆炎',
        'Cycle [oO]f Retribution': '复仇连续剑',
        'Cycle [oO]f Chaos': '混沌连续剑',
        'Cycle Of ?': '??连续剑',
      },
      '~effectNames': {
        'Stone Curse': '石化的诅咒',
        'Prey': '猎物',
        'Infirmity': '虚弱',
        'Diabolic Curse': '虚无的诅咒',
        'Bleeding': '出血',
      },
    },
  ],
}];
