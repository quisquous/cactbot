'use strict';

let Options = {
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
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
          mobName: {
            en: 'Sabotender Corrido',
            de: 'Sabotender Corrido',
            fr: 'Pampa Corrido',
            ja: 'サボテンダー・コリード',
            ko: '사보텐더 춤꾼',
            cn: '科里多仙人刺',
          },
          trackerName: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボテン',
            ko: '사보텐더',
            cn: '仙人掌',
          },
          x: 13.9,
          y: 21.9,
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
          mobName: {
            en: 'The Lord Of Anemos',
            de: 'Prinz Von Anemos',
            fr: 'Seigneur D\'anemos',
            ja: 'ロード・オブ・アネモス',
            ko: '아네모스 대왕',
            cn: '常风领主',
          },
          trackerName: {
            en: 'Lord',
            de: 'Prinz',
            fr: 'Seigneur',
            ja: 'ロード',
            ko: '문어',
            cn: '章鱼',
          },
          x: 29.7,
          y: 27.1,
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
          mobName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            ko: '텔레스',
            cn: '忒勒斯',
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
        },
        emperor: {
          label: {
            en: 'Emp',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'アネモス',
            ko: '잠자리',
            cn: '蜻蜓',
          },
          mobName: {
            en: 'The Emperor Of Anemos',
            de: 'Anemos-Kaiser',
            fr: 'Empereur D\'anemos',
            ja: 'アネモス・エンペラー',
            ko: '아네모스 황제',
            cn: '常风皇帝',
          },
          trackerName: {
            en: 'Emperor',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'エンペラ',
            ko: '잠자리',
            cn: '蜻蜓',
          },
          x: 17.2,
          y: 22.2,
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
          mobName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            ko: '칼리스토',
            cn: '卡利斯托',
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
          mobName: {
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
          mobName: {
            en: 'Jahannam',
            de: 'Jahannam',
            fr: 'Jahannam',
            ja: 'ジャハンナム',
            ko: '자하남',
            cn: '哲罕南',
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
          mobName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
            ko: '아메메트',
            cn: '阿米特',
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
          mobName: {
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
          mobName: {
            en: 'Bombadeel',
            de: 'Bombadeel',
            fr: 'Bombadeel',
            ja: 'ボンバディール',
            ko: '봄바딜',
            cn: '庞巴德',
          },
          trackerName: {
            en: 'Bomba',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバ',
            ko: '봄바딜',
            cn: '举高高',
          },
          x: 28.3,
          y: 20.4,
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
          mobName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '세르케트',
            cn: '塞尔凯特',
          },
          trackerName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '전갈',
            cn: '蝎子',
          },
          x: 24.8,
          y: 17.9,
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
          mobName: {
            en: 'Judgmental Julika',
            de: 'Verurteilende Julika',
            fr: 'Julika',
            ja: 'ジャッジメンタル・ジュリカ',
            ko: '심판관 줄리카',
            cn: '武断魔花茱莉卡',
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
          mobName: {
            en: 'The White Rider',
            de: 'Weißer Reiter',
            fr: 'Cavalier Blanc',
            ja: 'ホワイトライダー',
            ko: '백색 기수',
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
          mobName: {
            en: 'Polyphemus',
            de: 'Polyphemus',
            fr: 'Polyphemus',
            ja: 'ポリュペモス',
            ko: '폴리페모스',
            cn: '波吕斐墨斯',
          },
          trackerName: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリュ',
            ko: '외눈',
            cn: '独眼',
          },
          x: 26.4,
          y: 14.3,
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
          mobName: {
            en: 'Simurgh\'s Strider',
            de: 'Simurghs Läufer',
            fr: 'Trotteur De Simurgh',
            ja: 'シームルグ・ストライダー',
            ko: '한달음 시무르그',
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
          mobName: {
            en: 'King Hazmat',
            de: 'Hazmat-König',
            fr: 'Hazmat Roi',
            ja: 'キング・ハズマット',
            ko: '대왕 하즈마트',
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
          mobName: {
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
          mobName: {
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
          mobName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュトゥ',
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
          mobName: {
            en: 'Pazuzu',
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
        snowqueen: {
          label: {
            en: 'Queen',
            de: 'Schneekönigin',
            fr: 'Reine',
            ja: '女王',
            ko: '눈의 여왕',
            cn: '周冬雨',
          },
          mobName: {
            en: 'The Snow Queen',
            de: 'Schneekönigin',
            fr: 'Reine Des Neiges',
            ja: '雪の女王',
            ko: '눈의 여왕',
            cn: '雪之女王',
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
          mobName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '택심',
            cn: '塔克西姆',
          },
          trackerName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '택심',
            cn: '读书人',
          },
          x: 25.5,
          y: 28.3,
          time: 'Night',
        },
        ashdragon: {
          label: {
            en: 'Dragon',
            de: 'Aschedrache',
            fr: 'Dragon',
            ja: 'ドラゴン',
            ko: '용',
            cn: '灰烬龙',
          },
          mobName: {
            en: 'Ash Dragon',
            de: 'Aschedrache',
            fr: 'Dragon Cendré',
            ja: 'アッシュドラゴン',
            ko: '잿더미 드래곤',
            cn: '灰烬龙',
          },
          trackerName: {
            en: 'Dragon',
            de: 'Drache',
            fr: 'Dragon',
            ja: 'アッシュ',
            ko: '용',
            cn: '灰烬龙',
          },
          x: 29.7,
          y: 30.0,
        },
        glavoid: {
          label: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Graboïde',
            ja: 'グラヴォイド',
            ko: '지렁이',
            cn: '魔虫',
          },
          mobName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Graboïde',
            ja: 'グラヴォイド',
            ko: '그라보이드',
            cn: '异形魔虫',
          },
          trackerName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glaboïde',
            ja: 'グラヴォ',
            ko: '지렁이',
            cn: '魔虫',
          },
          x: 33.0,
          y: 28.0,
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
          mobName: {
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
          weather: 'Fog',
        },
        hakutaku: {
          label: {
            en: 'Haku',
            de: 'Hakutaku',
            fr: 'Haku',
            ja: 'ハクタク',
            ko: '백택',
            cn: '白泽',
          },
          mobName: {
            en: 'Hakutaku',
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
          mobName: {
            en: 'King Igloo',
            de: 'Iglu-König',
            fr: 'Roi Igloo',
            ja: 'キングイグルー',
            ko: '이글루 왕',
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
          mobName: {
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
          mobName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '수라비',
            cn: '苏罗毗',
          },
          trackerName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '염소',
            cn: '山羊',
          },
          x: 10.5,
          y: 20.5,
        },
        kingarthro: {
          label: {
            en: 'Arthro',
            de: 'König Athro',
            fr: 'Arthro',
            ja: 'アースロ',
            ko: '게',
            cn: '螃蟹',
          },
          mobName: {
            en: 'King Arthro',
            de: 'König Athro',
            fr: 'Roi Arthro',
            ja: 'キングアースロ',
            ko: '아스로 왕',
            cn: '亚瑟罗王',
          },
          trackerName: {
            en: 'Arthro',
            de: 'Athro',
            fr: 'Arthro',
            ja: 'アスロ',
            ko: '게',
            cn: '螃蟹',
          },
          x: 8.0,
          y: 15.2,
          weather: 'Fog',
        },
        minotaurs: {
          label: {
            en: 'Minotaurs',
            de: 'Minotauren',
            fr: 'Spiritaure',
            ja: 'ミノタウロス',
            ko: '미노타우루스',
            cn: '双牛',
          },
          mobName: {
            en: 'Mindertaur',
            de: 'Niederer Minotaurus',
            fr: 'Spiritaure',
            ja: 'Mindertaur',
            ko: '호위 타우루스',
            cn: '牛头魔看守',
          },
          trackerName: {
            en: 'Brothers',
            de: 'Brüder',
            fr: 'Frères',
            ja: 'ミノ',
            ko: '미노타우루스',
            cn: '双牛',
          },
          x: 13.8,
          y: 18.4,
        },
        holycow: {
          label: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Vache',
            ja: '聖牛',
            ko: '소',
            cn: '圣牛',
          },
          mobName: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Vache Sacrée D\'Eurêka',
            ja: 'エウレカの聖牛',
            ko: '에우레카의 신성한 소',
            cn: '优雷卡圣牛',
          },
          trackerName: {
            en: 'Holy Cow',
            de: 'Heil',
            fr: 'Vache',
            ja: '聖牛',
            ko: '소',
            cn: '圣牛',
          },
          x: 26,
          y: 16,
        },
        hadhayosh: {
          label: {
            en: 'Hadha',
            de: 'Hadhayosh',
            fr: 'Hadha',
            ja: 'ハダヨッシュ',
            ko: '베히모스',
            cn: '贝爷',
          },
          mobName: {
            en: 'Hadhayosh',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨッシュ',
            ko: '하다요쉬',
            cn: '哈达约什',
          },
          trackerName: {
            en: 'Behe',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨ',
            ko: '베히모스',
            cn: '贝爷',
          },
          weather: 'Thunder',
          x: 30,
          y: 19,
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
          mobName: {
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
          weather: 'Heat Waves',
          x: 26,
          y: 20,
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
          mobName: {
            en: 'Arch Angra Mainyu',
            de: 'Erz-Angra Mainyu',
            fr: 'Archi Angra Mainyu',
            ja: 'アーチ・アンラ・マンユ',
            ko: '우두머리 앙그라 마이뉴',
            cn: '总领安哥拉·曼纽',
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
          mobName: {
            en: 'Copycat Cassie',
            de: 'Kopierende Cassie',
            fr: 'Cassie La Copieuse',
            ja: 'コピーキャット・キャシー',
            ko: '흉내쟁이 캐시',
            cn: '复制魔花凯西',
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
          mobName: {
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
        luecosia: {
          label: {
            en: 'Leuco',
            de: 'Leuko',
            fr: 'Leuco',
            ja: 'レウコ',
            cn: '惨叫',
            ko: '레우코시아',
          },
          mobName: {
            en: 'Leucosia',
            de: 'Leukosia',
            fr: 'Leucosie',
            ja: 'レウコシアー',
            cn: '琉科西亚',
            ko: '레우코시아',
          },
          trackerName: {
            en: 'Leucosia',
            de: 'Leucosia',
            fr: 'Leucosia',
            ja: 'レウコ',
            cn: '惨叫',
            ko: '레우코시아',
          },
          x: 26.8,
          y: 26.3,
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
          mobName: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロス',
            cn: '佛劳洛斯',
            ko: '플라우로스',
          },
          trackerName: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロ',
            cn: '雷兽',
            ko: '플라우로스',
          },
          x: 28.9,
          y: 29.2,
        },
        sophist: {
          label: {
            en: 'Sophist',
            de: 'Sophist',
            fr: 'Sophiste',
            ja: 'ソフィスト',
            cn: '诡辩者',
            ko: '소피스트',
          },
          mobName: {
            en: 'The Sophist',
            de: 'Sophist',
            fr: 'Le Sophiste',
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
            ko: '소피스트',
          },
          x: 31.8,
          y: 31.0,
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
          mobName: {
            en: 'Graffiacane',
            de: 'Graffiacane',
            fr: 'Graffiacane',
            ja: 'グラッフアカーネ',
            cn: '格拉菲亚卡内',
            ko: '그라피아카네',
          },
          trackerName: {
            en: 'Doll',
            de: 'Graff',
            fr: 'Graff',
            ja: 'グラフアカネ',
            cn: '塔塔露',
            ko: '인형',
          },
          x: 23.5,
          y: 37.2,
        },
        askala: {
          label: {
            en: 'Askala',
            de: 'Askala',
            fr: 'Ascala',
            ja: 'アスカラ',
            cn: '阿福',
            ko: '작은 부엉이',
          },
          mobName: {
            en: 'Askalaphos',
            de: 'Askalaphos',
            fr: 'Ascalaphe',
            ja: 'アスカラポス',
            cn: '阿斯卡拉福斯',
            ko: '아스칼라포스',
          },
          trackerName: {
            en: 'Owl',
            de: 'Askala',
            fr: 'Askala',
            ja: 'アスカラ',
            cn: '阿福',
            ko: '작은 부엉이',
          },
          x: 19.3,
          y: 29.0,
          weather: 'Umbral Wind',
        },
        batym: {
          label: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Batime',
            ja: 'パティム',
            cn: '大公',
            ko: '대공',
          },
          mobName: {
            en: 'Grand Duke Batym',
            de: 'Großherzog Batym',
            fr: 'Batime Le Grand Duc',
            ja: 'グランドデューク・パティム',
            cn: '巴钦大公爵',
            ko: '바팀 대공',
          },
          trackerName: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Duc Batym',
            ja: 'デューク',
            cn: '大公',
            ko: '대공',
          },
          x: 18.0,
          y: 14.1,
          time: 'Night',
        },
        aetolus: {
          label: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolos',
            ja: 'アイトロス',
            cn: '雷鸟',
            ko: '아이톨로스',
          },
          mobName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolos',
            ja: 'アイトロス',
            cn: '埃托洛斯',
            ko: '아이톨로스',
          },
          trackerName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
            cn: '雷鸟',
            ko: '아이톨로스',
          },
          x: 10.0,
          y: 14.0,
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
          mobName: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'Lesath',
            ja: 'レサト',
            cn: '来萨特',
            ko: '레사트',
          },
          trackerName: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'Lesath',
            ja: 'レサト',
            cn: '蝎子',
            ko: '전갈',
          },
          x: 13.2,
          y: 11.2,
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
          mobName: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
            cn: '火巨人',
            ko: '엘드투르스',
          },
          trackerName: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
            cn: '火巨人',
            ko: '구부',
          },
          x: 15.3,
          y: 6.8,
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
          mobName: {
            en: 'Iris',
            de: 'Iris',
            fr: 'Iris',
            ja: 'イリス',
            cn: '伊丽丝',
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
          mobName: {
            en: 'Lamebrix Strikebocks',
            de: 'Wüterix der Söldner',
            fr: 'Lamebrix Le Mercenaire',
            ja: '傭兵のレイムプリクス',
            cn: '佣兵雷姆普里克斯',
            ko: '용병 레임브릭스',
          },
          trackerName: {
            en: 'Lamebrix',
            de: 'Wüterix',
            fr: 'Lamebrix',
            ja: 'ゴブ',
            cn: '哥布林',
            ko: '레임브릭스',
          },
          x: 21.9,
          y: 8.3,
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
          mobName: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux De La Foudre',
            ja: 'ライトニング・ドゥクス',
            cn: '闪电督军',
            ko: '번개 사령관',
          },
          trackerName: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux',
            ja: 'ドゥクス',
            cn: '雷军',
            ko: '번개 사령관',
          },
          x: 27.4,
          y: 8.8,
          weather: 'Thunder',
        },
        jack: {
          label: {
            en: 'Jack',
            de: 'Weide',
            fr: 'Bûcheron',
            ja: 'ジャック',
            cn: '树人',
            ko: '럼버잭',
          },
          mobName: {
            en: 'The Weeping Willow',
            de: 'Trauerweide',
            fr: 'Saule Pleureur',
            ja: 'ランバージャック・デスマッチ',
            cn: '垂柳树人',
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
          mobName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukôpis',
            ja: 'グラウコピス',
            cn: '明眸',
            ko: '글라우코피스',
          },
          trackerName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukopis',
            ja: 'グラウコ',
            cn: '明眸',
            ko: '큰 부엉이',
          },
          x: 32.3,
          y: 15.1,
        },
        yingyang: {
          label: {
            en: 'Ying-Yang',
            de: 'Yin-Yang',
            fr: 'Yin-Yang',
            ja: 'イン・ヤン',
            cn: '阴·阳',
            ko: '음양',
          },
          mobName: {
            en: 'Ying-Yang',
            de: 'Yin-Yang',
            fr: 'Yin-Yang',
            ja: 'イン・ヤン',
            cn: '阴·阳',
            ko: '음과 양',
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
          mobName: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Sköll',
            ja: 'スコル',
            cn: '斯库尔',
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
          mobName: {
            en: 'Penthesilea',
            de: 'Penthesilea',
            fr: 'Penthesilée',
            ja: 'ペンテシレイア',
            cn: '彭忒西勒亚',
            ko: '펜테실레이아',
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
        khalamari: {
          label: {
            en: 'Khala',
            de: 'Kala',
            fr: 'Khala',
            ja: 'カラマリ',
            cn: '墨鱼',
            ko: '칼라마리',
          },
          mobName: {
            en: 'Khalamari',
            de: 'Kalamari',
            fr: 'Khalamar',
            ja: 'Khalamari',
            cn: '卡拉墨鱼',
            ko: '칼라마리',
          },
          trackerName: {
            en: 'Khalamari',
            de: 'Kalamari',
            fr: 'Khalamari',
            ja: 'カラマリ',
            cn: '墨鱼',
            ko: '칼라마리',
          },
          x: 11.1,
          y: 24.9,
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
          mobName: {
            en: 'Stegodon',
            de: 'Stegodon',
            fr: 'Stegodon',
            ja: 'ステゴドン',
            cn: '剑齿象',
            ko: '스테고돈',
          },
          trackerName: {
            en: 'Stegodon',
            de: 'Stegodon',
            fr: 'Stegodon',
            ja: 'ステゴドン',
            cn: '象',
            ko: '스테고돈',
          },
          x: 9.3,
          y: 18.2,
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
          mobName: {
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
          mobName: {
            en: 'Piasa',
            de: 'Piasa',
            fr: 'Piasa',
            ja: 'ピアサ',
            cn: '皮艾萨邪鸟',
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
        },
        frostmane: {
          label: {
            en: 'Frost',
            de: 'Frost',
            fr: 'Crinière',
            ja: 'フロストメーン',
            cn: '老虎',
            ko: '서리갈기',
          },
          mobName: {
            en: 'Frostmane',
            de: 'Frosticore',
            fr: 'Crinière-de-givre',
            ja: 'フロストメーン',
            cn: '霜鬃猎魔',
            ko: '서리갈기',
          },
          trackerName: {
            en: 'Frostmane',
            de: 'Frosti',
            fr: 'Crinière',
            ja: 'フロスト',
            cn: '老虎',
            ko: '서리갈기',
          },
          x: 8.1,
          y: 26.4,
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
          mobName: {
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
          mobName: {
            en: 'King Goldemar',
            de: 'König Goldemar',
            fr: 'Roi Goldmar',
            ja: 'キング・ゴルデマール',
            cn: '戈尔德马尔王',
            ko: '골데마르 왕',
          },
          trackerName: {
            en: 'Golde',
            de: 'Golde',
            fr: 'Goldemar',
            ja: 'キング',
            cn: '马王',
            ko: '골데마르',
          },
          x: 28.9,
          y: 23.9,
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
          mobName: {
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
          mobName: {
            en: 'Barong',
            de: 'Baron Feuermähne',
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
          mobName: {
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
          mobName: {
            en: 'Provenance Watcher',
            de: 'Kristallwächter',
            fr: 'Gardien De Provenance',
            ja: 'プロヴェナンス・ウォッチャー',
            cn: '起源守望者',
            ko: '기원 관찰자',
          },
          trackerName: {
            en: 'PW',
            de: 'Wächter',
            fr: 'Gardien',
            ja: 'ウォッチャ',
            cn: '守望者',
            ko: '수정룡',
          },
          x: 32.7,
          y: 19.5,
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
          mobName: {
            en: 'Ovni',
            de: 'Ovni',
            fr: 'Ovni',
            ja: 'オヴニ',
            cn: '未确认飞行物体',
            ko: '오브니',
          },
          trackerName: {
            en: 'Ovni',
            de: 'Ovni',
            fr: 'Ovni',
            ja: 'オヴニ',
            cn: '武器库',
            ko: '오브니',
          },
          x: 26.8,
          y: 29.0,
          respawnMinutes: 20,
        },
        tristicia: {
          label: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
            cn: '光灵鳐',
            ko: '트리스티샤',
          },
          mobName: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
            cn: '伤悲光灵鳐',
            ko: '트리스티샤',
          },
          spawnTrigger: {
            en: '00:0839:An avatar of Absolute Virtue has manifested somewhere in Hydatos',
            de: '00:0839:Ein Avatar der Absoluten Tugend ist irgendwo in Hydatos aufgetaucht',
            cn: '00:0839:绝对的美德的分身出现在了丰水地带某处',
            ko: '00:0839:절대미덕의 분열체가 히다토스 지대 어딘가에 나타났습니다!',
          },
          trackerName: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
            cn: '伤悲光灵鳐',
            ko: '트리스티샤',
          },
          x: 18.7,
          y: 29.7,
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

  InitNMs() {
    this.nms = this.options.ZoneInfo[this.zoneName].nms;
    this.nmKeys = Object.keys(this.nms);

    let container = document.getElementById('nm-labels');

    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];

      let label = document.createElement('div');
      label.classList.add('nm');
      label.id = this.nmKeys[i];

      this.SetStyleFromMap(label.style, nm.x, nm.y);

      let icon = document.createElement('span');
      icon.classList.add('nm-icon');
      let name = document.createElement('span');
      name.classList.add('nm-name');
      name.classList.add('text');
      name.innerText = nm.label[this.options.Language];
      let time = document.createElement('span');
      time.classList.add('nm-time');
      time.classList.add('text');
      label.appendChild(icon);
      label.appendChild(name);
      label.appendChild(time);
      container.appendChild(label);

      nm.element = label;
      nm.timeElement = time;
      let mobName = nm.mobName[this.options.Language];
      if (nm.spawnTrigger && nm.spawnTrigger[this.options.Language])
        nm.addRegex = Regexes.parse(nm.spawnTrigger[this.options.Language]);
      if (!nm.addRegex)
        nm.addRegex = Regexes.parse('03:\\y{ObjectId}:Added new combatant ' + mobName + '\\.');
      nm.removeRegex = Regexes.parse('04:\\y{ObjectId}:Removing combatant ' + mobName + '\\.');
      nm.respawnTimeMsLocal = undefined;
      nm.respawnTimeMsTracker = undefined;
    }

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

  OnPopNM(nm) {
    let now = +new Date();
    if (nm.lastPopTimeMsLocal && now - nm.lastPopTimeMsLocal <= this.options.SuppressPopMs)
      return;


    nm.element.classList.add('nm-pop');
    nm.element.classList.remove('nm-down');
    let respawnTimeMs = 120 * 60 * 1000;
    nm.lastPopTimeMsLocal = +new Date();
    nm.respawnTimeMsLocal = this.RespawnTime(nm);

    if (this.options.PopSound && this.options.PopVolume) {
      let audio = new Audio(this.options.PopSound);
      audio.volume = this.options.PopVolume;
      audio.play();
    }
  }

  OnKillNM(nm) {
    nm.element.classList.remove('nm-pop');
    this.UpdateTimes();
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
    let timeVal;
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
        for (let i = 0; i < this.nmKeys.length; ++i) {
          let nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.addRegex)) {
            this.OnPopNM(nm);
            continue;
          }
        }

        match = log.match(this.fairy.regex);
        if (match)
          this.AddFairy(match[1], match[2], match[3]);
      }
      if (log.indexOf(' 04:') >= 0) {
        for (let i = 0; i < this.nmKeys.length; ++i) {
          let nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.removeRegex)) {
            this.OnKillNM(nm);
            continue;
          }
        }
      }
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

  gTracker = new EurekaTracker(Options);
});
