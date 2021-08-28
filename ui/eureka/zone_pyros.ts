import { bunnyLabel, EurekaZoneInfo } from './eureka';
import pyrosMap from './pyros.png';

// https://xivapi.com/search?indexes=Fate&filters=ID>=1388,ID<=1408&columns=Description,Name,Url

export const zoneInfoPyros: EurekaZoneInfo = {
  mapImage: pyrosMap,
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
};
