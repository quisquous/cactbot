'use strict';

// The Grand Cosmos

[{
  zoneRegex: /^The Grand Cosmos$/,
  timelineFile: 'the_grand_cosmos.txt',
  triggers: [
    {
      id: 'Cosmos Shadowbolt',
      regex: / 14:4769:Seeker Of Solitude starts using Shadowbolt on (\y{Name})/,
      regexFr: / 14:4769:Ermite du palais starts using Éclair Ombreux on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Dark Pulse',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches[1]),
          cn: '靠近 ' + data.ShortName(matches[1]) + '集合',
        };
      },
    },
    {
      id: 'Cosmos Dark Well Far Winds',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Immortal Anathema',
      regex: / 14:49A3:Seeker Of Solitude starts using Immortal Anathema/,
      regexFr: / 14:49A3:Ermite du palais starts using Anathème Immortel/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'Cosmos Tribulation',
      regex: / 14:476B:Seeker Of Solitude starts using Tribulation/,
      regexFr: / 14:476B:Ermite du palais starts using Tribulation/,
      delaySeconds: 8,
      alertText: {
        en: 'Avoid Brooms',
        fr: 'Evitez les balais',
      },
    },
    {
      id: 'Cosmos Storm of Color',
      regex: / 14:471B:Leannan Sith starts using Storm Of Color on (\y{Name})/,
      regexFr: / 14:471B:Leannan Sith starts using Orage De Printemps on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Ode To Lost Love',
      regex: / 14:471C:Leannan Sith starts using Ode To Lost Love/,
      regexFr: / 14:471C:Leannan Sith starts using Rhapsodie De L'amour Fou/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      // Can't use added combatant here as all these adds exist.
      // So, just trigger on first auto.
      id: 'Cosmos Direct Seeding Mistake',
      regex: / 15:\y{ObjectId}:Lover's Ring:368:/,
      regexFr: / 15:\y{ObjectId}:Bague de l'amoureux:368:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Kill Extra Add',
        de: 'Add angreifen',
        ja: '水の精倒して',
        fr: 'Tuez l\'add',
        cn: '击杀小怪',
      },
    },
    {
      id: 'Cosmos Gardener\'s Hymn',
      regex: / 14:471E:Leannan Sith starts using Gardener's Hymn/,
      regexFr: / 14:471E:Leannan Sith starts using Ballade Du Bourgeonnement/,
      infoText: {
        en: 'put seeds on dirt',
        fr: 'Placez les graines sur la terre',
      },
    },
    {
      id: 'Cosmos Ronkan Cure II',
      regex: / 14:4931:Ser Hamonth starts using Ronkan Cure II/,
      regexFr: / 14:4931:Ser Hamonth starts using Extra Soin Ronka/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Hamonth',
        fr: 'Etoudissez Hamonth',
      },
    },
    {
      id: 'Cosmos Captive Bolt',
      regex: / 14:4764:Lugus starts using Captive Bolt on (\y{Name})/,
      regexFr: / 14:4764:Lugus starts using Lame Pulvérisante on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Culling Blade',
      regex: / 14:4765:Lugus starts using Culling Blade/,
      regexFr: / 14:4765:Lugus starts using Lame Percutante/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'Cosmos Black Flame 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0019:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Black Flame 2',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0019:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 4,
      infoText: {
        en: 'Dodge Crosses',
        fr: 'Evitez les croix',
      },
    },
    {
      id: 'Cosmos Mortal Flame 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C3:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Mortal Flame 2',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C3:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 5.5,
      infoText: {
        en: 'Touch Furniture',
        fr: 'Touchez un élément de décor',
      },
    },
    {
      id: 'Cosmos Scorching Left',
      regex: / 14:4763:Lugus starts using Scorching Left/,
      regexFr: / 14:4763:Lugus starts using Scrutement Senestre/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Cosmos Scorching Right',
      regex: / 14:4762:Lugus starts using Scorching Right/,
      regexFr: / 14:4762:Lugus starts using Scrutement Dextre/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Cosmos Fire\'s Domain',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003[2345]:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      preRun: function(data) {
        data.firesDomain = (data.firesDomain || 0) + 1;
      },
      infoText: function(data) {
        if (data.firesDomain == 1) {
          return {
            en: 'Point Tether Away From Furniture',
            fr: 'Placez le liens loin des décors',
          };
        }
        return {
          en: 'Tether on YOU',
          fr: 'Lien sur vous',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      '~effectNames': {
        'Slow': 'Gemach',
        'Bleeding': 'Blutung',
        'Transporting': 'Transport',
        'Mortal Flame': 'Ewige Flammen',
        'Poison': 'Gift',
        'Heavy': 'Gewicht',
        'Stun': 'Betäubung',
      },
      'replaceSync': {
        'Engage!': 'Start!',
      },
      'replaceText': {
        'Ode to Lost Love': 'Unerwiderte Liebe',
        '--untargetable--': '--nich anvisierbar--',
        'Peerless Valor': 'Heldenmut Seiner Majestät',
        'Tribulation': 'Schwermütiges Zaudern',
        'Fast Blade': 'Vortexschnitt',
        'Mortal Flame': 'Ewige Flammen',
        'Brewing Storm': 'Aufziehender Sturm',
        'Plummet': 'Abfallen',
        'Fire\'s Domain': 'Heißer Höllensturm',
        'Heavy Shot': 'Gewaltiger Schuss',
        'Fire Breath': 'Feueratem',
        'Dark Shock': 'Angriff aus dem Dunkeln',
        'Unparalleled Glory': 'Ruhm Seiner Majestät',
        'Cloudcover': 'Wolkendecke',
        'Whirl of Rage': 'Zornessturm',
        'Iron Justice': 'Eiserne Gerechtigkeit',
        'Fire\'s Ire': 'Holistisches Höllenfeuer',
        'True Thrust': 'Sauberer Stoß',
        'Otherworldly Heat': 'Sengendes Seelenbrennen',
        'Scorching Left': 'Linker Höllenhieb',
        'Acid Mist': 'Säurenebel',
        'Enrage': 'Finalangriff',
        'Black Flame': 'Finsterer Flammenwind',
        'Toxic Spout': 'Giftiger Ausstoß',
        'Storm of Color': 'Frühlingssturm',
        'Direct Seeding': 'Bedecktbesamung',
        'Dark Well': 'Dunkles Bersten',
        'Overpower': 'Kahlrodung',
        'Shadowbolt': 'Schattenramme',
        'Captive Bolt': 'Schmetterklinge',
        'Dark Pulse': 'Dunkle Welle',
        'attack': 'Attacke',
        'Immortal Anathema': 'Ewiger Bannfluch',
        'Culling Blade': 'Schockschnitt',
        'Bloody Caress': 'Vampirranke',
        'Deep Clean': 'Großes Reinemachen',
        'Movement Magick': 'Transportzauber',
        'Ode to Far Winds': 'Stimme des hellen Sturms',
        '--targetable--': '--anvisierbar--',
        'Ronkan Freeze': 'Ronka-Einfrieren',
        'Scorching Right': 'Rechter Höllenhieb',
        'Sweep': 'Reinemachen',
        'Smite of Rage': 'Zornesschlag',
        'Self-destruct': 'Selbstzerstörung',
        'Nepenthic Plunge': 'Nepenthischer Sturz',
        'Gardener\'s Hymn': 'Wiegenlied der Sprösslinge',
        'Tail Whip': 'Schwanzpeitsche',
        'Ronkan Cure II': 'Ronka-Vitra',
        'Ireful Wind': 'Starke Bö',
        'Ode to Fallen Petals': 'Stimme des Blumensturms',
        'Far Wind': 'Heller Sturm',
      },
    },
    {
      'locale': 'fr',
      '~effectNames': {
        'Slow': 'Lenteur',
        'Bleeding': 'Saignement',
        'Transporting': 'Chargé',
        'Mortal Flame': 'Flamme mortelle',
        'Poison': 'Poison',
        'Heavy': 'Pesanteur',
        'Stun': 'Étourdissement',
      },
      'replaceSync': {
        'Seeker Of Solitude': 'Ermite du Palais',
        'Engage!': 'À l\'attaque',
        'is no longer sealed': 'Ouverture de',
        'The Martial Court will be sealed off': 'Fermeture de La Cour martiale',
        'The Font of Quintessence will be sealed off': 'Fermeture de La Source de Quintessence',
        'The Chamber of Celestial Song will be sealed off': 'Fermeture du Chœur céleste',
      },
      'replaceText': {
        'Ode to Lost Love': 'Rhapsodie de l\'amour fou',
        '--untargetable--': '--Impossible à cibler--',
        'Peerless Valor': 'Bravoure royale',
        'Tribulation': 'Tribulation',
        'Fast Blade': 'Lame rapide',
        'Mortal Flame': 'Flamme mortelle',
        'Brewing Storm': 'Avis de tempête',
        'Plummet': 'Chute',
        'Fire\'s Domain': 'Fournaise infernale',
        'Heavy Shot': 'Tir à l\'arc puissant',
        '--sync--': '--Synchronisation--',
        'Fire Breath': 'Souffle enflammé',
        'Dark Shock': 'Onde ténébreuse',
        'Unparalleled Glory': 'Honneur royal',
        'Cloudcover': 'Couvre-nuage',
        'Whirl of Rage': 'Tourbillon de fureur',
        'Iron Justice': 'Justice de fer',
        'Fire\'s Ire': 'Étincelle infernale',
        'True Thrust': 'Percée véritable',
        'Otherworldly Heat': 'Croix de feu',
        'Scorching Left': 'Scrutement senestre',
        'Acid Mist': 'Brume acide',
        'Enrage': 'Enrage',
        'Black Flame': 'Torrent fuligineux',
        'Toxic Spout': 'Rejet toxique',
        'Storm of Color': 'Orage de printemps',
        'Direct Seeding': 'Semis direct',
        'Dark Well': 'Déflagration ténébreuse',
        'Overpower': 'Domination',
        'Shadowbolt': 'Éclair ombreux',
        'Captive Bolt': 'Lame pulvérisante',
        'Dark Pulse': 'Déluge noir',
        'attack': 'Attaque',
        'Immortal Anathema': 'Anathème immortel',
        'Culling Blade': 'Lame percutante',
        'Bloody Caress': 'Caresse sanglante',
        'Deep Clean': 'Grand nettoyage',
        'Movement Magick': 'Translation',
        'Ode to Far Winds': 'Aria de tempête',
        '--targetable--': '--Ciblable--',
        'Ronkan Freeze': 'Gel ronka',
        'Scorching Right': 'Scrutement dextre',
        'Sweep': 'Ménage',
        'Smite of Rage': 'Coup de rage',
        'Self-destruct': 'Auto-destruction',
        'Nepenthic Plunge': 'Népenthès plongeant',
        'Gardener\'s Hymn': 'Ballade du bourgeonnement',
        'Tail Whip': 'Coup caudal',
        'Ronkan Cure II': 'Extra Soin ronka',
        'Ireful Wind': 'Ouragan violent',
        '--Reset--': '--Réinitialisation--',
        'Ode to Fallen Petals': 'Mélodie florale',
        'Far Wind': 'Claire tempête',
      },
    },
    {
      'locale': 'ja',
      '~effectNames': {
        'Slow': 'スロウ',
        'Bleeding': 'ペイン',
        'Transporting': '運搬',
        'Mortal Flame': '必滅の炎',
        'Poison': '毒',
        'Heavy': 'ヘヴィ',
        'Stun': 'スタン',
      },
      'replaceSync': {
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'Ode to Lost Love': '狂愛の歌声',
        'Peerless Valor': '幻影王の武勇',
        'Tribulation': 'トリビュレーション',
        'Fast Blade': 'ファストブレード',
        'Mortal Flame': '必滅の炎',
        'Brewing Storm': 'ブルーイングストーム',
        'Plummet': '落下',
        'Fire\'s Domain': '炎獄殺',
        'Heavy Shot': 'ヘヴィショット',
        'Fire Breath': 'ファイアブレス',
        'Dark Shock': '黒の衝撃',
        'Dark Pulse': '黒の波動',
        'Cloudcover': 'クラウドカバー',
        'Whirl of Rage': '怒りの旋風',
        'Iron Justice': 'アイアンジャスティス',
        'Unparalleled Glory': '幻影王の栄光',
        'Fire\'s Ire': '炎獄閃',
        'True Thrust': 'トゥルースラスト',
        'Otherworldly Heat': '鬼炎斬',
        'Acid Mist': 'アシッドミスト',
        'Scorching Left': '左辺炎獄斬',
        'Black Flame': '黒炎流',
        'Toxic Spout': 'トキシックスパウト',
        'Storm of Color': '春嵐',
        'Direct Seeding': 'ダイレクトシーディング',
        'Dark Well': '黒の爆砕',
        'Overpower': 'オーバーパワー',
        'Shadowbolt': 'シャドウボルト',
        'Captive Bolt': '破砕斬',
        'attack': '攻撃',
        'Immortal Anathema': 'イモータルアナテーマ ',
        'Culling Blade': '衝撃斬',
        'Bloody Caress': 'ブラッディカレス',
        'Deep Clean': '大掃除',
        'Movement Magick': '転移魔法',
        'Ode to Far Winds': '晴嵐の歌声',
        'Ronkan Freeze': 'ロンカ・フリーズ',
        'Scorching Right': '右辺炎獄斬',
        'Sweep': '掃除',
        'Smite of Rage': '怒りの一撃',
        'Self-destruct': '自爆',
        'Nepenthic Plunge': 'ネペンシックプランジ',
        'Gardener\'s Hymn': '萌芽への謡',
        'Tail Whip': 'テールウィップ',
        'Ronkan Cure II': 'ロンカ・ケアルラ',
        'Ireful Wind': '強風',
        'Ode to Fallen Petals': '花嵐の歌声',
        'Far Wind': '晴嵐',
      },
    },
    {
      'locale': 'cn',
      '~effectNames': {
        'Poison': '中毒',
        'Slow': '减速',
        'Stun': '眩晕',
        'Heavy': '加重',
        'Transporting': '搬运',
      },
      'replaceSync': {
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
      },
    },
  ],
}];
