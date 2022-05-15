import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  moonIsOut?: boolean;
  moonlitCount?: number;
  moonshadowedCount?: number;
}

// Tsukuyomi Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladTsukuyomisPain,
  timelineFile: 'tsukuyomi-ex.txt',
  triggers: [
    {
      id: 'TsukuyomiEx Nightfall Gun',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2BBC', source: 'Tsukuyomi', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'TsukuyomiEx Nightfall Spear',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2BBD', source: 'Tsukuyomi', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'TsukuyomiEx Torment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['2BBB', '2EB2'], source: 'Tsukuyomi' }),
      alarmText: (data, matches, output) => {
        if (matches.target === data.me || data.role !== 'tank')
          return;

        return output.tankSwap!();
      },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou!();

        if (data.role === 'healer')
          return output.busterOn!({ player: data.ShortName(matches.target) });
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me || data.role === 'tank' || data.role === 'healer')
          return;

        return output.getOutOfFront!();
      },
      outputStrings: {
        getOutOfFront: {
          en: 'Get out of front',
          de: 'Weg von vorn',
          fr: 'Éloignez-vous de l\'avant',
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
      id: 'TsukuyomiEx Full Moon',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '5FF', capture: false }),
      run: (data) => data.moonIsOut = true,
    },
    {
      id: 'TsukuyomiEx New Moon',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ target: 'Tsukuyomi', effectId: '600', capture: false }),
      run: (data) => data.moonIsOut = false,
    },
    {
      id: 'TsukuyomiEx Dark Blade',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2BDA', source: 'Tsukuyomi', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.moonIsOut)
          return output.leftAndOut!();
        return output.leftAndIn!();
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
      id: 'TsukuyomiEx Bright Blade',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2BDB', source: 'Tsukuyomi', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.moonIsOut)
          return output.rightAndOut!();
        return output.rightAndIn!();
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
      id: 'TsukuyomiEx Meteor Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0083' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou(),
    },
    {
      id: 'TsukuyomiEx Lunacy',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'TsukuyomiEx Hagetsu',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'TsukuyomiEx Dance of the Dead',
      type: 'GameLog',
      // There's no "starts using" here.  She pushes at 35% to this ability.
      // This happens after 2nd meteors naturally, but if dps is good
      // then this could push unexpectedly earlier (or paired with buster).
      netRegex: NetRegexes.dialog({ line: '[^:]*:No\. No\.\.\. Not yet\. Not\. Yet\..*?', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'TsukuyomiEx Supreme Selenomancy',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Tsukuyomi', id: '2EB0', capture: false }),
      suppressSeconds: 5,
      run: (data) => {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
    },
    {
      id: 'TsukuyomiEx Moonlit Debuff Logic',
      type: 'GainsEffect',
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
      id: 'TsukuyomiEx Moonlit Debuff',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '602' }),
      condition: (data, matches) => {
        if (matches.target !== data.me)
          return false;
        return data.moonlitCount !== undefined && data.moonlitCount >= 4;
      },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move to Black!',
          de: 'In\'s schwarze laufen!',
          fr: 'Allez en zone noire !',
          ja: '新月に！',
          cn: '踩黑色！',
          ko: '검정색으로 이동!',
        },
      },
    },
    {
      id: 'TsukuyomiEx Moonshadowed Debuff Logic',
      type: 'GainsEffect',
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
      id: 'TsukuyomiEx Moonshadowed Debuff',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '603' }),
      condition: (data, matches) => {
        if (matches.target !== data.me)
          return false;
        return data.moonlitCount !== undefined && data.moonlitCount >= 4;
      },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move to White!',
          de: 'In\'s weiße laufen!',
          fr: 'Allez en zone blanche !',
          ja: '満月に！',
          cn: '踩白色！',
          ko: '흰색으로 이동!',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Bright Blade/Dark Blade': 'Bright/Dark Blade',
        'Waning Grudge/Waxing Grudge': 'Waning/Waxing Grudge',
        'Lead Of The Underworld/Steel Of The Underworld': 'Lead/Steel Of The Underworld',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Dancing Fan': 'tanzend(?:e|er|es|en) Fächer',
        'Moondust': 'Mondfragment',
        'Moonlight': 'Mondlicht',
        'No\. No\.\.\. Not yet\. Not\. Yet\.': 'Meine Rache ... Ich will... meine Rache...',
        'Specter(?! )': 'Schemen',
        'Specter Of Asahi': 'Asahi',
        'Specter Of Gosetsu': 'Gosetsu',
        'Specter Of The Patriarch': 'Yotsuyus Ziehvater',
        'Specter Of Zenos': 'Zenos',
        'Specter of Zenos': 'Zenos',
        'Tsukuyomi': 'Tsukuyomi',
      },
      'replaceText': {
        '\\(gun': '(Pistole',
        'spear\\)': 'Speer)',
        'Antitwilight': 'Schönheit der Nacht',
        'Bright Blade': 'Helle Klinge',
        'Concentrativity': 'Konzentriertheit',
        'Crater': 'Krater',
        'Dance Of The Dead': 'Tanz der Toten',
        'Dark Blade': 'Dunkle Klinge',
        'Dispersivity': 'Dispersivität',
        'Empire adds': 'Soldaten Adds',
        'Hagetsu': 'Hagetsu',
        'Homeland adds': 'Domaner Adds',
        'Lead Of The Underworld': 'Blei der Unterwelt',
        'Lunacy': 'Mondscheinblüte',
        'Lunar Halo': 'Flammender Mond',
        'Lunar Rays': 'Mondschimmer',
        'Midnight Rain': 'Mitternachtsregen',
        'Moonbeam': 'Mondstrahl',
        'Moonfall': 'Mondfall',
        'Nightbloom': 'Monddämmerung',
        'Perilune': 'Zenit des Mondes',
        'Reprimand': 'Maßregelung',
        'Steel Of The Underworld': 'Stahl der Unterwelt',
        'Supreme Selenomancy': 'Hohe Mondprophezeiung',
        'Torment Unto Death': 'Todesqualen',
        'Tsuki-No-Kakera': 'Mondsplitter',
        'Tsuki-No-Maiogi': 'Mondfächer',
        'Unmoving Troika': 'Unbewegte Troika',
        'Waning Grudge': 'Schwindender Groll',
        'Waxing Grudge': 'Wachsender Groll',
        'Zashiki-Asobi': 'Zashiki-Asobi',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dancing Fan': 'maiôgi',
        'Moondust': 'fragment de lune',
        'Moonlight': 'Clair de lune',
        'No\. No\.\.\. Not yet\. Not\. Yet\.': 'Non, je ne peux pas... échouer...',
        'Specter(?! )': 'spector',
        'Specter Of Asahi': 'apparition d\'Asahi',
        'Specter Of Gosetsu': 'apparition de Gosetsu',
        'Specter Of The Patriarch': 'spectre du parâtre',
        'Specter Of Zenos': 'spectre de Zenos',
        'Tsukuyomi': 'Tsukuyomi',
        'Specter of Zenos': 'spectre de Zenos',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(E->W\\)': '(E->O)',
        '\\(SW->NW\\)': '(SO->NO)',
        '\\(gun\\)': '(fusil)',
        '\\(gun/spear\\)': '(fusil/lance)',
        '\\(spear\\)': '(lance)',
        'Antitwilight': 'Belle-de-nuit',
        'Bright Blade/Dark Blade': 'Lame blafarde/ténébreuse',
        'Concentrativity': 'Kenki concentré',
        'Crater': 'Explosion de fragment lunaire',
        'Dance Of The Dead': 'Danse des morts',
        'Dispersivity': 'Onde Kenki',
        'Empire adds': 'Adds Impériaux',
        'Hagetsu': 'Pulvérisation lunaire',
        'Homeland adds': 'Adds Domiens',
        'Lead Of The Underworld(?!/)': 'Tir de l\'au-delà',
        'Lead Of The Underworld/Steel Of The Underworld': 'Tir/Pointes de l\'au-delà',
        'Lunacy': 'Efflorescence au clair de lune',
        'Lunar Halo': 'Flamboiement lunaire',
        'Lunar Rays': 'Rayons lunaires',
        'Midnight Rain': 'Bruine nocturne',
        'Moonbeam': 'Faisceau lunaire',
        'Moonfall': 'Impact de fragment lunaire',
        'Nightbloom': 'Lis araignée',
        'Nightfall': 'Jeune nuit',
        'Perilune': 'Zénith lunaire',
        'Reprimand': 'Correction',
        '(?<!/)Steel Of The Underworld': 'Pointes de l\'au-delà',
        'Supreme Selenomancy': 'Sélénomancie suprême',
        'Torment Unto Death': 'Brimade meurtrière',
        'Tsuki-No-Kakera': 'Fragments lunaires',
        'Tsuki-No-Maiogi': 'Maiôgi lunaire',
        'Unmoving Troika': 'Troïka immobile',
        'Waning Grudge/Waxing Grudge': 'Rancœur blafarde/ténébreuse',
        'Zashiki-Asobi': 'Zashiki asobi',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Dancing Fan': '舞扇',
        'Moondust': '月の欠片',
        'Moonlight': '月光',
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '嗚呼、まだ、あたしは…………。',
        'Specter(?! )': 'スペクター',
        'Specter Of Asahi': 'アサヒの幻影',
        'Specter Of Gosetsu': 'ゴウセツの幻影',
        'Specter Of The Patriarch': '養父の幻影',
        'Specter Of Zenos': 'ゼノスの幻影',
        'Tsukuyomi': 'ツクヨミ',
        'Specter of Zenos': 'ゼノスの幻影',
      },
      'replaceText': {
        'Antitwilight': '月下美人',
        'Bright Blade': '月刀左近',
        'Concentrativity': '圧縮剣気',
        'Crater': '氷輪',
        'Dance Of The Dead': '黄泉の舞',
        'Dark Blade': '月刀右近',
        'Dispersivity': '剣気波動',
        'Empire adds': '雑魚: 帝国軍',
        'Hagetsu': '破月',
        'Homeland adds': '雑魚: 幻影',
        'Lead Of The Underworld': '黄泉の銃弾',
        'Lunacy': '月下繚乱',
        'Lunar Halo': '百月光',
        'Lunar Rays': '残月',
        'Midnight Rain': '月時雨',
        'Moonbeam': '月光流転',
        'Moonfall': '月片落下',
        'Nightbloom': '月下彼岸花',
        'Perilune': '月天心',
        'Reprimand': '折檻',
        'Steel Of The Underworld': '黄泉の穂先',
        'Supreme Selenomancy': '極の月読',
        'Torment Unto Death': 'なぶり殺し',
        'Tsuki-No-Kakera': '月の欠片',
        'Tsuki-No-Maiogi': '月の舞扇',
        'Unmoving Troika': '不動三段',
        'Waning Grudge': '黒き怨念',
        'Waxing Grudge': '白き怨念',
        'Zashiki-Asobi': '座敷遊び',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Dancing Fan': '舞扇',
        'Moondust': '月之碎片',
        'Moonlight': '月光',
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '我不能输.*我还没有.*',
        'Specter(?! )': '妖影',
        'Specter Of Asahi': '朝阳的幻影',
        'Specter Of Gosetsu': '豪雪的幻影',
        'Specter Of The Patriarch': '养父的幻影',
        'Specter Of Zenos': '芝诺斯的幻影',
        'Tsukuyomi': '月读',
        'Specter of Zenos': '芝诺斯的幻影',
      },
      'replaceText': {
        '\\(gun': '(枪',
        'spear\\)': '长矛)',
        'Antitwilight': '月下美人',
        'Bright Blade': '月刀左斩',
        'Concentrativity': '压缩剑气',
        'Crater': '冰轮',
        'Dance Of The Dead': '黄泉之舞',
        'Dark Blade': '月刀右斩',
        'Dispersivity': '剑气波动',
        'Empire adds': '帝国幻影',
        'Hagetsu': '破月',
        'Homeland adds': '家人幻影',
        'Lead Of The Underworld': '黄泉之弹',
        'Lunacy': '月下缭乱',
        'Lunar Halo': '百月光',
        'Lunar Rays': '残月',
        'Midnight Rain': '月时雨',
        'Moonbeam': '月光流转',
        'Moonfall': '碎片散落',
        'Nightbloom': '月下彼岸花',
        'Perilune': '月天心',
        'Reprimand': '责难',
        'Steel Of The Underworld': '黄泉之枪',
        'Supreme Selenomancy': '极月读',
        'Torment Unto Death': '折磨',
        'Tsuki-No-Kakera': '月之碎片',
        'Tsuki-No-Maiogi': '月下舞扇',
        'Unmoving Troika': '不动三段',
        'Waning Grudge': '漆黑怨念',
        'Waxing Grudge': '纯白怨念',
        'Zashiki-Asobi': '宴会游乐',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Dancing Fan': '춤추는 부채',
        'Moondust': '달조각',
        'Moonlight': '월광',
        'No\. No\.\.\. Not yet\. Not\. Yet\.': '아아, 나는 아직…….',
        'Specter(?! )': '그림자요괴',
        'Specter Of Asahi': '아사히의 환영',
        'Specter Of Gosetsu': '고우세츠의 환영',
        'Specter Of The Patriarch': '양아버지의 환영',
        'Specter Of Zenos': '제노스의 환영',
        'Tsukuyomi': '츠쿠요미',
        'Specter of Zenos': '제노스의 환영',
      },
      'replaceText': {
        'Antitwilight': '월하미인',
        'Bright Blade': '하현달 베기',
        'Concentrativity': '압축 검기',
        'Crater': '빙륜',
        'Dance Of The Dead': '황천의 춤',
        'Dark Blade': '상현달 베기',
        'Dispersivity': '검기 파동',
        'Empire adds': '제국군 쫄',
        'Hagetsu': '파월',
        'Homeland adds': '도마 쫄',
        'Lead Of The Underworld': '황천의 총탄',
        'Lunacy': '월하요란',
        'Lunar Halo': '백월광',
        'Lunar Rays': '잔월',
        'Midnight Rain': '달의 눈물',
        'Moonbeam': '달빛 윤회',
        'Moonfall': '달조각 낙하',
        'Nightbloom': '달빛 저승꽃',
        'Perilune': '중천의 달',
        'Reprimand': '절함',
        'Steel Of The Underworld': '황천의 창끝',
        'Supreme Selenomancy': '궁극의 달읽기',
        'Torment Unto Death': '고문살인',
        'Tsuki-No-Kakera': '달조각',
        'Tsuki-No-Maiogi': '춤추는 달 부채',
        'Unmoving Troika': '부동삼단',
        'Waning Grudge': '검은 원념',
        'Waxing Grudge': '하얀 원념',
        'Zashiki-Asobi': '유흥',
        'gun': '총',
        'spear': '창',
      },
    },
  ],
};

export default triggerSet;
