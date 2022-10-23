import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  spell?: { [name: string]: string };
  fireCount?: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EdensGateDescent,
  timelineFile: 'e2n.txt',
  timelineTriggers: [
    {
      id: 'E2N Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 9,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Puddles',
          de: 'Flächen nehmen',
          fr: 'Allez dans les zones au sol',
          ja: '踏む',
          cn: '踩圈',
          ko: '장판 밟기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'E2N Shadowflame Tank',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E4D', source: 'Voidwalker' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'E2N Shadowflame Healer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E4D', source: 'Voidwalker', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'E2N Entropy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E6D', source: 'Voidwalker', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'E2N Doomvoid Slicer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E3C', source: 'Voidwalker', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E2N Empty Hate',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E46', source: 'The Hand Of Erebos', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E2N Darkfire Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3E42', source: 'Voidwalker', capture: false }),
      run: (data) => data.fireCount = (data.fireCount ?? 0) + 1,
    },
    {
      id: 'E2N Dark Fire No Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '004C' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'E2N Unholy Darkness No Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2N Shadoweye No Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'E2N Dark Fire Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B5' }),
      run: (data, matches) => {
        data.spell ??= {};
        data.spell[matches.target] = 'fire';
      },
    },
    {
      id: 'E2N Dark Fire Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B5' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Delayed Fire',
          de: 'Verzögertes Feuer',
          fr: 'Feu retardé',
          ja: '遅延ファイア',
          cn: '延迟火',
          ko: '지연술 파이가',
        },
      },
    },
    {
      id: 'E2N Countdown Marker Fire',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.me === matches.target && data.spell?.[data.me] === 'fire',
      alertText: (data, _matches, output) => {
        if (data.fireCount === 3)
          return output.spreadDontStack!();

        return output.spread!();
      },
      outputStrings: {
        spreadDontStack: {
          en: 'Spread (don\'t stack!)',
          de: 'Verteilen (nicht zusammen stehen)',
          fr: 'Dispersez-vous (ne vous packez pas)',
          ja: '散開 (重ならない)',
          cn: '分散',
          ko: '산개 (쉐어 맞으면 안됨)',
        },
        spread: Outputs.spread,
      },
    },
    {
      id: 'E2N Unholy Darkness Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B4' }),
      run: (data, matches) => {
        data.spell ??= {};
        data.spell[matches.target] = 'stack';
      },
    },
    {
      id: 'E2N Unholy Darkness Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B4' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Delayed Stack',
          de: 'Verzögertes sammeln',
          fr: 'Package retardé',
          ja: '遅延頭割り',
          cn: '延迟集合',
          ko: '지연술 쉐어징',
        },
      },
    },
    {
      id: 'E2N Countdown Marker Unholy Darkness',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => {
        // The third fire coincides with stack.
        // These people should avoid.
        if (data.spell?.[data.me] === 'fire' && data.fireCount === 3)
          return false;
        return data.spell?.[matches.target] === 'stack';
      },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2N Shadoweye Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B7' }),
      run: (data, matches) => {
        data.spell ??= {};
        data.spell[matches.target] = 'eye';
      },
    },
    {
      id: 'E2N Shadoweye Waiting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B7' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Delayed Shadoweye',
          de: 'Verzögertes Schattenauge',
          fr: 'Œil de l\'ombre retardé',
          ja: '遅延シャドウアイ',
          cn: '延迟石化眼',
          ko: '지연술 그림자시선',
        },
      },
    },
    {
      id: 'E2N Countdown Marker Shadoweye',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.spell?.[matches.target] === 'eye',
      delaySeconds: 2,
      response: Responses.lookAwayFromTarget('alarm'),
    },
    {
      id: 'E2N Countdown Marker Shadoweye You',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => {
        return data.me === matches.target && data.spell?.[matches.target] === 'eye';
      },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Eye on YOU',
          de: 'Auge auf DIR',
          fr: 'Œil de l\'ombre sur VOUS',
          ja: '自分にシャドウアイ',
          cn: '石化眼点名',
          ko: '시선징 대상자',
        },
      },
    },
    {
      id: 'E2N Countdown Marker Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      delaySeconds: 10,
      run: (data, matches) => delete data.spell?.[matches.target],
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Hand of Erebos': 'Arm des Erebos',
        'Voidwalker': 'Nichtswandler',
      },
      'replaceText': {
        'Dark Fire III': 'Dunkel-Feuga',
        'Doomvoid Guillotine': 'Nichtsmarter-Fallbeil',
        'Doomvoid Slicer': 'Nichtsmarter-Sense',
        'Empty Hate': 'Gähnender Abgrund',
        'Entropy': 'Entropie',
        'Punishing Ray': 'Strafender Strahl',
        'Shadoweye': 'Schattenauge',
        'Shadowflame': 'Schattenflamme',
        'Spell-In-Waiting': 'Verzögerung',
        'Unholy Darkness': 'Unheiliges Dunkel',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Hand of Erebos': 'Bras d\'Érèbe',
        'Voidwalker': 'Marcheuse du néant',
      },
      'replaceText': {
        'Dark Fire III': 'Méga Feu ténébreux',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Empty Hate': 'Vaine malice',
        'Entropy': 'Entropie',
        'Punishing Ray': 'Rayon punitif',
        'Shadoweye': 'Œil de l\'ombre',
        'Shadowflame': 'Flamme d\'ombre',
        'Spell-in-Waiting': 'Déphasage incantatoire',
        'Unholy Darkness': 'Miracle sombre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Hand of Erebos': 'エレボスの巨腕',
        'Voidwalker': 'ヴォイドウォーカー',
      },
      'replaceText': {
        'Dark Fire III': 'ダークファイガ',
        'Doomvoid Guillotine': 'ドゥームヴォイド・ギロチン',
        'Doomvoid Slicer': 'ドゥームヴォイド・スライサー',
        'Empty Hate': '虚ろなる悪意',
        'Entropy': 'エントロピー',
        'Punishing Ray': 'パニッシュレイ',
        'Shadoweye': 'シャドウアイ',
        'Shadowflame': 'シャドーフレイム',
        'Spell-in-Waiting': 'ディレイスペル',
        'Unholy Darkness': 'ダークホーリー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Hand of Erebos': '厄瑞玻斯的巨腕',
        'Voidwalker': '虚无行者',
      },
      'replaceText': {
        'Dark Fire III': '黑暗爆炎',
        'Doomvoid Guillotine': '末日虚无断',
        'Doomvoid Slicer': '末日虚无切',
        'Empty Hate': '空无的恶意',
        'Entropy': '熵',
        'Punishing Ray': '惩戒之光',
        'Shadoweye': '暗影之眼',
        'Shadowflame': '暗影炎',
        'Spell-in-Waiting': '延迟咏唱',
        'Unholy Darkness': '黑暗神圣',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Hand of Erebos': '에레보스의 팔',
        'Voidwalker': '보이드워커',
      },
      'replaceText': {
        'Dark Fire III': '다크 파이가',
        'Doomvoid Guillotine': '파멸의 보이드 절단',
        'Doomvoid Slicer': '파멸의 보이드 베기',
        'Empty Hate': '공허한 악의',
        'Entropy': '엔트로피',
        'Punishing Ray': '응징의 빛줄기',
        'Shadoweye': '그림자 시선',
        'Shadowflame': '그림자 불꽃',
        'Spell-in-Waiting': '지연술',
        'Unholy Darkness': '다크 홀리',
      },
    },
  ],
};

export default triggerSet;
