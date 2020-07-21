'use strict';

[{
  zoneRegex: {
    en: /^Anamnesis Anyder$/,
    cn: /^黑风海底 阿尼德罗追忆馆$/,
  },
  zoneId: ZoneId.AnamnesisAnyder,
  timelineFile: 'anamnesis_anyder.txt',
  timelineTriggers: [
  ],
  triggers: [
    {
      id: 'AnAnyder Fetid Fang',
      netRegex: NetRegexes.startsUsing({ source: 'Unknown', id: ['4B69', '4B72'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: ['4B69', '4B72'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Inconnu', id: ['4B69', '4B72'] }),
      netRegexJa: NetRegexes.startsUsing({ source: '正体不明', id: ['4B69', '4B72'] }),
      netRegexCn: NetRegexes.startsUsing({ source: '不明物体', id: ['4B69', '4B72'] }),
      netRegexKo: NetRegexes.startsUsing({ source: '정체불명', id: ['4B69', '4B72'] }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Scrutiny',
      netRegex: NetRegexes.startsUsing({ source: 'Unknown', id: '4E25', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4E25', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Inconnu', id: '4E25', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '正体不明', id: '4E25', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '不明物体', id: '4E25', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '정체불명', id: '4E25', capture: false }),
      delaySeconds: 3,
      durationSeconds: 7,
      infoText: {
        en: 'Avoid Arrow',
        de: 'Pfeil ausweichen',
        fr: 'Évitez la flèche',
        cn: '躲箭头',
        ko: '화살표 피하기',
      },
    },
    {
      id: 'AnAnyder Inscrutability',
      netRegex: NetRegexes.startsUsing({ source: 'Unknown', id: '4B6A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4B6A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Inconnu', id: '4B6A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '正体不明', id: '4B6A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '不明物体', id: '4B6A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '정체불명', id: '4B6A', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder Luminous Ray',
      netRegex: NetRegexes.startsUsing({ source: 'Unknown', id: '4E2[67]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Unbekannt(?:e|er|es|en)', id: '4E2[67]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Inconnu', id: '4E2[67]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '正体不明', id: '4E2[67]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '不明物体', id: '4E2[67]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '정체불명', id: '4E2[67]', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder The Final Verse',
      netRegex: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クリュプス', id: '4B58', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '克琉普斯', id: '4B58', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swing',
      netRegex: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クリュプス', id: '4B55', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '克琉普斯', id: '4B55', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'AnAnyder Eye Of The Cyclone',
      netRegex: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クリュプス', id: '4B57', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '克琉普斯', id: '4B57', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swipe',
      netRegex: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クリュプス', id: '4B54', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '克琉普斯', id: '4B54', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Raging Glower',
      netRegex: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クリュプス', id: '4B56', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '克琉普斯', id: '4B56', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Open Hearth Flying Fount',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'AnAnyder Bonebreaker',
      netRegex: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B8C' }),
      netRegexCn: NetRegexes.startsUsing({ source: '鲁克嘶·蒂母', id: '4B8C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Falling Water',
      netRegex: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B7E' }),
      netRegexCn: NetRegexes.startsUsing({ source: '鲁克嘶·蒂母', id: '4B7E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'AnAnyder Depth Grip',
      netRegex: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルクスィー・ディーマ', id: '4B84', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '鲁克嘶·蒂母', id: '4B84', capture: false }),
      infoText: {
        en: 'Avoid Hands',
        de: 'Händen ausweichen',
        fr: 'Évitez les mains',
        cn: '躲手',
        ko: '손 피하기',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Sinister Bubble': 'Finster(?:e|er|es|en) Blase',
        'Rukshs Dheem': 'Rukshs Dheem',
        'Unknown': 'Unbekannt(?:e|er|es|en)',
        'Kyklops': 'Kyklops',
        'Depth Grip': 'Hand des Ozeans',
        'Katharsis': 'Platz der Katharsis',
        'Doxa': 'Platz der Doxa',
        'Noesis': 'Noesis',
      },
      'replaceText': {
        'The Final Verse': 'Schreckensvers',
        'Wavebreaker': 'Wellenbrecher',
        'Terrible Hammer/Blade': 'Schreckenshammer/klinge',
        'Terrible Blade/Hammer': 'Schreckensklinge/Hammer',
        'Swift Shift': 'Schneller Wechsel',
        'Setback': 'Rücksetzer',
        'Seabed Ceremony': 'Riffsturmzeremonie',
        'Scrutiny': 'Überwachung',
        'Rising Tide': 'Steigende Flut',
        'Raging Glower': 'Wütender Blick',
        'Plain Weirdness': 'Unbekanntes Prinzip',
        'Luminous Ray': 'Lumineszenzstrahl',
        'Inscrutability': 'Unidentifizierbar',
        'Flying Fount': 'Spritzige Fontäne',
        'Fetid Fang': 'Kontaminierte Klaue',
        'Falling Water': 'Fallendes Wasser',
        'Explosion': 'Explosion',
        'Ectoplasmic Ray': 'Ektoplasmastrahl',
        'Depth Grip': 'Hand des Ozeans',
        'Command Current': 'Flutenruf',
        'Clearout': 'Kreisfeger',
        'Bonebreaker': 'Knochenbrecher',
        'Swing/Swipe/Cyclone': 'Hiebe/Schwung/Zyklons',
        'Hammer/Blade Mark': 'Hammer/Klingenmarkierung',
        'Blade/Hammer Mark': 'Klinge/Hammermarkierung',
        'Pyre/Hearth': 'Schreckensstachel/flammen',
        'Unknown Add': 'Unbekanntes Add',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Depth Grip': 'Emprise Des Profondeurs',
        'Doxa': 'la Doxa',
        'Katharsis': 'la Catharsis',
        'Kyklops': 'Kyklops',
        'Noesis': 'la Noesis',
        'Sinister Bubble': 'Bulle sinistre',
        'Rukshs Dheem': 'Rukshs Dheem',
        'Unknown': 'Inconnu',
      },
      'replaceText': {
        'The Final Verse': 'Le chapitre final',
        'Wavebreaker': 'Brise-vague',
        'Unknown Add': 'Add Inconnu',
        'Terrible Hammer/Blade': 'Marteau/Lame terrifiante',
        'Terrible Blade/Hammer': 'Lame/Marteau terrifiant',
        'Swing/Swipe/Cyclone': 'Swing/Fauche/Cyclone',
        'Swift Shift': 'Déplacement soudain',
        'Setback': 'Revers',
        'Seabed Ceremony': 'Cérémonie abyssale',
        'Scrutiny': 'Observation',
        'Rising Tide': 'Marée montante',
        'Raging Glower': 'Regard enragé',
        'Pyre/Hearth': 'Explosion/Flamme',
        'Plain Weirdness': 'Principe inconnu',
        'Luminous Ray': 'Rayon lumineux',
        'Inscrutability': 'Signification inconnue',
        'Hammer/Blade Mark': 'Marque Marteau/Lame',
        'Flying Fount': 'Cascade',
        'Fetid Fang': 'Croc contaminé',
        'Falling Water': 'Chute d\'eau',
        'Explosion': 'Explosion',
        'Ectoplasmic Ray': 'Rayon ectoplasmique',
        'Depth Grip': 'Emprise des profondeurs',
        'Command Current': 'Eau courante',
        'Clearout': 'Fauchage',
        'Bonebreaker': 'Brise-os',
        'Blade/Hammer Mark': 'Marque Lame/Marteau',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Depth Grip': 'ハンド・オブ・オーシャン',
        'Doxa': 'ドクサの広間',
        'Katharsis': 'カタルシスの広場',
        'Kyklops': 'クリュプス',
        'Noesis': 'ノエシスの間',
        'Rukshs Dheem': 'ルクスィー・ディーマ',
        'Sinister Bubble': '不気味な泡',
        'Unknown': '正体不明',
      },
      'replaceText': {
        'The Final Verse': '恐怖の最終章',
        'Wavebreaker': 'ウェーブブレイク',
        'Terrible Hammer': '恐怖の戦鎚',
        'Terrible Blade': '恐怖の大剣',
        'Swift Shift': '高速移動',
        'Setback': '打ち払い',
        'Seabed Ceremony': '水底の儀式',
        'Scrutiny': '観察',
        'Rising Tide': '上げ潮',
        'Raging Glower': 'レイジング・グラワー',
        'Plain Weirdness': '原理不明',
        'Luminous Ray': 'ルミナスレイ',
        'Inscrutability': '意味不明',
        'Flying Fount': '飛泉',
        'Fetid Fang': '不快な牙',
        'Falling Water': '落水',
        'Explosion': '爆散',
        'Ectoplasmic Ray': 'エクトプラズミックレイ',
        'Depth Grip': 'ハンド・オブ・オーシャン',
        'Command Current': '流水',
        'Clearout': 'なぎ払い',
        'Bonebreaker': '骨砕き',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Depth Grip': '海洋之手',
        'Doxa': '信仰大堂',
        'Katharsis': '净化广场',
        'Kyklops': '克琉普斯',
        'Noesis': '概念之间',
        'Rukshs Dheem': '鲁克嘶·蒂母',
        'Sinister Bubble': '怪异泡沫',
        'Unknown': '不明物体',
      },
      'replaceText': {
        'The Final Verse': '恐怖的最终章',
        'Wavebreaker': '水波破',
        'Terrible Hammer': '恐怖的战锤',
        'Terrible Blade': '恐怖的大剑',
        'Swift Shift': '高速移动',
        'Setback': '驱赶',
        'Seabed Ceremony': '水底仪式',
        'Scrutiny': '观察',
        'Rising Tide': '涨潮',
        'Raging Glower': '暴怒注视',
        'Plain Weirdness': '原理不明',
        'Luminous Ray': '光流射线',
        'Inscrutability': '意义不明',
        'Flying Fount': '飞泉',
        'Fetid Fang': '恶臭尖牙',
        'Falling Water': '落水',
        'Explosion': '爆炸',
        'Ectoplasmic Ray': '外质射线',
        'Depth Grip': '海洋之手',
        'Command Current': '流水',
        'Clearout': '横扫',
        'Bonebreaker': '碎骨',
      },
    },
  ],
}];
