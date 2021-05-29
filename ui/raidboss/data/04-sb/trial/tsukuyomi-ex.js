import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// Tsukuyomi Extreme
export default {
  zoneId: ZoneId.TheMinstrelsBalladTsukuyomisPain,
  timelineFile: 'tsukuyomi-ex.txt',
  triggers: [
    {
      id: 'Tsukuyomi Nightfall Gun',
      netRegex: NetRegexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2BBC', source: 'ツクヨミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2BBC', source: '月读', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2BBC', source: '츠쿠요미', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'Tsukuyomi Nightfall Spear',
      netRegex: NetRegexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2BBD', source: 'ツクヨミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2BBD', source: '月读', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2BBD', source: '츠쿠요미', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Tsukuyomi Torment',
      netRegex: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'ツクヨミ' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: '月读' }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: '츠쿠요미' }),
      alarmText: (data, matches, output) => {
        if (matches.target === data.me || data.role !== 'tank')
          return;

        return output.tankSwap();
      },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou();

        if (data.role === 'healer')
          return output.busterOn({ player: data.ShortName(matches.target) });
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me || data.role === 'tank' || data.role === 'healer')
          return;

        return output.getOutOfFront();
      },
      outputStrings: {
        getOutOfFront: {
          en: 'Get out of front',
          de: 'Weg von vorn',
          fr: 'Partez du devant',
          ja: '正面から離れる',
          cn: '远离正面',
          ko: '정면 피하기',
        },
        tankBusterOnYou: Outputs.tankBusterOnYou,
        busterOn: Outputs.tankBusterOnPlayer,
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'Tsukuyomi Full Moon',
      netRegex: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '5FF', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '5FF', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '5FF', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ツクヨミ', effectId: '5FF', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '月读', effectId: '5FF', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '츠쿠요미', effectId: '5FF', capture: false }),
      run: (data) => {
        data.moonIsOut = true;
      },
    },
    {
      id: 'Tsukuyomi New Moon',
      netRegex: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '600', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '600', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '600', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ツクヨミ', effectId: '600', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '月读', effectId: '600', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '츠쿠요미', effectId: '600', capture: false }),
      run: (data) => {
        data.moonIsOut = false;
      },
    },
    {
      id: 'Tsukuyomi Dark Blade',
      netRegex: NetRegexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2BDA', source: 'ツクヨミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2BDA', source: '月读', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2BDA', source: '츠쿠요미', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.moonIsOut)
          return output.leftAndOut();
        return output.leftAndIn();
      },
      outputStrings: {
        leftAndOut: {
          en: 'Left + Out',
          de: 'Links + Raus',
          fr: 'À gauche + Extérieur',
          ja: '左へ + 外へ',
          cn: '左边 + 远离',
          ko: '왼쪽 + 밖',
        },
        leftAndIn: {
          en: 'Left + In',
          de: 'Links + Rein',
          fr: 'À gauche + Intérieur',
          ja: '左へ + 中へ',
          cn: '左边 + 靠近',
          ko: '왼쪽 + 안',
        },
      },
    },
    {
      id: 'Tsukuyomi Bright Blade',
      netRegex: NetRegexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2BDB', source: 'ツクヨミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2BDB', source: '月读', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2BDB', source: '츠쿠요미', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.moonIsOut)
          return output.rightAndOut();
        return output.rightAndIn();
      },
      outputStrings: {
        rightAndOut: {
          en: 'Right + Out',
          de: 'Rechts + Raus',
          fr: 'À droite + Extérieur',
          ja: '右へ + 外へ',
          cn: '右边 + 远离',
          ko: '오른쪽 + 밖',
        },
        rightAndIn: {
          en: 'Right + In',
          de: 'Rechts + Rein',
          fr: 'À droite + Intérieur',
          ja: '右へ + 中へ',
          cn: '右边 + 靠近',
          ko: '오른쪽 + 안',
        },
      },
    },
    {
      id: 'Tsukuyomi Meteor Marker',
      netRegex: NetRegexes.headMarker({ id: '0083' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou(),
    },
    {
      id: 'Tsukuyomi Lunacy',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'Tsukuyomi Hagetsu',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Tsukuyomi Dance of the Dead',
      // There's no "starts using" here.  She pushes at 35% to this ability.
      // This happens after 2nd meteors naturally, but if dps is good
      // then this could push unexpectedly earlier (or paired with buster).
      netRegex: NetRegexes.dialog({ line: '[^:]*:No\. No\.\.\. Not yet\. Not\. Yet\..*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: '[^:]*:Meine Rache \.\.\. Ich will\.\.\. meine Rache\.\.\..*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: '[^:]*:Non\, je ne peux pas\.\.\. échouer\.\.\..*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '[^:]*:嗚呼、まだ、あたしは…………。.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '[^:]*:我不能输.*我还没有.*.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '[^:]*:아아, 나는 아직……\..*?', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Tsukuyomi Supreme Selenomancy',
      netRegex: NetRegexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ツクヨミ', id: '2EB0', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '月读', id: '2EB0', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '츠쿠요미', id: '2EB0', capture: false }),
      suppressSeconds: 5,
      run: (data) => {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
    },
    {
      id: 'Tsukuyomi Moonlit Debuff Logic',
      netRegex: NetRegexes.gainsEffect({ effectId: '602' }),
      condition: Conditions.targetIsYou(),
      preRun: (data) => {
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
      netRegex: NetRegexes.gainsEffect({ effectId: '602' }),
      condition: (data, matches) => matches.target === data.me && data.moonlitCount >= 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to Black!',
          de: 'In\'s schwarze laufen!',
          fr: 'Bougez en zone noire !',
          ja: '新月に！',
          cn: '踩黑色！',
          ko: '검정색으로 이동!',
        },
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff Logic',
      netRegex: NetRegexes.gainsEffect({ effectId: '603' }),
      condition: Conditions.targetIsYou(),
      preRun: (data) => {
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
      netRegex: NetRegexes.gainsEffect({ effectId: '603' }),
      condition: (data, matches) => matches.target === data.me && data.moonshadowedCount >= 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to White!',
          de: 'In\'s weiße laufen!',
          fr: 'Bougez en zone blanche !',
          ja: '満月に！',
          cn: '踩白色！',
          ko: '흰색으로 이동!',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'No\. No\.\.\. Not yet\. Not\. Yet\.': 'Meine Rache ... Ich will... meine Rache...',
        'Moondust': 'Mondfragment',
        'Moonlight': 'Mondlicht',
        'Specter(?! )': 'Trugbild',
        'Specter Of Asahi': 'Asahi',
        'Specter of Gosetsu': 'Gosetsu',
        'Specter Of The Patriarch': 'Yotsuyus Ziehvater',
        'Specter Of Zenos': 'Zenos',
        'Tsukuyomi': 'Tsukuyomi',
      },
      'replaceText': {
        '\\(gun\\)': '(Pistole)',
        '\\(spear\\)': '(Speer)',
        'Bright': 'Helle',
        'Waning': 'Schwindender',
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
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'No\. No\.\.\. Not yet\. Not\. Yet\.': 'Non, je ne peux pas... échouer...',
        'Moondust': 'fragment de lune',
        'Moonlight': 'Clair de lune',
        'Specter(?! )': 'Illusion protectrice',
        'Specter Of Asahi': 'apparition d\'Asahi',
        'Specter of Gosetsu': 'apparition de Gosetsu',
        'Specter Of The Patriarch': 'spectre du parâtre',
        'Specter Of Zenos': 'spectre de Zenos',
        'Tsukuyomi': 'Tsukuyomi',
      },
      'replaceText': {
        '\\(spear\\)': '(lance)',
        'Antitwilight': 'Belle-de-nuit',
        'Concentrativity': 'Kenki concentré',
        'Crater': 'Explosion de fragment lunaire',
        'Dance Of The Dead': 'Danse des morts',
        'Bright/Dark Blade': 'Lame ténébreuse/blafarde',
        'Dispersivity': 'Onde Kenki',
        'Empire adds .SW->NW.': 'Adds Impériaux (SO->NO)',
        'Hagetsu': 'Pulvérisation lunaire',
        'Homeland adds .E->W.': 'Adds Domiens (E->O)',
        'Lead Of The Underworld': 'Tir de l\'au-delà',
        'Lead/Steel': 'Tir/Pointes de l\'au-delà',
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
        'Steel/Lead': 'Pointes/Tir de l\'au-delà',
        'Supreme Selenomancy': 'Sélénomancie suprême',
        'Torment Unto Death': 'Brimade meurtrière',
        'Tsuki-no-Kakera': 'Fragments lunaires',
        'Tsuki-no-Maiogi': 'Maiôgi lunaire',
        'Waning/Waxing Grudge': 'Rancœur blafarde/ténèbreuse',
        'Zashiki-asobi': 'Zashiki asobi',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '嗚呼、まだ、あたしは…………。',
        'Moondust': '月の欠片',
        'Moonlight': '月光',
        'Specter(?! )': '幻影',
        'Specter Of Asahi': 'アサヒの幻影',
        'Specter of Gosetsu': 'ゴウセツの幻影',
        'Specter Of The Patriarch': '養父の幻影',
        'Specter Of Zenos': 'ゼノスの幻影',
        'Tsukuyomi': 'ツクヨミ',
        'No\\\\. No\\\\.\\\\.\\\\. Not yet\\\\. Not\\\\. Yet\\\\.': '嗚呼、まだ、あたしは…………。',
      },
      'replaceText': {
        'Antitwilight': '月下美人',
        'Concentrativity': '圧縮剣気',
        'Crater': '氷輪',
        'Dance Of The Dead': '黄泉の舞',
        'Dark Blade': '月刀右近',
        'Dispersivity': '剣気波動',
        'Empire adds .SW->NW.': '雑魚: 帝国軍 (南西->北西)',
        'Hagetsu': '破月',
        'Homeland adds .E->W.': '雑魚: 幻影 (東->西)',
        'Lead Of The Underworld': '黄泉の銃弾',
        'Lead/Steel': '銃弾/穂先',
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
        'Steel/Lead': '穂先/銃弾',
        'Supreme Selenomancy': '極の月読',
        'Torment Unto Death': 'なぶり殺し',
        'Tsuki-no-Kakera': '月の欠片',
        'Tsuki-no-Maiogi': '月の舞扇',
        'Waxing Grudge': '白き怨念',
        'Zashiki-asobi': '座敷遊び',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '我不能输.*我还没有.*',
        'Moondust': '月之碎片',
        'Moonlight': '月光',
        'Specter(?! )': '幻影',
        'Specter Of Asahi': '朝阳的幻影',
        'Specter of Gosetsu': '豪雪的幻影',
        'Specter Of The Patriarch': '养父的幻影',
        'Specter Of Zenos': '芝诺斯的幻影',
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
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '아아, 나는 아직…….',
        'Moondust': '달조각',
        'Moonlight': '월광',
        'Specter(?! )': '환영',
        'Specter Of Asahi': '아사히의 환영',
        'Specter of Gosetsu': '고우세츠의 환영',
        'Specter Of The Patriarch': '양아버지의 환영',
        'Specter Of Zenos': '제노스의 환영',
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
        'gun': '총',
        'spear': '창',
        'Bright': '하현달',
        'Waning': '검은',
      },
    },
  ],
};
