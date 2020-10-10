'use strict';

[{
  zoneId: ZoneId.EdensGateDescent,
  timelineFile: 'e2n.txt',
  timelineTriggers: [
    {
      id: 'E2N Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 9,
      infoText: {
        en: 'Get Puddles',
        de: 'Flächen nehmen',
        fr: 'Allez dans les zones au sol',
        cn: '踩圈',
        ko: '장판 밟기',
      },
    },
  ],
  triggers: [
    {
      id: 'E2N Shadowflame Tank',
      netRegex: NetRegexes.startsUsing({ id: '3E4D', source: 'Voidwalker' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E4D', source: 'Nichtswandler' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E4D', source: 'Marcheuse Du Néant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E4D', source: 'ヴォイドウォーカー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E4D', source: '虚无行者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E4D', source: '보이드워커' }),
      condition: function(data) {
        return data.role == 'tank';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E2N Shadowflame Healer',
      netRegex: NetRegexes.startsUsing({ id: '3E4D', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E4D', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E4D', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E4D', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E4D', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E4D', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Tank Busters',
        de: 'Tank buster',
        fr: 'Tank buster',
        cn: '死刑',
        ko: '탱버',
      },
    },
    {
      id: 'E2N Entropy',
      netRegex: NetRegexes.startsUsing({ id: '3E6D', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E6D', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E6D', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E6D', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E6D', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E6D', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E2N Doomvoid Slicer',
      netRegex: NetRegexes.startsUsing({ id: '3E3C', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E3C', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E3C', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E3C', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E3C', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E3C', source: '보이드워커', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E2N Empty Hate',
      netRegex: NetRegexes.startsUsing({ id: '3E46', source: 'The Hand Of Erebos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E46', source: 'Arm Des Erebos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E46', source: 'Bras D\'Érèbe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E46', source: 'エレボスの巨腕', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E46', source: '厄瑞玻斯的巨腕', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E46', source: '에레보스의 팔', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E2N Darkfire Counter',
      netRegex: NetRegexes.startsUsing({ id: '3E42', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E42', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E42', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E42', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E42', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E42', source: '보이드워커', capture: false }),
      run: function(data) {
        data.fireCount = data.fireCount || 0;
        data.fireCount++;
      },
    },
    {
      id: 'E2N Dark Fire No Waiting',
      netRegex: NetRegexes.headMarker({ id: '004C' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread('alert'),
    },
    {
      id: 'E2N Unholy Darkness No Waiting',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2N Shadoweye No Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'E2N Dark Fire Collect',
      netRegex: NetRegexes.headMarker({ id: '00B5' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'fire';
      },
    },
    {
      id: 'E2N Dark Fire Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B5' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Fire',
        de: 'Verzögertes Feuer',
        fr: 'Feu retardé',
        cn: '延迟火',
        ko: '지연술 파이가',
      },
    },
    {
      id: 'E2N Countdown Marker Fire',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.spell[data.me] == 'fire';
      },
      alertText: function(data) {
        if (data.fireCount == 3) {
          return {
            en: 'Spread (don\'t stack!)',
            de: 'Verteilen (nicht zusammen stehen)',
            fr: 'Dispersez-vous (ne vous packez pas)',
            cn: '分散',
            ko: '산개 (쉐어 맞으면 안됨)',
          };
        }
        return {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Dispersez-vous',
          cn: '分散',
          ko: '산개',
        };
      },
    },
    {
      id: 'E2N Unholy Darkness Collect',
      netRegex: NetRegexes.headMarker({ id: '00B4' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'stack';
      },
    },
    {
      id: 'E2N Unholy Darkness Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B4' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Stack',
        de: 'Verzögertes sammeln',
        fr: 'Package retardé',
        cn: '延迟集合',
        ko: '지연술 쉐어징',
      },
    },
    {
      id: 'E2N Countdown Marker Unholy Darkness',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        // The third fire coincides with stack.
        // These people should avoid.
        if (data.spell[data.me] == 'fire' && data.fireCount == 3)
          return false;
        return data.spell[matches.target] == 'stack';
      },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2N Shadoweye Collect',
      netRegex: NetRegexes.headMarker({ id: '00B7' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'eye';
      },
    },
    {
      id: 'E2N Shadoweye Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B7' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Delayed Shadoweye',
        de: 'Verzögertes Schattenauge',
        fr: 'Œil de l\'ombre retardé',
        cn: '延迟石化眼',
        ko: '지연술 그림자시선',
      },
    },
    {
      id: 'E2N Countdown Marker Shadoweye',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.spell[matches.target] == 'eye';
      },
      delaySeconds: 2,
      response: Responses.lookAwayFromTarget('alarm'),
    },
    {
      id: 'E2N Countdown Marker Shadoweye You',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.spell[matches.target] == 'eye';
      },
      delaySeconds: 2,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Eye on YOU',
            de: 'Auge auf DIR',
            fr: 'Œil de l\'ombre sur VOUS',
            cn: '石化眼点名',
            ko: '시선징 대상자',
          };
        }
      },
    },
    {
      id: 'E2N Countdown Marker Cleanup',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.spell[matches.target];
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Hand of Erebos': 'Arm des Erebos',
        'Voidwalker': 'Nichtswandler',
      },
      'replaceText': {
        'Dark Fire III': 'Dunkel-Feuga',
        'Doomvoid Guillotine': 'Nichtsmarter-Fallbeil',
        'Doomvoid Slicer': 'Nichtsmarter-Sense',
        'Empty Hate': 'Gähnender Abgrund',
        'Entropy': 'Entropie',
        'Punishing Ray': 'Strafender Strahl',
        'Shadoweye': 'Schattenauge',
        'Shadowflame': 'Schattenflamme',
        'Spell-In-Waiting': 'Verzögerung',
        'Unholy Darkness': 'Unheiliges Dunkel',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Hand of Erebos': 'Bras d\'Érèbe',
        'Voidwalker': 'Marcheuse du néant',
      },
      'replaceText': {
        'Dark Fire III': 'Méga Feu ténébreux',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Empty Hate': 'Vaine malice',
        'Entropy': 'Entropie',
        'Punishing Ray': 'Rayon punitif',
        'Shadoweye': 'Œil de l\'ombre',
        'Shadowflame': 'Flamme d\'ombre',
        'Spell-in-Waiting': 'Déphasage incantatoire',
        'Unholy Darkness': 'Miracle sombre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Hand of Erebos': 'エレボスの巨腕',
        'Voidwalker': 'ヴォイドウォーカー',
      },
      'replaceText': {
        'Dark Fire III': 'ダークファイガ',
        'Doomvoid Guillotine': 'ドゥームヴォイド・ギロチン',
        'Doomvoid Slicer': 'ドゥームヴォイド・スライサー',
        'Empty Hate': '虚ろなる悪意',
        'Entropy': 'エントロピー',
        'Punishing Ray': 'パニッシュレイ',
        'Shadoweye': 'シャドウアイ',
        'Shadowflame': 'シャドーフレイム',
        'Spell-in-Waiting': 'ディレイスペル',
        'Unholy Darkness': 'ダークホーリー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Hand of Erebos': '厄瑞玻斯的巨腕',
        'Voidwalker': '虚无行者',
      },
      'replaceText': {
        'Dark Fire III': '黑暗爆炎',
        'Doomvoid Guillotine': '末日虚无断',
        'Doomvoid Slicer': '末日虚无切',
        'Empty Hate': '空无的恶意',
        'Entropy': '熵',
        'Punishing Ray': '惩戒之光',
        'Shadoweye': '暗影之眼',
        'Shadowflame': '暗影炎',
        'Spell-in-Waiting': '延迟咏唱',
        'Unholy Darkness': '黑暗神圣',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Hand of Erebos': '에레보스의 팔',
        'Voidwalker': '보이드워커',
      },
      'replaceText': {
        'Dark Fire III': '다크 파이가',
        'Doomvoid Guillotine': '파멸의 보이드 절단',
        'Doomvoid Slicer': '파멸의 보이드 베기',
        'Empty Hate': '공허한 악의',
        'Entropy': '엔트로피',
        'Punishing Ray': '응징의 빛줄기',
        'Shadoweye': '그림자 시선',
        'Shadowflame': '그림자 불꽃',
        'Spell-in-Waiting': '지연술',
        'Unholy Darkness': '다크 홀리',
      },
    },
  ],
}];
