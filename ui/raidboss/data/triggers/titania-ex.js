'use strict';

// Titania Extreme
[{
  zoneRegex: /The Dancing Plague \(Extreme\)/,
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitaniaEx Bright Sabbath',
      regex: /14:3D4B:Titania starts using Bright Sabbath/,
      regexFr: /14:3D4B:Titania starts using Sabbat En Plein Jour/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TitaniaEx Phantom Out',
      regex: /14:3D4C:Titania starts using Phantom Rune/,
      regexFr: /14:3D4C:Titania starts using Rune D'illusion/,
      alertText: {
        en: 'Out',
        fr: 'Dehors',
      },
    },
    {
      id: 'TitaniaEx Phantom In',
      regex: /14:3D4D:Titania starts using Phantom Rune/,
      regexFr: /14:3D4D:Titania starts using Rune D'illusion/,
      alertText: {
        en: 'In',
        fr: 'Dedans',
      },
    },
    {
      id: 'TitaniaEx Mist Failure',
      regex: /03:\y{ObjectId}:Added new combatant Spirit Of Dew\./,
      regexFr: /03:\y{ObjectId}:Added new combatant Esprit Des Rosées\./,
      infoText: {
        en: 'Kill Extra Add',
        fr: 'Tuez l\'add',
      },
    },
    {
      id: 'TitaniaEx Mist',
      regex: /14:3D45:Titania starts using Mist Rune/,
      regexFr: /14:3D45:Titania starts using Rune D'eau/,
      infoText: function(data) {
        if (data.seenMistRune) {
          return {
            en: 'In/Out, then Water Positions',
            fr: 'Dedans/Dehors puis dans l\'eau',
          };
        }
        return {
          en: 'Water Positions',
          fr: 'Dans l\'eau',
        };
      },
      run: function(data) {
        data.seenMistRune = true;
      },
    },
    {
      id: 'TitaniaEx Flame',
      regex: /14:3D47:Titania starts using Flame Rune/,
      regexFr: /14:3D47:Titania starts using Rune De Feu/,
      // You have 16.5 seconds until the first stack damage.
      delaySeconds: 8.5,
      alertText: function(data) {
        if (data.seenFlameRune) {
          return {
            en: 'Stack (maybe rotate?)',
            fr: 'Packez-vous (rotation ?)',
          };
        }
        return {
          en: 'Stack Positions',
          fr: 'Packez-vous',
        };
      },
      run: function(data) {
        data.seenFlameRune = true;
      },
    },
    {
      id: 'TitaniaEx Divination',
      regex: /14:3D4A:Titania starts using Divination Rune on (\y{Name})/,
      regexFr: /14:3D4A:Titania starts using Rune De Malice on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            fr: 'Tank cleave sur vous',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches[1]),
            fr: 'Tank cleave sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'TitaniaEx Bramble 1',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      regexFr: /14:42D7:Titania starts using Chaînes De Ronces/,
      infoText: {
        en: 'Wait For Tethers In Center',
        fr: 'Attente des liens au centre',
      },
    },
    {
      id: 'TitaniaEx Bramble 2',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      regexFr: /14:42D7:Titania starts using Chaînes De Ronces/,
      delaySeconds: 3,
      alertText: {
        en: 'Run!',
        fr: 'Courez !',
      },
    },
    {
      id: 'TitaniaEx Bramble Knockback',
      regex: /15:\y{ObjectId}:Puck:3D42:Puck's Rebuke/,
      regexFr: /15:\y{ObjectId}:Puck:3D42:Réprimande De Puck/,
      alertText: {
        en: 'Diagonal Knockback Soon',
        fr: 'Poussée en diagonale bientôt',
      },
    },
    {
      id: 'TitaniaEx Fae Light',
      regex: /14:3D2C:Titania starts using Fae Light/,
      regexFr: /14:3D2C:Titania starts using Lueur Féérique/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Tank Cleave',
            fr: 'Tank cleave',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Frost Rune 1',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      regexFr: /14:3D2A:Titania starts using Rune De Gel/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
        fr: 'Allez au milieu, comme sur Shiva',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 2',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      regexFr: /14:3D2A:Titania starts using Rune De Gel/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
        fr: 'Allez à l\'extérieur',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 3',
      regex: /1[56]:\y{ObjectId}:Titania:3D2B:Frost Rune:/,
      regexFr: /1[56]:\y{ObjectId}:Titania:3D2B:Rune De Gel:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'TitaniaEx Growth Rune',
      regex: /14:3D2E:Titania starts using Growth Rune/,
      regexFr: /14:3D2E:Titania starts using Rune De Racine/,
      infoText: {
        en: 'Roots',
        fr: 'Racines',
      },
    },
    {
      id: 'TitaniaEx Uplift Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'TitaniaEx Hard Swipe',
      regex: /14:3D36:Peaseblossom starts using Hard Swipe on (\y{Name})/,
      regexFr: /14:3D36:Fleur-De-Pois starts using Fauchage Brutal on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'TitaniaEx Pummel',
      regex: /14:3D37:Puck starts using Pummel on (\y{Name})/,
      regexFr: /14:3D37:Puck starts using Torgnole on (\y{Name})/,
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
          fr: 'Torgnole ' + data.pummelCount,
        };
      },
    },
    {
      id: 'TitaniaEx Peasebomb',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00BD:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
      run: function(data) {
        data.bomb = data.bomb || {};
        data.bomb[data.me] = true;
      },
    },
    {
      id: 'TitaniaEx Peasebomb Use',
      regex: /1[56]:\y{ObjectId}:Peaseblossom:3D3F:Peasebomb/,
      regexFr: /1[56]:\y{ObjectId}:Fleur-de-pois:3D3F:Haricot Explosif/,
      run: function(data) {
        delete data.bomb;
      },
    },
    {
      id: 'TitaniaEx Adds Stack',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00A1:/,
      delaySeconds: 0.25,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            fr: 'Package sur VOUS',
          };
        }

        if (data.bomb && data.bomb[data.me])
          return;

        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Package sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'TitaniaEx Thunder Tether',
      regex: /23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      suppressSeconds: 60,
      alertText: {
        en: 'Initial Thunder Tether',
        fr: 'Lien de foudre initial',
      },
    },
    {
      id: 'TitaniaEx Thunder Rune',
      regex: /1[56]:\y{ObjectId}:Titania:3D29:Thunder Rune:/,
      regexFr: /1[56]:\y{ObjectId}:Titania:3D29:Rune De Foudre:/,
      preRun: function(data, matches) {
        data.thunderCount = data.thunderCount || 1;
      },
      suppressSeconds: 1,
      infoText: function(data) {
        return {
          en: 'Thunder ' + data.thunderCount,
          fr: 'Foudre ' + data.thunderCount,
        };
      },
      run: function(data, matches) {
        data.thunderCount++;
        data.thunderTime = matches[1];
      },
    },
    {
      id: 'TitaniaEx Thunder Cleanup',
      regex: /14:3D32:Titania starts using Being Mortal/,
      regexFr: /14:3D32:Titania starts using Deuil Des Vivants/,
      run: function(data) {
        delete data.thunderCount;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'spirit of flame': 'Feuerfee',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Bohnenblüte',
        'Mustardseed': 'Senfsamen',
        'Innocence': 'Innozenz',
        'Engage!': 'Start!',
      },
      'replaceText': {
        'attack': 'Attacke',
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
        'Phantom Rune': 'Phantomrune',
        'Peasebomb': 'Bohnenbombe',
        'Pease': 'Bohne',
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
        'Enrage': 'Finalangriff',
        'Divination Rune': 'Prophezeiungsrune',
        'Chain of Brambles': 'Dornenfessel',
        'Bright Sabbath': 'Leuchtender Sabbat',
        'Being Mortal': 'Sterblichkeit',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
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
      'replaceSync': {
        'spirit of flame': 'Esprit Des Flammes',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Fleur-de-pois',
        'Mustardseed': 'Pousse-de-moutarde',
        'Innocence': 'Innocence',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
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
        'Phantom Rune': 'Rune d\'illusion',
        'Peasebomb': 'Haricot explosif',
        'Pease': 'Explosion de haricot',
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
        'Enrage': 'Enrage',
        'Divination Rune': 'Rune de malice',
        'Chain of Brambles': 'Chaînes de ronces',
        'Bright Sabbath': 'Sabbat en plein jour',
        'Being Mortal': 'Deuil des vivants',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
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
        'spirit of flame': '火の精',
        'Titania': 'ティターニア',
        'Puck': 'パック',
        'Peaseblossom': 'ピーズブロッサム',
        'Mustardseed': 'マスタードシード',
        'Innocence': 'イノセンス',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'attack': '攻撃',
        'Wood\'s Embrace': '絡みつき',
        'Whispering Wind': 'ウィスパリング・ウィンド',
        'War and Pease': '大豆爆発',
        'Wallop': '叩きつけ',
        'Uplift': '隆起',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': '雷のルーン',
        'Pummel': '殴打',
        'Puck\'s Rebuke': 'パックレビューク',
        'Puck\'s Caprice': 'パック・カプリース',
        'Puck\'s Breath': 'パック・ブレス',
        'Phantom Rune': '幻のルーン',
        'Peasebomb': 'ビーズボム',
        'Pease': '豆爆発',
        'Mist Rune': '水のルーン',
        'Midsummer Night\'s Dream': 'ミッドサマー・ナイツドリーム',
        'Love-in-Idleness': 'ラブ・イン・アイドルネス',
        'Leafstorm': 'リーフストーム',
        'Hard Swipe': 'ハードスワイプ',
        'Growth Rune': '根のルーン',
        'Gentle Breeze': '上風',
        'Frost Rune': '氷のルーン',
        'Flame Rune': '火のルーン',
        'Flame Hammer': 'フレイムハンマー',
        'Fae Light': '妖精光',
        'Divination Rune': '魔のルーン',
        'Chain of Brambles': 'ブランブルチェーン',
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
        'spirit of flame': '',
        'Titania': '',
        'Puck': '',
        'Peaseblossom': '',
        'Mustardseed': '',
        'Innocence': '',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
        'Wood\'s Embrace': '',
        'Whispering Wind': '',
        'War and Pease': '',
        'Wallop': '',
        'Uplift': '',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': '',
        'Pummel': '',
        'Puck\'s Rebuke': '',
        'Puck\'s Caprice': '',
        'Puck\'s Breath': '',
        'Phantom Rune': '',
        'Peasebomb': '',
        'Pease': '',
        'Mist Rune': '',
        'Midsummer Night\'s Dream': '',
        'Love-in-Idleness': '',
        'Leafstorm': '',
        'Hard Swipe': '',
        'Growth Rune': '',
        'Gentle Breeze': '',
        'Frost Rune': '',
        'Flame Rune': '',
        'Flame Hammer': '',
        'Fae Light': '',
        'Divination Rune': '',
        'Chain of Brambles': '',
        'Bright Sabbath': '',
        'Being Mortal': '',
      },
      '~effectNames': {
        'Thorny Vine': '荆棘丛生',
        'Summon Order': '',
        'Lightning Resistance Down II': '',
        'Fire Resistance Up': '火属性耐性提升',
        'Fire Resistance Down II': '',
        'Embolden': '鼓励',
        'Blunt Resistance Down': '打击耐性降低',
      },
    },
  ],
}];
