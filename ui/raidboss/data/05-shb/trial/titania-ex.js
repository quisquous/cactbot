'use strict';

// Titania Extreme
[{
  zoneRegex: {
    en: /^The Dancing Plague \(Extreme\)$/,
    cn: /^缇坦妮雅歼殛战$/,
    ko: /^극 티타니아 토벌전$/,
  },
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitaniaEx Bright Sabbath',
      regex: Regexes.startsUsing({ id: '3D4B', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D4B', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D4B', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D4B', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D4B', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D4B', source: '티타니아', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'TitaniaEx Phantom Out',
      regex: Regexes.startsUsing({ id: '3D4C', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D4C', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D4C', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D4C', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D4C', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D4C', source: '티타니아', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'TitaniaEx Phantom In',
      regex: Regexes.startsUsing({ id: '3D4D', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D4D', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D4D', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D4D', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D4D', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D4D', source: '티타니아', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'TitaniaEx Mist Failure',
      regex: Regexes.addedCombatant({ name: 'Spirit Of Dew', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Wasserfee', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Esprit Des Rosées', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '水の精', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '水精', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '물의 정령', capture: false }),
      response: Responses.killExtraAdd(),
    },
    {
      id: 'TitaniaEx Mist',
      regex: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D45', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D45', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D45', source: '티타니아', capture: false }),
      infoText: function(data) {
        if (data.seenMistRune) {
          return {
            en: 'In/Out, then Water Positions',
            de: 'Rein/Raus, danach Wasser Positionen',
            ja: '中/外避けてポジションへ',
            fr: 'Dedans/Dehors puis position pour l\'eau',
            cn: '靠近/远离, 水圈站位',
            ko: '안/밖 -> 물 장판 위치',
          };
        }
        return {
          en: 'Water Positions',
          de: 'Wasser Positionen',
          ja: 'ポジションへ',
          fr: 'Position pour l\'eau',
          cn: '水圈站位',
          ko: '물 장판',
        };
      },
      run: function(data) {
        data.seenMistRune = true;
      },
    },
    {
      id: 'TitaniaEx Flame',
      regex: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D47', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D47', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D47', source: '티타니아', capture: false }),
      // You have 16.5 seconds until the first stack damage.
      delaySeconds: 8.5,
      alertText: function(data) {
        if (data.seenFlameRune) {
          return {
            en: 'Stack (maybe rotate?)',
            de: 'Sammeln (evtl rotieren?)',
            ja: 'シェア (多分時計回り?)',
            fr: 'Packez-vous (rotation ?)',
            cn: '左右集合 (可能旋转?)',
            ko: '쉐어징 모이기',
          };
        }
        return {
          en: 'Stack Positions',
          de: 'Sammel-Positionen',
          ja: 'シェア',
          fr: 'Packez-vous',
          cn: '左右集合',
          ko: '쉐어징 모이기',
        };
      },
      run: function(data) {
        data.seenFlameRune = true;
      },
    },
    {
      id: 'TitaniaEx Divination',
      regex: Regexes.startsUsing({ id: '3D4A', source: 'Titania' }),
      regexDe: Regexes.startsUsing({ id: '3D4A', source: 'Titania' }),
      regexFr: Regexes.startsUsing({ id: '3D4A', source: 'Titania' }),
      regexJa: Regexes.startsUsing({ id: '3D4A', source: 'ティターニア' }),
      regexCn: Regexes.startsUsing({ id: '3D4A', source: '缇坦妮雅' }),
      regexKo: Regexes.startsUsing({ id: '3D4A', source: '티타니아' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'TitaniaEx Bramble 1',
      regex: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '42D7', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '42D7', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '42D7', source: '티타니아', capture: false }),
      infoText: {
        en: 'Wait For Tethers In Center',
        de: 'Auf die Verbindung in der Mitte warten',
        ja: '中央で待機',
        fr: 'Attente des liens au centre',
        cn: '中间集合等待荆棘',
        ko: '가시 연결되기 전에 중앙으로',
      },
    },
    {
      id: 'TitaniaEx Bramble 2',
      regex: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '42D7', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '42D7', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '42D7', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '42D7', source: '티타니아', capture: false }),
      delaySeconds: 3,
      response: Responses.move('alert'),
    },
    {
      id: 'TitaniaEx Bramble Knockback',
      regex: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexDe: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexFr: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexJa: Regexes.ability({ id: '3D42', source: 'パック', capture: false }),
      regexCn: Regexes.ability({ id: '3D42', source: '帕克', capture: false }),
      regexKo: Regexes.ability({ id: '3D42', source: '요정의 권속', capture: false }),
      alertText: {
        en: 'Diagonal Knockback Soon',
        de: 'diagonaler Knockback bald',
        ja: '対角に飛ぶ',
        fr: 'Poussée en diagonale bientôt',
        cn: '对角击退准备',
        ko: '곧 대각선 넉백',
      },
    },
    {
      id: 'TitaniaEx Fae Light',
      regex: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexDe: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexFr: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexJa: Regexes.startsUsing({ id: '3D2C', source: 'ティターニア' }),
      regexCn: Regexes.startsUsing({ id: '3D2C', source: '缇坦妮雅' }),
      regexKo: Regexes.startsUsing({ id: '3D2C', source: '티타니아' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'TitaniaEx Fae Light Cleave',
      regex: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexDe: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexFr: Regexes.startsUsing({ id: '3D2C', source: 'Titania' }),
      regexJa: Regexes.startsUsing({ id: '3D2C', source: 'ティターニア' }),
      regexCn: Regexes.startsUsing({ id: '3D2C', source: '缇坦妮雅' }),
      regexKo: Regexes.startsUsing({ id: '3D2C', source: '티타니아' }),
      condition: function(data) {
        return data.role != 'tank' && data.role != 'healer';
      },
      response: Responses.tankCleave('info'),
    },
    {
      id: 'TitaniaEx Frost Rune 1',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      infoText: {
        en: 'Get Middle, Shiva Circles',
        de: 'In die Mitte, Shiva Kreise',
        ja: 'シヴァの輪っか',
        fr: 'Allez au milieu, comme sur Shiva',
        cn: '中间集合, 九连环',
        ko: '시바 얼음 장판',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 2',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      delaySeconds: 6.5,
      response: Responses.getOut('info'),
    },
    {
      id: 'TitaniaEx Frost Rune 3',
      regex: Regexes.ability({ id: '3D2B', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D2B', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D2B', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D2B', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D2B', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D2B', source: '티타니아', capture: false }),
      suppressSeconds: 60,
      response: Responses.getIn('info'),
    },
    {
      id: 'TitaniaEx Growth Rune',
      regex: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2E', source: '티타니아', capture: false }),
      infoText: {
        en: 'Roots',
        de: 'Ranken',
        ja: '根のルーン',
        fr: 'Racines',
        cn: '根系生长',
        ko: '뿌리 나옴',
      },
    },
    {
      id: 'TitaniaEx Uplift Markers',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'TitaniaEx Hard Swipe',
      regex: Regexes.startsUsing({ id: '3D36', source: 'Peaseblossom' }),
      regexDe: Regexes.startsUsing({ id: '3D36', source: 'Bohnenblüte' }),
      regexFr: Regexes.startsUsing({ id: '3D36', source: 'Fleur-De-Pois' }),
      regexJa: Regexes.startsUsing({ id: '3D36', source: 'ピーズブロッサム' }),
      regexCn: Regexes.startsUsing({ id: '3D36', source: '豌豆花' }),
      regexKo: Regexes.startsUsing({ id: '3D36', source: '콩나무' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.tankBuster('info'),
    },
    {
      id: 'TitaniaEx Pummel',
      regex: Regexes.startsUsing({ id: '3D37', source: 'Puck', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D37', source: 'Puck', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D37', source: 'Puck', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D37', source: 'パック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D37', source: '帕克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D37', source: '요정의 권속', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      preRun: function(data) {
        data.pummelCount = data.pummelCount || 0;
        data.pummelCount++;
      },
      infoText: function(data) {
        return {
          en: 'Pummel ' + data.pummelCount,
          de: 'Deftige Dachtel ' + data.pummelCount,
          ja: '殴打 ' + data.pummelCount,
          fr: 'Torgnole ' + data.pummelCount,
          cn: '殴打 ' + data.pummelCount,
          ko: '구타 ' + data.pummelCount,
        };
      },
    },
    {
      id: 'TitaniaEx Peasebomb',
      regex: Regexes.headMarker({ id: '008D' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
      run: function(data) {
        data.bomb = data.bomb || {};
        data.bomb[data.me] = true;
      },
    },
    {
      id: 'TitaniaEx Peasebomb Use',
      regex: Regexes.ability({ id: '3D3F', source: 'Peaseblossom', capture: false }),
      regexDe: Regexes.ability({ id: '3D3F', source: 'Bohnenblüte', capture: false }),
      regexFr: Regexes.ability({ id: '3D3F', source: 'Fleur-De-Pois', capture: false }),
      regexJa: Regexes.ability({ id: '3D3F', source: 'ピーズブロッサム', capture: false }),
      regexCn: Regexes.ability({ id: '3D3F', source: '豌豆花', capture: false }),
      regexKo: Regexes.ability({ id: '3D3F', source: '콩나무', capture: false }),
      run: function(data) {
        delete data.bomb;
      },
    },
    {
      id: 'TitaniaEx Adds Stack',
      regex: Regexes.headMarker({ id: '00A1' }),
      delaySeconds: 0.25,
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }

        if (data.bomb && data.bomb[data.me])
          return;

        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ko: '"' + data.ShortName(matches.target) + '"에게 모이기',
        };
      },
    },
    {
      id: 'TitaniaEx Thunder Tether',
      regex: Regexes.tether({ id: '0054', source: 'Titania', capture: false }),
      regexDe: Regexes.tether({ id: '0054', source: 'Titania', capture: false }),
      regexFr: Regexes.tether({ id: '0054', source: 'Titania', capture: false }),
      regexJa: Regexes.tether({ id: '0054', source: 'ティターニア', capture: false }),
      regexCn: Regexes.tether({ id: '0054', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.tether({ id: '0054', source: '티타니아', capture: false }),
      suppressSeconds: 60,
      alertText: {
        en: 'Initial Thunder Tether',
        de: 'initiale Blitz Verbindung',
        ja: '線一人目',
        fr: 'Lien de foudre initial',
        cn: '初始雷连线',
        ko: '첫 번개 징 대상자',
      },
    },
    {
      id: 'TitaniaEx Thunder Rune',
      regex: Regexes.ability({ id: '3D29', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D29', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D29', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D29', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D29', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D29', source: '티타니아', capture: false }),
      preRun: function(data) {
        data.thunderCount = data.thunderCount || 1;
      },
      suppressSeconds: 1,
      infoText: function(data) {
        return {
          en: 'Thunder ' + data.thunderCount,
          de: 'Blitz ' + data.thunderCount,
          ja: '線' + data.thunderCount + '人目',
          fr: 'Foudre ' + data.thunderCount,
          cn: '雷连线 #' + data.thunderCount,
          ko: data.thunderCount + '번째 번개',
        };
      },
      run: function(data) {
        data.thunderCount++;
      },
    },
    {
      id: 'TitaniaEx Thunder Cleanup',
      regex: Regexes.startsUsing({ id: '3D32', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D32', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D32', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D32', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D32', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D32', source: '티타니아', capture: false }),
      run: function(data) {
        delete data.thunderCount;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Spirit of Flame': 'Feuerfee',
        'Spirit of Wood': 'Holzfee',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Bohnenblüte',
        'Mustardseed': 'Senfsamen',
      },
      'replaceText': {
        'Wood\'s Embrace': 'Umarmung des Waldes',
        'Whispering Wind': 'Flüsternde Winde',
        'War and Pease': 'Bohnenkrieg',
        'Wallop': 'Eindreschen',
        'Uplift': 'Feenring',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': 'Donnerrune',
        'Pummel': 'Deftige Dachtel',
        'Puck\'s Rebuke': 'Pucks Tadel',
        'Puck\'s Caprice': 'Pucks Laune',
        'Puck\'s Breath': 'Pucks Atem',
        'Phantom Rune(?! )': 'Phantomrune',
        'Peasebomb': 'Bohnenbombe',
        '(?<! )Pease(?!\\w)': 'Bohne',
        'Mist Rune': 'Nebelrune',
        'Midsummer Night\'s Dream': 'Mittsommernachtstraum',
        'Love-in-Idleness': 'Liebevoller Müßiggang',
        'Leafstorm': 'Blättersturm',
        'Hard Swipe': 'Harter Hieb',
        'Growth Rune': 'Wachstumsrune',
        'Gentle Breeze': 'Sanfte Brise',
        'Frost Rune': 'Frostrune',
        'Flame Rune': 'Flammenrune',
        'Flame Hammer': 'Flammenhammer',
        'Fae Light': 'Feenlicht',
        'Divination Rune': 'Prophezeiungsrune',
        'Chain Of Brambles': 'Dornenfessel',
        'Bright Sabbath': 'Leuchtender Sabbat',
        'Being Mortal': 'Sterblichkeit',
        'Love-In-Idleness': 'Liebevoller Müßiggang',
        'War And Pease': 'Bohnenkrieg',
        'Phantom Rune In': 'Phantomrune Rein',
        'Phantom Rune Out': 'Phantomrune Raus',
      },
      '~effectNames': {
        'Thorny Vine': 'Dornenranken',
        'Summon Order': 'Egi-Attacke I',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Fire Resistance Up': 'Feuerresistenz +',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Embolden': 'Ermutigen',
        'Blunt Resistance Down': 'Schlagresistenz -',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'spirit of flame': 'Esprit Des Flammes',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Fleur-de-pois',
        'Mustardseed': 'Pousse-de-moutarde',
        'Innocence': 'Innocence',
      },
      'replaceText': {
        'Wood\'s Embrace': 'Étreinte de la nature',
        'Whispering Wind': 'Vent susurrant',
        'War and Pease': 'La fin des haricots',
        'Wallop': 'Rossée',
        'Uplift': 'Exhaussement',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': 'Rune de foudre',
        'Pummel': 'Torgnole',
        'Puck\'s Rebuke': 'Réprimande de Puck',
        'Puck\'s Caprice': 'Toquade de Puck',
        'Puck\'s Breath': 'Haleine de Puck',
        'Phantom Rune(?! )': 'Rune d\'illusion',
        'Peasebomb': 'Haricot explosif',
        '(?<! )Pease(?!\\w)': 'Explosion de haricot',
        'Mist Rune': 'Rune d\'eau',
        'Midsummer Night\'s Dream': 'Songe d\'une nuit d\'été',
        'Love-in-Idleness': 'Pensées sauvages',
        'Leafstorm': 'Tempête de feuilles',
        'Hard Swipe': 'Fauchage brutal',
        'Growth Rune': 'Rune de racine',
        'Gentle Breeze': 'Douce brise',
        'Frost Rune': 'Rune de gel',
        'Flame Rune': 'Rune de feu',
        'Flame Hammer': 'Marteau de feu',
        'Fae Light': 'Lueur féérique',
        'Divination Rune': 'Rune de malice',
        'Chain Of Brambles': 'Chaînes de ronces',
        'Bright Sabbath': 'Sabbat en plein jour',
        'Being Mortal': 'Deuil des vivants',
      },
      '~effectNames': {
        'Thorny Vine': 'Sarment De Ronces',
        'Summon Order': 'Action en attente: 1',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Fire Resistance Up': 'Résistance Au Feu Accrue',
        'Fire Resistance Down II': 'Résistance au feu réduite+',
        'Embolden': 'Enhardissement',
        'Blunt Resistance Down': 'Résistance Au Contondant Réduite',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Spirit of Flame': '火の精',
        'Spirit of Wood': '木の精',
        'Titania': 'ティターニア',
        'Puck': 'パック',
        'Peaseblossom': 'ピーズブロッサム',
        'Mustardseed': 'マスタードシード',
        'Innocence': 'イノセンス',
      },
      'replaceText': {
        'Wood\'s Embrace': '絡みつき',
        'Whispering Wind': 'ウィスパリング・ウィンド',
        'War and Pease': '大豆爆発',
        'Wallop': '叩きつけ',
        'Uplift': '隆起',
        'Thunder Rune': '雷のルーン',
        'Pummel': '殴打',
        'Puck\'s Rebuke': 'パックレビューク',
        'Puck\'s Caprice': 'パック・カプリース',
        'Puck\'s Breath': 'パック・ブレス',
        'Phantom Rune In': '幻のルーン（中央）',
        'Phantom Rune Out': '幻のルーン（外）',
        'Phantom Rune(?! )': '幻のルーン',
        'Peasebomb': 'ビーズボム',
        '(?<! )Pease(?!\\w)': '豆爆発',
        'Mist Rune': '水のルーン',
        'Midsummer Night\'s Dream': 'ミッドサマー・ナイツドリーム',
        'Love-In-Idleness': 'ラブ・イン・アイドルネス',
        'Leafstorm': 'リーフストーム',
        'Hard Swipe': 'ハードスワイプ',
        'Growth Rune': '根のルーン',
        'Gentle Breeze': '上風',
        'Frost Rune': '氷のルーン',
        'Flame Rune': '火のルーン',
        'Flame Hammer': 'フレイムハンマー',
        'Fae Light': '妖精光',
        'Divination Rune': '魔のルーン',
        'Chain Of Brambles': 'ブランブルチェーン',
        'Bright Sabbath': 'ブライトサバト',
        'Being Mortal': '死すべき定め',
      },
      '~effectNames': {
        'Thorny Vine': '茨の蔓',
        'Summon Order': 'アクション実行待機I',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Fire Resistance Up': '火属性耐性向上',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'Embolden': 'エンボルデン',
        'Blunt Resistance Down': '打属性耐性低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'spirit of flame': '炎精',
        'Spirit of Flame': '炎精',
        'Spirit of Wood': '木精',
        'Titania': '缇坦妮雅',
        'Puck': '帕克',
        'Peaseblossom': '豌豆花',
        'Mustardseed': '芥子',
        'Innocence': '无瑕灵君',
      },
      'replaceText': {
        'Wood\'s Embrace': '缠绕',
        'Whispering Wind': '细语微风',
        'War And Pease': '豌豆大爆炸',
        'War and Pease': '豌豆大爆炸',
        'Wallop': '敲击',
        'Uplift': '隆起',
        'Thunder Rune': '雷之符文',
        'Pummel': '殴打',
        'Puck\'s Rebuke': '帕克的指责',
        'Puck\'s Caprice': '帕克的随想',
        'Puck\'s Breath': '帕克的吐息',
        'Phantom Rune In': '幻之符文靠近',
        'Phantom Rune Out': '幻之符文远离',
        'Phantom Rune(?! )': '幻之符文',
        'Peasebomb': '豌豆炸弹',
        '(?<! )Pease(?!\\w)': '豌豆爆炸',
        'Mist Rune': '水之符文',
        'Midsummer Night\'s Dream': '仲夏夜之梦',
        'Love-in-Idleness': '爱懒花',
        'Love-In-Idleness': '爱懒花',
        'Leafstorm': '绿叶风暴',
        'Hard Swipe': '强烈重击',
        'Growth Rune': '根之符文',
        'Gentle Breeze': '青翠柔风',
        'Frost Rune': '冰之符文',
        'Flame Rune': '火之符文',
        'Flame Hammer': '烈火锤',
        'Fae Light': '妖灵光',
        'Divination Rune': '魔之符文',
        'Chain Of Brambles': '荆棘链',
        'Bright Sabbath': '欢快的安息日',
        'Being Mortal': '终有一死',
      },
      '~effectNames': {
        'Thorny Vine': '荆棘丛生',
        'Summon Order': '发动技能待命I',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Fire Resistance Up': '火属性耐性提升',
        'Fire Resistance Down II': '火属性耐性大幅降低',
        'Embolden': '鼓励',
        'Blunt Resistance Down': '打击耐性降低',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Spirit of Flame': '불의 정령',
        'Titania': '티타니아',
        'Puck': '요정의 권속',
        'Peaseblossom': '콩나무',
        'Mustardseed': '겨자씨',
      },
      'replaceText': {
        'Wood\'s Embrace': '휘감기',
        'Whispering Wind': '속삭이는 바람',
        'War and Pease': '큰콩 폭발',
        'Wallop': '매질',
        'Uplift': '융기',
        'Thunder Rune': '번개의 룬',
        'Pummel': '구타',
        'Puck\'s Rebuke': '요정의 꾸지람',
        'Puck\'s Caprice': '요정의 변덕',
        'Puck\'s Breath': '요정의 숨결',
        'Phantom Rune(?! )': '환상의 룬',
        'Phantom Rune In': '환상의 룬 안으로',
        'Phantom Rune Out': '환상의 룬 밖으로',
        'Peasebomb': '콩폭탄',
        '(?<! )Pease(?!\\w)': '콩 폭발',
        'Mist Rune': '물의 룬',
        'Midsummer Night\'s Dream': '한여름 밤의 꿈',
        'Love-in-Idleness': '삼색제비꽃',
        'Leafstorm': '잎사귀 폭풍',
        'Hard Swipe': '강력한 후려치기',
        'Growth Rune': '뿌리의 룬',
        'Gentle Breeze': '윗바람',
        'Frost Rune': '얼음의 룬',
        'Flame Rune': '불의 룬',
        'Flame Hammer': '불꽃 망치',
        'Fae Light': '요정광',
        'Divination Rune': '마법의 룬',
        'Chain Of Brambles': '나무딸기 사슬',
        'Bright Sabbath': '빛나는 안식',
        'Being Mortal': '죽어야 할 운명',
        ' Middle': ' (중앙)',
      },
      '~effectNames': {
        'Thorny Vine': '가시덩굴',
        'Summon Order': '기술 실행 대기 1',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Fire Resistance Up': '불속성 저항 상승',
        'Fire Resistance Down II': '불속성 저항 감소[강]',
        'Embolden': '성원',
        'Blunt Resistance Down': '타격 저항 감소',
      },
    },
  ],
}];
