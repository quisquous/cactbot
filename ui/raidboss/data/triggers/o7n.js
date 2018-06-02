// O7N - Sigmascape 3.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V3\.0\)|Sigmascape V3\.0)$/,
  timelineFile: 'o7n.txt',
  triggers: [
    {
      id: 'O7N Magitek Ray',
      regex: / 14:276B:Guardian starts using Magitek Ray/,
      regexDe: / 14:276B:Wächter starts using Magitek-Laser/,
      alertText: {
        en: 'Magitek Ray',
        de: 'Magitek-Laser',
      },
      tts: {
        en: 'beam',
        de: 'les er strahl',
      },
    },
    {
      id: 'O7N Arm And Hammer',
      regex: / 14:276C:Guardian starts using Arm And Hammer on (\y{Name})/,
      regexDe: / 14:276C:Wächter starts using Arm-Hammer on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        if (data.role == 'healer')
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
          };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return {
            en: 'buster',
            de: 'basta',
          };
      },
    },
    {
      id: 'O7N Shockwave',
      regex: / 14:2766:Guardian starts using Shockwave/,
      regex: / 14:2766:Wächter starts using Schockwelle/,
      alertText: {
        en: 'Knockback',
        de: 'Rückstoß',
      },
      tts: {
        en: 'Knockback',
        de: 'Rückstoß',
      },
    },
    {
      id: 'O7N Diffractive Laser',
      regex: / 14:2761:Guardian starts using Diffractive Laser/,
      regex: / 14:2761:Wächter starts using Diffraktiver Laser/,
      alertText: {
        en: 'Get out',
        de: 'Rausgehen',
      },
      tts: {
        en: 'out',
        de: 'raus da',
      },
    },
    {
      id: 'O7N Prey',
      regex: /1B:........:(\y{Name}):....:....:001E:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return {
            en: 'Prey on YOU',
            de: 'Beute auf DIR',
          };
        return {
          en: 'Prey on ' + data.ShortName(matches[1]),
          de: 'Beute auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function (data, matches) {
        if (data.me == matches[1])
          return {
            en: 'prey',
            de: 'beute',
          };
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
      replaceSync: {
        'Air Force': 'Luftwaffe',
        'Dadaluma': 'Dadarma',
        'Fire Control System': 'Feuerleitsystem',
        'Guardian': 'Wächter',
        'Interdimensional Bomb': 'Interdimensionale Bombe',
        'Ultros': 'Ultros',
        'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert',
        'Tentacle': 'Tentakel',
        'Bibliotaph': 'Bibliotaph',
      },
      replaceText: {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Engage!': 'Start!',
        'Enrage': 'Finalangriff',

        'Arm And Hammer': 'Arm-Hammer',
        'Atomic Ray': 'Atomstrahlung',
        'Aura Cannon': 'Aura-Kanone',
        'Bomb Deployment': 'Bombeneinsatz',
        'Chain Cannon': 'Kettenkanone',
        'Chakra Burst': 'Chakra-Ausbruch',
        'Copy Program': 'Programm Kopieren',
        'Demon Simulation': 'Dämonensimulation',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Diffractive Plasma': 'Diffusionsplasma',
        'Electric Pulse': 'Elektrischer Impuls',
        'Engage!': 'Start!',
        'Explosion': 'Explosion',
        'Ink': 'Tinte',
        'Light Blast': 'Lichtschwall',
        'Load': 'Laden',
        'Magitek Ray': 'Magitek-Laser',
        'Magnetism': 'Magnetismus',
        'Main Cannon': 'Hauptkanone',
        'Missile': 'Rakete',
        'Missile Simulation': 'Raketensimulation',
        'Paste Program': 'Programm Einfügen',
        'Repel': 'Abstoßung',
        'Retrieve Program': 'Programm Wiederherstellen',
        'Run Program': 'Programm Starten',
        'Shockwave': 'Schockwelle',
        'Skip Program': 'Programm überspringen',
        'Stoneskin': 'Steinhaut',
        'Tentacle Simulation': 'Tentakelsimulation',
        'Tentacle(?! )': 'Tentakel',
        'The Heat': 'Heißluft',
        'Viral Weapon': 'Panikvirus',
        'Wallop': 'Tentakel',

        'Aether Rot': 'Ätherfäule',
        'Copy': 'Kopieren',
        'Skip': 'Überspringen',
        'Dada': 'Dadarma',
        'Run': 'Start',
        'Interrupt Stoneskin': 'Steinhaut unterbrechen',
        'Magnetism/Repel': 'Magnetismus',
        'Prey': 'Markiert',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Radar': 'Radar',
        'Paste': 'Einfügen',
        'Biblio': 'Bibliotaph',
        'Plane Laser': 'Luftwaffe Add Laser',
        'Virus': 'Virus',
        'Enrage': 'Finalangriff',
        'Burst/Darkness': 'Burst/Dunkelheit',
      },
      '~effectNames': {
        'Abandonment': 'Verlassen',
        'Aether Rot': 'Ätherfäule',
        'Aether Rot Immunity': 'Ätherfäule-Immunität',
        'Air Force Simulation': 'Luftwaffen-Kampfprogramm',
        'Bibliotaph Simulation': 'Bibliotaph-Kampfprogramm',
        'Bleeding': 'Blutung',
        'Burns': 'Brandwunde',
        'Dadaluma Simulation': 'Dadarma-Kampfprogramm',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Hover': 'Schweben',
        'Negative Charge': 'Negative Ladung',
        'Paralysis': 'Paralyse',
        'Positive Charge': 'Positive Ladung',
        'Prey': 'Markiert',
        'Searing Wind': 'Gluthitze',
        'Stun': 'Betäubung',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Ultros Simulation': 'Ultros-Kampfprogramm',
        'Virus': 'Virus',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        'Air Force': 'Force Aérienne',
        'Dadaluma': 'Dadaluma',
        'Fire Control System': 'Système De Contrôle',
        'Guardian': 'Gardien',
        'Interdimensional Bomb': 'Bombe Dimensionnelle',
        'Ultros': 'Orthros',

        // FIXME:
        'WEAPON SYSTEMS ONLINE': 'WEAPON SYSTEMS ONLINE',
        'Tentacle': 'Tentacle',
        'Bibliotaph': 'Bibliotaph',
      },
      replaceText: {
        'Arm And Hammer': 'Marteau Stratégique',
        'Atomic Ray': 'Rayon Atomique',
        "Aura Cannon": "Rayon D'aura",
        'Bomb Deployment': 'Déploiement De Bombes',
        'Chain Cannon': 'Canon Automatique',
        'Chakra Burst': 'Explosion De Chakra',
        'Copy Program': 'Copie De Programme',
        'Demon Simulation': 'Chargement : Démon',
        'Diffractive Laser': 'Laser Diffracteur',
        'Diffractive Plasma': 'Plasma Diffracteur',
        'Electric Pulse': 'Impulsion électrique',
        "Engage!": "À l'attaque",
        'Explosion': 'Explosion',
        'Ink': 'Encre',
        'Light Blast': 'Déflagration Légère',
        'Load': 'Chargement',
        'Magitek Ray': 'Rayon Magitek',
        'Magnetism': 'Magnétisme',
        'Main Cannon': 'Canon Principal',
        'Missile': 'Missile',
        'Missile Simulation': 'Chargement : Missiles',
        'Paste Program': 'Collage De Programme',
        'Repel': 'Répulsion',
        'Retrieve Program': 'Programme Précédent',
        'Run Program': 'Programme De Matérialisation',
        'Shockwave': 'Onde De Choc',
        'Skip Program': 'Saut De Programme',
        'Stoneskin': 'Cuirasse',
        'Tentacle(?! )': 'Tentacule',
        'Tentacle Simulation': 'Chargement : Tentacule',
        'The Heat': 'Carbonisation',
        'Viral Weapon': 'Arme Virologique',
        'Wallop': 'Taloche Tentaculaire',

        '--targetable--': '--ciblable--',
        '--untargetable--': '--impossible à cibler--',

        // FIXME:
        'Prey': 'Marquage',
        'Plane Laser': 'Plane Laser',
        'Burst/Darkness': 'Burst/Darkness',
      },
      '~effectNames': {
        'Abandonment': 'Isolement',
        'Aether Rot': 'Pourriture éthéréenne',
        'Aether Rot Immunity': 'Anticorps éthéréen',
        'Air Force Simulation': 'Programme Force Aérienne',
        'Bibliotaph Simulation': 'Programme Bibliotaphe',
        'Bleeding': 'Saignant',
        'Burns': 'Brûlure',
        'Dadaluma Simulation': 'Programme Dadaluma',
        'Fire Resistance Down II': 'Résistance Au Feu Réduite+',
        'Hover': 'Élévation',
        'Negative Charge': 'Charge Négative',
        'Paralysis': 'Paralysie',
        'Positive Charge': 'Charge Positive',
        'Prey': 'Marquage',
        'Searing Wind': 'Fournaise',
        'Stun': 'Étourdissement',
        'Temporary Misdirection': 'Démence',
        'Ultros Simulation': 'Programme Orthros',
        'Virus': 'Programme Virus',
      },
    },
    {
      locale: 'ja',
      replaceSync: {
        'Air Force': 'エアフォース',
        'Dadaluma': 'ダダルマー',
        'Fire Control System': 'ファイアコントロールシステム',
        'Guardian': 'ガーディアン',
        'Interdimensional Bomb': '次元爆弾',
        'Ultros': 'オルトロス',
      },
      replaceText: {
        'Arm And Hammer': 'アームハンマー',
        'Atomic Ray': 'アトミックレイ',
        'Aura Cannon': 'オーラキャノン',
        'Bomb Deployment': '爆弾設置',
        'Chain Cannon': 'チェーンガン',
        'Chakra Burst': 'チャクラバースト',
        'Copy Program': 'プログラム・コピー',
        'Demon Simulation': 'ローディング：デーモン',
        'Diffractive Laser': '拡散レーザー',
        'Diffractive Plasma': '拡散プラズマ',
        'Electric Pulse': 'エレクトリックパルス',
        'Engage!': '戦闘開始！',
        'Explosion': '爆発',
        'Ink': '墨',
        'Light Blast': '小規模爆発',
        'Load': 'ローディング',
        'Magitek Ray': '魔導レーザー',
        'Magnetism': '磁力',
        'Main Cannon': 'メインカノン',
        'Missile': 'ミサイル',
        'Missile Simulation': 'ローディング：ミサイル',
        'Paste Program': 'プログラム・ペースト',
        'Repel': '反発',
        'Retrieve Program': 'リバース・ローディング',
        'Run Program': '実体化プログラム',
        'Shockwave': '衝撃波',
        'Skip Program': 'スキップ・ローディング',
        'Stoneskin': 'ストンスキン',
        'Tentacle(?! )': 'たこあし',
        'Tentacle Simulation': 'ローディング：たこあし',
        'The Heat': '熱風',
        'Viral Weapon': 'ウィルス兵器',
        'Wallop': '叩きつけ',
      },
      '~effectNames': {
        'Abandonment': '孤独感',
        'Aether Rot': 'エーテルロット',
        'Aether Rot Immunity': 'エーテルロット抗体',
        'Air Force Simulation': 'エアフォース・プログラム',
        'Bibliotaph Simulation': 'ビブリオタフ・プログラム',
        'Bleeding': 'ペイン',
        'Burns': '火傷',
        'Dadaluma Simulation': 'ダダルマー・プログラム',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'Hover': '滞空',
        'Negative Charge': '磁力【－】',
        'Paralysis': '麻痺',
        'Positive Charge': '磁力【＋】',
        'Prey': 'マーキング',
        'Searing Wind': '灼熱',
        'Stun': 'スタン',
        'Temporary Misdirection': '心神喪失',
        'Ultros Simulation': 'オルトロス・プログラム',
        'Virus': 'ウィルス・プログラム',
      },
    },
  ],
}]
