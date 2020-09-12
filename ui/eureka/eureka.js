'use strict';

let bunnyLabel = {
  en: 'Bunny',
  de: 'Hase',
  fr: 'Lapin',
  ja: 'うさぎ',
  ko: '토끼',
  cn: '兔子',
};

let Options = {
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  BunnyPopSound: '../../resources/sounds/WeakAuras/WaterDrop.ogg',
  timeStrings: {
    weatherFor: {
      en: (nowMs, stopTime) => {
        if (stopTime) {
          let min = (stopTime - nowMs) / 1000 / 60;
          return ' for ' + Math.ceil(min) + 'm';
        }
        return ' for ???';
      },
      de: (nowMs, stopTime) => {
        if (stopTime) {
          let min = (stopTime - nowMs) / 1000 / 60;
          return ' für ' + Math.ceil(min) + 'min';
        }
        return ' für ???';
      },
      fr: (nowMs, stopTime) => {
        if (stopTime) {
          let min = (stopTime - nowMs) / 1000 / 60;
          return ' pour ' + Math.ceil(min) + ' min ';
        }
        return ' pour ???';
      },
      ko: (nowMs, stopTime) => {
        if (stopTime) {
          let min = (stopTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '분 동안';
        }
        return ' ??? 동안';
      },
      cn: (nowMs, stopTime) => {
        if (stopTime) {
          let min = (stopTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '分钟后结束';
        }
        return ' ??? 分钟';
      },
    },
    weatherIn: {
      en: (nowMs, startTime) => {
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          return ' in ' + Math.ceil(min) + 'm';
        }
        return ' in ???';
      },
      de: (nowMs, startTime) => {
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          return ' in ' + Math.ceil(min) + 'min';
        }
        return ' in ???';
      },
      fr: (nowMs, startTime) => {
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          return ' dans ' + Math.ceil(min) + ' min ';
        }
        return ' dans ???';
      },
      ko: (nowMs, startTime) => {
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '분 후';
        }
        return ' ??? 후';
      },
      cn: (nowMs, startTime) => {
        if (startTime) {
          let min = (startTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '分钟后';
        }
        return ' ??? 后';
      },
    },
    timeFor: {
      en: (dayNightMin) => {
        return ' for ' + dayNightMin + 'm';
      },
      de: (dayNightMin) => {
        return ' für ' + dayNightMin + 'min';
      },
      fr: (dayNightMin) => {
        return ' pour ' + dayNightMin + ' min ';
      },
      ko: (dayNightMin) => {
        return ' ' + dayNightMin + '분 동안';
      },
      cn: (dayNightMin) => {
        return ' ' + dayNightMin + '分钟';
      },
    },
    minute: {
      en: 'm',
      de: 'min',
      fr: ' min ',
      ko: '분',
      cn: '分',
    },
  },
  Regex: {
    en: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)Eureka (?:Anemos|Pagos|Pyros|Hydatos) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)NMs on cooldown: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)m\)/),
    },
    cn: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)(?:常风之地|恒冰之地|涌火之地|丰水之地) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)冷却中的NM: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)分(钟*)\)/),
    },
    ko: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)에우레카: (?:아네모스|파고스|피로스|히다토스) 지대 \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)토벌한 마물: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)분\)/),
    },
  },
  ZoneInfo: {
    // Fate IDs
    // Anemos:  https://xivapi.com/search?indexes=Fate&filters=ID>=1328,ID<=1348&columns=Description,Name,Url
    // Pagos:   https://xivapi.com/search?indexes=Fate&filters=ID>=1351,ID<=1369&columns=Description,Name,Url
    // Pyros:   https://xivapi.com/search?indexes=Fate&filters=ID>=1388,ID<=1408&columns=Description,Name,Url
    // Hydatos: https://xivapi.com/search?indexes=Fate&filters=ID>=1412,ID<=1425&columns=Description,Name,Url
    [ZoneId.TheForbiddenLandEurekaAnemos]: {
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
      fairy: {
        en: 'Anemos Elemental',
        de: 'Anemos-Elementar',
        fr: 'Élémentaire Anemos',
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
        },
        jaha: {
          label: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jahann',
            ja: 'ジャハ',
            ko: '자하남',
            cn: '台风',
          },
          trackerName: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jahann',
            ja: 'ジャハ',
            ko: '자하남',
            cn: '台风',
          },
          x: 17.7,
          y: 18.6,
          fateID: 1345,
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
        },
        strider: {
          label: {
            en: 'Strider',
            de: 'Simurghs',
            fr: 'Trotteur',
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
          weather: 'Gales',
        },
      },
    },
    [ZoneId.TheForbiddenLandEurekaPagos]: {
      mapImage: 'pagos.png',
      mapWidth: 1500,
      mapHeight: 950,
      shortName: 'pagos',
      mapToPixelXScalar: 41.08333,
      mapToPixelXConstant: -85.28333,
      mapToPixelYScalar: 41.09158,
      mapToPixelYConstant: -370.196,
      fairy: {
        en: 'Pagos Elemental',
        de: 'Pagos-Elementar',
        fr: 'Élémentaire Pagos',
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
            fr: 'Reine',
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
        },
        taxim: {
          label: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            ko: '텍심',
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
          trackerName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Graboïde',
            ja: 'グラヴォ',
            ko: '그라보이드',
            cn: '魔虫',
          },
          x: 33.0,
          y: 28.0,
          fateID: 1354,
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
          trackerName: {
            en: 'Haku',
            de: 'Haku',
            fr: 'Haku',
            ja: 'ハクタク',
            ko: '백택',
            cn: '白泽',
          },
          x: 29.0,
          y: 22.5,
          fateID: 1366,
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
          weather: 'Fog',
        },
        minotaurs: {
          label: {
            en: 'Minotaurs',
            de: 'Minotauren',
            fr: 'Minotaures',
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
        },
        holycow: {
          label: {
            en: 'Holy Cow',
            de: 'Heilsbringer',
            fr: 'Vache sacrée',
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
        },
        hadhayosh: {
          label: {
            en: 'Hadha',
            de: 'Hadhayosh',
            fr: 'Hadha',
            ja: 'ハダヨッシュ',
            ko: '하다요쉬',
            cn: '贝爷',
          },
          trackerName: {
            en: 'Behe',
            de: 'Hadhayosh',
            fr: 'Hadha',
            ja: 'ハダヨ',
            ko: '하다요쉬',
            cn: '贝爷',
          },
          x: 30,
          y: 19,
          fateID: 1362,
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
          time: 'Night',
        },
      },
    },
    [ZoneId.TheForbiddenLandEurekaPyros]: {
      mapImage: 'pyros.png',
      mapWidth: 1350,
      mapHeight: 1450,
      shortName: 'pyros',
      mapToPixelXScalar: 42.515,
      mapToPixelXConstant: -344.064,
      mapToPixelYScalar: 42.486,
      mapToPixelYConstant: -202.628,
      fairy: {
        en: 'Pyros Elemental',
        de: 'Pyros-Elementar',
        fr: 'Élémentaire Pyros',
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
            fr: 'Leucosie',
            ja: 'レウコ',
            cn: '惨叫',
            ko: '레우',
          },
          x: 26.8,
          y: 26.3,
          fateID: 1388,
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
          weather: 'Thunder',
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
          trackerName: {
            en: 'Owl',
            de: 'Askala',
            fr: 'Ascala',
            ja: 'アスカラ',
            cn: '阿福',
            ko: '아스',
          },
          x: 19.3,
          y: 29.0,
          fateID: 1392,
          weather: 'Umbral Wind',
        },
        batym: {
          label: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Bathim',
            ja: 'パティム',
            cn: '大公',
            ko: '대공',
          },
          trackerName: {
            en: 'Batym',
            de: 'Batym',
            fr: 'Bathim',
            ja: 'デューク',
            cn: '大公',
            ko: '바팀',
          },
          x: 18.0,
          y: 14.1,
          fateID: 1393,
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
          trackerName: {
            en: 'Aetolus',
            de: 'Aetolus',
            fr: 'Aetolos',
            ja: 'アイトロス',
            cn: '雷鸟',
            ko: '아이',
          },
          x: 10.0,
          y: 14.0,
          fateID: 1394,
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
        },
        eldthurs: {
          label: {
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
            ko: '엘드',
          },
          x: 15.3,
          y: 6.8,
          fateID: 1396,
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
          trackerName: {
            en: 'Jack',
            de: 'Holz',
            fr: 'Bûcheron',
            ja: 'ジャック',
            cn: '树人',
            ko: '럼버잭',
          },
          x: 30.1,
          y: 11.7,
          fateID: 1400,
        },
        glauko: {
          label: {
            en: 'Glauko',
            de: 'Glauko',
            fr: 'Glaukô',
            ja: 'グラウコピス',
            cn: '明眸',
            ko: '큰 부엉이',
          },
          trackerName: {
            en: 'Glaukopis',
            de: 'Glaukopis',
            fr: 'Glaukôpis',
            ja: 'グラウコ',
            cn: '明眸',
            ko: '글라',
          },
          x: 32.3,
          y: 15.1,
          fateID: 1401,
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
          trackerName: {
            en: 'YY',
            de: 'Yin-Yang',
            fr: 'Yin-Yang',
            ja: 'インヤン',
            cn: '阴·阳',
            ko: '음양',
          },
          x: 11.4,
          y: 34.1,
          fateID: 1402,
        },
        skoll: {
          label: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Sköll',
            ja: 'スコル',
            cn: '狼',
            ko: '스콜',
          },
          trackerName: {
            en: 'Skoll',
            de: 'Skalli',
            fr: 'Sköll',
            ja: 'スコル',
            cn: '狼',
            ko: '스콜',
          },
          x: 24.3,
          y: 30.1,
          fateID: 1403,
          weather: 'Blizzards',
        },
        penthe: {
          label: {
            en: 'Penthe',
            de: 'Penthe',
            fr: 'Penthé',
            ja: 'ペンテ',
            cn: '彭女士',
            ko: '펜테',
          },
          trackerName: {
            en: 'Penny',
            de: 'Penthe',
            fr: 'Penthé',
            ja: 'レイア',
            cn: '彭女士',
            ko: '펜테',
          },
          x: 35.7,
          y: 5.9,
          fateID: 1404,
          weather: 'Heat Waves',
        },
      },
    },
    [ZoneId.TheForbiddenLandEurekaHydatos]: {
      mapImage: 'hydatos.png',
      mapWidth: 1500,
      mapHeight: 800,
      shortName: 'hydatos',
      mapToPixelXScalar: 37.523,
      mapToPixelXConstant: -48.160,
      mapToPixelYScalar: 37.419,
      mapToPixelYConstant: -414.761,
      fairy: {
        en: 'Hydatos Elemental',
        de: 'Hydatos-Elementar',
        fr: 'Élémentaire d\'Hydatos',
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
            fr: 'Khalamar',
            ja: 'カラマリ',
            cn: '墨鱼',
            ko: '칼라',
          },
          x: 11.1,
          y: 24.9,
          fateID: 1412,
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
        },
        goldemar: {
          label: {
            en: 'King',
            de: 'König',
            fr: 'Goldemar',
            ja: 'King',
            cn: '马王',
            ko: '골데마르',
          },
          trackerName: {
            en: 'Golde',
            de: 'König Goldemar',
            fr: 'Golde',
            ja: 'キング・ゴルデマール',
            cn: '马王',
            ko: '골데마르',
          },
          x: 28.9,
          y: 23.9,
          fateID: 1418,
          time: 'Night',
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

  TransByParserLang(obj) {
    return obj[this.options.ParserLanguage] || obj['en'];
  }

  TransByDispLang(obj) {
    return obj[this.options.DisplayLanguage] || obj['en'];
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

  // TODO: maybe this should be in a more shared location.
  EntityToMap(coord, sizeFactor, offset) {
    // Relicensed from MIT License, by viion / Vekien
    // https://github.com/xivapi/xivapi-mappy/blob/3ea58cc5431db6808053bd3164a1b7859e3bcee1/Mappy/Helpers/MapHelper.cs#L10-L15

    const scale = sizeFactor / 100;
    const val = (coord + offset) * scale;
    return ((41 / scale) * ((val + 1024) / 2048)) + 1;
  }

  EntityToMapX(x) {
    // TODO: it's kind of awkard to have this.zoneInfo and ZoneInfo simultaneously.
    const zoneInfo = ZoneInfo[this.zoneId];
    return this.EntityToMap(x, zoneInfo.sizeFactor, zoneInfo.offsetX);
  }

  EntityToMapY(y) {
    const zoneInfo = ZoneInfo[this.zoneId];
    return this.EntityToMap(y, zoneInfo.sizeFactor, zoneInfo.offsetY);
  }

  SetStyleFromEntity(style, ex, ey) {
    const mx = this.EntityToMapX(ex);
    const my = this.EntityToMapY(ey);
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
    name.innerText = this.TransByParserLang(nm.label);
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
    this.nms = this.zoneInfo.nms;
    // Anemos has no bunny fates
    this.nmKeys = Object.keys(this.nms);

    let container = document.getElementById('nm-labels');

    for (let i = 0; i < this.nmKeys.length; ++i)
      this.AddElement(container, this.nms[this.nmKeys[i]]);


    this.fairy = this.zoneInfo.fairy;
    let fairyName = this.TransByParserLang(this.fairy);
    this.fairy.regex = Regexes.addedCombatantFull({ name: fairyName });
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

  OnChangeZone(e) {
    this.zoneId = e.zoneID;

    this.zoneInfo = this.options.ZoneInfo[this.zoneId];
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

    let primaryWeatherList = this.zoneInfo.primaryWeather;
    if (primaryWeatherList) {
      for (let i = 0; i < 5; ++i) {
        document.getElementById('label-weather-icon' + i).innerHTML = '';
        document.getElementById('label-weather-text' + i).innerHTML = '';
      }

      for (let i = 0; i < 5 && i < primaryWeatherList.length; ++i) {
        let primaryWeather = primaryWeatherList[i];
        if (!primaryWeather)
          continue;
        let weather = getWeather(nowMs, this.zoneId);
        let weatherIcon = gWeatherIcons[primaryWeather];
        let weatherStr;
        if (weather == primaryWeather) {
          let stopTime = findNextWeatherNot(nowMs, this.zoneId, primaryWeather);
          weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);
        } else {
          let startTime = findNextWeather(nowMs, this.zoneId, primaryWeather);
          weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);
        }
        document.getElementById('label-weather-icon' + i).innerHTML = weatherIcon;
        document.getElementById('label-weather-text' + i).innerHTML = weatherStr;
      }
    } else {
      let currentWeather = getWeather(nowMs, this.zoneId);
      let stopTime = findNextWeatherNot(nowMs, this.zoneId, currentWeather);
      let weatherIcon = gWeatherIcons[currentWeather];
      let weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);
      document.getElementById('label-weather-icon0').innerHTML = weatherIcon;
      document.getElementById('label-weather-text0').innerHTML = weatherStr;

      // round up current time
      let lastTime = nowMs;
      let lastWeather = currentWeather;
      for (let i = 1; i < 5; ++i) {
        let startTime = findNextWeatherNot(lastTime, this.zoneId, lastWeather);
        let weather = getWeather(startTime + 1, this.zoneId);
        let weatherIcon = gWeatherIcons[weather];
        weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);
        document.getElementById('label-weather-icon' + i).innerHTML = weatherIcon;
        document.getElementById('label-weather-text' + i).innerHTML = weatherStr;
        lastTime = startTime;
        lastWeather = weather;
      }
    }

    let nextDay = findNextNight(nowMs);
    let nextNight = findNextDay(nowMs);
    let timeIcon;
    if (nextDay > nextNight)
      timeIcon = gNightIcon;
    else
      timeIcon = gDayIcon;

    let dayNightMin = Math.ceil((Math.min(nextDay, nextNight) - nowMs) / 1000 / 60);
    let timeStr = this.TransByDispLang(this.options.timeStrings.timeFor)(dayNightMin);
    document.getElementById('label-time-icon').innerHTML = timeIcon;
    document.getElementById('label-time-text').innerHTML = timeStr;

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
        let respawnWeather = getWeather(respawnMs, this.zoneId);
        if (respawnWeather != nm.weather) {
          let weatherStartTime =
            findNextWeather(respawnMs, this.zoneId, nm.weather);
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
          let weatherStartTime = findNextWeatherNot(nowMs, this.zoneId, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather];
          openUntil = weatherStartTime;
        }
        if (nm.time == 'Night') {
          respawnIcon = gNightIcon;
          openUntil = findNextDay(nowMs);
        }

        if (openUntil) {
          let openMin = (openUntil - nowMs) / 1000 / 60;
          let nmString = respawnIcon + Math.ceil(openMin) +
            this.TransByDispLang(this.options.timeStrings.minute);
          nm.timeElement.innerHTML = nmString;
        } else {
          nm.timeElement.innerText = '';
        }
        nm.element.classList.remove('nm-down');
      } else {
        // If still waiting on pop, don't show an icon.
        if (popRespawnMs > nowMs)
          respawnIcon = '';

        let remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        let nmString = respawnIcon + remainingMinutes +
          this.TransByDispLang(this.options.timeStrings.minute);
        nm.timeElement.innerHTML = nmString;
        nm.element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText) {
    let trackerToNM = {};
    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];
      if (!nm.trackerName)
        continue;
      trackerToNM[this.TransByParserLang(nm.trackerName).toLowerCase()] = nm;
    }

    let regex = this.TransByParserLang(this.options.Regex);
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
      let gRegex = this.TransByParserLang(this.options.Regex);
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
          this.AddFairy(match.groups);
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
      for (let key of this.nmKeys) {
        let nm = this.nms[key];
        if (e.detail.fateID == nm.fateID) {
          this.OnFatePop(nm);
          return;
        }
      }
      break;
    case 'remove':
      for (let key of this.nmKeys) {
        let nm = this.nms[key];
        if (e.detail.fateID == nm.fateID) {
          this.OnFateKill(nm);
          return;
        }
      }
      break;
    case 'update':
      for (let key of this.nmKeys) {
        let nm = this.nms[key];
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

  AddFairy(matches) {
    const mx = this.EntityToMapX(parseFloat(matches.x));
    const my = this.EntityToMapY(parseFloat(matches.y));
    this.AddFlag(mx, my, this.TransByParserLang(this.zoneInfo.fairy), '');
  }
}

UserConfig.getUserConfigLocation('eureka', function(e) {
  addOverlayListener('onPlayerChangedEvent', function(e) {
    gTracker.OnPlayerChange(e);
  });
  addOverlayListener('ChangeZone', function(e) {
    gTracker.OnChangeZone(e);
  });
  addOverlayListener('onLogEvent', function(e) {
    gTracker.OnLog(e);
  });
  addOverlayListener('onFateEvent', function(e) {
    gTracker.OnFate(e);
  });

  gTracker = new EurekaTracker(Options);
});
