// O7S - Sigmascape 3.0 Savage
// localized sync and triggers should work for En, De now. TODO: Add Sync for sync Ja, Fr
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
  timelineFile: 'o7s.txt',
  timelineReplace: [
  {
    locale: 'de',
    replaceText: {
      'Magitek Ray': 'Magitek-Laser',
		  'Arm And Hammer': 'Arm-Hammer',
	  	'Atomic Ray': 'Atomstrahlung',
	  	'Prey': 'Rakete',
      'Load': 'Laden',
      'Shockwave': 'Schockwelle',
      'Demon Simulation': 'Dämonensimulation',
      'Dada': 'Dadarma',
      'Skip': 'Überspringen',
      'Ultros': 'Ultros',
      'Missile Simulation': 'Raketensimulation',
      'Chakra Burst': 'Chakra-Ausbruch',
      'Run': 'Start',
      'Aura Cannon': 'Aura-Kanone',
      'Retrieve': 'Wiederherstellen',
      'Ink': 'Tinte',
      'Copy': 'Kopieren',
      'Diffractive Plasma': 'Diffusionsplasma',
      'Tentacle Simulation': 'Tentakelsimulation',
      'Tentacle': 'Tentakel erscheinen',
      'Wallop': 'Tentakel',
      'Interrupt Stoneskin': 'Steinhaut unterbrechen',
      '--untargetable--': '--nich anvisierbar--',
      'Chain Cannon': 'Kettenkanone',
      'Main Cannon': 'Hauptkanone',
      '--targetable--': '--anvisierbar--',
      'Air Force': 'Luftwaffe',
      'Diffractive Laser': 'Diffraktiver Laser',
      'Bomb Deployment': 'Bombeneinsatz',
      'Plane Laser': 'Luftwaffe Add Laser',
      'Virus': 'Virus',
      'Aether Rot': 'Ätherfäule',
      'Magnetism/Repel': 'Magnetismus', //hex:2779
      'Viral Weapon': 'Panikvirus',
      'Temporary Misdirection': 'Plötzliche Panik',
      'Radar': 'Radar',
      'Paste': 'Einfügen',
      'Biblio': 'Bibliotaph',
      'Enrage': 'Finalangriff',
      },
    replaceSync: {
      'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert. Basisprogramm',
      'Guardian': 'Wächter',
      'Dadaluma Simulation': 'Dadarma-Kampfprogramm',
      'Fire Control System': 'Feuerleitsystem',
      'Bibliotaph': 'Bibliotaph',
      'Dadaluma': 'Dadarma',
    },
  },
  ],
  triggers: [
    {
      regex: / 1A:(\y{Name}) gains the effect of (?:エーテルロット|Aether Rot|Ätherfäule|Pourriture éthéréenne) from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = true;
      },
    },
    {
      regex: / 1E:(\y{Name}) loses the effect of (?:エーテルロット|Aether Rot|Ätherfäule|Pourriture éthéréenne) from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = false;
      },
    },
    {
      regex: / 1A:(?:ガーディアン|Guardian|Wächter|Gardien) gains the effect of (?:ダダルマー・プログラム|Dadaluma Simulation|Dadarma-Kampfprogramm|Programme Dadaluma)/,
      condition: function(data, matches) { return !data.first || data.seenVirus && !data.second },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'dada';
        else
          data.first = 'dada';
      },
    },
    {
      regex: / 1A:(?:ガーディアン|Guardian|Wächter|Gardien) gains the effect of (?:ビブリオタフ・プログラム|Bibliotaph Simulation|Bibliotaph-Kampfprogramm|Programme Bibliotaphe)/,
      condition: function(data, matches) { return !data.first || data.seenVirus && !data.second },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'biblio';
        else
          data.first = 'biblio';
      },
    },
    {
      regex: / 1A:(?:ガーディアン|Guardian|Wächter|Gardien) gains the effect of (?:ウィルス・プログラム|Virus|Virus|Programme Virus)/,
      run: function(data) {
        data.seenVirus = true;
      },
    },


    {
      id: 'O7S Magitek Ray',
	  regex: / 14:2788:(?:ガーディアン|Guardian|Wächter|Gardien) starts using (?:魔導レーザー|Magitek Ray|Magitek-Laser|Rayon Magitek)/,
      alertText: function(data) {
		  return {
			  en: 'Magitek Ray',
			  de: 'Magitek-Laser'
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'beam',
			  de: 'laser',
		  };
	  },
    },
    {
      id: 'O7S Arm And Hammer',
      regex: / 14:2789:(?:ガーディアン|Guardian|Wächter|Gardien) starts using (?:アームハンマー|Arm And Hammer|Arm-Hammer|Marteau Stratégique) on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'Tank Buster on YOU',
			  de: 'Tank Buster auf DIR',
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
			  de: 'buster',
		  };
		if (data.role == 'healer')
		  return {
			en: 'buster',
			de: 'buster',
		  };
      },
    },
    {
      id: 'O7S Orb Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: function(data) {
		  return {
			  en: 'Orb Marker',
			  de: 'Orb Marker'
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'orb',
			  de: 'orb marker',
		  };
	  },
    },
    {
      id: 'O7S Blue Marker',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'Blue Marker on YOU',
			  de: 'Aura-Kanone auf DIR',
		  };
      },
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return {
			  en: 'Blue Marker on ' + data.ShortName(matches[1]),
			  de: 'Aura-Kanone auf ' + data.ShortName(matches[1]),
		  };
      },
      tts: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'blue marker',
			  de: 'aura-kanone',
		  };
      },
    },
    {
      id: 'O7S Prey',
      regex: /1B:........:(\y{Name}):....:....:001E:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'Prey on YOU',
			  de: 'Rakete auf dir'
		  };
        return {
			en: 'Prey on ' + data.ShortName(matches[1]),
			de: 'Rakete auf ' + data.ShortName(matches[1]),
		};
      },
      tts: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'prey',
			  de: 'rakete',
		  };
      },
    },
    {
      id: 'O7S Searing Wind',
      regex: / 1A:(\y{Name}) gains the effect of (?:灼熱|Searing Wind|Gluthitze|Fournaise)/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) {
		  return {
			  en: 'Searing Wind: go outside',
			  de: 'Gluthitze: Geh weg',
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'searing wind',
			  de: 'gluthitze',
		  };
	  },
    },
    {
      id: 'O7S Abandonment',
      regex: / 1A:(\y{Name}) gains the effect of (?:孤独感|Abandonment|Verlassen|Isolement)/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) {
		  return {
			  en: 'Abandonment: go mid',
			  de: 'Verlassen: Geh Mitte',
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'abandonment',
			  de: 'verlassen',
		  };
	  },
    },
    {
      id: 'O7S Rot',
      regex: / 1A:(\y{Name}) gains the effect of (?:エーテルロット|Aether Rot|Ätherfäule|Pourriture éthéréenne) from/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'Rot on you',
			  de: 'Fäule auf DIR',
		  };
        return {
			en: 'Rot on ' + data.ShortName(matches[1]),
			de: 'Fäule auf ' + data.ShortName(matches[1]),
		};
      },
      tts: function(data, matches) {
        if (data.me == matches[1])
          return {
			  en: 'rot',
			  de: 'fäule',
		  };
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: / 14:2AB5:(?:|Ultros|Ultros|) starts using (?:ストンスキン|Stoneskin|Steinhaut|Cuirasse)/,
      alarmText: function(data) {
        if (data.job == 'NIN' || data.role == 'dps-ranged')
          return {
			  en: 'SILENCE!',
			  de: 'VERSTUMMEN!',
		  };
      },
      infoText: function(data) {
        if (data.job != 'NIN' && data.role != 'dps-ranged')
          return {
			  en: 'Silence',
			  de: 'stumm',
		  };
      },
      tts: function(data) {
		  return {
			  en: 'silence',
			  de: 'stumm',
		  };
	  },
    },
    {
      id: 'O7S Load',
      // Load: 275C
      // Skip: 2773
      // Retrieve: 2774
      // Paste: 2776
      regex: / 14:(?:275C|2773|2774|2776):(?:ガーディアン|Guardian|Wächter|Gardien) starts using/,
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
      alertText: function (data) { return data.thisLoadText; },
      tts: function(data) { return data.thisLoadTTS; },
    },
    {
      id: 'O7S Run',
      regex: / 14:276F:(?:ガーディアン|Guardian|Wächter|Gardien) starts using (?:実体化プログラム|Run Program|Programm Starten|Programme De Matérialisation)/,
      preRun: function(data) {
        data.runCount = ++data.runCount || 1;
        data.thisRunText = undefined;
        data.thisRunTTS = undefined;

        if (data.runCount == 1) {
          data.thisRun = data.first == 'biblio' ? 'dada' : 'dada';
        } else if (data.runCount == 2) {
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.runCount == 3) {
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';
        } else if (data.runCount == 4) {
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.runCount == 5) {
          data.thisRun = 'biblio';
        } else if (data.runCount == 6) {
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';
        }

        data.thisRunText = ({
          'biblio': 'Biblio Add',
          'dada': 'Dada Add',
          'ships': 'Ship Adds',
          'ultros': 'Ultros Add',
        })[data.thisRun];

        data.thisRunTTS = data.thisRunText;
      },
      infoText: function(data) { return data.thisRunText; },
      tts: function(data) { return data.thisRunTTS; },
    },
  ]
}]
