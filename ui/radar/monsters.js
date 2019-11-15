'use strict';

let Monsters = {
  'Vogaal Ja': {
    'name': {
      'en': 'Vogaal Ja',
      'cn': '丑男子 沃迦加',
      'ja': '醜男のヴォガージャ',
    },
    'rank': 'A',
  },
  'Unktehi': {
    'name': {
      'en': 'Unktehi',
      'cn': '乌克提希',
      'ja': 'ウンクテヒ',
    },
    'rank': 'A',
  },
  'Hellsclaw': {
    'name': {
      'en': 'Hellsclaw',
      'cn': '魔导地狱爪',
      'ja': '魔導ヘルズクロー',
    },
    'rank': 'A',
  },
  'Nahn': {
    'name': {
      'en': 'Nahn',
      'cn': '纳恩',
      'ja': 'ナン',
    },
    'rank': 'A',
  },
  'Marberry': {
    'name': {
      'en': 'Marberry',
      'cn': '玛贝利',
      'ja': 'マーベリー',
    },
    'rank': 'A',
  },
  'Cornu': {
    'name': {
      'en': 'Cornu',
      'cn': '角祖',
      'ja': 'コンヌ',
    },
    'rank': 'A',
  },
  'Forneus': {
    'name': {
      'en': 'Forneus',
      'cn': '弗内乌斯',
      'ja': 'ファルネウス',
    },
    'rank': 'A',
  },
  'Melt': {
    'name': {
      'en': 'Melt',
      'cn': '千眼凝胶',
      'ja': 'メルティゼリー',
    },
    'rank': 'A',
  },
  'Ghede Ti Malice': {
    'name': {
      'en': 'Ghede Ti Malice',
      'cn': '盖得',
      'ja': 'ゲーデ',
    },
    'rank': 'A',
  },
  'Girtab': {
    'name': {
      'en': 'Girtab',
      'cn': '尾宿蛛蝎',
      'ja': 'ギルタブ',
    },
    'rank': 'A',
  },
  'Alectryon': {
    'name': {
      'en': 'Alectryon',
      'cn': '阿列刻特利昂',
      'ja': 'アレクトリオン',
    },
    'rank': 'A',
  },
  'Sabotender Bailarina': {
    'name': {
      'en': 'Sabotender Bailarina',
      'cn': '花舞仙人刺',
      'ja': 'サボテンダー・バイラリーナ',
    },
    'rank': 'A',
  },
  'Maahes': {
    'name': {
      'en': 'Maahes',
      'cn': '玛赫斯',
      'ja': 'マヘス',
    },
    'rank': 'A',
  },
  'Zanig\'oh': {
    'name': {
      'en': 'Zanig\'oh',
      'cn': '札尼戈',
      'ja': 'ザニゴ',
    },
    'rank': 'A',
  },
  'Dalvag\'s Final Flame': {
    'name': {
      'en': 'Dalvag\'s Final Flame',
      'cn': '菲兰德的遗火',
      'ja': 'ファイナルフレイム',
    },
    'rank': 'A',
  },
  'Marraco': {
    'name': {
      'en': 'Marraco',
      'cn': '马拉克',
      'ja': 'マラク',
    },
    'rank': 'A',
  },
  'Kurrea': {
    'name': {
      'en': 'Kurrea',
      'cn': '库雷亚',
      'ja': 'クーレア',
    },
    'rank': 'A',
  },
  'Mirka': {
    'name': {
      'en': 'Mirka',
      'cn': '米勒卡',
      'ja': 'ミルカ',
    },
    'rank': 'A',
  },
  'Lyuba': {
    'name': {
      'en': 'Lyuba',
      'cn': '卢芭',
      'ja': 'リューバ',
    },
    'rank': 'A',
  },
  'Enkelados': {
    'name': {
      'en': 'Enkelados',
      'cn': '恩克拉多斯',
      'ja': 'エンケドラス',
    },
    'rank': 'A',
  },
  'Sisiutl': {
    'name': {
      'en': 'Sisiutl',
      'cn': '西斯尤',
      'ja': 'シシウトゥル',
    },
    'rank': 'A',
  },
  'Bune': {
    'name': {
      'en': 'Bune',
      'cn': '布涅',
      'ja': 'ブネ',
    },
    'rank': 'A',
  },
  'Agathos': {
    'name': {
      'en': 'Agathos',
      'cn': '阿伽托斯',
      'ja': 'アガトス',
    },
    'rank': 'A',
  },
  'Pylraster': {
    'name': {
      'en': 'Pylraster',
      'cn': '派拉斯特暴龙',
      'ja': 'パイルラスタ',
    },
    'rank': 'A',
  },
  'Lord of the Wyverns': {
    'name': {
      'en': 'Lord of the Wyverns',
      'cn': '双足飞龙之王',
      'ja': 'ワイバーンロード',
    },
    'rank': 'A',
  },
  'Slipkinx Steeljoints': {
    'name': {
      'en': 'Slipkinx Steeljoints',
      'cn': '机工兵 斯利普金克斯',
      'ja': '機兵のスリップキンクス',
    },
    'rank': 'A',
  },
  'Stolas': {
    'name': {
      'en': 'Stolas',
      'cn': '斯特拉斯',
      'ja': 'ストラス',
    },
    'rank': 'A',
  },
  'Campacti': {
    'name': {
      'en': 'Campacti',
      'cn': '坎帕提',
      'ja': 'キャムパクティ',
    },
    'rank': 'A',
  },
  'stench blossom': {
    'name': {
      'en': 'stench blossom',
      'cn': '恶臭狂花',
      'ja': 'センチブロッサム',
    },
    'rank': 'A',
  },
  'Erle': {
    'name': {
      'en': 'Erle',
      'cn': '女王蜂',
      'ja': 'アール',
    },
    'rank': 'A',
  },
  'Orcus': {
    'name': {
      'en': 'Orcus',
      'cn': '奥迦斯',
      'ja': 'オルクス',
    },
    'rank': 'A',
  },
  'Mahisha': {
    'name': {
      'en': 'Mahisha',
      'cn': '马希沙',
      'ja': 'マヒシャ',
    },
    'rank': 'A',
  },
  'Luminare': {
    'name': {
      'en': 'Luminare',
      'cn': '泛光晶体',
      'ja': 'ルミナーレ',
    },
    'rank': 'A',
  },
  'Vochstein': {
    'name': {
      'en': 'Vochstein',
      'cn': '弗克施泰因',
      'ja': 'バックスタイン',
    },
    'rank': 'A',
  },
  'Aqrabuamelu': {
    'name': {
      'en': 'Aqrabuamelu',
      'cn': '熔骨炎蝎',
      'ja': 'アクラブアメル',
    },
    'rank': 'A',
  },
  'Sum': {
    'name': {
      'en': 'Sum',
      'cn': '硕姆',
      'ja': 'ソム',
    },
    'rank': 'A',
  },
  'Girimekhala': {
    'name': {
      'en': 'Girimekhala',
      'cn': '基里麦卡拉',
      'ja': 'ギリメカラ',
    },
    'rank': 'A',
  },
  'Funa Yurei': {
    'name': {
      'en': 'Funa Yurei',
      'cn': '船幽灵',
      'ja': '船幽霊',
    },
    'rank': 'A',
  },
  'Oni Yumemi': {
    'name': {
      'en': 'Oni Yumemi',
      'cn': '鬼观梦',
      'ja': 'オニユメミ',
    },
    'rank': 'A',
  },
  'Angada': {
    'name': {
      'en': 'Angada',
      'cn': '安迦达',
      'ja': 'アンガダ',
    },
    'rank': 'A',
  },
  'Gajasura': {
    'name': {
      'en': 'Gajasura',
      'cn': '象魔修罗',
      'ja': 'ガジャースラ',
    },
    'rank': 'A',
  },
  'Nuckelavee': {
    'name': {
      'en': 'Nuckelavee',
      'cn': '纳克拉维',
      'ja': 'ナックラヴィー',
    },
    'rank': 'A',
  },
  'Nariphon': {
    'name': {
      'en': 'Nariphon',
      'cn': '纳里蓬',
      'ja': 'ナリーポン',
    },
    'rank': 'A',
  },
  'Huracan': {
    'name': {
      'en': 'Huracan',
      'cn': '乌拉坎',
      'ja': 'フラカン',
    },
    'rank': 'A',
  },
  'Li\'l Murderer': {
    'name': {
      'en': 'Li\'l Murderer',
      'cn': '小小杀手',
      'ja': 'リルマーダー',
    },
    'rank': 'A',
  },
  'Sugaar': {
    'name': {
      'en': 'Sugaar',
      'cn': '休格尔',
      'ja': 'シュガール',
    },
    'rank': 'A',
  },
  'Maliktender': {
    'name': {
      'en': 'Maliktender',
      'cn': '马利克巨人掌',
      'ja': 'マリクテンダー',
    },
    'rank': 'A',
  },
  'the mudman': {
    'name': {
      'en': 'the mudman',
      'cn': '泥人',
      'ja': '泥人',
    },
    'rank': 'A',
  },
  'O Poorest Pauldia': {
    'name': {
      'en': 'O Poorest Pauldia',
      'cn': '保尔迪雅',
      'ja': 'ポールディア',
    },
    'rank': 'A',
  },
  'Grassman': {
    'name': {
      'en': 'Grassman',
      'cn': '格拉斯曼',
      'ja': 'グラスマン',
    },
    'rank': 'A',
  },
  'Supay': {
    'name': {
      'en': 'Supay',
      'cn': '苏帕伊',
      'ja': 'スペイ',
    },
    'rank': 'A',
  },
  'Rusalka': {
    'name': {
      'en': 'Rusalka',
      'cn': '卢莎卡',
      'ja': 'ルサルカ',
    },
    'rank': 'A',
  },
  'Baal': {
    'name': {
      'en': 'Baal',
      'cn': '巴力',
      'ja': 'バール',
    },
    'rank': 'A',
  },
  'Croque-mitaine': {
    'name': {
      'en': 'Croque-mitaine',
      'cn': '护土精灵',
      'ja': 'クロック・ミテーヌ',
    },
    'rank': 'S',
  },
  'Croakadile': {
    'name': {
      'en': 'Croakadile',
      'cn': '咕尔呱洛斯',
      'ja': 'ケロゲロス',
    },
    'rank': 'S',
  },
  'the Garlok': {
    'name': {
      'en': 'the Garlok',
      'cn': '伽洛克',
      'ja': 'ガーロック',
    },
    'rank': 'S',
  },
  'Bonnacon': {
    'name': {
      'en': 'Bonnacon',
      'cn': '火愤牛',
      'ja': 'ボナコン',
    },
    'rank': 'S',
  },
  'Nandi': {
    'name': {
      'en': 'Nandi',
      'cn': '南迪',
      'ja': 'ナンディ',
    },
    'rank': 'S',
  },
  'Chernobog': {
    'name': {
      'en': 'Chernobog',
      'cn': '牛头黑神',
      'ja': 'チェルノボーグ',
    },
    'rank': 'S',
  },
  'Laideronnette': {
    'name': {
      'en': 'Laideronnette',
      'cn': '雷德罗巨蛇',
      'ja': 'レドロネット',
    },
    'rank': 'S',
  },
  'Wulgaru': {
    'name': {
      'en': 'Wulgaru',
      'cn': '乌尔伽鲁',
      'ja': 'ウルガル',
    },
    'rank': 'S',
  },
  'mindflayer': {
    'name': {
      'en': 'mindflayer',
      'cn': '夺心魔',
      'ja': 'マインドフレア',
    },
    'rank': 'S',
  },
  'Thousand-cast Theda': {
    'name': {
      'en': 'Thousand-cast Theda',
      'cn': '千竿口花希达',
      'ja': 'サウザンドキャスト・セダ',
    },
    'rank': 'S',
  },
  'Zona Seeker': {
    'name': {
      'en': 'Zona Seeker',
      'cn': '虚无探索者',
      'ja': 'ゾーナ・シーカー',
    },
    'rank': 'S',
  },
  'Brontes': {
    'name': {
      'en': 'Brontes',
      'cn': '布隆特斯',
      'ja': 'ブロンテス',
    },
    'rank': 'S',
  },
  'Lampalagua': {
    'name': {
      'en': 'Lampalagua',
      'cn': '巴拉乌尔',
      'ja': 'バルウール',
    },
    'rank': 'S',
  },
  'Nunyunuwi': {
    'name': {
      'en': 'Nunyunuwi',
      'cn': '努纽努维',
      'ja': 'ヌニュヌウィ',
    },
    'rank': 'S',
  },
  'Minhocao': {
    'name': {
      'en': 'Minhocao',
      'cn': '蚓螈巨虫',
      'ja': 'ミニョーカオン',
    },
    'rank': 'S',
  },
  'Safat': {
    'name': {
      'en': 'Safat',
      'cn': '萨法特',
      'ja': 'サファト',
    },
    'rank': 'S',
  },
  'Agrippa the Mighty': {
    'name': {
      'en': 'Agrippa the Mighty',
      'cn': '阿格里帕',
      'ja': 'アグリッパ',
    },
    'rank': 'S',
  },
  'Gandarewa': {
    'name': {
      'en': 'Gandarewa',
      'cn': '刚德瑞瓦',
      'ja': 'ガンダルヴァ',
    },
    'rank': 'S',
  },
  'Senmurv': {
    'name': {
      'en': 'Senmurv',
      'cn': '神穆尔鸟',
      'ja': 'セーンムルウ',
    },
    'rank': 'S',
  },
  'the Pale Rider': {
    'name': {
      'en': 'the Pale Rider',
      'cn': '苍白骑士',
      'ja': 'ペイルライダー',
    },
    'rank': 'S',
  },
  'Leucrotta': {
    'name': {
      'en': 'Leucrotta',
      'cn': '卢克洛塔',
      'ja': 'レウクロッタ',
    },
    'rank': 'S',
  },
  'kaiser behemoth': {
    'name': {
      'en': 'kaiser behemoth',
      'cn': '凯撒贝希摩斯',
      'ja': 'カイザーベヒーモス',
    },
    'rank': 'S',
  },
  'Bird of Paradise': {
    'name': {
      'en': 'Bird of Paradise',
      'cn': '极乐鸟',
      'ja': '極楽鳥',
    },
    'rank': 'S',
  },
  'Gamma': {
    'name': {
      'en': 'Gamma',
      'cn': '伽马',
      'ja': 'ガンマ',
    },
    'rank': 'S',
  },
  'Okina': {
    'name': {
      'en': 'Okina',
      'cn': '巨大鳐',
      'ja': 'オキナ',
    },
    'rank': 'S',
  },
  'Salt and Light': {
    'name': {
      'en': 'Salt and Light',
      'cn': '盐和光',
      'ja': 'ソルト・アンド・ライト',
    },
    'rank': 'S',
  },
  'Orghana': {
    'name': {
      'en': 'Orghana',
      'cn': '兀鲁忽乃朝鲁',
      'ja': 'オルガナ',
    },
    'rank': 'S',
  },
  'Bone Crawler': {
    'name': {
      'en': 'Bone Crawler',
      'cn': '爬骨怪龙',
      'ja': 'ボーンクローラー',
    },
    'rank': 'S',
  },
  'Udumbara': {
    'name': {
      'en': 'Udumbara',
      'cn': '优昙婆罗花',
      'ja': 'ウドンゲ',
    },
    'rank': 'S',
  },
  'Ixtab': {
    'name': {
      'en': 'Ixtab',
      'cn': '伊休妲',
      'ja': 'イシュタム',
    },
    'rank': 'S',
  },
  'Gunitt': {
    'name': {
      'en': 'Gunitt',
      'cn': '顾尼图',
      'ja': 'グニット',
    },
    'rank': 'S',
  },
  'Aglaope': {
    'name': {
      'en': 'Aglaope',
      'cn': '阿格拉俄珀',
      'ja': 'アグラオペ',
    },
    'rank': 'S',
  },
  'forgiven rebellion': {
    'name': {
      'en': 'forgiven rebellion',
      'cn': '得到宽恕的叛乱',
      'ja': 'フォーギヴン・リベリオン',
    },
    'rank': 'S',
  },
  'forgiven gossip': {
    'name': {
      'en': 'forgiven gossip',
      'cn': '得到宽恕的流言',
      'ja': 'フォーギヴン・ゴシップ',
    },
    'rank': 'S',
  },
  'Naul': {
    'name': {
      'en': 'Naul',
      'cn': '纳乌尔',
      'ja': 'ナウル',
    },
    'rank': 'B',
  },
  'Dark Helmet': {
    'name': {
      'en': 'Dark Helmet',
      'cn': '暗盔魔蟹',
      'ja': 'ダークヘルメット',
    },
    'rank': 'B',
  },
  'Myradrosh': {
    'name': {
      'en': 'Myradrosh',
      'cn': '米腊德罗斯蜂鸟',
      'ja': 'ミラドロッシュ',
    },
    'rank': 'B',
  },
  'Barbastelle': {
    'name': {
      'en': 'Barbastelle',
      'cn': '宽耳凶蝠',
      'ja': 'バーバステル',
    },
    'rank': 'B',
  },
  'Stinging Sophie': {
    'name': {
      'en': 'Stinging Sophie',
      'cn': '击刺魔蜂索菲',
      'ja': 'スティンギング・ソフィー',
    },
    'rank': 'B',
  },
  'Monarch Ogrefly': {
    'name': {
      'en': 'Monarch Ogrefly',
      'cn': '君王鬼蜻蜓',
      'ja': 'モナーク・オーガフライ',
    },
    'rank': 'B',
  },
  'Skogs Fru': {
    'name': {
      'en': 'Skogs Fru',
      'cn': '花林女郎',
      'ja': 'スコッグ・フリュー',
    },
    'rank': 'B',
  },
  'Ovjang': {
    'name': {
      'en': 'Ovjang',
      'cn': '奥弗杰恩',
      'ja': 'アヴゼン',
    },
    'rank': 'B',
  },
  'Flame Sergeant Dalvag': {
    'name': {
      'en': 'Flame Sergeant Dalvag',
      'cn': '永恒不灭的菲兰德副耀士',
      'ja': '不滅のフェランド闘軍曹',
    },
    'rank': 'B',
  },
  'Albin the Ashen': {
    'name': {
      'en': 'Albin the Ashen',
      'cn': '死灰复燃的阿尔宾',
      'ja': '死灰のアルビン',
    },
    'rank': 'B',
  },
  'Vuokho': {
    'name': {
      'en': 'Vuokho',
      'cn': '巫刻猎鹫',
      'ja': 'ヴオコー',
    },
    'rank': 'B',
  },
  'Leech King': {
    'name': {
      'en': 'Leech King',
      'cn': '水蛭王',
      'ja': 'リーチキング',
    },
    'rank': 'B',
  },
  'Sewer Syrup': {
    'name': {
      'en': 'Sewer Syrup',
      'cn': '阴沟毒液',
      'ja': 'スェアーシロップ',
    },
    'rank': 'B',
  },
  'Gatling': {
    'name': {
      'en': 'Gatling',
      'cn': '加特林针鼹',
      'ja': 'ガトリングス',
    },
    'rank': 'B',
  },
  'Bloody Mary': {
    'name': {
      'en': 'Bloody Mary',
      'cn': '血腥玛丽',
      'ja': 'ブラッディ・マリー',
    },
    'rank': 'B',
  },
  'Phecda': {
    'name': {
      'en': 'Phecda',
      'cn': '天玑巨熊',
      'ja': 'フェクダ',
    },
    'rank': 'B',
  },
  'White Joker': {
    'name': {
      'en': 'White Joker',
      'cn': '白鬼鼠王',
      'ja': 'ホワイトジョーカー',
    },
    'rank': 'B',
  },
  'Alteci': {
    'name': {
      'en': 'Alteci',
      'cn': '阿尔提克',
      'ja': 'アルティック',
    },
    'rank': 'B',
  },
  'Kreutzet': {
    'name': {
      'en': 'Kreutzet',
      'cn': '克鲁泽',
      'ja': 'クルーゼ',
    },
    'rank': 'B',
  },
  'Squonk': {
    'name': {
      'en': 'Squonk',
      'cn': '斯奎克',
      'ja': 'スクオンク',
    },
    'rank': 'B',
  },
  'Sanu Vali of Dancing Wings': {
    'name': {
      'en': 'Sanu Vali of Dancing Wings',
      'cn': '飞舞翼 萨努瓦力',
      'ja': '舞手のサヌバリ',
    },
    'rank': 'B',
  },
  'Scitalis': {
    'name': {
      'en': 'Scitalis',
      'cn': '斯奇塔利斯',
      'ja': 'スキタリス',
    },
    'rank': 'B',
  },
  'the Scarecrow': {
    'name': {
      'en': 'the Scarecrow',
      'cn': '惊慌稻草龙',
      'ja': 'スケアクロウ',
    },
    'rank': 'B',
  },
  'Gnath cometdrone': {
    'name': {
      'en': 'Gnath cometdrone',
      'cn': '骨颌彗星兵',
      'ja': 'グナース・コメットドローン',
    },
    'rank': 'B',
  },
  'Thextera': {
    'name': {
      'en': 'Thextera',
      'cn': '提克斯塔',
      'ja': 'テクスタ',
    },
    'rank': 'B',
  },
  'Pterygotus': {
    'name': {
      'en': 'Pterygotus',
      'cn': '翼肢鲎',
      'ja': 'プテリゴトゥス',
    },
    'rank': 'B',
  },
  'false gigantopithecus': {
    'name': {
      'en': 'false gigantopithecus',
      'cn': '布拉巨猿',
      'ja': 'ブラクキ',
    },
    'rank': 'B',
  },
  'Lycidas': {
    'name': {
      'en': 'Lycidas',
      'cn': '利西达斯',
      'ja': 'リュキダス',
    },
    'rank': 'B',
  },
  'Omni': {
    'name': {
      'en': 'Omni',
      'cn': '全能机甲',
      'ja': 'オムニ',
    },
    'rank': 'B',
  },
  'Shadow-dweller Yamini': {
    'name': {
      'en': 'Shadow-dweller Yamini',
      'cn': '影中暗 雅弥尼',
      'ja': '宵闇のヤミニ',
    },
    'rank': 'B',
  },
  'Ouzelum': {
    'name': {
      'en': 'Ouzelum',
      'cn': '奥祖鲁姆',
      'ja': 'オゼルム',
    },
    'rank': 'B',
  },
  'Gwas-y-neidr': {
    'name': {
      'en': 'Gwas-y-neidr',
      'cn': '蛇仆蚂蜓',
      'ja': 'グアス・ア・ニードル',
    },
    'rank': 'B',
  },
  'Buccaboo': {
    'name': {
      'en': 'Buccaboo',
      'cn': '布卡卜',
      'ja': 'ブッカブー',
    },
    'rank': 'B',
  },
  'Manes': {
    'name': {
      'en': 'Manes',
      'cn': '玛涅斯',
      'ja': 'マネス',
    },
    'rank': 'B',
  },
  'Kiwa': {
    'name': {
      'en': 'Kiwa',
      'cn': '奇洼',
      'ja': 'キワ',
    },
    'rank': 'B',
  },
  'Gauki Strongblade': {
    'name': {
      'en': 'Gauki Strongblade',
      'cn': '剑豪 刑具',
      'ja': '剣豪ガウキ',
    },
    'rank': 'B',
  },
  'Guhuo Niao': {
    'name': {
      'en': 'Guhuo Niao',
      'cn': '姑获鸟',
      'ja': '姑獲鳥',
    },
    'rank': 'B',
  },
  'Deidar': {
    'name': {
      'en': 'Deidar',
      'cn': '大太',
      'ja': 'デイダラ',
    },
    'rank': 'B',
  },
  'Gyorai Quickstrike': {
    'name': {
      'en': 'Gyorai Quickstrike',
      'cn': '闪雷击 鱼雷',
      'ja': '雷撃のギョライ',
    },
    'rank': 'B',
  },
  'Aswang': {
    'name': {
      'en': 'Aswang',
      'cn': '阿苏黄',
      'ja': 'アスワング',
    },
    'rank': 'B',
  },
  'Kurma': {
    'name': {
      'en': 'Kurma',
      'cn': '俱利摩',
      'ja': 'クールマ',
    },
    'rank': 'B',
  },
  'Mindmaker': {
    'name': {
      'en': 'Mindmaker',
      'cn': '启灵果',
      'ja': 'マインドメーカー',
    },
    'rank': 'B',
  },
  'Pachamama': {
    'name': {
      'en': 'Pachamama',
      'cn': '帕查玛玛',
      'ja': 'パチャママ',
    },
    'rank': 'B',
  },
  'Vulpangue': {
    'name': {
      'en': 'Vulpangue',
      'cn': '狐首虺',
      'ja': 'ヴルパングエ',
    },
    'rank': 'B',
  },
  'Domovoi': {
    'name': {
      'en': 'Domovoi',
      'cn': '杜莫伊',
      'ja': 'ドモヴォーイ',
    },
    'rank': 'B',
  },
  'La Velue': {
    'name': {
      'en': 'La Velue',
      'cn': '浓毛兽',
      'ja': 'ラ・ヴェリュ',
    },
    'rank': 'B',
  },
  'Itzpapalotl': {
    'name': {
      'en': 'Itzpapalotl',
      'cn': '伊兹帕帕洛特尔',
      'ja': 'イツパパロツル',
    },
    'rank': 'B',
  },
  'Coquecigrue': {
    'name': {
      'en': 'Coquecigrue',
      'cn': '三合鸟儿',
      'ja': 'コクシグルー',
    },
    'rank': 'B',
  },
  'Indomitable': {
    'name': {
      'en': 'Indomitable',
      'cn': '不屈号',
      'ja': 'インドミタブル',
    },
    'rank': 'B',
  },
  'Worm of the Well': {
    'name': {
      'en': 'Worm of the Well',
      'cn': '大井巨虫',
      'ja': 'ウェルウォーム',
    },
    'rank': 'B',
  },
  'Juggler Hecatomb': {
    'name': {
      'en': 'Juggler Hecatomb',
      'cn': '残虐杂技师',
      'ja': 'ジャグラー・ヘカトゥーム',
    },
    'rank': 'B',
  },
  'Deacon': {
    'name': {
      'en': 'Deacon',
      'cn': '助祭大蟹',
      'ja': 'ディーコン',
    },
    'rank': 'B',
  },
  'Gilshs Aath Swiftclaw': {
    'name': {
      'en': 'Gilshs Aath Swiftclaw',
      'cn': '徒手抓鱼 基乌嘶·渊斯',
      'ja': '手掴のギウスィー・アース',
    },
    'rank': 'B',
  },
};
