'use strict';

// TODO
// better callouts for cycle
// tank provoke messages when cotank has flare

[{
  zoneRegex: {
    en: /^Eden's Gate: Descent \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章2\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(2\)$/,
  },
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
        ko: '바닥 징 밟기',
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
        ko: '흑백 파트너랑 모이기',
      },
    },
  ],
  triggers: [
    {
      id: 'E2S Spell In Waiting Gain',
      regex: Regexes.gainsEffect({ target: 'Voidwalker', effect: 'Spell-In-Waiting', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Nichtswandler', effect: 'Verzögerung', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'marcheuse du néant', effect: 'Déphasage Incantatoire', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ヴォイドウォーカー', effect: 'ディレイスペル', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '虚无行者', effect: '延迟咏唱', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '보이드워커', effect: '지연술', capture: false }),
      run: function(data) {
        data.waiting = true;
      },
    },
    {
      id: 'E2S Spell In Waiting Lose',
      regex: Regexes.losesEffect({ target: 'Voidwalker', effect: 'Spell-In-Waiting', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Nichtswandler', effect: 'Verzögerung', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'marcheuse du néant', effect: 'Déphasage Incantatoire', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'ヴォイドウォーカー', effect: 'ディレイスペル', capture: false }),
      regexCn: Regexes.losesEffect({ target: '虚无行者', effect: '延迟咏唱', capture: false }),
      regexKo: Regexes.losesEffect({ target: '보이드워커', effect: '지연술', capture: false }),
      run: function(data) {
        data.waiting = false;
      },
    },
    {
      id: 'E2S Entropy',
      regex: Regexes.startsUsing({ id: '3E6F', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E6F', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E6F', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E6F', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E6F', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E6F', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
        cn: 'AOE',
        ko: '전체공격',
      },
    },
    {
      id: 'E2S Quietus',
      regex: Regexes.startsUsing({ id: '3E71', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E71', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E71', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E71', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E71', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E71', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
        cn: 'AOE',
        ko: '전체공격',
      },
    },
    {
      id: 'E2S Shadowflame Tank',
      regex: Regexes.startsUsing({ id: '3E6[12]', source: 'Voidwalker' }),
      regexDe: Regexes.startsUsing({ id: '3E6[12]', source: 'Nichtswandler' }),
      regexFr: Regexes.startsUsing({ id: '3E6[12]', source: 'Marcheuse Du Néant' }),
      regexJa: Regexes.startsUsing({ id: '3E6[12]', source: 'ヴォイドウォーカー' }),
      regexCn: Regexes.startsUsing({ id: '3E6[12]', source: '虚无行者' }),
      regexKo: Regexes.startsUsing({ id: '3E6[12]', source: '보이드워커' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 대상자',
      },
    },
    {
      id: 'E2S Shadowflame Healer',
      regex: Regexes.startsUsing({ id: '3E61', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E61', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E61', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E61', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E61', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E61', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        de: 'Tank buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '死刑',
        ko: '탱버',
      },
    },
    {
      id: 'E2S Doomvoid Cleaver',
      regex: Regexes.startsUsing({ id: '3E63', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E63', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E63', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E63', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E63', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E63', source: '보이드워커', capture: false }),
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
        cn: '分散站位',
        ko: '정해진 위치로 산개',
      },
    },
    {
      id: 'E2S Doomvoid Guillotine',
      regex: Regexes.startsUsing({ id: '3E4F', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E4F', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E4F', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E4F', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E4F', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E4F', source: '보이드워커', capture: false }),
      alertText: {
        en: 'Sides',
        de: 'Seiten',
        fr: 'Côtés',
        ja: '横へ',
        cn: '两侧',
        ko: '보스 측면으로 이동',
      },
    },
    {
      id: 'E2S Doomvoid Slicer',
      regex: Regexes.startsUsing({ id: '3E50', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E50', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E50', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E50', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E50', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E50', source: '보이드워커', capture: false }),
      infoText: {
        en: 'Get Under',
        de: 'Unter den Boss',
        fr: 'Sous le boss',
        ja: '中へ',
        cn: '脚下',
        ko: '보스 아래로',
      },
    },
    {
      id: 'E2S Empty Hate',
      regex: Regexes.startsUsing({ id: '3E59', source: 'The Hand Of Erebos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E59', source: 'Arm Des Erebos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E59', source: 'Bras D\'Érèbe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E59', source: 'エレボスの巨腕', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E59', source: '厄瑞玻斯的巨腕', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E59', source: '에레보스의 팔', capture: false }),
      infoText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'E2S Empty Rage',
      regex: Regexes.startsUsing({ id: '3E6B', source: 'The Hand Of Erebos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E6B', source: 'Arm Des Erebos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E6B', source: 'Bras D\'Érèbe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E6B', source: 'エレボスの巨腕', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E6B', source: '厄瑞玻斯的巨腕', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E6B', source: '에레보스의 팔', capture: false }),
      alertText: {
        en: 'Away From Hand',
        de: 'Weg von der Hand',
        fr: 'Eloignez-vous de la main',
        ja: '手から離れて',
        cn: '远离手',
        ko: '팔에서 멀어지기',
      },
    },
    {
      id: 'E2S Unholy Darkness No Waiting',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR stacken',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' stacken',
          fr: 'Package sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にスタック',
          cn: data.ShortName(matches.target) + ' 处集合',
          ko: '"' + data.ShortName(matches.target) + '"에게 모이세요',
        };
      },
    },
    {
      id: 'E2S Unholy Darkness Collect',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'stack';
      },
    },
    {
      id: 'E2S Unholy Darkness Waiting',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function(data, matches) {
        return data.waiting && data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Stack',
        de: 'Verzögertes stacken',
        fr: 'Package retardé',
        ja: 'スタック(ディレイ)',
        cn: '延迟集合',
        ko: '지연술 쉐어징',
      },
    },
    {
      id: 'E2S Countdown Marker Unholy Darkness',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return !data.hellWind && data.spell[matches.target] == 'stack';
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR stacken',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' stacken',
          fr: 'Package sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にスタック',
          cn: data.ShortName(matches.target) + ' 处集合',
          ko: '"' + data.ShortName(matches.target) + '"에게 모이세요',
        };
      },
    },
    {
      id: 'E2S Dark Fire No Waiting',
      regex: Regexes.headMarker({ id: '004C' }),
      condition: function(data, matches) {
        return !data.waiting && data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '散开',
        ko: '산개',
      },
    },
    {
      id: 'E2S Dark Fire Collect',
      regex: Regexes.headMarker({ id: '004C' }),
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'fire';
      },
    },
    {
      id: 'E2S Dark Fire Waiting',
      regex: Regexes.headMarker({ id: '004C' }),
      condition: function(data, matches) {
        return data.waiting && data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Fire',
        de: 'Verzögertes Feuer',
        fr: 'Feu retardé',
        ja: 'マーカーついた(ディレイ)',
        cn: '延迟火',
        ko: '지연술 파이가',
      },
    },
    {
      id: 'E2S Countdown Marker Fire',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.spell[data.me] == 'fire';
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '散开',
        ko: '산개',
      },
    },
    {
      id: 'E2S Shadoweye No Waiting',
      regex: Regexes.headMarker({ id: '00B3' }),
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Look Away from ' + data.ShortName(matches.target),
            de: 'Von ' + data.ShortName(matches.target) + ' weg schauen',
            fr: 'Ne regardez pas '+ data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'を見ないで',
            cn: '背对 ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 바라보지 마세요',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Eye on YOU',
            de: 'Auge auf DIR',
            fr: 'Œil de l\'ombre sur VOUS',
            ja: '自分に目',
            cn: '石化眼点名',
            ko: '나에게 눈징',
          };
        }
      },
    },
    {
      id: 'E2S Shadoweye Collect',
      regex: Regexes.headMarker({ id: '00B3' }),
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'eye';
      },
    },
    {
      id: 'E2S Shadoweye Waiting',
      regex: Regexes.headMarker({ id: '00B3' }),
      condition: function(data, matches) {
        return data.waiting && data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Shadoweye',
        de: 'Verzögertes Schattenauge',
        fr: 'Œil de l\'ombre retardé',
        ja: 'シャドウアイ(ディレイ)',
        cn: '延迟石化眼',
        ko: '지연술 눈징',
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Me',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.spell[matches.target] == 'eye' && matches.target == data.me;
      },
      suppressSeconds: 10,
      delaySeconds: 2,
      infoText: {
        en: 'Eye on YOU',
        de: 'Auge auf DIR',
        fr: 'Œil sur VOUS',
        ja: '自分に目',
        cn: '石化眼点名',
        ko: '나에게 눈징',
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Other',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.spell[matches.target] == 'eye' && data.spell[data.me] != 'eye';
      },
      suppressSeconds: 10,
      delaySeconds: 2,
      // Let's just assume these people are stacked.
      // We could call out both names, but it's probably unnecessary.
      alertText: function(data, matches) {
        return {
          en: 'Look Away from ' + data.ShortName(matches.target),
          de: 'Von ' + data.ShortName(matches.target) + ' weg schauen',
          fr: 'Ne regardez pas ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'を見ないで',
          cn: '背对 ' + data.ShortName(matches.target),
          ko: '"' + data.ShortName(matches.target) + '" 바라보지 말기',
        };
      },
    },
    {
      id: 'E2S Flare No Waiting',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return !data.waiting && data.me == matches.target;
      },
      alertText: {
        en: 'Flare',
        de: 'Flare',
        fr: 'Brasier',
        ja: 'フレア捨てて',
        cn: '核爆',
        ko: '플레어',
      },
    },
    {
      id: 'E2S Flare Collect',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'flare';
      },
    },
    {
      id: 'E2S Flare Waiting',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return data.waiting && data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Flare',
        de: 'Verzögerte Flare',
        fr: 'Brasier retardé',
        ja: 'フレア(ディレイ)',
        cn: '延迟核爆',
        ko: '지연술 플레어',
      },
    },
    {
      id: 'E2S Countdown Marker Flare',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.spell[data.me] == 'flare';
      },
      alertText: {
        en: 'Flare',
        de: 'Flare',
        fr: 'Brasier',
        ja: 'フレア捨てて',
        cn: '核爆',
        ko: '플레어',
      },
    },
    {
      id: 'E2S Countdown Marker Flare Healer',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches.target] == 'flare' && data.spell[data.me] != 'flare';
      },
      suppressSeconds: 10,
      infoText: {
        en: 'Flare aoes',
        de: 'Flare aoes',
        fr: 'Dégâts de zone des Brasiers',
        ja: 'フレア AoE',
        cn: '核爆AOE',
        ko: '플레어 터짐',
      },
    },
    {
      id: 'E2S Hell Wind No Waiting',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: function(data, matches) {
        return !data.waiting && data.me == matches.target;
      },
      // The "no waiting" version comes paired with a stack.
      alarmText: {
        en: 'Hell Wind: Get Out',
        de: 'Höllenwind: Raus gehen',
        fr: 'Vent infernal : Sortez',
        ja: 'ヘルウィンド: HP1になるよ',
        cn: '地狱之风：远离',
        ko: '홍옥징 대상자',
      },
      run: function(data) {
        data.hellWind = true;
      },
    },
    {
      id: 'E2S Hell Wind Cleanup',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: function(data, matches) {
        return !data.waiting && data.me == matches.target;
      },
      delaySeconds: 15,
      run: function(data) {
        delete data.hellWind;
      },
    },
    {
      id: 'E2S Hell Wind Collect',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'wind';
      },
    },
    {
      id: 'E2S Hell Wind Waiting',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: function(data, matches) {
        return data.waiting && data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Hell Wind',
        de: 'Verzögerte Höllenwind',
        fr: 'Vent infernal retardé',
        ja: 'ヘルウィンド(ディレイ)',
        cn: '延迟地狱之风',
        ko: '지연술 홍옥징',
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        if (data.role == 'healer')
          return false;
        return data.me == matches.target && data.spell[data.me] == 'wind';
      },
      alertText: {
        en: 'Hell Wind: wait for heals',
        de: 'Höllenwind: Warte auf Heilung',
        fr: 'Vent infernal : attendez les soins',
        ja: 'ヘルウィンド: HP戻ってから',
        cn: '地狱之风：等奶',
        ko: '힐 받고 들어가기',
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind Healer',
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches.target] == 'wind';
      },
      suppressSeconds: 10,
      infoText: {
        en: 'Heal Hell Wind Targets',
        de: 'Heile Höllenwind Ziele',
        fr: 'Soignez les cibles de Vent infernal',
        ja: 'HP戻して',
        cn: '奶地狱之风目标',
        ko: '홍옥징 대상자 힐',
      },
    },
    {
      id: 'E2S Countdown Marker Cleanup',
      regex: Regexes.headMarker({ id: '00B8' }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.spell[matches.target];
      },
    },
    {
      // TODO: add callouts for each of these
      id: 'E2S Cycle of Retribution',
      regex: Regexes.startsUsing({ id: '4659', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4659', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4659', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4659', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4659', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4659', source: '보이드워커', capture: false }),
      infoText: {
        en: 'In, Protean, Sides',
        de: 'Rein, Himmelsrichtungen, Seiten',
        fr: 'Sous le boss, Position, Côtés',
        ja: '中 => 散開 => 横',
        cn: '脚下 => 站位 => 两侧',
        ko: '중앙 => 산개 => 측면',
      },
    },
    {
      id: 'E2S Cycle of Chaos',
      regex: Regexes.startsUsing({ id: '40B9', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40B9', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40B9', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40B9', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40B9', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40B9', source: '보이드워커', capture: false }),
      infoText: {
        en: 'Sides, In, Protean',
        de: 'Seiten, Rein, Himmelsrichtungen',
        fr: 'Côtés, Sous le boss, Position',
        ja: '横 => 中 => 散開',
        cn: '两侧 => 脚下 => 站位',
        ko: '측면 => 중앙 => 산개',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Voidwalker': 'Nichtswandler',
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
        'Empty Hate/Rage': 'Lockende Leere/Gähnender Abgrund',
        'Empty Rage': 'Lockende Leere',
        'Empty Hate(?!/)': 'Gähnender Abgrund',
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
        'Empty Hate/Rage': 'Vaine malice/cruauté',
        'Empty Rage': 'Vaine cruauté',
        'Empty Hate(?!/)': 'Vaine malice',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Doomvoid Cleaver': 'Couperet du néant ravageur',
        'Dark Fire III': 'Méga Feu ténébreux',
        'Cycle of Retribution': 'Multi-taillade vengeresse',
        'Cycle of Chaos': 'Multi-taillade chaotique',
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
      'missingTranslations': true,
      'replaceSync': {
        'Voidwalker': 'ヴォイドウォーカー',
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
        'Empty Hate/Rage': '虚ろなる害意/悪意',
        'Empty Rage': '虚ろなる害意',
        'Empty Hate(?!/)': '虚ろなる悪意',
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
        'Empty Hate(?!/)': '空无的恶意',
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
    {
      'locale': 'ko',
      'replaceSync': {
        'Voidwalker': '보이드워커',
      },
      'replaceText': {
        'attack': '공격',
        'Unholy Darkness': '다크 홀리',
        'Spell-In-Waiting': '지연술',
        'Shadowflame': '그림자 불꽃',
        'Shadoweye': '그림자 시선',
        'Quietus': '종지부',
        'Punishing Ray': '응징의 빛줄기',
        'Hell Wind': '황천의 바람',
        'Flare': '플레어',
        'Entropy': '엔트로피',
        'Empty Hate/Rage': '공허한 악의/적의',
        'Empty Rage': '공허한 적의',
        'Empty Hate(?!/)': '공허한 악의',
        'Doomvoid Slicer': '파멸의 보이드 베기',
        'Doomvoid Guillotine': '파멸의 보이드 절단',
        'Doomvoid Cleaver': '파멸의 보이드 살육',
        'Dark Fire III': '다크 파이가',
        'Cycle of Retribution': '복수의 연속검',
        'Cycle of Chaos': '혼돈의 연속검',
        'Light/Dark Circles': '빛/어둠 징',
        'Cleaver/Slicer': '살육/베기',
        'Slicer/Guillotine': '베기/절단',
        'Guillotine/Cleaver': '절단/살육',
        'Cycle Of ?': '? 연속검',
      },
      '~effectNames': {
        'Stone Curse': '석화의 저주',
        'Spell-In-Waiting: Unholy Darkness': '지연술: 다크 홀리',
        'Spell-In-Waiting: Shadoweye': '지연술: 그림자 시선',
        'Spell-In-Waiting: Hell Wind': '지연술: 황천의 바람',
        'Spell-In-Waiting: Flare': '지연술: 플레어',
        'Spell-In-Waiting: Dark Fire III': '지연술: 다크 파이가',
        'Prey': '표식',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Infirmity': '허약',
        'Diabolic Curse': '죽음의 선고',
        'Damage Down': '주는 피해량 감소',
        'Bleeding': '고통',
      },
    },
  ],
}];
