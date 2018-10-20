'use strict';

// O7S - Sigmascape 3.0 Savage
// localization:
//   de: timeline done, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot from/,
      regexDe: / 1A:(\y{Name}) gains the effect of Ätherfäule from/,
      regexFr: / 1A:(\y{Name}) gains the effect of Pourriture éthéréenne from/,
      regexJa: / 1A:(\y{Name}) gains the effect of エーテルロット from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.rot = true;
      },
    },
    {
      regex: / 1E:(\y{Name}) loses the effect of Aether Rot from/,
      regexDe: / 1E:(\y{Name}) loses the effect of Ätherfäule from/,
      regexFr: / 1E:(\y{Name}) loses the effect of Pourriture éthéréenne from/,
      regexJa: / 1E:(\y{Name}) loses the effect of エーテルロット from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.rot = false;
      },
    },
    {
      regex: / 1A:Guardian gains the effect of Dadaluma Simulation/,
      regexDe: / 1A:Wächter gains the effect of Dadarma-Kampfprogramm/,
      regexFr: / 1A:Gardien gains the effect of Programme Dadaluma/,
      regexJa: / 1A:ガーディアン gains the effect of ダダルマー・プログラム/,
      condition: function(data, matches) {
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
      regex: / 1A:Guardian gains the effect of Bibliotaph Simulation/,
      regexDe: / 1A:Wächter gains the effect of Bibliotaph-Kampfprogramm/,
      regexFr: / 1A:Gardien gains the effect of Programme Bibliotaphe/,
      regexJa: / 1A:ガーディアン gains the effect of ビブリオタフ・プログラム/,
      condition: function(data, matches) {
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
      regex: / 1A:Guardian gains the effect of Virus/,
      regexDe: / 1A:Wächter gains the effect of Virus/,
      regexFr: / 1A:Gardien gains the effect of Programme Virus/,
      regexJa: / 1A:ガーディアン gains the effect of ウィルス・プログラム/,
      run: function(data) {
        data.seenVirus = true;
      },
    },


    {
      id: 'O7S Magitek Ray',
      regex: / 14:2788:Guardian starts using (Magitek Ray)/,
      regexDe: / 14:2788:Wächter starts using (Magitek-Laser)/,
      regexFr: / 14:2788:Gardien starts using (Rayon Magitek)/,
      regexJa: / 14:2788:ガーディアン starts using (魔導レーザー)/,
      alertText: function(data, matches) {
        return matches[1];
      },
      tts: {
        en: 'beam',
        de: 'leser',
        fr: 'laser',
      },
    },
    {
      id: 'O7S Arm And Hammer',
      regex: / 14:2789:Guardian starts using Arm And Hammer on (\y{Name})/,
      regexDe: / 14:2789:Wächter starts using Arm-Hammer on (\y{Name})/,
      regexFr: / 14:2789:Gardien starts using Marteau Stratégique on (\y{Name})/,
      regexJa: / 14:2789:ガーディアン starts using アームハンマー on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O7S Orb Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Orb Marker',
        de: 'Orb Marker',
        fr: 'Orbe',
      },
      tts: {
        en: 'orb',
        de: 'orb',
        fr: 'orbe',
      },
    },
    {
      id: 'O7S Blue Marker',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me != matches[1])
          return;

        return {
          en: 'Blue Marker on YOU',
          de: 'Aura-Kanone auf DIR',
          fr: 'Marque Bleue sur VOUS',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return;

        return {
          en: 'Blue Marker on ' + data.ShortName(matches[1]),
          de: 'Aura-Kanone auf ' + data.ShortName(matches[1]),
          fr: 'Marque Bleue sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches[1])
          return;

        return {
          en: 'blue marker',
          de: 'aura-kanone',
          fr: 'marque bleu',
        };
      },
    },
    {
      id: 'O7S Prey',
      regex: /1B:........:(\y{Name}):....:....:001E:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Prey on YOU',
            de: 'Rakete auf DIR',
            fr: 'Marquage sur VOUS',
          };
        }
        return {
          en: 'Prey on ' + data.ShortName(matches[1]),
          de: 'Beute auf ' + data.ShortName(matches[1]),
          fr: 'Marquage sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches[1])
          return;

        return {
          en: 'prey',
          de: 'beute',
          fr: 'marquage',
        };
      },
    },
    {
      id: 'O7S Searing Wind',
      regex: / 1A:(\y{Name}) gains the effect of Searing Wind/,
      regexDe: / 1A:(\y{Name}) gains the effect of Gluthitze/,
      regexFr: / 1A:(\y{Name}) gains the effect of Fournaise/,
      regexJa: / 1A:(\y{Name}) gains the effect of 灼熱/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Searing Wind: go outside',
        de: 'Gluthitze: Geh weg',
        fr: 'Fournaise : éloignez-vous',
      },
      tts: {
        en: 'searing wind',
        de: 'gluthitze',
        fr: 'fournaise',
      },
    },
    {
      id: 'O7S Abandonment',
      regex: / 1A:(\y{Name}) gains the effect of Abandonment/,
      regexDe: / 1A:(\y{Name}) gains the effect of Verlassen/,
      regexFr: / 1A:(\y{Name}) gains the effect of Isolement/,
      regexJa: / 1A:(\y{Name}) gains the effect of 孤独感/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Abandonment: stay middle',
        de: 'Verlassen: Bleib mittig',
        fr: 'Isolement : restez au milieu',
      },
      tts: {
        en: 'abandonment',
        de: 'verlassen',
        fr: 'isolement',
      },
    },
    {
      id: 'O7S Rot',
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot from/,
      regexDe: / 1A:(\y{Name}) gains the effect of Ätherfäule from/,
      regexFr: / 1A:(\y{Name}) gains the effect of Pourriture éthéréenne from/,
      regexJa: / 1A:(\y{Name}) gains the effect of エーテルロット from/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Rot on you',
            de: 'Fäule auf DIR',
            fr: 'Pourriture sur VOUS',
          };
        }
        return {
          en: 'Rot on ' + data.ShortName(matches[1]),
          de: 'Fäule auf ' + data.ShortName(matches[1]),
          fr: 'Pourriture sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (data.me != matches[1])
          return;

        return {
          en: 'rot',
          de: 'fäule',
          fr: 'pourriture',
        };
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: / 14:2AB5:Ultros starts using Stoneskin/,
      regexDe: / 14:2AB5:Ultros starts using Steinhaut/,
      regexFr: / 14:2AB5:Orthros starts using Cuirasse/,
      regexJa: / 14:2AB5:オルトロス starts using ストンスキン/,
      alarmText: function(data) {
        if (data.job == 'NIN' || data.role == 'dps-ranged') {
          return {
            en: 'SILENCE!',
            de: 'VERSTUMMEN!',
            fr: 'SILENCE!',
          };
        }
      },
      infoText: function(data) {
        if (data.job != 'NIN' && data.role != 'dps-ranged') {
          return {
            en: 'Silence',
            de: 'stumm',
            fr: 'silence',
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
      regex: / 14:(?:275C|2773|2774|2776):Guardian starts using/,
      regexDe: / 14:(?:275C|2773|2774|2776):Wächter starts using/,
      regexFr: / 14:(?:275C|2773|2774|2776):Gardien starts using/,
      regexJa: / 14:(?:275C|2773|2774|2776):ガーディアン starts using/,
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
      regex: / 14:276F:Guardian starts using Run Program/,
      regexDe: / 14:276F:Wächter starts using Programm Starten/,
      regexFr: / 14:276F:Gardien starts using Programme De Matérialisation/,
      regexJa: / 14:276F:ガーディアン starts using 実体化プログラム/,
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
        'Enrage': 'Finalangriff',
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
  ],
}];
