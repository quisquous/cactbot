'use strict';

// O7S - Sigmascape 3.0 Savage
// localization:
//   de: timeline done, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: /^Sigmascape V3\.0 \(Savage\)$/,
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
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
      },
      tts: {
        en: 'beam',
        de: 'leser',
        fr: 'laser',
        ko: '레이저',
        ja: 'レーザー',
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
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '탱버 → 나',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tenkbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ko: '탱버 → ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ko: '탱버',
            ja: 'バスター',
          };
        }
      },
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
      },
      tts: {
        en: 'orb',
        de: 'orb',
        fr: 'orbe',
        ko: '원자 파동',
        ja: 'マーカー',
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
        };
      },
    },
    {
      id: 'O7S Prey',
      regex: Regexes.headMarker({ id: '001E' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Prey on YOU',
            de: 'Rakete auf DIR',
            fr: 'Marquage sur VOUS',
            ko: '빨간징 → 나',
            ja: 'マーカー on YOU',
          };
        }
        return {
          en: 'Prey on ' + data.ShortName(matches.target),
          de: 'Beute auf ' + data.ShortName(matches.target),
          fr: 'Marquage sur ' + data.ShortName(matches.target),
          ko: '빨간징 → ' + data.ShortName(matches.target),
          ja: 'マーカー on ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'prey',
          de: 'beute',
          fr: 'marquage',
          ko: '빨간징',
          ja: 'マーカー',
        };
      },
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
      alarmText: {
        en: 'Searing Wind: go outside',
        de: 'Gluthitze: Geh weg',
        fr: 'Fournaise : éloignez-vous',
        ko: '작열: 바깥으로',
        ja: '灼熱: 外側へ',
      },
      tts: {
        en: 'searing wind',
        de: 'gluthitze',
        fr: 'fournaise',
        ko: '작열',
        ja: '灼熱',
      },
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
      },
      tts: {
        en: 'abandonment',
        de: 'verlassen',
        fr: 'isolement',
        ko: '고독감',
        ja: '孤独',
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
          };
        }
        return {
          en: 'Rot on ' + data.ShortName(matches.target),
          de: 'Fäule auf ' + data.ShortName(matches.target),
          fr: 'Pourriture sur ' + data.ShortName(matches.target),
          ko: '에테르 → ' + data.ShortName(matches.target),
          ja: 'ロット on ' + data.ShortName(matches.target),
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
        };
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: Regexes.startsUsing({ id: '2AB5', source: 'Ultros', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2AB5', source: 'Ultros', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2AB5', source: 'Orthros', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2AB5', source: 'オルトロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2AB5', source: '奥尔特罗斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2AB5', source: '오르트로스', capture: false }),
      alarmText: function(data) {
        if (data.CanSilence()) {
          return {
            en: 'SILENCE!',
            de: 'VERSTUMMEN!',
            fr: 'SILENCE!',
            ko: '침묵!',
            ja: '沈黙！',
          };
        }
      },
      infoText: function(data) {
        if (!data.CanSilence()) {
          return {
            en: 'Silence',
            de: 'stumm',
            fr: 'silence',
            ko: '침묵',
            ja: '沈黙',
          };
        }
      },
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
          'virus': 'VIRUS',
        })[data.thisLoad];

        data.thisLoadTTS = ({
          'screen': 'screen',
          'biblio': 'biblio positions',
          'dada': 'knockback',
          'ships': 'get out',
          'ultros': 'ink ink ink',
          'virus': 'virus',
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
        'Dadaluma': 'Dadarma',
        'Fire Control System': 'Feuerleitsystem',
        'Guardian': 'Wächter',
        'Interdimensional Bomb': 'Interdimensional[a] Bombe',
        'Ultros': 'Ultros',
        'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert',
      },
      'replaceText': {
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
        'Tentacle': 'Tentakel',
        'Tentacle Simulation': 'Tentakelsimulation',
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
        'Retrieve Ultros': 'Ultros Wiederherstellen',
        'Retrieve Air Force': 'Luftwaffe Wiederherstellen',
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
      'locale': 'fr',
      'replaceSync': {
        'Dadaluma Simulation': 'Programme Dadaluma',
        'Bibliotaph Simulation': 'Programme Bibliotaphe',
        'Air Force': 'Force Aérienne',
        'Dadaluma': 'Dadaluma',
        'Fire Control System': 'Système De Contrôle',
        'Guardian': 'Gardien',
        'Interdimensional Bomb': 'Bombe Dimensionnelle',
        'Ultros': 'Orthros',
        'WEAPON SYSTEMS ONLINE': 'Démarrage du système de contrôle... Activation du programme initial... Gardien, au combat',
      },
      'replaceText': {
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Arm And Hammer': 'Marteau Stratégique',
        'Atomic Ray': 'Rayon Atomique',
        'Aura Cannon': 'Rayon D\'aura',
        'Bomb Deployment': 'Déploiement De Bombes',
        'Chain Cannon': 'Canon Automatique',
        'Chakra Burst': 'Explosion De Chakra',
        'Copy Program': 'Copie De Programme',
        'Demon Simulation': 'Chargement : Démon',
        'Diffractive Laser': 'Laser Diffracteur',
        'Diffractive Plasma': 'Plasma Diffracteur',
        'Electric Pulse': 'Impulsion électrique',
        'Engage!': 'À l\'attaque',
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
        'Tentacle': 'Tentacule',
        'Tentacle Simulation': 'Chargement : Tentacule',
        'The Heat': 'Carbonisation',
        'Viral Weapon': 'Arme Virologique',
        'Wallop': 'Taloche Tentaculaire',
        'Prey': 'Marquage',
        'Aether Rot': 'Pourriture éthéréenne',
        'Copy': 'Copie',
        'Skip': 'Saut De Programme',
        'Dada': 'Dadaluma',
        'Run': 'Programme',
        'Interrupt Stoneskin': 'Interrompre Cuirasse',
        'Magnetism/Repel': 'Magnétisme/Répulsion',
        'Temporary Misdirection': 'Démence',
        'Radar': 'Radar',
        'Paste': 'Collage',
        'Biblio': 'Bibliotaphe',
        'Plane Laser': 'Laser force aérienne',
        'Virus': 'Virus',
        'Enrage': 'Enrage',
        'Retrieve Ultros': 'Programme Précédent Orthros',
        'Retrieve Air Force': 'Programme Précédent Force Aérienne',
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
      'locale': 'ja',
      'replaceSync': {
        'Air Force': 'エアフォース',
        'Dadaluma': 'ダダルマー',
        'Fire Control System': 'ファイアコントロールシステム',
        'Guardian': 'ガーディアン',
        'Interdimensional Bomb': '次元爆弾',
        'Ultros': 'オルトロス',
      },
      'replaceText': {
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
        'Tentacle': 'たこあし',
        'Tentacle Simulation': 'ローディング：たこあし',
        'The Heat': '熱風',
        'Viral Weapon': 'ウィルス兵器',
        'Wallop': '叩きつけ',

        // FIXME:
        'Aether Rot': 'Aether Rot',
        'Copy': 'Copy',
        'Skip': 'Skip',
        'Dada': 'Dada',
        'Run': 'Run',
        'Interrupt Stoneskin': 'Interrupt Stoneskin',
        'Magnetism/Repel': 'Magnetism/Repel',
        'Temporary Misdirection': 'Temporary Misdirection',
        'Radar': 'Radar',
        'Paste': 'Paste',
        'Biblio': 'Biblio',
        'Plane Laser': 'Plane Laser',
        'Virus': 'Virus',
        'Enrage': 'Enrage',
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
    {
      'locale': 'ko',
      'replaceSync': {
        'Air Force': '에어포스',
        'Dadaluma': '다다루마',
        'Fire Control System': '병기 제어 시스템',
        'Guardian': '가디언',
        'Interdimensional Bomb': '차원 폭탄',
        'Ultros': '오르트로스',
      },
      'replaceText': {
        '--targetable--': '--대상 지정 가능--',
        '--untargetable--': '--대상 지정 불가--',
        'Arm And Hammer': '양팔 내리치기',
        'Atomic Ray': '원자 파동',
        'Aura Cannon': '오라 포격',
        'Bomb Deployment': '폭탄 설치',
        'Chain Cannon': '기관총',
        'Chakra Burst': '차크라 폭발',
        'Copy Program': '프로그램 복사',
        'Demon Simulation': '불러오기: 악마',
        'Diffractive Laser': '확산 레이저',
        'Diffractive Plasma': '확산 플라스마',
        'Electric Pulse': '전기 충격',
        'Engage!': '전투 시작!',
        'Explosion': '폭발',
        'Ink': '먹물',
        'Light Blast': '소규모 폭발',
        'Load': '불러오기',
        'Magitek Ray': '마도 레이저',
        'Magnetism': '자력',
        'Main Cannon': '주포',
        'Missile': '미사일',
        'Missile Simulation': '불러오기: 미사일',
        'Paste Program': '프로그램 붙여넣기',
        'Repel': '반발',
        'Retrieve Program': '역순 불러오기',
        'Run Program': '실체화 프로그램',
        'Shockwave': '충격파',
        'Skip Program': '건너뛰기',
        'Stoneskin': '스톤스킨',
        'Tentacle': '문어발',
        'Tentacle Simulation': '불러오기: 문어발',
        'The Heat': '작열',
        'Viral Weapon': '바이러스 병기',
        'Wallop': '매질',

        'Aether Rot': '에테르 부패',
        'Copy': '복사',
        'Skip': '건너뛰기',
        'Dada': '다다',
        'Run': '실체화',
        'Interrupt Stoneskin': '스톤스킨 취소됨',
        'Magnetism/Repel': '자력/반발',
        'Temporary Misdirection': '심신상실',
        'Radar': '레이더',
        'Paste': '붙여넣기',
        'Biblio': '비블리오',
        'Plane Laser': '에어포스 레이저',
        'Virus': '바이러스',
        'Enrage': '전멸기',
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
        'Virus': '바이러스 프로그램',
      },
    },
  ],
}];
