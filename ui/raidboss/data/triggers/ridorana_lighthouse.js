[{
  zoneRegex: /^The Ridorana Lighthouse$/,
  timelineFile: 'ridorana_lighthouse.txt',
  timeline: [
    function(data) {
      return 'alerttext "Stone Breath" before 7 "Get Behind"';
    },
  ],
  triggers: [
    {
      id: 'Ridorana Famfrit Tide Pode',
      regex: / 14:2C3E:Famfrit, The Darkening Cloud starts using Tide Pod on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 4.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 16.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 28.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:0037:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Dorito Stack',
      },
      tts: {
        en: 'Stack',
      },
    },
    {
      id: 'Ridorana Famfrit Briny Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:008B:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Spread',
      },
      tts: {
        en: 'Spread',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Rain',
      regex: / 03:Added new combatant Dark Rain\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Belias Fire',
      regex: / 14:2CDB:Belias, The Gigas starts using Fire on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Belias Time Eruption',
      regex: / 14:2CDE:Belias, The Gigas starts using Time Eruption/,
      infoText: {
        en: 'Stand on Slow Clock',
      },
      tts: {
        en: 'Stand on Slow Clock',
      },
    },
    {
      id: 'Ridorana Belias Hand of Time',
      regex: / 1A:(\y{Name}) gains the effect of Burns from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Stretch Tether Outside',
      },
      tts: {
        en: 'Stretch Tether Outside',
      },
    },
    {
      id: 'Ridorana Belias Time Bomb',
      regex: / 14:2CE6:Belias, The Gigas starts using Time Bomb/,
      infoText: {
        en: 'Stop Clocks',
      },
      tts: {
        en: 'Stop Clocks',
      },
    },
    {
      id: 'Ridorana Belias Gigas',
      regex: / 03:Added new combatant Gigas\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Construct Destroy',
      regex: / 14:(?:2C5A|2C71):Construct 7 starts using Destroy on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Construct Accelerate Spread',
      regex: / 1B:........:(\y{Name}):....:....:008A:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data) {
        data.accelerateSpreadOnMe = true;
      },
      alertText: {
        en: 'Spread',
      },
      tts: {
        en: 'Spread',
      },
    },
    {
      id: 'Ridorana Construct Accelerate Stack',
      regex: / 1B:........:(\y{Name}):....:....:0064:0000:0000:0000:/,
      condition: function(data) { return !data.accelerateSpreadOnMe; },
      infoText: function(data, matches) {
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
      tts: {
        en: 'Stack',
      },
    },
    {
      // Accelerate cleanup
      regex: / 14:2C65:Construct 7 starts using Accelerate/,
      run: function(data) {
        delete data.accelerateSpreadOnMe;
      },
    },
    {
      // TODO: need an "always run this trigger when starting zone" option
      regex: / 14:2C6C:Construct 7 starts using Subtract/,
      run: function(data) {
        data.mathDirection = function() {
          if (!this.correctMath)
            return;
          console.log('Subtract: hp: ' + this.currentHP + ', boost: ' + (this.hpBoost || 0));
          var number = this.currentHP - (this.hpBoost || 0);
          if (number < 1 || number > 9) {
            console.error('Bad math: ' + number)
            return;
          }
          return [
            {
              en: 'Stay out',
            },
            {
              en: 'Stand in 1',
            },
            {
              en: 'Stand in 2',
            },
            {
              en: 'Stand in 3',
            },
            {
              en: 'Stand in 4',
            },
          ][this.correctMath[number]];
        };
      },
    },
    {
      id: 'Ridorana HP Boost Gain',
      regex: / 1A:(\y{Name}) gains the effect of Hp Boost \+(\d)/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data, matches) {
        data.hpBoost = matches[2];
      },
    },
    {
      id: 'Ridorana HP Boost Loss',
      regex: / 1A:(\y{Name}) loses the effect of Hp Boost \+(\d)/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data, matches) {
        data.hpBoost = 0;
      },
    },
    {
      id: 'Ridorana Construct Divide By Five',
      regex: / 14:2CCD:Construct 7 starts using Divide By Five/,
      preRun: function(data) {
        data.correctMath = [-1, 4, 3, 2, 1, 0, 4, 3, 2, 1];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Divide By Four',
      regex: / 14:2CCC:Construct 7 starts using Divide By Four/,
      preRun: function(data) {
        data.correctMath = [-1, 3, 2, 1, 0, 3, 2, 1, 0, 3];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Divide By Three',
      regex: / 14:2CCA:Construct 7 starts using Divide By Three/,
      preRun: function(data) {
        data.correctMath = [-1, 2, 1, 0, 2, 1, 0, 2, 1, 0];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Indivisible',
      regex: / 14:2CCE:Construct 7 starts using Indivisible/,
      preRun: function(data) {
        data.correctMath = [-1, 1, 0, 0, 1, 0, 1, 0, 3, 2];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Pulverize',
      regex: / 14:2C61:Construct 7 starts using Pulverize/,
      // 16 yalms
      alertText: {
        en: 'Get Out',
      },
      tts: {
        en: 'Get Out',
      },
    },
    {
      id: 'Ridorana Construct Dispose',
      regex: / 14:(?:2C5F|2CE9):Construct 7 starts using Dispose/,
      alertText: {
        en: 'Get Behind',
      },
      tts: {
        en: 'Get Behind',
      },
    },
    {
      id: 'Ridorana Construct Acceleration Bomb',
      regex: /1A:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return matches[1] == data.me; },
      delaySeconds: 2,
      alarmText: {
        en: 'Stop',
      },
      tts: {
        en: 'stop',
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Buster',
      regex: / 14:2D4E:Yiazmat starts using Rake on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Charge',
      regex: / 14:2E32:Yiazmat starts using Rake/,
      condition: function(data) { return data.role == 'tank' },
      infoText: {
        en: 'Out of Front',
      },
      tts: {
        en: 'Out of Front',
      },
    },
    {
      id: 'Ridorana Yiazmat White Breath',
      regex: / 14:2C31:Yiazmat starts using White Breath/,
      alertText: {
        en: 'Get Under',
      },
      tts: {
        en: 'Get Under',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Negative',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis - from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      infoText: {
        en: 'Move to Postive',
      },
      tts: {
        en: 'Move Postive',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Positive',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis \+ from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      infoText: {
        en: 'Move to Negative',
      },
      tts: {
        en: 'Move Negative',
      },
    },
    {
      id: 'Ridorana Yiazmat Archaeodemon',
      regex: / 03:Added new combatant Archaeodemon\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Yiazmat Heart',
      regex: / 03:Added new combatant Heart Of The Dragon\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Heart',
      },
      tts: {
        en: 'Heart',
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
      replaceSync: {
        'Engage!': 'Start!',
        'Dark Rain': 'Dunkler Regen',
        'Famfrit, The Darkening Cloud': 'Dunkelfürst Famfrit',
        'Belias, The Gigas': 'Dämonid Belias',
        'Gigas': 'Diener Von Belias',
        'Construct 7': 'Automat Nr. 7',
        'Construct 7.1': 'Verbesserter Automat Nr. 7',
        'Missile': 'Rakete',
        'Archaeodemon': 'Archaeodämon',
        'Heart of the Dragon': 'Heart of the Dragon',
        'Wind Azer': 'Windseele',
        'Yiazmat': 'Yiasmat',

        ":Echoes from Time's Garden will be sealed off": ":Garten Ewiger Zeit schließt",
        ":The Spire's Bounds will be sealed off": ":Katastase schließt",
        ":The Cleft of Profaning Wind will be sealed off": ":Kluft Entweihender Winde schließt",
        ":The Clockwork Coliseum will be sealed off": ":Kolosseum Von Gog schließt",
      },
      replaceText: {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Enrage': 'Finalangriff',
        'Briny Cannonade': 'Aquarion',
        'Dark Cannonade': 'Dunkler Blitz',
        'Dark Ewer': 'Dunkler Wasserkrug',
        'Dark Rain': 'Dunkler Regen',
        'Darkening Deluge': 'Düstere Flut',
        'Darkening Rainfall': 'Verdunkelnder Niederschlag',
        'Explosion': 'Explosion',
        'Jet': 'Strahl',
        'Materialize': 'Trugbild',
        'Tide Pod': 'Gezeitenschlag',
        'Tsunami': 'Sturzflut',
        'Water IV': 'Giga-Aqua',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Eruption': 'Eruption',
        'Fire': 'Feuer',
        'Fire IV': 'Feuka',
        'Hellfire': 'Höllenfeuer',
        'The Hand Of Time': 'Die Hand Der Zeit',
        'Time Bomb': 'Zeitbombe',
        'Time Eruption': 'Zeiteruption',
        'Accelerate': 'Beschleunigen',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Annihilation Mode': 'Auslöschungsmodul',
        'Ballistic Missile': 'Ballistische Rakete',
        'Compress': 'Zerdrücken',
        'Computation Mode': 'Standardmodul',
        'Destroy': 'Zerstören',
        'Dispose': 'Entsorgen',
        'Divide By Five': 'Arithmetik: Durch 5 Teilen',
        'Divide By Four': 'Arithmetik: Durch 4 Teilen',
        'Divide By Three': 'Arithmetik: Durch 3 Teilen',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Magnet',
        'Ignite': 'Entzünden',
        'Incinerate': 'Einäschern',
        'Indivisible': 'Unteilbar',
        'Lithobrake': 'Erledigen',
        'Magnetism': 'Magnetismus',
        'Pulverize': 'Zermahlen',
        'Subtract': 'Subtrahieren',
        'Tartarus': 'Tartarus',
        'Tartarus Mode': 'Tartarus-Modul',
        'Triboelectricity': 'Elekrostatische Entladung',
        'Ultramagnetism': 'Ultramagnetismus',
        'Ventilate': 'Abkühlen',
        'Ancient Aero': 'Antiker Wind',
        'Cyclone': 'Zyklon',
        'Death Strike': 'Extonso Tod',
        'Dust Storm': 'Staubsturm',
        'Face Off': 'Unbeugsamkeit',
        'Growing Threat': 'Mirakel',
        'Gust Front': 'Böenfront',
        'Karma': 'Lebensbruch',
        'Magnetic Genesis': 'Magnetische Stabilisierung',
        'Magnetic Lysis': 'Magnetische Auflösung',
        'Rake': 'Prankenhieb',
        'Solar Storm': 'Sonnensturm',
        'Stone Breath': 'Petri-Atem',
        'Summon': 'Beschwörung',
        'Turbulence': 'Turbulenz',
        'Unholy Darkness': 'Unheiliges Dunkel',
        'White Breath': 'Kalkatem',

        'Fast Hands': 'Schnelle Hände',
        'Slow Hands': 'Langsame Hände',
        'Gigas spawns': 'Gigas erscheint',
        'Division': 'Division',
        'Area Lockdown': 'Gebiet geschlossen',
        'Archaeodemon spawn': 'Archaeodämon erscheint',
        'Gale Gaol': 'Windgefängnis',
      },
      '~effectNames': {
        'Dropsy': 'Wassersucht',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Burns': 'Brandwunde',
        'Slow': 'Gemach',
        'Slow+': 'Gemach +',
        'Temporal Barrier': 'Lauf Der Zeit',
        'Temporal Displacement': 'Zeitstillstand',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Computation Boost': 'Verbesserte Rechenleistung',
        'Computation Error': 'Rechenfehler',
        'Damage Down': 'Schaden -',
        'Down For The Count': 'Am Boden',
        'HP Boost +1': 'LP-Bonus +1',
        'HP Boost +2': 'LP-Bonus +2',
        'HP Boost +3': 'LP-Bonus +3',
        'HP Boost +4': 'LP-Bonus +4',
        'HP Penalty': 'LP-Malus',
        'Invincibility': 'Unverwundbar',
        'Minimum': 'Wicht',
        'Negative Charge': 'Negative Ladung',
        'Positive Charge': 'Positive Ladung',
        'Stun': 'Betäubung',
        'Borne Heart': 'Freies Herz',
        'Damage Down': 'Schaden -',
        'Heartless': 'Herzlos',
        'Magnetic Levitation': 'Magnetschwebe',
        'Magnetic Lysis +': 'Positives Magnetfeld',
        'Magnetic Lysis -': 'Negatives Magnetfeld',
        'Petrification': 'Stein',
        'Slow': 'Gemach',
        'The One Dragon': 'Absoluter Drache',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        "Engage!": "À l'attaque",
        "Dark Rain": "Sphère D'eau Ténébreuse",
        'Famfrit, The Darkening Cloud': 'Famfrit Le Nuage Ténébreux',
        'Belias, The Gigas': 'Bélias Le Titan',
        'Gigas': 'Serviteur De Bélias',
        'Construct 7': 'Automate N°7',
        'Construct 7.1': 'Automate N°7 Amélioré',
        'Missile': 'Missile',
        'Archaeodemon': 'Archéodémon',
        'Heart of the Dragon': 'Heart of the Dragon',
        'Wind Azer': 'Aze De Vent',
        'Yiazmat': 'Yiazmat',

        // FIXME
        ":Echoes from Time's Garden will be sealed off": ":Echoes from Time's Garden will be sealed off",
        ":The Spire's Bounds will be sealed off": ":The Spire's Bounds will be sealed off",
        ":The Cleft of Profaning Wind will be sealed off": ":The Cleft of Profaning Wind will be sealed off",
        ":The Clockwork Coliseum will be sealed off": ":The Clockwork Coliseum will be sealed off",
      },
      replaceText: {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--synchronisation--',
        '--targetable--': '--ciblable--',
        '--untargetable--': '--impossible à cibler--',
        'Briny Cannonade': 'Aqua-canon',
        'Dark Cannonade': 'Bombardement Ténébreux',
        'Dark Ewer': 'Aiguières Ténèbreuses',
        "Dark Rain": "Trombe D'eau",
        'Darkening Deluge': 'Nuage Stagnant',
        'Darkening Rainfall': 'Averse Ténébreuse',
        'Explosion': 'Éclatement',
        'Jet': 'Torrent',
        'Materialize': 'Apparition',
        'Tide Pod': 'Frappe Aqueuse',
        'Tsunami': 'Tsunami',
        'Water IV': 'Giga Eau',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Eruption': 'Éruption',
        'Fire': 'Feu',
        'Fire IV': 'Giga Feu',
        "Hellfire": "Flammes De L'enfer",
        "The Hand Of Time": "Trotteuse De L'au-delà",
        'Time Bomb': 'Bombe à Retardement',
        'Time Eruption': 'Éruption à Retardement',
        'Accelerate': 'Aplatir',
        'Acceleration Bomb': 'Bombe Accélératrice',
        'Annihilation Mode': 'Module Exterminator',
        'Ballistic Missile': 'Missiles Balistiques',
        'Compress': 'Écraser',
        "Computation Mode": "Module D'arithmétique",
        'Destroy': 'Détruire',
        'Dispose': 'Annihiler',
        'Divide By Five': 'Arithmétique : Multiples De 5',
        'Divide By Four': 'Arithmétique : Multiples De 4',
        'Divide By Three': 'Arithmétique : Multiples De 3',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Ferrofluide',
        'Ignite': 'Carboniser',
        'Incinerate': 'Incinérer',
        'Indivisible': 'Arithmétique : Nombres Premiers',
        'Lithobrake': 'Percuter',
        'Magnetism': 'Magnétisme',
        'Pulverize': 'Broyer',
        'Subtract': 'Soustraire',
        'Tartarus': 'Tartaros',
        'Tartarus Mode': 'Module Tartaros',
        'Triboelectricity': 'Décharge électrostatique',
        'Ultramagnetism': 'Ultra-magnétisme',
        'Ventilate': 'Réfrigérer',
        'Ancient Aero': 'Vent Ancien',
        'Cyclone': 'Cyclone',
        'Death Strike': 'Pentacle Mortel',
        'Dust Storm': 'Tempête De Poussière',
        'Face Off': 'Défiguration',
        'Growing Threat': 'Exacerbation',
        'Gust Front': 'Front De Rafales',
        'Karma': 'Souffrance',
        'Magnetic Genesis': 'Stabilisation Du Champ Magnétique',
        'Magnetic Lysis': 'Dérèglement Magnétique',
        'Rake': 'Griffes',
        'Solar Storm': 'Tempête Solaire',
        'Stone Breath': 'Souffle Pétrifiant',
        'Summon': 'Invocation',
        'Turbulence': 'Turbulence',
        'Unholy Darkness': 'Miracle Sombre',
        'White Breath': 'Souffle Blanc',

        // FIXME:
        'Fast Hands': 'Fast Hands',
        'Slow Hands': 'Slow Hands',
        'Gigas spawns': 'Gigas spawns',
        'Division': 'Division',
        'Area Lockdown': 'Area Lockdown',
        'Archaeodemon spawn': 'Archaeodemon spawn',
        'Gale Gaol': 'Gale Gaol',
      },
      '~effectNames': {
        'Dropsy': 'Œdème',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Burns': 'Brûlure',
        'Slow': 'Lenteur',
        'Slow+': 'Lenteur +',
        'Temporal Barrier': 'Barrière Anti-stase',
        'Temporal Displacement': 'Stase Temporelle',
        'Acceleration Bomb': 'Bombe à Accélération',
        'Computation Boost': 'Bonne Réponse',
        'Computation Error': 'Mauvaise Réponse',
        'Damage Down': 'Malus De Dégâts',
        'Down For The Count': 'Au Tapis',
        'HP Boost +1': 'Bonus De PV (+1)',
        'HP Boost +2': 'Bonus De PV (+2)',
        'HP Boost +3': 'Bonus De PV (+3)',
        'HP Boost +4': 'Bonus De PV (+4)',
        'HP Penalty': 'Malus De PV+',
        'Invincibility': 'Invulnérable',
        'Minimum': 'Mini',
        'Negative Charge': 'Charge Négative',
        'Positive Charge': 'Charge Positive',
        'Stun': 'Étourdissement',
        'Borne Heart': 'Faiblesse Apparente',
        'Damage Down': 'Malus De Dégâts',
        'Heartless': 'Cœur Brisé',
        'Magnetic Levitation': 'Lévitation Magnétique',
        'Magnetic Lysis +': 'Charge Positive',
        'Magnetic Lysis -': 'Charge Négative',
        'Petrification': 'Pétrification',
        'Slow': 'Lenteur',
        'The One Dragon': 'Dragon Ultime',
      },
    },
    {
      locale: 'ja',
      replaceSync: {
        'Dark Rain': '暗黒の雨水',
        'Engage!': '戦闘開始！',
        'Famfrit, The Darkening Cloud': '暗黒の雲ファムフリート',
        'Belias, The Gigas': '魔人ベリアス',
        'Gigas': '魔人兵',
        'Construct 7': '労働七号',
        'Construct 7.1': '労働七号・改',
        'Missile': 'ミサイル',
        'Archaeodemon': 'アルケオデーモン',
        'Heart of the Dragon': 'Heart of the Dragon',
        'Wind Azer': '風のアーゼ',
        'Yiazmat': '鬼龍ヤズマット',

        // FIXME
        ":Echoes from Time's Garden will be sealed off": ":Echoes from Time's Garden will be sealed off",
        ":The Spire's Bounds will be sealed off": ":The Spire's Bounds will be sealed off",
        ":The Cleft of Profaning Wind will be sealed off": ":The Cleft of Profaning Wind will be sealed off",
        ":The Clockwork Coliseum will be sealed off": ":The Clockwork Coliseum will be sealed off",
      },
      replaceText: {
        'Briny Cannonade': '蒼の砲撃',
        'Dark Cannonade': '闇の砲撃',
        'Dark Ewer': '暗雲の水瓶',
        'Dark Rain': '暗雲の雨水',
        'Darkening Deluge': '暗雲の淀み',
        'Darkening Rainfall': '暗雲の雨',
        'Explosion': '爆散',
        'Jet': '激流',
        'Materialize': '幻出',
        'Tide Pod': '水流弾',
        'Tsunami': '大海嘯',
        'Water IV': 'ウォタジャ',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Eruption': 'エラプション',
        'Fire': 'ファイア',
        'Fire IV': 'ファイジャ',
        'Hellfire': '地獄の火炎',
        'The Hand Of Time': '異界の時針',
        'Time Bomb': 'タイムボム',
        'Time Eruption': 'タイムエラプション',
        'Accelerate': '突貫する',
        'Acceleration Bomb': '加速度爆弾',
        'Annihilation Mode': 'ジェノサイドチップ',
        'Ballistic Missile': 'ミサイル発射',
        'Compress': '圧縮する',
        'Computation Mode': '算術チップ',
        'Destroy': '破壊する',
        'Dispose': '処理する',
        'Divide By Five': '算術：5倍数',
        'Divide By Four': '算術：4倍数',
        'Divide By Three': '算術：3倍数',
        'Explosion': '爆発',
        'Ferrofluid': 'マグネット',
        'Ignite': '放熱する',
        'Incinerate': '焼却する',
        'Indivisible': '算術：素数',
        'Lithobrake': '落着する',
        'Magnetism': '磁力',
        'Pulverize': '粉砕する',
        'Subtract': '減算する',
        'Tartarus': 'タルタロス',
        'Tartarus Mode': 'タルタロスチップ',
        'Triboelectricity': '高速回転',
        'Ultramagnetism': '強磁力',
        'Ventilate': '冷却する',
        'Ancient Aero': 'エンシェントエアロ',
        'Cyclone': 'サイクロン',
        'Death Strike': '必殺',
        'Dust Storm': 'ダストストーム',
        'Face Off': 'フェイスオフ',
        'Growing Threat': '驚異',
        'Gust Front': 'ガストフロント',
        'Karma': 'ライフブレイク',
        'Magnetic Genesis': '磁場生成',
        'Magnetic Lysis': '磁場崩壊',
        'Rake': 'ひっかき',
        'Solar Storm': 'ソーラーストーム',
        'Stone Breath': 'ペトロブレス',
        'Summon': '召喚',
        'Turbulence': '乱気流',
        'Unholy Darkness': 'ダークホーリー',
        'White Breath': 'ホワイトブレス',

        // FIXME:
        'Fast Hands': 'Fast Hands',
        'Slow Hands': 'Slow Hands',
        'Gigas spawns': 'Gigas spawns',
        'Division': 'Division',
        'Area Lockdown': 'Area Lockdown',
        'Archaeodemon spawn': 'Archaeodemon spawn',
        'Gale Gaol': 'Gale Gaol',
      },
      '~effectNames': {
        'Dropsy': '水毒',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Burns': '火傷',
        'Slow': 'スロウ',
        'Slow+': 'スロウ＋',
        'Temporal Barrier': '時間停止無効',
        'Temporal Displacement': '時間停止',
        'Acceleration Bomb': '加速度爆弾',
        'Computation Boost': '算術正解',
        'Computation Error': '算術不正解',
        'Damage Down': 'ダメージ低下',
        'Down For The Count': 'ノックダウン',
        'HP Boost +1': '最大ＨＰ＋1',
        'HP Boost +2': '最大ＨＰ＋2',
        'HP Boost +3': '最大ＨＰ＋3',
        'HP Boost +4': '最大ＨＰ＋4',
        'HP Penalty': '最大ＨＰ低下[強]',
        'Invincibility': '無敵',
        'Minimum': 'ミニマム',
        'Negative Charge': '磁力【－】',
        'Positive Charge': '磁力【＋】',
        'Stun': 'スタン',
        'Borne Heart': '心核露出',
        'Damage Down': 'ダメージ低下',
        'Heartless': '心核破壊',
        'Magnetic Levitation': '磁気浮上',
        'Magnetic Lysis +': '磁場崩壊【＋】',
        'Magnetic Lysis -': '磁場崩壊【－】',
        'Petrification': '石化',
        'Slow': 'スロウ',
        'The One Dragon': '絶対竜',
      },
    },
  ],
}]
