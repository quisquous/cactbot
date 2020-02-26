'use strict';

// The Twinning

[{
  zoneRegex: {
    en: /^The Twinning$/,
    ko: /^쌍둥이 시르쿠스$/,
  },
  timelineFile: 'twinning.txt',
  triggers: [
    {
      id: 'Twinning Main Head',
      regex: Regexes.startsUsing({ id: '3DBC', source: 'Surplus Kaliya', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DBC', source: 'Massengefertigt(?:e|er|es|en) Kaliya', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DBC', source: 'Kaliya De Surplus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DBC', source: '量産型カーリア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DBC', source: '量产型卡利亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DBC', source: '양산형 칼리아', capture: false }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      response: Responses.interupt(),
    },
    {
      id: 'Twinning Berserk',
      regex: Regexes.startsUsing({ id: '3DC0', source: 'Vitalized Reptoid', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DC0', source: 'Gestärkt(?:e|er|es|en) Reptoid', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DC0', source: 'Reptoïde Vitalisé', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DC0', source: 'ヴァイタライズ・レプトイド', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DC0', source: '活力化爬虫半人马', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DC0', source: '활성된 파충류', capture: false }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      response: Responses.interupt(),
    },
    {
      id: 'Twinning 128 Tonze Swing',
      regex: Regexes.startsUsing({ id: '3DBA', source: 'Servomechanical Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DBA', source: 'Servomechanisch(?:e|er|es|en) Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DBA', source: 'Minotaure Servomécanique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DBA', source: 'サーヴォ・ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DBA', source: '自控化弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DBA', source: '자동제어 미노타우로스', capture: false }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interupt(),
    },
    {
      // The handling for these mechanics is similar enough it makes sense to combine the trigger
      id: 'Twinning Impact + Pounce',
      regex: Regexes.headMarker({ id: ['003[2-5]', '005A'], capture: false }),
      suppressSeconds: 10,
      response: Responses.spread(),
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
        '(?<! )Zaghnal': 'Zaghnal',
        'Servomechanical Minotaur': 'Servomechanischer Minotaurus',
        'Mithridates': 'Mithridates',
        'Mark CXLIV Thermocoil Boilbuster': 'Magitek-Kessel Typ CXLIV',
        'Levinball': 'Donnerkugel',
        'The Cornice': 'Schnittstelle',
        'Aetherial Observation': 'Ätherobservationsdeck',
        'Repurposing': 'Umrüstanlage',
        'Cladoselache': 'Cladoselache',
      },
      'replaceText': {
        'Wind Spout': 'Windstreich',
        'Vorpal Blade': 'Vorpalklinge',
        'Thunder Beam': 'Gewitterstrahl',
        'Thrown Flames': 'Napalm',
        'Temporal Paradox': 'Zeitparadox',
        'Temporal Flow': 'Zeitfluss',
        'Sideswipe': 'Seitenfeger',
        'Shock': 'Entladung',
        'Shattered Crystal': 'Berstender Kristall',
        'Rail Cannon': 'Magnetschienenkanone',
        'Pounce Errant': 'Tobende Tatze',
        'Pounce(?! )': 'Raubtiertatze',
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
        '(?<! )Gravity': 'Gravitation',
        '(?<! )Crossray': 'Kreuzlaser',
      },
      '~effectNames': {
        'Summon Order II': 'Egi-Attacke II',
        'Summon Order': 'Egi-Attacke I',
        'Burns': 'Brandwunde',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
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
        '(?<! )Zaghnal': 'Zaghnal',
        'Servomechanical Minotaur': 'Minotaure Servomécanique',
        'Mithridates': 'Mithridate',
        'Mark CXLIV Thermocoil Boilbuster': 'Céruthermobouilleur v144',
        'Levinball': 'boule foudroyante',
        'The Cornice': 'Cœur du propulseur dimensionnel',
        'Aetherial Observation': 'Observatoire des flux éthérés',
        'Repurposing': 'Atelier d\'opti-rénovation',
        'Cladoselache': 'Cladoselache',
      },
      'replaceText': {
        'Wind Spout': 'Jet de vent',
        'Vorpal Blade': 'Lame vorpale',
        'Thunder Beam': 'Rayon de foudre',
        'Thrown Flames': 'Napalm',
        'Temporal Paradox': 'Paradoxe temporel',
        'Temporal Flow': 'Flux temporel',
        'Sideswipe': 'Fauche latérale',
        'Shock': 'Décharge électrostatique',
        'Shattered Crystal': 'Éclatement de cristal',
        'Rail Cannon': 'Canon électrique',
        'Pounce Errant': 'Attaque subite XXX',
        'Pounce(?! )': 'Attaque subite',
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
      'missingTranslations': true,
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
        '(?<! )Zaghnal': '賞金首：ザグナル',
        'Servomechanical Minotaur': 'サーヴォ・ミノタウロス',
        'Mithridates': 'ミトリダテス',
        'Mark CXLIV Thermocoil Boilbuster': 'シュワシュワケトルCXLIV世',
        'Levinball': '雷弾',
        'The Cornice': '次元潜行装置中枢',
        'Aetherial Observation': 'エーテル観測台',
        'Repurposing': '改装作業拠点',
        'Cladoselache': 'クラドセラケ',
      },
      'replaceText': {
        'Wind Spout': 'ウィンドスパウト',
        'Vorpal Blade': 'ボーパルブレード',
        'Thunder Beam': 'サンダービーム',
        'Thrown Flames': 'ナパーム',
        'Temporal Paradox': 'タイムパラドックス',
        'Temporal Flow': '時間解凍',
        'Sideswipe': 'サイドスワイプ',
        'Shock': '放電',
        'Shattered Crystal': 'クリスタル破裂',
        'Rail Cannon': 'レールキャノン',
        'Pounce Errant': 'XXXパウンス',
        'Pounce(?! )': 'パウンス',
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
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Zaghnal': '悬赏魔物：扎戈斧龙',
        'Servomechanical Minotaur': '自控化弥诺陶洛斯',
        'Leviathan': '利维亚桑',
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Aetherochemical Amplification': '魔科学激光',
      },
      '~effectNames': {
        'Burns': '火伤',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'vitalized shabti': '활성된 샤브티',
        'vitalized reptoid': '활성된 파충류',
        'vitalized iksalion': ' 활성된 이크살리온',
        'The Tycoon': '타이쿤',
        'the First Beast': '최초의 야수',
        'the Face of the Beast': '야수의 얼굴',
        'surplus Kaliya': '양산형 칼리아',
        'search drone': '무인 탐사기',
        'ghrah maximization': '최대화 고라호',
        'flanborg': '플란보르그',
        'enforcement droid 209': '집행자 드로이드 209',
        'clockwork ark knight': '알라그 방주 기사',
        'beta zaghnal': '베타 자그날',
        'alpha zaghnal': '알파 자그날',
        '(?<! )Zaghnal': '자그날',
        'Servomechanical Minotaur': '자동제어 미노타우로스',
        'Mithridates': '미트리다테스',
        'Mark CXLIV Thermocoil Boilbuster': '마도 주전자 보글보글 CXLIV세',
        'Levinball': '뇌탄',
        'Cladoselache': '클라도셀라케',
        'The Cornice': '개조 작업 거점',
        'Aetherial Observation': '에테르 관측대',
        'Repurposing': '차원 잠행 장치 중추',
      },
      'replaceText': {
        'Wind Spout': '바람 분출',
        'Vorpal Blade': '치명적인 칼날',
        'Thunder Beam': '번개 광선',
        'Thrown Flames': '네이팜',
        'Temporal Paradox': '시간 역설',
        'Temporal Flow': '시간 해동',
        'Sideswipe': '측면 후려치기',
        'Shock': '전격',
        'Shattered Crystal': '크리스탈 파열',
        'Rail Cannon': '전자기포',
        'Pounce Errant': 'XXX 덮치기',
        'Pounce(?! )': '덮치기',
        'Nerve Gas': '신경 가스',
        'Main Head': '가운뎃머리',
        'Magitek Ray': '마도 레이저',
        'Magitek Crossray': '마도 십자 레이저',
        'Magicrystal': '마도 크리스탈',
        'Luminous Laceration': '빛의 열상',
        'Laserblade': '레이저 칼날',
        'High-Tension Discharger': '고압 전류 방출',
        'High Gravity': '고중력',
        'Heave': '권력자의 한마디',
        'Forlorn Impact': '쓸쓸한 충격',
        'Electric Discharge': '전류 방출',
        'Defensive Array': '마도 방어 레이저',
        'Charge Eradicated': '박멸',
        'Berserk': '광포',
        'Beastly Roar': '야수의 포효',
        'Beast Rampant': '두발걷기',
        'Beast Passant': '네발걷기',
        'Auto-cannons': '자동 대포',
        'Augurium': '공격 조짐',
        'Artificial Gravity': '인공 중력',
        'Allagan Thunder': '알라그 선더',
        'Aetherochemical Amplification': '마과학 레이저',
        '32-tonze Swipe': '32톤즈 후려치기',
        '128-tonze Swing': '128톤즈 휘두르기',
        '(?<! )Gravity': '그라비데',
        '(?<! )Crossray': '십자 레이저',
      },
      '~effectNames': {
        'Summon Order II': '기술 실행 대기 2',
        'Summon Order': '기술 실행 대기 1',
        'Burns': '화상',
      },
    },
  ],
}];
