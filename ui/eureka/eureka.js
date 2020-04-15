'use strict';

let Options = {
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  BunnyPopSound: '../../resources/sounds/WeakAuras/WaterDrop.ogg',
  PopVolume: 1.0,
  BunnyPopVolume: 0.3,
  bunnyLabel: {
    en: 'Bunny',
    de: 'Hase',
    fr: 'Lapin',
    ja: 'バニー',
    ko: '토끼',
    cn: '兔子',
  },
  // 20 minutes for Ovni?
  SuppressPopMs: 60 * 20 * 1000,
  ZoneName: {
    en: {
      'Eureka Anemos': 'Eureka Anemos',
      'Eureka Pagos': 'Eureka Pagos',
      'Eureka Pyros': 'Eureka Pyros',
      'Eureka Hydatos': 'Eureka Hydatos',
    },
    cn: {
      'Eureka Anemos': '常风之地',
      'Eureka Pagos': '恒冰之地',
      'Eureka Pyros': '涌火之地',
      'Eureka Hydatos': '丰水之地',
    },
    ko: {
      'Eureka Anemos': '아네모스 지대',
      'Eureka Pagos': '파고스 지대',
      'Eureka Pyros': '피로스 지대',
      'Eureka Hydatos': '히다토스 지대',
    },
  },
  Regex: {
    en: {
      'gFlagRegex': Regexes.parse(/00:00..:(.*)Eureka (?:Anemos|Pagos|Pyros|Hydatos) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/(?!maps\/)(\S*)\/?/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)NMs on cooldown: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)m\)/),
    },
    cn: {
      'gFlagRegex': Regexes.parse(/00:00..:(.*)(?:常风之地|恒冰之地|涌火之地|丰水之地) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/(?!maps\/)(\S*)\/?/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)冷却中的NM: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)分(钟*)\)/),
    },
  },
  ZoneInfo: {
    // Fate IDs
    // Anemos:  https://xivapi.com/search?indexes=Fate&filters=ID>=1328,ID<=1348&columns=Description,Name,Url
    // Pagos:   https://xivapi.com/search?indexes=Fate&filters=ID>=1351,ID<=1369&columns=Description,Name,Url
    // Pyros:   https://xivapi.com/search?indexes=Fate&filters=ID>=1388,ID<=1408&columns=Description,Name,Url
    // Hydatos: https://xivapi.com/search?indexes=Fate&filters=ID>=1412,ID<=1425&columns=Description,Name,Url
    'Eureka Anemos': {
      mapImage: 'anemos.png',
      mapWidth: 1300,
      mapHeight: 950,
      shortName: 'anemos',
      primaryWeather: ['Gales'],
      // TODO: these could be a little better tuned :C
      mapToPixelXScalar: 41.12,
      mapToPixelXConstant: -224.7,
      mapToPixelYScalar: 41.09,
      mapToPixelYConstant: -457.67,
      entityToMapXScalar: .02002870754,
      entityToMapXConstant: 21.45210725,
      entityToMapYScalar: .02000892816,
      entityToMapYConstant: 21.4665545,
      fairy: {
        en: 'Anemos Elemental',
        cn: '常风元灵',
        ko: '아네모스 정령',
      },
      nms: {
        sabo: {
          label: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボ',
            ko: '사보텐더',
            cn: '仙人掌',
          },
          trackerName: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボテン',
            ko: '사보',
            cn: '仙人掌',
          },
          x: 13.9,
          y: 21.9,
          fateID: 1332,
          bunny: false,
        },
        lord: {
          label: {
            en: 'Lord',
            de: 'Prinz',
            fr: 'Seigneur',
            ja: 'ロード',
            ko: '문어',
            cn: '章鱼',
          },
          trackerName: {
            en: 'Lord',
            de: 'Prinz',
            fr: 'Seigneur',
            ja: 'ロード',
            ko: '대왕',
            cn: '章鱼',
          },
          x: 29.7,
          y: 27.1,
          fateID: 1348,
          bunny: false,
        },
        teles: {
          label: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            ko: '텔레스',
            cn: '鸟',
          },
          trackerName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            ko: '텔레스',
            cn: '鸟',
          },
          x: 25.6,
          y: 27.4,
          fateID: 1333,
          bunny: false,
        },
        emperor: {
          label: {
            en: 'Emp',
            de: 'Kaiser',
            fr: 'Emp',
            ja: 'アネモス',
            ko: '잠자리',
            cn: '蜻蜓',
          },
          trackerName: {
            en: 'Emperor',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'エンペラ',
            ko: '황제',
            cn: '蜻蜓',
          },
          x: 17.2,
          y: 22.2,
          fateID: 1328,
          bunny: false,
        },
        callisto: {
          label: {
            en: 'Calli',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            ko: '칼리스토',
            cn: '熊',
          },
          trackerName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            ko: '칼리스토',
            cn: '熊',
          },
          // 25.5, 22.3 from the tracker, but collides with number
          x: 26.2,
          y: 22.0,
          fateID: 1344,
          bunny: false,
        },
        number: {
          label: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
            ko: '넘버즈',
            cn: '群偶',
          },
          trackerName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバ',
            ko: '넘버즈',
            cn: '群偶',
          },
          // 23.5, 22.7 from the tracker, but collides with callisto
          x: 23.5,
          y: 23.4,
          fateID: 1347,
          bunny: false,
        },
        jaha: {
          label: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jaha',
            ja: 'ジャハ',
            ko: '자하남',
            cn: '台风',
          },
          trackerName: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jaha',
            ja: 'ジャハ',
            ko: '자하남',
            cn: '台风',
          },
          x: 17.7,
          y: 18.6,
          fateID: 1345,
          bunny: false,
          weather: 'Gales',
        },
        amemet: {
          label: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
            ko: '아메메트',
            cn: '暴龙',
          },
          trackerName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメ',
            ko: '아메메트',
            cn: '暴龙',
          },
          x: 15.0,
          y: 15.6,
          fateID: 1334,
          bunny: false,
        },
        caym: {
          label: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
            ko: '카임',
            cn: '盖因',
          },
          trackerName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
            ko: '카임',
            cn: '盖因',
          },
          x: 13.8,
          y: 12.5,
          fateID: 1335,
          bunny: false,
        },
        bomb: {
          label: {
            en: 'Bomb',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバ',
            ko: '봄바딜',
            cn: '举高高',
          },
          trackerName: {
            en: 'Bomba',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバ',
            ko: '봄바',
            cn: '举高高',
          },
          x: 28.3,
          y: 20.4,
          fateID: 1336,
          bunny: false,
          time: 'Night',
        },
        serket: {
          label: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '전갈',
            cn: '蝎子',
          },
          trackerName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '세르케트',
            cn: '蝎子',
          },
          x: 24.8,
          y: 17.9,
          fateID: 1339,
          bunny: false,
        },
        juli: {
          label: {
            en: 'Juli',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
            ko: '줄리카',
            cn: '魔界花',
          },
          trackerName: {
            en: 'Julika',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
            ko: '줄리카',
            cn: '魔界花',
          },
          x: 21.9,
          y: 15.6,
          fateID: 1346,
        },
        rider: {
          label: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ライダー',
            ko: '기수',
            cn: '白骑士',
          },
          trackerName: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ライダー',
            ko: '기수',
            cn: '白骑士',
          },
          x: 20.3,
          y: 13.0,
          fateID: 1343,
          bunny: false,
          time: 'Night',
        },
        poly: {
          label: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリ',
            ko: '외눈',
            cn: '独眼',
          },
          trackerName: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリュ',
            ko: '폴리',
            cn: '独眼',
          },
          x: 26.4,
          y: 14.3,
          fateID: 1337,
          bunny: false,
        },
        strider: {
          label: {
            en: 'Strider',
            de: 'Simurghs',
            fr: 'Simurgh',
            ja: 'シームルグ',
            ko: '즈',
            cn: '阔步西牟鸟',
          },
          trackerName: {
            en: 'Strider',
            de: 'Läufer',
            fr: 'Trotteur',
            ja: 'シムルグ',
            ko: '시무르그',
            cn: '祖',
          },
          x: 28.6,
          y: 13.0,
          fateID: 1342,
          bunny: false,
        },
        hazmat: {
          label: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマット',
            ko: '하즈마트',
            cn: '极其危险物质',
          },
          trackerName: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマ',
            ko: '하즈마트',
            cn: '爆弹',
          },
          x: 35.3,
          y: 18.3,
          fateID: 1341,
          bunny: false,
        },
        fafnir: {
          label: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
            ko: '파프니르',
            cn: '法夫纳',
          },
          trackerName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴ',
            ko: '파프니르',
            cn: '法夫纳',
          },
          x: 35.5,
          y: 21.5,
          fateID: 1331,
          bunny: false,
          time: 'Night',
        },
        amarok: {
          label: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
            ko: '아마록',
            cn: '阿玛洛克',
          },
          trackerName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロ',
            ko: '아마록',
            cn: '狗',
          },
          x: 7.6,
          y: 18.2,
          fateID: 1340,
          bunny: false,
        },
        lama: {
          label: {
            en: 'Lama',
            de: 'Lama',
            fr: 'Lama',
            ja: 'ラマ',
            ko: '라마슈투',
            cn: '拉玛什图',
          },
          trackerName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュ',
            ko: '라마슈투',
            cn: '嫂子',
          },
          // 7.7, 23.3 from the tracker but mobs are farther south.
          x: 7.7,
          y: 25.3,
          fateID: 1338,
          bunny: false,
          time: 'Night',
        },
        pazu: {
          label: {
            en: 'Pazu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
            ko: '파주주',
            cn: '帕祖祖',
          },
          trackerName: {
            en: 'Paz',
            de: 'Paz',
            fr: 'Pazuzu',
            ja: 'パズズ',
            ko: '파주주',
            cn: 'Pzz',
          },
          x: 7.4,
          y: 21.7,
          fateID: 1329,
          bunny: false,
          weather: 'Gales',
        },
      },
    },
    'Eureka Pagos': {
      mapImage: 'pagos.png',
      mapWidth: 1500,
      mapHeight: 950,
      shortName: 'pagos',
      mapToPixelXScalar: 41.08333,
      mapToPixelXConstant: -85.28333,
      mapToPixelYScalar: 41.09158,
      mapToPixelYConstant: -370.196,
      entityToMapXScalar: 0.02,
      entityToMapXConstant: 21.48,
      entityToMapYScalar: 0.02,
      entityToMapYConstant: 21.48,
      fairy: {
        en: 'Pagos Elemental',
        cn: '恒冰元灵',
        ko: '파고스 정령',
      },
      nms: {
        northbunny: {
          label: bunnyLabel,
          x: 20.5,
          y: 21.5,
          fateID: 1368,
          bunny: true,
          respawnMinutes: 8,
        },
        southbunny: {
          label: bunnyLabel,
          x: 18.0,
          y: 27.5,
          fateID: 1367,
          bunny: true,
          respawnMinutes: 8,
        },
        snowqueen: {
          label: {
            en: 'Queen',
            de: 'Schneekönigin',
            fr: 'Snow Queen',
            ja: '女王',
            ko: '눈의 여왕',
            cn: '周冬雨',
          },
          trackerName: {
            en: 'Queen',
            de: 'Königin',
            fr: 'Reine',
            ja: '女王',
            ko: '눈 여왕',
            cn: '周冬雨',
          },
          x: 21.5,
          y: 26.5,
          fateID: 1351,
          bunny: false,
        },
        taxim: {
          label: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '택심',
            cn: '读书人',
          },
          trackerName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '텍심',
            cn: '读书人',
          },
          x: 25.5,
          y: 28.3,
          fateID: 1369,
          bunny: false,
          time: 'Night',
        },
        ashdragon: {
          label: {
            en: 'Dragon',
            de: 'Aschedrache',
            fr: 'Ash Dragon',
            ja: 'ドラゴン',
            ko: '용',
            cn: '灰烬龙',
          },
          trackerName: {
            en: 'Dragon',
            de: 'Drache',
            fr: 'Dragon',
            ja: 'アッシュ',
            ko: '잿더미 용',
            cn: '灰烬龙',
          },
          x: 29.7,
          y: 30.0,
          fateID: 1353,
          bunny: false,
        },
        glavoid: {
          label: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glavoid',
            ja: 'グラヴォイド',
            ko: '지렁이',
            cn: '魔虫',
          },
          trackerName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glaboïde',
            ja: 'グラヴォ',
            ko: '그라보이드',
            cn: '魔虫',
          },
          x: 33.0,
          y: 28.0,
          fateID: 1354,
          bunny: false,
        },
        anapos: {
          label: {
            en: 'Anapos',
            de: 'Anapo',
            fr: 'Anapos',
            ja: 'アナポ',
            ko: '아나포',
            cn: '安娜波',
          },
          trackerName: {
            en: 'Anapos',
            de: 'Anapos',
            fr: 'Anapos',
            ja: 'アナポ',
            ko: '아나포',
            cn: '安娜波',
          },
          x: 33.0,
          y: 21.5,
          fateID: 1355,
          bunny: false,
          weather: 'Fog',
        },
        hakutaku: {
          label: {
            en: 'Haku',
            de: 'Hakutaku',
            fr: 'Hakutaku',
            ja: 'ハクタク',
            ko: '백택',
            cn: '白泽',
          },
          trackerName: {
            en: 'Haku',
            de: 'Haku',
            fr: 'Hakutaku',
            ja: 'ハクタク',
            ko: '백택',
            cn: '白泽',
          },
          x: 29.0,
          y: 22.5,
          fateID: 1366,
          bunny: false,
        },
        igloo: {
          label: {
            en: 'Igloo',
            de: 'Iglu',
            fr: 'Igloo',
            ja: 'イグル',
            ko: '이글루',
            cn: '雪屋王',
          },
          trackerName: {
            en: 'Igloo',
            de: 'Iglu',
            fr: 'Igloo',
            ja: 'イグルー',
            ko: '이글루',
            cn: '雪屋王',
          },
          x: 17,
          y: 16,
          fateID: 1357,
          bunny: false,
        },
        asag: {
          label: {
            en: 'Asag',
            de: 'Asag',
            fr: 'Asag',
            ja: 'アサグ',
            ko: '아사그',
            cn: '阿萨格',
          },
          trackerName: {
            en: 'Asag',
            de: 'Asag',
            fr: 'Asag',
            ja: 'アサグ',
            ko: '아사그',
            cn: '阿萨格',
          },
          x: 11.3,
          y: 10.5,
          fateID: 1356,
          bunny: false,
        },
        surabhi: {
          label: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '염소',
            cn: '山羊',
          },
          trackerName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '수라비',
            cn: '山羊',
          },
          x: 10.5,
          y: 20.5,
          fateID: 1352,
          bunny: false,
        },
        kingarthro: {
          label: {
            en: 'Arthro',
            de: 'König Athro',
            fr: 'King Arthro',
            ja: 'アースロ',
            ko: '게',
            cn: '螃蟹',
          },
          trackerName: {
            en: 'Arthro',
            de: 'Athro',
            fr: 'Arthro',
            ja: 'アスロ',
            ko: '아스로',
            cn: '螃蟹',
          },
          x: 8.0,
          y: 15.2,
          fateID: 1360,
          bunny: false,
          weather: 'Fog',
        },
        minotaurs: {
          label: {
            en: 'Minotaurs',
            de: 'Minotauren',
            fr: 'Minotaurs',
            ja: 'ミノタウロス',
            ko: '미노타우루스',
            cn: '双牛',
          },
          trackerName: {
            en: 'Brothers',
            de: 'Brüder',
            fr: 'Frères',
            ja: 'ミノ',
            ko: '형제',
            cn: '双牛',
          },
          x: 13.8,
          y: 18.4,
          fateID: 1358,
          bunny: false,
        },
        holycow: {
          label: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Holy Cow',
            ja: '聖牛',
            ko: '소',
            cn: '圣牛',
          },
          trackerName: {
            en: 'Holy Cow',
            de: 'Heil',
            fr: 'Vache',
            ja: '聖牛',
            ko: '신성 소',
            cn: '圣牛',
          },
          x: 26,
          y: 16,
          fateID: 1361,
          bunny: false,
        },
        hadhayosh: {
          label: {
            en: 'Hadha',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨッシュ',
            ko: '베히모스',
            cn: '贝爷',
          },
          trackerName: {
            en: 'Behe',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨ',
            ko: '하다요쉬',
            cn: '贝爷',
          },
          x: 30,
          y: 19,
          fateID: 1362,
          bunny: false,
          weather: 'Thunder',
        },
        horus: {
          label: {
            en: 'Horus',
            de: 'Horus',
            fr: 'Horus',
            ja: 'ホルス',
            ko: '호루스',
            cn: '荷鲁斯',
          },
          trackerName: {
            en: 'Horus',
            de: 'Horus',
            fr: 'Horus',
            ja: 'ホルス',
            ko: '호루스',
            cn: '荷鲁斯',
          },
          x: 26,
          y: 20,
          fateID: 1359,
          bunny: false,
          weather: 'Heat Waves',
        },
        mainyu: {
          label: {
            en: 'Mainyu',
            de: 'Mainyu',
            fr: 'Mainyu',
            ja: 'マンユ',
            ko: '마이뉴',
            cn: '大眼',
          },
          trackerName: {
            en: 'Mainyu',
            de: 'Mainyu',
            fr: 'Mainyu',
            ja: 'マンユ',
            ko: '마이뉴',
            cn: '大眼',
          },
          x: 25,
          y: 24,
          fateID: 1363,
          bunny: false,
        },
        cassie: {
          label: {
            en: 'Cassie',
            de: 'Cassie',
            fr: 'Cassie',
            ja: 'キャシ',
            ko: '캐시',
            cn: '凯西',
          },
          trackerName: {
            en: 'Cassie',
            de: 'Cassie',
            fr: 'Cassie',
            ja: 'キャシー',
            ko: '캐시',
            cn: '凯西',
          },
          weather: 'Blizzards',
          x: 22,
          y: 14,
          fateID: 1365,
          bunny: false,
        },
        louhi: {
          label: {
            en: 'Louhi',
            de: 'Louhi',
            fr: 'Louhi',
            ja: 'ロウヒ',
            ko: '로우히',
            cn: '娄希',
          },
          trackerName: {
            en: 'Louhi',
            de: 'Louhi',
            fr: 'Louhi',
            ja: 'ロウヒ',
            ko: '로우히',
            cn: '娄希',
          },
          x: 36,
          y: 18.5,
          fateID: 1364,
          bunny: false,
          time: 'Night',
        },
      },
    },
    'Eureka Pyros': {
      mapImage: 'pyros.png',
      mapWidth: 1350,
      mapHeight: 1450,
      shortName: 'pyros',
      mapToPixelXScalar: 42.515,
      mapToPixelXConstant: -344.064,
      mapToPixelYScalar: 42.486,
      mapToPixelYConstant: -202.628,
      entityToMapXScalar: 0.02,
      entityToMapXConstant: 21.48,
      entityToMapYScalar: 0.02,
      entityToMapYConstant: 21.48,
      fairy: {
        en: 'Pyros Elemental',
        cn: '涌火元灵',
        ko: '피로스 정령',
      },
      nms: {
        northbunny: {
          label: bunnyLabel,
          x: 25.0,
          y: 11.0,
          fateID: 1408,
          bunny: true,
          respawnMinutes: 8,
        },
        southbunny: {
          label: bunnyLabel,
          x: 24.5,
          y: 26.0,
          fateID: 1407,
          bunny: true,
          respawnMinutes: 8,
        },
        luecosia: {
          label: {
            en: 'Leuco',
            de: 'Leuko',
            fr: 'Leuco',
            ja: 'レウコ',
            cn: '惨叫',
            ko: '레우코시아',
          },
          trackerName: {
            en: 'Leucosia',
            de: 'Leukosia',
            fr: 'Leucosia',
            ja: 'レウコ',
            cn: '惨叫',
            ko: '레우',
          },
          x: 26.8,
          y: 26.3,
          fateID: 1388,
          bunny: false,
          time: 'Night',
        },
        flauros: {
          label: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロス',
            cn: '雷兽',
            ko: '플라우로스',
          },
          trackerName: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロ',
            cn: '雷兽',
            ko: '플라',
          },
          x: 28.9,
          y: 29.2,
          fateID: 1389,
          bunny: false,
        },
        sophist: {
          label: {
            en: 'Sophist',
            de: 'Sophist',
            fr: 'Sophist',
            ja: 'ソフィスト',
            cn: '诡辩者',
            ko: '소피스트',
          },
          trackerName: {
            en: 'Sophist',
            de: 'Sophist',
            fr: 'Sophiste',
            ja: 'ソフィスト',
            cn: '诡辩者',
            ko: '소피',
          },
          x: 31.8,
          y: 31.0,
          fateID: 1390,
          bunny: false,
        },
        graff: {
          label: {
            en: 'Graff',
            de: 'Graff',
            fr: 'Graff',
            ja: 'グラフアカネ',
            cn: '塔塔露',
            ko: '인형',
          },
          trackerName: {
            en: 'Doll',
            de: 'Graff',
            fr: 'Graff',
            ja: 'グラフアカネ',
            cn: '塔塔露',
            ko: '그라',
          },
          x: 23.5,
          y: 37.2,
          fateID: 1391,
          bunny: false,
        },
        askala: {
          label: {
            en: 'Askala',
            de: 'Askala',
            fr: 'Askala',
            ja: 'アスカラ',
            cn: '阿福',
            ko: '작은 부엉이',
          },
          trackerName: {
            en: 'Owl',
            de: 'Askala',
            fr: 'Askala',
            ja: 'アスカラ',
            cn: '阿福',
            ko: '아스',
          },
          x: 19.3,
          y: 29.0,
          fateID: 1392,
          bunny: false,
          weather: 'Umbral Wind',
        },
        batym: {
          label: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Batym',
            ja: 'パティム',
            cn: '大公',
            ko: '대공',
          },
          trackerName: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Duc Batym',
            ja: 'デューク',
            cn: '大公',
            ko: '바팀',
          },
          x: 18.0,
          y: 14.1,
          fateID: 1393,
          bunny: false,
          time: 'Night',
        },
        aetolus: {
          label: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
            cn: '雷鸟',
            ko: '아이톨로스',
          },
          trackerName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
            cn: '雷鸟',
            ko: '아이',
          },
          x: 10.0,
          y: 14.0,
          fateID: 1394,
          bunny: false,
        },
        lesath: {
          label: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'Lesath',
            ja: 'レサト',
            cn: '蝎子',
            ko: '전갈',
          },
          trackerName: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'Lesath',
            ja: 'レサト',
            cn: '蝎子',
            ko: '레사트',
          },
          x: 13.2,
          y: 11.2,
          fateID: 1395,
          bunny: false,
        },
        eldthurs: {
          label: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
            cn: '火巨人',
            ko: '구부',
          },
          trackerName: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
            cn: '火巨人',
            ko: '엘드',
          },
          x: 15.3,
          y: 6.8,
          fateID: 1396,
          bunny: false,
        },
        iris: {
          label: {
            en: 'Iris',
            de: 'Iris',
            fr: 'Iris',
            ja: 'イリス',
            cn: '海燕',
            ko: '이리스',
          },
          trackerName: {
            en: 'Iris',
            de: 'Iris',
            fr: 'Iris',
            ja: 'イリス',
            cn: '海燕',
            ko: '이리스',
          },
          x: 21.3,
          y: 12.0,
          fateID: 1397,
          bunny: false,
        },
        lamebrix: {
          label: {
            en: 'Lamebrix',
            de: 'Lamebrix',
            fr: 'Lamebrix',
            ja: 'レイムプリクス',
            cn: '哥布林',
            ko: '레임브릭스',
          },
          trackerName: {
            en: 'Lamebrix',
            de: 'Wüterix',
            fr: 'Lamebrix',
            ja: 'ゴブ',
            cn: '哥布林',
            ko: '용병',
          },
          x: 21.9,
          y: 8.3,
          fateID: 1398,
          bunny: false,
        },
        dux: {
          label: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux',
            ja: 'ドゥクス',
            cn: '雷军',
            ko: '번개 사령관',
          },
          trackerName: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux',
            ja: 'ドゥクス',
            cn: '雷军',
            ko: '번개',
          },
          x: 27.4,
          y: 8.8,
          fateID: 1399,
          bunny: false,
          weather: 'Thunder',
        },
        jack: {
          label: {
            en: 'Jack',
            de: 'Weide',
            fr: 'Jack',
            ja: 'ジャック',
            cn: '树人',
            ko: '럼버잭',
          },
          trackerName: {
            en: 'Jack',
            de: 'Holz',
            fr: 'Jack',
            ja: 'ジャック',
            cn: '树人',
            ko: '럼버잭',
          },
          x: 30.1,
          y: 11.7,
          fateID: 1400,
          bunny: false,
        },
        glauko: {
          label: {
            en: 'Glauko',
            de: 'Glauko',
            fr: 'Glauko',
            ja: 'グラウコピス',
            cn: '明眸',
            ko: '큰 부엉이',
          },
          trackerName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukopis',
            ja: 'グラウコ',
            cn: '明眸',
            ko: '글라',
          },
          x: 32.3,
          y: 15.1,
          fateID: 1401,
          bunny: false,
        },
        yingyang: {
          label: {
            en: 'Ying-Yang',
            de: 'Yin-Yang',
            fr: 'Ying-Yang',
            ja: 'イン・ヤン',
            cn: '阴·阳',
            ko: '음양',
          },
          trackerName: {
            en: 'YY',
            de: 'Yin-Yang',
            fr: 'Ying-Yang',
            ja: 'インヤン',
            cn: '阴·阳',
            ko: '음양',
          },
          x: 11.4,
          y: 34.1,
          fateID: 1402,
          bunny: false,
        },
        skoll: {
          label: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Skoll',
            ja: 'スコル',
            cn: '狼',
            ko: '스콜',
          },
          trackerName: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Skoll',
            ja: 'スコル',
            cn: '狼',
            ko: '스콜',
          },
          x: 24.3,
          y: 30.1,
          fateID: 1403,
          bunny: false,
          weather: 'Blizzards',
        },
        penthe: {
          label: {
            en: 'Penthe',
            de: 'Penthe',
            fr: 'Penthe',
            ja: 'ペンテ',
            cn: '彭女士',
            ko: '펜테',
          },
          trackerName: {
            en: 'Penny',
            de: 'Penthe',
            fr: 'Penthesilée',
            ja: 'レイア',
            cn: '彭女士',
            ko: '펜테',
          },
          x: 35.7,
          y: 5.9,
          fateID: 1404,
          bunny: false,
          weather: 'Heat Waves',
        },
      },
    },
    'Eureka Hydatos': {
      mapImage: 'hydatos.png',
      mapWidth: 1500,
      mapHeight: 800,
      shortName: 'hydatos',
      mapToPixelXScalar: 37.523,
      mapToPixelXConstant: -48.160,
      mapToPixelYScalar: 37.419,
      mapToPixelYConstant: -414.761,
      entityToMapXScalar: 0.02,
      entityToMapXConstant: 21.48,
      entityToMapYScalar: 0.02,
      entityToMapYConstant: 30.977,
      fairy: {
        en: 'Hydatos Elemental',
        cn: '丰水元灵',
        ko: '히다토스 정령',
      },
      nms: {
        bunny: {
          label: bunnyLabel,
          x: 14.0,
          y: 21.5,
          fateID: 1425,
          bunny: true,
          respawnMinutes: 8,
        },
        khalamari: {
          label: {
            en: 'Khala',
            de: 'Kala',
            fr: 'Khala',
            ja: 'カラマリ',
            cn: '墨鱼',
            ko: '칼라마리',
          },
          trackerName: {
            en: 'Khalamari',
            de: 'Kalamari',
            fr: 'Khalamari',
            ja: 'カラマリ',
            cn: '墨鱼',
            ko: '칼라',
          },
          x: 11.1,
          y: 24.9,
          fateID: 1412,
          bunny: false,
        },
        stegodon: {
          label: {
            en: 'Stego',
            de: 'Stego',
            fr: 'Stego',
            ja: 'ステゴドン',
            cn: '象',
            ko: '스테고돈',
          },
          trackerName: {
            en: 'Stegodon',
            de: 'Stegodon',
            fr: 'Stegodon',
            ja: 'ステゴドン',
            cn: '象',
            ko: '스테',
          },
          x: 9.3,
          y: 18.2,
          fateID: 1413,
          bunny: false,
        },
        molech: {
          label: {
            en: 'Molech',
            de: 'Molek',
            fr: 'Molech',
            ja: 'モレク',
            cn: '摩洛',
            ko: '몰레크',
          },
          trackerName: {
            en: 'Molech',
            de: 'Molek',
            fr: 'Molech',
            ja: 'モレク',
            cn: '摩洛',
            ko: '몰레크',
          },
          x: 7.8,
          y: 21.9,
          fateID: 1414,
          bunny: false,
        },
        piasa: {
          label: {
            en: 'Piasa',
            de: 'Piasa',
            fr: 'Piasa',
            ja: 'ピアサ',
            cn: '皮鸟',
            ko: '피아사',
          },
          trackerName: {
            en: 'Piasa',
            de: 'Piasa',
            fr: 'Piasa',
            ja: 'ピアサ',
            cn: '皮鸟',
            ko: '피아사',
          },
          x: 7.1,
          y: 14.1,
          fateID: 1415,
          bunny: false,
        },
        frostmane: {
          label: {
            en: 'Frost',
            de: 'Frost',
            fr: 'Frost',
            ja: 'フロストメーン',
            cn: '老虎',
            ko: '서리갈기',
          },
          trackerName: {
            en: 'Frostmane',
            de: 'Frosti',
            fr: 'Crinière',
            ja: 'フロスト',
            cn: '老虎',
            ko: '서리',
          },
          x: 8.1,
          y: 26.4,
          fateID: 1416,
          bunny: false,
        },
        daphne: {
          label: {
            en: 'Daphne',
            de: 'Daphne',
            fr: 'Daphné',
            ja: 'ダフネ',
            cn: '达佛涅',
            ko: '다프네',
          },
          trackerName: {
            en: 'Daphne',
            de: 'Daphne',
            fr: 'Daphné',
            ja: 'ダフネ',
            cn: '达佛涅',
            ko: '다프네',
          },
          x: 25.6,
          y: 16.2,
          fateID: 1417,
          bunny: false,
        },
        goldemar: {
          label: {
            en: 'King',
            de: 'König',
            fr: 'Roi',
            ja: 'King',
            cn: '马王',
            ko: '골데마르',
          },
          trackerName: {
            en: 'King Goldemar',
            de: 'König Goldemar',
            fr: 'Roi Goldemar',
            ja: 'キング・ゴルデマール',
            cn: '马王',
            ko: '골데마르',
          },
          x: 28.9,
          y: 23.9,
          fateID: 1418,
          bunny: false,
        },
        leuke: {
          label: {
            en: 'Leuke',
            de: 'Leukea',
            fr: 'Leuke',
            ja: 'レウケー',
            cn: '琉刻',
            ko: '레우케',
          },
          trackerName: {
            en: 'Leuke',
            de: 'Leukea',
            fr: 'Leuke',
            ja: 'レウケ',
            cn: '琉刻',
            ko: '레우케',
          },
          x: 37.3,
          y: 27.0,
          fateID: 1419,
          bunny: false,
        },
        barong: {
          label: {
            en: 'Barong',
            de: 'Baron',
            fr: 'Barong',
            ja: 'バロン',
            cn: '巴龙',
            ko: '바롱',
          },
          trackerName: {
            en: 'Barong',
            de: 'Baron',
            fr: 'Barong',
            ja: 'バロン',
            cn: '巴龙',
            ko: '바롱',
          },
          x: 32.2,
          y: 24.2,
          fateID: 1420,
          bunny: false,
        },
        ceto: {
          label: {
            en: 'Ceto',
            de: 'Ceto',
            fr: 'Ceto',
            ja: 'ケートー',
            cn: '刻托',
            ko: '케토',
          },
          trackerName: {
            en: 'Ceto',
            de: 'Ceto',
            fr: 'Ceto',
            ja: 'ケート',
            cn: '刻托',
            ko: '케토',
          },
          x: 36.1,
          y: 13.4,
          fateID: 1421,
          bunny: false,
        },
        watcher: {
          label: {
            en: 'Watcher',
            de: 'Wächter',
            fr: 'Gardien',
            ja: 'Watcher',
            cn: '守望者',
            ko: '수정룡',
          },
          trackerName: {
            en: 'PW',
            de: 'Wächter',
            fr: 'Gardien',
            ja: 'ウォッチャ',
            cn: '守望者',
            ko: '관찰자',
          },
          x: 32.7,
          y: 19.5,
          fateID: 1423,
          bunny: false,
        },
        ovni: {
          label: {
            en: 'Ovni',
            de: 'Ovni',
            fr: 'Ovni',
            ja: 'オヴニ',
            cn: 'UFO',
            ko: '오브니',
          },
          x: 26.8,
          y: 29.0,
          fateID: 1424,
          bunny: false,
          respawnMinutes: 20,
        },
        tristitia: {
          label: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
            cn: '光灵鳐',
            ko: '트리스티샤',
          },
          x: 18.7,
          y: 29.7,
          fateID: 1422,
          bunny: false,
          respawnMinutes: 20,
        },
      },
    },
  },
};

