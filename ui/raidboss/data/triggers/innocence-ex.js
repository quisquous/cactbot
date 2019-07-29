'use strict';

// Innocence Extreme
[{
  zoneRegex: /The Crown Of The Immaculate \(Extreme\)/,
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx Starbirth Count',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      regexJa: /14:3EEF:イノセンス starts using スターバース/,
      regexFr: /14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      run: function(data) {
        data.starbirthCount = data.starbirthCount || 0;
        data.starbirthCount++;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Reprobation Swords 2',
      regex: /14:3EDC:Innocence starts using Rightful Reprobation/,
      regexJa: /14:3EDC:イノセンス starts using 断罪の旋回/,
      regexFr: /14:3EDC:Innocence starts using Réprobation [lL]égitime/,
      // 3 seconds cast time + 7 seconds until next sword.
      delaySeconds: 7,
      infoText: {
        en: 'Swords!',
        ja: '剣くるよ',
        fr: 'Epées !',
      },
    },
    {
      id: 'InnoEx Starbirth Warning',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      regexJa: /14:3EEF:イノセンス starts using スターバース/,
      regexFr: /14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      infoText: function(data) {
        if (data.starbirthCount == 1) {
          return {
            en: 'Starbirth: Corner',
            ja: 'スターバース: 角へ',
            fr: 'Accouchement Stellaire : Coin',
          };
        } else if (data.starbirthCount == 2 || data.starbirthCount == 5) {
          return {
            en: 'Starbirth: Avoid + Charge',
            ja: 'スターバース: 玉のない隅へ',
            fr: 'Accouchement Stellaire : Evitez + Charge',
          };
        } else if (data.starbirthCount == 3) {
          return {
            en: 'Starbirth: Explode',
            ja: 'スターバース: 爆発',
            fr: 'Accouchement Stellaire : Explosion',
          };
        } else if (data.starbirthCount == 4) {
          return {
            en: 'Starbirth: Charge',
            ja: 'スターバース: 突進',
            fr: 'Accouchement Stellaire : Charge',
          };
        } else if (data.starbirthCount == 6) {
          return {
            en: 'Starbirth: Enrage',
            ja: 'スターバース: 時間切れ',
            fr: 'Accouchement Stellaire : Enrage',
          };
        }
        // No text for the second enrage one.
      },
    },
    {
      id: 'InnoEx Shadowreaver',
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
      id: 'InnoEx Righteous Bolt',
      regex: /14:3ECD:Innocence starts using Righteous Bolt on (\y{Name})/,
      regexJa: /14:3ECD:イノセンス starts using ジャッジボルト on (\y{Name})/,
      regexFr: /14:3ECD:Innocence starts using Éclair [vV]ertueux on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'スイッチ',
        };
      },
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
      id: 'InnoEx Holy Sword Healer',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword/,
      regexJa: /14:3EC9:フォーギヴン・ヴェナリー starts using ホーリーソード/,
      regexFr: /14:3EC9:Débauche Pardonnée starts using Épée [sS]acrée/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      infoText: {
        en: 'Tank Busters',
        ja: 'タンクバスター',
        fr: 'Tankbusters',
      },
    },
    {
      id: 'InnoEx Holy Sword Me',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword on (\y{Name})/,
      regexJa: /14:3EC9:フォーギヴン・ヴェナリー starts using ホーリーソード on (\y{Name})/,
      regexFr: /14:3EC9:Débauche Pardonnée starts using Épée [sS]acrée on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        ja: '自分にタンクバスター',
      },
    },
    {
      id: 'InnoEx Charge',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      regexJa: /14:3EEE:イノセンス starts using ビーティフィックビジョン/,
      regexFr: /14:3EEE:Innocence starts using Vision [bB]éatifique/,
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Avoid Charge and Orbs',
            ja: '玉と突進避けて',
            fr: 'Evitez les charges et orbes',
          };
        }
        return {
          en: 'Avoid Charge',
          ja: '突進避けて',
          fr: 'Evitez les charges',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Avoid',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      regexJa: /14:3EEF:イノセンス starts using スターバース/,
      regexFr: /14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      delaySeconds: 6,
      condition: function(data) {
        return data.starbirthCount == 1;
      },
      alertText: {
        en: 'Get to Safe Corner',
        ja: '安置へ',
        fr: 'Allez sur le coin sûr',
      },
    },
    {
      id: 'InnoEx Adds',
      regex: /15:\y{ObjectId}:Innocence:42B0:/,
      regexJa: /15:\y{ObjectId}:イノセンス:42B0:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Grab East/West Venery Adds',
        ja: '雑魚のタゲ取って',
        fr: 'Attrapez les adds en Est/Ouest',
      },
    },
    {
      id: 'InnoEx Light Pillar',
      regex: /15:\y{ObjectId}:Innocence:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexJa: /15:\y{ObjectId}:イノセンス:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
      preRun: function(data) {
        data.lightPillar = data.lightPillar || 0;
        data.lightPillar++;
      },
      alarmText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        if (data.lightPillar == 3) {
          return {
            en: 'Aim Line At Back Orb',
            ja: '後ろの玉に当てて',
            fr: 'Visez l\'orbe arrière avec la ligne',
          };
        }
        return {
          en: 'Avoid Orbs With Line',
          ja: '玉に当てるな',
          fr: 'Evitez l\'orbe avec la ligne',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Line Stack',
          ja: 'シェア',
          fr: 'Packez-vous en ligne',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Explode',
      regex: /14:3F3E:Innocence starts using Light Pillar/,
      regexJa: /14:3F3E:イノセンス starts using ライトピラー/,
      regexFr: /14:3F3E:Innocence starts using Pilier [dD]e [lL]umière/,
      condition: function(data) {
        return data.lightPillar == 3;
      },
      delaySeconds: 6.5,
      alertText: {
        en: 'Get to Safe Corner',
        fr: 'Allez sur le coin sûr',
      },
    },
    {
      id: 'InnoEx Winged Reprobation Tether',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00AC:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tether on YOU',
        fr: 'Lien sur VOUS',
        ja: '線ついた',
      },
    },
    {
      id: 'InnoEx Winged Drop Of Light',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008A:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: function(data, matches) {
        if (data.starbirthActive) {
          return {
            en: 'Circle, Avoid Orbs',
            fr: 'Cercle, Evitez orbes',
            ja: 'オーブに当てないで',
          };
        }
        return {
          en: 'Circle on YOU',
          fr: 'Cercle sur vous',
          ja: 'サークルついた',
        };
      },
    },
    {
      id: 'InnoEx God Ray',
      regex: /14:3EE[456]:Innocence starts using God Ray/,
      regexJa: /14:3EE[456]:イノセンス starts using ゴッドレイ/,
      regexFr: /14:3EE[456]:Innocence starts using Rayon Divin/,
      suppressSeconds: 15,
      infoText: {
        en: 'Avoid Swords then Ray',
        fr: 'Evitez l\'épée puis le rayon',
        ja: '剣避けてからピザカット',
      },
    },
    {
      id: 'InnoEx Starbirth End 1',
      regex: /14:3EEA:Innocence starts using Shadowreaver/,
      regexJa: /14:3EEA:イノセンス starts using シャドウリーヴァー/,
      regexFr: /14:3EEA:Innocence starts using Pilleur/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Starbirth End 2',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      regexJa: /14:3EEE:Innocence starts using ビューティフィックビジョン/,
      regexFr: /14:3EEE:Innocence starts using Vision [bB]éatifique/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Soul And Body Left',
      regex: / 14:3ED7:Innocence starts using Soul And Body/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
      },
    },
    {
      id: 'InnoEx Soul And Body Right',
      regex: / 14:3ED9:Innocence starts using Soul And Body/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
      },
    },
    {
      id: 'InnoEx Rood',
      regex: / 14:3ED3:Innocence starts using Dream Of The Rood/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
      },
    },
    {
      id: 'InnoEx Rood',
      regex: / 14:3ED5:Innocence starts using Dream Of The Rood/,
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
