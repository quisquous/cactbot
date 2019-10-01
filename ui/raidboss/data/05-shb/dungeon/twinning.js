'use strict';

// The Twinning

[{
  zoneRegex: /^The Twinning$/,
  timelineFile: 'twinning.txt',
  triggers: [
    {
      id: 'Twinning Main Head',
      regex: / 14:3DBC:Surplus Kaliya starts using Main Head/,
      regexDe: / 14:3DBC:Massengefertigter Kaliya starts using Hauptkopf/,
      regexFr: / 14:3DBC:Kaliya [dD]e [sS]urplus starts using Tête [pP]rincipale/,
      regexJa: / 14:3DBC:量産型カーリア starts using メインヘッド/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Kaliya',
        de: 'Unterbreche Kaliya',
        fr: 'Interrompez Kaliya',
      },
    },
    {
      id: 'Twinning Berserk',
      regex: / 14:3DC0:Vitalized Reptoid starts using Berserk/,
      regexDe: / 14:3DC0:Gestärkter Reptoid starts using Berserker/,
      regexFr: / 14:3DC0:Reptoïde [vV]italisé starts using Furie/,
      regexJa: / 14:3DC0:ヴァイタライズ・レプトイド starts using ベルセルク/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Reptoid',
        de: 'Unterbreche Reptoid',
        fr: 'Interrompez Reptoïde',
      },
    },
    {
      id: 'Twinning 128 Tonze Swing',
      regex: / 14:3DBA:Servomechanical Minotaur starts using 128-Tonze Swing/,
      regexDe: / 14:3DBA:Servomechanischer Minotaurus starts using 128-Tonzen-Schwung/,
      regexFr: / 14:3DBA:Minotaure [sS]ervomécanique starts using Swing [dD]e 128 [tT]onz/,
      regexJa: / 14:3DBA:サーヴォ・ミノタウロス starts using 128トンズ・スイング/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Minotaur',
        de: 'Stumme Minotaur',
        fr: 'Silence sur Minotaure',
      },
    },
    {
      // The handling for these mechanics is similar enough it makes sense to combine the trigger
      id: 'Twinning Impact + Pounce',
      regex: / 1B:........:\y{Name}:....:....:(003[2-5]|005A)/,
      suppressSeconds: 10,
      infoText: {
        en: 'Spread (avoid cages)',
        de: 'Verteilen (Vermeide "Käfige")',
        fr: 'Dispersez vous (évitez les cages)',
      },
    },
    {
      id: 'Twinning Beastly Roar',
      regex: / 14:3D64:Alpha Zaghnal starts using Beastly Roar/,
      regexDe: / 14:3D64:Alpha-Zaghnal starts using Bestialisches Brüllen/,
      regexFr: / 14:3D64:Zaghnal [aA]lpha starts using Rugissement [bB]estial/,
      regexJa: / 14:3D64:アルファ・ザグナル starts using ビーストロア/,
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
      id: 'Twinning Augurium',
      regex: / 14:3D65:Alpha Zaghnal starts using Augurium on (\y{Name})/,
      regexDe: / 14:3D65:Alpha-Zaghnal starts using Schmetterbohrer on (\y{Name})/,
      regexFr: / 14:3D65:Zaghnal [aA]lpha starts using Coup [dD]e [tT]arière on (\y{Name})/,
      regexJa: / 14:3D65:アルファ・ザグナル starts using アウガースマッシュ on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank cleave on YOU',
            de: 'Tank cleave auf YOU',
            fr: 'Tank cleave sur VOUS',
          };
        }
        return {
          en: 'Avoid tank cleave',
          de: 'Tank cleave ausweichen',
          fr: 'Evitez le cleave',
        };
      },
    },
    {
      id: 'Twinning Charge Eradicated',
      regex: / 1B:........:(\y{Name}):....:....:005D/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR stacken',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Twinning Thunder Beam',
      regex: / 14:3DED:Mithridates starts using Thunder Beam on (\y{Name})/,
      regexDe: / 14:3DED:Mithridates starts using Gewitterstrahl on (\y{Name})/,
      regexFr: / 14:3DED:Mithridate starts using Rayon [dD]e [fF]oudre on (\y{Name})/,
      regexJa: / 14:3DED:ミトリダテス starts using サンダービーム on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
            de: 'Buster auf DIR',
            fr: 'Buster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Buster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // Alternatively, we could use 1B:........:(\y{Name}):....:....:00A0
      id: 'Twinning Allagan Thunder',
      regex: / 14:3DEF:Mithridates starts using Allagan Thunder on (\y{Name})/,
      regexDe: / 14:3DEF:Mithridates starts using Allagischer Blitzschlag on (\y{Name})/,
      regexFr: / 14:3DEF:Mithridate starts using Foudre [dD]'[aA]llag on (\y{Name})/,
      regexJa: / 14:3DEF:ミトリダテス starts using アラガン・サンダー on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Twinning Magitek Crossray',
      regex: / 14:3DF8:The Tycoon starts using Magitek Crossray/,
      regexDe: / 14:3DF8:Tycoon starts using Magitek-Kreuzlaser/,
      regexFr: / 14:3DF8:Le Magnat starts using Rayon [cC]roisé [mM]agitek/,
      regexJa: / 14:3DF8:タイクーン starts using 魔導クロスレーザー/,
      suppressSeconds: 15,
      infoText: {
        en: 'cardinal lasers',
        de: 'Himmelrichtungs-Lasers',
        fr: 'Lasers cardinaux',
      },
    },
    {
      id: 'Twinning Defensive Array',
      regex: / 14:3DF2:The Tycoon starts using Defensive Array/,
      regexDe: / 14:3DF2:Tycoon starts using Magitek-Schutzlaser/,
      regexFr: / 14:3DF2:Le Magnat starts using Rayon [pP]rotecteur [mM]agitek/,
      regexJa: / 14:3DF2:タイクーン starts using 魔導プロテクティブレーザー/,
      suppressSeconds: 15,
      infoText: {
        en: 'outer lasers',
        de: 'Lasers am Rand',
        fr: 'Lasers extérieurs',
      },
    },
    {
      id: 'Twinning Rail Cannon',
      regex: / 14:3DFB:The Tycoon starts using Rail Cannon on (\y{Name})/,
      regexDe: / 14:3DFB:Tycoon starts using Magnetschienenkanone on (\y{Name})/,
      regexFr: / 14:3DFB:Le Magnat starts using Canon [éÉ]lectrique on (\y{Name})/,
      regexJa: / 14:3DFB:タイクーン starts using レールキャノン on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
            de: 'Buster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // An alternative is 1B:........:\y{Name}:....:....:00A9
      id: 'Twinning Magicrystal',
      regex: / 14:3E0C:The Tycoon starts using Magicrystal/,
      regexDe: / 14:3E0C:Tycoon starts using Magitek-Kristall/,
      regexFr: / 14:3E0C:Le Magnat starts using Cristal [mM]agitek/,
      regexJa: / 14:3E0C:タイクーン starts using 魔導クリスタル/,
      alertText: {
        en: 'spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Twinning Discharger',
      regex: / 14:3DFC:The Tycoon starts using High-Tension Discharger/,
      regexDe: / 14:3DFC:Tycoon starts using Hochspannungsentlader/,
      regexFr: / 14:3DFC:Le Magnat starts using Déchargeur [hH]aute [tT]ension/,
      regexJa: / 14:3DFC:タイクーン starts using ハイテンション・ディスチャージャー/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'vitalized shabti': 'gestärkter Shabti',
        'vitalized reptoid': 'gestärkter Reptoid',
        'vitalized iksalion': 'gestärkter Iksalion',
        'The Tycoon': 'Tycoon',
        'the First Beast': 'das erste Unheil',
        'the Face of the Beast': 'Antlitz[p] des Boten',
        'surplus Kaliya': 'massengefertigter Kaliya',
        'search drone': 'Suchdrohne',
        'ghrah maximization': 'Maxi-Ghrah',
        'flanborg': 'Flanborg',
        'enforcement droid 209': 'Vollzugsdroide[p] 209',
        'clockwork ark knight': 'Uhrwerk-Erzritter',
        'beta zaghnal': 'Beta-Zaghnal',
        'alpha zaghnal': 'Alpha-Zaghnal',
        'Zaghnal': 'Zaghnal',
        'Voidwalker': 'Voidwalker',
        'Servomechanical Minotaur': 'Servomechanischer Minotaurus',
        'Mithridates': 'Mithridates',
        'Mark CXLIV Thermocoil Boilbuster': 'Magitek-Kessel Typ CXLIV',
        'Leviathan': 'Leviathan',
        'Engage!': 'Start!',
        'Eden Prime': 'Eden Prime',
        'Levinball': 'Donnerkugel',
        'The Cornice': 'Schnittstelle',
        'Aetherial Observation': 'Ätherobservationsdeck',
        'Repurposing': 'Umrüstanlage',
        'Cladoselache': 'Cladoselache',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Wind Spout': 'Windstreich',
        'Vorpal Blade': 'Vorpalklinge',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Beam': 'Gewitterstrahl',
        'Thrown Flames': 'Napalm',
        'Temporal Paradox': 'Zeitparadox',
        'Temporal Flow': 'Zeitfluss',
        'Sideswipe': 'Seitenfeger',
        'Shock': 'Entladung',
        'Shattered Crystal': 'Berstender Kristall',
        'Rail Cannon': 'Magnetschienenkanone',
        'Pounce Errant': 'Tobende Tatze',
        'Pounce': 'Raubtiertatze',
        'Nerve Gas': 'Nervengas',
        'Main Head': 'Hauptkopf',
        'Magitek Ray': 'Magitek-Laser',
        'Magitek Crossray': 'Magitek-Kreuzlaser',
        'Magicrystal': 'Magitek-Kristall',
        'Luminous Laceration': 'Lichtriss',
        'Laserblade': 'Laserklingen',
        'High-Tension Discharger': 'Hochspannungsentlader',
        'High Gravity': 'Hohe Gravitation',
        'Heave': 'Aufspießen',
        'Forlorn Impact': 'Einsamer Einschlag',
        'Enrage': 'Finalangriff',
        'Electric Discharge': 'Elektrische Entladung',
        'Defensive Array': 'Magitek-Schutzlaser',
        'Charge Eradicated': 'Ausrottung',
        'Berserk': 'Berserker',
        'Beastly Roar': 'Bestialisches Brüllen',
        'Beast Rampant': 'Ungezügelt',
        'Beast Passant': 'Stahlpranke',
        'Auto-cannons': 'Autokanonen',
        'Augurium': 'Schmetterbohrer',
        'Artificial Gravity': 'Künstliche Gravitation',
        'Allagan Thunder': 'Allagischer Blitzschlag',
        'Aetherochemical Amplification': 'Ätherochemische Amplifikation',
        '32-tonze Swipe': '32-Tonzen-Schwung',
        '128-tonze Swing': '128-Tonzen-Schwung',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        'Gravity': 'Gravitation',
        'Crossray': 'Kreuzlaser',
      },
      '~effectNames': {
        'Summon Order II': 'Egi-Attacke II',
        'Summon Order': 'Egi-Attacke I',
        'Burns': 'Brandwunde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'vitalized shabti': 'Chaouabti vitalisé',
        'vitalized reptoid': 'Reptoïde vitalisé',
        'vitalized iksalion': 'Iksalion vitalisé',
        'The Tycoon': 'Le Magnat',
        'the First Beast': 'Annélide de l\'apocalypse',
        'the Face of the Beast': 'Visages de la Bête',
        'surplus Kaliya': 'Kaliya de surplus',
        'search drone': 'Drone de repérage',
        'ghrah maximization': 'Maxi ghrah',
        'flanborg': 'Flanborg',
        'enforcement droid 209': 'Droïde d\'exécution 209',
        'clockwork ark knight': 'Archichevalier mécanique',
        'beta zaghnal': 'Zaghnal bêta',
        'alpha zaghnal': 'Zaghnal alpha',
        'Zaghnal': 'Zaghnal',
        'Servomechanical Minotaur': 'Minotaure Servomécanique',
        'Mithridates': 'Mithridate',
        'Mark CXLIV Thermocoil Boilbuster': 'Céruthermobouilleur v144',
        'Engage!': 'À l\'attaque',
        'Levinball': 'boule foudroyante',
        'The Cornice': 'Cœur du propulseur dimensionnel',
        'Aetherial Observation': 'Observatoire des flux éthérés',
        'Repurposing': 'Atelier d\'opti-rénovation',
        'Cladoselache': 'Cladoselache',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Wind Spout': 'Jet de vent',
        'Vorpal Blade': 'Lame vorpale',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Beam': 'Rayon de foudre',
        'Thrown Flames': 'Napalm',
        'Temporal Paradox': 'Paradoxe temporel',
        'Temporal Flow': 'Flux temporel',
        'Sideswipe': 'Fauche latérale',
        'Shock': 'Décharge électrostatique',
        'Shattered Crystal': 'Éclatement de cristal',
        'Rail Cannon': 'Canon électrique',
        'Pounce Errant': 'Attaque subite XXX',
        'Pounce': 'Attaque subite',
        'Nerve Gas': 'Gaz neurotoxique',
        'Main Head': 'Tête principale',
        'Magitek Ray': 'Rayon magitek',
        'Magitek Crossray': 'Rayon croisé magitek',
        'Magicrystal': 'Cristal magitek',
        'Luminous Laceration': 'Lacération lumineuse',
        'Laserblade': 'Lame laser',
        'High-Tension Discharger': 'Déchargeur haute tension',
        'High Gravity': 'Haute gravité',
        'Heave': 'Projection',
        'Forlorn Impact': 'Déflagration affligeante',
        'Enrage': 'Enrage',
        'Electric Discharge': 'Décharge électrique',
        'Defensive Array': 'Rayon protecteur magitek',
        'Charge Eradicated': 'Éradicateur',
        'Berserk': 'Furie',
        'Beastly Roar': 'Rugissement bestial',
        'Beast Rampant': 'Rampant',
        'Beast Passant': 'Passant',
        'Auto-cannons': 'Canons automatiques',
        'Augurium': 'Coup de tarière',
        'Artificial Gravity': 'Gravité artificielle',
        'Allagan Thunder': 'Foudre d\'Allag',
        'Aetherochemical Amplification': 'Laser Magismologique',
        '32-tonze Swipe': 'Swing de 32 tonz',
        '128-tonze Swing': 'Swing de 128 tonz',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Summon Order II': 'Actions en attente: 2',
        'Summon Order': 'Action en attente: 1',
        'Burns': 'Brûlure',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'vitalized shabti': 'ヴァイタライズ・シュワブチ',
        'vitalized reptoid': 'ヴァイタライズ・レプトイド',
        'vitalized iksalion': 'ヴァイタライズ・イクサリオン',
        'The Tycoon': 'タイクーン',
        'the First Beast': 'ファースト・ビースト',
        'the Face of the Beast': 'フェイス・オブ・ビースト',
        'surplus Kaliya': '量産型カーリア',
        'search drone': 'サーチドローン',
        'ghrah maximization': 'マキシ・ゴラホ',
        'flanborg': 'フランボルグ',
        'enforcement droid 209': 'エンフォースドロイド209',
        'clockwork ark knight': 'アラガンワーク・アークナイト',
        'beta zaghnal': 'ベータ・ザグナル',
        'alpha zaghnal': 'アルファ・ザグナル',
        'Zaghnal': '賞金首：ザグナル',
        'Voidwalker': 'Voidwalker',
        'Servomechanical Minotaur': 'サーヴォ・ミノタウロス',
        'Mithridates': 'ミトリダテス',
        'Mark CXLIV Thermocoil Boilbuster': 'シュワシュワケトルCXLIV世',
        'Leviathan': 'リヴァイアサン',
        'Engage!': '戦闘開始！',
        'Eden Prime': 'Eden Prime',
        'Levinball': '雷弾',
        'The Cornice': '次元潜行装置中枢',
        'Aetherial Observation': 'エーテル観測台',
        'Repurposing': '改装作業拠点',
        'Cladoselache': 'クラドセラケ',
      },
      'replaceText': {
        'attack': '攻撃',
        'Wind Spout': 'ウィンドスパウト',
        'Vorpal Blade': 'ボーパルブレード',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Beam': 'サンダービーム',
        'Thrown Flames': 'ナパーム',
        'Temporal Paradox': 'タイムパラドックス',
        'Temporal Flow': '時間解凍',
        'Sideswipe': 'サイドスワイプ',
        'Shock': '放電',
        'Shattered Crystal': 'クリスタル破裂',
        'Rail Cannon': 'レールキャノン',
        'Pounce Errant': 'XXXパウンス',
        'Pounce': 'パウンス',
        'Nerve Gas': 'ナーブガス',
        'Main Head': 'メインヘッド',
        'Magitek Ray': '魔導レーザー',
        'Magitek Crossray': '魔導クロスレーザー',
        'Magicrystal': '魔導クリスタル',
        'Luminous Laceration': 'ルミナスラサレーション',
        'Laserblade': 'レーザーブレード',
        'High-Tension Discharger': 'ハイテンション・ディスチャージャー',
        'High Gravity': '高重力',
        'Heave': 'しゃくりあげ',
        'Forlorn Impact': 'フォローンインパクト',
        'Electric Discharge': 'エレクトリック・ディスチャージ',
        'Defensive Array': '魔導プロテクティブレーザー',
        'Charge Eradicated': 'エラディケイター',
        'Berserk': 'ベルセルク',
        'Beastly Roar': 'ビーストロア',
        'Beast Rampant': 'ランパント',
        'Beast Passant': 'パッサント',
        'Auto-cannons': 'オートマチックカノン',
        'Augurium': 'アウガースマッシュ',
        'Artificial Gravity': 'アーティフィシャル・グラビティ',
        'Allagan Thunder': 'アラガン・サンダー',
        'Aetherochemical Amplification': '魔科学レーザー',
        '32-tonze Swipe': '32トンズ・スワイプ',
        '128-tonze Swing': '128トンズ・スイング',
      },
      '~effectNames': {
        'Summon Order II': 'アクション実行待機II',
        'Summon Order': 'アクション実行待機I',
        'Burns': '火傷',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Zaghnal': '悬赏魔物：扎戈斧龙',
        'Voidwalker': 'Voidwalker',
        'Servomechanical Minotaur': '自控化弥诺陶洛斯',
        'Leviathan': '利维亚桑',
        'Engage!': '战斗开始！',
        'Eden Prime': 'Eden Prime',
      },
      'replaceText': {
        'attack': '攻击',
        'Unknown Ability': 'Unknown Ability',
        'Aetherochemical Amplification': '魔科学激光',
      },
      '~effectNames': {
        'Burns': '火伤',
      },
    },
  ],
}];
