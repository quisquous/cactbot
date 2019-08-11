'use strict';

let Options = {
  Language: 'en',
  RefreshRateMs: 1000,
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  PopVolume: 1.0,
  // 20 minutes for Ovni?
  SuppressPopMs: 60 * 20 * 1000,
  FlagTimeoutMs: 90000,
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
      },
      nms: {
        sabo: {
          label: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボ',
            ko: '사보텐더',
          },
          mobName: {
            en: 'Sabotender Corrido',
            de: 'Sabotender Corrido',
            fr: 'Pampa Corrido',
            ja: 'サボテンダー・コリード',
            ko: '사보텐더 춤꾼',
          },
          trackerName: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボテンダー',
            ko: '사보텐더',
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
          },
          mobName: {
            en: 'The Lord Of Anemos',
            de: 'Prinz Von Anemos',
            fr: 'Seigneur D\'anemos',
            ja: 'ロード・オブ・アネモス',
            ko: '아네모스 대왕',
          },
          trackerName: {
            en: 'Lord',
            de: 'Prinz[p]',
            fr: 'Seigneur',
            ja: 'ロード',
            ko: '문어',
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
          },
          mobName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            ko: '텔레스',
          },
          trackerName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            ko: '텔레스',
          },
          x: 25.6,
          y: 27.4,
        },
        emperor: {
          label: {
            en: 'Emp',
            de: 'Kaiser',
            fr: 'Emp',
            ja: 'アネモス',
            ko: '잠자리',
          },
          mobName: {
            en: 'The Emperor Of Anemos',
            de: 'Anemos-Kaiser',
            fr: 'Empereur D\'anemos',
            ja: 'アネモス・エンペラー',
            ko: '아네모스 황제',
          },
          trackerName: {
            en: 'Emperor',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'アネモス',
            ko: '잠자리',
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
          },
          mobName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            ko: '칼리스토',
          },
          trackerName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            ko: '칼리스토',
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
          },
          mobName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
            ko: '넘버즈',
          },
          trackerName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
            ko: '넘버즈',
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
          },
          mobName: {
            en: 'Jahannam',
            de: 'Jahannam',
            fr: 'Jahannam',
            ja: 'ジャハンナム',
            ko: '자하남',
          },
          trackerName: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jaha',
            ja: 'ジャハンナム',
            ko: '자하남',
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
          },
          mobName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
            ko: '아메메트',
          },
          trackerName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
            ko: '아메메트',
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
          },
          mobName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
            ko: '카임',
          },
          trackerName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
            ko: '카임',
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
          },
          mobName: {
            en: 'Bombadeel',
            de: 'Bombadeel',
            fr: 'Bombadeel',
            ja: 'ボンバディール',
            ko: '봄바딜',
          },
          trackerName: {
            en: 'Bomba',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバディール',
            ko: '봄바딜',
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
            ko: '세르케트',
          },
          mobName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '세르케트',
          },
          trackerName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            ko: '세르케트',
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
          },
          mobName: {
            en: 'Judgmental Julika',
            de: 'Verurteilende Julika',
            fr: 'Julika',
            ja: 'ジャッジメンタル・ジュリカ',
            ko: '심판관 줄리카',
          },
          trackerName: {
            en: 'Julika',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
            ko: '줄리카',
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
          },
          mobName: {
            en: 'The White Rider',
            de: 'Weißer Reiter',
            fr: 'Cavalier Blanc',
            ja: 'ホワイトライダー',
            ko: '백색 기수',
          },
          trackerName: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ホワイトライダー',
            ko: '기수',
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
          },
          mobName: {
            en: 'Polyphemus',
            de: 'Polyphemus',
            fr: 'Polyphemus',
            ja: 'ポリュペモス',
            ko: '폴리페모스',
          },
          trackerName: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリュペモス',
            ko: '외눈',
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
          },
          mobName: {
            en: 'Simurgh\'s Strider',
            de: 'Simurghs Läufer',
            fr: 'Trotteur De Simurgh',
            ja: 'シームルグ・ストライダー',
            ko: '한달음 시무르그',
          },
          trackerName: {
            en: 'Strider',
            de: 'Simurghs',
            fr: 'Simurgh',
            ja: 'シームルグ',
            ko: '즈',
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
          },
          mobName: {
            en: 'King Hazmat',
            de: 'Hazmat-König',
            fr: 'Hazmat Roi',
            ja: 'キング・ハズマット',
            ko: '대왕 하즈마트',
          },
          trackerName: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマット',
            ko: '하즈마트',
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
          },
          mobName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
            ko: '파프니르',
          },
          trackerName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
            ko: '파프니르',
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
          },
          mobName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
            ko: '아마록',
          },
          trackerName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
            ko: '아마록',
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
          },
          mobName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュトゥ',
            ko: '라마슈투',
          },
          trackerName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュトゥ',
            ko: '라마슈투',
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
          },
          mobName: {
            en: 'Pazuzu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
            ko: '파주주',
          },
          trackerName: {
            en: 'Pazuzu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
            ko: '파주주',
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
      },
      nms: {
        snowqueen: {
          label: {
            en: 'Queen',
            de: 'Schneekönigin',
            fr: 'Snow Queen',
            ja: '女王',
            ko: '눈의 여왕',
          },
          mobName: {
            en: 'The Snow Queen',
            de: 'Schneekönigin',
            fr: 'The Snow Queen',
            ja: '雪の女王',
            ko: '눈의 여왕',
          },
          trackerName: {
            en: 'Snow Queen',
            de: 'Snow Queen',
            fr: 'Snow Queen',
            ja: '女王',
            ko: '눈의 여왕',
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
          },
          mobName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '택심',
          },
          trackerName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '택심',
          },
          x: 25.5,
          y: 28.3,
          time: 'Night',
        },
        ashdragon: {
          label: {
            en: 'Dragon',
            de: 'Aschedrache',
            fr: 'Ash Dragon',
            ja: 'ドラゴン',
            ko: '용',
          },
          mobName: {
            en: 'Ash Dragon',
            de: 'Aschedrache',
            fr: 'Ash Dragon',
            ja: 'アッシュドラゴン',
            ko: '잿빛 드래곤',
          },
          trackerName: {
            en: 'Ash Dragon',
            de: 'Ash Dragon',
            fr: 'Ash Dragon',
            ja: 'アッシュドラゴン',
            ko: '잿빛 드래곤',
          },
          x: 29.7,
          y: 30.0,
        },
        glavoid: {
          label: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glavoid',
            ja: 'グラヴォイド',
            ko: '지렁이',
          },
          mobName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glavoid',
            ja: 'グラヴォイド',
            ko: '그라보이드',
          },
          trackerName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Glavoid',
            ja: 'グラヴォイド',
            ko: '그라보이드',
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
          },
          mobName: {
            en: 'Anapos',
            de: 'Anapo',
            fr: 'Anapos',
            ja: 'アナポ',
            ko: '아나포',
          },
          trackerName: {
            en: 'Anapos',
            de: 'Anapos',
            fr: 'Anapos',
            ja: 'アナポ',
            ko: '아나포',
          },
          x: 33.0,
          y: 21.5,
          weather: 'Fog',
        },
        hakutaku: {
          label: {
            en: 'Haku',
            de: 'Hakutaku',
            fr: 'Hakutaku',
            ja: 'ハクタク',
            ko: '백택',
          },
          mobName: {
            en: 'Hakutaku',
            de: 'Hakutaku',
            fr: 'Hakutaku',
            ja: 'ハクタク',
            ko: '백택',
          },
          trackerName: {
            en: 'Hakutaku',
            de: 'Hakutaku',
            fr: 'Hakutaku',
            ja: 'ハクタク',
            ko: '백택',
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
          },
          mobName: {
            en: 'King Igloo',
            de: 'Iglu-König',
            fr: 'King Igloo',
            ja: 'キングイグルー',
            ko: '이글루 왕',
          },
          trackerName: {
            en: 'Igloo',
            de: 'Igloo',
            fr: 'Igloo',
            ja: 'イグル',
            ko: '이글루',
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
          },
          mobName: {
            en: 'Asag',
            de: 'Asag',
            fr: 'Asag',
            ja: 'アサグ',
            ko: '아사그',
          },
          trackerName: {
            en: 'Asag',
            de: 'Asag',
            fr: 'Asag',
            ja: 'アサグ',
            ko: '아사그',
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
          },
          mobName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '수라비',
          },
          trackerName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            ko: '수라비',
          },
          x: 10.5,
          y: 20.5,
        },
        kingarthro: {
          label: {
            en: 'Arthro',
            de: 'König Athro',
            fr: 'King Arthro',
            ja: 'アースロ',
            ko: '게',
          },
          mobName: {
            en: 'King Arthro',
            de: 'König Athro',
            fr: 'King Arthro',
            ja: 'キングアースロ',
            ko: '아스로 왕',
          },
          trackerName: {
            en: 'King Arthro',
            de: 'King Arthro',
            fr: 'King Arthro',
            ja: 'キングアースロ',
            ko: '아스로 왕',
          },
          x: 8.0,
          y: 15.2,
          weather: 'Fog',
        },
        minotaurs: {
          label: {
            en: 'Minotaurs',
            de: 'Minotauren',
            fr: 'Minotaurs',
            ja: 'ミノタウロス',
            ko: '미노타우루스',
          },
          mobName: {
            en: 'Mindertaur',
            de: 'Niederer Minotaurus',
            fr: 'Mindertaur',
            ja: 'Mindertaur',
            ko: '호위 타우루스',
          },
          trackerName: {
            en: 'Minotaurs',
            de: 'Minotaurs',
            fr: 'Minotaurs',
            ja: 'ミノタウロス',
            ko: '미노타우로스',
          },
          x: 13.8,
          y: 18.4,
        },
        holycow: {
          label: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Holy Cow',
            ja: '聖牛',
            ko: '소',
          },
          mobName: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Holy Cow',
            ja: 'エウレカの聖牛',
            ko: '에우레카의 신성한 소',
          },
          trackerName: {
            en: 'Holy Cow',
            de: 'Holy Cow',
            fr: 'Holy Cow',
            ja: 'エウレカの聖牛',
            ko: '소',
          },
          x: 26,
          y: 16,
        },
        hadhayosh: {
          label: {
            en: 'Hadha',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨッシュ',
            ko: '베히모스',
          },
          mobName: {
            en: 'Hadhayosh',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨッシュ',
            ko: '하다요쉬',
          },
          trackerName: {
            en: 'Hadhayosh',
            de: 'Hadhayosh',
            fr: 'Hadhayosh',
            ja: 'ハダヨッシュ',
            ko: '베히모스',
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
          },
          mobName: {
            en: 'Horus',
            de: 'Horus',
            fr: 'Horus',
            ja: 'ホルス',
            ko: '호루스',
          },
          trackerName: {
            en: 'Horus',
            de: 'Horus',
            fr: 'Horus',
            ja: 'ホルス',
            ko: '호루스',
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
            ko: '앙그라',
          },
          mobName: {
            en: 'Arch Angra Mainyu',
            de: 'Erz-Angra Mainyu',
            fr: 'Arch Angra Mainyu',
            ja: 'アーチ・アンラ・マンユ',
            ko: '우두머리 앙그라 마이뉴',
          },
          trackerName: {
            en: 'Mainyu',
            de: 'Mainyu',
            fr: 'Mainyu',
            ja: 'マンユ',
            ko: '앙그라',
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
          },
          mobName: {
            en: 'Copycat Cassie',
            de: 'Kopierende Cassie',
            fr: 'Copycat Cassie',
            ja: 'コピーキャット・キャシー',
            ko: '변덕쟁이 캐시',
          },
          trackerName: {
            en: 'Cassie',
            de: 'Cassie',
            fr: 'Cassie',
            ja: 'キャシ',
            ko: '캐시',
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
          },
          mobName: {
            en: 'Louhi',
            de: 'Louhi',
            fr: 'Louhi',
            ja: 'ロウヒ',
            ko: '로우히',
          },
          trackerName: {
            en: 'Louhi',
            de: 'Louhi',
            fr: 'Louhi',
            ja: 'ロウヒ',
            ko: '로우히',
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
      },
      nms: {
        luecosia: {
          label: {
            en: 'Leuco',
            de: 'Leuko',
            fr: 'Leuco',
            ja: 'レウコ',
          },
          mobName: {
            en: 'Leucosia',
            de: 'Leukosia',
            fr: 'Leucosia',
            ja: 'レウコシアー',
          },
          trackerName: {
            en: 'Leucosia',
            de: 'Leucosia',
            fr: 'Leucosia',
            ja: 'レウコ',
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
          },
          mobName: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロス',
          },
          trackerName: {
            en: 'Flauros',
            de: 'Flauros',
            fr: 'Flauros',
            ja: 'フラウロス',
          },
          x: 28.9,
          y: 29.2,
        },
        sophist: {
          label: {
            en: 'Sophist',
            de: 'Sophist',
            fr: 'Sophist',
            ja: 'ソフィスト',
          },
          mobName: {
            en: 'The Sophist',
            de: 'Sophist',
            fr: 'The Sophist',
            ja: 'ソフィスト',
          },
          trackerName: {
            en: 'Sophist',
            de: 'Sophist',
            fr: 'Sophist',
            ja: 'ソフィスト',
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
          },
          mobName: {
            en: 'Graffiacane',
            de: 'Graffiacane',
            fr: 'Graffiacane',
            ja: 'グラッフアカーネ',
          },
          trackerName: {
            en: 'Graff',
            de: 'Graff',
            fr: 'Graff',
            ja: 'グラフアカネ',
          },
          x: 23.5,
          y: 37.2,
        },
        askala: {
          label: {
            en: 'Askala',
            de: 'Askala',
            fr: 'Askala',
            ja: 'アスカラ',
          },
          mobName: {
            en: 'Askalaphos',
            de: 'Askalaphos',
            fr: 'Askalaphos',
            ja: 'アスカラポス',
          },
          trackerName: {
            en: 'Askala',
            de: 'Askala',
            fr: 'Askala',
            ja: 'アスカラ',
          },
          x: 19.3,
          y: 29.0,
          weather: 'Umbral Wind',
        },
        batym: {
          label: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Batym',
            ja: 'パティム',
          },
          mobName: {
            en: 'Grand Duke Batym',
            de: 'Großherzog Batym',
            fr: 'Grand Duke Batym',
            ja: 'グランドデューク・パティム',
          },
          trackerName: {
            en: 'Duke Batym',
            de: 'Duke Batym',
            fr: 'Duke Batym',
            ja: 'デュークパティム',
          },
          x: 18.0,
          y: 14.1,
          time: 'Night',
        },
        aetolus: {
          label: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
          },
          mobName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
          },
          trackerName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolus',
            ja: 'アイトロス',
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
          },
          mobName: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'レサト',
            ja: 'Lesath',
          },
          trackerName: {
            en: 'Lesath',
            de: 'Lesath',
            fr: 'Lesath',
            ja: 'レサト',
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
          },
          mobName: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
          },
          trackerName: {
            en: 'Eldthurs',
            de: 'Eldthurs',
            fr: 'Eldthurs',
            ja: 'エルドスルス',
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
          },
          mobName: {
            en: 'Iris',
            de: 'Iris',
            fr: 'Iris',
            ja: 'イリス',
          },
          trackerName: {
            en: 'Iris',
            de: 'Iris',
            fr: 'Iris',
            ja: 'イリス',
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
          },
          mobName: {
            en: 'Lamebrix Strikebocks',
            de: 'Wüterix der Söldner',
            fr: 'Lamebrix Strikebocks',
            ja: '傭兵のレイムプリクス',
          },
          trackerName: {
            en: 'Lamebrix',
            de: 'Lamebrix',
            fr: 'Lamebrix',
            ja: 'レイムプリクス',
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
          },
          mobName: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux',
            ja: 'ライトニング・ドゥクス',
          },
          trackerName: {
            en: 'Dux',
            de: 'Dux',
            fr: 'Dux',
            ja: 'ドゥクス',
          },
          x: 27.4,
          y: 8.8,
          weather: 'Thunder',
        },
        jack: {
          label: {
            en: 'Jack',
            de: 'Weide',
            fr: 'Jack',
            ja: 'ジャック',
          },
          mobName: {
            en: 'The Weeping Willow',
            de: 'Trauerweide',
            fr: 'Lumber Jack',
            ja: 'ランバージャック・デスマッチ',
          },
          trackerName: {
            en: 'Jack',
            de: 'Jack',
            fr: 'Jack',
            ja: 'ランバージャック',
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
          },
          mobName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukopis',
            ja: 'グラウコピス',
          },
          trackerName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukopis',
            ja: 'グラウコピス',
          },
          x: 32.3,
          y: 15.1,
        },
        yingyang: {
          label: {
            en: 'Ying-Yang',
            de: 'Yin-Yang',
            fr: 'Ying-Yang',
            ja: 'イン・ヤン',
          },
          mobName: {
            en: 'Ying-Yang',
            de: 'Yin-Yang',
            fr: 'Ying-Yang',
            ja: 'イン・ヤン',
          },
          trackerName: {
            en: 'Ying-Yang',
            de: 'Ying-Yang',
            fr: 'Ying-Yang',
            ja: 'インヤン',
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
          },
          mobName: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Skoll',
            ja: 'スコル',
          },
          trackerName: {
            en: 'Skoll',
            de: 'Skoll',
            fr: 'Skoll',
            ja: 'スコル',
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
          },
          mobName: {
            en: 'Penthesilea',
            de: 'Penthesilea',
            fr: 'Penthesilea',
            ja: 'ペンテシレイア',
          },
          trackerName: {
            en: 'Penthesilea',
            de: 'Penthesilea',
            fr: 'Penthesilea',
            ja: 'ペンテ',
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
      },
      nms: {
        khalamari: {
          label: {
            en: 'Khala',
            de: 'Kala',
            fr: 'Khala',
            ja: 'カラマリ',
          },
          mobName: {
            en: 'Khalamari',
            de: 'Kalamari',
            fr: 'Khalamari',
            ja: 'Khalamari',
          },
          trackerName: {
            en: 'Khalamari',
            de: 'Kalamari',
            fr: 'Khalamar',
            ja: 'カラマリ',
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
          },
          mobName: {
            en: 'Stegodon',
            de: 'Stegodon',
            fr: 'Stegodon',
            ja: 'ステゴドン',
          },
          trackerName: {
            en: 'Stegodon',
            de: 'Stegodon',
            fr: 'Stegodon',
            ja: 'ステゴドン',
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
          },
          mobName: {
            en: 'Molech',
            de: 'Molek',
            fr: 'Molech',
            ja: 'モレク',
          },
          trackerName: {
            en: 'Molech',
            de: 'Molek',
            fr: 'Molech',
            ja: 'モレク',
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
          },
          mobName: {
            en: 'Piasa',
            de: 'Piasa',
            fr: 'Piasa',
            ja: 'ピアサ',
          },
          trackerName: {
            en: 'Piasa',
            de: 'Piasa',
            fr: 'Piasa',
            ja: 'ピアサ',
          },
          x: 7.1,
          y: 14.1,
        },
        frostmane: {
          label: {
            en: 'Frost',
            de: 'Frost',
            fr: 'Frost',
            ja: 'フロストメーン',
          },
          mobName: {
            en: 'Frostmane',
            de: 'Frosticore',
            fr: 'Crinière-de-givre',
            ja: 'フロストメーン',
          },
          trackerName: {
            en: 'Frostmane',
            de: 'Frosticore',
            fr: 'Crinière-de-givre',
            ja: 'フロストメーン',
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
          },
          mobName: {
            en: 'Daphne',
            de: 'Daphne',
            fr: 'Daphné',
            ja: 'ダフネ',
          },
          trackerName: {
            en: 'Daphne',
            de: 'Daphne',
            fr: 'Daphné',
            ja: 'ダフネ',
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
          },
          mobName: {
            en: 'King Goldemar',
            de: 'König Goldemar',
            fr: 'Roi Goldemar',
            ja: 'キング・ゴルデマール',
          },
          trackerName: {
            en: 'King Goldemar',
            de: 'König Goldemar',
            fr: 'Roi Goldemar',
            ja: 'キング・ゴルデマール',
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
          },
          mobName: {
            en: 'Leuke',
            de: 'Leukea',
            fr: 'Leuke',
            ja: 'レウケー',
          },
          trackerName: {
            en: 'Leuke',
            de: 'Leukea',
            fr: 'Leuke',
            ja: 'レウケー',
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
          },
          mobName: {
            en: 'Barong',
            de: 'Baron Feuermähne',
            fr: 'Barong',
            ja: 'バロン',
          },
          trackerName: {
            en: 'Barong',
            de: 'Baron Feuermähne',
            fr: 'Barong',
            ja: 'バロン',
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
          },
          mobName: {
            en: 'Ceto',
            de: 'Ceto',
            fr: 'Ceto',
            ja: 'ケートー',
          },
          trackerName: {
            en: 'Ceto',
            de: 'Ceto',
            fr: 'Ceto',
            ja: 'ケートー',
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
          },
          mobName: {
            en: 'Provenance Watcher',
            de: 'Kristallwächter',
            fr: 'gardien de Provenance',
            ja: 'プロヴェナンス・ウォッチャー',
          },
          trackerName: {
            en: 'Provenance Watcher',
            de: 'Kristallwächter',
            fr: 'Provenance Watcher',
            ja: 'プロヴェナンス・ウォッチャー',
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
          },
          mobName: {
            en: 'Ovni',
            de: 'Ovni',
            fr: 'Ovni',
            ja: 'オヴニ',
          },
          trackerName: {
            en: 'Ovni',
            de: 'Ovni',
            fr: 'Ovni',
            ja: 'オヴニ',
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
          },
          mobName: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
          },
          spawnTrigger: {
            en: '00:0839:An avatar of Absolute Virtue has manifested somewhere in Hydatos',
            de: '00:0839:Ein Avatar der Absoluten Tugend ist irgendwo in Hydatos aufgetaucht',
          },
          trackerName: {
            en: 'Tristitia',
            de: 'Tristitia',
            fr: 'Tristitia',
            ja: 'トリスティシア',
          },
          x: 18.7,
          y: 29.7,
          respawnMinutes: 20,
        },
      },
    },
  },
};