let gWeatherIcons = {
  'Gales': '&#x1F300;',
  'Fog': '&#x2601;',
  'Blizzards': '&#x2744;',
  'Thunder': '&#x26A1;',
  'Heat Waves': '&#x2600;',
  'Umbral Wind': '&#x1F300;',
  'Fair Skies': '&#x26C5;',
  'Snow': '&#x26C4;',
  'Thunderstorms': '&#x26A1;',
  'Showers': '&#x2614;',
  'Gloom': '&#x2639;',
};
let gNightIcon = '&#x1F319;';
let gDayIcon = '&#x263C;';

let gTracker;
class EurekaTracker {
  constructor(options) {
    this.options = options;
    this.zoneInfo = null;
    this.ResetZone();
    this.updateTimesHandle = null;
    this.fateQueue = [];
  }

  SetStyleFromMap(style, mx, my) {
    if (mx === undefined) {
      style.display = 'none';
      return;
    }

    let zi = this.zoneInfo;
    let px = zi.mapToPixelXScalar * mx + zi.mapToPixelXConstant;
    let py = zi.mapToPixelYScalar * my + zi.mapToPixelYConstant;

    style.left = (px / zi.mapWidth * 100) + '%';
    style.top = (py / zi.mapHeight * 100) + '%';
  }

