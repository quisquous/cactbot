import { addOverlayListener } from '../../resources/overlay_plugin_api';

import Regexes from '../../resources/regexes';
import UserConfig from '../../resources/user_config';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';
import { getWeather, findNextWeather, findNextWeatherNot, findNextNight, findNextDay, isNightTime } from '../../resources/weather';

import './eureka_config';

const bunnyLabel = {
  en: 'Bunny',
  de: 'Hase',
  fr: 'Lapin',
  ja: 'うさぎ',
  cn: '兔子',
  ko: '토끼',
};

const Options = {
  Debug: false,
  PopSound: '../../resources/sounds/freesound/sonar.ogg',
  BunnyPopSound: '../../resources/sounds/freesound/water_drop.ogg',
  CriticalPopSound: '../../resources/sounds/freesound/sonar.ogg',
  timeStrings: {
    weatherFor: {
      en: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' for ' + Math.ceil(min) + 'm';
        }
        return ' for ???';
      },
      de: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' für ' + Math.ceil(min) + 'min';
        }
        return ' für ???';
      },
      fr: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' pour ' + Math.ceil(min) + ' min ';
        }
        return ' pour ???';
      },
      ja: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' 終わるまであと ' + Math.ceil(min) + ' 分 ';
        }
        return ' 終わるまであと ???';
      },
      cn: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '分钟后结束';
        }
        return ' ??? 分钟';
      },
      ko: (nowMs, stopTime) => {
        if (stopTime) {
          const min = (stopTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '분 동안';
        }
        return ' ??? 동안';
      },
    },
    weatherIn: {
      en: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' in ' + Math.ceil(min) + 'm';
        }
        return ' in ???';
      },
      de: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' in ' + Math.ceil(min) + 'min';
        }
        return ' in ???';
      },
      fr: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' dans ' + Math.ceil(min) + ' min ';
        }
        return ' dans ???';
      },
      ja: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' あと ' + Math.ceil(min) + ' 分 ';
        }
        return ' あと ???';
      },
      cn: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '分钟后';
        }
        return ' ??? 后';
      },
      ko: (nowMs, startTime) => {
        if (startTime) {
          const min = (startTime - nowMs) / 1000 / 60;
          return ' ' + Math.ceil(min) + '분 후';
        }
        return ' ??? 후';
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
      ja: (dayNightMin) => {
        return ' ' + dayNightMin + '分';
      },
      cn: (dayNightMin) => {
        return ' ' + dayNightMin + '分钟';
      },
      ko: (dayNightMin) => {
        return ' ' + dayNightMin + '분 동안';
      },
    },
    minute: {
      en: 'm',
      de: 'min',
      fr: ' min ',
      ja: '分',
      cn: '分',
      ko: '분',
    },
  },
  Regex: {
    // de, fr, ja languages all share the English regexes here.
    // If you ever need to add another language, include all of the regexes for it.
    en: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)\ue0bb(?:Eureka (?:Anemos|Pagos|Pyros|Hydatos)|Bozjan Southern Front) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)NMs on cooldown: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)m\)/),
    },
    cn: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)\ue0bb(?:常风之地|恒冰之地|涌火之地|丰水之地) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)冷却中的NM: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)分(钟*)\)/),
    },
    ko: {
      'gFlagRegex': Regexes.parse(/00:00(?:38:|..:[^:]*:)(.*)\ue0bb(?:에우레카: (?:아네모스|파고스|피로스|히다토스) 지대|남부 보즈야 전선) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/),
      'gTrackerRegex': Regexes.parse(/(?:https:\/\/)?ffxiv-eureka\.com\/([\w-]{6})(?:[^\w-]|$)/),
      'gImportRegex': Regexes.parse(/00:00..:(.*)토벌한 마물: (\S.*\))/),
      'gTimeRegex': Regexes.parse(/(.*) \((\d*)분\)/),
    },
  },
  ZoneInfo: {
    // Fate IDs
    //
    // Eureka
    // Anemos:  https://xivapi.com/search?indexes=Fate&filters=ID>=1328,ID<=1348&columns=Description,Name,Url
    // Pagos:   https://xivapi.com/search?indexes=Fate&filters=ID>=1351,ID<=1369&columns=Description,Name,Url
    // Pyros:   https://xivapi.com/search?indexes=Fate&filters=ID>=1388,ID<=1408&columns=Description,Name,Url
    // Hydatos: https://xivapi.com/search?indexes=Fate&filters=ID>=1412,ID<=1425&columns=Description,Name,Url

    // Bozja
    // Southern Front: https://xivapi.com/search?indexes=Fate&filters=ID%3E=1597,ID%3C=1628&columns=Description,Name,Url
    [ZoneId.TheForbiddenLandEurekaAnemos]: {
      mapImage: 'anemos.png',
      mapWidth: 1300,
      mapHeight: 950,
      shortName: 'anemos',
      hasTracker: true,
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
        ja: 'アネモス・エレメンタル',
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
            cn: '仙人掌',
            ko: '사보텐더',
          },
          trackerName: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボテン',
            cn: '仙人掌',
            ko: '사보',
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
            cn: '章鱼',
            ko: '문어',
          },
          trackerName: {
            en: 'Lord',
            de: 'Prinz',
            fr: 'Seigneur',
            ja: 'ロード',
            cn: '章鱼',
            ko: '대왕',
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
            cn: '鸟',
            ko: '텔레스',
          },
          trackerName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
            cn: '鸟',
            ko: '텔레스',
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
            cn: '蜻蜓',
            ko: '잠자리',
          },
          trackerName: {
            en: 'Emperor',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'エンペラ',
            cn: '蜻蜓',
            ko: '황제',
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
            cn: '熊',
            ko: '칼리스토',
          },
          trackerName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
            cn: '熊',
            ko: '칼리스토',
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
            cn: '群偶',
            ko: '넘버즈',
          },
          trackerName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバ',
            cn: '群偶',
            ko: '넘버즈',
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
            cn: '台风',
            ko: '자하남',
          },
          trackerName: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jahann',
            ja: 'ジャハ',
            cn: '台风',
            ko: '자하남',
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
            cn: '暴龙',
            ko: '아메메트',
          },
          trackerName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメ',
            cn: '暴龙',
            ko: '아메메트',
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
            cn: '盖因',
            ko: '카임',
          },
          trackerName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
            cn: '盖因',
            ko: '카임',
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
            cn: '举高高',
            ko: '봄바딜',
          },
          trackerName: {
            en: 'Bomba',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバ',
            cn: '举高高',
            ko: '봄바',
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
            cn: '蝎子',
            ko: '전갈',
          },
          trackerName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
            cn: '蝎子',
            ko: '세르케트',
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
            cn: '魔界花',
            ko: '줄리카',
          },
          trackerName: {
            en: 'Julika',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
            cn: '魔界花',
            ko: '줄리카',
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
            cn: '白骑士',
            ko: '기수',
          },
          trackerName: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ライダー',
            cn: '白骑士',
            ko: '기수',
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
            cn: '独眼',
            ko: '외눈',
          },
          trackerName: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリュ',
            cn: '独眼',
            ko: '폴리',
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
            cn: '阔步西牟鸟',
            ko: '즈',
          },
          trackerName: {
            en: 'Strider',
            de: 'Läufer',
            fr: 'Trotteur',
            ja: 'シムルグ',
            cn: '祖',
            ko: '시무르그',
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
            cn: '极其危险物质',
            ko: '하즈마트',
          },
          trackerName: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマ',
            cn: '爆弹',
            ko: '하즈마트',
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
            cn: '法夫纳',
            ko: '파프니르',
          },
          trackerName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴ',
            cn: '法夫纳',
            ko: '파프니르',
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
            cn: '阿玛洛克',
            ko: '아마록',
          },
          trackerName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロ',
            cn: '狗',
            ko: '아마록',
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
            cn: '拉玛什图',
            ko: '라마슈투',
          },
          trackerName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュ',
            cn: '嫂子',
            ko: '라마슈투',
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
            cn: '帕祖祖',
            ko: '파주주',
          },
          trackerName: {
            en: 'Paz',
            de: 'Paz',
            fr: 'Pazuzu',
            ja: 'パズズ',
            cn: 'Pzz',
            ko: '파주주',
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
      hasTracker: true,
      mapToPixelXScalar: 41.08333,
      mapToPixelXConstant: -85.28333,
      mapToPixelYScalar: 41.09158,
      mapToPixelYConstant: -370.196,
      fairy: {
        en: 'Pagos Elemental',
        de: 'Pagos-Elementar',
        fr: 'Élémentaire Pagos',
        ja: 'パゴス・エレメンタル',
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
            cn: '周冬雨',
            ko: '눈의 여왕',
          },
          trackerName: {
            en: 'Queen',
            de: 'Königin',
            fr: 'Reine',
            ja: '女王',
            cn: '周冬雨',
            ko: '눈 여왕',
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
            cn: '读书人',
            ko: '텍심',
          },
          trackerName: {
            en: 'Taxim',
            de: 'Taxim',
            fr: 'Taxim',
            ja: 'タキシム',
            cn: '读书人',
            ko: '텍심',
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
            cn: '灰烬龙',
            ko: '용',
          },
          trackerName: {
            en: 'Dragon',
            de: 'Drache',
            fr: 'Dragon',
            ja: 'アッシュ',
            cn: '灰烬龙',
            ko: '잿더미 용',
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
            cn: '魔虫',
            ko: '지렁이',
          },
          trackerName: {
            en: 'Glavoid',
            de: 'Glavoid',
            fr: 'Graboïde',
            ja: 'グラヴォ',
            cn: '魔虫',
            ko: '그라보이드',
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
            cn: '安娜波',
            ko: '아나포',
          },
          trackerName: {
            en: 'Anapos',
            de: 'Anapos',
            fr: 'Anapos',
            ja: 'アナポ',
            cn: '安娜波',
            ko: '아나포',
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
            cn: '白泽',
            ko: '백택',
          },
          trackerName: {
            en: 'Haku',
            de: 'Haku',
            fr: 'Haku',
            ja: 'ハクタク',
            cn: '白泽',
            ko: '백택',
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
            cn: '雪屋王',
            ko: '이글루',
          },
          trackerName: {
            en: 'Igloo',
            de: 'Iglu',
            fr: 'Igloo',
            ja: 'イグルー',
            cn: '雪屋王',
            ko: '이글루',
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
            cn: '阿萨格',
            ko: '아사그',
          },
          trackerName: {
            en: 'Asag',
            de: 'Asag',
            fr: 'Asag',
            ja: 'アサグ',
            cn: '阿萨格',
            ko: '아사그',
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
            cn: '山羊',
            ko: '염소',
          },
          trackerName: {
            en: 'Surabhi',
            de: 'Surabhi',
            fr: 'Surabhi',
            ja: 'スラビー',
            cn: '山羊',
            ko: '수라비',
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
            cn: '螃蟹',
            ko: '게',
          },
          trackerName: {
            en: 'Arthro',
            de: 'Athro',
            fr: 'Arthro',
            ja: 'アスロ',
            cn: '螃蟹',
            ko: '아스로',
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
            cn: '双牛',
            ko: '미노타우루스',
          },
          trackerName: {
            en: 'Brothers',
            de: 'Brüder',
            fr: 'Frères',
            ja: 'ミノ',
            cn: '双牛',
            ko: '형제',
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
            cn: '圣牛',
            ko: '소',
          },
          trackerName: {
            en: 'Holy Cow',
            de: 'Heil',
            fr: 'Vache',
            ja: '聖牛',
            cn: '圣牛',
            ko: '신성 소',
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
            cn: '贝爷',
            ko: '하다요쉬',
          },
          trackerName: {
            en: 'Behe',
            de: 'Hadhayosh',
            fr: 'Hadha',
            ja: 'ハダヨ',
            cn: '贝爷',
            ko: '하다요쉬',
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
            cn: '荷鲁斯',
            ko: '호루스',
          },
          trackerName: {
            en: 'Horus',
            de: 'Horus',
            fr: 'Horus',
            ja: 'ホルス',
            cn: '荷鲁斯',
            ko: '호루스',
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
            cn: '大眼',
            ko: '마이뉴',
          },
          trackerName: {
            en: 'Mainyu',
            de: 'Mainyu',
            fr: 'Mainyu',
            ja: 'マンユ',
            cn: '大眼',
            ko: '마이뉴',
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
            cn: '凯西',
            ko: '캐시',
          },
          trackerName: {
            en: 'Cassie',
            de: 'Cassie',
            fr: 'Cassie',
            ja: 'キャシー',
            cn: '凯西',
            ko: '캐시',
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
            cn: '娄希',
            ko: '로우히',
          },
          trackerName: {
            en: 'Louhi',
            de: 'Louhi',
            fr: 'Louhi',
            ja: 'ロウヒ',
            cn: '娄希',
            ko: '로우히',
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
      hasTracker: true,
      mapToPixelXScalar: 42.515,
      mapToPixelXConstant: -344.064,
      mapToPixelYScalar: 42.486,
      mapToPixelYConstant: -202.628,
      fairy: {
        en: 'Pyros Elemental',
        de: 'Pyros-Elementar',
        fr: 'Élémentaire Pyros',
        ja: 'ピューロス・エレメンタル',
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
      hasTracker: true,
      mapToPixelXScalar: 37.523,
      mapToPixelXConstant: -48.160,
      mapToPixelYScalar: 37.419,
      mapToPixelYConstant: -414.761,
      fairy: {
        en: 'Hydatos Elemental',
        de: 'Hydatos-Elementar',
        fr: 'Élémentaire d\'Hydatos',
        ja: 'ヒュダトス・エレメンタル',
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
    [ZoneId.TheBozjanSouthernFront]: {
      mapImage: 'bozjasouthern.png',
      mapWidth: 1600,
      mapHeight: 1400,
      shortName: 'bozjasouthern',
      hasTracker: false,
      dontShowInactive: true,
      treatNMsAsSkirmishes: true,
      mapToPixelXScalar: 47.911,
      mapToPixelXConstant: -292.56,
      mapToPixelYScalar: 48.938,
      mapToPixelYConstant: -349.22,
      nms: {
        sneak: {
          label: {
            en: 'Sneak',
            de: 'Taktisches Gemetzel',
            fr: 'Les yeux de l\'ennemi',
            ja: '術士大隊との会敵',
            cn: '遭遇术师大队',
            ko: '술사대대 발견',
          },
          x: 20.3,
          y: 26.8,
          fateID: 1597,
        },
        robots: {
          label: {
            en: 'Robots',
            de: 'Nichts als Schrott',
            fr: 'Les araignées de fer',
            ja: '無人魔導兵器との会敵',
            cn: '遭遇无人魔导兵器',
            ko: '무인 마도 병기 발견',
          },
          x: 24.8,
          y: 27.5,
          fateID: 1598,
        },
        beasts: {
          label: {
            en: 'Beasts',
            de: 'Husch, ins Körbchen!',
            fr: 'Museler le Chien',
            ja: '忠犬との遭遇',
            cn: '发现忠犬',
            ko: '충견과 조우하다',
          },
          x: 20.3,
          y: 26.8,
          fateID: 1599,
        },
        unrest: {
          label: {
            en: 'Unrest',
            de: 'Wer rastet, der blutet',
            fr: 'Pas de quartier',
            ja: '術士大隊への奇襲',
            cn: '奇袭术师大队',
            ko: '술사대대 기습',
          },
          x: 24.8,
          y: 27.5,
          fateID: 1600,
        },
        machine: {
          label: {
            en: 'Machine',
            de: 'Auf zum Gegenangriff',
            fr: 'Machines aux trousses',
            ja: '有人魔導兵器の迎撃',
            cn: '迎击有人魔导兵器',
            ko: '유인 마도 병기 요격',
          },
          x: 28.4,
          y: 29.3,
          fateID: 1601,
        },
        plants: {
          label: {
            en: 'Plants',
            de: 'Linientreue',
            fr: 'Des racines et des crocs',
            ja: '野生生物を排除せよ',
            cn: '排除野生生物',
            ko: '야생 생물을 제거하라',
          },
          x: 34.4,
          y: 29.3,
          fateID: 1602,
        },
        seeq: {
          label: {
            en: 'Seeq',
            de: 'Dem Rüpel seine Meute',
            fr: 'Ménagerie guerrière',
            ja: '豚面の魔獣使い',
            cn: '兽性兽心的驯兽师',
            ko: '시크족 마수 조련사',
          },
          x: 28.9,
          y: 26.1,
          fateID: 1603,
        },
        pets: {
          label: {
            en: 'Pets',
            de: 'Ungeheuerlich!',
            fr: 'Belles plantes',
            ja: '華麗なる珍獣使い',
            cn: '华丽魔女的珍兽使者',
            ko: '화려한 희귀마수 조련사',
          },
          x: 17.3,
          y: 26.6,
          fateID: 1604,
        },
        firstlaw: {
          label: {
            en: 'First Law',
            de: 'Schufter-10',
            fr: 'Que des numéros dix',
            ja: '労働十号破壊命令',
            cn: '破坏劳动十号',
            ko: '노동 10호 파괴 명령',
          },
          x: 34.4,
          y: 29.3,
          fateID: 1605,
        },
        heal: {
          label: {
            en: 'Heal',
            de: 'Nächstenliebe',
            fr: 'Miséricorde impériale',
            ja: '恩徳の術士たち',
            cn: '施恩布德的术师队',
            ko: '은덕의 술사들',
          },
          x: 28.9,
          y: 26.1,
          fateID: 1606,
        },
        mash: {
          label: {
            en: 'Mash',
            de: 'Rache ist Blutwurst',
            fr: 'Le retour du chien fidèle',
            ja: '忠犬の逆襲',
            cn: '忠犬的逆袭',
            ko: '충견의 역습',
          },
          x: 31.3,
          y: 22.0,
          fateID: 1607,
        },
        alert: {
          label: {
            en: 'Alert',
            de: 'Großes Federlassen',
            fr: 'Quand les chocobos voient rouge',
            ja: '豚面と赤い馬鳥',
            cn: '兽性兽心与红色马鸟',
            ko: '시크족과 붉은 초코보',
          },
          x: 27.3,
          y: 17.7,
          fateID: 1608,
        },
        unicorn: {
          label: {
            en: 'Unicorn',
            de: 'Llofii',
            fr: 'La licorne des plaines',
            ja: '潔白の脱走兵',
            cn: '洁白心的逃脱战',
            ko: '결백한 탈주병',
          },
          x: 32.3,
          y: 17.0,
          fateID: 1609,
        },
        recreation: {
          label: {
            en: 'Recreation',
            de: 'Aufräumen im Dienst',
            fr: 'La bataille de l\'innovation',
            ja: '敵新兵器を調査せよ',
            cn: '调查敌方新兵器',
            ko: '적의 신병기를 조사하라',
          },
          x: 25.6,
          y: 22.6,
          fateID: 1610,
        },
        element: {
          label: {
            en: 'Element',
            de: 'Verhinderte Wartung',
            fr: 'Couper les vivres',
            ja: '整備場奇襲作戦',
            cn: '奇袭整备场',
            ko: '정비소 기습 작전',
          },
          x: 17.5,
          y: 23.4,
          fateID: 1611,
        },
        heavyboots: {
          label: {
            en: 'Boots',
            de: 'Arbeitsniederlegung',
            fr: 'Force ouvrière',
            ja: '魔導レイバー破壊命令',
            cn: '破坏魔导劳工',
            ko: '마도 노동자 파괴 명령',
          },
          x: 31.3,
          y: 22.0,
          fateID: 1612,
        },
        camping: {
          label: {
            en: 'Camping',
            de: 'Unfreundlicher Besuch',
            fr: 'Idéaux irréconciliables',
            ja: '野営地への先制攻撃',
            cn: '进攻野营地',
            ko: '야영지 선제 공격',
          },
          x: 17.5,
          y: 23.4,
          fateID: 1613,
        },
        scavengers: {
          label: {
            en: 'Scavengers',
            de: 'Zurück ins Nichts',
            fr: 'Les dévoreurs d\'âmes',
            ja: '魂喰いの妖異たち',
            cn: '噬魂的妖异',
            ko: '혼을 먹는 요마들',
          },
          x: 25.6,
          y: 22.6,
          fateID: 1614,
        },
        helpwanted: {
          label: {
            en: 'Help Wanted',
            de: 'Jedes Leben zählt',
            fr: 'Résister ou mourir',
            ja: '術士大隊の猛攻',
            cn: '术师大队的猛攻',
            ko: '술사대대의 맹공격',
          },
          x: 18.3,
          y: 20.7,
          fateID: 1615,
        },
        pyromancer: {
          label: {
            en: 'Pyromancer',
            de: 'Pyromant',
            fr: 'Duel brûlant',
            ja: '最強のパイロマンサー',
            cn: '最强的火焰法师',
            ko: '최강의 불꽃술사',
          },
          x: 18.3,
          y: 20.7,
          fateID: 1616,
        },
        rainbow: {
          label: {
            en: 'Rainbow',
            de: 'Ende einer ... Karriere',
            fr: 'De toutes les couleurs',
            ja: '華麗なるお気に入り',
            cn: '华丽魔女与心爱珍兽',
            ko: '화려한 애완마수',
          },
          x: 25.1,
          y: 15.0,
          fateID: 1617,
        },
        wildbunch: {
          label: {
            en: 'Wild Bunch',
            de: 'Revierkämpfe',
            fr: 'Sans maîtres ni loi',
            ja: '暴走魔獣の排除',
            cn: '排除失控魔兽',
            ko: '폭주 마수 처리',
          },
          x: 21.0,
          y: 14.3,
          fateID: 1618,
        },
        familyotheranimals: {
          label: {
            en: 'Family',
            de: 'rüpelhaftes Großmaul',
            fr: 'L\'incorruptible',
            ja: '豚面の勧誘者',
            cn: '兽性兽心的劝诱',
            ko: '포섭하는 시크족',
          },
          x: 11.0,
          y: 14.6,
          fateID: 1619,
        },
        mechanicalman: {
          label: {
            en: 'Mechanical Man',
            de: 'Arbeitsniederlegung - Plan B',
            fr: 'Plan B',
            ja: '魔導レイバーB型破壊命令',
            cn: '破坏魔导劳工B型',
            ko: '마도 노동자 B형 파괴 명령',
          },
          x: 20.8,
          y: 17.7,
          fateID: 1620,
        },
        murder: {
          label: {
            en: 'Murder',
            de: 'Neu und besser',
            fr: 'Des machines et des hommes',
            ja: '強化兵部隊の襲撃',
            cn: '袭击强化兵部队',
            ko: '강화병 부대의 습격',
          },
          x: 14.0,
          y: 15.3,
          fateID: 1621,
        },
        seeking: {
          label: {
            en: 'Seeking',
            de: 'fällt selbst hinein',
            fr: 'Ceux qui creusent',
            ja: '戦場の盗掘者',
            cn: '战场的偷盗者',
            ko: '전장의 도굴자',
          },
          x: 24.8,
          y: 17.1,
          fateID: 1622,
        },
        suppliesparty: {
          label: {
            en: 'Supplies',
            de: 'Deins wird meins',
            fr: 'Casser la voie',
            ja: '補給物資強奪作戦',
            cn: '补给物资夺取战',
            ko: '보급 물자 강탈 작전',
          },
          x: 21.0,
          y: 14.3,
          fateID: 1623,
        },
        demonic: {
          label: {
            en: 'Demonic',
            de: 'Der Geruch der Angst',
            fr: 'Par l\'hémoglobine alléchés',
            ja: '血の匂いに誘われて',
            cn: '闻血而来',
            ko: '피비린내에 이끌려',
          },
          x: 11.1,
          y: 20.2,
          fateID: 1624,
        },
        absentfriends: {
          label: {
            en: 'Absent',
            de: 'Eine neue Unordnung',
            fr: 'Miséricorde vengeresse',
            ja: '燃え上がる南方戦線',
            cn: '南方战线的激战',
            ko: '타오르는 남부 전선',
          },
          x: 13.8,
          y: 18.3,
          fateID: 1625,
        },
        steelflame: {
          label: {
            en: 'Steel',
            de: 'Auf und ab',
            fr: 'Le fer et le feu',
            ja: '続・燃え上がる南方戦線',
            cn: '南方战线的续战',
            ko: '타오르는 남부 전선 속편',
          },
          x: 13.8,
          y: 18.3,
          fateID: 1626,
        },
        dogsofwar: {
          label: {
            en: 'Dogs',
            de: 'Vor die Hunde gekommen',
            fr: 'Brigade canine',
            ja: '戦場の犬を解き放て',
            cn: '释放战场之犬',
            ko: '전장에 개를 풀어라',
          },
          x: 14.0,
          y: 15.3,
          fateID: 1627,
        },
        warmachines: {
          label: {
            en: 'War',
            de: 'Ende Gelände',
            fr: 'Cent mille guerriers de métal',
            ja: 'シシニアスの実験場',
            cn: '西西尼乌斯的实验场',
            ko: '시시니우스의 실험장',
          },
          x: 11.1,
          y: 20.2,
          fateID: 1628,
        },
        castrumlacuslitore: {
          label: {
            en: 'Castrum',
            de: 'Castrum',
            fr: 'Castrum',
            ja: 'カストルム',
            cn: '湖岸堡',
            ko: '공성전',
          },
          x: 18.9,
          y: 12.6,
          isCritical: true,
          ceKey: 0,
          respawnMinutes: 60,
        },
        killitwithfire: {
          label: {
            en: 'Kill It With Fire',
            de: 'Peeriefool',
            fr: 'Grandeur et pestilence',
            ja: 'ピーリフール',
            cn: '皮里福尔',
            ko: '피어리풀',
          },
          x: 17.4,
          y: 26.9,
          isCritical: true,
          ceKey: 1,
        },
        bayinghounds: {
          label: {
            en: 'Hounds',
            de: 'Canis dirus',
            fr: 'Le chien des enfers',
            ja: 'カニスディルス',
            cn: '恐惧妖犬',
            ko: '카니스 디루스',
          },
          x: 22.8,
          y: 28.8,
          isCritical: true,
          ceKey: 2,
        },
        vigilforthelost: {
          label: {
            en: 'Vigil',
            de: 'Vigil',
            fr: 'Vigile de feu',
            ja: 'ヴィジル',
            cn: '守夜',
            ko: '비질',
          },
          x: 28.4,
          y: 29.5,
          isCritical: true,
          ceKey: 3,
        },
        aceshigh: {
          label: {
            en: 'Aces High',
            de: 'Gabriel',
            fr: 'Force divine',
            ja: 'ガブリエル',
            cn: '加百列',
            ko: '가브리엘',
          },
          x: 32.3,
          y: 26.8,
          isCritical: true,
          isDuel: true,
          ceKey: 4,
        },
        shadowdeathshand: {
          label: {
            en: 'Shadow',
            de: 'Akbaba',
            fr: 'Les ailes noires de la mort',
            ja: '黒アクババ',
            cn: '阿库巴巴',
            ko: '아크바바',
          },
          x: 36.5,
          y: 25.8,
          isCritical: true,
          ceKey: 5,
        },
        finalfurlong: {
          label: {
            en: 'Final Furlong',
            de: 'Spartoi',
            fr: 'Menace spectrale',
            ja: 'スパルトイ',
            cn: '地生人',
            ko: '스파르토이',
          },
          x: 33.3,
          y: 17.5,
          isCritical: true,
          ceKey: 6,
        },
        choctober: {
          label: {
            en: 'Choctober',
            de: 'Roter Meteor',
            fr: 'Une ruée en rouge',
            ja: '赤レッドコメット',
            cn: '红色彗星',
            ko: '붉은 혜성',
          },
          x: 27.3,
          y: 17.7,
          isCritical: true,
          ceKey: 7,
        },
        beastofman: {
          label: {
            en: 'Beast of Man',
            de: 'Lyon',
            fr: 'Le Roi bestial',
            ja: '獣王ライアン',
            cn: '兽王莱昂',
            ko: '마수왕 라이언',
          },
          x: 23.3,
          y: 20.4,
          isCritical: true,
          isDuel: true,
          ceKey: 8,
        },
        firesofwar: {
          label: {
            en: 'Fires of War',
            de: 'Flammenden Hundert',
            fr: 'Brasier de guerre',
            ja: '火焔百人隊',
            cn: '火焰百夫队',
            ko: '화염백인대',
          },
          x: 20.8,
          y: 23.9,
          isCritical: true,
          ceKey: 9,
        },
        patriotgames: {
          label: {
            en: 'Patriot Games',
            de: 'Verteidigungsmaschine',
            fr: 'Les fusils du patriote',
            ja: 'パトリオット',
            cn: '爱国者',
            ko: '패트리어트',
          },
          x: 14.2,
          y: 21.2,
          isCritical: true,
          ceKey: 10,
        },
        trampledunderhoof: {
          label: {
            en: 'Trampled',
            de: 'Die bösen Blicke der Eale',
            fr: 'L\'œil du malin',
            ja: '邪エアレー',
            cn: '耶鲁',
            ko: '에알레',
          },
          x: 9.9,
          y: 18.1,
          isCritical: true,
          ceKey: 11,
        },
        flameswenthigher: {
          label: {
            en: 'Flames',
            de: 'Sartauvoir',
            fr: '"L\'envol du phénix',
            ja: 'サルトヴォアール',
            cn: '萨托瓦尔',
            ko: '사르토부아르',
          },
          x: 18.8,
          y: 15.9,
          isCritical: true,
          isDuel: true,
          ceKey: 12,
        },
        metalfoxchaos: {
          label: {
            en: 'Metal Fox Chaos',
            de: 'Dáinsleif',
            fr: 'Le guerrier de métal',
            ja: 'ダーインスレイヴ',
            cn: '达因斯莱瓦',
            ko: '다인슬라이프',
          },
          x: 13.8,
          y: 18.3,
          isCritical: true,
          ceKey: 13,
        },
        riseoftherobots: {
          label: {
            en: 'Rise',
            de: 'Modell X',
            fr: 'Le soulèvement des machines',
            ja: '魔導レイバーX型',
            cn: '魔导劳工X式',
            ko: '마도 노동자 X형',
          },
          x: 21.2,
          y: 17.6,
          isCritical: true,
          ceKey: 14,
        },
        wherestrodebehemoth: {
          label: {
            en: 'Behemoth',
            de: 'Der untote Chlevnik',
            fr: 'Le mastodonte enragé',
            ja: 'チルヴニク',
            cn: '奇尔维尼克',
            ko: '칠레브니크',
          },
          x: 24.2,
          y: 14.9,
          isCritical: true,
          ceKey: 15,
        },
      },
    },
  },
};

const gWeatherIcons = {
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
const gNightIcon = '&#x1F319;';
const gDayIcon = '&#x263C;';

let gTracker;
class EurekaTracker {
  constructor(options) {
    this.options = options;
    this.zoneInfo = null;
    this.ResetZone();
    this.updateTimesHandle = null;
    this.fateQueue = [];
    this.CEQueue = [];
  }

  TransByParserLang(obj, key) {
    const fromObj = obj[this.options.ParserLanguage] || obj['en'];
    if (!key)
      return fromObj;
    return fromObj ? fromObj[key] : obj['en'][key];
  }

  TransByDispLang(obj, key) {
    const fromObj = obj[this.options.DisplayLanguage] || obj['en'];
    if (!key)
      return fromObj;
    return fromObj ? fromObj[key] : obj['en'][key];
  }

  SetStyleFromMap(style, mx, my) {
    if (mx === undefined) {
      style.display = 'none';
      return;
    }

    const zi = this.zoneInfo;
    const px = zi.mapToPixelXScalar * mx + zi.mapToPixelXConstant;
    const py = zi.mapToPixelYScalar * my + zi.mapToPixelYConstant;

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

  AddElement(container, nmKey) {
    const nm = this.nms[nmKey];
    const label = document.createElement('div');
    label.classList.add('nm');

    if (nm.isCritical)
      label.classList.add('critical');
    if (this.zoneInfo.dontShowInactive)
      label.classList.add('nm-hidden');

    label.id = nmKey;

    this.SetStyleFromMap(label.style, nm.x, nm.y);

    const icon = document.createElement('span');
    icon.classList.add('nm-icon');
    const name = document.createElement('span');
    name.classList.add('nm-name');
    name.classList.add('text');
    name.innerText = this.TransByDispLang(nm.label);
    const progress = document.createElement('span');
    progress.innerText = '';
    progress.classList.add('nm-progress');
    progress.classList.add('text');
    const time = document.createElement('span');
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

    const container = document.getElementById('nm-labels');
    container.classList.add(this.zoneInfo.shortName);

    for (const key of this.nmKeys)
      this.AddElement(container, key);


    this.fairy = this.zoneInfo.fairy;
    if (this.fairy) {
      const fairyName = this.TransByParserLang(this.fairy);
      this.fairy.regex = Regexes.addedCombatantFull({ name: fairyName });
    }
    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    container.appendChild(this.playerElement);
  }

  ResetZone() {
    const container = document.getElementById('nm-labels');
    container.innerHTML = '';
    this.currentTracker = null;
    container.className = '';
  }

  OnPlayerChange(e) {
    if (!this.zoneInfo)
      return;
    this.SetStyleFromEntity(this.playerElement.style, e.detail.pos.x, e.detail.pos.y);
  }

  OnChangeZone(e) {
    this.zoneId = e.zoneID;

    this.zoneInfo = this.options.ZoneInfo[this.zoneId];
    const container = document.getElementById('container');
    if (this.zoneInfo) {
      this.ResetZone();

      const aspect = document.getElementById('aspect-ratio');
      while (aspect.classList.length > 0)
        aspect.classList.remove(aspect.classList.item(0));
      aspect.classList.add('aspect-ratio-' + this.zoneInfo.shortName);

      if (this.zoneInfo.mapImage) {
        document.getElementById('map-image').src = this.zoneInfo.mapImage;
        window.clearInterval(this.updateTimesHandle);
        this.updateTimesHandle = window.setInterval(() => this.UpdateTimes(),
            this.options.RefreshRateMs);
        container.classList.remove('hide');
      }
      this.InitNMs();
      this.ProcessFateQueue();
      this.ProcessCEQueue();
      this.UpdateTimes();
    } else {
      if (this.updateTimesHandle)
        window.clearInterval(this.updateTimesHandle);
      container.classList.add('hide');
    }

    const flags = document.getElementById('flag-labels');

    for (let i = 0; i < flags.children.length; ++i)
      flags.removeChild(flags.children[i]);
  }

  RespawnTime(nm) {
    let respawnTimeMs = 120 * 60 * 1000;
    if ('respawnMinutes' in nm)
      respawnTimeMs = nm.respawnMinutes * 60 * 1000;
    return respawnTimeMs + (+new Date());
  }

  DebugPrint(str) {
    if (this.options.Debug)
      console.log(str);
  }

  OnFatePop(fate) {
    this.DebugPrint(`OnFatePop: ${this.TransByDispLang(fate.label)}`);
    if (fate.element.classList.contains('nm-hidden'))
      fate.element.classList.remove('nm-hidden');

    if (fate.isCritical)
      fate.element.classList.add('critical-pop');
    else
      fate.element.classList.add('nm-pop');

    fate.element.classList.remove('nm-down');
    fate.lastPopTimeMsLocal = +new Date();
    fate.respawnTimeMsLocal = this.RespawnTime(fate);

    if (fate.bunny) {
      const shouldPlay = this.options.PopNoiseForBunny;
      if (shouldPlay && this.options.BunnyPopSound && this.options.BunnyPopVolume)
        this.PlaySound(this.options.BunnyPopSound, this.options.BunnyPopVolume);
    } else if (fate.isCritical) {
      const shouldPlay = fate.isDuel && this.options.PopNoiseForDuel ||
          !fate.isDuel && this.options.PopNoiseForCriticalEngagement;
      if (shouldPlay && this.options.CriticalPopSound && this.options.CriticalPopVolume)
        this.PlaySound(this.options.CriticalPopSound, this.options.CriticalPopVolume);
    } else {
      const shouldPlay = this.zoneInfo.treatNMsAsSkirmishes && this.options.PopNoiseForSkirmish ||
          !this.zoneInfo.treatNMsAsSkirmishes && this.options.PopNoiseForNM;
      if (shouldPlay && this.options.PopSound && this.options.PopVolume)
        this.PlaySound(this.options.PopSound, this.options.PopVolume);
    }
  }

  PlaySound(sound, volume) {
    const audio = new Audio(sound);
    audio.volume = volume;
    audio.play();
  }

  OnFateUpdate(fate, percent) {
    this.DebugPrint(`OnFateUpdate: ${this.TransByDispLang(fate.label)}: ${percent}%`);
    if (fate.element.classList.contains('nm-pop') || fate.element.classList.contains('critical-pop'))
      fate.progressElement.innerText = percent + '%';
  }

  OnFateKill(fate) {
    this.DebugPrint(`OnFateKill: ${this.TransByDispLang(fate.label)}`);
    this.UpdateTimes();
    if (fate.element.classList.contains('nm-pop')) {
      if (this.zoneInfo.dontShowInactive)
        fate.element.classList.add('nm-hidden');
      fate.element.classList.add('nm-down');
      fate.element.classList.remove('nm-pop');
      fate.progressElement.innerText = null;
      return;
    } else if (fate.element.classList.contains('critical-pop')) {
      if (this.zoneInfo.dontShowInactive)
        fate.element.classList.add('nm-hidden');
      fate.element.classList.add('critical-down');
      fate.element.classList.remove('critical-pop');
      fate.progressElement.innerText = null;
      return;
    }
  }

  ProcessFateQueue() {
    while (this.fateQueue.length !== 0)
      this.OnFate(this.fateQueue.pop());
  }

  ProcessCEQueue() {
    while (this.CEQueue.length !== 0)
      this.OnCE(this.CEQueue.pop());
  }

  UpdateTimes() {
    const nowMs = +new Date();

    const primaryWeatherList = this.zoneInfo.primaryWeather;
    if (primaryWeatherList) {
      for (let i = 0; i < 5; ++i) {
        document.getElementById('label-weather-icon' + i).innerHTML = '';
        document.getElementById('label-weather-text' + i).innerHTML = '';
      }

      for (let i = 0; i < 5 && i < primaryWeatherList.length; ++i) {
        const primaryWeather = primaryWeatherList[i];
        if (!primaryWeather)
          continue;
        const weather = getWeather(nowMs, this.zoneId);
        const weatherIcon = gWeatherIcons[primaryWeather];
        let weatherStr;
        if (weather === primaryWeather) {
          const stopTime = findNextWeatherNot(nowMs, this.zoneId, primaryWeather);
          weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);
        } else {
          const startTime = findNextWeather(nowMs, this.zoneId, primaryWeather);
          weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);
        }
        document.getElementById('label-weather-icon' + i).innerHTML = weatherIcon;
        document.getElementById('label-weather-text' + i).innerHTML = weatherStr;
      }
    } else {
      const currentWeather = getWeather(nowMs, this.zoneId);
      const stopTime = findNextWeatherNot(nowMs, this.zoneId, currentWeather);
      const weatherIcon = gWeatherIcons[currentWeather];
      let weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);
      document.getElementById('label-weather-icon0').innerHTML = weatherIcon;
      document.getElementById('label-weather-text0').innerHTML = weatherStr;

      // round up current time
      let lastTime = nowMs;
      let lastWeather = currentWeather;
      for (let i = 1; i < 5; ++i) {
        const startTime = findNextWeatherNot(lastTime, this.zoneId, lastWeather);
        const weather = getWeather(startTime + 1, this.zoneId);
        const weatherIcon = gWeatherIcons[weather];
        weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);
        document.getElementById('label-weather-icon' + i).innerHTML = weatherIcon;
        document.getElementById('label-weather-text' + i).innerHTML = weatherStr;
        lastTime = startTime;
        lastWeather = weather;
      }
    }

    const nextDay = findNextNight(nowMs);
    const nextNight = findNextDay(nowMs);
    let timeIcon;
    if (nextDay > nextNight)
      timeIcon = gNightIcon;
    else
      timeIcon = gDayIcon;

    const dayNightMin = Math.ceil((Math.min(nextDay, nextNight) - nowMs) / 1000 / 60);
    const timeStr = this.TransByDispLang(this.options.timeStrings.timeFor)(dayNightMin);
    document.getElementById('label-time-icon').innerHTML = timeIcon;
    document.getElementById('label-time-text').innerHTML = timeStr;

    document.getElementById('label-tracker').innerHTML = this.currentTracker;

    // TODO: don't early out here, because it means bozja can't show a timer.
    // Instead, maybe add a per-zone default respawn time which, if null/zero,
    // means don't show respawn times unless specified.
    if (this.zoneInfo.shortName === 'bozjasouthern')
      return;

    for (let i = 0; i < this.nmKeys.length; ++i) {
      const nm = this.nms[this.nmKeys[i]];

      let respawnMs = null;
      if (nm.respawnTimeMsLocal)
        respawnMs = nm.respawnTimeMsLocal;
      else if (nm.respawnTimeMsTracker)
        respawnMs = nm.respawnTimeMsTracker;


      const popRespawnMs = respawnMs;

      // Ignore respawns in the past.
      respawnMs = Math.max(respawnMs, nowMs);
      let respawnIcon = '';

      if (nm.weather) {
        const respawnWeather = getWeather(respawnMs, this.zoneId);
        if (respawnWeather !== nm.weather) {
          const weatherStartTime =
            findNextWeather(respawnMs, this.zoneId, nm.weather);
          if (weatherStartTime > respawnMs) {
            respawnIcon = gWeatherIcons[nm.weather];
            respawnMs = weatherStartTime;
          }
        }
      }

      if (nm.time === 'Night') {
        const isNight = isNightTime(respawnMs);
        if (!isNight) {
          const nextNight = findNextNight(respawnMs);
          if (nextNight > respawnMs) {
            respawnIcon = gNightIcon;
            respawnMs = nextNight;
          }
        }
      }

      const remainingMs = respawnMs - nowMs;
      if (remainingMs <= 0) {
        let openUntil = null;
        if (nm.weather) {
          const weatherStartTime = findNextWeatherNot(nowMs, this.zoneId, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather];
          openUntil = weatherStartTime;
        }
        if (nm.time === 'Night') {
          respawnIcon = gNightIcon;
          openUntil = findNextDay(nowMs);
        }

        if (openUntil) {
          const openMin = (openUntil - nowMs) / 1000 / 60;
          const nmString = respawnIcon + Math.ceil(openMin) +
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

        const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        const nmString = respawnIcon + remainingMinutes +
          this.TransByDispLang(this.options.timeStrings.minute);
        nm.timeElement.innerHTML = nmString;
        nm.element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText) {
    const trackerToNM = {};
    for (let i = 0; i < this.nmKeys.length; ++i) {
      const nm = this.nms[this.nmKeys[i]];
      if (!nm.trackerName)
        continue;
      trackerToNM[this.TransByParserLang(nm.trackerName).toLowerCase()] = nm;
    }

    let regex = this.TransByParserLang(this.options.Regex);
    regex = regex['gTimeRegex'];
    const importList = importText.split(' → ');
    for (let i = 0; i < importList.length; i++) {
      const m = importList[i].match(regex);
      if (!m) {
        console.error('Unknown tracker entry: ' + importList[i]);
        continue;
      }
      const name = m[1];
      const time = m[2];
      const nm = trackerToNM[name.toLowerCase()];
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
    for (const log of e.detail.logs) {
      const gFlagRegex = this.TransByParserLang(this.options.Regex, 'gFlagRegex');
      let match = log.match(gFlagRegex);
      if (match)
        this.AddFlag(match[2], match[3], match[1], match[4]);

      if (this.fairy) {
        if (log.includes(' 03:') || log.includes('00:0839:')) {
          match = log.match(this.fairy.regex);
          if (match)
            this.AddFairy(match.groups);
        }
      }

      if (!this.zoneInfo.hasTracker)
        return;

      const gTrackerRegex = this.TransByParserLang(this.options.Regex, 'gTrackerRegex');
      match = log.match(gTrackerRegex);
      if (match)
        this.currentTracker = match[1];
      const gImportRegex = this.TransByParserLang(this.options.Regex, 'gImportRegex');
      match = log.match(gImportRegex);
      if (match) {
        this.ImportFromTracker(match[2]);
        continue;
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
      for (const key of this.nmKeys) {
        const nm = this.nms[key];
        if (e.detail.fateID === nm.fateID) {
          this.OnFatePop(nm);
          return;
        }
      }
      break;
    case 'remove':
      for (const key of this.nmKeys) {
        const nm = this.nms[key];
        if (e.detail.fateID === nm.fateID) {
          this.OnFateKill(nm);
          return;
        }
      }
      break;
    case 'update':
      for (const key of this.nmKeys) {
        const nm = this.nms[key];
        if (e.detail.fateID === nm.fateID) {
          this.OnFateUpdate(nm, e.detail.progress);
          return;
        }
      }
      break;
    }
  }

  OnCE(e) {
    // Upon entering Eureka we usually receive the CE info before
    // this.zoneInfo is loaded, so lets store the events until we're
    // able to process them.
    // TODO: don't make pop noises for CEs that have already started.

    if (!this.zoneInfo) {
      this.CEQueue.push(e);
      return;
    }

    let nm = null;
    for (const key of this.nmKeys) {
      if (e.detail.data.ceKey === this.nms[key].ceKey) {
        nm = this.nms[key];
        break;
      }
    }
    if (!nm)
      return;

    switch (e.detail.eventType) {
    case 'add':
      this.OnFatePop(nm);
      break;
    case 'remove':
      this.OnFateKill(nm);
      break;
    case 'update':
      if (e.detail.data.status === 3)
        this.OnFateUpdate(nm, e.detail.data.progress);
      break;
    }
  }

  SimplifyText(beforeText, afterText) {
    const str = (beforeText + ' ' + afterText).toLowerCase();

    const dict = {
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
    const keys = Object.keys(dict);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      for (let j = 0; j < dict[key].length; ++j) {
        const m = dict[key][j];
        if (str.includes(m))
          return key;
      }
    }
  }

  AddFlag(x, y, beforeText, afterText) {
    const simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }
    beforeText = beforeText.replace(/(?: at|@)$/, '');

    const container = document.getElementById('flag-labels');
    const label = document.createElement('div');
    label.classList.add('flag');
    this.SetStyleFromMap(label.style, x, y);

    const icon = document.createElement('span');
    icon.classList.add('flag-icon');
    const name = document.createElement('span');
    name.classList.add('flag-name');
    name.classList.add('text');
    name.innerText = beforeText;
    if (beforeText !== '' && afterText !== '')
      name.innerText += ' ';
    name.innerText += afterText;
    label.appendChild(icon);
    label.appendChild(name);
    container.appendChild(label);

    window.setTimeout(() => {
      // Changing zones can also orphan all the labels.
      if (label.parentElement === container)
        container.removeChild(label);
    }, this.options.FlagTimeoutMs);
  }

  AddFairy(matches) {
    const mx = this.EntityToMapX(parseFloat(matches.x));
    const my = this.EntityToMapY(parseFloat(matches.y));
    this.AddFlag(mx, my, this.TransByParserLang(this.zoneInfo.fairy), '');
  }
}

UserConfig.getUserConfigLocation('eureka', Options, (e) => {
  addOverlayListener('onPlayerChangedEvent', (e) => {
    gTracker.OnPlayerChange(e);
  });
  addOverlayListener('ChangeZone', (e) => {
    gTracker.OnChangeZone(e);
  });
  addOverlayListener('onLogEvent', (e) => {
    gTracker.OnLog(e);
  });
  addOverlayListener('onFateEvent', (e) => {
    gTracker.OnFate(e);
  });
  addOverlayListener('onCEEvent', (e) => {
    gTracker.OnCE(e);
  });

  gTracker = new EurekaTracker(Options);
});
