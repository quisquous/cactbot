'use strict';

// Innocence Extreme
[{
  zoneRegex: /The Crown Of The Immaculate \(Extreme\)/,
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx Starbirth Start',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      run: function(data) {
        data.starbirthCount = data.starbirthCount || 0;
        data.starbirthCount++;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Righteous Bolt',
      regex: /14:3ECD:Innocence starts using Righteous Bolt on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'InnoEx Holy Sword Healer',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      infoText: {
        en: 'Tank Busters',
      },
    },
    {
      id: 'InnoEx Holy Sword Me',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'InnoEx Charge',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Avoid Charge and Orbs',
          };
        }
        return {
          en: 'Avoid Charge',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Avoid',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      delaySeconds: 6,
      condition: function(data) {
        return data.starbirthCount == 1;
      },
      alertText: {
        en: 'Get to Safe Corner',
      },
    },
    {
      id: 'InnoEx Adds',
      regex: /15:\y{ObjectId}:Innocence:42B0:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Grab East/West Venery Adds',
      },
    },
    {
      id: 'InnoEx Light Pillar',
      regex: /15:\y{ObjectId}:Innocence:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
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
          };
        }
        return {
          en: 'Avoid Orbs With Line',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Line Stack',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Explode',
      regex: /14:3F3E:Innocence starts using Light Pillar/,
      condition: function(data) {
        return data.lightPillar == 3;
      },
      delaySeconds: 6.5,
      alertText: {
        en: 'Get to Safe Corner',
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
          };
        }
        return {
          en: 'Circle on YOU',
        };
      },
    },
    {
      id: 'InnoEx God Ray',
      regex: /14:3EE[456]:Innocence starts using God Ray/,
      suppressSeconds: 15,
      infoText: {
        en: 'Avoid Swords then Ray',
      },
    },
    {
      id: 'InnoEx Starbirth End 1',
      regex: /14:3EEA:Innocence starts using Shadowreaver/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Starbirth End 2',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
  ],
  'timelineReplace': [
    {
      'locale': 'de',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'Innozenz',
        'Geläuterte Wollust': '',
        'Geläuterte Schande': '',
        'Engage!': 'Start!'
      },
      'replaceText': {
        '断罪': '断罪',
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
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '': ''
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Embolden': 'Ermutigen',
        'Damage Down': 'Schaden -'
      }
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'Innocence',
        'Geläuterte Wollust': '',
        'Geläuterte Schande': '',
        'Engage!': 'À l\'attaque'
      },
      'replaceText': {
        '断罪': '断罪',
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
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        '': ''
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Lightning Resistance Down II': 'Résistance à La Foudre Réduite+',
        'Embolden': 'Enhardissement',
        'Damage Down': 'Malus de dégâts'
      }
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'イノセンス',
        'Geläuterte Wollust': '',
        'Geläuterte Schande': '',
        'Engage!': '戦闘開始！'
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
        '': ''
      },
      '~effectNames': {
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Embolden': 'エンボルデン',
        'Damage Down': 'ダメージ低下'
      }
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': '',
        'Geläuterte Wollust': '',
        'Geläuterte Schande': '',
        'Engage!': '战斗开始！'
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
        '': ''
      },
      '~effectNames': {
        'Physical Vulnerability Up': '',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Embolden': '鼓励',
        'Damage Down': ''
      }
    }
  ],
}];