  SetStyleFromEntity(style, ex, ey) {
    let zi = this.zoneInfo;
    let mx = zi.entityToMapXScalar * ex + zi.entityToMapXConstant;
    let my = zi.entityToMapYScalar * ey + zi.entityToMapYConstant;
    this.SetStyleFromMap(style, mx, my);
  }

  AddElement(container, nm) {
    let label = document.createElement('div');
    label.classList.add('nm');
    label.id = nm;

    this.SetStyleFromMap(label.style, nm.x, nm.y);

    let icon = document.createElement('span');
    icon.classList.add('nm-icon');
    let name = document.createElement('span');
    name.classList.add('nm-name');
    name.classList.add('text');
    name.innerText = nm.label[this.options.Language];
    let progress = document.createElement('span');
    progress.innerText = '';
    progress.classList.add('nm-progress');
    progress.classList.add('text');
    let time = document.createElement('span');
    time.classList.add('nm-time');
    time.classList.add('text');

    if (nm.bunny)
      label.classList.add('bunny');

    label.appendChild(icon);
    label.appendChild(name);
    label.appendChild(progress);
    label.appendChild(time);
    container.appendChild(label);

    nm.element = label;
    nm.progressElement = progress;
    nm.timeElement = time;
    nm.respawnTimeMsLocal = undefined;
    nm.respawnTimeMsTracker = undefined;
  }

