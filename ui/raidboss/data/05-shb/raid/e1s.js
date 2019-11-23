'use strict';

[{
  zoneRegex: /^Eden's Gate: Resurrection \(Savage\)$/,
  timelineFile: 'e1s.txt',
  timeline: [
    function(data) {
      let chance = 0.4;
      let time = '275';

      if (Math.random() >= chance)
        return;

      let goofs = {
        en: [
          'brb',
          ':zzz:',
          'LA HEE',
          'Quick Powernap',
          'brb making coffee',
          'Eden\'s Snoozefest',
          'rip enochian',
        ],
      }[data.lang];
      if (!goofs)
        return;

      let goof = goofs[Math.floor(Math.random() * goofs.length)];
      return time + ' "' + goof + '"';
    },
  ],
  triggers: [
    {
      id: 'E1S Initial',
      regex: / 14:3D70:Eden Prime starts using Eden's Gravity/,
      regexDe: / 14:3D70:Prim-Eden starts using Eden-Gravitas/,
      regexFr: / 14:3D70:Primo-Éden starts using Gravité Édénique/,
      regexJa: / 14:3D70:エデン・プライム starts using エデン・グラビデ/,
      run: function(data) {
        if (!data.viceCount) {
          data.viceCount = 1;
          data.vice = 'dps';
        }
      },
    },
    {
      id: 'E1S Paradise Regained',
      regex: / 1A:\y{ObjectId}:Eden Prime gains the effect of Paradise Regained/,
      regexDe: / 1A:\y{ObjectId}:Prim-Eden gains the effect of Wiedergewonnenes Paradies/,
      regexFr: / 1A:\y{ObjectId}:Primo-Éden gains the effect of Paradis [rR]etrouvé/,
      regexJa: / 1A:\y{ObjectId}:エデン・プライム gains the effect of パラダイスリゲイン/,
      run: function(data) {
        data.paradise = true;
      },
    },
    {
      id: 'E1S Paradise Regained But Lost',
      regex: / 1E:\y{ObjectId}:Eden Prime loses the effect of Paradise Regained/,
      regexDe: / 1E:\y{ObjectId}:Prim-Eden loses the effect of Wiedergewonnenes Paradies/,
      regexFr: / 1E:\y{ObjectId}:Primo-Éden loses the effect of Paradis [rR]etrouvé/,
      regexJa: / 1E:\y{ObjectId}:エデン・プライム loses the effect of パラダイスリゲイン/,
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      regex: / 14:3D70:Eden Prime starts using Eden's Gravity/,
      regexDe: / 14:3D70:Prim-Eden starts using Eden-Gravitas/,
      regexFr: / 14:3D70:Primo-Éden starts using Gravité Édénique/,
      regexJa: / 14:3D70:エデン・プライム starts using エデン・グラビデ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
      },
    },
    {
      id: 'E1S Fragor Maximus',
      regex: / 14:3D8B:Eden Prime starts using Fragor Maximus/,
      regexDe: / 14:3D8B:Prim-Eden starts using Fragor Maximus/,
      regexFr: / 14:3D8B:Primo-Éden starts using Fragor Maximus/,
      regexJa: / 14:3D8B:エデン・プライム starts using フラゴルマクシマス/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
      },
    },
    {
      id: 'E1S Dimensional Shift',
      regex: / 14:3D7F:Eden Prime starts using Dimensional Shift/,
      regexDe: / 14:3D7F:Prim-Eden starts using Dimensionsverschiebung/,
      regexFr: / 14:3D7F:Primo-Éden starts using Translation Dimensionnelle/,
      regexJa: / 14:3D7F:エデン・プライム starts using ディメンションシフト/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
      },
    },
    {
      id: 'E1S Spear Of Paradise',
      regex: / 14:3D88:Eden Prime starts using Spear Of Paradise on (\y{Name})/,
      regexDe: / 14:3D88:Prim-Eden starts using Paradiesspeer on (\y{Name})/,
      regexFr: / 14:3D88:Primo-Éden starts using Lance [Dd]u [Pp]aradis on (\y{Name})/,
      regexJa: / 14:3D88:エデン・プライム starts using スピア・オブ・パラダイス on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'タンクスイッチ',
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
      id: 'E1S Eden\'s Flare',
      regex: / 14:3D73:Eden Prime starts using Eden's Flare/,
      regexDe: / 14:3D73:Prim-Eden starts using Eden-Flare/,
      regexFr: / 14:3D73:Primo-Éden starts using Brasier Édénique/,
      regexJa: / 14:3D73:エデン・プライム starts using エデン・フレア/,
      alertText: {
        en: 'Under',
        de: 'Unter den Boss',
        fr: 'Sous le boss',
        ja: '中へ',
      },
    },
    {
      id: 'E1S Delta Attack 1',
      regex: / 14:44F4:Eden Prime starts using Delta Attack/,
      regexDe: / 14:44F4:Prim-Eden starts using Delta-Attacke/,
      regexFr: / 14:44F4:Primo-Éden starts using Attaque Delta/,
      regexJa: / 14:44F4:エデン・プライム starts using デルタアタック/,
      alertText: {
        en: 'Cross Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous en croix',
      },
    },
    {
      id: 'E1S Delta Attack 2',
      regex: / 14:44F8:Eden Prime starts using Delta Attack/,
      regexDe: / 14:44F8:Prim-Eden starts using Delta-Attacke/,
      regexFr: / 14:44F8:Primo-Éden starts using Attaque Delta/,
      regexJa: / 14:44F8:エデン・プライム starts using デルタアタック/,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Get In, Spread',
            de: 'Rein gehen, verteilen',
            ja: '中で散開',
            fr: 'Intérieur, écartez-vous',
          };
        }
        return {
          en: 'In, Stack Behind',
          de: 'Rein, hinten stacken',
          ja: '背面集合',
          fr: 'Intérieur, pack derrière',
        };
      },
    },
    {
      // 44EF: dps1
      // 3D7A: dps2
      // 44EE: tank1
      // 3D78: tank2
      // 44F0: healer1
      // 3D7D: healer2
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        // Note: this happens *after* the marks, so is setting up vice for the next marks.
        data.viceCount++;
        let viceMap = {
          1: 'dps',
          2: 'tank',
          3: 'healer',

          4: 'tank',
          5: 'dps',
          6: 'healer',

          7: 'tank',
          8: 'dps',
          9: 'healer',

          // theoretically??
          10: 'tank',
          11: 'dps',
          12: 'healer',
        };
        data.vice = viceMap[data.viceCount];
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:3D7A:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7A:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7A:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      regex: / 14:44EE:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:44EE:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:44EE:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:44EE:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      regex: / 14:3D78:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:3D78:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D78:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D78:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      regex: / 14:44F0:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:44F0:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:44F0:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:44F0:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      regex: / 14:3D7D:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:3D7D:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7D:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7D:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AE:/,
      condition: function(data, matches) {
        return !data.paradise && data.vice == 'dps' && data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Spread',
        de: 'Flächen verteilen',
        ja: '離れて散開',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using Vice [Aa]nd Virtue/,
      regexDe: / 14:3D7A:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D7A:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D7A:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      alertText: {
        en: 'Stack With Partner',
        de: 'Mit Partner stacken',
        ja: '相方とスタック',
        fr: 'Packez-vous avec votre partenaire',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Mark',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AE:/,
      condition: function(data, matches) {
        return data.vice == 'tank' && data.me == matches[1];
      },
      infoText: {
        en: 'Tank Laser on YOU',
        de: 'Tank Laser auf DIR',
        fr: 'Tank laser sur VOUS',
        ja: '自分にレーザー',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Stack',
      regex: / 14:3D78:Eden Prime starts using Vice [Aa]d Virtue/,
      regexDe: / 14:3D78:Prim-Eden starts using Laster [Uu]nd Tugend/,
      regexFr: / 14:3D78:Primo-Éden starts using Vice [eE]t [vV]ertu/,
      regexJa: / 14:3D78:エデン・プライム starts using ヴァイス・アンド・ヴァーチュー/,
      condition: function(data) {
        return data.role != 'tank';
      },
      infoText: {
        en: 'Stack in front of tank',
        de: 'Vorne mit dem Tank stacken',
        ja: '左右に分かれて内側へ',
        fr: 'Packez-vous devant le tank',
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark YOU',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Prey/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Markiert/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Marquage/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of マーキング/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        if (data.paradise) {
          return {
            en: 'Pass Prey to DPS',
            de: 'Marker einem DPS geben',
            ja: 'DPSに移して',
            fr: 'Donnez la marque à un DPS',
          };
        }
        return {
          en: 'Pass Prey to Tank',
          de: 'Marker einem Tank geben',
          ja: 'タンクに移して',
          fr: 'Donnez la marque à un Tank',
        };
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark Not You',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Prey/,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Markiert/,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Marquage/,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of マーキング/,
      condition: function(data) {
        if (data.role == 'dps')
          return data.paradise;
        if (data.role == 'tank')
          return !data.paradise;
        return false;
      },
      suppressSeconds: 20,
      alertText: {
        en: 'Take prey from healer',
        de: 'Marker vom Heiler nehmen',
        ja: 'ヒーラーからマーカー取って',
        fr: 'Prenez la marque du healer',
      },
    },
    {
      id: 'E1S Mana Boost',
      regex: / 14:3D8D:Guardian Of Paradise starts using Mana Boost/,
      regexDe: / 14:3D8D:Hüter von Eden starts using Mana-Verstärker/,
      regexFr: / 14:3D8D:Gardien du Jardin starts using Amplificateur [dD]e [mM]ana/,
      regexJa: / 14:3D8D:エデン・ガーデナー starts using マナブースター/,
      condition: function(data) {
        return data.CanSilence();
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Silence Guardian',
        de: 'Stumm auf Hüter ',
        ja: '沈黙',
        fr: 'Interrompez le gardien',
      },
    },
    {
      id: 'E1S Pure Light',
      regex: / 14:3D8A:Eden Prime starts using Pure Light/,
      regexDe: / 14:3D8A:Prim-Eden starts using Läuterndes Licht/,
      regexFr: / 14:3D8A:Primo-Éden starts using Lumière [pP]urificatrice/,
      regexJa: / 14:3D8A:エデン・プライム starts using ピュアライト/,
      alertText: {
        en: 'Get Behind',
        de: 'Hinter den Boss',
        fr: 'Derrière le boss',
        ja: '背面へ',
      },
    },
    {
      id: 'E1S Pure Beam 1',
      regex: / 14:3D80:Eden Prime starts using Pure Beam/,
      regexDe: / 14:3D80:Prim-Eden starts using Läuternder Strahl/,
      regexFr: / 14:3D80:Primo-Éden starts using Rayon [pP]urificateur/,
      regexJa: / 14:3D80:エデン・プライム starts using ピュアレイ/,
      infoText: {
        en: 'Get Outside Your Orb',
        de: 'Geh zu deinem Orb',
        ja: 'ピュアレイを外へ誘導',
        fr: 'Allez à l\'extérieur de votre orbe',
      },
    },
    {
      id: 'E1S Pure Beam 2',
      regex: / 14:3D82:Eden Prime starts using Pure Beam/,
      regexDe: / 14:3D82:Prim-Eden starts using Läuternder Strahl/,
      regexFr: / 14:3D82:Primo-Éden starts using Rayon [pP]urificateur/,
      regexJa: / 14:3D82:エデン・プライム starts using ピュアレイ/,
      infoText: {
        en: 'Bait Orb Lasers Outside',
        de: 'Laser nach drausen ködern',
        fr: 'Placez les lasers à l\'extérieur',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Eden Prime': 'Prim-Eden',
        'Arcane Sphere': 'Arkane Sphäre',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Vice of Vanity': 'Laster der Eitelkeit',
        'Vice of Thievery': 'Laster der Habgier',
        'Vice of Sloth': 'Laster der Faulheit',
        'Vice of Pride': 'Laster des Hochmuts',
        'Vice of Greed': 'Laster der Gier',
        'Vice of Apathy': 'Laster der Apathie',
        'Vice and Virtue': 'Laster und Tugend',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'Paradiesspeer',
        'Regained Thunder III': 'Wiedergewonnenes Blitzga',
        'Regained Fire III': 'Wiedergewonnenes Feuga',
        'Regained Blizzard III': 'Wiedergewonnenes Eisga',
        'Pure Light': 'Läuterndes Licht',
        'Pure Beam': 'Läuternder Strahl',
        'Primeval Stasis': 'Urzeitliche Stase',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradisal Dive': 'Paradiessturz',
        'Mana Slice': 'Mana-Hieb',
        'Mana Burst': 'Mana-Knall',
        'Mana Boost': 'Mana-Verstärker',
        'Heavensunder': 'Himmelsdonner',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Ewiger Atem',
        'Enrage': 'Finalangriff',
        'Eden\'s Thunder III': 'Eden-Blitzga',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Fire III': 'Eden-Feuga',
        'Eden\'s Blizzard III': 'Eden-Eisga',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Delta Attack': 'Delta-Attacke',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '--center--': '--mitte--',
        'Vice And Virtue': 'Laster und Tugend',
        'Spear Of Paradise': 'Paradiesspeer',
        '--corner--': '--ecke--',
      },
      '~effectNames': {
        'Slippery Prey': 'Unmarkierbar',
        'Prey': 'Markiert',
        'Poison': 'Gift',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Healing Magic Down': 'Heilmagie -',
        'Fetters': 'Gefesselt',
        'Bleeding': 'Blutung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Eden Prime': 'Primo-Éden',
        'Arcane Sphere': 'Sphère Arcanique',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Vice of Vanity': 'Péché de vanité',
        'Vice of Thievery': 'Péché de larcin',
        'Vice of Sloth': 'Péché de paresse',
        'Vice of Pride': 'Péché d\'orgueil',
        'Vice of Greed': 'Péché d\'avarice',
        'Vice of Apathy': 'Péché d\'apathie',
        'Vice and Virtue': 'Vice et vertu',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'Lance du paradis',
        'Regained Thunder III': 'Méga Foudre retrouvée',
        'Regained Fire III': 'Méga Feu retrouvé',
        'Regained Blizzard III': 'Méga Glace retrouvée',
        'Pure Light': 'Lumière purificatrice',
        'Pure Beam': 'Rayon purificateur',
        'Primeval Stasis': 'Stase primordiale',
        'Paradise Regained': 'Paradis retrouvé',
        'Paradise Lost': 'Paradis perdu',
        'Paradisal Dive': 'Piqué du paradis',
        'Mana Slice': 'Taillade de mana',
        'Mana Burst': 'Explosion de mana',
        'Mana Boost': 'Amplificateur de mana',
        'Heavensunder': 'Ravageur de paradis',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Enrage': 'Enrage',
        'Eden\'s Thunder III': 'Méga Foudre édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Fire III': 'Méga Feu édénique',
        'Eden\'s Blizzard III': 'Méga Glace édénique',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Delta Attack': 'Attaque Delta',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        '--center--': '--Centre--',
        '--corner--': '--Coin--',
      },
      '~effectNames': {
        'Slippery Prey': 'Marquage Impossible',
        'Prey': 'Marquage',
        'Poison': 'Poison',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Healing Magic Down': 'Malus de soin',
        'Fetters': 'Attache',
        'Bleeding': 'Saignement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Guardian of Paradise': 'エデン・ガーデナー',
        'Engage!': '戦闘開始！',
        'Eden Prime': 'エデン・プライム',
        'Arcane Sphere': '立体魔法陣',
      },
      'replaceText': {
        'attack': '攻撃',
        'Vice of Vanity': 'ヴァイス・オブ・ヴァニティー',
        'Vice of Thievery': 'ヴァイス・オブ・シーヴァリィ',
        'Vice of Sloth': 'ヴァイス・オブ・スロース',
        'Vice of Pride': 'ヴァイス・オブ・プライド',
        'Vice of Greed': 'ヴァイス・オブ・グリード',
        'Vice of Apathy': 'ヴァイス・オブ・アパシー',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
        'Unknown Ability': 'Unknown Ability',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Regained Thunder III': 'リゲイン・サンダガ',
        'Regained Fire III': 'リゲイン・ファイガ',
        'Regained Blizzard III': 'リゲイン・ブリザガ',
        'Pure Light': 'ピュアライト',
        'Pure Beam': 'ピュアレイ',
        'Primeval Stasis': 'プライムイーバルステーシス',
        'Paradise Regained': 'パラダイスリゲイン',
        'Paradise Lost': 'パラダイスロスト',
        'Paradisal Dive': 'パラダイスダイブ',
        'Mana Slice': 'マナスラッシュ',
        'Mana Burst': 'マナバースト',
        'Mana Boost': 'マナブースター',
        'Heavensunder': 'ヘヴンサンダー',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Eternal Breath': 'エターナル・ブレス',
        'Eden\'s Thunder III': 'エデン・サンダガ',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Fire III': 'エデン・ファイガ',
        'Eden\'s Blizzard III': 'エデン・ブリザガ',
        'Dimensional Shift': 'ディメンションシフト',
        'Delta Attack': 'デルタアタック',
      },
      '~effectNames': {
        'Slippery Prey': 'マーキング対象外',
        'Prey': 'マーキング',
        'Poison': '毒',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Healing Magic Down': '回復魔法効果低下',
        'Fetters': '拘束',
        'Bleeding': 'ペイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Engage!': '战斗开始！',
        'Eden Prime': '',
        'Arcane Sphere': '',
      },
      'replaceText': {
        'attack': '攻击',
        'Vice of Vanity': '',
        'Vice of Thievery': '',
        'Vice of Sloth': '',
        'Vice of Pride': '',
        'Vice of Greed': '',
        'Vice of Apathy': '',
        'Vice and Virtue': '',
        'Unknown Ability': '',
        'Spear of Paradise': '',
        'Regained Thunder III': '',
        'Regained Fire III': '',
        'Regained Blizzard III': '',
        'Pure Light': '',
        'Pure Beam': '',
        'Primeval Stasis': '',
        'Paradise Regained': '',
        'Paradise Lost': '',
        'Paradisal Dive': '',
        'Mana Slice': '',
        'Mana Burst': '',
        'Mana Boost': '',
        'Heavensunder': '',
        'Fragor Maximus': '',
        'Eternal Breath': '',
        'Eden\'s Thunder III': '',
        'Eden\'s Gravity': '',
        'Eden\'s Flare': '',
        'Eden\'s Fire III': '',
        'Eden\'s Blizzard III': '',
        'Dimensional Shift': '',
        'Delta Attack': '',
      },
      '~effectNames': {
        'Slippery Prey': '',
        'Fetters': '',
        'Prey': '',
        'Poison': '',
        'Physical Vulnerability Up': '',
        'Magic Vulnerability Up': '',
        'Lightning Resistance Down II': '',
        'Healing Magic Down': '',
        'Bleeding': '',
      },
    },
  ],
}];
