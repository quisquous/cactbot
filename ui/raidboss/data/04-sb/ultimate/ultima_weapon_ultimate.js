'use strict';

// Ultima Weapon Ultimate
[{
  zoneRegex: /^(The Weapon's Refrain \(Ultimate\)|Unknown Zone \(309\))$/,
  timelineFile: 'ultima_weapon_ultimate.txt',
  timelineTriggers: [
    {
      id: 'UWU Feather Rain',
      regex: /Feather Rain/,
      beforeSeconds: 3,
      infoText: {
        en: 'Move!',
        de: 'Bewegen',
        fr: 'Bougez',
        ja: 'フェザーレイン',
        ko: '이동',
      },
    },
  ],
  triggers: [
    // Phases
    {
      regex: /:The Ultima Weapon:2D4D:/,
      regexDe: /:Ultima-Waffe:2D4D:/,
      regexFr: /:Ultima Arma:2D4D:/,
      regexJa: /:アルテマウェポン:2D4D:/,
      regexKo: /:알테마 웨폰:2D4D:/,
      run: function(data) {
        data.phase = 'suppression';
      },
    },
    {
      // Wait after suppression for primal triggers at the end.
      regex: /:The Ultima Weapon:2D4D:/,
      regexDe: /:Ultima-Waffe:2D4D:/,
      regexFr: /:Ultima Arma:2D4D:/,
      regexJa: /:アルテマウェポン:2D4D:/,
      regexKo: /:알테마 웨폰:2D4D:/,
      delaySeconds: 74,
      run: function(data) {
        data.phase = 'finale';
      },
    },
    {
      id: 'UWU Garuda Slipstream',
      regex: /14:2B53:Garuda starts using (?:Unknown_2B53|Slipstream)/,
      regexDe: /14:2B53:Garuda starts using (?:Unknown_2B53|Wirbelströmung)/,
      regexFr: /14:2B53:Garuda starts using (?:Unknown_2B53|Sillage)/,
      regexJa: /14:2B53:ガルーダ starts using (?:Unknown_2B53|スリップストリーム)/,
      regexKo: /14:2B53:가루다 starts using (?:Unknown_2B53|반동 기류)/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Slipstream',
        de: 'Wirbelströmung',
        fr: 'Sillage',
        ja: 'スリップストリーム',
        ko: '반동 기류',
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0010:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Mistral on YOU',
        de: 'Mistral-Song',
        fr: 'Chant Du Mistral',
        ja: 'ミストラルソング',
        ko: '삭풍 징',
      },
    },
    {
      id: 'UWU Garuda Mistral Song Tank',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0010:0000:0000:0000:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 5,
      infoText: {
        en: 'Mistral Song',
        de: 'Mistral-Song',
        fr: 'Chant Du Mistral',
        ja: 'ミストラルソング',
        ko: '삭풍 징',
      },
    },
    {
      id: 'UWU Garuda Spiny Plume',
      regex: / 03:\y{ObjectId}:Added new combatant Spiny Plume\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Dorniger Federsturm\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Plume Perforante\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant スパイニープルーム/,
      regexKo: / 03:\y{ObjectId}Added new combatant 가시돋힌 깃털/,
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Spiny Plume Add',
        de: 'Dorniger Federsturm',
        fr: 'Plume Perforante',
        ja: 'スパイニープルーム',
        ko: '가시돋힌 깃털 등장',
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      regex: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Infernal Fetters from/,
      regexDe: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Infernofesseln from/,
      regexFr: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Chaînes Infernales from/,
      regexJa: /1A:\y{ObjectId}:(\y{Name}) gains the effect of 炎獄の鎖 from/,
      regexKo: /1A:\y{ObjectId}:(\y{Name}) gains the effect of 염옥의 사슬 from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      suppressSeconds: 45,
      infoText: {
        en: 'Fetters on YOU',
        de: 'Fesseln auf DIR',
        fr: 'Chaînes Infernales',
        ja: '自分に炎獄の鎖',
        ko: '사슬 → 나',
      },
      tts: {
        en: 'Fetters',
        de: 'Fesseln',
        fr: 'Chaînes Infernales',
        ja: '炎獄の鎖',
        ko: '사슬',
      },
    },
    {
      id: 'UWU Searing Wind',
      regex: / 14:2B5B:Ifrit starts using Inferno Howl on (\y{Name})/,
      regexDe: / 14:2B5B:Ifrit starts using Brennende Wut on (\y{Name})/,
      regexFr: / 14:2B5B:Ifrit starts using Rugissement Infernal on (\y{Name})/,
      regexJa: / 14:2B5B:イフリート starts using 灼熱の咆吼 on (\y{Name})/,
      regexKo: / 14:2B5B:이프리트 starts using 작열의 포효 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Searing Wind on YOU',
        de: 'Versengen auf DIR',
        fr: 'Rugissement Infernal',
        ja: '自分に灼熱',
        ko: '작열 → 나',
      },
      tts: {
        en: 'Searing Wind',
        de: 'Versengen',
        fr: 'Rugissement Infernal',
        ja: '灼熱',
        ko: '작열',
      },
    },
    {
      id: 'UWU Ifrit Flaming Crush',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0075:0000:0000:0000:/,
      alertText: {
        en: 'Stack',
        de: 'Stack',
        fr: 'Stack',
        ja: '頭割り',
        ko: '집합',
      },
    },
    {
      id: 'UWU Garuda Woken',
      regex: / 1A:\y{ObjectId}:Garuda gains the effect of Woken from/,
      regexDe: / 1A:\y{ObjectId}:Garuda gains the effect of Ätherüberladung from/,
      regexFr: / 1A:\y{ObjectId}:Garuda gains the effect of Éveil éthéré from/,
      regexJa: / 1A:\y{ObjectId}:ガルーダ gains the effect of 覚醒 from/,
      regexKo: / 1A:\y{ObjectId}:가루다 gains the effect of 각성 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Ifrit Woken',
      regex: / 1A:\y{ObjectId}:Ifrit gains the effect of Woken from/,
      regexDe: / 1A:\y{ObjectId}:Ifrit gains the effect of Ätherüberladung from/,
      regexFr: / 1A:\y{ObjectId}:Ifrit gains the effect of Éveil éthéré from/,
      regexJa: / 1A:\y{ObjectId}:イフリート gains the effect of 覚醒 from/,
      regexKo: / 1A:\y{ObjectId}:이프리트 gains the effect of 각성 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Woken',
      regex: / 1A:\y{ObjectId}:Titan gains the effect of Woken from/,
      regexDe: / 1A:\y{ObjectId}:Titan gains the effect of Ätherüberladung from/,
      regexFr: / 1A:\y{ObjectId}:Titan gains the effect of Éveil éthéré from/,
      regexJa: / 1A:\y{ObjectId}:タイタン gains the effect of 覚醒 from/,
      regexKo: / 1A:\y{ObjectId}:타이탄 gains the effect of 각성 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Gaols',
      regex: / 15:\y{ObjectId}:(?:Garuda|Titan):2B6[BC]:Rock Throw:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:(?:Garuda|Titan):2B6[BC]:Granitgefängnis:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:(?:GarudaTitan):2B6[BC]:Jeté De Rocs:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:(?:ガルーダ|タイタン):2B6[BC]:グラナイト・ジェイル:\y{ObjectId}:(\y{Name}):/,
      regexKo: / 15:\y{ObjectId}:(?:가루다|타이탄):2B6[BC]:화강암 감옥:\y{ObjectId}:(\y{Name}):/,
      preRun: function(data, matches) {
        data.titanGaols = data.titanGaols || [];
        data.titanGaols.push(matches[1]);
        if (data.titanGaols.length == 3)
          data.titanGaols.sort();
      },
      alertText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        let idx = data.titanGaols.indexOf(data.me);
        if (idx < 0)
          return;
        // Just return your number.
        return idx + 1;
      },
      infoText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        // Return all the people in order.
        return data.titanGaols.map(function(n) {
          return data.ShortName(n);
        }).join(', ');
      },
    },
    {
      // If anybody dies to bombs (WHY) and a rock is on them, then glhf.
      id: 'UWU Titan Bomb Failure',
      regex: / 15:\y{ObjectId}:Bomb Boulder:2B6A:Burst:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Bomber-Brocken:2B6A:Zerschmetterung:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Bomb Boulder:2B6A:Grosse Explosion:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ボムボルダー:2B6A:爆発:\y{ObjectId}:(\y{Name}):/,
      regexKo: / 15:\y{ObjectId}:화강암 감옥:2B6A:대폭발:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data, matches) {
        if (!data.titanGaols)
          return;
        if (data.titanGaols.indexOf(matches[1]) < 0)
          return;
        return {
          en: data.ShortName(matches[1]) + ' died',
          de: data.ShortName(matches[1]) + ' gestorben',
          ko: data.ShortName(matches[1]) + ' 죽음',
        };
      },
    },
    {
      // Cleanup
      regex: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Rock Throw:\y{ObjectId}:\y{Name}/,
      regexDe: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Granitgefängnis:\y{ObjectId}:\y{Name}/,
      regexFr: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Jeté De Rocs:\y{ObjectId}:\y{Name}/,
      regexJa: / 15:\y{ObjectId}:(?:ガルーダ:2B6C|タイタン:2B6B):グラナイト・ジェイル:\y{ObjectId}:\y{Name}:/,
      regexKo: / 15:\y{ObjectId}:(?:가루다:2B6C|타이탄:2B6B):화강암 감옥:\y{ObjectId}:\y{Name}:/,
      delaySeconds: 15,
      run: function(data) {
        delete data.titanGaols;
      },
    },
    {
      id: 'UWU Suppression Gaol',
      regex: / 15:\y{ObjectId}:Titan:2B6B:Rock Throw:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Titan:2B6B:Granitgefängnis:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Titan:2B6B:Jeté De Rocs:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:タイタン:2B6B:グラナイト・ジェイル:\y{ObjectId}:(\y{Name}):/,
      regexKo: / 15:\y{ObjectId}:타이탄:2B6B:화강암 감옥:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.phase == 'suppression' && data.me == matches[1];
      },
      alarmText: {
        en: 'Gaol on YOU',
        de: 'Granitgefängnis',
        fr: 'Geôle',
        ja: 'ジェイル',
        ko: '감옥 → 나',
      },
    },
    {
      id: 'UWU Garuda Finale',
      regex: /:The Ultima Weapon:2CD3:/,
      regexDe: /:Ultima-Waffe:2CD3:/,
      regexFr: /:Ultima Arma:2CD3:/,
      regexJa: /:アルテマウェポン:2CD3:/,
      regexKo: /:알테마 웨폰:2CD3:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Garuda',
        de: 'Garuda',
        fr: 'Garuda',
        ja: 'ガルーダ',
        ko: '가루다',
      },
    },
    {
      id: 'UWU Ifrit Finale',
      regex: /:The Ultima Weapon:2CD4:/,
      regexDe: /:Ultima-Waffe:2CD4:/,
      regexFr: /:Ultima Arma:2CD4:/,
      regexJa: /:アルテマウェポン:2CD4:/,
      regexKo: /:알테마 웨폰:2CD4:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Ifrit',
        de: 'Ifrit',
        fr: 'Ifrit',
        ja: 'イフリート',
        ko: '이프리트',
      },
    },
    {
      id: 'UWU Titan Finale',
      regex: /:The Ultima Weapon:2CD5:/,
      regexDe: /:Ultima-Waffe:2CD5:/,
      regexFr: /:Ultima Arma:2CD5:/,
      regexJa: /:アルテマウェポン:2CD5:/,
      regexKo: /:알테마 웨폰:2CD5:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Titan',
        de: 'Titan',
        fr: 'Titan',
        ja: 'タイタン',
        ko: '타이탄',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aetheroplasm': 'Ätheroplasma',
        'Chirada': 'Chirada',
        'Engage!': 'Start!',
        'Garuda': 'Garuda',
        'Granite Gaol': 'Granitgefängnis',
        'Ifrit': 'Ifrit',
        'Infernal Nail': 'Infernalisch[a] Fessel',
        'Lahabrea': 'Lahabrea',
        'Magitek Bit': 'Magitek-Drohne',
        'Razor Plume': 'Schneidend[a] Federsturm',
        'Satin Plume': 'Samtig[a] Federsturm',
        'Spiny Plume': 'Dornig[a] Federsturm',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima-Waffe',
        'Titan': 'Titan',
        'Ultimaplasm': 'Ultimaplasma',
        'Bomb Boulder': 'Bomber-Brocken',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': 'Nun, ihr Würmer! Ihr wollt die Macht des Windes spüren?',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aerial Blast': 'Windschlag',
        'Aetheric Boom': 'Ätherknall',
        'Aetherochemical Laser': 'Ätherochemischer Laser',
        'Aetheroplasm': 'Ätheroplasma',
        'Blight': 'Pesthauch',
        'Burst': 'Detonation',
        'Bury': 'Begraben',
        'Ceruleum Vent': 'Erdseim-Entlüfter',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Cyclone': 'Zyklon',
        'Dark IV': 'Neka',
        'Downburst': 'Fallböe',
        'Earthen Fury': 'Gaias Zorn',
        'Enrage': 'Finalangriff',
        'Eruption': 'Eruption',
        'Eye Of The Storm': 'Auge Des Sturms',
        'Feather Rain': 'Federregen',
        'Featherlance': 'Federlanze',
        'Flaming Crush': 'Flammenstoß',
        'Freefire': 'Schwerer Beschuss',
        'Friction': 'Windklinge',
        'Fusion Burst': 'Fusionsknall',
        'Geocrush': 'Geo-Stoß',
        'Gigastorm': 'Gigasturm',
        'Granite Impact': 'Granitstoß',
        'Great Whirlwind': 'Windhose',
        'Hellfire': 'Höllenfeuer',
        'Homing Lasers': 'Leitlaser',
        'Incinerate': 'Einäschern',
        'Infernal Fetters': 'Infernofesseln',
        'Infernal Surge': 'Infernowallung',
        'Inferno Howl': 'Brennende Wut',
        'Landslide': 'Bergsturz',
        'Light Pillar': 'Lichtsäule',
        'Mesohigh': 'Meso-Hoch',
        'Mistral Shriek': 'Mistral-Schrei',
        'Mistral Song': 'Mistral-Song',
        'Mountain Buster': 'Bergsprenger',
        'Radiant Plume': 'Scheiterhaufen',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        'Searing Wind': 'Versengen',
        'Self-destruct': 'Selbstzerstörung',
        'Slipstream': 'Wirbelströmung',
        'Super Cyclone': 'Superzyklon',
        'Tank Purge': 'Tankreinigung',
        'Tumult': 'Urerschütterung',
        'Ultima': 'Ultima',
        'Ultimate Annihilation': 'Ultimative Vernichtung',
        'Ultimate Predation': 'Ultimative Prädation',
        'Ultimate Suppression': 'Ultimative Unterdrückung',
        'Upheaval': 'Urtrauma',
        'Viscous Aetheroplasm': 'Viskoses Ätheroplasma',
        'Vulcan Burst': 'Feuerstoß',
        'Weight Of The Land': 'Gaias Gewicht',
        'Wicked Tornado': 'Tornado Der Bosheit',
        'Wicked Wheel': 'Rad Der Bosheit',
        'Grand Whirlwind': 'Großer Wirbelsturm',
        'Nail Adds': 'Nagel Adds',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Summon Random Primal': 'Zufällige Primaebeschwörung',
        'Apply Viscous': 'Ätheroplasma wirkt',
      },
      '~effectNames': {
        'Accursed Flame': 'Fluchflamme',
        'Aetherially Charged': 'Ätheraufladung',
        'Beyond Limits': 'Ätherhyperladung',
        'Damage Up': 'Schaden +',
        'Doom': 'Verhängnis',
        'Down For The Count': 'Am Boden',
        'Fetters': 'Granitgefängnis',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Infernal Fetters': 'Infernofesseln',
        'Searing Wind': 'Gluthitze',
        'Stun': 'Betäubung',
        'Thermal High': 'Hochdruck',
        'Thermal Low': 'Tiefdruck',
        'Viscous Aetheroplasm': 'Ätheroplasma',
        'Vulnerability Down': 'Verringerte Verwundbarkeit',
        'Woken': 'Ätherüberladung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aetheroplasm': 'éthéroplasme',
        'Chirada': 'Chirada',
        'Engage!': 'À l\'attaque',
        'Garuda': 'Garuda',
        'Granite Gaol': 'Geôle De Granite',
        'Ifrit': 'Ifrit',
        'Infernal Nail': 'Clou Infernal',
        'Lahabrea': 'Lahabrea',
        'Magitek Bit': 'Drone Magitek',
        'Razor Plume': 'Plume Lacérante',
        'Satin Plume': 'Plume Soyeuse',
        'Spiny Plume': 'Plume Perforante',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima Arma',
        'Titan': 'Titan',
        'Ultimaplasm': 'Ultimaplasme',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': 'Je vais vous écorcher avec mes bourrasques',
        'Bomb Boulder': 'Bomb Boulder',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aerial Blast': 'Rafale Aérienne',
        'Aetheric Boom': 'Onde D\'éther',
        'Aetherochemical Laser': 'Laser Magismologique',
        'Aetheroplasm': 'Éthéroplasma',
        'Blight': 'Supplice',
        'Burst': 'Grosse Explosion',
        'Bury': 'Impact',
        'Ceruleum Vent': 'Exutoire à Céruleum',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Cyclone': 'Cyclone',
        'Dark IV': 'Giga Ténèbres',
        'Downburst': 'Rafale Descendante',
        'Earthen Fury': 'Fureur Tellurique',
        'Enrage': 'Enrage',
        'Eruption': 'Éruption',
        'Eye Of The Storm': 'Œil Du Cyclone',
        'Feather Rain': 'Pluie De Plumes',
        'Featherlance': 'Lance De Plume',
        'Flaming Crush': 'Fracas De Flammes',
        'Freefire': 'Tir D\'artillerie Lourde',
        'Friction': 'Lame De Vent',
        'Fusion Burst': 'Fusion Explosive',
        'Geocrush': 'Broie-terre',
        'Gigastorm': 'Giga Tempête',
        'Granite Impact': 'Impact De Rocs',
        'Great Whirlwind': 'Grand Tourbillon',
        'Hellfire': 'Flammes De L\'enfer',
        'Homing Lasers': 'Lasers Autoguidés',
        'Incinerate': 'Incinération',
        'Infernal Fetters': 'Chaînes Infernales',
        'Infernal Surge': 'Brasier Infernal',
        'Inferno Howl': 'Rugissement Infernal',
        'Landslide': 'Glissement De Terrain',
        'Light Pillar': 'Colonne Lumineuse',
        'Mesohigh': 'Anticyclone De Méso-échelle',
        'Mistral Shriek': 'Cri Du Mistral',
        'Mistral Song': 'Chant Du Mistral',
        'Mountain Buster': 'Casse-montagnes',
        'Radiant Plume': 'Panache Radiant',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté De Rocs',
        'Searing Wind': 'Carbonisation',
        'Self-destruct': 'Auto-destruction',
        'Slipstream': 'Sillage',
        'Super Cyclone': 'Super Cyclone',
        'Tank Purge': 'Vidange De Réservoir',
        'Tumult': 'Tumulte',
        'Ultima': 'Ultima',
        'Ultimate Annihilation': 'Fantasmagorie Infernale',
        'Ultimate Predation': 'Fantasmagorie Prédatrice',
        'Ultimate Suppression': 'Fantasmagorie Bestiale',
        'Upheaval': 'Bouleversement',
        'Viscous Aetheroplasm': 'Éthéroplasma Poisseux',
        'Vulcan Burst': 'Explosion Volcanique',
        'Weight Of The Land': 'Poids De La Terre',
        'Wicked Tornado': 'Tornade Meurtrière',
        'Wicked Wheel': 'Roue Mauvaise',

        // FIXME
        'Grand Whirlwind': 'Grand Whirlwind',
        'Nail Adds': 'Nail Adds',
        'Diffractive Laser': 'Diffractive Laser',
        'Summon Random Primal': 'Summon Random Primal',
        'Apply Viscous': 'Apply Viscous',
      },
      '~effectNames': {
        'Accursed Flame': 'Flammes Maudites',
        'Aetherially Charged': 'Charge éthérée',
        'Beyond Limits': 'Transcendance',
        'Damage Up': 'Bonus De Dégâts Physiques',
        'Doom': 'Glas',
        'Down For The Count': 'Au Tapis',
        'Fetters': 'Attache',
        'Fire Resistance Down II': 'Résistance Au Feu Réduite+',
        'Infernal Fetters': 'Chaînes Infernales',
        'Searing Wind': 'Fournaise',
        'Stun': 'Étourdissement',
        'Thermal High': 'Haute Pression',
        'Thermal Low': 'Basse Pression',
        'Viscous Aetheroplasm': 'Éthéroplasma',
        'Vulnerability Down': 'Vulnérabilité Diminuée',
        'Woken': 'Éveil éthéré',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aetheroplasm': 'エーテル爆雷',
        'Chirada': 'チラーダ',
        'Engage!': '戦闘開始！',
        'Garuda': 'ガルーダ',
        'Granite Gaol': 'グラナイト・ジェイル',
        'Ifrit': 'イフリート',
        'Infernal Nail': '炎獄の楔',
        'Lahabrea': 'アシエン・ラハブレア',
        'Magitek Bit': '魔導ビット',
        'Razor Plume': 'ブリストリープルーム',
        'Satin Plume': 'シルキープルーム',
        'Spiny Plume': 'スパイニープルーム',
        'Suparna': 'スパルナ',
        'The Ultima Weapon': 'アルテマウェポン',
        'Titan': 'タイタン',
        'Ultimaplasm': 'アルテマ爆雷',
        'Bomb Boulder': 'ボムボルダ',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': 'はじめようぞ、虫ケラ…… わたくしの風でッ！　嵐でッ！　無残に散れッ！',
      },
      'replaceText': {
        'Aerial Blast': 'エリアルブラスト',
        'Aetheric Boom': 'エーテル波動',
        'Aetherochemical Laser': '魔科学レーザー',
        'Aetheroplasm': '爆雷起爆',
        'Blight': 'クラウダ',
        'Burst': '大爆発',
        'Bury': '衝撃',
        'Ceruleum Vent': 'セルレアムベント',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Cyclone': 'サイクロン',
        'Dark IV': 'ダージャ',
        'Downburst': 'ダウンバースト',
        'Earthen Fury': '大地の怒り',
        'Eruption': 'エラプション',
        'Eye Of The Storm': 'アイ・オブ・ストーム',
        'Feather Rain': 'フェザーレイン',
        'Featherlance': 'フェザーランス',
        'Flaming Crush': 'フレイムクラッシュ',
        'Freefire': '誘爆',
        'Friction': 'ウィンドブレード',
        'Fusion Burst': '融合爆発',
        'Geocrush': 'ジオクラッシュ',
        'Gigastorm': 'ギガストーム',
        'Granite Impact': 'グラナイトインパクト',
        'Great Whirlwind': '大旋風',
        'Hellfire': '地獄の火炎',
        'Homing Lasers': '誘導レーザー',
        'Incinerate': 'インシネレート',
        'Infernal Fetters': '炎獄の鎖',
        'Infernal Surge': '炎獄の焔',
        'Inferno Howl': '灼熱の咆吼',
        'Landslide': 'ランドスライド',
        'Light Pillar': 'リヒト・ゾイレ',
        'Mesohigh': 'メソハイ',
        'Mistral Shriek': 'ミストラルシュリーク',
        'Mistral Song': 'ミストラルソング',
        'Mountain Buster': 'マウンテンバスター',
        'Radiant Plume': '光輝の炎柱',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        'Searing Wind': '熱風',
        'Self-destruct': '自爆',
        'Slipstream': 'スリップストリーム',
        'Super Cyclone': 'スーパーサイクロン',
        'Tank Purge': '魔導フレア',
        'Tumult': '激震',
        'Ultima': 'アルテマ',
        'Ultimate Annihilation': '爆撃の究極幻想',
        'Ultimate Predation': '追撃の究極幻想',
        'Ultimate Suppression': '乱撃の究極幻想',
        'Upheaval': '大激震',
        'Viscous Aetheroplasm': '吸着爆雷起爆',
        'Vulcan Burst': 'バルカンバースト',
        'Weight Of The Land': '大地の重み',
        'Wicked Tornado': 'ウィケッドトルネード',
        'Wicked Wheel': 'ウィケッドホイール',

        // FIXME
        'Grand Whirlwind': 'Grand Whirlwind',
        'Nail Adds': 'Nail Adds',
        'Diffractive Laser': 'Diffractive Laser',
        'Summon Random Primal': 'Summon Random Primal',
        'Apply Viscous': 'Apply Viscous',
      },
      '~effectNames': {
        'Accursed Flame': '呪いの炎',
        'Aetherially Charged': 'エーテル供給',
        'Beyond Limits': '限界突破',
        'Damage Up': 'ダメージ上昇',
        'Doom': '死の宣告',
        'Down For The Count': 'ノックダウン',
        'Fetters': '拘束',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'Infernal Fetters': '炎獄の鎖',
        'Searing Wind': '灼熱',
        'Stun': 'スタン',
        'Thermal High': '高気圧',
        'Thermal Low': '低気圧',
        'Viscous Aetheroplasm': '吸着爆雷',
        'Vulnerability Down': '被ダメージ低下',
        'Woken': '覚醒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aetheroplasm': '에테르 폭뢰',
        'Chirada': '치라다',
        'Engage!': '전투 시작!',
        'Garuda': '가루다',
        'Granite Gaol': '화강암 감옥',
        'Ifrit': '이프리트',
        'Infernal Nail': '염옥의 말뚝',
        'Lahabrea': '아씨엔 라하브레아',
        'Magitek Bit': '마도 비트',
        'Razor Plume': '예리한 깃털',
        'Satin Plume': '부드러운 깃털',
        'Spiny Plume': '가시돋힌 깃털',
        'Suparna': '수파르나',
        'The Ultima Weapon': '알테마 웨폰',
        'Titan': '타이탄',
        'Ultimaplasm': '알테마 폭뢰',
        'Bomb Boulder': '화강암 감옥',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': '시작하자, 버러지들아',
      },
      'replaceText': {
        '--targetable--': '--대상 지정 가능--',
        '--untargetable--': '--대상 지정 불가--',
        'Aerial Blast': '대기 폭발',
        'Aetheric Boom': '에테르 파동',
        'Aetherochemical Laser': '마과학 레이저',
        'Aetheroplasm': '폭뢰 기폭',
        'Blight': '독안개',
        'Burst': '대폭발',
        'Bury': '충격',
        'Ceruleum Vent': '청린 방출',
        'Crimson Cyclone': '진홍 회오리',
        'Cyclone': '돌개바람',
        'Dark IV': '다쟈',
        'Downburst': '하강 기류',
        'Earthen Fury': '대지의 분노',
        'Eruption': '용암 분출',
        'Eye Of The Storm': '태풍의 눈',
        'Feather Rain': '깃털비',
        'Featherlance': '깃털창',
        'Flaming Crush': '화염 작열',
        'Freefire': '유폭',
        'Friction': '바람의 칼날',
        'Fusion Burst': '융합 폭발',
        'Geocrush': '대지 붕괴',
        'Gigastorm': '대폭풍',
        'Granite Impact': '감옥 폭발',
        'Great Whirlwind': '대선풍',
        'Hellfire': '지옥의 화염',
        'Homing Lasers': '유도 레이저',
        'Incinerate': '소각',
        'Infernal Fetters': '염옥의 사슬',
        'Infernal Surge': '염옥의 불꽃',
        'Inferno Howl': '작열의 포효',
        'Landslide': '산사태',
        'Light Pillar': '빛 기둥',
        'Mesohigh': '뇌우고기압',
        'Mistral Shriek': '삭풍의 비명',
        'Mistral Song': '삭풍의 노래',
        'Mountain Buster': '산 쪼개기',
        'Radiant Plume': '광휘의 불기둥',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        'Searing Wind': '열풍',
        'Self-destruct': '자폭',
        'Slipstream': '반동 기류',
        'Super Cyclone': '대형 돌개바람',
        'Tank Purge': '마도 플레어',
        'Tumult': '격진',
        'Ultima': '알테마',
        'Ultimate Annihilation': '궁극의 폭격 환상',
        'Ultimate Predation': '궁극의 추격 환상',
        'Ultimate Suppression': '궁극의 난격 환상',
        'Upheaval': '대격진',
        'Viscous Aetheroplasm': '흡착 폭뢰 기폭',
        'Vulcan Burst': '폭렬 난사',
        'Weight Of The Land': '대지의 무게',
        'Wicked Tornado': '마녀의 회오리',
        'Wicked Wheel': '마녀의 수레바퀴',

        'Grand Whirlwind': '대선풍',
        'Nail Adds': '염옥의 말뚝',
        'Diffractive Laser': '확산 레이저',
        'Summon Random Primal': '무작위 야만신 소환',
        'Apply Viscous': '흡착식 에테르 폭뢰',
      },
      '~effectNames': {
        'Accursed Flame': '저주의 불꽃',
        'Aetherially Charged': '에테르 공급',
        'Beyond Limits': '한계 돌파',
        'Damage Up': '주는 피해량 증가',
        'Doom': '죽음의 선고',
        'Down For The Count': '넉다운',
        'Fetters': '구속',
        'Fire Resistance Down II': '불속성 저항 감소[강]',
        'Infernal Fetters': '염옥의 사슬',
        'Searing Wind': '작열',
        'Stun': '기절',
        'Thermal High': '고기압',
        'Thermal Low': '저기압',
        'Viscous Aetheroplasm': '흡착 폭뢰',
        'Vulnerability Down': '받는 피해 감소',
        'Woken': '각성',
      },
    },
  ],
}];
