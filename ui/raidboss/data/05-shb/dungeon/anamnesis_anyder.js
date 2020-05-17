'use strict';

[{
  zoneRegex: {
    en: /^Anamnesis Anyder$/,
  },
  timelineFile: 'anamnesis_anyder.txt',
  timelineTriggers: [
  ],
  triggers: [
    {
      id: 'AnAnyder Fetid Fang',
      regex: Regexes.startsUsing({ source: 'Unknown', id: ['4B69', '4B72'] }),
      regexDe: Regexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: ['4B69', '4B72'] }),
      regexFr: Regexes.startsUsing({ source: 'Inconnu', id: ['4B69', '4B72'] }),
      regexJa: Regexes.startsUsing({ source: '正体不明', id: ['4B69', '4B72'] }),
      regexCn: Regexes.startsUsing({ source: '不明物体', id: ['4B69', '4B72'] }),
      regexKo: Regexes.startsUsing({ source: '정체불명', id: ['4B69', '4B72'] }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Scrutiny',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4E25', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4E25', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Inconnu', id: '4E25', capture: false }),
      regexJa: Regexes.startsUsing({ source: '正体不明', id: '4E25', capture: false }),
      regexCn: Regexes.startsUsing({ source: '不明物体', id: '4E25', capture: false }),
      regexKo: Regexes.startsUsing({ source: '정체불명', id: '4E25', capture: false }),
      delaySeconds: 3,
      durationSeconds: 7,
      infoText: {
        en: 'Avoid Arrow',
        de: 'Pfeil ausweichen',
        fr: 'Evitez la flèche',
        ko: '화살표 피하기',
        cn: '躲箭头',
      },
    },
    {
      id: 'AnAnyder Inscrutability',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4B6A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4B6A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Inconnu', id: '4B6A', capture: false }),
      regexJa: Regexes.startsUsing({ source: '正体不明', id: '4B6A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '不明物体', id: '4B6A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '정체불명', id: '4B6A', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder Luminous Ray',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4E2[67]', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4E2[67]', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Inconnu', id: '4E2[67]', capture: false }),
      regexJa: Regexes.startsUsing({ source: '正体不明', id: '4E2[67]', capture: false }),
      regexCn: Regexes.startsUsing({ source: '不明物体', id: '4E2[67]', capture: false }),
      regexKo: Regexes.startsUsing({ source: '정체불명', id: '4E2[67]', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder The Final Verse',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クリュプス', id: '4B58', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swing',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クリュプス', id: '4B55', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'AnAnyder Eye Of The Cyclone',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クリュプス', id: '4B57', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swipe',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クリュプス', id: '4B54', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Raging Glower',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クリュプス', id: '4B56', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Open Hearth Flying Fount',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'AnAnyder Bonebreaker',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      regexDe: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      regexFr: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      regexJa: Regexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B8C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Falling Water',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      regexDe: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      regexFr: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      regexJa: Regexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B7E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'AnAnyder Depth Grip',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B84', capture: false }),
      infoText: {
        en: 'Avoid Hands',
        de: 'Händen ausweichen',
        fr: 'Evitez les mains',
        ko: '손 피하기',
        cn: '躲手',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Anyder clionid': 'Anyder-Clionid',
        'Anyder diviner': 'Anyder-Wahrsager',
        'Anyder grappler': 'Anyder-Greifer',
        'Anyder harpooner': 'Anyder-Speerwerfer',
        'Anyder leech': 'Anyder-Egel',
        'Anyder squib': 'Anyder-Kreiselkrabbe',
        'Depth Grip': 'Hand des Ozeans',
        'Doxa': 'Platz der Doxa',
        'Katharsis': 'Platz der Katharsis',
        'Kyklops': 'Kyklops',
        'Noesis': 'Noesis',
        'Rukshs Dheem': 'Rukshs Dheem',
        'Sinister Bubble': 'Finster(?:e|er|es|en) Blase',
        'Unknown': 'Unbekannt(?:e|er|es|en)',
        'io ousia': 'Io-Ousia',
        'panopt ousia': 'Ousia',
        'queen\'s harpooner': 'Speer der Königin',
        'trench anemone': 'Tiefsee-Anemone',
        'trench danbania': 'Tiefsee-Danbania',
        'trench phuabo': 'Tiefsee-Phuabo',
        'trench xzomit': 'Tiefsee-Xzomit',
        'trench yovra': 'Tiefsee-Yovra',
      },
      'replaceText': {
        '2,000-mina swing': '2000 Mina-Schwung',
        '2,000-mina swipe': '2000 Mina-Hiebe',
        'Acrid Stream': 'Ätzende Strömung',
        'Arise': 'Erheben',
        'Barreling Smash': 'Fasswalze',
        'Blade/Hammer Mark': 'Schreckensklinge/hammer',
        'Bonebreaker': 'Knochenbrecher',
        'Buccal Cones': 'Bukkale Kegel',
        'Clearout': 'Kreisfeger',
        'Command Current': 'Flutenruf',
        'Coral Trident': 'Korallenharpune',
        'Crushing Gaze': 'Erdrückender Blick',
        'Depth Grip': 'Hand des Ozeans',
        'Dreadstorm': 'Furchtsturm',
        'Ectoplasmic Ray': 'Ektoplasmastrahl',
        'Explosion': 'Explosion',
        'Eye of the Cyclone': 'Auge des Zyklons',
        'Falling Rock': 'Steinschlag',
        'Falling Water': 'Fallendes Wasser',
        'Fetid Fang': 'Kontaminierte Klaue',
        'Flood': 'Flut',
        'Flying Fount': 'Spritzige Fontäne',
        'Hammer/Blade Mark': 'Schreckenshammer/klinge',
        'Hydroball': 'Wasserbombe',
        'Inscrutability': 'Unidentifizierbar',
        'Jumping Thrust': 'Sprungattacke',
        'Lacerate': 'Erodieren',
        'Luminous Ray': 'Lumineszenzstrahl',
        'Mantle Drill': 'Mantelbohrer',
        'Meatshield': 'Fleischschild',
        'Naval Ram': 'Seeramme',
        'Nursed Grudge': 'Unergründlicher Wille',
        'Open Hearth': 'Schreckensflammen',
        'Plain Weirdness': 'Unbekanntes Prinzip',
        'Pyre/Hearth': 'Schreckensstachel/flammen',
        'Raging Glower': 'Wütender Blick',
        'Recharge': 'Aufladen',
        'Reflection': 'Widerschein',
        'Rising Tide': 'Steigende Flut',
        'Rock Hard': 'Felsspalter',
        'Scrutiny': 'Überwachung',
        'Seabed Ceremony': 'Riffsturmzeremonie',
        'Setback': 'Rücksetzer',
        'Sewer Water': 'Abwasser',
        'Sweeping Gouge': 'Schwunghieb',
        'Swift Shift': 'Schneller Wechsel',
        'Swing/Swipe/Cyclone': 'Hiebe/Schwung/Zyklons',
        'Terrible Blade': 'Schreckensklinge',
        'Terrible Hammer': 'Schreckenshammer',
        'The Final Verse': 'Schreckensvers',
        'Unknown Add': 'Unbekanntes Add',
        'Wavebreaker': 'Wellenbrecher',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Dropsy': 'Wassersucht',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Anyder clionid': 'Clionide de l\'Anydre',
        'Anyder diviner': 'Devin de l\'Anydre',
        'Anyder grappler': 'Lutteur de l\'Anydre',
        'Anyder harpooner': 'Harponneur de l\'Anydre',
        'Anyder leech': 'Sangsue de l\'Anydre',
        'Anyder squib': 'Squib de l\'Anydre',
        'Kyklops': 'Kyklops',
        'Rukshs Dheem': 'Rukshs Dheem',
        'Unknown': 'Inconnu',
        'io ousia': 'Io ousia',
        'panopt ousia': 'Panopt ousia',
        'queen\'s harpooner': 'Harponneur royal',
        'sinister bubble': 'Bulle sinistre',
        'trench anemone': 'Anémone des abysses',
        'trench danbania': 'Dambanha des abysses',
        'trench phuabo': 'Phuabo des abysses',
        'trench xzomit': 'Xzomit des abysses',
        'trench yovra': 'Yovra des abysses',
      },
      'replaceText': {
        '2,000-mina swing': 'Swing de 2000 mina',
        '2,000-mina swipe': 'Fauche de 2000 mina',
        'Acrid Stream': 'Projection âcre',
        'Arise': 'Apparition',
        'Barreling Smash': 'Fracas effréné',
        'Bonebreaker': 'Brise-os',
        'Buccal Cones': 'Cônes buccaux',
        'Clearout': 'Fauchage',
        'Command Current': 'Eau courante',
        'Coral Trident': 'Trident corallien',
        'Crushing Gaze': 'Regard écrasant',
        'Depth Grip': 'Emprise des profondeurs',
        'Dreadstorm': 'Tempête d\'effroi',
        'Ectoplasmic Ray': 'Rayon ectoplasmique',
        'Explosion': 'Explosion',
        'Eye of the Cyclone': 'Œil du cyclone',
        'Falling Rock': 'Chute de pierre',
        'Falling Water': 'Chute d\'eau',
        'Fetid Fang': 'Croc contaminé',
        'Flood': 'Déluge',
        'Flying Fount': 'Cascade',
        'Hydroball': 'Hydroballe',
        'Inscrutability': 'Signification inconnue',
        'Jumping Thrust': 'Percée bondissante',
        'Lacerate': 'Lacération',
        'Luminous Ray': 'Rayon lumineux',
        'Mantle Drill': 'Manteau forant',
        'Meatshield': 'Chair à canon',
        'Naval Ram': 'Charge marine',
        'Nursed Grudge': 'Rancune nourrie',
        'Open Hearth': 'Flamme terrifiante',
        'Plain Weirdness': 'Principe inconnu',
        'Raging Glower': 'Regard enragé',
        'Recharge': 'Recharge',
        'Reflection': 'Réverbération',
        'Rising Tide': 'Marée montante',
        'Rock Hard': 'Brise-roc',
        'Scrutiny': 'Observation',
        'Seabed Ceremony': 'Cérémonie abyssale',
        'Setback': 'Revers',
        'Sewer Water': 'Eaux souillées',
        'Sweeping Gouge': 'Perforation balayante',
        'Swift Shift': 'Déplacement soudain',
        'Terrible Blade': 'Lame terrifiante',
        'Terrible Hammer': 'Marteau terrifiant',
        'Wavebreaker': 'Brise-vague',
        'the Final Verse': 'Le chapitre final',
      },
      '~effectNames': {
        'Bleeding': 'Saignant',
        'Dropsy': 'Œdème',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Anyder clionid': 'アニドラス・クリオニッド',
        'Anyder diviner': 'アニドラス・ディヴァイナー',
        'Anyder grappler': 'アニドラス・グラップラー',
        'Anyder harpooner': 'アニドラス・ハープナー',
        'Anyder leech': 'アニドラス・リーチ',
        'Anyder squib': 'アニドラス・スクイブ',
        'Kyklops': 'クリュプス',
        'Rukshs Dheem': 'ルクスィー・ディーマ',
        'Unknown': '正体不明',
        'io ousia': 'イーオー・ウーシア',
        'panopt ousia': 'パノプト・ウーシア',
        'queen\'s harpooner': 'クイーンズ・ハープナー',
        'sinister bubble': '不気味な泡',
        'trench anemone': 'トレンチ・アネモネ',
        'trench danbania': 'トレンチ・ダンバニア',
        'trench phuabo': 'トレンチ・フワボ',
        'trench xzomit': 'トレンチ・ゾミト',
        'trench yovra': 'トレンチ・ヨヴラ',
      },
      'replaceText': {
        '2,000-mina swing': '2000ミナ・スイング',
        '2,000-mina swipe': '2000ミナ・スワイプ',
        'Acrid Stream': 'アクリッドストリーム',
        'Arise': '出現',
        'Barreling Smash': 'バレリングスマッシュ',
        'Bonebreaker': '骨砕き',
        'Buccal Cones': 'バッカルコーン',
        'Clearout': 'なぎ払い',
        'Command Current': '流水',
        'Coral Trident': '珊瑚の銛',
        'Crushing Gaze': 'クラッシングゲイズ',
        'Depth Grip': 'ハンド・オブ・オーシャン',
        'Dreadstorm': 'ドレッドストーム',
        'Ectoplasmic Ray': 'エクトプラズミックレイ',
        'Explosion': '爆散',
        'Eye of the Cyclone': 'アイ・オブ・サイクロン',
        'Falling Rock': '落石',
        'Falling Water': '落水',
        'Fetid Fang': '不快な牙',
        'Flood': 'フラッド',
        'Flying Fount': '飛泉',
        'Hydroball': 'ハイドロボール',
        'Inscrutability': '意味不明',
        'Jumping Thrust': 'ジャンプスラスト',
        'Lacerate': 'ラサレイト',
        'Luminous Ray': 'ルミナスレイ',
        'Mantle Drill': 'マントルドリル',
        'Meatshield': 'ミートシールド',
        'Naval Ram': 'ネイバルラム',
        'Nursed Grudge': '不気味な念',
        'Open Hearth': '恐怖の火焔',
        'Plain Weirdness': '原理不明',
        'Raging Glower': 'レイジング・グラワー',
        'Recharge': '魔力供給',
        'Reflection': 'リフレクション',
        'Rising Tide': '上げ潮',
        'Rock Hard': 'ロッククラッシャー',
        'Scrutiny': '観察',
        'Seabed Ceremony': '水底の儀式',
        'Setback': '打ち払い',
        'Sewer Water': 'スーウェッジウォーター',
        'Sweeping Gouge': 'スウィーピングガウジ',
        'Swift Shift': '高速移動',
        'Terrible Blade': '恐怖の大剣',
        'Terrible Hammer': '恐怖の戦鎚',
        'Wavebreaker': 'ウェーブブレイク',
        'the Final Verse': '恐怖の最終章',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Dropsy': '水毒',
      },
    },
  ],
}];
