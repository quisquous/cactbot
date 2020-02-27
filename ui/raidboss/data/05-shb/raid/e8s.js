'use strict';

// TODO: figure out *anything* with mirrors and mirror colors
// TODO: yell at you to take the last tower for Light Rampant if needed
// TODO: yell at you to take the last tower for Icelit Dragonsong if needed
// TODO: House of light clock position callout
// TODO: "move" calls for all the akh raihs
// TODO: Light Rampant early callouts (who has prox marker, who gets aoes)
// TODO: reflected scythe kick callout (stand by mirror)
// TODO: reflected axe kick callout (get under)
// TODO: callouts for initial Hallowed Wings mirrors?
// TODO: callouts for the stack group mirrors?
// TODO: callouts for the Shining Armor mirrors?
// TODO: icelit dragonsong callouts?

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  timelineFile: 'e8s.txt',
  timelineTriggers: [
    {
      id: 'E8S Shining Armor',
      regex: /Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway(),
    },
    {
      id: 'E8S Rush',
      regex: /Rush \d/,
      beforeSeconds: 5,
      infoText: function(data) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return {
          en: 'Tether ' + data.rushCount,
          fr: 'Lien ' + data.rushCount,
        };
      },
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      response: Responses.getBehind(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      alertText: {
        en: 'Go Front / Sides',
      },
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 43,
      suppressSeconds: 80,
      infoText: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            fr: 'Taillade de givre bientot',
          };
        }
        return {
          en: 'Driving Frost Next',
          fr: 'Percée de givre bientot',
        };
      },
    },
    {
      id: 'E8S Diamond Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse',
        fr: 'Guérison',
      },
    },
    {
      id: 'E8S Double Slap',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Refulgent Chain',
      regex: Regexes.gainsEffect({ effect: 'Refulgent Chain' }),
      regexFr: Regexes.gainsEffect({ effect: 'Chaînes de Lumière' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: {
        en: 'Chain on YOU',
        fr: 'Chaine sur VOUS',
      },
    },
    {
      id: 'E8S Holy Light',
      regex: Regexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        fr: 'Orbe sur VOUS',
      },
    },
    {
      id: 'E8S Banish III',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      infoText: {
        en: 'Stacks',
        fr: 'Packages',
      },
    },
    {
      id: 'E8S Banish III Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Morn Afah',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Morn Afah on YOU',
            fr: 'Morn Afah sur YOU',
          };
        }
        if (data.role == 'tank' || data.role == 'healer' || data.CanAddle()) {
          return {
            en: 'Morn Afah on ' + matches.target,
            fr: 'Morn Afah sur ' + matches.target,
          };
        }
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E8S Wyrm\'s Lament',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      regex: Regexes.gainsEffect({ effect: 'Wyrmclaw' }),
      regexFr: Regexes.gainsEffect({ effect: 'Griffes du Dragon divin' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmclawNumber = {
            '14': 1,
            '22': 2,
            '30': 3,
            '38': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmclawNumber = {
            '22': 1,
            '38': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Red #' + data.wyrmclawNumber,
          fr: 'Rouge #' + data.wyrmclawNumber,
        };
      },
    },
    {
      id: 'E8S Wyrmfang',
      regex: Regexes.gainsEffect({ effect: 'Wyrmfang' }),
      regexFr: Regexes.gainsEffect({ effect: 'Crocs du Dragon divin' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmfangNumber = {
            '20': 1,
            '28': 2,
            '36': 3,
            '44': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmfangNumber = {
            '28': 1,
            '44': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Blue #' + data.wyrmfangNumber,
          fr: 'Bleu #' + data.wyrmfangNumber,
        };
      },
    },
    {
      id: 'E8S Holy',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      alertText: {
        en: 'Back Then Front',
        fr: 'Derrière puis devant',
      },
    },
    {
      id: 'E8S Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      alertText: {
        en: 'Front Then Back',
        fr: 'Devant puis derrière',
      },
    },
    {
      id: 'E8S Spiteful Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D70', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse DPS Only',
        fr: 'Guérissez les DPS seulement',
      },
    },
    {
      id: 'E8S Banish',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.stack('alert'),
    },
    {
      id: 'E8S Banish Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.spread('alarm'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'luminous aether': 'Lichtäther',
        'holy light': 'heilig[a] Licht',
        'great wyrm': 'Körper[p] des heiligen Drachen',
        'frozen mirror': 'Eisspiegel',
        'electric aether': 'Blitzäther',
        'earthen aether': 'Erdäther',
        'aqueous aether': 'Wasseräther',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Urkristall',
      },
      'replaceText': {
        'the Path of Light': 'Pfad des Lichts',
        'the House of Light': 'Tsunami des Lichts',
        'Wyrm\'s Lament': 'Brüllen des heiligen Drachen',
        'Twin Stillness': 'Zwillingsschwerter der Stille',
        'Stoneskin': 'Steinhaut',
        'Spiteful Dance': 'Kalter Tanz',
        'Skyfall': 'Vernichtung der Welt',
        'Shock Spikes': 'Schockstachel',
        'Shining Armor': 'Funkelnde Rüstung',
        'Shattered World': 'Zersplitterte Welt',
        'Scythe Kick': 'Abwehrtritt',
        'Rush': 'Sturm',
        'Reflected Shining Armor': 'Spiegelung: Funkelnde Rüstung',
        'Reflected Scythe Kick': 'Spiegelung: Abwehrtritt',
        'Reflected Hallowed Wings': 'Spiegelung: Heilige Schwingen',
        'Reflected Frost Armor': 'Spiegelung: Frostrüstung',
        'Reflected Drachen Armor': 'Spiegelung: Drachenrüstung',
        'Reflected Biting Frost': 'Spiegelung: Frosthieb',
        'Morn Afah': 'Morn Afah',
        'Mirror, Mirror': 'Spiegelland',
        'Longing of the Lost': 'Heiliger Drache',
        'Light Rampant': 'Überflutendes Licht',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Icelit Dragonsong': 'Lied von Eis und Licht',
        'Holy': 'Sanctus',
        'Heavenly Strike': 'Elysischer Schlag',
        'Heart Asunder': 'Herzensbrecher',
        'Hallowed Wings': 'Heilige Schwingen',
        'Frost Armor(?! )': 'Frostrüstung',
        'Frigid Water': 'Eisfrost',
        'Frigid Stone': 'Eisstein',
        'Frigid Needle': 'Eisnadel',
        'Frigid Eruption': 'Eiseruption',
        'Driving Frost': 'Froststoß',
        'Draconic Strike': 'Drakonischer Schlag',
        'Drachen Armor': 'Drachenrüstung',
        'Double Slap': 'Doppelschlag',
        'Diamond Frost': 'Diamantstaub',
        'Bright Pulse': 'Glühen',
        'Bright Hunger': 'Erosionslicht',
        'Biting Frost': 'Frosthieb',
        'Banish III Divided': 'Geteiltes Verbannga',
        'Banish III': 'Verbannga',
        'Banish Divided': 'Geteiltes Verbannen',
        'Banish(?! )': 'Verbannen',
        'Axe Kick': 'Axttritt',
        'Akh Rhai': 'Akh Rhai',
        'Akh Morn': 'Akh Morn',
        'Absolute Zero': 'Absoluter Nullpunkt',

        // FIXME
        'Reflected Frost \\(G\\)': 'Reflected Frost (G)',
        'Reflected Frost \\(R\\)': 'Reflected Frost (R)',
        '--middle--': '--middle--',
        'Reflected Kick \\(G\\)': 'Reflected Kick (G)',
        'Reflected Wings \\(B\\)': 'Reflected Wings (B)',
        'Reflected Wings \\(G\\)': 'Reflected Wings (G)',
        'Reflected Wings \\(R\\)': 'Reflected Wings (R)',
        'Twin Silence/Stillness': 'Twin Silence/Stillness',
        '--teleport--': '--teleport--',
        'Reflected Armor \\(B\\)': 'Reflected Armor (B)',
        'Reflected Armor \\(G\\)': 'Reflected Armor (G)',
        'Reflected Armor \\(R\\)': 'Reflected Armor (R)',
        'Spiteful/Embittered Dance': 'Spiteful/Embittered Dance',
        'Reflected Drachen': 'Reflected Drachen',
        'Inescapable Illumination': 'Inescapable Illumination',
      },
      '~effectNames': {
        'Wyrmfang': 'Reißzähne des heiligen Drachen',
        'Wyrmclaw': 'Krallen des heiligen Drachen',
        'Thin Ice': 'Glatteis',
        'Refulgent Fate': 'Bann des Lichts',
        'Refulgent Chain': 'Lichtfessel',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Lightsteeped': 'Exzessives Licht',
        'Light Resistance Down': 'Lichtresistenz -',
        'Heavy': 'Gewicht',
        'Hated of the Wyrm': 'Verfluchung des Drachen',
        'Hated of Frost': 'Verfluchung der Eisgöttin',
        'Freezing': 'Allmähliche Kühlung',
        'Down for the Count': 'Am Boden',
        'Deep Freeze': 'Tiefkühlung',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'luminous aether': 'éther de lumière',
        'holy light': 'lumière sacrée',
        'great wyrm': 'Dragon divin',
        'frozen mirror': 'miroir de glace',
        'electric aether': 'éther de foudre',
        'earthen aether': 'éther de terre',
        'aqueous aether': 'éther d\'eau',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Cristal-mère',
      },
      'replaceText': {
        'the Path of Light': 'Voie de lumière',
        'the House of Light': 'Raz-de-lumière',
        'Wyrm\'s Lament': 'Rugissement du Dragon divin',
        'Twin Stillness': 'Entaille de la quiétude',
        'Stoneskin': 'Cuirasse',
        'Spiteful Dance': 'Danse de la froideur',
        'Skyfall': 'Anéantissement',
        'Shock Spikes': 'Pointes de foudre',
        'Shining Armor': 'Armure scintillante',
        'Shattered World': 'Monde fracassé',
        'Scythe Kick': 'Jambe faucheuse',
        'Rush': 'Jaillissement',
        'Reflected Shining Armor': 'Réverbération : Armure scintillante',
        'Reflected Scythe Kick': 'Réverbération : Jambe faucheuse',
        'Reflected Hallowed Wings': 'Réverbération : Aile sacrée',
        'Reflected Frost Armor': 'Réverbération : Armure de givre',
        'Reflected Drachen Armor': 'Réverbération : Armure des dragons',
        'Reflected Biting Frost': 'Réverbération : Taillade de givre',
        'Morn Afah': 'Morn Afah',
        'Mirror, Mirror': 'Monde des miroirs',
        'Longing of the Lost': 'Esprit du Dragon divin',
        'Light Rampant': 'Débordement de Lumière',
        'Icicle Impact': 'Impact de stalactite',
        'Icelit Dragonsong': 'Chant de Glace et de Lumière',
        'Holy': 'Miracle',
        'Heavenly Strike': 'Frappe céleste',
        'Heart Asunder': 'Cœur déchiré',
        'Hallowed Wings': 'Aile sacrée',
        'Frost Armor(?! )': 'Armure de givre',
        'Frigid Water': 'Cataracte gelée',
        'Frigid Stone': 'Rocher de glace',
        'Frigid Needle': 'Dards de glace',
        'Frigid Eruption': 'Éruption de glace',
        'Driving Frost': 'Percée de givre',
        'Draconic Strike': 'Frappe draconique',
        'Drachen Armor': 'Armure des dragons',
        'Double Slap': 'Gifle redoublée',
        'Diamond Frost': 'Poussière de diamant',
        'Bright Pulse': 'Éclat',
        'Bright Hunger': 'Lumière dévorante',
        'Biting Frost': 'Taillade de givre',
        'Banish III Divided': 'Méga Bannissement fractionné',
        'Banish III': 'Méga Bannissement',
        'Banish Divided': 'Bannissement fractionné',
        'Banish(?! )': 'Bannissement',
        'Axe Kick': 'Jambe pourfendeuse',
        'Akh Rhai': 'Akh Rhai',
        'Akh Morn': 'Akh Morn',
        'Absolute Zero': 'Zéro absolu',
        '--middle--': '-- Milieu --',
        '--teleport--': '-- Téléportation --',

        // FIXME
        'Reflected Frost \\(G\\)': 'Reflected Frost (G)',
        'Reflected Frost \\(R\\)': 'Reflected Frost (R)',
        'Reflected Kick \\(G\\)': 'Reflected Kick (G)',
        'Reflected Wings \\(B\\)': 'Reflected Wings (B)',
        'Reflected Wings \\(G\\)': 'Reflected Wings (G)',
        'Reflected Wings \\(R\\)': 'Reflected Wings (R)',
        'Twin Silence/Stillness': 'Twin Silence/Stillness',
        'Reflected Armor \\(B\\)': 'Reflected Armor (B)',
        'Reflected Armor \\(G\\)': 'Reflected Armor (G)',
        'Reflected Armor \\(R\\)': 'Reflected Armor (R)',
        'Spiteful/Embittered Dance': 'Spiteful/Embittered Dance',
        'Reflected Drachen': 'Reflected Drachen',
        'Inescapable Illumination': 'Inescapable Illumination',
      },
      '~effectNames': {
        'Wyrmfang': 'Crocs du Dragon divin',
        'Wyrmclaw': 'Griffes du Dragon divin',
        'Thin Ice': 'Verglas',
        'Refulgent Fate': 'Lien de Lumière',
        'Refulgent Chain': 'Chaînes de Lumière',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Lightsteeped': 'Lumière excédentaire',
        'Light Resistance Down': 'Résistance à la Lumière réduite',
        'Heavy': 'Pesanteur',
        'Hated of the Wyrm': 'Malédiction du Dragon divin',
        'Hated of Frost': 'Malédiction de la Furie des neiges',
        'Freezing': 'Congélation graduelle',
        'Down for the Count': 'Au tapis',
        'Deep Freeze': 'Congélation',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'luminous aether': 'ライト・エーテル',
        'holy light': '聖なる光',
        'great wyrm': '聖竜',
        'frozen mirror': '氷面鏡',
        'electric aether': 'ライトニング・エーテル',
        'earthen aether': 'アース・エーテル',
        'aqueous aether': 'ウォーター・エーテル',
        'Shiva': 'シヴァ',
        'Mothercrystal': 'マザークリスタル',
      },
      'replaceText': {
        'the Path of Light': '光の波動',
        'the House of Light': '光の津波',
        'attack': '攻撃',
        'Wyrm\'s Lament': '聖竜の咆哮',
        'Twin Stillness': '静寂の双剣技',
        'Stoneskin': 'ストンスキン',
        'Spiteful Dance': '冷厳の舞踏技',
        'Skyfall': '世界消滅',
        'Shock Spikes': 'ショックスパイク',
        'Shining Armor': 'ブライトアーマー',
        'Shattered World': 'シャッタード・ワールド',
        'Scythe Kick': 'サイスキック',
        'Rush': 'ラッシュ',
        'Reflected Shining Armor': 'ミラーリング・ブライトアーマー',
        'Reflected Scythe Kick': 'ミラーリング・サイスキック',
        'Reflected Hallowed Wings': 'ミラーリング・ホーリーウィング',
        'Reflected Frost Armor': 'ミラーリング・フロストアーマー',
        'Reflected Drachen Armor': 'ミラーリング・ドラゴンアーマー',
        'Reflected Biting Frost': 'ミラーリング・フロストスラッシュ',
        'Morn Afah': 'モーン・アファー',
        'Mirror, Mirror': '鏡の国',
        'Longing of the Lost': '聖竜気',
        'Light Rampant': '光の暴走',
        'Icicle Impact': 'アイシクルインパクト',
        'Icelit Dragonsong': '氷と光の竜詩',
        'Holy': 'ホーリー',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Heart Asunder': 'ハートアサンダー',
        'Hallowed Wings': 'ホーリーウィング',
        'Frost Armor(?! )': 'フロストアーマー',
        'Frigid Water': 'アイスフロスト',
        'Frigid Stone': 'アイスストーン',
        'Frigid Needle': 'アイスニードル',
        'Frigid Eruption': 'アイスエラプション',
        'Driving Frost': 'フロストスラスト',
        'Draconic Strike': 'ドラコニックストライク',
        'Drachen Armor': 'ドラゴンアーマー',
        'Double Slap': 'ダブルスラップ',
        'Diamond Frost': 'ダイヤモンドダスト',
        'Bright Pulse': '閃光',
        'Bright Hunger': '浸食光',
        'Biting Frost': 'フロストスラッシュ',
        'Banish III Divided': 'ディバイデッド・バニシュガ',
        'Banish III': 'バニシュガ',
        'Banish Divided': 'ディバイデッド・バニシュ',
        'Banish(?! )': 'バニシュ',
        'Axe Kick': 'アクスキック',
        'Akh Rhai': 'アク・ラーイ',
        'Akh Morn': 'アク・モーン',
        'Absolute Zero': '絶対零度',

        // FIXME
        'Reflected Frost \\(G\\)': 'Reflected Frost (G)',
        'Reflected Frost \\(R\\)': 'Reflected Frost (R)',
        '--middle--': '--middle--',
        'Reflected Kick \\(G\\)': 'Reflected Kick (G)',
        'Reflected Wings \\(B\\)': 'Reflected Wings (B)',
        'Reflected Wings \\(G\\)': 'Reflected Wings (G)',
        'Reflected Wings \\(R\\)': 'Reflected Wings (R)',
        'Twin Silence/Stillness': 'Twin Silence/Stillness',
        '--teleport--': '--teleport--',
        'Reflected Armor \\(B\\)': 'Reflected Armor (B)',
        'Reflected Armor \\(G\\)': 'Reflected Armor (G)',
        'Reflected Armor \\(R\\)': 'Reflected Armor (R)',
        'Spiteful/Embittered Dance': 'Spiteful/Embittered Dance',
        'Reflected Drachen': 'Reflected Drachen',
        'Inescapable Illumination': 'Inescapable Illumination',
      },
      '~effectNames': {
        'Wyrmfang': '聖竜の牙',
        'Wyrmclaw': '聖竜の爪',
        'Thin Ice': '氷床',
        'Refulgent Fate': '光の呪縛',
        'Refulgent Chain': '光の鎖',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Lightsteeped': '過剰光',
        'Light Resistance Down': '光属性耐性低下',
        'Heavy': 'ヘヴィ',
        'Hated of the Wyrm': '聖竜の呪い',
        'Hated of Frost': '氷神の呪い',
        'Freezing': '徐々に氷結',
        'Down for the Count': 'ノックダウン',
        'Deep Freeze': '氷結',
        'Damage Down': 'ダメージ低下',
      },
    },
  ],
}];
