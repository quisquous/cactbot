'use strict';

// The Twinning

[{
  zoneRegex: {
    en: /^The Twinning$/,
    cn: /^异界遗构希尔科斯孪晶塔$/,
    ko: /^쌍둥이 시르쿠스$/,
  },
  timelineFile: 'twinning.txt',
  triggers: [
    {
      id: 'Twinning Main Head',
      regex: Regexes.startsUsing({ id: '3DBC', source: 'Surplus Kaliya' }),
      regexDe: Regexes.startsUsing({ id: '3DBC', source: 'Massengefertigt(?:e|er|es|en) Kaliya' }),
      regexFr: Regexes.startsUsing({ id: '3DBC', source: 'Kaliya De Surplus' }),
      regexJa: Regexes.startsUsing({ id: '3DBC', source: '量産型カーリア' }),
      regexCn: Regexes.startsUsing({ id: '3DBC', source: '量产型卡利亚' }),
      regexKo: Regexes.startsUsing({ id: '3DBC', source: '양산형 칼리아' }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      response: Responses.stun(),
    },
    {
      id: 'Twinning Berserk',
      regex: Regexes.startsUsing({ id: '3DC0', source: 'Vitalized Reptoid' }),
      regexDe: Regexes.startsUsing({ id: '3DC0', source: 'Gestärkt(?:e|er|es|en) Reptoid' }),
      regexFr: Regexes.startsUsing({ id: '3DC0', source: 'Reptoïde Vitalisé' }),
      regexJa: Regexes.startsUsing({ id: '3DC0', source: 'ヴァイタライズ・レプトイド' }),
      regexCn: Regexes.startsUsing({ id: '3DC0', source: '活力化爬虫半人马' }),
      regexKo: Regexes.startsUsing({ id: '3DC0', source: '활성된 파충류' }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'Twinning 128 Tonze Swing',
      regex: Regexes.startsUsing({ id: '3DBA', source: 'Servomechanical Minotaur' }),
      regexDe: Regexes.startsUsing({ id: '3DBA', source: 'Servomechanisch(?:e|er|es|en) Minotaurus' }),
      regexFr: Regexes.startsUsing({ id: '3DBA', source: 'Minotaure Servomécanique' }),
      regexJa: Regexes.startsUsing({ id: '3DBA', source: 'サーヴォ・ミノタウロス' }),
      regexCn: Regexes.startsUsing({ id: '3DBA', source: '自控化弥诺陶洛斯' }),
      regexKo: Regexes.startsUsing({ id: '3DBA', source: '자동제어 미노타우로스' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      // The handling for these mechanics is similar enough it makes sense to combine the trigger
      id: 'Twinning Impact + Pounce',
      regex: Regexes.headMarker({ id: ['003[2-5]', '005A'], capture: false }),
      suppressSeconds: 10,
      infoText: {
        en: 'Spread (avoid cages)',
        de: 'Verteilen (Vermeide "Käfige")',
        fr: 'Dispersez vous (évitez les cages)',
        ko: '산개 (몬스터 우리 피하기)',
        cn: '分散（躲避笼子）',
      },
    },
    {
      id: 'Twinning Beastly Roar',
      regex: Regexes.startsUsing({ id: '3D64', source: 'Alpha Zaghnal', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D64', source: 'Alpha-Zaghnal', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D64', source: 'Zaghnal Alpha', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D64', source: 'アルファ・ザグナル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D64', source: '扎戈斧龙一型', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D64', source: '알파 자그날', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'Twinning Augurium',
      regex: Regexes.startsUsing({ id: '3D65', source: 'Alpha Zaghnal' }),
      regexDe: Regexes.startsUsing({ id: '3D65', source: 'Alpha-Zaghnal' }),
      regexFr: Regexes.startsUsing({ id: '3D65', source: 'Zaghnal Alpha' }),
      regexJa: Regexes.startsUsing({ id: '3D65', source: 'アルファ・ザグナル' }),
      regexCn: Regexes.startsUsing({ id: '3D65', source: '扎戈斧龙一型' }),
      regexKo: Regexes.startsUsing({ id: '3D65', source: '알파 자그날' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Twinning Charge Eradicated',
      regex: Regexes.headMarker({ id: '005D' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Twinning Thunder Beam',
      regex: Regexes.startsUsing({ id: '3DED', source: 'Mithridates' }),
      regexDe: Regexes.startsUsing({ id: '3DED', source: 'Mithridates' }),
      regexFr: Regexes.startsUsing({ id: '3DED', source: 'Mithridate' }),
      regexJa: Regexes.startsUsing({ id: '3DED', source: 'ミトリダテス' }),
      regexCn: Regexes.startsUsing({ id: '3DED', source: '米特里达梯' }),
      regexKo: Regexes.startsUsing({ id: '3DED', source: '미트리다테스' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      // Alternatively, we could use 1B:\y{ObjectId}:(\y{Name}):....:....:00A0
      id: 'Twinning Allagan Thunder',
      regex: Regexes.startsUsing({ id: '3DEF', source: 'Mithridates' }),
      regexDe: Regexes.startsUsing({ id: '3DEF', source: 'Mithridates' }),
      regexFr: Regexes.startsUsing({ id: '3DEF', source: 'Mithridate' }),
      regexJa: Regexes.startsUsing({ id: '3DEF', source: 'ミトリダテス' }),
      regexCn: Regexes.startsUsing({ id: '3DEF', source: '米特里达梯' }),
      regexKo: Regexes.startsUsing({ id: '3DEF', source: '미트리다테스' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'Twinning Magitek Crossray',
      regex: Regexes.startsUsing({ id: '3DF8', source: 'The Tycoon', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DF8', source: 'Tycoon', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DF8', source: 'Le Magnat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DF8', source: 'タイクーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DF8', source: '泰空', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DF8', source: '타이쿤', capture: false }),
      suppressSeconds: 15,
      infoText: {
        en: 'cardinal lasers',
        de: 'Himmelrichtungs-Lasers',
        fr: 'Lasers cardinaux',
        ko: '십자 레이저',
        cn: '正点激光',
      },
    },
    {
      id: 'Twinning Defensive Array',
      regex: Regexes.startsUsing({ id: '3DF2', source: 'The Tycoon', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DF2', source: 'Tycoon', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DF2', source: 'Le Magnat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DF2', source: 'タイクーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DF2', source: '泰空', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DF2', source: '타이쿤', capture: false }),
      suppressSeconds: 15,
      infoText: {
        en: 'outer lasers',
        de: 'Lasers am Rand',
        fr: 'Lasers extérieurs',
        ko: '외곽 레이저',
        cn: '外侧激光',
      },
    },
    {
      id: 'Twinning Rail Cannon',
      regex: Regexes.startsUsing({ id: '3DFB', source: 'The Tycoon' }),
      regexDe: Regexes.startsUsing({ id: '3DFB', source: 'Tycoon' }),
      regexFr: Regexes.startsUsing({ id: '3DFB', source: 'Le Magnat' }),
      regexJa: Regexes.startsUsing({ id: '3DFB', source: 'タイクーン' }),
      regexCn: Regexes.startsUsing({ id: '3DFB', source: '泰空' }),
      regexKo: Regexes.startsUsing({ id: '3DFB', source: '타이쿤' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      // An alternative is 1B:\y{ObjectId}:\y{Name}:....:....:00A9
      id: 'Twinning Magicrystal',
      regex: Regexes.startsUsing({ id: '3E0C', source: 'The Tycoon', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3E0C', source: 'Tycoon', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3E0C', source: 'Le Magnat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3E0C', source: 'タイクーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3E0C', source: '泰空', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3E0C', source: '타이쿤', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'Twinning Discharger',
      regex: Regexes.startsUsing({ id: '3DFC', source: 'The Tycoon', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DFC', source: 'Tycoon', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DFC', source: 'Le Magnat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DFC', source: 'タイクーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DFC', source: '泰空', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DFC', source: '타이쿤', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<! )Zaghnal': 'Zaghnal',
        'Aetherial Observation': 'Ätherobservationsdeck',
        'Alpha Zaghnal': 'Alpha-Zaghnal',
        'Cladoselache': 'Cladoselache',
        'Levinball': 'Donnerkugel',
        'Mark CXLIV Thermocoil Boilbuster': 'Magitek-Kessel Typ CXLIV',
        'Mithridates': 'Mithridates',
        'Repurposing': 'Umrüstanlage',
        'Servomechanical Minotaur': 'Servomechanisch(?:e|er|es|en) Minotaurus',
        'The Cornice': 'Schnittstelle',
        'The Tycoon': 'Tycoon',
        'beta zaghnal': 'Beta-Zaghnal',
        'clockwork ark knight': 'Uhrwerk-Erzritter',
        'enforcement droid 209': 'Vollzugsdroide 209',
        'flanborg': 'Flanborg',
        'ghrah maximization': 'Maxi-Ghrah',
        'search drone': 'Suchdrohne',
        'surplus Kaliya': 'massengefertigt(?:e|er|es|en) Kaliya',
        'the Face of the Beast': 'Antlitz des Boten',
        'the First Beast': 'das erste Unheil',
        'vitalized iksalion': 'gestärkter Iksalion',
        'vitalized reptoid': 'gestärkt(?:e|er|es|en) Reptoid',
        'vitalized shabti': 'gestärkter Shabti',
      },
      'replaceText': {
        '(?<! )Crossray': 'Kreuzlaser',
        '(?<! )Gravity': 'Gravitation',
        '128-tonze Swing': '128-Tonzen-Schwung',
        '32-tonze Swipe': '32-Tonzen-Schwung',
        'Aetherochemical Amplification': 'Ätherochemische Amplifikation',
        'Allagan Thunder': 'Allagischer Blitzschlag',
        'Artificial Gravity': 'Künstliche Gravitation',
        'Augurium': 'Schmetterbohrer',
        'Auto-cannons': 'Autokanonen',
        'Beast Passant': 'Stahlpranke',
        'Beast Rampant': 'Ungezügelt',
        'Beastly Roar': 'Bestialisches Brüllen',
        'Berserk': 'Berserker',
        'Charge Eradicated': 'Ausrottung',
        'Defensive Array': 'Magitek-Schutzlaser',
        'Electric Discharge': 'Elektrische Entladung',
        'Forlorn Impact': 'Einsamer Einschlag',
        'Heave': 'Aufspießen',
        'High Gravity': 'Hohe Gravitation',
        'High-Tension Discharger': 'Hochspannungsentlader',
        'Laserblade': 'Laserklingen',
        'Luminous Laceration': 'Lichtriss',
        'Magicrystal': 'Magitek-Kristall',
        'Magitek Crossray': 'Magitek-Kreuzlaser',
        'Magitek Ray': 'Magitek-Laser',
        'Main Head': 'Hauptkopf',
        'Nerve Gas': 'Nervengas',
        'Pounce Errant': 'Tobende Tatze',
        'Pounce(?! )': 'Raubtiertatze',
        'Rail Cannon': 'Magnetschienenkanone',
        'Shattered Crystal': 'Berstender Kristall',
        'Shock': 'Entladung',
        'Sideswipe': 'Seitenfeger',
        'Temporal Flow': 'Zeitfluss',
        'Temporal Paradox': 'Zeitparadox',
        'Thrown Flames': 'Napalm',
        'Thunder Beam': 'Gewitterstrahl',
        'Vorpal Blade': 'Vorpalklinge',
        'Wind Spout': 'Windstreich',
      },
      '~effectNames': {
        'Burns': 'Brandwunde',
        'Summon Order': 'Egi-Attacke I',
        'Summon Order II': 'Egi-Attacke II',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Zaghnal': 'Zaghnal',
        'Aetherial Observation': 'Observatoire des flux éthérés',
        'Cladoselache': 'Cladoselache',
        'Levinball': 'boule foudroyante',
        'Mark CXLIV Thermocoil Boilbuster': 'Céruthermobouilleur v144',
        'Mithridates': 'Mithridate',
        'Repurposing': 'Atelier d\'opti-rénovation',
        'Servomechanical Minotaur': 'Minotaure Servomécanique',
        'The Cornice': 'Cœur du propulseur dimensionnel',
        'The Tycoon': 'Le Magnat',
        'alpha zaghnal': 'Zaghnal alpha',
        'beta zaghnal': 'Zaghnal bêta',
        'clockwork ark knight': 'Archichevalier mécanique',
        'enforcement droid 209': 'Droïde d\'exécution 209',
        'flanborg': 'Flanborg',
        'ghrah maximization': 'Maxi ghrah',
        'search drone': 'Drone de repérage',
        'surplus Kaliya': 'Kaliya de surplus',
        'the Face of the Beast': 'Visages de la Bête',
        'the First Beast': 'Annélide de l\'apocalypse',
        'vitalized iksalion': 'Iksalion vitalisé',
        'vitalized reptoid': 'Reptoïde vitalisé',
        'vitalized shabti': 'Chaouabti vitalisé',
      },
      'replaceText': {
        '128-tonze Swing': 'Swing de 128 tonz',
        '32-tonze Swipe': 'Swing de 32 tonz',
        'Aetherochemical Amplification': 'Laser Magismologique',
        'Allagan Thunder': 'Foudre d\'Allag',
        'Artificial Gravity': 'Gravité artificielle',
        'Augurium': 'Coup de tarière',
        'Auto-cannons': 'Canons automatiques',
        'Beast Passant': 'Passant',
        'Beast Rampant': 'Rampant',
        'Beastly Roar': 'Rugissement bestial',
        'Berserk': 'Furie',
        'Charge Eradicated': 'Éradicateur',
        'Defensive Array': 'Rayon protecteur magitek',
        'Electric Discharge': 'Décharge électrique',
        'Forlorn Impact': 'Déflagration affligeante',
        'Heave': 'Projection',
        'High Gravity': 'Haute gravité',
        'High-Tension Discharger': 'Déchargeur haute tension',
        'Laserblade': 'Lame laser',
        'Luminous Laceration': 'Lacération lumineuse',
        'Magicrystal': 'Cristal magitek',
        'Magitek Crossray': 'Rayon croisé magitek',
        'Magitek Ray': 'Rayon magitek',
        'Main Head': 'Tête principale',
        'Nerve Gas': 'Gaz neurotoxique',
        'Pounce Errant': 'Attaque subite XXX',
        'Pounce(?! )': 'Attaque subite',
        'Rail Cannon': 'Canon électrique',
        'Shattered Crystal': 'Éclatement de cristal',
        'Shock': 'Décharge électrostatique',
        'Sideswipe': 'Fauche latérale',
        'Temporal Flow': 'Flux temporel',
        'Temporal Paradox': 'Paradoxe temporel',
        'Thrown Flames': 'Napalm',
        'Thunder Beam': 'Rayon de foudre',
        'Vorpal Blade': 'Lame vorpale',
        'Wind Spout': 'Jet de vent',
      },
      '~effectNames': {
        'Burns': 'Brûlure',
        'Summon Order': 'Action en attente: 1',
        'Summon Order II': 'Actions en attente: 2',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Zaghnal': '賞金首：ザグナル',
        'Aetherial Observation': 'エーテル観測台',
        'Cladoselache': 'クラドセラケ',
        'Levinball': '雷弾',
        'Mark CXLIV Thermocoil Boilbuster': 'シュワシュワケトルCXLIV世',
        'Mithridates': 'ミトリダテス',
        'Repurposing': '改装作業拠点',
        'Servomechanical Minotaur': 'サーヴォ・ミノタウロス',
        'The Cornice': '次元潜行装置中枢',
        'The Tycoon': 'タイクーン',
        'alpha zaghnal': 'アルファ・ザグナル',
        'beta zaghnal': 'ベータ・ザグナル',
        'clockwork ark knight': 'アラガンワーク・アークナイト',
        'enforcement droid 209': 'エンフォースドロイド209',
        'flanborg': 'フランボルグ',
        'ghrah maximization': 'マキシ・ゴラホ',
        'search drone': 'サーチドローン',
        'surplus Kaliya': '量産型カーリア',
        'the Face of the Beast': 'フェイス・オブ・ビースト',
        'the First Beast': 'ファースト・ビースト',
        'vitalized iksalion': 'ヴァイタライズ・イクサリオン',
        'vitalized reptoid': 'ヴァイタライズ・レプトイド',
        'vitalized shabti': 'ヴァイタライズ・シュワブチ',
      },
      'replaceText': {
        '128-tonze Swing': '128トンズ・スイング',
        '32-tonze Swipe': '32トンズ・スワイプ',
        'Aetherochemical Amplification': '魔科学レーザー',
        'Allagan Thunder': 'アラガン・サンダー',
        'Artificial Gravity': 'アーティフィシャル・グラビティ',
        'Augurium': 'アウガースマッシュ',
        'Auto-cannons': 'オートマチックカノン',
        'Beast Passant': 'パッサント',
        'Beast Rampant': 'ランパント',
        'Beastly Roar': 'ビーストロア',
        'Berserk': 'ベルセルク',
        'Charge Eradicated': 'エラディケイター',
        'Defensive Array': '魔導プロテクティブレーザー',
        'Electric Discharge': 'エレクトリック・ディスチャージ',
        'Forlorn Impact': 'フォローンインパクト',
        'Heave': 'しゃくりあげ',
        'High Gravity': '高重力',
        'High-Tension Discharger': 'ハイテンション・ディスチャージャー',
        'Laserblade': 'レーザーブレード',
        'Luminous Laceration': 'ルミナスラサレーション',
        'Magicrystal': '魔導クリスタル',
        'Magitek Crossray': '魔導クロスレーザー',
        'Magitek Ray': '魔導レーザー',
        'Main Head': 'メインヘッド',
        'Nerve Gas': 'ナーブガス',
        'Pounce Errant': 'XXXパウンス',
        'Pounce(?! )': 'パウンス',
        'Rail Cannon': 'レールキャノン',
        'Shattered Crystal': 'クリスタル破裂',
        'Shock': '放電',
        'Sideswipe': 'サイドスワイプ',
        'Temporal Flow': '時間解凍',
        'Temporal Paradox': 'タイムパラドックス',
        'Thrown Flames': 'ナパーム',
        'Thunder Beam': 'サンダービーム',
        'Vorpal Blade': 'ボーパルブレード',
        'Wind Spout': 'ウィンドスパウト',
      },
      '~effectNames': {
        'Burns': '火傷',
        'Summon Order': 'アクション実行待機I',
        'Summon Order II': 'アクション実行待機II',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Zaghnal': '(?<! )Zaghnal(FIXME)',
        'Aetherial Observation': '以太观测台',
        'Cladoselache': '裂口鲨',
        'Leviathan': '利维亚桑',
        'Levinball': '雷弹',
        'Mark CXLIV Thermocoil Boilbuster': '热气腾腾水壶144号',
        'Mithridates': '米特里达梯',
        'Repurposing': '改造据点',
        'Servomechanical Minotaur': '自控化弥诺陶洛斯',
        'The Cornice': '时空潜行装置中枢',
        'The Tycoon': '泰空',
        'alpha zaghnal': '扎戈斧龙一型',
        'beta zaghnal': '扎戈斧龙二型',
        'clockwork ark knight': '亚拉戈发条圣柜骑士',
        'enforcement droid 209': '执法机甲209',
        'flanborg': '机械软糊怪',
        'ghrah maximization': '最大化晶片',
        'search drone': '索敌无人机',
        'surplus Kaliya': '量产型卡利亚',
        'the Face of the Beast': '灾兽之面',
        'the First Beast': '第一之兽',
        'vitalized iksalion': '活力化改造鸟人',
        'vitalized reptoid': '活力化爬虫半人马',
        'vitalized shabti': '活力化沙布提',
      },
      'replaceText': {
        '(?<! )Crossray': '(?<! )交叉激光',
        '(?<! )Gravity': '(?<! )重力',
        '128-tonze Swing': '百廿八吨回转',
        '32-tonze Swipe': '卅二吨重击',
        'Aetherochemical Amplification': '魔科学激光',
        'Allagan Thunder': '亚拉戈闪雷',
        'Artificial Gravity': '人造重力',
        'Augurium': '预兆',
        'Auto-cannons': '自动火炮',
        'Beast Passant': '四足着地',
        'Beast Rampant': '人立而起',
        'Beastly Roar': '残虐咆哮',
        'Berserk': '狂暴',
        'Charge Eradicated': '歼灭弹',
        'Defensive Array': '魔导防护激光',
        'Electric Discharge': '排电',
        'Forlorn Impact': '绝望冲击',
        'Heave': '上抽',
        'High Gravity': '高重力',
        'High-Tension Discharger': '高压排电',
        'Laserblade': '激光剑',
        'Luminous Laceration': '光流撕裂',
        'Magicrystal': '魔导水晶',
        'Magitek Crossray': '魔导交叉激光',
        'Magitek Ray': '魔导激光',
        'Main Head': '主首',
        'Nerve Gas': '神经毒气',
        'Pounce Errant': 'XXX突袭',
        'Pounce(?! )': '突袭(?! )',
        'Rail Cannon': '轨道炮',
        'Shattered Crystal': '水晶破裂',
        'Shock': '放电',
        'Sideswipe': '侧扫',
        'Temporal Flow': '时间解冻',
        'Temporal Paradox': '时间悖论',
        'Thrown Flames': '汽油弹',
        'Thunder Beam': '电光束',
        'Vorpal Blade': '致命斩',
        'Wind Spout': '喷风',
      },
      '~effectNames': {
        'Burns': '火伤',
        'Summon Order': '发动技能待命I',
        'Summon Order II': '发动技能待命II',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '(?<! )Zaghnal': '자그날',
        'Aetherial Observation': '에테르 관측대',
        'Cladoselache': '클라도셀라케',
        'Levinball': '뇌탄',
        'Mark CXLIV Thermocoil Boilbuster': '마도 주전자 보글보글 CXLIV세',
        'Mithridates': '미트리다테스',
        'Repurposing': '개조 작업 거점',
        'Servomechanical Minotaur': '자동제어 미노타우로스',
        'The Cornice': '차원 잠행 장치 중추',
        'The Tycoon': '타이쿤',
        'alpha zaghnal': '알파 자그날',
        'beta zaghnal': '베타 자그날',
        'clockwork ark knight': '알라그 방주 기사',
        'enforcement droid 209': '집행자 드로이드 209',
        'flanborg': '플란보르그',
        'ghrah maximization': '최대화 고라호',
        'search drone': '무인 탐사기',
        'surplus Kaliya': '양산형 칼리아',
        'the Face of the Beast': '야수의 얼굴',
        'the First Beast': '최초의 야수',
        'vitalized iksalion': ' 활성된 이크살리온',
        'vitalized reptoid': '활성된 파충류',
        'vitalized shabti': '활성된 샤브티',
      },
      'replaceText': {
        '(?<! )Crossray': '십자 레이저',
        '(?<! )Gravity': '그라비데',
        '128-tonze Swing': '128톤즈 휘두르기',
        '32-tonze Swipe': '32톤즈 후려치기',
        'Aetherochemical Amplification': '마과학 레이저',
        'Allagan Thunder': '알라그 선더',
        'Artificial Gravity': '인공 중력',
        'Augurium': '공격 조짐',
        'Auto-cannons': '자동 대포',
        'Beast Passant': '네발걷기',
        'Beast Rampant': '두발걷기',
        'Beastly Roar': '야수의 포효',
        'Berserk': '광포',
        'Charge Eradicated': '박멸',
        'Defensive Array': '마도 방어 레이저',
        'Electric Discharge': '전류 방출',
        'Forlorn Impact': '쓸쓸한 충격',
        'Heave': '권력자의 한마디',
        'High Gravity': '고중력',
        'High-Tension Discharger': '고압 전류 방출',
        'Laserblade': '레이저 칼날',
        'Luminous Laceration': '빛의 열상',
        'Magicrystal': '마도 크리스탈',
        'Magitek Crossray': '마도 십자 레이저',
        'Magitek Ray': '마도 레이저',
        'Main Head': '가운뎃머리',
        'Nerve Gas': '신경 가스',
        'Pounce Errant': 'XXX 덮치기',
        'Pounce(?! )': '덮치기',
        'Rail Cannon': '전자기포',
        'Shattered Crystal': '크리스탈 파열',
        'Shock': '전격',
        'Sideswipe': '측면 후려치기',
        'Temporal Flow': '시간 해동',
        'Temporal Paradox': '시간 역설',
        'Thrown Flames': '네이팜',
        'Thunder Beam': '번개 광선',
        'Vorpal Blade': '치명적인 칼날',
        'Wind Spout': '바람 분출',
      },
      '~effectNames': {
        'Burns': '화상',
        'Summon Order': '기술 실행 대기 1',
        'Summon Order II': '기술 실행 대기 2',
      },
    },
  ],
}];
