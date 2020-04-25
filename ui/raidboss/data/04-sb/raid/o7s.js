'use strict';

// O7S - Sigmascape 3.0 Savage
// localization:
//   de: timeline done, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: {
    en: /^Sigmascape V3\.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(西格玛幻境3\)$/,
  },
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
      id: 'O7S Aether Rot Gain',
      regex: Regexes.gainsEffect({ effect: 'Aether Rot' }),
      regexDe: Regexes.gainsEffect({ effect: 'Ätherfäule' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pourriture Éthéréenne' }),
      regexJa: Regexes.gainsEffect({ effect: 'エーテルロット' }),
      regexCn: Regexes.gainsEffect({ effect: '以太病毒' }),
      regexKo: Regexes.gainsEffect({ effect: '에테르 부패' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.rot = true;
      },
    },
    {
      id: 'O7S Aether Rot Lose',
      regex: Regexes.losesEffect({ effect: 'Aether Rot' }),
      regexDe: Regexes.losesEffect({ effect: 'Ätherfäule' }),
      regexFr: Regexes.losesEffect({ effect: 'Pourriture Éthéréenne' }),
      regexJa: Regexes.losesEffect({ effect: 'エーテルロット' }),
      regexCn: Regexes.losesEffect({ effect: '以太病毒' }),
      regexKo: Regexes.losesEffect({ effect: '에테르 부패' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.rot = false;
      },
    },
    {
      id: 'O7S Dadaluma Simulation',
      regex: Regexes.gainsEffect({ target: 'Guardian', effect: 'Dadaluma Simulation', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Wächter', effect: 'Dadarma-Kampfprogramm', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'gardien', effect: 'Programme Dadaluma', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ガーディアン', effect: 'ダダルマー・プログラム', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '守护者', effect: '达达鲁玛模拟程序', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '가디언', effect: '다다루마 프로그램', capture: false }),
      condition: function(data) {
        return !data.first || data.seenVirus && !data.second;
      },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'dada';
        else
          data.first = 'dada';
      },
    },
    {
      id: 'O7S Bibliotaph Simulation',
      regex: Regexes.gainsEffect({ target: 'Guardian', effect: 'Bibliotaph Simulation', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Wächter', effect: 'Bibliotaph-Kampfprogramm', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'gardien', effect: 'Programme Bibliotaphe', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ガーディアン', effect: 'ビブリオタフ・プログラム', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '守护者', effect: '永世珍本模拟程序', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '가디언', effect: '비블리오타프 프로그램', capture: false }),
      condition: function(data) {
        return !data.first || data.seenVirus && !data.second;
      },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'biblio';
        else
          data.first = 'biblio';
      },
    },
    {
      id: 'O7S Virus Tracker',
      regex: Regexes.gainsEffect({ target: 'Guardian', effect: 'Virus', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Wächter', effect: 'Virus', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'gardien', effect: 'Programme Virus', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ガーディアン', effect: 'ウィルス・プログラム', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '守护者', effect: '病毒模拟程序', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '가디언', effect: '바이러스 프로그램', capture: false }),
      run: function(data) {
        data.seenVirus = true;
      },
    },
    {
      id: 'O7S Magitek Ray',
      regex: Regexes.startsUsing({ id: '2788', source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2788', source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2788', source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2788', source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2788', source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2788', source: '가디언', capture: false }),
      alertText: {
        en: 'Magitek Ray',
        de: 'Magitek-Laser',
        fr: 'Rayon Magitek',
        ko: '마도 레이저',
        ja: '魔導レーザー',
        cn: '直线AOE',
      },
      tts: {
        en: 'beam',
        de: 'leser',
        fr: 'laser',
        ko: '레이저',
        ja: 'レーザー',
        cn: '激光',
      },
    },
    {
      id: 'O7S Arm And Hammer',
      regex: Regexes.startsUsing({ id: '2789', source: 'Guardian' }),
      regexDe: Regexes.startsUsing({ id: '2789', source: 'Wächter' }),
      regexFr: Regexes.startsUsing({ id: '2789', source: 'Gardien' }),
      regexJa: Regexes.startsUsing({ id: '2789', source: 'ガーディアン' }),
      regexCn: Regexes.startsUsing({ id: '2789', source: '守护者' }),
      regexKo: Regexes.startsUsing({ id: '2789', source: '가디언' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O7S Orb Marker',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Orb Marker',
        de: 'Orb Marker',
        fr: 'Orbe',
        ko: '원자 파동 징',
        ja: 'マーカー',
        cn: '死刑点名',
      },
      tts: {
        en: 'orb',
        de: 'orb',
        fr: 'orbe',
        ko: '원자 파동',
        ja: 'マーカー',
        cn: '球',
      },
    },
    {
      id: 'O7S Blue Marker',
      regex: Regexes.headMarker({ id: '000E' }),
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Blue Marker on YOU',
          de: 'Aura-Kanone auf DIR',
          fr: 'Marque Bleue sur VOUS',
          ko: '파란징 → 나',
          ja: '青玉 on YOU',
          cn: '蓝球点名',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Blue Marker on ' + data.ShortName(matches.target),
          de: 'Aura-Kanone auf ' + data.ShortName(matches.target),
          fr: 'Marque Bleue sur ' + data.ShortName(matches.target),
          ko: '파란징 → ' + data.ShortName(matches.target),
          ja: '青玉 on ' + data.ShortName(matches.target),
          cn: '蓝球点名' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'blue marker',
          de: 'aura-kanone',
          fr: 'marque bleu',
          ko: '파란징',
          ja: '青玉ついた',
          cn: '蓝球',
        };
      },
    },
    {
      id: 'O7S Prey',
      regex: Regexes.headMarker({ id: '001E' }),
      response: Responses.preyOn('info'),
    },
    {
      id: 'O7S Searing Wind',
      regex: Regexes.gainsEffect({ effect: 'Searing Wind' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gluthitze' }),
      regexFr: Regexes.gainsEffect({ effect: 'Fournaise' }),
      regexJa: Regexes.gainsEffect({ effect: '灼熱' }),
      regexCn: Regexes.gainsEffect({ effect: '灼热' }),
      regexKo: Regexes.gainsEffect({ effect: '작열' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.getOut(),
    },
    {
      id: 'O7S Abandonment',
      regex: Regexes.gainsEffect({ effect: 'Abandonment' }),
      regexDe: Regexes.gainsEffect({ effect: 'Verlassen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Isolement' }),
      regexJa: Regexes.gainsEffect({ effect: '孤独感' }),
      regexCn: Regexes.gainsEffect({ effect: '孤独感' }),
      regexKo: Regexes.gainsEffect({ effect: '고독감' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Abandonment: stay middle',
        de: 'Verlassen: Bleib mittig',
        fr: 'Isolement : restez au milieu',
        ko: '고독감: 중앙에 있기',
        ja: '孤独: 内側へ',
        cn: '呆在中间',
      },
      tts: {
        en: 'abandonment',
        de: 'verlassen',
        fr: 'isolement',
        ko: '고독감',
        ja: '孤独',
        cn: '孤独',
      },
    },
    {
      id: 'O7S Rot',
      regex: Regexes.gainsEffect({ effect: 'Aether Rot' }),
      regexDe: Regexes.gainsEffect({ effect: 'Ätherfäule' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pourriture Éthéréenne' }),
      regexJa: Regexes.gainsEffect({ effect: 'エーテルロット' }),
      regexCn: Regexes.gainsEffect({ effect: '以太病毒' }),
      regexKo: Regexes.gainsEffect({ effect: '에테르 부패' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Rot on you',
            de: 'Fäule auf DIR',
            fr: 'Pourriture sur VOUS',
            ko: '에테르 → 나',
            ja: 'ロット on YOU',
            cn: '以太病毒点名',
          };
        }
        return {
          en: 'Rot on ' + data.ShortName(matches.target),
          de: 'Fäule auf ' + data.ShortName(matches.target),
          fr: 'Pourriture sur ' + data.ShortName(matches.target),
          ko: '에테르 → ' + data.ShortName(matches.target),
          ja: 'ロット on ' + data.ShortName(matches.target),
          cn: '以太病毒点名' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches.target)
          return;

        return {
          en: 'rot',
          de: 'fäule',
          fr: 'pourriture',
          ja: 'ロット',
          cn: '结束前传毒',
        };
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: Regexes.startsUsing({ id: '2AB5', source: 'Ultros' }),
      regexDe: Regexes.startsUsing({ id: '2AB5', source: 'Ultros' }),
      regexFr: Regexes.startsUsing({ id: '2AB5', source: 'Orthros' }),
      regexJa: Regexes.startsUsing({ id: '2AB5', source: 'オルトロス' }),
      regexCn: Regexes.startsUsing({ id: '2AB5', source: '奥尔特罗斯' }),
      regexKo: Regexes.startsUsing({ id: '2AB5', source: '오르트로스' }),
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'O7S Load',
      // Load: 275C
      // Skip: 2773
      // Retrieve: 2774
      // Paste: 2776
      regex: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: '가디언', capture: false }),
      preRun: function(data) {
        data.loadCount = ++data.loadCount || 1;
        data.thisLoad = undefined;
        data.thisLoadText = undefined;
        data.thisLoadTTS = undefined;

        if (data.loadCount == 1) {
          // First load is unknown.
          data.thisLoad = 'screen';
        } else if (data.loadCount == 2) {
          data.thisLoad = data.first == 'biblio' ? 'dada' : 'biblio';
        } else if (data.loadCount == 3) {
          data.thisLoad = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.loadCount == 4) {
          data.thisLoad = data.first == 'biblio' ? 'ships' : 'ultros';
        } else if (data.loadCount == 5) {
          data.thisLoad = 'virus';
        } else if (data.loadCount == 6) {
          data.thisLoad = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.loadCount == 7) {
          // This is the post-virus Load/Skip divergence.
          data.thisLoad = 'screen';
        } else if (data.loadCount == 8) {
          data.thisLoad = data.second == 'biblio' ? 'dada' : 'biblio';
        } else if (data.loadCount == 9) {
          data.thisLoad = data.first == 'biblio' ? 'ships' : 'ultros';
        }

        if (!data.thisLoad) {
          console.error('Unknown load: ' + data.loadCount);
          return;
        }
        data.thisLoadText = ({
          'screen': 'Biblio?/Knockback?',
          'biblio': 'Biblio: Positions',
          'dada': 'Dada: Knockback',
          'ships': 'Ships: Out of Melee',
          'ultros': 'Ultros: Ink Spread',
          '(?<!\\w)virus': 'VIRUS',
        })[data.thisLoad];

        data.thisLoadTTS = ({
          'screen': 'screen',
          'biblio': 'biblio positions',
          'dada': 'knockback',
          'ships': 'get out',
          'ultros': 'ink ink ink',
          '(?<!\\w)virus': 'virus',
        })[data.thisLoad];
      },
      alertText: function(data) {
        return data.thisLoadText;
      },
      tts: function(data) {
        return data.thisLoadTTS;
      },
    },
    {
      id: 'O7S Run',
      regex: Regexes.startsUsing({ id: '276F', source: 'Guardian', capture: false }),
      regexDe: Regexes.startsUsing({ id: '276F', source: 'Wächter', capture: false }),
      regexFr: Regexes.startsUsing({ id: '276F', source: 'Gardien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '276F', source: 'ガーディアン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '276F', source: '守护者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '276F', source: '가디언', capture: false }),
      preRun: function(data) {
        data.runCount = ++data.runCount || 1;
        data.thisRunText = undefined;
        data.thisRunTTS = undefined;

        if (data.runCount == 1)
          data.thisRun = data.first == 'biblio' ? 'dada' : 'dada';
        else if (data.runCount == 2)
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        else if (data.runCount == 3)
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';
        else if (data.runCount == 4)
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        else if (data.runCount == 5)
          data.thisRun = 'biblio';
        else if (data.runCount == 6)
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';


        data.thisRunText = ({
          'biblio': 'Biblio Add',
          'dada': 'Dada Add',
          'ships': 'Ship Adds',
          'ultros': 'Ultros Add',
        })[data.thisRun];

        data.thisRunTTS = data.thisRunText;
      },
      infoText: function(data) {
        return data.thisRunText;
      },
      tts: function(data) {
        return data.thisRunTTS;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Air Force': 'Luftwaffe',
        'Dadaluma(?! )': 'Dadarma',
        'Fire Control System': 'Feuerleitsystem',
        'Guardian': 'Wächter',
        'Interdimensional Bomb': 'interdimensional(?:e|er|es|en) Bombe',
        'Ultros': 'Ultros',
        'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert',
        'Searing Wind': 'Gluthitze',
      },
      'replaceText': {
        'Aether Rot': 'Ätherfäule',
        'Arm And Hammer': 'Arm-Hammer',
        'Atomic Ray': 'Atomstrahlung',
        'Aura Cannon': 'Aura-Kanone',
        'Biblio': 'Bibliotaph',
        'Bomb Deployment': 'Bombeneinsatz',
        'Chain Cannon': 'Kettenkanone',
        'Chakra Burst': 'Chakra-Ausbruch',
        'Copy Program': 'Programm kopieren',
        'Copy(?! Program)': 'Kopieren',
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
        'Magnetism': 'Magnetismus',
        'Main Cannon': 'Hauptkanone',
        'Missile Simulation': 'Raketensimulation',
        'Missile(?![ |\\w])': 'Rakete',
        'Paste Program': 'Programm einfügen',
        'Paste(?! Program)': 'Einfügen',
        'Plane Laser': 'Luftwaffe Add Laser',
        'Prey': 'Beute',
        'Radar': 'Radar',
        'Repel': 'Abstoßung',
        'Retrieve Air Force': 'Luftwaffe Wiederherstellen',
        'Retrieve Program': 'Programm wiederherstellen',
        'Retrieve Ultros': 'Ultros Wiederherstellen',
        'Run Program': 'Programm starten',
        'Run(?! Program)': 'Start',
        'Shockwave': 'Schockwelle',
        'Skip Program': 'Programm überspringen',
        'Skip(?! Program)': 'Überspringen',
        '(?<! )Stoneskin': 'Steinhaut',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Tentacle(?! )': 'Tentakel',
        'Tentacle Simulation': 'Tentakelsimulation',
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
        'Dadaluma': 'Dadaluma',
        'Fire Control System': 'système de contrôle',
        'Guardian': 'gardien',
        'Interdimensional Bomb': 'bombe dimensionnelle',
        'Ultros': 'Orthros',
        'WEAPON SYSTEMS ONLINE': 'Démarrage du système de contrôle... Activation du programme initial... Gardien, au combat',
      },
      'replaceText': {
        'Aether Rot': 'Pourriture éthéréenne',
        'Arm And Hammer': 'Marteau stratégique',
        'Atomic Ray': 'Rayon atomique',
        'Aura Cannon': 'Rayon d\'aura',
        'Biblio': 'Bibliotaphe',
        'Bomb Deployment': 'Déploiement de bombes',
        'Chain Cannon': 'Canon automatique',
        'Chakra Burst': 'Explosion d\'aura',
        'Copy Program': 'Copie de programme',
        'Copy(?! Program)': 'Copie',
        'Dada': 'Dadaluma',
        'Demon Simulation': 'Chargement : démon',
        'Diffractive Laser': 'Laser diffracteur',
        'Diffractive Plasma': 'Plasma diffracteur',
        'Electric Pulse': 'Impulsion électrique',
        'Explosion': 'Explosion',
        'Ink': 'Encre',
        'Interrupt Stoneskin': 'Interrompre Cuirasse',
        'Light Blast': 'Déflagration légère',
        'Load': 'Chargement',
        'Magitek Ray': 'Rayon magitek',
        'Magnetism': 'Magnétisme',
        'Main Cannon': 'Canon principal',
        'Missile Simulation': 'Chargement : missiles',
        'Missile(?![ |\\w])': 'Missile',
        'Paste Program': 'Collage de programme',
        'Paste(?! Program)': 'Collage',
        'Plane Laser': 'Laser force aérienne',
        'Prey': 'Proie',
        'Radar': 'Radar',
        'Repel': 'Répulsion',
        'Retrieve Air Force': 'Programme Précédent Force Aérienne',
        'Retrieve Program': 'Programme précédent',
        'Retrieve Ultros': 'Programme Précédent Orthros',
        'Run Program': 'Programme de matérialisation',
        'Run(?! Program)': 'Programme',
        'Shockwave': 'Onde de choc',
        'Skip Program': 'Saut de programme',
        'Skip(?! Program)': 'Saut De Programme',
        '(?<! )Stoneskin': 'Cuirasse',
        'Temporary Misdirection': 'Démence',
        'Tentacle(?! )': 'Tentacule',
        'Tentacle Simulation': 'Chargement : tentacule',
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
        'Dadaluma': 'ダダルマー',
        'Fire Control System': 'ファイアコントロールシステム',
        'Guardian': 'ガーディアン',
        'Interdimensional Bomb': '次元爆弾',
        'Ultros': 'オルトロス',
        'WEAPON SYSTEMS ONLINE': 'WEAPON SYSTEMS ONLINE', // FIXME
      },
      'replaceText': {
        'Aether Rot': 'エーテルロット',
        'Arm And Hammer': 'アームハンマー',
        'Atomic Ray': 'アトミックレイ',
        'Aura Cannon': 'オーラキャノン',
        'Biblio': 'Biblio', // FIXME
        'Bomb Deployment': '爆弾設置',
        'Chain Cannon': 'チェーンガン',
        'Chakra Burst': 'チャクラバースト',
        'Copy Program': 'プログラム・コピー',
        'Copy(?! Program)': 'Copy', // FIXME
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
        'Magnetism': '磁力',
        'Main Cannon': 'メインカノン',
        'Missile Simulation': 'ローディング：ミサイル',
        'Missile(?![ |\\w])': 'ミサイル',
        'Paste Program': 'プログラム・ペースト',
        'Paste(?! Program)': 'Paste', // FIXME
        'Plane Laser': 'Plane Laser', // FIXME
        'Prey': 'プレイ',
        'Radar': 'Radar', // FIXME
        'Repel': '反発',
        'Retrieve Air Force': 'Retrieve Air Force', // FIXME
        'Retrieve Program': 'リバース・ローディング',
        'Retrieve Ultros': 'Retrieve Ultros', // FIXME
        'Run Program': '実体化プログラム',
        'Run(?! Program)': 'Run', // FIXME
        'Shockwave': '衝撃波',
        'Skip Program': 'スキップ・ローディング',
        'Skip(?! Program)': 'Skip', // FIXME
        '(?<! )Stoneskin': 'ストンスキン',
        'Temporary Misdirection': '心神喪失',
        'Tentacle(?! )': 'たこあし',
        'Tentacle Simulation': 'ローディング：たこあし',
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
        'Dadaluma': '达达鲁玛',
        'Fire Control System': '武器火控系统',
        'Guardian': '守护者',
        'Interdimensional Bomb': '次元炸弹',
        'Ultros': '奥尔特罗斯',
        'WEAPON SYSTEMS ONLINE': '武器火控系统启动',
      },
      'replaceText': {
        'Aether Rot': '以太病毒',
        'Arm And Hammer': '臂锤',
        'Atomic Ray': '原子射线',
        'Aura Cannon': '斗气炮',
        'Biblio': '永世珍本',
        'Bomb Deployment': '设置炸弹',
        'Chain Cannon': '链式机关炮',
        'Chakra Burst': '脉轮爆发',
        'Copy Program': '复制程序',
        'Copy(?! Program)': '复制',
        'Dada': '达达鲁玛',
        'Demon Simulation': '加载恶魔模拟程序',
        'Diffractive Laser': '扩散射线',
        'Diffractive Plasma': '扩散离子',
        'Electric Pulse': '电磁脉冲',
        'Explosion': '爆炸',
        'Ink': '墨汁',
        'Interrupt Stoneskin': '打断石肤',
        'Light Blast': '小规模爆炸',
        'Load': '加载',
        'Magitek Ray': '魔导激光',
        'Magnetism': '磁力',
        'Main Cannon': '主加农炮',
        'Missile Simulation': '加载导弹模拟程序',
        'Missile(?![ |\\w])': '导弹',
        'Paste Program': '粘贴程序',
        'Paste(?! Program)': '粘贴',
        'Plane Laser': '平面激光',
        'Prey': '猎物',
        'Radar': '雷达',
        'Repel': '相斥',
        'Retrieve Air Force': '接小飞机',
        'Retrieve Program': '反向加载',
        'Retrieve Ultros': '接奥尔特罗斯',
        'Run Program': '实体化程序',
        'Run(?! Program)': '跑',
        'Shockwave': '冲击波',
        'Skip Program': '跳跃加载',
        'Skip(?! Program)': '跳跃',
        '(?<! )Stoneskin': '石肤',
        'Temporary Misdirection': '精神失常',
        'Tentacle(?! )': '腕足',
        'Tentacle Simulation': '加载腕足模拟程序',
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
        'Dadaluma': '다다루마',
        'Fire Control System': '병기 제어 시스템',
        'Guardian': '가디언',
        'Interdimensional Bomb': '차원 폭탄',
        'Ultros': '오르트로스',
        'WEAPON SYSTEMS ONLINE': 'WEAPON SYSTEMS ONLINE', // FIXME
      },
      'replaceText': {
        'Aether Rot': '에테르 부패',
        'Arm And Hammer': '양팔 내리치기',
        'Atomic Ray': '원자 파동',
        'Aura Cannon': '오라 포격',
        'Biblio': '비블리오',
        'Bomb Deployment': '폭탄 설치',
        'Chain Cannon': '기관총',
        'Chakra Burst': '차크라 폭발',
        'Copy Program': '프로그램 복사',
        'Copy(?! Program)': '복사',
        'Dada': '다다',
        'Demon Simulation': '불러오기: 악마',
        'Diffractive Laser': '확산 레이저',
        'Diffractive Plasma': '확산 플라스마',
        'Electric Pulse': '전기 충격',
        'Explosion': '폭발',
        'Ink': '먹물',
        'Interrupt Stoneskin': '스톤스킨 취소됨',
        'Light Blast': '소규모 폭발',
        'Load': '불러오기',
        'Magitek Ray': '마도 레이저',
        'Magnetism': '자력',
        'Main Cannon': '주포',
        'Missile Simulation': '불러오기: 미사일',
        'Missile(?![ |\\w])': '미사일',
        'Paste Program': '프로그램 붙여넣기',
        'Paste(?! Program)': '붙여넣기',
        'Plane Laser': '에어포스 레이저',
        'Prey': 'プレイ',
        'Radar': '레이더',
        'Repel': '반발',
        'Retrieve Air Force': 'Retrieve Air Force', // FIXME
        'Retrieve Program': '역순 불러오기',
        'Retrieve Ultros': 'Retrieve Ultros', // FIXME
        'Run Program': '실체화 프로그램',
        'Run(?! Program)': '실체화',
        'Shockwave': '충격파',
        'Skip Program': '건너뛰기',
        'Skip(?! Program)': '건너뛰기',
        '(?<! )Stoneskin': '스톤스킨',
        'Temporary Misdirection': '심신상실',
        'Tentacle(?! )': '문어발',
        'Tentacle Simulation': '불러오기: 문어발',
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
        'Prey': '징',
        'Searing Wind': '작열',
        'Stun': '기절',
        'Temporary Misdirection': '심신상실',
        'Ultros Simulation': '오르트로스 프로그램',
        '(?<!\\w)Virus': '바이러스 프로그램',
      },
    },
  ],
}];