let gFlagRegex = Regexes.Parse(/00:00..:(.*)Eureka (?:Anemos|Pagos|Pyros|Hydatos) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/);
let gTrackerRegex = Regexes.Parse(/(?:https:\/\/)?ffxiv-eureka\.com\/(?!maps\/)(\S*)\/?/);
let gImportRegex = Regexes.Parse(/00:00..:(.*)NMs on cooldown: (\S.*\))/);
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
        nm.addRegex = Regexes.Parse(nm.spawnTrigger[this.options.Language]);
      if (!nm.addRegex)
        nm.addRegex = Regexes.Parse('03:\\y{ObjectId}:Added new combatant ' + mobName + '\\.');
      nm.removeRegex = Regexes.Parse('04:\\y{ObjectId}:Removing combatant ' + mobName + '\\.');
      nm.respawnTimeMsLocal = undefined;
      nm.respawnTimeMsTracker = undefined;
    }

    this.fairy = this.options.ZoneInfo[this.zoneName].fairy;
    let fairyName = this.fairy[this.options.Language];
    this.fairy.regex = Regexes.Parse('03:\\y{ObjectId}:Added new combatant (' + fairyName + ')\\. .* ' +
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
          respawnIcon = gWeatherIcons[nm.weather]; ;
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

    let regex = Regexes.Parse(/(.*) \((\d*)m\)/);
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
      let match = log.match(gFlagRegex);
      if (match)
        this.AddFlag(match[2], match[3], match[1], match[4]);

      match = log.match(gTrackerRegex);
      if (match)
        this.currentTracker = match[1];

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
      train: [
        'train',
        'tren',
        'trian',
        'tran',
        'choo choo',
        'train location',
      ],
      fairy: [
        'fairy',
        'elemental',
        'faerie',
        'fary',
      ],
      raise: [
        'raise',
        'rez',
        'res ',
        ' res',
        'raise plz',
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
    // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/160
    beforeText = beforeText.replace(/[^\x00-\x7F]/g, '').trim();
    afterText = afterText.replace(/[^\x00-\x7F]/g, '').trim();

    beforeText = beforeText.replace(/(?: at|@)$/, '');

    let simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }

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
