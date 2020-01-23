'use strict';

[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: Regexes.startsUsing({ id: '2633', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2633', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2633', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2633', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2633', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2633', source: '배덕의 황제 마티우스', capture: false }),
      delaySeconds: 11,
      infoText: {
        en: 'Kill Aqua Spheres',
        de: 'Wasserkugeln zerstören',
        fr: 'Détruire les bulles d\'eau',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
      },
    },
    {
      id: 'Rab Mateus Breathless Gain',
      regex: Regexes.gainsEffect({ effect: 'Breathless' }),
      regexDe: Regexes.gainsEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.gainsEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.gainsEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.gainsEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.breathless >= 7) {
          return {
            en: 'Breathless: ' + (data.breathless + 1),
            de: 'Atemnot: ' + (data.breathless + 1),
            fr: 'Suffocation :' + (data.breathless + 1),
          };
        }
      },
      alarmText: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'Get In Bubble',
            de: 'Geh in die Blase',
            fr: 'Allez dans une bulle',
          };
        }
      },
      tts: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'bubble',
            de: 'blase',
            fr: 'bulle',
          };
        }
      },
      run: function(data) {
        data.breathless = data.breathless | 0;
        data.breathless++;
      },
    },
    {
      id: 'Rab Mateus Breathless Lose',
      regex: Regexes.losesEffect({ effect: 'Breathless' }),
      regexDe: Regexes.losesEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.losesEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.losesEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.losesEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.losesEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: Regexes.startsUsing({ id: '263D', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '263D', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '263D', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '263D', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '263D', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '263D', source: '배덕의 황제 마티우스', capture: false }),
      alertText: {
        en: 'Move To Safe Spot',
        de: 'Zur sicheren Zone',
        fr: 'Allez en zone sûre',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Zone sure',
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      regex: Regexes.startsUsing({ id: '25D7', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25D7', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25D7', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25D7', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25D7', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25D7', source: '통제자 하쉬말림', capture: false }),
      infoText: {
        en: 'Tank Cleave',
        de: 'Tank Cleave',
        fr: 'Tank Cleave',
      },
      tts: {
        en: 'tank cleave',
        de: 'tenk klief',
        fr: 'tank clive',
      },
    },
    {
      id: 'Rab Hashmal Earth Hammer',
      regex: Regexes.startsUsing({ id: '25CB', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25CB', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25CB', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25CB', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25CB', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25CB', source: '통제자 하쉬말림', capture: false }),
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
        fr: 'Eloignez-vous',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Eloignez vous',
      },
    },
    {
      id: 'Rab Hashmal Golems',
      regex: Regexes.startsUsing({ id: '25D4', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25D4', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25D4', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25D4', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25D4', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25D4', source: '통제자 하쉬말림', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Kill Golems',
        de: 'Golems töten',
        fr: 'Détruisez les golems',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
      },
    },
    {
      id: 'Rab Trash Dragon Voice',
      regex: Regexes.startsUsing({ id: 'D10', source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'D10', source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'D10', source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'D10', source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'D10', source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'D10', source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Dragon Voice: Move In',
        de: 'Stimme Des Drachen: Rein',
        fr: 'Voix Du Dragon : Packez-vous',
      },
      tts: {
        en: 'dragon voice',
        de: 'Stimme des Drachen',
        fr: 'Voix Du Dragon',
      },
    },
    {
      id: 'Rab Trash Ram Voice',
      regex: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['D0F', '273B'], source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['D0F', '273B'], source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Ram Voice: Move Out',
        de: 'Stimme Des Widders: Raus',
        fr: 'Voix Du Bélier : Eloignez-vous',
      },
      tts: {
        en: 'rams voice',
        de: 'Stimme des Widders',
        fr: 'Voix Du Bélier',
      },
    },
    {
      id: 'Rab Rofocale Chariot',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Move In (Chariot)',
        de: 'Raus da (Streitwagen)',
        fr: 'Allez dedans (Chariot)',
      },
      tts: {
        en: 'chariot',
        de: 'Streitwagen',
        fr: 'chariot',
      },
    },
    {
      id: 'Rab Rofocale Trample',
      regex: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2676', source: 'Rofocale Le Roi Centaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2676', source: '人馬王ロフォカレ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2676', source: '人马王洛弗卡勒', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2676', source: '인마왕 로포칼레', capture: false }),
      alertText: {
        en: 'Trample',
        de: 'Zertrampeln',
        fr: 'Fauchage',
      },
    },
    {
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '261A', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '261A', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '261A', capture: false }),
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '2619', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '2619', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '2619', capture: false }),
      run: function(data) {
        data.maskValue = false;
      },
    },
    {
      id: 'Rab Argath Command Scatter',
      regex: Regexes.headMarker({ id: '007B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Move',
            de: 'Bewegen',
            fr: 'Bougez',
          };
        }
        return {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
        };
      },
    },
    {
      id: 'Rab Argath Command Turn',
      regex: Regexes.headMarker({ id: '007C' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Look Away',
            de: 'Wegschauen',
            fr: 'Regardez ailleurs',
          };
        }
        return {
          en: 'Look Towards',
          de: 'Anschauen',
          fr: 'Regardez le boss',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Added new combatant Archaeodemon': 'Added new combatant Archaeodemon', // FIXME
        'Argath Thadalfus starts using Crippling Blow': 'Argath Thadalfus starts using Crippling Blow', // FIXME
        'Argath Thadalfus starts using Dark Ultima': 'Argath Thadalfus starts using Dark Ultima', // FIXME
        'Argath Thadalfus starts using Empty Soul': 'Argath Thadalfus starts using Empty Soul', // FIXME
        'Argath Thadalfus starts using Fire IV': 'Argath Thadalfus starts using Fire IV', // FIXME
        'Argath Thadalfus starts using Gnawing Dread': 'Argath Thadalfus starts using Gnawing Dread', // FIXME
        'Argath Thadalfus starts using Judgment Blade': 'Argath Thadalfus starts using Judgment Blade', // FIXME
        'Argath Thadalfus starts using Royal Blood': 'Argath Thadalfus starts using Royal Blood', // FIXME
        'Argath Thadalfus starts using Trepidation': 'Argath Thadalfus starts using Trepidation', // FIXME
        'Command Tower starts using Command Tower': 'Command Tower starts using Command Tower', // FIXME
        'Frostwave': 'Polarlanze',
        'Hashmal, Bringer Of Order starts using Control Tower on Hashmal': 'Hashmal, Bringer Of Order starts using Control Tower on Hashmal', // FIXME
        'Hashmal, Bringer Of Order starts using Extreme Edge': 'Hashmal, Bringer Of Order starts using Extreme Edge', // FIXME
        'Hashmal, Bringer Of Order starts using Landwaster': 'Hashmal, Bringer Of Order starts using Landwaster', // FIXME
        'Hashmal, Bringer Of Order starts using Summon': 'Hashmal, Bringer Of Order starts using Summon', // FIXME
        'I am (?:Revelation|the truth from which you run|the lies upon which you sup)': 'I am (?:Revelation|the truth from which you run|the lies upon which you sup)', // FIXME
        'Mateus, The Corrupt starts using Rebind': 'Mateus, The Corrupt starts using Rebind', // FIXME
        'Mateus, The Corrupt starts using Unbind': 'Mateus, The Corrupt starts using Unbind', // FIXME
        'Mateus, the Corrupt': 'Mateus (?:der|die|das) Peiniger',
        'Removing combatant Argath Thadalfus': 'Removing combatant Argath Thadalfus', // FIXME
        'Removing combatant Hashmal, Bringer Of Order': 'Removing combatant Hashmal, Bringer Of Order', // FIXME
        'Removing combatant Mateus, The Corrupt': 'Removing combatant Mateus, The Corrupt', // FIXME
        'Removing combatant Rofocale': 'Removing combatant Rofocale', // FIXME
        'Rofocale': 'Rofocale',
        'The Crumbling Bridge will be sealed off': 'The Crumbling Bridge will be sealed off', // FIXME
        'The Lesalia Garden Ruins will be sealed off': 'The Lesalia Garden Ruins will be sealed off', // FIXME
        'The Lesalia Temple Ruins will be sealed off': 'The Lesalia Temple Ruins will be sealed off', // FIXME
        'The Palace Square will be sealed off': 'The Palace Square will be sealed off', // FIXME
        'The heavens tremble in my wake': 'The heavens tremble in my wake', // FIXME
      },
      'replaceText': {
        '--enrage--': '--enrage--', // FIXME
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        '--reset--': '--reset--', // FIXME
        '--start--': '--start--', // FIXME
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'Eiska',
        'Chariot': 'Streitwagen',
        'Coldblood': 'Kaltblut',
        'Command Tower': 'Turmkommando',
        'Control Tower': 'Turmkontrolle',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Crush Helm': 'Himmelsbombardement',
        'Crush Weapon': 'Jenseitsschrei',
        'Cry of Victory': 'Kampfruf',
        'Dark Geas': 'Dunkles Gelöbnis',
        'Earth Hammer': 'Erdhammer',
        'Embrace': 'Attacke',
        'Extreme Edge': 'Extremkante',
        'Fire IV': 'Feuka',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': 'Polarlanze',
        'Gnawing Dread': 'Nagende Angst',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': 'Himmelsgewalt',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'Aburteilung',
        'Landwaster': 'Landverwüster',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': 'Einzelgänger',
        'Pomp and Circumstance': 'Pauken und Trompeten',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'Seiska',
        'Rock Cutter': 'Steinfräse',
        'Royal Blood': 'Blaues Blut',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': 'Seelenspießer',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': 'Turmdivision',
        'Trample': 'Mariden-Stampfer',
        'Trepidation': 'Beklemmung',
        'Unbind': 'Loseisen',
        'Unrelenting': 'Unerbittliche Klinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Added new combatant Archaeodemon': 'Added new combatant Archaeodemon', // FIXME
        'Argath Thadalfus starts using Crippling Blow': 'Argath Thadalfus starts using Crippling Blow', // FIXME
        'Argath Thadalfus starts using Dark Ultima': 'Argath Thadalfus starts using Dark Ultima', // FIXME
        'Argath Thadalfus starts using Empty Soul': 'Argath Thadalfus starts using Empty Soul', // FIXME
        'Argath Thadalfus starts using Fire IV': 'Argath Thadalfus starts using Fire IV', // FIXME
        'Argath Thadalfus starts using Gnawing Dread': 'Argath Thadalfus starts using Gnawing Dread', // FIXME
        'Argath Thadalfus starts using Judgment Blade': 'Argath Thadalfus starts using Judgment Blade', // FIXME
        'Argath Thadalfus starts using Royal Blood': 'Argath Thadalfus starts using Royal Blood', // FIXME
        'Argath Thadalfus starts using Trepidation': 'Argath Thadalfus starts using Trepidation', // FIXME
        'Command Tower starts using Command Tower': 'Command Tower starts using Command Tower', // FIXME
        'Frostwave': 'Vague réfrigérante',
        'Hashmal, Bringer Of Order starts using Control Tower on Hashmal': 'Hashmal, Bringer Of Order starts using Control Tower on Hashmal', // FIXME
        'Hashmal, Bringer Of Order starts using Extreme Edge': 'Hashmal, Bringer Of Order starts using Extreme Edge', // FIXME
        'Hashmal, Bringer Of Order starts using Landwaster': 'Hashmal, Bringer Of Order starts using Landwaster', // FIXME
        'Hashmal, Bringer Of Order starts using Summon': 'Hashmal, Bringer Of Order starts using Summon', // FIXME
        'I am (?:Revelation|the truth from which you run|the lies upon which you sup)': 'I am (?:Revelation|the truth from which you run|the lies upon which you sup)', // FIXME
        'Mateus, The Corrupt starts using Rebind': 'Mateus, The Corrupt starts using Rebind', // FIXME
        'Mateus, The Corrupt starts using Unbind': 'Mateus, The Corrupt starts using Unbind', // FIXME
        'Mateus, the Corrupt': 'Mateus le Corrompu',
        'Removing combatant Argath Thadalfus': 'Removing combatant Argath Thadalfus', // FIXME
        'Removing combatant Hashmal, Bringer Of Order': 'Removing combatant Hashmal, Bringer Of Order', // FIXME
        'Removing combatant Mateus, The Corrupt': 'Removing combatant Mateus, The Corrupt', // FIXME
        'Removing combatant Rofocale': 'Removing combatant Rofocale', // FIXME
        'Rofocale': 'Rofocale le Roi centaure',
        'The Crumbling Bridge will be sealed off': 'The Crumbling Bridge will be sealed off', // FIXME
        'The Lesalia Garden Ruins will be sealed off': 'The Lesalia Garden Ruins will be sealed off', // FIXME
        'The Lesalia Temple Ruins will be sealed off': 'The Lesalia Temple Ruins will be sealed off', // FIXME
        'The Palace Square will be sealed off': 'The Palace Square will be sealed off', // FIXME
        'The heavens tremble in my wake': 'The heavens tremble in my wake', // FIXME
      },
      'replaceText': {
        '--enrage--': '--enrage--', // FIXME
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        '--reset--': '--reset--', // FIXME
        '--start--': '--start--', // FIXME
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'Giga Glace',
        'Chariot': 'Charge centaure',
        'Coldblood': 'Sang-froid',
        'Command Tower': 'Tour de commandement',
        'Control Tower': 'Tour de contrôle',
        'Crippling Blow': 'Coup handicapant',
        'Crush Helm': 'Bombardement céleste',
        'Crush Weapon': 'Cri de l\'au-delà',
        'Cry of Victory': 'Cri de triomphe',
        'Dark Geas': 'Invocation ténébreuse',
        'Earth Hammer': 'Marteau tellurique',
        'Embrace': 'Attaque',
        'Extreme Edge': 'Taille suprême',
        'Fire IV': 'Giga Feu',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': 'Vague réfrigérante',
        'Gnawing Dread': 'Peur calamiteuse',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': 'Marche triomphale',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'Jugement',
        'Landwaster': 'Dislocation terrestre',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': 'Franc-tireur',
        'Pomp and Circumstance': 'La pompe et l’attirail',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'Giga Séisme',
        'Rock Cutter': 'Trancheur rocheux',
        'Royal Blood': 'Sang royal',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': 'Fixage d\'âme',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': 'Tour de soumission',
        'Trample': 'Martèlement pachydermique',
        'Trepidation': 'Trépidation',
        'Unbind': 'Délivrance',
        'Unrelenting': 'Déferlement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Added new combatant Archaeodemon': 'Added new combatant Archaeodemon', // FIXME
        'Argath Thadalfus starts using Crippling Blow': 'Argath Thadalfus starts using Crippling Blow', // FIXME
        'Argath Thadalfus starts using Dark Ultima': 'Argath Thadalfus starts using Dark Ultima', // FIXME
        'Argath Thadalfus starts using Empty Soul': 'Argath Thadalfus starts using Empty Soul', // FIXME
        'Argath Thadalfus starts using Fire IV': 'Argath Thadalfus starts using Fire IV', // FIXME
        'Argath Thadalfus starts using Gnawing Dread': 'Argath Thadalfus starts using Gnawing Dread', // FIXME
        'Argath Thadalfus starts using Judgment Blade': 'Argath Thadalfus starts using Judgment Blade', // FIXME
        'Argath Thadalfus starts using Royal Blood': 'Argath Thadalfus starts using Royal Blood', // FIXME
        'Argath Thadalfus starts using Trepidation': 'Argath Thadalfus starts using Trepidation', // FIXME
        'Command Tower starts using Command Tower': 'Command Tower starts using Command Tower', // FIXME
        'Frostwave': '凍てつく波動',
        'Hashmal, Bringer Of Order starts using Control Tower on Hashmal': 'Hashmal, Bringer Of Order starts using Control Tower on Hashmal', // FIXME
        'Hashmal, Bringer Of Order starts using Extreme Edge': 'Hashmal, Bringer Of Order starts using Extreme Edge', // FIXME
        'Hashmal, Bringer Of Order starts using Landwaster': 'Hashmal, Bringer Of Order starts using Landwaster', // FIXME
        'Hashmal, Bringer Of Order starts using Summon': 'Hashmal, Bringer Of Order starts using Summon', // FIXME
        'I am (?:Revelation|the truth from which you run|the lies upon which you sup)': 'I am (?:Revelation|the truth from which you run|the lies upon which you sup)', // FIXME
        'Mateus, The Corrupt starts using Rebind': 'Mateus, The Corrupt starts using Rebind', // FIXME
        'Mateus, The Corrupt starts using Unbind': 'Mateus, The Corrupt starts using Unbind', // FIXME
        'Mateus, the Corrupt': '背徳の皇帝マティウス',
        'Removing combatant Argath Thadalfus': 'Removing combatant Argath Thadalfus', // FIXME
        'Removing combatant Hashmal, Bringer Of Order': 'Removing combatant Hashmal, Bringer Of Order', // FIXME
        'Removing combatant Mateus, The Corrupt': 'Removing combatant Mateus, The Corrupt', // FIXME
        'Removing combatant Rofocale': 'Removing combatant Rofocale', // FIXME
        'Rofocale': '人馬王ロフォカレ',
        'The Crumbling Bridge will be sealed off': 'The Crumbling Bridge will be sealed off', // FIXME
        'The Lesalia Garden Ruins will be sealed off': 'The Lesalia Garden Ruins will be sealed off', // FIXME
        'The Lesalia Temple Ruins will be sealed off': 'The Lesalia Temple Ruins will be sealed off', // FIXME
        'The Palace Square will be sealed off': 'The Palace Square will be sealed off', // FIXME
        'The heavens tremble in my wake': 'The heavens tremble in my wake', // FIXME
      },
      'replaceText': {
        '--enrage--': '--enrage--', // FIXME
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        '--reset--': '--reset--', // FIXME
        '--start--': '--start--', // FIXME
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'ブリザジャ',
        'Chariot': '人馬戦車',
        'Coldblood': '冷血乱舞',
        'Command Tower': '支配の塔',
        'Control Tower': '統制の塔',
        'Crippling Blow': '痛打',
        'Crush Helm': '星天爆撃打',
        'Crush Weapon': '冥界恐叫打',
        'Cry of Victory': '鬨の声',
        'Dark Geas': '暗黒魔法陣',
        'Earth Hammer': '大地のハンマー',
        'Embrace': '攻撃',
        'Extreme Edge': 'ブーストエッジ',
        'Fire IV': 'ファイジャ',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': '凍てつく波動',
        'Gnawing Dread': '喪失の恐怖',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': '天将覇道撃',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'ジャッジメント',
        'Landwaster': 'ランドワスター',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': '独立独行',
        'Pomp and Circumstance': '威風堂々',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'クエイジャ',
        'Rock Cutter': 'ロックカッター',
        'Royal Blood': '高貴なる血脈',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': '呪槍串刺',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': '服従の塔',
        'Trample': '踏みつけ',
        'Trepidation': '狐鶏鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手無双剣',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Added new combatant Archaeodemon': 'Added new combatant Archaeodemon', // FIXME
        'Argath Thadalfus starts using Crippling Blow': 'Argath Thadalfus starts using Crippling Blow', // FIXME
        'Argath Thadalfus starts using Dark Ultima': 'Argath Thadalfus starts using Dark Ultima', // FIXME
        'Argath Thadalfus starts using Empty Soul': 'Argath Thadalfus starts using Empty Soul', // FIXME
        'Argath Thadalfus starts using Fire IV': 'Argath Thadalfus starts using Fire IV', // FIXME
        'Argath Thadalfus starts using Gnawing Dread': 'Argath Thadalfus starts using Gnawing Dread', // FIXME
        'Argath Thadalfus starts using Judgment Blade': 'Argath Thadalfus starts using Judgment Blade', // FIXME
        'Argath Thadalfus starts using Royal Blood': 'Argath Thadalfus starts using Royal Blood', // FIXME
        'Argath Thadalfus starts using Trepidation': 'Argath Thadalfus starts using Trepidation', // FIXME
        'Command Tower starts using Command Tower': 'Command Tower starts using Command Tower', // FIXME
        'Frostwave': '寒冰波动',
        'Hashmal, Bringer Of Order starts using Control Tower on Hashmal': 'Hashmal, Bringer Of Order starts using Control Tower on Hashmal', // FIXME
        'Hashmal, Bringer Of Order starts using Extreme Edge': 'Hashmal, Bringer Of Order starts using Extreme Edge', // FIXME
        'Hashmal, Bringer Of Order starts using Landwaster': 'Hashmal, Bringer Of Order starts using Landwaster', // FIXME
        'Hashmal, Bringer Of Order starts using Summon': 'Hashmal, Bringer Of Order starts using Summon', // FIXME
        'I am (?:Revelation|the truth from which you run|the lies upon which you sup)': 'I am (?:Revelation|the truth from which you run|the lies upon which you sup)', // FIXME
        'Mateus, The Corrupt starts using Rebind': 'Mateus, The Corrupt starts using Rebind', // FIXME
        'Mateus, The Corrupt starts using Unbind': 'Mateus, The Corrupt starts using Unbind', // FIXME
        'Mateus, the Corrupt': '背德皇帝马提乌斯',
        'Removing combatant Argath Thadalfus': 'Removing combatant Argath Thadalfus', // FIXME
        'Removing combatant Hashmal, Bringer Of Order': 'Removing combatant Hashmal, Bringer Of Order', // FIXME
        'Removing combatant Mateus, The Corrupt': 'Removing combatant Mateus, The Corrupt', // FIXME
        'Removing combatant Rofocale': 'Removing combatant Rofocale', // FIXME
        'Rofocale': '人马王洛弗卡勒',
        'The Crumbling Bridge will be sealed off': 'The Crumbling Bridge will be sealed off', // FIXME
        'The Lesalia Garden Ruins will be sealed off': 'The Lesalia Garden Ruins will be sealed off', // FIXME
        'The Lesalia Temple Ruins will be sealed off': 'The Lesalia Temple Ruins will be sealed off', // FIXME
        'The Palace Square will be sealed off': 'The Palace Square will be sealed off', // FIXME
        'The heavens tremble in my wake': 'The heavens tremble in my wake', // FIXME
      },
      'replaceText': {
        '--enrage--': '--enrage--', // FIXME
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        '--reset--': '--reset--', // FIXME
        '--start--': '--start--', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': '冰澈',
        'Chariot': '人马战车',
        'Coldblood': '冷血乱舞',
        'Command Tower': '支配之塔',
        'Control Tower': '统治之塔',
        'Crippling Blow': '痛击',
        'Crush Helm': '星天爆击打',
        'Crush Weapon': '冥界恐叫打',
        'Cry of Victory': '战吼',
        'Dark Geas': '暗黑魔法阵',
        'Earth Hammer': '大地之锤',
        'Embrace': '攻击',
        'Extreme Edge': '加速刃',
        'Fire IV': '炽炎',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': '寒冰波动',
        'Gnawing Dread': '丧失之痛',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': '天将霸道击',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': '制裁',
        'Landwaster': '地动',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': '特立独行',
        'Pomp and Circumstance': '威风凛凛',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': '激震',
        'Rock Cutter': '石刃',
        'Royal Blood': '高贵血脉',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': '咒枪穿刺',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': '服从之塔',
        'Trample': '踩踏',
        'Trepidation': '狐鸡鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手无双剑',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Added new combatant Archaeodemon': 'Added new combatant Archaeodemon', // FIXME
        'Argath Thadalfus starts using Crippling Blow': 'Argath Thadalfus starts using Crippling Blow', // FIXME
        'Argath Thadalfus starts using Dark Ultima': 'Argath Thadalfus starts using Dark Ultima', // FIXME
        'Argath Thadalfus starts using Empty Soul': 'Argath Thadalfus starts using Empty Soul', // FIXME
        'Argath Thadalfus starts using Fire IV': 'Argath Thadalfus starts using Fire IV', // FIXME
        'Argath Thadalfus starts using Gnawing Dread': 'Argath Thadalfus starts using Gnawing Dread', // FIXME
        'Argath Thadalfus starts using Judgment Blade': 'Argath Thadalfus starts using Judgment Blade', // FIXME
        'Argath Thadalfus starts using Royal Blood': 'Argath Thadalfus starts using Royal Blood', // FIXME
        'Argath Thadalfus starts using Trepidation': 'Argath Thadalfus starts using Trepidation', // FIXME
        'Command Tower starts using Command Tower': 'Command Tower starts using Command Tower', // FIXME
        'Frostwave': '얼어붙은 파동',
        'Hashmal, Bringer Of Order starts using Control Tower on Hashmal': 'Hashmal, Bringer Of Order starts using Control Tower on Hashmal', // FIXME
        'Hashmal, Bringer Of Order starts using Extreme Edge': 'Hashmal, Bringer Of Order starts using Extreme Edge', // FIXME
        'Hashmal, Bringer Of Order starts using Landwaster': 'Hashmal, Bringer Of Order starts using Landwaster', // FIXME
        'Hashmal, Bringer Of Order starts using Summon': 'Hashmal, Bringer Of Order starts using Summon', // FIXME
        'I am (?:Revelation|the truth from which you run|the lies upon which you sup)': 'I am (?:Revelation|the truth from which you run|the lies upon which you sup)', // FIXME
        'Mateus, The Corrupt starts using Rebind': 'Mateus, The Corrupt starts using Rebind', // FIXME
        'Mateus, The Corrupt starts using Unbind': 'Mateus, The Corrupt starts using Unbind', // FIXME
        'Mateus, the Corrupt': '배덕의 황제 마티우스',
        'Removing combatant Argath Thadalfus': 'Removing combatant Argath Thadalfus', // FIXME
        'Removing combatant Hashmal, Bringer Of Order': 'Removing combatant Hashmal, Bringer Of Order', // FIXME
        'Removing combatant Mateus, The Corrupt': 'Removing combatant Mateus, The Corrupt', // FIXME
        'Removing combatant Rofocale': 'Removing combatant Rofocale', // FIXME
        'Rofocale': '인마왕 로포칼레',
        'The Crumbling Bridge will be sealed off': 'The Crumbling Bridge will be sealed off', // FIXME
        'The Lesalia Garden Ruins will be sealed off': 'The Lesalia Garden Ruins will be sealed off', // FIXME
        'The Lesalia Temple Ruins will be sealed off': 'The Lesalia Temple Ruins will be sealed off', // FIXME
        'The Palace Square will be sealed off': 'The Palace Square will be sealed off', // FIXME
        'The heavens tremble in my wake': 'The heavens tremble in my wake', // FIXME
      },
      'replaceText': {
        '--enrage--': '--enrage--', // FIXME
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        '--reset--': '--reset--', // FIXME
        '--start--': '--start--', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': '블리자쟈',
        'Chariot': '인마전차',
        'Coldblood': '냉혈난무',
        'Command Tower': '지배의 탑',
        'Control Tower': '통제의 탑',
        'Crippling Blow': '통타',
        'Crush Helm': '성천폭격타',
        'Crush Weapon': '명계공규타',
        'Cry of Victory': '승리의 함성',
        'Dark Geas': '암흑 마법진',
        'Earth Hammer': '대지의 망치',
        'Embrace': '공격',
        'Extreme Edge': '돌격하는 칼날',
        'Fire IV': '파이쟈',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': '얼어붙은 파동',
        'Gnawing Dread': '상실의 공포',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': '천장패도격',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': '심판의 날',
        'Landwaster': '대지 황폐화',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': '독립독행',
        'Pomp and Circumstance': '위풍당당',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': '퀘이쟈',
        'Rock Cutter': '바위 가르기',
        'Royal Blood': '고귀한 혈통',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': '저주창 내리꽂기',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': '복종의 탑',
        'Trample': '짓밟기',
        'Trepidation': '여우 닭 쥐',
        'Unbind': '구속 해방',
        'Unrelenting': '천수무쌍검',
      },
    },
  ],
}];
