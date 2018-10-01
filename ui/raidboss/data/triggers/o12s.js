'use strict';

// O12S - Alphascape 4.0 Savage

[{
  zoneRegex: /^Alphascape V4.0 \(Savage\)$/,
  timelineFile: 'o12s.txt',
  triggers: [
    {
      // Track Omega MF vs Final Omega phase.
      regex: / 14:3357:Omega starts using (?:Ion Efflux|Unknown_3357)/,
      regexDe: / 14:3357:Omega starts using (?:Ionenstrom|Unknown_3357)/,
      regexFr: / 14:3357:Oméga starts using (?:Fuite D\'ions|Unknown_3357)/,
      run: function(data) {
        data.isFinalOmega = true;
        data.archiveMarkers = {};
        data.personDebuff = {};
        data.totalDefamation = 0;
        data.totalBlueMarker = 0;
        data.totalStack = 0;
        data.totalRot = 0;
      },
    },
    {
      id: 'O12S Beyond Defense',
      regex: / 1[56]:\y{ObjectId}:Omega-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Omega-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Oméga-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:オメガM:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Don\'t Stack!',
      },
    },
    {
      id: 'O12S Local Resonance',
      regex: / 1A:Omega gains the effect of (?:Local Resonance|Unknown_67E) from/,
      regexDe: / 1A:Omega gains the effect of (?:Resonanzprogramm: Nah|Unknown_67E) from/,
      regexFr: / 1A:Oméga gains the effect of (?:Programme de résonance: proximité|Unknown_67E) from/,
      regexJa: / 1A:オメガ gains the effect of (?:レゾナンスプログラム：ニアー|Unknown_67E) from/,
      infoText: {
        en: 'Keep Bosses Apart',
      },
    },
    {
      id: 'O12S Remote Resonance',
      regex: / 1A:Omega gains the effect of (?:Remote Resonance|Unknown_67F) from/,
      regexDe: / 1A:Omega gains the effect of (?:Resonanzprogramm: Fern|Unknown_67F) from/,
      regexFr: / 1A:Oméga gains the effect of (?:Programme de résonance: distance|Unknown_67F) from/,
      regexJa: / 1A:オメガ gains the effect of (?:レゾナンスプログラム：ファー|Unknown_67F) from/,
      alertText: {
        en: 'Move Bosses Together',
        de: 'Bosse zusammenziehen',
      },
    },
    {
      id: 'O12S Solar Ray',
      regex: / 14:(?:3350|3351):(?:Omega|Omega-M) starts using (?:Unknown_3350|Unknown_3351|Solar Ray) on (\y{Name})/,
      regexDe: / 14:(?:3350|3351):(?:Omega|Omega-M) starts using (?:Unknown_3350|Unknown_3351|Sonnenstrahl) on (\y{Name})/,
      regexFr: / 14:(?:3350|3351):(?:Oméga|Oméga-M) starts using (?:Unknown_3350|Unknown_3351|Rayon solaire) on (\y{Name})/,
      regexJa: / 14:(?:3350|3351):(?:オメガ|オメガM) starts using (?:Unknown_3350|Unknown_3351|ソーラレイ) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
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
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
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
      id: 'O12S Optimized Blade Dance',
      regex: / 14:(?:334B|334C):(?:Omega|Omega-M) starts using (?:Unknown_334B|Unknown_334C|Optimized Blade Dance) on (\y{Name})/,
      regexDe: / 14:(?:334B|334C):(?:Omega|Omega-M) starts using (?:Unknown_334B|Unknown_334C|Omega-Schwertertanz) on (\y{Name})/,
      regexFr: / 14:(?:334B|334C):(?:Oméga|Oméga-M) starts using (?:Unknown_334B|Unknown_334C|Danse de la lame Oméga) on (\y{Name})/,
      regexJa: / 14:(?:334B|334C):(?:オメガ|オメガM) starts using (?:Unknown_334B|Unknown_334C|ブレードダンス・オメガ) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
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
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
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
      id: 'O12S Electric Slide Marker',
      regex: /1B:........:(\y{Name}):....:....:(009[12345678]):0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let num = parseInt(matches[2]);
        let isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        let squareName = {
          en: 'Square',
          de: 'Viereck',
        }[data.lang];
        let triangleName = {
          en: 'Triangle',
          de: 'Dreieck',
        }[data.lang];
        return '#' + num + ' ' + (isTriangle ? triangleName : squareName);
      },
    },
    {
      id: 'O12S MF Stack Marker',
      regex: /1B:........:\y{Name}:....:....:003E:0000:0000:0000:/,
      condition: function(data) {
        return !data.isFinalOmega;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Stack',
        de: 'Stacken',
      },
    },
    {
      id: 'O12S Optimized Meteor',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
      },
    },
    {
      id: 'O12S Packet Filter F',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|Packet Filter F) from/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|Sicherungssystem F) from/,
      regexFr: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|Programme protecteur F) from/,
      regexJa: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|ガードプログラムF) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-M',
        de: 'Omega-M angreifen',
      },
    },
    {
      id: 'O12S Packet Filter M',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_67C|Packet Filter M) from/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_67C|Sicherungssystem M) from/,
      regexFr: / 1A:(\y{Name}) gains the effect of (?:Unknown_67C|Programme protecteur M) from/,
      regexJa: / 1A:(\y{Name}) gains the effect of (?:Unknown_67C|ガードプログラムM) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-F',
        de: 'Omega-W angreifen',
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Sides',
      regex: / 14:3367:Omega starts using (?:Diffuse Wave Cannon|Unknown_3367)/,
      regexDe: / 14:3367:Omega starts using (?:Streuende Wellenkanone|Unknown_3367)/,
      infoText: {
        en: 'Sides',
        de: 'Seiten',
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Front/Back',
      regex: / 14:3368:Omega starts using (?:Diffuse Wave Cannon|Unknown_3368)/,
      regexDe: / 14:3368:Omega starts using (?:Streuende Wellenkanone|Unknown_3368)/,
      infoText: {
        en: 'Front or Back',
        de: 'Vorn oder Hinten',
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Right',
      regex: / 14:3364:Omega starts using (?:Oversampled Wave Cannon|Unknown_3364)/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Left',
          };
        }
        return {
          en: 'Dodge Left',
        };
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Left',
      regex: / 14:3365:Omega starts using (?:Oversampled Wave Cannon|Unknown_3365)/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Right',
          };
        }
        return {
          en: 'Dodge Right',
        };
      },
    },
    {
      id: 'O12S Target Analysis Target',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Vuln on YOU',
            de: 'Verwundbarkeit auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1] || data.role != 'tank')
          return;
        return {
          en: 'Vuln on ' + data.ShortName(matches[1]),
          de: 'Verwundbarkeit auf ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'O12S Local Tethers',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_688|Local Regression) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
      },
    },
    {
      id: 'O12S Far Tethers',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_689|Remote Regression) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
      },
    },
    {
      id: 'O12S Defamation',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_681|Critical Overflow Bug) from/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_681|Kritischer Bug: Überlauf) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Defamation on YOU',
        de: 'Urteil auf DIR',
      },
      run: function(data, matches) {
        data.totalDefamation++;
        data.personDebuff[matches[1]] = true;
      },
    },
    {
      id: 'O12S Latent Defect',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_686|Latent Defect) from/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_686|Latenter Defekt) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Blue Marker',
      },
      run: function(data, matches) {
        data.totalBlueMarker++;
        data.personDebuff[matches[1]] = true;
      },
    },
    {
      id: 'O12S Rot',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_682|Critical Underflow Bug) from/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_682|Kritischer Bug: Unterlauf) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Rot',
      },
      run: function(data, matches) {
        data.totalRot++;
        data.personDebuff[matches[1]] = true;
      },
    },
    {
      id: 'O12S Hello World Stack',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_680|Critical Synchronization Bug) from (?:.*) for (.*) Seconds/,
      regexDe: / 1A:(\y{Name}) gains the effect of (?:Unknown_680|Kritischer Bug: Synchronisierung) from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let t = parseFloat(matches[2]);
        if (!(t > 0))
          return;
        if (t <= 8) {
          return {
            en: 'Short Stack',
            de: 'Kurzer Stack',
          };
        }
        return {
          en: 'Long Stack',
          de: 'Langer Stack',
        };
      },
      run: function(data, matches) {
        data.totalStack++;
        data.personDebuff[matches[1]] = true;
      },
    },
    {
      // Archive All Marker Tracking
      regex: /1B:........:(\y{Name}):....:....:(003E|0060):0000:0000:0000:/,
      condition: function(data) {
        return data.isFinalOmega;
      },
      run: function(data, matches) {
        data.archiveMarkers[matches[1]] = matches[2];
      },
    },
    {
      id: 'O12S Archive All No Marker',
      regex: /1B:........:(\y{Name}):....:....:(?:003E|0060):0000:0000:0000:/,
      condition: function(data) {
        // 4 fire markers, 1 stack marker.
        return data.isFinalOmega && Object.keys(data.archiveMarkers).length == 5;
      },
      infoText: function(data, matches) {
        for (let player in data.archiveMarkers) {
          if (data.archiveMarkers[player] != '003E')
            continue;
          return {
            en: 'Stack on ' + data.ShortName(player),
            de: 'Stacken auf ' + data.ShortName(player),
          };
        }
      },
    },
    {
      id: 'O12S Archive Stack Marker',
      regex: /1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.isFinalOmega && matches[1] == data.me;
      },
      infoText: {
        en: 'Stack on YOU',
        de: 'Stacken auf DIR',
      },
    },
    {
      id: 'O12S Archive Spread Marker',
      regex: /1B:........:(\y{Name}):....:....:0060:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.isFinalOmega && matches[1] == data.me;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Omega': 'Omega',
        'Omega-F': 'Omega-W',
        'Omega-M': 'Omega-M',
        'Optical Unit': 'Optikmodul',

        'Left Arm Unit': 'linker Arm',
        'Right Arm Unit': 'rechter Arm',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Advanced Optical Laser': 'Optischer Laser S',
        'Advanced Suppression': 'Hilfsprogramm S',
        'Beyond Defense': 'Schildkombo S',
        'Beyond Strength': 'Schildkombo G',
        'Cosmo Memory': 'Kosmospeicher',
        'Discharger': 'Entlader',
        'Efficient Bladework': 'Effiziente Klingenführung',
        'Electric Slide': 'Elektrosturz',
        'Enrage': 'Finalangriff',
        'Firewall': 'Sicherungssystem',
        'Fundamental Synergy': 'Synergieprogramm C',
        'Laser Shower': 'Laserschauer',
        'Operational Synergy': 'Synergieprogramm W',
        'Optical Laser': 'Optischer Laser F',
        'Optimized Blade Dance': 'Omega-Schwertertanz',
        'Optimized Blizzard III': 'Omega-Eisga',
        'Optimized Fire III': 'Omega-Feuga',
        'Optimized Meteor': 'Omega-Meteor',
        'Optimized Sagittarius Arrow': 'Omega-Choral der Pfeile',
        'Pile Pitch': 'Neigungsstoß',
        'Resonance': 'Resonanz',
        'Solar Ray': 'Sonnenstrahl',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Transformation M',
        'Superliminal Motion': 'Klingenkombo F',
        'Superliminal Steel': 'Klingenkombo B',
        'Suppression': 'Hilfsprogramm F',
        'Synthetic Blades': 'Synthetische Klinge',
        'Synthetic Shield': 'Synthetischer Schild',

        'Archive All': 'Alles archivieren',
        'Archive Peripheral': 'Archiv-Peripherie',
        'Cascading Latent Defect': 'Latenter Defekt: Zersetzung',
        'Colossal Blow': 'Kolossaler Hieb',
        'Critical Error': 'Schwerer Ausnahmefehler',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Delta Attack': 'Delta-Attacke',
        'Diffuse Wave Cannon': 'Streuende Wellenkanone',
        'Electric Slide': 'Elektrosturz',
        'Floodlight': 'Flutlicht',
        'Hello, World': 'Hallo, Welt!',
        'Hyper Pulse': 'Hyper-Impuls',
        'Index and Archive Peripheral': 'Archiv-Peripherie X',
        'Ion Efflux': 'Ionenstrom',
        'Optimized Fire III': 'Omega-Feuga',
        'Oversampled Wave Cannon': 'Fokussierte Wellenkanone',
        'Patch': 'Regression',
        'Program Omega': 'Programm Omega',
        'Rear Lasers': 'Hintere Laser',
        'Savage Wave Cannon': 'Grausame Wellenkanone',
        'Spotlight': 'Scheinwerfer',
        'Target Analysis': 'Wellenkanone',
        'Wave Cannon': 'Wellenkanone',
      },
      '~effectNames': {
        'Infinite Limit': 'Grenzüberschreitung',
        'Local Resonance': 'Resonanzprogramm: Nah',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Packet Filter F': 'Sicherungssystem F',
        'Packet Filter M': 'Sicherungssystem M',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Prey': 'Markiert',
        'Remote Resonance': 'Resonanzprogramm: Fern',

        'Cascading Latent Defect': 'Latenter Bug: Unterlauf',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Latent Defect': 'Latenter Bug',
        'Local Regression': 'Regression: Nah',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Overflow Debugger': 'Bug-Korrektur: Überlauf',
        'Remote Regression': 'Regression: Fern',
        'Synchronization Debugger': 'Bug-Korrektur: Synchronisierung',
        'Underflow Debugger': 'Bug-Korrektur: Unterlauf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Omega': 'Oméga',
        'Omega-F': 'Oméga-F',
        'Omega-M': 'Oméga-M',
        'Optical Unit': 'unité optique',

        'Left Arm Unit': 'unité bras gauche',
        'Right Arm Unit': 'unité bras droit',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Advanced Optical Laser': 'Laser optique S',
        'Advanced Suppression': 'Programme d\'assistance S',
        'Beyond Defense': 'Combo bouclier S',
        'Beyond Strength': 'Combo bouclier G',
        'Cosmo Memory': 'Cosmomémoire',
        'Discharger': 'Déchargeur',
        'Efficient Bladework': 'Lame active',
        'Electric Slide': 'Glissement Oméga',
        'Enrage': 'Enrage',
        'Firewall': 'Programme protecteur',
        'Fundamental Synergy': 'Programme synergique C',
        'Laser Shower': 'Pluie de lasers',
        'Operational Synergy': 'Programme synergique W',
        'Optical Laser': 'Laser optique F',
        'Optimized Blade Dance': 'Danse de la lame Oméga',
        'Optimized Blizzard III': 'Méga Glace Oméga',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Optimized Meteor': 'Météore Oméga',
        'Optimized Sagittarius Arrow': 'Flèche du sagittaire Oméga',
        'Pile Pitch': 'Lancement de pieu',
        'Resonance': 'Résonance',
        'Solar Ray': 'Rayon solaire',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Simulation de sujet M',
        'Superliminal Motion': 'Combo lame F',
        'Superliminal Steel': 'Combo lame B',
        'Suppression': 'Programme d\'assistance F',
        'Synthetic Blades': 'Lame optionnelle',
        'Synthetic Shield': 'Bouclier optionnel',

        'Archive All': 'Archivage intégral',
        'Archive Peripheral': 'Périphérique d\'archivage',
        'Cascading Latent Defect': 'Bogue latent : dégradation',
        'Colossal Blow': 'Coup colossal',
        'Critical Error': 'Erreur critique',
        'Critical Overflow Bug': 'Bogue critique : boucle',
        'Critical Synchronization Bug': 'Bogue critique : partage',
        'Critical Underflow Bug': 'Bogue critique : dégradation',
        'Delta Attack': 'Attaque Delta',
        'Diffuse Wave Cannon': 'Canon plasma diffuseur',
        'Electric Slide': 'Glissement Oméga',
        'Floodlight': 'Projecteur',
        'Hello, World': 'Bonjour, le monde',
        'Hyper Pulse': 'Hyperpulsion',
        'Index and Archive Peripheral': 'Périphérique d\'archivage X',
        'Ion Efflux': 'Fuite d\'ions',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Oversampled Wave Cannon': 'Canon plasma chercheur',
        'Patch': 'Bogue intentionnel',
        'Program Omega': 'Programme Oméga',
        'Rear Lasers': 'Lasers arrière',
        'Savage Wave Cannon': 'Canon plasma absolu',
        'Spotlight': 'Phare',
        'Target Analysis': 'Analyse de cible',
        'Wave Cannon': 'Canon plasma',
      },
      '~effectNames': {
        'Infinite Limit': 'Dépassement de limites',
        'Local Resonance': 'Programme de résonance: proximité',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Packet Filter F': 'Programme protecteur F',
        'Packet Filter M': 'Programme protecteur M',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Prey': 'Marquage',
        'Remote Resonance': 'Programme de résonance: distance',

        'Cascading Latent Defect': 'Bogue latent: dégradation',
        'Critical Overflow Bug': 'Bogue critique: boucle',
        'Critical Synchronization Bug': 'Bogue critique: partage',
        'Critical Underflow Bug': 'Bogue critique: dégradation',
        'Latent Defect': 'Bogue latent',
        'Local Regression': 'Bogue intentionnel: proximité',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Overflow Debugger': 'Déboguage: boucle',
        'Remote Regression': 'Bogue intentionnel: distance',
        'Synchronization Debugger': 'Déboguage: partage',
        'Underflow Debugger': 'Déboguage: dégradation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Omega': 'オメガ',
        'Omega-F': 'オメガF',
        'Omega-M': 'オメガM',
        'Optical Unit': 'オプチカルユニット',

        'Left Arm Unit': 'レフトアームユニット',
        'Right Arm Unit': 'ライトアームユニット',
      },
      'replaceText': {
        'Advanced Optical Laser': 'オプチカルレーザーS',
        'Advanced Suppression': '援護プログラムS',
        'Beyond Defense': 'シールドコンボS',
        'Beyond Strength': 'シールドコンボG',
        'Cosmo Memory': 'コスモメモリー',
        'Discharger': 'ディスチャージャー',
        'Efficient Bladework': 'ソードアクション',
        'Electric Slide': 'オメガスライド',
        'Firewall': 'ガードプログラム',
        'Fundamental Synergy': '連携プログラムC',
        'Laser Shower': 'レーザーシャワー',
        'Operational Synergy': '連携プログラムW',
        'Optical Laser': 'オプチカルレーザーF',
        'Optimized Blade Dance': 'ブレードダンス・オメガ',
        'Optimized Blizzard III': 'ブリザガ・オメガ',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Optimized Meteor': 'メテオ・オメガ',
        'Optimized Sagittarius Arrow': 'サジタリウスアロー・オメガ',
        'Pile Pitch': 'パイルピッチ',
        'Resonance': 'レゾナンス',
        'Solar Ray': 'ソーラレイ',
        'Subject Simulation F': 'トランスフォームF',
        'Subject Simulation M': 'トランスフォームM',
        'Superliminal Motion': 'ブレードコンボF',
        'Superliminal Steel': 'ブレードコンボB',
        'Suppression': '援護プログラムF',
        'Synthetic Blades': 'ブレードオプション',
        'Synthetic Shield': 'シールドオプション',

        'Archive All': 'アーカイブオール',
        'Archive Peripheral': 'アーカイブアーム',
        'Cascading Latent Defect': 'レイテンドバグ：デグレード',
        'Colossal Blow': 'コロッサスブロー',
        'Critical Error': 'クリティカルエラー',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Delta Attack': 'デルタアタック',
        'Diffuse Wave Cannon': '拡散波動砲',
        'Electric Slide': 'オメガスライド',
        'Floodlight': 'フラッドライト',
        'Hello, World': 'ハロー・ワールド',
        'Hyper Pulse': 'ハイパーパルス',
        'Index and Archive Peripheral': 'アーカイブアームX',
        'Ion Efflux': 'イオンエフラクス',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Oversampled Wave Cannon': '検知式波動砲',
        'Patch': 'エンバグ',
        'Program Omega': 'プログラム・オメガ',
        'Rear Lasers': 'リアレーザー',
        'Savage Wave Cannon': '零式波動砲',
        'Spotlight': 'スポットライト',
        'Target Analysis': '標的識別',
        'Wave Cannon': '波動砲',
      },
      '~effectNames': {
        'Infinite Limit': '限界超越',
        'Local Resonance': 'レゾナンスプログラム：ニアー',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Packet Filter F': 'ガードプログラムF',
        'Packet Filter M': 'ガードプログラムM',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Prey': 'マーキング',
        'Remote Resonance': 'レゾナンスプログラム：ファー',

        'Cascading Latent Defect': 'レイテントバグ：デグレード',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Latent Defect': 'レイテントバグ',
        'Local Regression': 'エンバグ：ニアー',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Overflow Debugger': 'バグフィックス：サークル',
        'Remote Regression': 'エンバグ：ファー',
        'Synchronization Debugger': 'バグフィックス：シェア',
        'Underflow Debugger': 'バグフィックス：デグレード',
      },
    },
  ],
}];
