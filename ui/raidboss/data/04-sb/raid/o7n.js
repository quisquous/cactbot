'use strict';

// O7N - Sigmascape 3.0 Normal
[{
  zoneRegex: /^Sigmascape \(V3\.0\)$/,
  timelineFile: 'o7n.txt',
  triggers: [
    {
      id: 'O7N Magitek Ray',
      regex: Regexes.startsUsing({ id: '276B', source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: '276B', source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: '276B', source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '276B', source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '276B', source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '276B', source: '가디언', capture: false }),
      alertText: {
        en: 'Magitek Ray',
        de: 'Magitek-Laser',
        fr: 'Rayon Magitek',
      },
      tts: {
        en: 'beam',
        de: 'les er strahl',
        fr: 'laser',
      },
    },
    {
      id: 'O7N Arm And Hammer',
      regex: Regexes.startsUsing({ id: '276C', source: 'Guardian' }),
      regexDe: Regexes.startsUsing({ id: '276C', source: 'Wächter' }),
      regexFr: Regexes.startsUsing({ id: '276C', source: 'Gardien' }),
      regexJa: Regexes.startsUsing({ id: '276C', source: 'ガーディアン' }),
      regexCn: Regexes.startsUsing({ id: '276C', source: '守护者' }),
      regexKo: Regexes.startsUsing({ id: '276C', source: '가디언' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank Buster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Buster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O7N Shockwave',
      regex: Regexes.startsUsing({ id: '2766', source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2766', source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2766', source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2766', source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2766', source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2766', source: '가디언', capture: false }),
      alertText: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Projection',
      },
    },
    {
      id: 'O7N Diffractive Laser',
      regex: Regexes.startsUsing({ id: '2761', source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2761', source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2761', source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2761', source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2761', source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2761', source: '가디언', capture: false }),
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
      },
      tts: {
        en: 'out',
        de: 'raus',
        fr: 's\'éloigner',
      },
    },
    {
      id: 'O7N Prey',
      regex: Regexes.headMarker({ id: '001E' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Prey on YOU',
            de: 'Beute auf DIR',
            fr: 'Marquage sur VOUS',
          };
        }
        return {
          en: 'Prey on ' + data.ShortName(matches.target),
          de: 'Beute auf ' + data.ShortName(matches.target),
          fr: 'Marquage sur ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'prey',
            de: 'beute',
            fr: 'marquage',
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Air Force': 'Luftwaffe',
        'Bibliotaph': 'Bibliotaph',
        'Dadaluma': 'Dadarma',
        'Fire Control System': 'Feuerleitsystem',
        'Guardian': 'Wächter',
        'Interdimensional Bomb': 'interdimensional(?:e|er|es|en) Bombe',
        'Tentacle': 'Tentakel',
        'Ultros': 'Ultros',
        'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert',
      },
      'replaceText': {
        'Aether Rot': 'Ätherfäule',
        'Arm And Hammer': 'Arm-Hammer',
        'Atomic Ray': 'Atomstrahlung',
        'Aura Cannon': 'Aura-Kanone',
        'Biblio': 'Bibliotaph',
        'Bomb Deployment': 'Bombeneinsatz',
        'Burst/Darkness': 'Burst/Dunkelheit',
        'Chain Cannon': 'Kettenkanone',
        'Chakra Burst': 'Chakra-Ausbruch',
        'Copy Program': 'Programm kopieren',
        'Copy(?! )': 'Kopieren',
        'Dada': 'Dadarma',
        'Demon Simulation': 'Dämonensimulation',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Diffractive Plasma': 'Diffusionsplasma',
        'Electric Pulse': 'Elektrischer Impuls',
        'Explosion': 'Explosion',
        'Ink': 'Tinte',
        'Interrupt Stoneskin': 'Steinhaut unterbrechen',
        'Light Blast': 'Lichtschwall',
        'Load': 'Laden',
        'Magitek Ray': 'Magitek-Laser',
        'Magnetism/Repel': 'Magnetismus',
        'Magnetism': 'Magnetismus',
        'Main Cannon': 'Hauptkanone',
        'Missile Simulation': 'Raketensimulation',
        'Missile(?![ |\\w])': 'Rakete',
        'Paste Program': 'Programm einfügen',
        'Paste(?! )': 'Einfügen',
        'Plane Laser': 'Luftwaffe Add Laser',
        'Prey': 'Beute',
        'Radar': 'Radar',
        'Repel': 'Abstoßung',
        'Retrieve Program': 'Programm wiederherstellen',
        'Run Program': 'Programm starten',
        'Run(?! )': 'Start',
        'Shockwave': 'Schockwelle',
        'Skip Program': 'Programm überspringen',
        'Skip(?! )': 'Überspringen',
        'Stoneskin': 'Steinhaut',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Tentacle Simulation': 'Tentakelsimulation',
        'Tentacle(?! )': 'Tentakel',
        'The Heat': 'Heißluft',
        'Viral Weapon': 'Panikvirus',
        '(?<!\\w)Virus': 'Virus',
        'Wallop': 'Tentakelklatsche',
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
        'Prey': 'Beute',
        'Searing Wind': 'Versengen',
        'Stun': 'Betäubung',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Ultros Simulation': 'Ultros-Kampfprogramm',
        '(?<!\\w)Virus': 'Virus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Air Force': 'force aérienne',
        'Bibliotaph': 'bibliotaphe',
        'Dadaluma': 'Dadaluma',
        'Fire Control System': 'système de contrôle',
        'Guardian': 'gardien',
        'Interdimensional Bomb': 'bombe dimensionnelle',
        'Tentacle': 'Tentacule',
        'Ultros': 'Orthros',
        'WEAPON SYSTEMS ONLINE': 'Démarrage du système de contrôle',
      },
      'replaceText': {
        'Aether Rot': 'Pourriture éthéréenne',
        'Arm And Hammer': 'Marteau stratégique',
        'Atomic Ray': 'Rayon atomique',
        'Aura Cannon': 'Rayon d\'aura',
        'Biblio': 'Bibliotaphe',
        'Bomb Deployment': 'Déploiement de bombes',
        'Burst/Darkness': 'Explosion Magique',
        'Chain Cannon': 'Canon automatique',
        'Chakra Burst': 'Explosion d\'aura',
        'Copy Program': 'Copie de programme',
        'Copy(?! )': 'Copy', // FIXME
        'Dada': 'Dada', // FIXME
        'Demon Simulation': 'Chargement : démon',
        'Diffractive Laser': 'Laser diffracteur',
        'Diffractive Plasma': 'Plasma diffracteur',
        'Electric Pulse': 'Impulsion électrique',
        'Explosion': 'Explosion',
        'Ink': 'Encre',
        'Interrupt Stoneskin': 'Interrupt Stoneskin', // FIXME
        'Light Blast': 'Déflagration légère',
        'Load': 'Chargement',
        'Magitek Ray': 'Rayon magitek',
        'Magnetism/Repel': 'Magnetism/Repel', // FIXME
        'Magnetism': 'Magnétisme',
        'Main Cannon': 'Canon principal',
        'Missile Simulation': 'Chargement : missiles',
        'Missile(?![ |\\w])': 'Missile',
        'Paste Program': 'Collage de programme',
        'Paste(?! )': 'Paste', // FIXME
        'Plane Laser': 'Laser d\'avion',
        'Prey': 'Proie',
        'Radar': 'Radar', // FIXME
        'Repel': 'Répulsion',
        'Retrieve Program': 'Programme précédent',
        'Run Program': 'Programme de matérialisation',
        'Run(?! )': 'Run', // FIXME
        'Shockwave': 'Onde de choc',
        'Skip Program': 'Saut de programme',
        'Skip(?! )': 'Skip', // FIXME
        'Stoneskin': 'Cuirasse',
        'Temporary Misdirection': 'Démence',
        'Tentacle Simulation': 'Chargement : tentacule',
        'Tentacle(?! )': 'Tentacule',
        'The Heat': 'Carbonisation',
        'Viral Weapon': 'Arme virologique',
        '(?<!\\w)Virus': 'Virus',
        'Wallop': 'Taloche tentaculaire',
      },
      '~effectNames': {
        'Abandonment': 'Isolement',
        'Aether Rot': 'Pourriture éthéréenne',
        'Aether Rot Immunity': 'Anticorps éthéréen',
        'Air Force Simulation': 'Programme force aérienne',
        'Bibliotaph Simulation': 'Programme bibliotaphe',
        'Bleeding': 'Saignement',
        'Burns': 'Brûlure',
        'Dadaluma Simulation': 'Programme Dadaluma',
        'Fire Resistance Down II': 'Résistance au feu réduite+',
        'Hover': 'Élévation',
        'Negative Charge': 'Charge négative',
        'Paralysis': 'Paralysie',
        'Positive Charge': 'Charge positive',
        'Prey': 'Proie',
        'Searing Wind': 'Carbonisation',
        'Stun': 'Étourdissement',
        'Temporary Misdirection': 'Démence',
        'Ultros Simulation': 'Programme Orthros',
        '(?<!\\w)Virus': 'Virus',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Air Force': 'エアフォース',
        'Bibliotaph': 'ビブリオタフ',
        'Dadaluma': 'ダダルマー',
        'Fire Control System': 'ファイアコントロールシステム',
        'Guardian': 'ガーディアン',
        'Interdimensional Bomb': '次元爆弾',
        'Tentacle': 'たこあし',
        'Ultros': 'オルトロス',
        'WEAPON SYSTEMS ONLINE': 'ファイアコントロールシステム起動',
      },
      'replaceText': {
        'Aether Rot': 'エーテルロット',
        'Arm And Hammer': 'アームハンマー',
        'Atomic Ray': 'アトミックレイ',
        'Aura Cannon': 'オーラキャノン',
        'Biblio': 'Biblio', // FIXME
        'Bomb Deployment': '爆弾設置',
        'Burst/Darkness': 'Burst/Darkness', // FIXME
        'Chain Cannon': 'チェーンガン',
        'Chakra Burst': 'チャクラバースト',
        'Copy Program': 'プログラム・コピー',
        'Copy(?! )': 'Copy', // FIXME
        'Dada': 'Dada', // FIXME
        'Demon Simulation': 'ローディング：デーモン',
        'Diffractive Laser': '拡散レーザー',
        'Diffractive Plasma': '拡散プラズマ',
        'Electric Pulse': 'エレクトリックパルス',
        'Explosion': '爆発',
        'Ink': '墨',
        'Interrupt Stoneskin': 'Interrupt Stoneskin', // FIXME
        'Light Blast': '小規模爆発',
        'Load': 'ローディング',
        'Magitek Ray': '魔導レーザー',
        'Magnetism/Repel': 'Magnetism/Repel', // FIXME
        'Magnetism': '磁力',
        'Main Cannon': 'メインカノン',
        'Missile Simulation': 'ローディング：ミサイル',
        'Missile(?![ |\\w])': 'ミサイル',
        'Paste Program': 'プログラム・ペースト',
        'Paste(?! )': 'Paste', // FIXME
        'Plane Laser': 'Plane Laser', // FIXME
        'Prey': 'プレイ',
        'Radar': 'Radar', // FIXME
        'Repel': '反発',
        'Retrieve Program': 'リバース・ローディング',
        'Run Program': '実体化プログラム',
        'Run(?! )': 'Run', // FIXME
        'Shockwave': '衝撃波',
        'Skip Program': 'スキップ・ローディング',
        'Skip(?! )': 'Skip', // FIXME
        'Stoneskin': 'ストンスキン',
        'Temporary Misdirection': '心神喪失',
        'Tentacle Simulation': 'ローディング：たこあし',
        'Tentacle(?! )': 'Tentacle(?! )', // FIXME
        'The Heat': '熱風',
        'Viral Weapon': 'ウィルス兵器',
        '(?<!\\w)Virus': 'ウイルス',
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
        'Prey': 'プレイ',
        'Searing Wind': '熱風',
        'Stun': 'スタン',
        'Temporary Misdirection': '心神喪失',
        'Ultros Simulation': 'オルトロス・プログラム',
        '(?<!\\w)Virus': 'ウイルス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Air Force': '空军装甲',
        'Bibliotaph': '永世珍本',
        'Dadaluma': '达达鲁玛',
        'Fire Control System': '武器火控系统',
        'Guardian': '守护者',
        'Interdimensional Bomb': '次元炸弹',
        'Tentacle': '腕足',
        'Ultros': '奥尔特罗斯',
        'WEAPON SYSTEMS ONLINE': 'WEAPON SYSTEMS ONLINE', // FIXME
      },
      'replaceText': {
        'Aether Rot': '以太病毒',
        'Arm And Hammer': '臂锤',
        'Atomic Ray': '原子射线',
        'Aura Cannon': '斗气炮',
        'Biblio': 'Biblio', // FIXME
        'Bomb Deployment': '设置炸弹',
        'Burst/Darkness': 'Burst/Darkness', // FIXME
        'Chain Cannon': '链式机关炮',
        'Chakra Burst': '脉轮爆发',
        'Copy Program': '复制程序',
        'Copy(?! )': 'Copy', // FIXME
        'Dada': 'Dada', // FIXME
        'Demon Simulation': '加载恶魔模拟程序',
        'Diffractive Laser': '扩散射线',
        'Diffractive Plasma': '扩散离子',
        'Electric Pulse': '电磁脉冲',
        'Explosion': '爆炸',
        'Ink': '墨汁',
        'Interrupt Stoneskin': 'Interrupt Stoneskin', // FIXME
        'Light Blast': '小规模爆炸',
        'Load': '加载',
        'Magitek Ray': '魔导激光',
        'Magnetism/Repel': 'Magnetism/Repel', // FIXME
        'Magnetism': '磁力',
        'Main Cannon': '主加农炮',
        'Missile Simulation': '加载导弹模拟程序',
        'Missile(?![ |\\w])': '导弹',
        'Paste Program': '粘贴程序',
        'Paste(?! )': 'Paste', // FIXME
        'Plane Laser': 'Plane Laser', // FIXME
        'Prey': 'プレイ',
        'Radar': 'Radar', // FIXME
        'Repel': '相斥',
        'Retrieve Program': '反向加载',
        'Run Program': '实体化程序',
        'Run(?! )': 'Run', // FIXME
        'Shockwave': '冲击波',
        'Skip Program': '跳跃加载',
        'Skip(?! )': 'Skip', // FIXME
        'Stoneskin': '石肤',
        'Temporary Misdirection': '精神失常',
        'Tentacle Simulation': '加载腕足模拟程序',
        'Tentacle(?! )': 'Tentacle(?! )', // FIXME
        'The Heat': '热风',
        'Viral Weapon': '病毒兵器',
        '(?<!\\w)Virus': '病毒',
        'Wallop': '敲击',
      },
      '~effectNames': {
        'Abandonment': '孤独感',
        'Aether Rot': '以太病毒',
        'Aether Rot Immunity': '以太病毒抗体',
        'Air Force Simulation': '空军装甲模拟程序',
        'Bibliotaph Simulation': '永世珍本模拟程序',
        'Bleeding': '出血',
        'Burns': '火伤',
        'Dadaluma Simulation': '达达鲁玛模拟程序',
        'Fire Resistance Down II': '火属性耐性大幅降低',
        'Hover': '滞空',
        'Negative Charge': '磁力（-）',
        'Paralysis': '麻痹',
        'Positive Charge': '磁力（+）',
        'Prey': 'プレイ',
        'Searing Wind': '热风',
        'Stun': '眩晕',
        'Temporary Misdirection': '精神失常',
        'Ultros Simulation': '奥尔特罗斯模拟程序',
        '(?<!\\w)Virus': '病毒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Air Force': '에어포스',
        'Bibliotaph': '비블리오타프',
        'Dadaluma': '다다루마',
        'Fire Control System': '병기 제어 시스템',
        'Guardian': '가디언',
        'Interdimensional Bomb': '차원 폭탄',
        'Tentacle': '문어발',
        'Ultros': '오르트로스',
        'WEAPON SYSTEMS ONLINE': 'WEAPON SYSTEMS ONLINE', // FIXME
      },
      'replaceText': {
        'Aether Rot': '에테르 부패',
        'Arm And Hammer': '양팔 내리치기',
        'Atomic Ray': '원자 파동',
        'Aura Cannon': '오라 포격',
        'Biblio': 'Biblio', // FIXME
        'Bomb Deployment': '폭탄 설치',
        'Burst/Darkness': 'Burst/Darkness', // FIXME
        'Chain Cannon': '기관총',
        'Chakra Burst': '차크라 폭발',
        'Copy Program': '프로그램 복사',
        'Copy(?! )': 'Copy', // FIXME
        'Dada': 'Dada', // FIXME
        'Demon Simulation': '불러오기: 악마',
        'Diffractive Laser': '확산 레이저',
        'Diffractive Plasma': '확산 플라스마',
        'Electric Pulse': '전기 충격',
        'Explosion': '폭발',
        'Ink': '먹물',
        'Interrupt Stoneskin': 'Interrupt Stoneskin', // FIXME
        'Light Blast': '소규모 폭발',
        'Load': '불러오기',
        'Magitek Ray': '마도 레이저',
        'Magnetism/Repel': 'Magnetism/Repel', // FIXME
        'Magnetism': '자력',
        'Main Cannon': '주포',
        'Missile Simulation': '불러오기: 미사일',
        'Missile(?![ |\\w])': '미사일',
        'Paste Program': '프로그램 붙여넣기',
        'Paste(?! )': 'Paste', // FIXME
        'Plane Laser': 'Plane Laser', // FIXME
        'Prey': 'プレイ',
        'Radar': 'Radar', // FIXME
        'Repel': '반발',
        'Retrieve Program': '역순 불러오기',
        'Run Program': '실체화 프로그램',
        'Run(?! )': 'Run', // FIXME
        'Shockwave': '충격파',
        'Skip Program': '건너뛰기',
        'Skip(?! )': 'Skip', // FIXME
        'Stoneskin': '스톤스킨',
        'Temporary Misdirection': '심신상실',
        'Tentacle Simulation': '불러오기: 문어발',
        'Tentacle(?! )': 'Tentacle(?! )', // FIXME
        'The Heat': '열풍',
        'Viral Weapon': '바이러스 병기',
        '(?<!\\w)Virus': '바이러스',
        'Wallop': '매질',
      },
      '~effectNames': {
        'Abandonment': '고독감',
        'Aether Rot': '에테르 부패',
        'Aether Rot Immunity': '에테르 부패 항체',
        'Air Force Simulation': '에어포스 프로그램',
        'Bibliotaph Simulation': '비블리오타프 프로그램',
        'Bleeding': '고통',
        'Burns': '화상',
        'Dadaluma Simulation': '다다루마 프로그램',
        'Fire Resistance Down II': '불속성 저항 감소[강]',
        'Hover': '체공',
        'Negative Charge': '자력[-]',
        'Paralysis': '마비',
        'Positive Charge': '자력[+]',
        'Prey': 'プレイ',
        'Searing Wind': '열풍',
        'Stun': '기절',
        'Temporary Misdirection': '심신상실',
        'Ultros Simulation': '오르트로스 프로그램',
        '(?<!\\w)Virus': '바이러스',
      },
    },
  ],
}];
