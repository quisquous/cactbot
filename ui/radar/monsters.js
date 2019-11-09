'use strict';

let Monsters = {
  'Vogaal Ja': {
    'name': {
      'en': 'Vogaal Ja',
      'cn': '丑男子 沃迦加',
      'ja': '醜男のヴォガージャ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Unktehi': {
    'name': {
      'en': 'Unktehi',
      'cn': '乌克提希',
      'ja': 'ウンクテヒ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Hellsclaw': {
    'name': {
      'en': 'Hellsclaw',
      'cn': '魔导地狱爪',
      'ja': '魔導ヘルズクロー',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Nahn': {
    'name': {
      'en': 'Nahn',
      'cn': '纳恩',
      'ja': 'ナン',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Marberry': {
    'name': {
      'en': 'Marberry',
      'cn': '玛贝利',
      'ja': 'マーベリー',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Cornu': {
    'name': {
      'en': 'Cornu',
      'cn': '角祖',
      'ja': 'コンヌ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Forneus': {
    'name': {
      'en': 'Forneus',
      'cn': '弗内乌斯',
      'ja': 'ファルネウス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Melt': {
    'name': {
      'en': 'Melt',
      'cn': '千眼凝胶',
      'ja': 'メルティゼリー',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Ghede Ti Malice': {
    'name': {
      'en': 'Ghede Ti Malice',
      'cn': '盖得',
      'ja': 'ゲーデ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Girtab': {
    'name': {
      'en': 'Girtab',
      'cn': '尾宿蛛蝎',
      'ja': 'ギルタブ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Alectryon': {
    'name': {
      'en': 'Alectryon',
      'cn': '阿列刻特利昂',
      'ja': 'アレクトリオン',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Sabotender Bailarina': {
    'name': {
      'en': 'Sabotender Bailarina',
      'cn': '花舞仙人刺',
      'ja': 'サボテンダー・バイラリーナ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Maahes': {
    'name': {
      'en': 'Maahes',
      'cn': '玛赫斯',
      'ja': 'マヘス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Zanig\'oh': {
    'name': {
      'en': 'Zanig\'oh',
      'cn': '札尼戈',
      'ja': 'ザニゴ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Dalvag\'s Final Flame': {
    'name': {
      'en': 'Dalvag\'s Final Flame',
      'cn': '菲兰德的遗火',
      'ja': 'ファイナルフレイム',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Marraco': {
    'name': {
      'en': 'Marraco',
      'cn': '马拉克',
      'ja': 'マラク',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Kurrea': {
    'name': {
      'en': 'Kurrea',
      'cn': '库雷亚',
      'ja': 'クーレア',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Mirka': {
    'name': {
      'en': 'Mirka',
      'cn': '米勒卡',
      'ja': 'ミルカ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Lyuba': {
    'name': {
      'en': 'Lyuba',
      'cn': '卢芭',
      'ja': 'リューバ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Enkelados': {
    'name': {
      'en': 'Enkelados',
      'cn': '恩克拉多斯',
      'ja': 'エンケドラス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Sisiutl': {
    'name': {
      'en': 'Sisiutl',
      'cn': '西斯尤',
      'ja': 'シシウトゥル',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Bune': {
    'name': {
      'en': 'Bune',
      'cn': '布涅',
      'ja': 'ブネ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Agathos': {
    'name': {
      'en': 'Agathos',
      'cn': '阿伽托斯',
      'ja': 'アガトス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Pylraster': {
    'name': {
      'en': 'Pylraster',
      'cn': '派拉斯特暴龙',
      'ja': 'パイルラスタ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Lord of the Wyverns': {
    'name': {
      'en': 'Lord of the Wyverns',
      'cn': '双足飞龙之王',
      'ja': 'ワイバーンロード',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Slipkinx Steeljoints': {
    'name': {
      'en': 'Slipkinx Steeljoints',
      'cn': '机工兵 斯利普金克斯',
      'ja': '機兵のスリップキンクス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Stolas': {
    'name': {
      'en': 'Stolas',
      'cn': '斯特拉斯',
      'ja': 'ストラス',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Campacti': {
    'name': {
      'en': 'Campacti',
      'cn': '坎帕提',
      'ja': 'キャムパクティ',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'stench blossom': {
    'name': {
      'en': 'stench blossom',
      'cn': '恶臭狂花',
      'ja': 'センチブロッサム',
    },
    'hp': 100000,
    'rank': 'A',
  },
  'Erle': {
    'name': {
      'en': 'Erle',
      'cn': '女王蜂',
      'ja': 'アール',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Orcus': {
    'name': {
      'en': 'Orcus',
      'cn': '奥迦斯',
      'ja': 'オルクス',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Mahisha': {
    'name': {
      'en': 'Mahisha',
      'cn': '马希沙',
      'ja': 'マヒシャ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Luminare': {
    'name': {
      'en': 'Luminare',
      'cn': '泛光晶体',
      'ja': 'ルミナーレ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Vochstein': {
    'name': {
      'en': 'Vochstein',
      'cn': '弗克施泰因',
      'ja': 'バックスタイン',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Aqrabuamelu': {
    'name': {
      'en': 'Aqrabuamelu',
      'cn': '熔骨炎蝎',
      'ja': 'アクラブアメル',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Sum': {
    'name': {
      'en': 'Sum',
      'cn': '硕姆',
      'ja': 'ソム',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Girimekhala': {
    'name': {
      'en': 'Girimekhala',
      'cn': '基里麦卡拉',
      'ja': 'ギリメカラ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Funa Yurei': {
    'name': {
      'en': 'Funa Yurei',
      'cn': '船幽灵',
      'ja': '船幽霊',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Oni Yumemi': {
    'name': {
      'en': 'Oni Yumemi',
      'cn': '鬼观梦',
      'ja': 'オニユメミ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Angada': {
    'name': {
      'en': 'Angada',
      'cn': '安迦达',
      'ja': 'アンガダ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Gajasura': {
    'name': {
      'en': 'Gajasura',
      'cn': '象魔修罗',
      'ja': 'ガジャースラ',
    },
    'hp': 1000000,
    'rank': 'A',
  },
  'Nuckelavee': {
    'name': {
      'en': 'Nuckelavee',
      'cn': '纳克拉维',
      'ja': 'ナックラヴィー',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Nariphon': {
    'name': {
      'en': 'Nariphon',
      'cn': '纳里蓬',
      'ja': 'ナリーポン',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Huracan': {
    'name': {
      'en': 'Huracan',
      'cn': '乌拉坎',
      'ja': 'フラカン',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Li\'l Murderer': {
    'name': {
      'en': 'Li\'l Murderer',
      'cn': '小小杀手',
      'ja': 'リルマーダー',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Sugaar': {
    'name': {
      'en': 'Sugaar',
      'cn': '休格尔',
      'ja': 'シュガール',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Maliktender': {
    'name': {
      'en': 'Maliktender',
      'cn': '马利克巨人掌',
      'ja': 'マリクテンダー',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'the mudman': {
    'name': {
      'en': 'the mudman',
      'cn': '泥人',
      'ja': '泥人',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'O Poorest Pauldia': {
    'name': {
      'en': 'O Poorest Pauldia',
      'cn': '保尔迪雅',
      'ja': 'ポールディア',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Grassman': {
    'name': {
      'en': 'Grassman',
      'cn': '格拉斯曼',
      'ja': 'グラスマン',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Supay': {
    'name': {
      'en': 'Supay',
      'cn': '苏帕伊',
      'ja': 'スペイ',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Rusalka': {
    'name': {
      'en': 'Rusalka',
      'cn': '卢莎卡',
      'ja': 'ルサルカ',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Baal': {
    'name': {
      'en': 'Baal',
      'cn': '巴力',
      'ja': 'バール',
    },
    'hp': 10000000,
    'rank': 'A',
  },
  'Croque-mitaine': {
    'name': {
      'en': 'Croque-mitaine',
      'cn': '护土精灵',
      'ja': 'クロック・ミテーヌ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Croakadile': {
    'name': {
      'en': 'Croakadile',
      'cn': '咕尔呱洛斯',
      'ja': 'ケロゲロス',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'the Garlok': {
    'name': {
      'en': 'the Garlok',
      'cn': '伽洛克',
      'ja': 'ガーロック',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Bonnacon': {
    'name': {
      'en': 'Bonnacon',
      'cn': '火愤牛',
      'ja': 'ボナコン',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Nandi': {
    'name': {
      'en': 'Nandi',
      'cn': '南迪',
      'ja': 'ナンディ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Chernobog': {
    'name': {
      'en': 'Chernobog',
      'cn': '牛头黑神',
      'ja': 'チェルノボーグ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Laideronnette': {
    'name': {
      'en': 'Laideronnette',
      'cn': '雷德罗巨蛇',
      'ja': 'レドロネット',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Wulgaru': {
    'name': {
      'en': 'Wulgaru',
      'cn': '乌尔伽鲁',
      'ja': 'ウルガル',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'mindflayer': {
    'name': {
      'en': 'mindflayer',
      'cn': '夺心魔',
      'ja': 'マインドフレア',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Thousand-cast Theda': {
    'name': {
      'en': 'Thousand-cast Theda',
      'cn': '千竿口花希达',
      'ja': 'サウザンドキャスト・セダ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Zona Seeker': {
    'name': {
      'en': 'Zona Seeker',
      'cn': '虚无探索者',
      'ja': 'ゾーナ・シーカー',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Brontes': {
    'name': {
      'en': 'Brontes',
      'cn': '布隆特斯',
      'ja': 'ブロンテス',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Lampalagua': {
    'name': {
      'en': 'Lampalagua',
      'cn': '巴拉乌尔',
      'ja': 'バルウール',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Nunyunuwi': {
    'name': {
      'en': 'Nunyunuwi',
      'cn': '努纽努维',
      'ja': 'ヌニュヌウィ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Minhocao': {
    'name': {
      'en': 'Minhocao',
      'cn': '蚓螈巨虫',
      'ja': 'ミニョーカオン',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Safat': {
    'name': {
      'en': 'Safat',
      'cn': '萨法特',
      'ja': 'サファト',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Agrippa the Mighty': {
    'name': {
      'en': 'Agrippa the Mighty',
      'cn': '阿格里帕',
      'ja': 'アグリッパ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Gandarewa': {
    'name': {
      'en': 'Gandarewa',
      'cn': '刚德瑞瓦',
      'ja': 'ガンダルヴァ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Senmurv': {
    'name': {
      'en': 'Senmurv',
      'cn': '神穆尔鸟',
      'ja': 'セーンムルウ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'the Pale Rider': {
    'name': {
      'en': 'the Pale Rider',
      'cn': '苍白骑士',
      'ja': 'ペイルライダー',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Leucrotta': {
    'name': {
      'en': 'Leucrotta',
      'cn': '卢克洛塔',
      'ja': 'レウクロッタ',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'kaiser behemoth': {
    'name': {
      'en': 'kaiser behemoth',
      'cn': '凯撒贝希摩斯',
      'ja': 'カイザーベヒーモス',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Bird of Paradise': {
    'name': {
      'en': 'Bird of Paradise',
      'cn': '极乐鸟',
      'ja': '極楽鳥',
    },
    'hp': 1000000,
    'rank': 'S',
  },
  'Gamma': {
    'name': {
      'en': 'Gamma',
      'cn': '伽马',
      'ja': 'ガンマ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Okina': {
    'name': {
      'en': 'Okina',
      'cn': '巨大鳐',
      'ja': 'オキナ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Salt and Light': {
    'name': {
      'en': 'Salt and Light',
      'cn': '盐和光',
      'ja': 'ソルト・アンド・ライト',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Orghana': {
    'name': {
      'en': 'Orghana',
      'cn': '兀鲁忽乃朝鲁',
      'ja': 'オルガナ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Bone Crawler': {
    'name': {
      'en': 'Bone Crawler',
      'cn': '爬骨怪龙',
      'ja': 'ボーンクローラー',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Udumbara': {
    'name': {
      'en': 'Udumbara',
      'cn': '优昙婆罗花',
      'ja': 'ウドンゲ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Ixtab': {
    'name': {
      'en': 'Ixtab',
      'cn': '伊休妲',
      'ja': 'イシュタム',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Gunitt': {
    'name': {
      'en': 'Gunitt',
      'cn': '顾尼图',
      'ja': 'グニット',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'Aglaope': {
    'name': {
      'en': 'Aglaope',
      'cn': '阿格拉俄珀',
      'ja': 'アグラオペ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'forgiven rebellion': {
    'name': {
      'en': 'forgiven rebellion',
      'cn': '得到宽恕的叛乱',
      'ja': 'フォーギヴン・リベリオン',
    },
    'hp': 10000000,
    'rank': 'S',
  },
  'forgiven gossip': {
    'name': {
      'en': 'forgiven gossip',
      'cn': '得到宽恕的流言',
      'ja': 'フォーギヴン・ゴシップ',
    },
    'hp': 10000000,
    'rank': 'S',
  },
};