  InitNMs() {
    this.nms = this.options.ZoneInfo[this.zoneName].nms;
    // Anemos has no bunny fates
    this.nmKeys = Object.keys(this.nms);

    let container = document.getElementById('nm-labels');

    for (let i = 0; i < this.nmKeys.length; ++i)
      this.AddElement(container, this.nms[this.nmKeys[i]]);


    this.fairy = this.options.ZoneInfo[this.zoneName].fairy;
    let fairyName = this.fairy[this.options.Language];
    this.fairy.regex = Regexes.parse('03:\\y{ObjectId}:Added new combatant (' + fairyName + ')\\. .* ' +
                                     'Pos: \\(([^,]+),([^,]+),([^,]+)\\)');

    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    container.appendChild(this.playerElement);
  }

  ResetZone() {
    let container = document.getElementById('nm-labels');
    container.innerHTML = '';
    this.currentTracker = null;
  }

  OnPlayerChange(e) {
    if (!this.zoneInfo)
      return;
    this.SetStyleFromEntity(this.playerElement.style, e.detail.pos.x, e.detail.pos.y);
  }

  OnZoneChange(e) {
    this.zoneName = e.detail.zoneName.replace('The Forbidden Land, ', '');
    this.zoneName = this.zoneName.replace('禁地优雷卡 ', '');
    let zones = this.options.ZoneName[this.options.Language] || this.options.ZoneName['en'];
    for (let zone in zones) {
      this.zoneName = this.zoneName.replace(
          zones[zone],
          zone);
    }
    this.zoneName = this.zoneName.replace('Unknown Zone (33B)', 'Eureka Hydatos');
    this.zoneInfo = this.options.ZoneInfo[this.zoneName];
    let container = document.getElementById('container');
    if (this.zoneInfo) {
      this.ResetZone();

      let aspect = document.getElementById('aspect-ratio');
      while (aspect.classList.length > 0)
        aspect.classList.remove(aspect.classList.item(0));
      aspect.classList.add('aspect-ratio-' + this.zoneInfo.shortName);

      document.getElementById('map-image').src = this.zoneInfo.mapImage;
      this.InitNMs();
      this.ProcessFateQueue();
      this.UpdateTimes();
      container.classList.remove('hide');
      window.clearInterval(this.updateTimesHandle);
      this.updateTimesHandle = window.setInterval((function() {
        this.UpdateTimes();
      }).bind(this), this.options.RefreshRateMs);
    } else {
      if (this.updateTimesHandle)
        window.clearInterval(this.updateTimesHandle);
      container.classList.add('hide');
    }

    let flags = document.getElementById('flag-labels');

    for (let i = 0; i < flags.children.length; ++i)
      flags.removeChild(flags.children[i]);
  }

