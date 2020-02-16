'use strict';

// O1S - Deltascape 1.0 Savage
[{
  zoneRegex: /^Deltascape V1\.0 \(Savage\)$/,
  timelineFile: 'o1s.txt',
  triggers: [
    {
      id: 'O1S Blaze',
      regex: Regexes.startsUsing({ id: '1EDD', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1EDD', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1EDD', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1EDD', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1EDD', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1EDD', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Blaze: Stack up',
        de: 'Flamme: Stacken',
      },
      tts: {
        en: 'stack',
        de: 'stek',
      },
    },
    {
      id: 'O1S Breath Wing',
      regex: Regexes.startsUsing({ id: '1ED6', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1ED6', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1ED6', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1ED6', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1ED6', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1ED6', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Breath Wing: Be beside boss',
        de: 'Atemschwinge: Neben Boss gehen',
      },
      tts: {
        en: 'breath wing',
        de: 'atemschwinge',
      },
    },
    {
      id: 'O1S Clamp',
      regex: Regexes.startsUsing({ id: '1EDE', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1EDE', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1EDE', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1EDE', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1EDE', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1EDE', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Clamp: Get out of front',
        de: 'Klammer: Vorm Boss weg',
      },
      tts: {
        en: 'clamp',
        de: 'klammer',
      },
    },
    {
      id: 'O1S Downburst',
      regex: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1ED8', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1ED8', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1ED8', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Downburst: Knockback',
        de: 'Fallböe: Rückstoß',
      },
      tts: {
        en: 'knockback',
        de: 'rückstoß',
      },
    },
    {
      id: 'O1S Roar',
      regex: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1ED8', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1ED8', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1ED8', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Roar: AOE damage',
        de: 'Brüllen: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
    {
      id: 'O1S Charybdis',
      regex: Regexes.startsUsing({ id: '1ED4', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1ED4', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1ED4', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1ED4', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1ED4', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1ED4', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Charybdis: AOE damage',
        de: 'Charybdis: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Alte Roite': 'Alte Roite',
        'Black Hole': 'Schwarzes Loch',
        'Exdeath': 'Exdeath',
        'Wyrm Tail': 'Antiker Drachenschweif',
      },
      'replaceText': {
        '(safe)': '(safe)', // FIXME
        '(spread)': '(spread)', // FIXME
        '(stack)': '(stack)', // FIXME
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Black Hole': 'Schwarzes Loch',
        'Black Spark': 'Schwarzer Funke',
        'Blaze': 'Flamme',
        'Blizzard III': 'Eisga',
        'Breath Wing': 'Atemschwinge',
        'Charybdis': 'Charybdis',
        'Clamp': 'Klammer',
        'Classical': 'Classical', // FIXME
        'Clearout': 'Kreisfeger',
        'Collision': 'Aufprall',
        'Doom': 'Verhängnis',
        'Downburst': 'Fallböe',
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Holy': 'Sanctus',
        'Inner Fireballs': 'Inner Fireballs', // FIXME
        'Levinbolt': 'Keraunisches Feld',
        'Meteor': 'Meteo',
        'Outer Fireballs': 'Outer Fireballs', // FIXME
        'Roar': 'Brüllen',
        'Teleport': 'Teleport',
        'The Decisive Battle': 'Entscheidungsschlacht',
        'Thin Ice': 'Glatteis',
        'Thunder III': 'Blitzga',
        'Twin Bolt': 'Zwillingsschlag',
        'Unknown Ability': 'Unknown Ability', // FIXME
        'Vacuum Wave': 'Vakuumwelle',
        'Wyrm Tail': 'Antiker Drachenschweif',
        'Zombie Breath': 'Zombie-Atem',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Lightning Resistance Down': 'Blitzresistenz -',
        'Paralysis': 'Paralyse',
        'Pyretic': 'Hitze',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Alte Roite': 'Alte Roite',
        'Black Hole': 'Trou noir',
        'Exdeath': 'Exdeath',
        'Wyrm Tail': 'Queue du dragon ancestral',
      },
      'replaceText': {
        '(safe)': '(safe)', // FIXME
        '(spread)': '(spread)', // FIXME
        '(stack)': '(stack)', // FIXME
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Black Hole': 'Trou noir',
        'Black Spark': 'Étincelle noire',
        'Blaze': 'Fournaise',
        'Blizzard III': 'Méga Glace',
        'Breath Wing': 'Aile déferlante',
        'Charybdis': 'Charybde',
        'Clamp': 'Pinçage',
        'Classical': 'Classical', // FIXME
        'Clearout': 'Fauchage',
        'Collision': 'Impact',
        'Doom': 'Glas',
        'Downburst': 'Rafale descendante',
        'Fire III': 'Méga Feu',
        'Flare': 'Brasier',
        'Holy': 'Miracle',
        'Inner Fireballs': 'Inner Fireballs', // FIXME
        'Levinbolt': 'Fulguration',
        'Meteor': 'Météore',
        'Outer Fireballs': 'Outer Fireballs', // FIXME
        'Roar': 'Rugissement',
        'Teleport': 'Téléportation',
        'The Decisive Battle': 'Combat décisif',
        'Thin Ice': 'Verglas',
        'Thunder III': 'Méga Foudre',
        'Twin Bolt': 'Éclairs jumeaux',
        'Unknown Ability': 'Unknown Ability', // FIXME
        'Vacuum Wave': 'Vague de vide',
        'Wyrm Tail': 'Queue du dragon ancestral',
        'Zombie Breath': 'Haleine zombie',
      },
      '~effectNames': {
        'Bleeding': 'Saignement',
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Lightning Resistance Down': 'Résistance à la foudre réduite',
        'Paralysis': 'Paralysie',
        'Pyretic': 'Ardeur',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Alte Roite': 'アルテ・ロイテ',
        'Black Hole': 'ブラックホール',
        'Exdeath': 'エクスデス',
        'Wyrm Tail': '太古の龍尾',
      },
      'replaceText': {
        '(safe)': '(safe)', // FIXME
        '(spread)': '(spread)', // FIXME
        '(stack)': '(stack)', // FIXME
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Black Hole': 'ブラックホール',
        'Black Spark': 'ブラックスパーク',
        'Blaze': '火炎',
        'Blizzard III': 'ブリザガ',
        'Breath Wing': 'ブレスウィング',
        'Charybdis': 'ミールストーム',
        'Clamp': 'クランプ',
        'Classical': 'Classical', // FIXME
        'Clearout': 'なぎ払い',
        'Collision': '衝撃',
        'Doom': '死の宣告',
        'Downburst': 'ダウンバースト',
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Holy': 'ホーリー',
        'Inner Fireballs': 'Inner Fireballs', // FIXME
        'Levinbolt': '稲妻',
        'Meteor': 'メテオ',
        'Outer Fireballs': 'Outer Fireballs', // FIXME
        'Roar': '咆哮',
        'Teleport': 'テレポ',
        'The Decisive Battle': '決戦',
        'Thin Ice': '氷床',
        'Thunder III': 'サンダガ',
        'Twin Bolt': 'ツインボルト',
        'Unknown Ability': 'Unknown Ability', // FIXME
        'Vacuum Wave': '真空波',
        'Wyrm Tail': '太古の龍尾',
        'Zombie Breath': 'ゾンビブレス',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Deep Freeze': '氷結',
        'Doom': '死の宣告',
        'Lightning Resistance Down': '雷属性耐性低下',
        'Paralysis': '麻痺',
        'Pyretic': 'ヒート',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Alte Roite': '老者',
        'Black Hole': '黑洞',
        'Exdeath': '艾克斯迪司',
        'Wyrm Tail': '太古龙尾',
      },
      'replaceText': {
        '(safe)': '(safe)', // FIXME
        '(spread)': '(spread)', // FIXME
        '(stack)': '(stack)', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Black Hole': '黑洞',
        'Black Spark': '黑洞',
        'Blaze': '炎爆',
        'Blizzard III': '冰封',
        'Breath Wing': '风息之翼',
        'Charybdis': '大漩涡',
        'Clamp': '压迫',
        'Classical': 'Classical', // FIXME
        'Clearout': '横扫',
        'Collision': '冲击',
        'Doom': '死亡宣告',
        'Downburst': '下行突风',
        'Fire III': '爆炎',
        'Flare': '核爆',
        'Holy': '神圣',
        'Inner Fireballs': 'Inner Fireballs', // FIXME
        'Levinbolt': '闪电',
        'Meteor': '陨石',
        'Outer Fireballs': 'Outer Fireballs', // FIXME
        'Roar': '咆啸',
        'Teleport': '传送',
        'The Decisive Battle': '决战',
        'Thin Ice': '冰面',
        'Thunder III': '暴雷',
        'Twin Bolt': '双重落雷',
        'Unknown Ability': 'Unknown Ability', // FIXME
        'Vacuum Wave': '真空波',
        'Wyrm Tail': '太古龙尾',
        'Zombie Breath': '死亡吐息',
      },
      '~effectNames': {
        'Bleeding': '出血',
        'Deep Freeze': '冻结',
        'Doom': '死亡宣告',
        'Lightning Resistance Down': '雷属性耐性降低',
        'Paralysis': '麻痹',
        'Pyretic': '', // FIXME
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Alte Roite': '알테 로이테',
        'Black Hole': '블랙홀',
        'Exdeath': '엑스데스',
        'Wyrm Tail': '태고의 용 꼬리',
      },
      'replaceText': {
        '(safe)': '(safe)', // FIXME
        '(spread)': '(spread)', // FIXME
        '(stack)': '(stack)', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Black Hole': '블랙홀',
        'Black Spark': '검은 불꽃',
        'Blaze': '화염',
        'Blizzard III': '블리자가',
        'Breath Wing': '날개바람',
        'Charybdis': '대소용돌이',
        'Clamp': '압박',
        'Classical': 'Classical', // FIXME
        'Clearout': '휩쓸기',
        'Collision': '충격',
        'Doom': '죽음의 선고',
        'Downburst': '하강 기류',
        'Fire III': '파이가',
        'Flare': '플레어',
        'Holy': '홀리',
        'Inner Fireballs': 'Inner Fireballs', // FIXME
        'Levinbolt': '우레',
        'Meteor': '메테오',
        'Outer Fireballs': 'Outer Fireballs', // FIXME
        'Roar': '포효',
        'Teleport': '텔레포',
        'The Decisive Battle': '결전',
        'Thin Ice': '얼음 바닥',
        'Thunder III': '선더가',
        'Twin Bolt': '이중 낙뢰',
        'Unknown Ability': 'Unknown Ability', // FIXME
        'Vacuum Wave': '진공파',
        'Wyrm Tail': '태고의 용 꼬리',
        'Zombie Breath': '좀비 숨결',
      },
      '~effectNames': {
        'Bleeding': '고통',
        'Deep Freeze': '빙결',
        'Doom': '죽음의 선고',
        'Lightning Resistance Down': '번개속성 저항 감소',
        'Paralysis': '마비',
        'Pyretic': '', // FIXME
      },
    },
  ],
}];
