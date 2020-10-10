'use strict';

[{
  zoneId: ZoneId.AlexanderTheEyesOfTheCreatorSavage,
  timelineFile: 'a9s.txt',
  timelineTriggers: [
    {
      id: 'A9S Panzerschreck',
      regex: 'Panzerschreck',
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A9S Power Generator',
      regex: /Power Generator/,
      infoText: function(data) {
        let nw1se1 = {
          en: 'Place Generators NW/SE',
          de: 'Plaziere Generatoren NW/SO',
          fr: 'Placez les Générateurs NO/SE',
          ja: 'パワージェネレーターを北西/南東に運ぶ',
          cn: '搬运发电器到西北/东南',
          ko: '발전기 놓기: 북서/남동',
        };
        let nw2 = {
          en: 'Place Generators NW',
          de: 'Plaziere Generatoren NW',
          fr: 'Placez les Générateurs NO',
          ja: 'パワージェネレーターを北西に運ぶ',
          cn: '搬运发电器到西北',
          ko: '발전기 놓기: 북서',
        };
        let nw1 = {
          en: 'Place Generator NW',
          de: 'Plaziere Generator NW',
          fr: 'Placez les Générateurs NO',
          ja: 'パワージェネレーターを北西に運ぶ',
          cn: '搬运发电器到西北',
          ko: '발전기 놓기: 북서/남동',
        };
        let se2 = {
          en: 'Place Generators SE',
          de: 'Plaziere Generatoren SO',
          fr: 'Placez les Générateurs SE',
          ja: 'パワージェネレーターを南東に運ぶ',
          cn: '搬运发电器到东南',
          ko: '발전기 놓기: 남동',
        };

        return {
          1: nw1se1,
          2: nw2,
          // 3: faust,
          4: nw1,
          5: se2,
          6: nw1,
          7: se2,
          8: nw1,
        }[data.stockpileCount];
      },
    },
    {
      id: 'A9S Alarum',
      regex: /Alarum/,
      delaySeconds: 1,
      infoText: function(data) {
        // .. or anywhere not NW
        let se = {
          en: 'Kill Alarum SE',
          de: 'SO Alarm besiegen',
          fr: 'Tuez l\'Alarum SE',
          ja: '南東のアラームを倒す',
          cn: '在东南击杀警报',
          ko: '남동쪽 경보기 없애기',
        };
        // ... or anywhere not NW/SE
        let sw = {
          en: 'Kill Alarum SW',
          de: 'SW Alarm besiegen',
          fr: 'Tuez l\'Alarum SO',
          ja: '南西のアラームを倒す',
          cn: '在西南击杀警报',
          ko: '남서쪽 경보기 없애기',
        };

        return {
          5: se,
          6: sw,
          7: se,
          8: sw,
        }[data.stockpileCount];
      },
    },
    {
      id: 'A9S Bomb Explosion',
      regex: /Explosion/,
      beforeSeconds: 7,
      infoText: {
        en: 'Bombs Soon',
        de: 'Bomben bald',
        fr: 'Bombes bientôt',
        ja: 'まもなく爆弾',
        cn: '炸弹马上爆炸',
        ko: '곧 폭탄 폭발',
      },
    },
  ],
  triggers: [
    {
      id: 'A9S Stockpile Count',
      netRegex: NetRegexes.startsUsing({ source: 'Refurbisher 0', id: '1A38', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rekompositor', id: '1A38', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Récupérateur', id: '1A38', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リファビッシャー', id: '1A38', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '废品翻新装置', id: '1A38', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '재생자', id: '1A38', capture: false }),
      run: function(data) {
        data.stockpileCount = data.stockpileCount || 0;
        data.stockpileCount++;
      },
    },
    {
      id: 'A9S Scrapline',
      netRegex: NetRegexes.startsUsing({ source: 'Refurbisher 0', id: '1A3C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rekompositor', id: '1A3C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Récupérateur', id: '1A3C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リファビッシャー', id: '1A3C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '废品翻新装置', id: '1A3C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '재생자', id: '1A3C', capture: false }),
      alertText: function(data) {
        if (data.mainTank == data.me)
          return;
        return {
          en: 'Get Behind',
          de: 'Hinter ihn',
          fr: 'Passez derrière',
          ja: '背面へ',
          ko: '보스 뒤로',
          cn: '去背后',
        };
      },
      infoText: function(data) {
        if (data.mainTank != data.me)
          return;
        return {
          en: 'Scrapline on YOU',
          de: 'Schrottlinie auf DIR',
          fr: 'Corde à ferraille sur VOUS',
          ja: '自分にスクラップラリアット',
          cn: '死刑',
          ko: '후려갈기기 대상자',
        };
        // ...probably, we hope...
      },
    },
    {
      id: 'A9S Double Scrapline',
      netRegex: NetRegexes.startsUsing({ source: 'Refurbisher 0', id: '1A3D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rekompositor', id: '1A3D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Récupérateur', id: '1A3D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リファビッシャー', id: '1A3D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '废品翻新装置', id: '1A3D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '재생자', id: '1A3D', capture: false }),
      alertText: {
        en: 'Stand in Alarum Puddle',
        de: 'In Alarm Fläche stehen',
        fr: 'Tenez-vous dans la zone de l\'Alarum',
        ja: '紫色の沼に入る',
        cn: '站进紫色圈圈',
        ko: '경보기 장판 밟기',
      },
    },
    {
      id: 'A9S Scrap Rock',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Rock on YOU',
        de: 'Stein auf DIR',
        fr: 'Rocher sur VOUS',
        ja: '自分に落石',
        cn: '落石点名',
        ko: '돌 징 대상자',
      },
    },
    {
      id: 'A9S Scrap Burst',
      netRegex: NetRegexes.headMarker({ id: '0017', capture: false }),
      delaySeconds: 5,
      suppressSeconds: 1,
      alertText: {
        en: 'Hide Fully Behind Rock',
        de: 'Komplett hinter dem Stein verstecken',
        fr: 'Cachez-vous derrière le rocher',
        ja: '壁の後ろに',
        cn: '躲在石头后',
        ko: '돌 뒤에 숨기',
      },
    },
    {
      id: 'A9S Scrap Bomb Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      // TODO: dubious to tell the person tanking to do it here.
      // But maybe fine to inform.
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'A9S Spread',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A9S Auto',
      netRegex: NetRegexes.ability({ source: 'Refurbisher 0', id: '1AFE' }),
      netRegexDe: NetRegexes.ability({ source: 'Rekompositor', id: '1AFE' }),
      netRegexFr: NetRegexes.ability({ source: 'Récupérateur', id: '1AFE' }),
      netRegexJa: NetRegexes.ability({ source: 'リファビッシャー', id: '1AFE' }),
      netRegexCn: NetRegexes.ability({ source: '废品翻新装置', id: '1AFE' }),
      netRegexKo: NetRegexes.ability({ source: '재생자', id: '1AFE' }),
      run: function(data, matches) {
        data.mainTank = matches.target;
      },
    },
    {
      id: 'A9S Power Generator Add Tether',
      netRegex: NetRegexes.tether({ id: '0011', capture: false }),

      suppressSeconds: 30,
      infoText: function(data) {
        // Some of the last phases have multiple options.
        // This is an old fight, so just pick one for people.
        let ne = {
          en: 'Adds to NE Lava',
          de: 'Adds in NO Lava',
          fr: 'Adds dans la lave NE',
          ja: '北東にパワージェネレーターを倒す',
          cn: '拉小怪到东北击杀',
          ko: '쫄을 북동쪽 용암으로',
        };
        let se = {
          en: 'Adds to SE Lava',
          de: 'Adds in SO Lava',
          fr: 'Adds dans la lave SE',
          ja: '南東にパワージェネレーターを倒す',
          cn: '拉小怪到东南击杀',
          ko: '쫄을 남동쪽 용암으로',
        };
        let sw = {
          en: 'Adds to SW Lava',
          de: 'Adds in SW Lava',
          fr: 'Adds dans la lave SO',
          ja: '南西にパワージェネレーターを倒す',
          cn: '拉小怪到西南击杀',
          ko: '쫄을 남서쪽 용암으로',
        };
        let nw = {
          en: 'Adds to NW Lava',
          de: 'Adds in NW Lava',
          fr: 'Adds dans la lave NO',
          ja: '北西にパワージェネレーターを倒す',
          cn: '拉小怪到西北击杀',
          ko: '쫄을 북서쪽 용암으로',
        };

        return {
          1: ne,
          2: se,
          // 3: faust,
          4: sw,
          5: nw,
          6: sw,
          7: nw,
          8: sw,
        }[data.stockpileCount];
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb': 'Bombe',
        'Faust Z': 'Endfaust',
        'Full-Metal Faust': 'Vollmetall-Faust',
        'Refurbisher 0': 'Rekompositor',
        'Scrap': 'Verschrotten',
        'The Cranial Plate': 'Schädeldecke',
        'Life Support': 'Wiederaufbereitungsanlage',
      },
      'replaceText': {
        '--rocks fall--': '--Felsen fallen--',
        'Acid Rain': 'Säureregen',
        'Alarum': 'Alarm',
        '(?<!Scrap )Bomb(?!e)': 'Bombe',
        'Explosion': 'Explosion',
        'Full-Metal Faust Add': 'Vollmetall-Faust Add',
        'Heat Shielding Reassembly': 'Hitzeschild-Regeneration',
        'Kaltstrahl': 'Kaltstrahl',
        'Lava': 'Lava',
        'Left Arm Reassembly': 'Linke Regeneration',
        'Panzer Vor': 'Panzer vor',
        'Panzerschreck': 'Panzerschreck',
        'Power Generator': 'Generator',
        'Right Arm Reassembly': 'Rechte Regeneration',
        'Scrap Bomb': 'Schrottbombe',
        'Scrap Burst': 'Schrottknall',
        'Scrap Storm': 'Schrottsprengung',
        'Scrap(?! )': 'Verschrotten',
        'Stockpile': 'Absorption',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb': 'Bombe',
        'Faust Z': 'Endfaust',
        'Full-Metal Faust': 'Eisernfaust',
        'Life Support': 'la chambre de recyclage CR',
        'Refurbisher 0': 'Récupérateur',
        'Scrap': 'Ferraille',
        'The Cranial Plate': 'pont nasal',
      },
      'replaceText': {
        '(?<!Double )Scrapline': 'Corde à ferraille',
        '(?<!Scrap )Bomb(?!e)': 'Bombe',
        '--rocks fall--': '--chute des rochers--',
        'Acid Rain': 'Pluie acide',
        'Alarum': 'Alarum',
        'Double Scrapline': 'Double corde à ferraille',
        'Explosion': 'Explosion',
        'Full-Metal Faust Add': 'Add Eisernfaust',
        'Heat Shielding Reassembly': 'Régénération du bouclier thermique',
        'Kaltstrahl': 'Kaltstrahl',
        'Lava': 'Lave',
        'Left Arm Reassembly': 'Régénération du bras gauche',
        'Panzer Vor': 'Panzer Vor',
        'Panzerschreck': 'Panzerschreck',
        'Power Generator': 'Générateur d\'énergie',
        'Right Arm Reassembly': 'Régénération du bras droit',
        'Scrap Bomb': 'Bombe de ferraille',
        'Scrap Burst': 'Déflagration de ferraille',
        'Scrap Storm': 'Tempête de ferraille',
        'Scrap(?! |line)': 'Ferraille',
        'Stockpile': 'Agglomération',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb': '爆弾',
        'Faust Z': 'ファイナル・ファウスト',
        'Full-Metal Faust': 'フルアーマー・ファウスト',
        'Refurbisher 0': 'リファビッシャー',
        'Scrap': 'スクラップパンチ',
        'The Cranial Plate': '頭部甲板',
        'Life Support': '再生処理室',
      },
      'replaceText': {
        '--rocks fall--': '--落石--',
        'Acid Rain': '酸性雨',
        'Alarum': 'アラーム',
        '(?<!Scrap )Bomb': '爆弾',
        'Explosion': '爆発',
        'Full-Metal Faust Add': '雑魚: フルアーマー・ファウスト',
        'Heat Shielding Reassembly': '装甲再生',
        'Kaltstrahl': 'カルトシュトラール',
        'Lava': 'ラーヴァ',
        'Left Arm Reassembly': '左腕再生',
        'Panzer Vor': 'パンツァーフォー',
        'Panzerschreck': 'パンツァーシュレッケ',
        'Power Generator': 'パワージェネレーター',
        'Right Arm Reassembly': '右腕再生',
        'Scrap Bomb': 'スクラップボム',
        'Scrap Burst': 'スクラップバースト',
        'Scrap Storm': 'スクラップストーム',
        'Scrap(?! )': 'スクラップパンチ',
        'Stockpile': '吸収',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb': '炸弹',
        'Faust Z': '终极浮士德',
        'Full-Metal Faust': '全装甲浮士德',
        'Life Support': '再生处理室',
        'Refurbisher 0': '废品翻新装置',
        'Scrap': '废料拳',
        'The Cranial Plate': '头部甲板',
      },
      'replaceText': {
        '(?<!Double )Scrapline': '废料碎颈臂',
        '--rocks fall--': '--石头落下--',
        'Acid Rain': '酸雨',
        'Alarum': '警报',
        '(?<!Scrap )Bomb': '炸弹',
        'Double Scrapline': '二重碎颈臂',
        'Explosion': '爆炸',
        'Full-Metal Faust Add': '全装甲浮士德出现',
        'Heat Shielding Reassembly': '装甲再生',
        'Kaltstrahl': '寒光',
        'Lava': '岩浆',
        'Left Arm Reassembly': '左臂再生',
        'Panzer Vor': '战车前进',
        'Panzerschreck': '反坦克火箭筒',
        'Power Generator': '动力发生器',
        'Right Arm Reassembly': '右臂再生',
        'Scrap Bomb': '废料炸弹',
        'Scrap Burst': '废料爆发',
        'Scrap Storm': '废料风暴',
        'Scrap(?! |line)': '废料拳',
        'Stockpile': '吸收',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bomb': '폭탄',
        'Faust Z': '최종형 파우스트',
        'Full-Metal Faust': '완전무장 파우스트',
        'Life Support': '재생처리실',
        'Refurbisher 0': '재생자',
        'Scrap': '고물',
        'The Cranial Plate': '머리 갑판',
      },
      'replaceText': {
        '(?<!Double )Scrapline': '한팔 후려갈기기',
        '--rocks fall--': '--바위 낙하--',
        'Acid Rain': '산성비',
        'Alarum': '경보기',
        '(?<!Scrap )Bomb': '폭탄',
        'Double Scrapline': '양팔 후려갈기기',
        'Explosion': '폭발',
        'Full-Metal Faust Add': '파우스트 등장',
        'Heat Shielding Reassembly': '장갑 재생',
        'Kaltstrahl': '냉병기 공격',
        'Lava': '용암',
        'Left Arm Reassembly': '왼팔 재생',
        'Panzer Vor': '기갑 전진',
        'Panzerschreck': '대전차포',
        'Power Generator': '발전기',
        'Right Arm Reassembly': '오른팔 재생',
        'Scrap Bomb': '고철 폭탄',
        'Scrap Burst': '고철 폭발',
        'Scrap Storm': '고철 폭풍',
        'Scrap(?! |line)': '고철 주먹',
        'Stockpile': '흡수',
      },
    },
  ],
}];