  RespawnTime(nm) {
    let respawnTimeMs = 120 * 60 * 1000;
    if ('respawnMinutes' in nm)
      respawnTimeMs = nm.respawnMinutes * 60 * 1000;
    return respawnTimeMs + (+new Date());
  }

  OnFatePop(fate) {
    fate.element.classList.add('nm-pop');
    fate.element.classList.remove('nm-down');
    fate.lastPopTimeMsLocal = +new Date();
    fate.respawnTimeMsLocal = this.RespawnTime(fate);

    if (fate.bunny) {
      if (this.options.BunnyPopSound && this.options.BunnyPopVolume) {
        let audio = new Audio(this.options.BunnyPopSound);
        audio.volume = this.options.BunnyPopVolume;
        audio.play();
      }
    } else {
      if (this.options.PopSound && this.options.PopVolume) {
        let audio = new Audio(this.options.PopSound);
        audio.volume = this.options.PopVolume;
        audio.play();
      }
    }
  }

  OnFateUpdate(fate, percent) {
    if (fate.element.classList.contains('nm-pop'))
      fate.progressElement.innerText = percent + '%';
  }

  OnFateKill(fate) {
    this.UpdateTimes();
    if (fate.element.classList.contains('nm-pop')) {
      fate.element.classList.add('nm-down');
      fate.element.classList.remove('nm-pop');
      fate.progressElement.innerText = null;
      return;
    }
  }

