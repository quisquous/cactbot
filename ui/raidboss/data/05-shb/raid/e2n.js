'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Descent$/,
    cn: /^伊甸希望乐园 \(觉醒之章2\)$/,
    ko: /^희망의 낙원 에덴: 각성편 \(2\)$/,
  },
  timelineFile: 'e2n.txt',
  timelineTriggers: [
    {
      id: 'E2N Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 9,
      infoText: {
        en: 'Get Puddles',
        de: 'Flächen nehmen',
        fr: 'Prenez les rayons',
        cn: '踩圈',
        ko: '장판 밟기',
      },
    },
  ],
  triggers: [
    {
      id: 'E2N Shadowflame Tank',
      regex: Regexes.startsUsing({ id: '3E4D', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E4D', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E4D', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E4D', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E4D', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E4D', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        cn: '死刑点名',
        ko: '나에게 탱버',
      },
    },
    {
      id: 'E2N Shadowflame Healer',
      regex: Regexes.startsUsing({ id: '3E4D', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E4D', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E4D', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E4D', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E4D', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E4D', source: '보이드워커', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        de: 'tank buster',
        fr: 'Tank busters',
        cn: '死刑',
        ko: '탱버',
      },
    },
    {
      id: 'E2N Entropy',
      regex: Regexes.startsUsing({ id: '3E6D', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E6D', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E6D', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E6D', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E6D', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E6D', source: '보이드워커', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '전체공격',
      },
    },
    {
      id: 'E2N Doomvoid Slicer',
      regex: Regexes.startsUsing({ id: '3E3C', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E3C', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E3C', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E3C', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E3C', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E3C', source: '보이드워커', capture: false }),
      infoText: {
        en: 'Get Under',
        de: 'Unter ihn',
        fr: 'Intérieur',
        cn: '脚下',
        ko: '안으로',
      },
    },
    {
      id: 'E2N Empty Hate',
      regex: Regexes.startsUsing({ id: '3E46', source: 'The Hand Of Erebos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E46', source: 'Arm Des Erebos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E46', source: 'Bras D\'Érèbe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E46', source: 'エレボスの巨腕', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E46', source: '厄瑞玻斯的巨腕', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E46', source: '에레보스의 팔', capture: false }),
      infoText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'E2N Darkfire Counter',
      regex: Regexes.startsUsing({ id: '3E42', source: 'Voidwalker', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E42', source: 'Nichtswandler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E42', source: 'Marcheuse Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E42', source: 'ヴォイドウォーカー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E42', source: '虚无行者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E42', source: '보이드워커', capture: false }),
      run: function(data) {
        data.fireCount = data.fireCount || 0;
        data.fireCount++;
      },
    },
    {
      id: 'E2N Dark Fire No Waiting',
      regex: Regexes.headMarker({ id: '004C' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'E2N Unholy Darkness No Waiting',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            cn: '集合',
            ko: '나에게 쉐어',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur '+ data.ShortName(matches.target),
          cn: '集合 -> ' + data.ShortName(matches.target),
          ko: '쉐어 -> ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'E2N Shadoweye No Waiting',
      regex: Regexes.headMarker({ id: '00B3' }),
      alertText: function(data, matches) {
        return {
          en: 'Look Away from ' + data.ShortName(matches.target),
          de: 'Schau weg von ' + data.ShortName(matches.target),
          fr: 'Ne regardez pas '+ data.ShortName(matches.target),
          cn: '背对 ' + data.ShortName(matches.target),
          ko: '보지마세요 -> ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'E2N Dark Fire Collect',
      regex: Regexes.headMarker({ id: '00B5' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'fire';
      },
    },
    {
      id: 'E2N Dark Fire Waiting',
      regex: Regexes.headMarker({ id: '00B5' }),
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
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.spell[data.me] == 'fire';
      },
      alertText: function(data) {
        if (data.fireCount == 3) {
          return {
            en: 'Spread (don\'t stack!)',
            de: 'Verteilen (nicht zusammen stehen)',
            fr: 'Dispersez-vous', // FIXME
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
      regex: Regexes.headMarker({ id: '00B4' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'stack';
      },
    },
    {
      id: 'E2N Unholy Darkness Waiting',
      regex: Regexes.headMarker({ id: '00B4' }),
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
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        // The third fire coincides with stack.
        // These people should avoid.
        if (data.spell[data.me] == 'fire' && data.fireCount == 3)
          return false;
        return data.spell[matches.target] == 'stack';
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            cn: '集合',
            ko: '나에게 쉐어',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '集合 -> ' + data.ShortName(matches.target),
          ko: '쉐어 -> ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'E2N Shadoweye Collect',
      regex: Regexes.headMarker({ id: '00B7' }),
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'eye';
      },
    },
    {
      id: 'E2N Shadoweye Waiting',
      regex: Regexes.headMarker({ id: '00B7' }),
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
      regex: Regexes.headMarker({ id: '00B8' }),
      condition: function(data, matches) {
        return data.spell[matches.target] == 'eye';
      },
      delaySeconds: 2,
      alarmText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Look Away from ' + data.ShortName(matches.target),
            de: 'Von ' + data.ShortName(matches.target) + ' weg schauen',
            fr: 'Ne regardez pas ' + data.ShortName(matches.target),
            cn: '背对 ' + data.ShortName(matches.target),
            ko: '보지마세요 -> ' + data.ShortName(matches.target),
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Eye on YOU',
            de: 'Auge auf DIR',
            fr: 'Œil de l\'ombre sur VOUS',
            cn: '石化眼点名',
            ko: '나에게 시선징',
          };
        }
      },
    },
    {
      id: 'E2N Countdown Marker Cleanup',
      regex: Regexes.headMarker({ id: '00B8' }),
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
        'Voidwalker': 'Nichtswandler',
        'The Hand of Erebos': 'Arm des Erebos',
      },
      'replaceText': {
        'Spell-In-Waiting': 'Verzögerung',
        'Shadowflame': 'Schattenflamme',
        'Doomvoid Guillotine': 'Nichtsmarter-Fallbeil',
        'Dark Fire III': 'Dunkel-Feuga',
        'Unholy Darkness': 'Unheiliges Dunkel',
        'Punishing Ray': 'Strafender Strahl',
        'Doomvoid Slicer': 'Nichtsmarter-Sense',
        'Empty Hate': 'Gähnender Abgrund',
        'Shadoweye': 'Schattenauge',
        'Entropy': 'Entropie',
      },
      '~effectNames': {
        'Spell-in-Waiting: Shadoweye': 'Verzögerung: Schattenauge',
        'Infirmity': 'Gebrechlichkeit',
        'Petrification': 'Stein',
        'Bleeding': 'Blutung',
        'Diabolic Curse': 'Diabolischer Fluch',
        'Spell-in-Waiting: Dark Fire III': 'Verzögerung: Dunkel-Feuga',
        'Brink of Death': 'Sterbenselend',
        'Spell-in-Waiting: Unholy Darkness': 'Verzögerung: Unheiliges Dunkel',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Voidwalker': 'Marcheuse du néant',
      },
      'replaceText': {
        'Spell-in-Waiting': 'Déphasage incantatoire',
        '--sync--': '--Synchronisation--',
        'Shadowflame': 'Flamme d\'ombre',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Dark Fire III': 'Méga Feu ténébreux',
        'Unholy Darkness': 'Miracle sombre',
        '--Reset--': '--Réinitialisation--',
        'Punishing Ray': 'Rayon punitif',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Empty Hate': 'Vaine malice',
        'Shadoweye': 'Œil de l\'ombre',
        'Entropy': 'Entropie',
      },
      '~effectNames': {
        'Spell-in-Waiting: Shadoweye': 'Sort déphasé: Œil de l\'ombre',
        'Infirmity': 'Infirmité',
        'Petrification': 'Pétrification',
        'Bleeding': 'Saignant',
        'Diabolic Curse': 'Maléfice Du Néant',
        'Spell-in-Waiting: Dark Fire III': 'Sort déphasé: Méga Feu ténébreux',
        'Brink of Death': 'Mourant',
        'Spell-in-Waiting: Unholy Darkness': 'Sort déphasé: Miracle sombre',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
      },
      'replaceText': {
        'Spell-in-Waiting': 'ディレイスペル',
        'Shadowflame': 'シャドーフレイム',
        'Doomvoid Guillotine': 'ドゥームヴォイド・ギロチン',
        'Dark Fire III': 'ダークファイガ',
        'Unholy Darkness': 'ダークホーリー',
        'Punishing Ray': 'パニッシュレイ',
        'Doomvoid Slicer': 'ドゥームヴォイド・スライサー',
        'Empty Hate': '虚ろなる悪意',
        'Shadoweye': 'シャドウアイ',
        'Entropy': 'エントロピー',
      },
      '~effectNames': {
        'Spell-in-Waiting: Shadoweye': 'ディレイスペル：シャドウアイ',
        'Infirmity': '虚弱',
        'Petrification': '石化',
        'Bleeding': 'ペイン',
        'Diabolic Curse': 'ヴォイドの呪詛',
        'Spell-in-Waiting: Dark Fire III': 'ディレイスペル：ダークファイガ',
        'Brink of Death': '衰弱［強］',
        'Spell-in-Waiting: Unholy Darkness': 'ディレイスペル：ダークホーリー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Voidwalker': '虚无行者',
        'The Hand of Erebos': '厄瑞玻斯的巨腕',
      },
      'replaceText': {
        'Spell-[iI]n-Waiting': '延迟咏唱',
        'Shadowflame': '暗影炎',
        'Doomvoid Guillotine': '末日虚无断',
        'Dark Fire III': '黑暗爆炎',
        'Unholy Darkness': '黑暗神圣',
        'Punishing Ray': '惩戒之光',
        'Doomvoid Slicer': '末日虚无切',
        'Empty Hate': '空无的恶意',
        'Shadoweye': '暗影之眼',
        'Entropy': '熵',
      },
      '~effectNames': {
        'Spell-in-Waiting: Shadoweye': '延迟咏唱：暗影之眼',
        'Infirmity': '虚弱',
        'Petrification': '石化',
        'Bleeding': '出血',
        'Diabolic Curse': '虚无的诅咒',
        'Spell-in-Waiting: Dark Fire III': '延迟咏唱：黑暗爆炎',
        'Brink of Death': '濒死',
        'Spell-in-Waiting: Unholy Darkness': '延迟咏唱：黑暗神圣',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Voidwalker': '보이드워커',
        'The Hand of Erebos': '에레보스의 팔',
      },
      'replaceText': {
        'Spell-[iI]n-Waiting': '지연술',
        'Shadowflame': '그림자 불꽃',
        'Doomvoid Guillotine': '파멸의 보이드 절단',
        'Dark Fire III': '다크 파이가',
        'Unholy Darkness': '다크 홀리',
        'Punishing Ray': '응징의 빛줄기',
        'Doomvoid Slicer': '파멸의 보이드 베기',
        'Empty Hate': '공허한 악의',
        'Shadoweye': '그림자 시선',
        'Entropy': '엔트로피',
      },
      '~effectNames': {
        'Spell-in-Waiting: Shadoweye': '지연술:그림자 시선',
        'Infirmity': '虚弱',
        'Petrification': '석화',
        'Bleeding': '출혈',
        'Diabolic Curse': '디아볼릭 커스',
        'Spell-in-Waiting: Dark Fire III': '지연술: 다크 파이가',
        'Brink of Death': '브링크 오브 데스',
        'Spell-in-Waiting: Unholy Darkness': '지연술: 다크 홀리',
      },
    },
  ],
}];
