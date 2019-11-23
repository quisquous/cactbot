'use strict';

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
  timelineFile: 'the_epic_of_alexander.txt',
  timelineTriggers: [
    {
      id: 'TEA Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 5,
      // TODO: this is likely calling out twice sometimes because
      // the timeline resyncs and it becomes 5 seconds before again.
      // This is probably a problem for all timeline triggers (whoops)
      // and needs to be fixed more generally rather than adding a
      // suppression.
      suppressSeconds: 1,
      preRun: function(data) {
        data.swingCount = (data.swingCount || 0) + 1;
      },
      alertText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer') {
          if (multipleSwings) {
            return {
              en: 'Tank Busters',
              de: 'Tank buster',
              fr: 'Tank busters',
              ja: 'タンクバスター',
            };
          }
          if (data.liquidTank) {
            return {
              en: 'Tank Buster on' + data.ShortName(data.liquidTank),
              de: 'Tank buster',
              fr: 'Tank buster',
              ja: 'タンクバスター',
            };
          }
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
          };
        }

        if (data.role == 'tank') {
          if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank) {
            return {
              en: 'Tank Buster on YOU',
              ja: '自分にタンクバスター',
              de: 'Tankbuster auf DIR',
            };
          }
        }
      },
      infoText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer')
          return;
        if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank)
          return;
        return {
          en: 'Tank Cleave',
          de: 'Tank Cleave',
        };
      },
    },
    {
      id: 'TEA J Kick',
      regex: /J Kick/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      alertText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'TEA Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Move Bosses',
        de: 'Bosse bewegen',
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Liquid Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      run: function(data, matches) {
        data.liquidTank = matches.target;
      },
    },
    {
      id: 'TEA Hand Tank',
      regex: Regexes.abilityFull({ source: 'Liquid Hand', id: '4979' }),
      run: function(data, matches) {
        data.handTank = matches.target;
      },
    },
    {
      id: 'TEA Cruise Chaser Tank',
      regex: Regexes.abilityFull({ source: 'Cruise Chaser', id: '497A' }),
      run: function(data, matches) {
        data.cruiseTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
        ja: 'プロティアン',
        de: 'Proteische Welle',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
        ja: '自分にドレナージ',
        de: 'Entwässerungsverbindung auf DIR',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount < 5)
          return;
        return {
          en: 'Focus Living Liquid',
          ja: 'リビングリキッドを攻撃',
          de: 'belebtes Wasser fokussieren',
        };
      },
    },
    {
      id: 'TEA Throttle',
      regex: Regexes.gainsEffect({ effect: 'Throttle', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse Throttle',
        ja: '窒息',
        de: 'Erstickung entfernen',
      },
    },
    {
      id: 'TEA Limit Cut',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 15,
      alertText: function(data, matches) {
        let number = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];

        return {
          en: '#' + number,
          ja: number + '番',
        };
      },
    },
    {
      id: 'TEA Limit Cut Knockback and Cleaves',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // The markers take .3 seconds to be on all 8 players
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: function(data, matches) {
        let number = {
          '004F': 4.5,
          '0050': 6,
          '0051': 9.1,
          '0052': 10.5,
          '0053': 13.6,
          '0054': 15,
          '0055': 18.2,
          '0056': 19.6,
        }[matches.id];

        return {
          number,
        };
      },
      alertText: function(data, matches) {
        if (parseInt(matches.id, 16) & 1 == 1) {
          return {
            en: 'Cleave on YOU',
            de: 'Cleave auf DIR',
            fr: 'Cleave sur vous',
            ja: '自分にクリーブ',
          };
        }
        return {
          en: 'Knockback',
          de: 'Knockback',
          fr: 'Poussée',
          cn: '击退',
          ja: 'ノックバック',
        };
      },
    },
    {
      id: 'TEA Chakrams Out',
      // Link Up
      regex: Regexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      alertText: {
        en: 'Out, Dodge Chakrams',
        ja: '外へ',
        de: 'Raus, Chakrams ausweichen',
      },
    },
    {
      id: 'TEA Chakrams In',
      // Optical Sight
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '482F', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Run In',
        ja: '中へ',
        de: 'Rein',
      },
    },
    {
      id: 'TEA Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '49C2', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Compressed Water Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Water on YOU',
        ja: '自分に水',
        de: 'Wasser auf DIR',
      },
    },
    {
      id: 'TEA Compressed Water Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Water Soon',
        ja: '水来るよ',
        de: 'Gleich Wasser ablegen',
      },
    },
    {
      id: 'TEA Compressed Lightning Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        ja: '自分に雷',
        de: 'Blitz auf DIR',
      },
    },
    {
      id: 'TEA Compressed Lightning Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Lightning Soon',
        ja: '雷来るよ',
        de: 'Gleich Blitz ablegen',
      },
    },
    {
      id: 'TEA Pass Nisi 1',
      // 4 seconds after Photon cast starts.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4836', capture: false }),
      delaySeconds: 4,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
        de: 'Nisi weitergeben',
      },
    },
    {
      id: 'TEA Pass Nisi 2',
      // 1 second after enumeration.
      // TODO: find a startsUsing instead of matching an action.
      regex: Regexes.ability({ source: 'Brute Justice', id: '4850', capture: false }),
      delaySeconds: 1,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
        de: 'Nisi weitergeben',
      },
    },
    {
      id: 'TEA Pass Nisi 3',
      // 8 seconds after Flamethrower cast starts.
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4845', capture: false }),
      delaySeconds: 8,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
        de: 'Nisi weitergeben',
      },
    },
    {
      id: 'TEA Judgment Nisi A',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi A' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Blue α Nisi',
        ja: '青取って',
        de: 'blauen α Nisi holen',
      },
    },
    {
      id: 'TEA Judgment Nisi B',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Orange β Nisi',
        ja: 'オレンジ取って',
        de: 'orangenen β Nisi holen',
      },
    },
    {
      id: 'TEA Judgment Nisi Γ',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi Γ' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Purple γ Nisi',
        ja: '紫取って',
        de: 'lilanen γ Nisi holen',
      },
    },
    {
      id: 'TEA Judgment Nisi Δ',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi Δ' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Green δ Nisi',
        ja: '緑取って',
        de: 'grünenen δ Nisi holen',
      },
    },
    {
      id: 'TEA Restraining Order',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
      },
    },
    {
      id: 'TEA House Arrest',
      regex: Regexes.gainsEffect({ effect: 'House Arrest' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
      },
    },
    {
      id: 'TEA Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A80' }),
      alarmText: function(data, matches) {
        if (matches.target == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'スイッチ',
        };
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
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
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        ':Alexander:': ':Alexander:',
        'Alexander Prime': 'Prim-Alexander',
        'Brute Justice': 'Brutalus',
        'Cruise Chaser': 'Chaser-Mecha',
        'Engage!': 'Start!',
        'Jagd Doll': 'Jagdpuppe',
        'Liquid Hand': 'belebte Hand',
        'Living Liquid': 'belebtes Wasser',
        'Liquid Rage': 'levitierte Rage',
        'Perfect Alexander': 'Perfekter Alexander',
        'Plasmasphere': 'Plasmasphäre',
        'Steam Chakram': 'Dampf-Chakram',
        'You:483D': 'Du:483D',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Chaser-Mecha unverwundbar--',
        '--targetable--': '--anvisierbar--',
        'Aetheroplasm': 'Ätheroplasma',
        'Almighty Judgment': 'Göttliches Letzturteil',
        'Alpha Sword': 'Alpha-Schwert',
        'Apocalyptic Ray': 'Apokalyptischer Strahl ',
        'Cascade': 'Cascade',
        'Chakrams': 'Chakrams',
        'Chastening Heat': 'Brennende Verdammung',
        'Collective Reprobation': 'Kollektivstrafe',
        'Crashing Wave': 'Brechende Welle',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Double Rocket Punch': 'Doppelraketenschlag',
        'Down for the Count': 'Am Boden',
        'Drainage': 'Entwässerung',
        'Earth Missile': 'Erd-Geschoss',
        'Embolus': 'Pfropfen',
        'Enumeration': 'Enumeration',
        'Eternal Darkness': 'Ewiges Dunkel',
        'Exhaust': 'Exhaustor',
        'Fate Calibration': 'FZukunftswahl',
        'Fate Projection': 'Zukunftsberechnung',
        'Final Sentence': 'Todesstrafe',
        'Flamethrower': 'Flammenwerfer',
        'Fluid Strike': 'Flüssiger Schlag',
        'Fluid Swing': 'Flüssiger Schwung',
        'Gavel': 'Prozessende',
        'Hand of Pain': 'Qualhand',
        'Hand of Prayer': 'Betende Hand',
        'Hawk Blaster': 'Jagdfalke',
        'Hidden Minefield': 'Getarntes Minenfeld',
        'Inception': 'Raumzeit-Eingriff',
        'Inception Formation': 'Raumzeit-Eingriffsformation',
        'Incinerating Heat': 'Sengende Hitze',
        'Individual Reprobation': 'Einzelstrafe',
        'Irresistible Grace': 'Sammelurteil',
        'J Jump': 'Gewissenssprung',
        'J Kick': 'Gewissenstritt',
        'J Storm': 'Gerechter Sturm',
        'Judgment Crystal': 'Urteilskristall',
        'Judgment Nisi': 'Vorläufige Vollstreckung',
        'Limit Cut': 'Grenzwertüberschreitung',
        'Link-Up': 'Zusammenschluss',
        'Liquid Gaol': 'Wasserkerker',
        'Mega Holy': 'Super-Sanctus',
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'Raketenkommando',
        'Obloquy': 'Obloquy', // FIXME
        'Optical Sight': 'Visier',
        'Ordained Capital Punishment': 'Gnadenlose Ahndung',
        'Ordained Motion': 'Bewegungsbefehl',
        'Ordained Punishment': 'Ahndung',
        'Ordained Stillness': 'Stillstandsbefehl',
        'Photon': 'Photon',
        'Players Remaining': 'Spieler übrig',
        'Pressurize': 'Kompression',
        'Propeller Wind': 'Luftschraube',
        'Protean Wave': 'Proteische Welle',
        'Punishing Wave': 'Strafende Welle',
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': 'Reue',
        'Sacrament': 'Sakrament',
        'Severity': 'Erschwertes',
        'Sluice': 'Schleusenöffnung',
        'Solidarity': 'Kollektiv',
        'Spin Crusher': 'Rotorbrecher',
        'Splash': 'Schwall',
        'Summon Alexander': 'Alexanders Beschwörung',
        'Super Blassty Charge': 'Super-Blassty-Ladung',
        'Super Jump': 'Supersprung',
        'Surety': 'Ortsbindung',
        'Temporal Interference': 'Raumzeit-Manipulation',
        'Temporal Prison': 'Zeitzelle',
        'Temporal Stasis': 'Zeitstillstand',
        'The Final Word': 'Strafzumessung',
        'Throttles': 'Erstickungen',
        'Void Of Repentance': 'Kammer der Buße',
        'Water and Thunder': 'Wasser und Blitz',
        'Whirlwind': 'Wirbelwind',
        'Wormhole Formation': 'Dimensionsspaltungsformation',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        ':Alexander:': ':Alexander:',
        'Alexander Prime': 'Primo-Alexander',
        'Brute Justice': 'Justicier',
        'Cruise Chaser': 'Croiseur-chasseur',
        'Engage!': 'À l\'attaque!',
        'Jagd Doll': 'poupée jagd',
        'Liquid Hand': 'membre liquide',
        'Liquid Rage': 'furie liquide',
        'Living Liquid': 'liquide vivant',
        'Perfect Alexander': 'Alexander parfait',
        'Plasmasphere': 'sphère de plasma',
        'Steam Chakram': 'chakram de vapeur',
        'You:483D': 'You:483D', // FIXME
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Cruise Chaser Invincible--', // FIXME
        '--targetable--': '--Ciblable--',
        'Aetheroplasm': 'Éthéroplasma',
        'Almighty Judgment': 'Sentence divine',
        'Alpha Sword': 'Épée alpha',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Cascade': 'Cascade',
        'Chakrams': 'Chakrams', // FIXME
        'Chastening Heat': 'Chaleur de l\'ordalie',
        'Collective Reprobation': 'Réprobation collective',
        'Crashing Wave': 'Vague percutante',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Double Rocket Punch': 'Double coup de roquette',
        'Down for the Count': 'Au tapis',
        'Drainage': 'Drainage',
        'Earth Missile': 'Missile de terre',
        'Embolus': 'caillot',
        'Enumeration': 'Compte',
        'Eternal Darkness': 'Ténèbres éternelles',
        'Exhaust': 'Échappement',
        'Fate Calibration': 'Fate Calibration', // FIXME
        'Fate Projection': 'Fate Projection', // FIXME
        'Final Sentence': 'Peine capitale',
        'Flamethrower': 'Lance-flammes',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gavel': 'Conclusion de procès',
        'Hand of Pain': 'Main de douleur',
        'Hand of Prayer': 'Main de prière',
        'Hawk Blaster': 'Canon faucon',
        'Hidden Minefield': 'Champ de mines caché',
        'Inception': 'Commencement',
        'Inception Formation': 'Marche du commencement',
        'Incinerating Heat': 'Chaleur purifiante',
        'Individual Reprobation': 'Réprobation individuelle',
        'Irresistible Grace': 'Peines interdépendantes',
        'J Jump': 'Bond justicier',
        'J Kick': 'Pied justicier',
        'J Storm': 'Tempête justicière',
        'Judgment Crystal': 'Cristal du jugement',
        'Judgment Nisi': 'Jugement conditionnel',
        'Limit Cut': 'Dépassement de limites',
        'Link-Up': 'Effort collectif',
        'Liquid Gaol': 'Geôle liquide',
        'Mega Holy': 'Méga Miracle',
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'Commande missile',
        'Obloquy': 'Obloquy', // FIXME
        'Optical Sight': 'Visée optique',
        'Ordained Capital Punishment': 'Châtiment exemplaire',
        'Ordained Motion': 'Défense de s\'arrêter',
        'Ordained Punishment': 'Châtiment',
        'Ordained Stillness': 'Défense de bouger',
        'Photon': 'Photon',
        'Players Remaining': 'Players Remaining', // FIXME
        'Pressurize': 'Repressurisation',
        'Propeller Wind': 'Vent turbine',
        'Protean Wave': 'Vague inconstante',
        'Punishing Wave': 'Vague punitive',
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': 'Repentir',
        'Sacrament': 'Sacrement',
        'Severity': 'Severity', // FIXME
        'Sluice': 'Éclusage',
        'Solidarity': 'Solidarity', // FIXME
        'Spin Crusher': 'Écrasement tournoyant',
        'Splash': 'Éclaboussement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Super Blassty Charge': 'Super charge Blassty',
        'Super Jump': 'Super saut',
        'Surety': 'Surety', // FIXME
        'Temporal Interference': 'Interférences spatio-temporelles',
        'Temporal Prison': 'Geôle temporelle',
        'Temporal Stasis': 'Stase temporelle',
        'The Final Word': 'Prononcé du jugement',
        'Throttles': 'Suffocation', // FIXME
        'Void Of Repentance': 'Vide du repentir',
        'Water and Thunder': 'Water and Thunder', // FIXME
        'Whirlwind': 'Tornade',
        'Wormhole Formation': 'Marche de la fracture dimensionnelle',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        ':Alexander:': ':アレキサンダー:',
        'Alexander Prime': 'アレキサンダー・プライム',
        'Brute Justice': 'ブルートジャスティス',
        'Cruise Chaser': 'クルーズチェイサー',
        'Engage!': '戦闘開始！',
        'Jagd Doll': 'ヤークトドール',
        'Liquid Hand': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
        'Perfect Alexander': 'パーフェクト・アレキサンダー',
        'Plasmasphere': 'プラズマスフィア',
        'Steam Chakram': 'スチームチャクラム',
        'You:483D': 'You:483D', // FIXME
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Cruise Chaser Invincible--', // FIXME
        '--targetable--': '--targetable--',
        'Aetheroplasm': 'エーテル爆雷',
        'Almighty Judgment': '聖なる大審判',
        'Alpha Sword': 'アルファソード',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Cascade': 'カスケード',
        'Chakrams': 'Chakrams', // FIXME
        'Chastening Heat': '神罰の熱線',
        'Collective Reprobation': '群の断罪',
        'Crashing Wave': 'クラッシュウェーブ',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Double Rocket Punch': 'ダブルロケットパンチ',
        'Down for the Count': 'ノックダウン',
        'Drainage': 'ドレナージ',
        'Earth Missile': 'アースミサイル',
        'Embolus': 'エンボラス',
        'Enumeration': 'カウント',
        'Eternal Darkness': '暗黒の運命',
        'Exhaust': 'エグゾースト',
        'Fate Calibration': 'Fate Calibration', // FIXME
        'Fate Projection': 'Fate Projection', // FIXME
        'Final Sentence': '死刑判決',
        'Flamethrower': 'フレイムスロアー',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gavel': '最後の審判：結審',
        'Hand of Pain': 'ハンド・オブ・ペイン',
        'Hand of Prayer': 'ハンド・オブ・プレイヤー',
        'Hawk Blaster': 'ホークブラスター',
        'Hidden Minefield': 'ステルス地雷散布',
        'Inception': '時空潜行',
        'Inception Formation': '時空潜行のマーチ',
        'Incinerating Heat': '浄化の熱線',
        'Individual Reprobation': '個の断罪',
        'Irresistible Grace': '連帯刑',
        'J Jump': 'ジャスティスジャンプ',
        'J Kick': 'ジャスティスキック',
        'J Storm': 'ジャスティスストーム',
        'Judgment Crystal': '審判の結晶',
        'Judgment Nisi': 'ジャッジメントナイサイ',
        'Limit Cut': 'リミッターカット',
        'Link-Up': 'システムリンク',
        'Liquid Gaol': 'リキッドジェイル',
        'Mega Holy': 'メガホーリー',
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'ミサイル全弾発射',
        'Obloquy': 'Obloquy', // FIXME
        'Optical Sight': '照準',
        'Ordained Capital Punishment': '加重誅罰',
        'Ordained Motion': '行動命令',
        'Ordained Punishment': '誅罰',
        'Ordained Stillness': '静止命令',
        'Photon': 'フォトン',
        'Players Remaining': 'Players Remaining', // FIXME
        'Pressurize': '水圧充填',
        'Propeller Wind': 'プロペラウィンド',
        'Protean Wave': 'プロティアンウェイブ',
        'Punishing Wave': 'パニッシュウェーブ',
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': '罪の意識',
        'Sacrament': '十字の秘蹟',
        'Severity': 'Severity', // FIXME
        'Sluice': 'スルース',
        'Solidarity': 'Solidarity', // FIXME
        'Spin Crusher': 'スピンクラッシャー',
        'Splash': 'スプラッシュ',
        'Summon Alexander': 'アレキサンダー召喚',
        'Super Blassty Charge': 'スーパーブラスティ・チャージ',
        'Super Jump': 'スーパージャンプ',
        'Surety': 'Surety', // FIXME
        'Temporal Interference': '時空干渉',
        'Temporal Prison': '時の牢獄',
        'Temporal Stasis': '時間停止',
        'The Final Word': '確定判決',
        'Throttles': '窒息', // FIXME
        'Void Of Repentance': '懺悔の間',
        'Water and Thunder': 'Water and Thunder', // FIXME
        'Whirlwind': '竜巻',
        'Wormhole Formation': '次元断絶のマーチ',
      },
    },
  ],
}];
