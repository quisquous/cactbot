'use strict';

// Innocence Normal
[{
  zoneRegex: /^The Crown Of The Immaculate #/,
  timelineFile: 'innocence.txt',
  triggers: [
    {
      id: 'Inno Realmrazer',
      regex: /14:3E9A:Innocence starts using Realmrazer/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        ja: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Inno Enthrall',
      regex: /14:3E99:Innocence starts using Enthrall/,
      alertText: {
        en: 'Look Away, Get Towers',
      },
    },
    {
      id: 'Inno Reprobation Swords 2',
      regex: /14:3EDC:Innocence starts using Rightful Reprobation/,
      // 3 seconds cast time + 9.5 seconds until next sword.
      delaySeconds: 9.5,
      infoText: {
        en: 'Swords!',
        ja: '剣くるよ',
        fr: 'Epées !',
      },
    },

    {
      id: 'Inno Shadowreaver',
      regex: /14:3EEA:Innocence starts using Shadowreaver/,
      regexJa: /14:3EEA:Innocence starts using シャドウリーヴァー/,
      regexFr: /14:3EEA:Innocence starts using Pilleur/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        ja: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Inno Righteous Bolt',
      regex: /14:3EA3:Innocence starts using Righteous Bolt on (\y{Name})/,
      regexJa: /14:3EA3:イノセンス starts using ジャッジボルト on (\y{Name})/,
      regexFr: /14:3EA3:Innocence starts using Éclair [vV]ertueux on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
          };
        }
      },
    },
    {
      id: 'Inno Charge',
      regex: /14:3EC7:Innocence starts using Beatific Vision/,
      regexJa: /14:3EC7:イノセンス starts using ビーティフィックビジョン/,
      regexFr: /14:3EC7:Innocence starts using Vision [bB]éatifique/,
      alertText: function(data) {
        return {
          en: 'Avoid Charge',
          ja: '突進避けて',
          fr: 'Evitez les charges',
        };
      },
    },
    {
      id: 'InnoEx Light Pillar',
      regex: /15:\y{ObjectId}:Innocence:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexJa: /15:\y{ObjectId}:イノセンス:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data) {
        return {
          en: 'Line Stack',
          ja: 'シェア',
          fr: 'Packez-vous en ligne',
        };
      },
    },
    {
      id: 'Inno Winged Drop Of Light',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008A:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: function(data, matches) {
        return {
          en: 'Circle on YOU',
          fr: 'Cercle sur vous',
          ja: 'サークルついた',
        };
      },
    },
    {
      // TODO: is there a left, or do all normal modes rotate right??
      id: 'InnoEx Soul And Body Right',
      regex: / 14:3EB1:Innocence starts using Soul And Body/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'Innozenz',
        'Engage!': 'Start!',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Winged Reprobation': 'Schwinge des Urteils',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'Sternengeburt',
        'Soul and Body': 'Seele und Körper',
        'Shadowreaver': 'Schattenplünderer',
        'Scold\'s Bridle': 'Schandmal',
        'Rightful Reprobation': 'Rechtmäßige Verurteilung',
        'Righteous Bolt': 'Blitz der Gerechtigkeit',
        'Reprobation': 'Verurteilung',
        'Light Pillar': 'Lichtsäule',
        'Holy Trinity': 'Heilige Dreifaltigkeit',
        'Holy Sword': 'Heiliges Schwert',
        'Guiding Light': 'Leitendes Licht',
        'God Ray': 'Göttlicher Strahl',
        'Flaming Sword': 'Flammenschwert',
        'Explosion': 'Explosion',
        'Enrage': 'Finalangriff',
        'Duel Descent': 'Doppelter Sinkflug',
        'Drop of Light': 'Lichtabfall',
        'Dream of the Rood': 'Traum des Kreuzes',
        'Beatific Vision': 'Seligmachende Schau',
        'Forgiven venery': 'Geläuterte Wollust',
        'Forgiven shame': 'Geläuterte Schande',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Embolden': 'Ermutigen',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Sword Of Condemnation': 'Épée De Condamnation',
        'Forgiven Venery': 'Débauche Pardonnée',
        'Forgiven Shame': 'Déshonneur Pardonné',
        'Innocence': 'Innocence',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Winged Reprobation': 'Réprobation ailée',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'Accouchement stellaire',
        'Soul and Body': 'Âme et corps',
        'Shadowreaver': 'Pilleur d\'ombre',
        'Scold\'s Bridle': 'Bride-bavarde',
        'Rightful Reprobation': 'Réprobation légitime',
        'Righteous Bolt': 'Éclair vertueux',
        'Reprobation': 'Réprobation',
        'Light Pillar': 'Pilier de lumière',
        'Holy Trinity': 'Sainte Trinité',
        'Holy Sword': 'Épée sacrée',
        'Guiding Light': 'Lumière directrice',
        'God Ray': 'Rayon divin',
        'Flaming Sword': 'Épée du feu des cieux',
        'Explosion': 'Explosion',
        'Enrage': 'Enrage',
        'Duel Descent': 'Double plongeon',
        'Drop of Light': 'Goutte de lumière',
        'Dream of the Rood': 'Le Rêve de la Croix',
        'Beatific Vision': 'Vision béatifique',
        'Forgiven venery': 'débauche pardonnée',
        'Forgiven shame': 'déshonneur pardonné',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Lightning Resistance Down II': 'Résistance à La Foudre Réduite+',
        'Embolden': 'Enhardissement',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'イノセンス',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        '断罪': '断罪',
        'attack': '攻撃',
        'Winged Reprobation': '断罪の飛翔',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'スターバース',
        'Soul and Body': 'ソウル・アンド・ボディー',
        'Shadowreaver': 'シャドウリーヴァー',
        'Scold\'s Bridle': 'スコルドブライダル',
        'Rightful Reprobation': '断罪の旋回',
        'Righteous Bolt': 'ジャッジボルト',
        'Reprobation': '断罪',
        'Light Pillar': 'ライトピラー',
        'Holy Trinity': 'ホーリートリニティー',
        'Holy Sword': 'ホーリーソード',
        'Guiding Light': 'ガイディングライト',
        'God Ray': 'ゴッドレイ',
        'Flaming Sword': '回転せし炎の剣',
        'Explosion': '爆散',
        'Duel Descent': 'デュアルディセント',
        'Drop of Light': 'ドロップ・オブ・ライト',
        'Dream of the Rood': 'ドリーム・オブ・ザ・ルード',
        'Beatific Vision': 'ビーティフィックビジョン',
        'Forgiven venery': 'フォーギヴン・ヴェナリー',
        'Forgiven shame': 'フォーギヴン・シェイム',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Embolden': 'エンボルデン',
        'Damage Down': 'ダメージ低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': '',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        '断罪': '',
        'attack': '',
        'Winged Reprobation': '',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': '',
        'Soul and Body': '',
        'Shadowreaver': '',
        'Scold\'s Bridle': '',
        'Rightful Reprobation': '',
        'Righteous Bolt': '',
        'Reprobation': '',
        'Light Pillar': '',
        'Holy Trinity': '',
        'Holy Sword': '',
        'Guiding Light': '',
        'God Ray': '',
        'Flaming Sword': '',
        'Explosion': '',
        'Duel Descent': '',
        'Drop of Light': '',
        'Dream of the Rood': '',
        'Beatific Vision': '',
        'Geläuterte Wollust': '',
        'Geläuterte Schande': '',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Embolden': '鼓励',
        'Damage Down': '',
      },
    },
  ],
}];