  ProcessFateQueue() {
    while (this.fateQueue.length != 0)
      this.OnFate(this.fateQueue.pop());
  }

  UpdateTimes() {
    let nowMs = +new Date();

    let primaryWeatherList = this.options.ZoneInfo[this.zoneName].primaryWeather;
    if (primaryWeatherList) {
      for (let i = 0; i < 5 && i < primaryWeatherList.length; ++i) {
        let primaryWeather = primaryWeatherList[i];
        if (!primaryWeather) {
          document.getElementById('label-weather' + i).innerHTML = '';
          continue;
        }
        let weatherStr = gWeatherIcons[primaryWeather];
        let weather = getWeather(nowMs, this.zoneName);
        if (weather == primaryWeather) {
          let stopTime = findNextWeatherNot(nowMs, this.zoneName, primaryWeather);
          if (stopTime) {
            let min = (stopTime - nowMs) / 1000 / 60;
            weatherStr += ' for ' + Math.ceil(min) + 'm';
          } else {
            weatherStr += ' for ???';
          }
        } else {
          let startTime = findNextWeather(nowMs, this.zoneName, primaryWeather);
          if (startTime) {
            let min = (startTime - nowMs) / 1000 / 60;
            weatherStr += ' in ' + Math.ceil(min) + 'm';
          } else {
            weatherStr += ' in ???';
          }
        }
        document.getElementById('label-weather' + i).innerHTML = weatherStr;
      }
    } else {
      let currentWeather = getWeather(nowMs, this.zoneName);
      let weatherStr = gWeatherIcons[currentWeather];
      let stopTime = findNextWeatherNot(nowMs, this.zoneName, currentWeather);
      if (stopTime) {
        let min = (stopTime - nowMs) / 1000 / 60;
        weatherStr += ' for ' + Math.ceil(min) + 'm';
      } else {
        weatherStr += ' for ???';
      }
      document.getElementById('label-weather0').innerHTML = weatherStr;

      // round up current time
      let lastTime = nowMs;
      let lastWeather = currentWeather;
      for (let i = 1; i < 5; ++i) {
        let startTime = findNextWeatherNot(lastTime, this.zoneName, lastWeather);
        let weather = getWeather(startTime + 1, this.zoneName);
        let weatherStr = gWeatherIcons[weather];
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          weatherStr += ' in ' + Math.ceil(min) + 'm';
        } else {
          weatherStr += ' in ???';
        }
        document.getElementById('label-weather' + i).innerHTML = weatherStr;
        lastTime = startTime;
        lastWeather = weather;
      }
    }

