'use strict';

// Tsukuyomi Extreme
[{
  zoneRegex: {
    en: /^The Minstrel's Ballad: Tsukuyomi's Pain$/,
    cn: /^月读幽夜歼灭战$/,
    ko: /^극 츠쿠요미 토벌전$/,
  },
  timelineFile: 'tsukuyomi-ex.txt',
  triggers: [
    {
      id: 'Tsukuyomi Nightfall Gun',
      regex: Regexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2BBC', source: 'ツクヨミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2BBC', source: '月读', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2BBC', source: '츠쿠요미', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'Tsukuyomi Nightfall Spear',
      regex: Regexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2BBD', source: 'ツクヨミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2BBD', source: '月读', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2BBD', source: '츠쿠요미', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Tsukuyomi Torment',
      regex: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      regexDe: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      regexFr: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      regexJa: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'ツクヨミ' }),
      regexCn: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: '月读' }),
      regexKo: Regexes.startsUsing({ id: ['2BBB', '2EB2'], source: '츠쿠요미' }),
      alarmText: function(data, matches) {
        if (matches.target == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          cn: '换T！',
          ko: '탱 교대',
        };
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
            ko: '탱버 대상자',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑->' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(target) + '" 탱버',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role == 'tank' || data.role == 'healer')
          return;

        return {
          en: 'Get out of front',
          de: 'Weg von vorn',
          fr: 'Ne restez pas devant !',
          cn: '远离正面',
          ko: '정면 피하기',
        };
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
            ko: '탱버',
          };
        }
      },
    },
    {
      id: 'Tsukuyomi Full Moon',
      regex: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'Full Moon', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'Vollmond', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'Force De La Pleine Lune', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ツクヨミ', effect: '満月流', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '月读', effect: '满月流', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '츠쿠요미', effect: '보름달', capture: false }),
      run: function(data) {
        let moonInOut = {
          en: 'Out',
          de: 'Raus',
          fr: 'Loin',
          cn: '远离',
          ko: '밖',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      id: 'Tsukuyomi New Moon',
      regex: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'New Moon', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'Neumond', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Tsukuyomi', effect: 'Force De La Nouvelle Lune', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ツクヨミ', effect: '新月流', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '月读', effect: '新月流', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '츠쿠요미', effect: '그믐달', capture: false }),
      run: function(data) {
        let moonInOut = {
          en: 'In',
          de: 'Rein',
          fr: 'Près',
          cn: '靠近',
          ko: '안',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      id: 'Tsukuyomi Dark Blade',
      regex: Regexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2BDA', source: 'ツクヨミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2BDA', source: '月读', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2BDA', source: '츠쿠요미', capture: false }),
      infoText: function(data) {
        return {
          en: 'Left + ' + data.moonInOut,
          fr: 'Gauche + ' + data.moonInOut,
          de: 'Links + ' + data.moonInOut,
          cn: '左边 + ' + data.moonInOut,
          ko: '왼쪽 + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Bright Blade',
      regex: Regexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2BDB', source: 'ツクヨミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2BDB', source: '月读', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2BDB', source: '츠쿠요미', capture: false }),
      infoText: function(data) {
        return {
          en: 'Right + ' + data.moonInOut,
          fr: 'Droite + ' + data.moonInOut,
          de: 'Rechts + ' + data.moonInOut,
          cn: '右边 + ' + data.moonInOut,
          ko: '오른쪽 + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Meteor Marker',
      regex: Regexes.headMarker({ id: '0083' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      response: Responses.meteorOnYou(),
    },
    {
      id: 'Tsukuyomi Lunacy',
      regex: Regexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'Tsukuyomi Hagetsu',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      response: Responses.spread(),
    },
    {
      id: 'Tsukuyomi Dance of the Dead',
      // There's no "starts using" here.  She pushes at 35% to this ability.
      // This happens after 2nd meteors naturally, but if dps is good
      // then this could push unexpectedly earlier (or paired with buster).
      regex: Regexes.dialog({ line: '[^:]*:No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\..*?', capture: false }),
      regexDe: Regexes.dialog({ line: '[^:]*:Meine Rache \\.\\.\\. Ich will\\.\\.\\. meine Rache\\.\\.\\..*?', capture: false }),
      regexFr: Regexes.dialog({ line: '[^:]*:Non\\, je ne peux pas\\.\\.\\. échouer\\.\\.\\..*?', capture: false }),
      regexJa: Regexes.dialog({ line: '[^:]*:嗚呼、まだ、あたしは…………。.*?', capture: false }),
      regexCn: Regexes.dialog({ line: '[^:]*:我不能输.*我还没有.*.*?', capture: false }),
      regexKo: Regexes.dialog({ line: '[^:]*:아아, 나는 아직……\\..*?', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Tsukuyomi Supreme Selenomancy',
      regex: Regexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      regexDe: Regexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      regexFr: Regexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      regexJa: Regexes.ability({ source: 'ツクヨミ', id: '2EB0', capture: false }),
      regexCn: Regexes.ability({ source: '月读', id: '2EB0', capture: false }),
      regexKo: Regexes.ability({ source: '츠쿠요미', id: '2EB0', capture: false }),
      suppressSeconds: 5,
      run: function(data) {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
    },
    {
      id: 'Tsukuyomi Moonlit Debuff Logic',
      regex: Regexes.gainsEffect({ effect: 'Moonlit' }),
      regexDe: Regexes.gainsEffect({ effect: 'Mondschein' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pleine Lune' }),
      regexJa: Regexes.gainsEffect({ effect: '満月下' }),
      regexCn: Regexes.gainsEffect({ effect: '满月下' }),
      regexKo: Regexes.gainsEffect({ effect: '보름달빛' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonlitCount === 'undefined')
          data.moonlitCount = 3;

        data.moonlitCount += 1;
        data.moonshadowedCount = 0;
        // dead/reset?
        if (data.moonlitCount > 4)
          data.moonlitCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonlit Debuff',
      regex: Regexes.gainsEffect({ effect: 'Moonlit' }),
      regexDe: Regexes.gainsEffect({ effect: 'Mondschein' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pleine Lune' }),
      regexJa: Regexes.gainsEffect({ effect: '満月下' }),
      regexCn: Regexes.gainsEffect({ effect: '满月下' }),
      regexKo: Regexes.gainsEffect({ effect: '보름달빛' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.moonlitCount >= 4;
      },
      infoText: {
        en: 'Move to Black!',
        de: 'In\'s schwarze laufen!',
        fr: 'Bougez en zone noire !',
        cn: '踩黑色！',
        ko: '검정색으로 이동!',
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff Logic',
      regex: Regexes.gainsEffect({ effect: 'Moonshadowed' }),
      regexDe: Regexes.gainsEffect({ effect: 'Mondschatten' }),
      regexFr: Regexes.gainsEffect({ effect: 'Nouvelle Lune' }),
      regexJa: Regexes.gainsEffect({ effect: '新月下' }),
      regexCn: Regexes.gainsEffect({ effect: '新月下' }),
      regexKo: Regexes.gainsEffect({ effect: '그믐달빛' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonshadowedCount === 'undefined')
          data.moonshadowedCount = 3;

        data.moonshadowedCount += 1;
        data.moonlitCount = 0;
        // dead/reset?
        if (data.moonshadowedCount > 4)
          data.moonshadowedCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff',
      regex: Regexes.gainsEffect({ effect: 'Moonshadowed' }),
      regexDe: Regexes.gainsEffect({ effect: 'Mondschatten' }),
      regexFr: Regexes.gainsEffect({ effect: 'Nouvelle Lune' }),
      regexJa: Regexes.gainsEffect({ effect: '新月下' }),
      regexCn: Regexes.gainsEffect({ effect: '新月下' }),
      regexKo: Regexes.gainsEffect({ effect: '그믐달빛' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.moonshadowedCount >= 4;
      },
      infoText: {
        en: 'Move to White!',
        de: 'In\'s weiße laufen!',
        fr: 'Bougez en zone blanche !',
        cn: '踩白色！',
        ko: '흰색으로 이동!',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Full Moon': 'Vollmond',
        'Moondust': 'Mondfragment',
        'Moonlight': 'Mondlicht',
        'New Moon': 'Neumond',
        'No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\.': 'Meine Rache ... Ich will... meine Rache...',
        'Specter Of Asahi': 'Asahi',
        'Specter Of The Patriarch': 'Yotsuyus Ziehvater',
        'Specter Of Zenos': 'Zenos',
        'Specter of Gosetsu': 'Gosetsu',
        'Specter(?! )': 'Schemen',
        'Tsukuyomi': 'Tsukuyomi',
      },
      'replaceText': {
        'Antitwilight': 'Schönheit der Nacht',
        'Concentrativity': 'Konzentriertheit',
        'Crater': 'Krater',
        'Dance Of The Dead': 'Tanz der Toten',
        'Dark Blade': 'Dunkle Klinge',
        'Dispersivity': 'Dispersivität',
        'Empire adds .SW->NW.': 'Garlear Adds (SW->NW)',
        'Hagetsu': 'Hagetsu',
        'Homeland adds .E->W.': 'Domaner Adds (O->W)',
        'Lead Of The Underworld': 'Blei der Unterwelt',
        'Lead/Steel': 'Blei/Stahl',
        'Lunacy': 'Mondscheinblüte',
        'Lunar Halo': 'Flammender Mond',
        'Lunar Rays': 'Mondschimmer',
        'Midnight Rain': 'Mitternachtsregen',
        'Moonburst': 'Mondeinschlag',
        'Moonfall': 'Mondfall',
        'Nightbloom': 'Monddämmerung',
        'Nightfall': 'Einbruch der Dunkelheit',
        'Perilune': 'Zenit des Mondes',
        'Reprimand': 'Maßregelung',
        'Steel Of The Underworld': 'Stahl der Unterwelt',
        'Steel/Lead': 'Stahl/Blei',
        'Supreme Selenomancy': 'Hohe Mondprophezeiung',
        'Torment Unto Death': 'Todesqualen',
        'Tsuki-no-Kakera': 'Mondsplitter',
        'Tsuki-no-Maiogi': 'Mondfächer',
        'Waxing Grudge': 'Wachsender Groll',
        'Zashiki-asobi': 'Zashiki-Asobi',
      },
      '~effectNames': {
        'Full Moon': 'Vollmond',
        'Moonlit': 'Mondschein',
        'Moonshadowed': 'Mondschatten',
        'New Moon': 'Neumond',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Full Moon': 'Force de la pleine lune',
        'Moondust': 'fragment de lune',
        'Moonlight': 'Clair de lune',
        'New Moon': 'Force de la nouvelle lune',
        'No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\.': 'Non, je ne peux pas... échouer...',
        'Specter Of Asahi': 'apparition d\'Asahi',
        'Specter Of The Patriarch': 'spectre du parâtre',
        'Specter Of Zenos': 'spectre de Zenos',
        'Specter of Gosetsu': 'apparition de Gosetsu',
        'Specter(?! )': 'spector',
        'Tsukuyomi': 'Tsukuyomi',
      },
      'replaceText': {
        'Antitwilight': 'Belle-de-nuit',
        'Concentrativity': 'Kenki concentré',
        'Crater': 'Explosion de fragment lunaire',
        'Dance Of The Dead': 'Danse des morts',
        'Dark Blade': 'Lame ténébreuse',
        'Dispersivity': 'Onde Kenki',
        'Empire adds .SW->NW.': 'Soldats Impériaux (SO->NO)',
        'Hagetsu': 'Pulvérisation lunaire',
        'Homeland adds .E->W.': 'Soldats Domiens (E->O)',
        'Lead Of The Underworld': 'Tir de l\'au-delà',
        'Lead/Steel': 'Tir De L\'au-delà/Pointes De L\'au-delà',
        'Lunacy': 'Efflorescence au clair de lune',
        'Lunar Halo': 'Flamboiement lunaire',
        'Lunar Rays': 'Rayons lunaires',
        'Midnight Rain': 'Bruine nocturne',
        'Moonburst': 'Entrechoc de fragments lunaires',
        'Moonfall': 'Impact de fragment lunaire',
        'Nightbloom': 'Lis araignée',
        'Nightfall': 'Jeune nuit',
        'Perilune': 'Zénith lunaire',
        'Reprimand': 'Correction',
        'Steel Of The Underworld': 'Pointes de l\'au-delà',
        'Steel/Lead': 'Pointes De L\'au-delà/Tir De L\'au-delà',
        'Supreme Selenomancy': 'Sélénomancie suprême',
        'Torment Unto Death': 'Brimade meurtrière',
        'Tsuki-no-Kakera': 'Fragments lunaires',
        'Tsuki-no-Maiogi': 'Maiôgi lunaire',
        'Waxing Grudge': 'Rancœur blafarde',
        'Zashiki-asobi': 'Zashiki asobi',
      },
      '~effectNames': {
        'Full Moon': 'Force de la pleine lune',
        'Moonlit': 'Pleine lune',
        'Moonshadowed': 'Nouvelle lune',
        'New Moon': 'Force de la nouvelle lune',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Full Moon': '満月流',
        'Moondust': '月の欠片',
        'Moonlight': '月光',
        'New Moon': '新月流',
        'No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\.': '嗚呼、まだ、あたしは…………。',
        'Specter Of Asahi': 'アサヒの幻影',
        'Specter Of The Patriarch': '養父の幻影',
        'Specter Of Zenos': 'ゼノスの幻影',
        'Specter of Gosetsu': 'ゴウセツの幻影',
        'Specter(?! )': 'スペクター',
        'Tsukuyomi': 'ツクヨミ',
      },
      'replaceText': {
        'Antitwilight': '月下美人',
        'Concentrativity': '圧縮剣気',
        'Crater': '氷輪',
        'Dance Of The Dead': '黄泉の舞',
        'Dark Blade': '月刀右近',
        'Dispersivity': '剣気波動',
        'Hagetsu': '破月',
        'Lead Of The Underworld': '黄泉の銃弾',
        'Lunacy': '月下繚乱',
        'Lunar Halo': '百月光',
        'Lunar Rays': '残月',
        'Midnight Rain': '月時雨',
        'Moonburst': '月片爆散',
        'Moonfall': '月片落下',
        'Nightbloom': '月下彼岸花',
        'Nightfall': '宵の早替え',
        'Perilune': '月天心',
        'Reprimand': '折檻',
        'Steel Of The Underworld': '黄泉の穂先',
        'Supreme Selenomancy': '極の月読',
        'Torment Unto Death': 'なぶり殺し',
        'Tsuki-no-Kakera': '月の欠片',
        'Tsuki-no-Maiogi': '月の舞扇',
        'Waxing Grudge': '白き怨念',
        'Zashiki-asobi': '座敷遊び',
      },
      '~effectNames': {
        'Full Moon': '満月流',
        'Moonlit': '満月下',
        'Moonshadowed': '新月下',
        'New Moon': '新月流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Full Moon': '满月流',
        'Moondust': '月之碎片',
        'Moonlight': '月光',
        'New Moon': '新月流',
        'No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\.': '我不能输.*我还没有.*',
        'Specter Of Asahi': '朝阳的幻影',
        'Specter Of The Patriarch': '养父的幻影',
        'Specter Of Zenos': '芝诺斯的幻影',
        'Specter of Gosetsu': '豪雪的幻影',
        'Specter(?! )': '妖影',
        'Tsukuyomi': '月读',
      },
      'replaceText': {
        'Antitwilight': '月下美人',
        'Concentrativity': '压缩剑气',
        'Crater': '冰轮',
        'Dance Of The Dead': '黄泉之舞',
        'Dark Blade': '月刀右斩',
        'Dispersivity': '剑气波动',
        'Empire adds .SW->NW.': '帝国幻影(西南->西北)',
        'Hagetsu': '破月',
        'Homeland adds .E->W.': '家人幻影(东->西)',
        'Lead Of The Underworld': '黄泉之弹',
        'Lead/Steel': '弹/枪',
        'Lunacy': '月下缭乱',
        'Lunar Halo': '百月光',
        'Lunar Rays': '残月',
        'Midnight Rain': '月时雨',
        'Moonburst': '碎片爆炸',
        'Moonfall': '碎片散落',
        'Nightbloom': '月下彼岸花',
        'Nightfall': '深宵换装',
        'Perilune': '月天心',
        'Reprimand': '责难',
        'Steel Of The Underworld': '黄泉之枪',
        'Steel/Lead': '枪/弹',
        'Supreme Selenomancy': '极月读',
        'Torment Unto Death': '折磨',
        'Tsuki-no-Kakera': '月之碎片',
        'Tsuki-no-Maiogi': '月下舞扇',
        'Waxing Grudge': '纯白怨念',
        'Zashiki-asobi': '宴会游乐',
      },
      '~effectNames': {
        'Full Moon': '满月流',
        'Moonlit': '满月下',
        'Moonshadowed': '新月下',
        'New Moon': '新月流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Full Moon': '보름달',
        'Moondust': '달조각',
        'Moonlight': '월광',
        'New Moon': '그믐달',
        'No\\. No\\.\\.\\. Not yet\\. Not\\. Yet\\.': '아아, 나는 아직…….',
        'Specter Of Asahi': '아사히의 환영',
        'Specter Of The Patriarch': '양아버지의 환영',
        'Specter Of Zenos': '제노스의 환영',
        'Specter of Gosetsu': '고우세츠의 환영',
        'Specter(?! )': '그림자요괴',
        'Tsukuyomi': '츠쿠요미',
      },
      'replaceText': {
        'Antitwilight': '월하미인',
        'Concentrativity': '압축 검기',
        'Crater': '빙륜',
        'Dance Of The Dead': '황천의 춤',
        'Dark Blade': '상현달 베기',
        'Dispersivity': '검기 파동',
        'Empire adds .SW->NW.': '제국군 쫄 (남서->북서)',
        'Hagetsu': '파월',
        'Homeland adds .E->W.': '도마 쫄 (동->서)',
        'Lead Of The Underworld': '황천의 총탄',
        'Lead/Steel': '총탄/창',
        'Lunacy': '월하요란',
        'Lunar Halo': '백월광',
        'Lunar Rays': '잔월',
        'Midnight Rain': '달의 눈물',
        'Moonburst': '달조각 폭발',
        'Moonfall': '달조각 낙하',
        'Nightbloom': '달빛 저승꽃',
        'Nightfall': '밤의 옷차림',
        'Perilune': '중천의 달',
        'Reprimand': '절함',
        'Steel Of The Underworld': '황천의 창끝',
        'Steel/Lead': '창/총탄',
        'Supreme Selenomancy': '궁극의 달읽기',
        'Torment Unto Death': '고문살인',
        'Tsuki-no-Kakera': '달조각',
        'Tsuki-no-Maiogi': '춤추는 달 부채',
        'Waxing Grudge': '하얀 원념',
        'Zashiki-asobi': '유흥',
      },
      '~effectNames': {
        'Full Moon': '보름달',
        'Moonlit': '보름달빛',
        'Moonshadowed': '그믐달빛',
        'New Moon': '그믐달',
      },
    },
  ],
}];