    let nextDay = findNextNight(nowMs);
    let nextNight = findNextDay(nowMs);
    let timeStr = '';
    if (nextDay > nextNight)
      timeStr = gNightIcon + ' for ';
    else
      timeStr = gDayIcon + ' for ';

    let dayNightMin = (Math.min(nextDay, nextNight) - nowMs) / 1000 / 60;
    timeStr += Math.ceil(dayNightMin) + 'm';
    document.getElementById('label-time').innerHTML = timeStr;

    document.getElementById('label-tracker').innerHTML = this.currentTracker;

    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];

      let respawnMs = null;
      if (nm.respawnTimeMsLocal)
        respawnMs = nm.respawnTimeMsLocal;
      else if (nm.respawnTimeMsTracker)
        respawnMs = nm.respawnTimeMsTracker;


      let popRespawnMs = respawnMs;

      // Ignore respawns in the past.
      respawnMs = Math.max(respawnMs, nowMs);
      let respawnIcon = '';

      if (nm.weather) {
        let respawnWeather = getWeather(respawnMs, this.zoneName);
        if (respawnWeather != nm.weather) {
          let weatherStartTime =
            findNextWeather(respawnMs, this.zoneName, nm.weather);
          if (weatherStartTime > respawnMs) {
            respawnIcon = gWeatherIcons[nm.weather];
            respawnMs = weatherStartTime;
          }
        }
      }

      if (nm.time == 'Night') {
        let isNight = isNightTime(respawnMs);
        if (!isNight) {
          let nextNight = findNextNight(respawnMs);
          if (nextNight > respawnMs) {
            respawnIcon = gNightIcon;
            respawnMs = nextNight;
          }
        }
      }

      let remainingMs = respawnMs - nowMs;
      if (remainingMs <= 0) {
        let openUntil = null;
        if (nm.weather) {
          let weatherStartTime = findNextWeatherNot(nowMs, this.zoneName, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather];
          openUntil = weatherStartTime;
        }
        if (nm.time == 'Night') {
          respawnIcon = gNightIcon;
          openUntil = findNextDay(nowMs);
        }

        if (openUntil) {
          let openMin = (openUntil - nowMs) / 1000 / 60;
          nm.timeElement.innerHTML = respawnIcon + Math.ceil(openMin) + 'm';
        } else {
          nm.timeElement.innerText = '';
        }
        nm.element.classList.remove('nm-down');
      } else {
        // If still waiting on pop, don't show an icon.
        if (popRespawnMs > nowMs)
          respawnIcon = '';

        let remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        nm.timeElement.innerHTML = respawnIcon + remainingMinutes + 'm';
        nm.element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText) {
    let trackerToNM = {};
    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];
      trackerToNM[nm.trackerName[this.options.Language].toLowerCase()] = nm;
    }

    let regex = this.options.Regex[this.options.Language] || this.options.Regex['en'];
    regex = regex['gTimeRegex'];
    let importList = importText.split(' → ');
    for (let i = 0; i < importList.length; i++) {
      let m = importList[i].match(regex);
      if (!m) {
        console.error('Unknown tracker entry: ' + importList[i]);
        continue;
      }
      let name = m[1];
      let time = m[2];
      let nm = trackerToNM[name.toLowerCase()];
      if (nm)
        nm.respawnTimeMsTracker = (time * 60 * 1000) + (+new Date());
      else
        console.error('Invalid NM Import: ' + name);
    }

    this.UpdateTimes();
  }

  OnLog(e) {
    if (!this.zoneInfo)
      return;
    for (let idx = 0; idx < e.detail.logs.length; idx++) {
      let log = e.detail.logs[idx];
      let gRegex = this.options.Regex[this.options.Language] || this.options.Regex['en'];
      let gFlagRegex = gRegex['gFlagRegex'];
      let match = log.match(gFlagRegex);
      if (match)
        this.AddFlag(match[2], match[3], match[1], match[4]);
      let gTrackerRegex = gRegex['gTrackerRegex'];
      match = log.match(gTrackerRegex);
      if (match)
        this.currentTracker = match[1];
      let gImportRegex = gRegex['gImportRegex'];
      match = log.match(gImportRegex);
      if (match) {
        this.ImportFromTracker(match[2]);
        continue;
      }
      if (log.indexOf(' 03:') >= 0 || log.indexOf('00:0839:') >= 0) {
        match = log.match(this.fairy.regex);
        if (match)
          this.AddFairy(match[1], match[2], match[3]);
      }
    }
  }

  OnFate(e) {
    // Upon entering Eureka we usually receive the fate info before
    // this.zoneInfo is loaded, so lets store the events until we're
    // able to process them.
    if (!this.zoneInfo) {
      this.fateQueue.push(e);
      return;
    }

    switch (e.detail.eventType) {
    case 'add':
      console.log('add: ' + e.detail.fateID);
      for (let i = 0; i < this.nmKeys.length; ++i) {
        let nm = this.nms[this.nmKeys[i]];
        if (e.detail.fateID == nm.fateID) {
          this.OnFatePop(nm);
          return;
        }
      }
      break;
    case 'remove':
      console.log('remove: ' + e.detail.fateID + ' (' + e.detail.progress + '%)');
      for (let i = 0; i < this.nmKeys.length; ++i) {
        let nm = this.nms[this.nmKeys[i]];
        if (e.detail.fateID == nm.fateID) {
          this.OnFateKill(nm);
          return;
        }
      }
      break;
    case 'update':
      console.log('update: ' + e.detail.fateID + ' (' + e.detail.progress + '%)');
      for (let i = 0; i < this.nmKeys.length; ++i) {
        let nm = this.nms[this.nmKeys[i]];
        if (e.detail.fateID == nm.fateID) {
          this.OnFateUpdate(nm, e.detail.progress);
          return;
        }
      }
      break;
    }
  }

  SimplifyText(beforeText, afterText) {
    let str = (beforeText + ' ' + afterText).toLowerCase();

    let dict = {
      'train': [
        'train',
        'tren',
        'trian',
        'tran',
        'choo choo',
        'train location',
      ],
      'fairy': [
        'fairy',
        'elemental',
        'faerie',
        'fary',
        '元灵',
        '凉粉',
        '辣条',
        '冰粉',
        '酸辣粉',
      ],
      'raise': [
        'raise',
        'rez',
        'res ',
        ' res',
        'raise plz',
      ],
      '999': [
        '999',
        '救命',
        '救救',
        '狗狗',
      ],
    };
    let keys = Object.keys(dict);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      for (let j = 0; j < dict[key].length; ++j) {
        let m = dict[key][j];
        if (str.indexOf(m) >= 0)
          return key;
      }
    }
  }

  AddFlag(x, y, beforeText, afterText) {
    let simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }
    beforeText = beforeText.replace(/(?: at|@)$/, '');

    let container = document.getElementById('flag-labels');
    let label = document.createElement('div');
    label.classList.add('flag');
    this.SetStyleFromMap(label.style, x, y);

    let icon = document.createElement('span');
    icon.classList.add('flag-icon');
    let name = document.createElement('span');
    name.classList.add('flag-name');
    name.classList.add('text');
    name.innerText = beforeText;
    if (beforeText != '' && afterText != '')
      name.innerText += ' ';
    name.innerText += afterText;
    label.appendChild(icon);
    label.appendChild(name);
    container.appendChild(label);

    window.setTimeout(function() {
      // Changing zones can also orphan all the labels.
      if (label.parentElement == container)
        container.removeChild(label);
    }, this.options.FlagTimeoutMs);
  }

  AddFairy(name, ex, ey) {
    let zi = this.zoneInfo;
    let mx = zi.entityToMapXScalar * ex + zi.entityToMapXConstant;
    let my = zi.entityToMapYScalar * ey + zi.entityToMapYConstant;
    this.AddFlag(mx, my, 'fairy', '');
  }
}

UserConfig.getUserConfigLocation('eureka', function(e) {
  addOverlayListener('onPlayerChangedEvent', function(e) {
    gTracker.OnPlayerChange(e);
  });
  addOverlayListener('onZoneChangedEvent', function(e) {
    gTracker.OnZoneChange(e);
  });
  addOverlayListener('onLogEvent', function(e) {
    gTracker.OnLog(e);
  });
  addOverlayListener('onFateEvent', function(e) {
    gTracker.OnFate(e);
  });

  gTracker = new EurekaTracker(Options);
});
