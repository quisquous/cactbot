import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  cloud?: boolean;
  churning?: boolean;
  levinbolt?: string;
}

// Susano Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  timelineFile: 'susano-ex.txt',
  timelineTriggers: [
    {
      id: 'SusEx Cloud',
      regex: /--knockback cloud--/,
      beforeSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'look for cloud',
          de: 'Nach Wolke ausschau halten',
          fr: 'Cherchez le nuage',
          ja: '雷雲を探せ',
          cn: '寻找雷云',
          ko: '구름 확인',
        },
      },
    },
    {
      id: 'SusEx Assail',
      regex: /Assail/,
      beforeSeconds: 6,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'SusEx Thundercloud Tracker',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Thunderhead', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gewitterwolke', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Nuage Orageux', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '雷雲', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '雷云', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '번개구름', capture: false }),
      run: (data) => data.cloud = true,
    },
    {
      // Stop tracking the cloud after it casts lightning instead of
      // when it disappears.  This is because there are several
      // levinbolts with the same cloud, but only one levinbolt has
      // lightning attached to it.
      id: 'SusEx Thundercloud Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2041', source: 'Thunderhead', target: 'Thunderhead', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2041', source: 'Gewitterwolke', target: 'Gewitterwolke', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2041', source: 'Nuage Orageux', target: 'Nuage Orageux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2041', source: '雷雲', target: '雷雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2041', source: '雷云', target: '雷云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2041', source: '번개구름', target: '번개구름', capture: false }),
      run: (data) => data.cloud = false,
    },
    {
      id: 'SusEx Churning Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '4F6', capture: false }),
      condition: (data) => !data.churning,
      run: (data) => data.churning = true,
    },
    {
      // We could track the number of people with churning here, but
      // that seems a bit fragile.  This might not work if somebody dies
      // while having churning, but is probably ok in most cases.
      id: 'SusEx Churning Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '4F6', capture: false }),
      condition: (data) => data.churning,
      run: (data) => data.churning = false,
    },
    {
      id: 'SusEx Stormsplitter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スサノオ', id: '2033' }),
      netRegexCn: NetRegexes.startsUsing({ source: '须佐之男', id: '2033' }),
      netRegexKo: NetRegexes.startsUsing({ source: '스사노오', id: '2033' }),
      response: Responses.tankBusterSwap('alert', 'info'),
    },
    {
      // Red knockback marker indicator
      id: 'SusEx Knockback',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.cloud)
          return output.knockbackWithCloud!();
        else if (data.churning)
          return output.knockbackWithDice!();

        return output.knockback!();
      },
      tts: (data, _matches, output) => {
        if (data.cloud)
          return output.knockbackWithCloudTTS!();
        else if (data.churning)
          return output.knockbackWithDiceTTS!();

        return output.knockbackTTS!();
      },
      outputStrings: {
        knockbackWithCloud: {
          en: 'Knockback on you (cloud)',
          de: 'Rückstoss auf Dir (Wolke)',
          fr: 'Poussée sur VOUS (nuage)',
          ja: '自分にノックバック (雷雲)',
          cn: '击退点名（雷云）',
          ko: '넉백 대상자 (구름)',
        },
        knockbackWithDice: {
          en: 'Knockback + dice (STOP)',
          de: 'Rückstoss + Würfel (STOPP)',
          fr: 'Poussée + dé (ARRÊTEZ)',
          ja: 'ノックバック + 禍泡 (そのまま)',
          cn: '击退+水泡（静止）',
          ko: '넉백 + 주사위 (가만히)',
        },
        knockback: Outputs.knockbackOnYou,
        knockbackWithCloudTTS: {
          en: 'knockback with cloud',
          de: 'Rückstoß mit wolke',
          fr: 'Poussée avec nuage',
          ja: '雷雲ノックバック',
          cn: '雷云击退',
          ko: '넉백과 구름 장판',
        },
        knockbackWithDiceTTS: {
          en: 'Knockback with dice',
          de: 'Rückstoß mit Würfel',
          fr: 'Poussée avec dé',
          ja: '禍泡ノックバック',
          cn: '水泡击退',
          ko: '넉백과 주사위',
        },
        knockbackTTS: Outputs.knockback,
      },
    },
    {
      id: 'SusEx Brightstorm Stack',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'SusEx Levinbolt',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.cloud)
          return output.levinboltWithCloud!();

        return output.levinboltOnYou!();
      },
      tts: (data, _matches, output) => {
        if (data.cloud)
          return output.levinboltWithCloudTTS!();

        return output.levinboltOnYouTTS!();
      },
      outputStrings: {
        levinboltWithCloud: {
          en: 'Levinbolt on you (cloud)',
          de: 'Blitz auf Dir (Wolke)',
          fr: 'Fulguration sur VOUS (nuage)',
          ja: '自分に稲妻 (雷雲)',
          cn: '闪电点名（雷云）',
          ko: '우레 대상자 (구름)',
        },
        levinboltOnYou: {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
          fr: 'Fulguration sur VOUS',
          ja: '自分に稲妻',
          cn: '闪电点名',
          ko: '우레 대상자',
        },
        levinboltWithCloudTTS: {
          en: 'bolt with cloud',
          de: 'blitz mit wolke',
          fr: 'foudre avec nuage',
          ja: '雷雲 稲妻',
          cn: '闪电带雷云',
          ko: '구름 번개',
        },
        levinboltOnYouTTS: {
          en: 'bolt',
          de: 'blitz',
          fr: 'foudre',
          ja: '稲妻',
          cn: '闪电',
          ko: '번개',
        },
      },
    },
    {
      id: 'SusEx Levinbolt Stun',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006F' }),
      infoText: (data, matches, output) => {
        // It's sometimes hard for tanks to see the line, so just give a
        // sound indicator for jumping rope back and forth.
        if (data.role === 'tank')
          return output.text!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Stun: ${player}',
          de: 'Paralyse ${player}',
          fr: 'Étourdi(e) :  ${player}',
          ja: '${player}にスタン',
          cn: '击晕${player}',
          ko: '${player}스턴',
        },
      },
    },
    {
      id: 'SusEx Churning',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '4F6' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.stopEverything('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Yata-No-Kagami': '--knockback--',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Susano': 'Susano',
        'Thunderhead': 'Gewitterwolke',
        'Ama-No-Iwato': 'Ama no Iwato',
      },
      'replaceText': {
        '(?<! )cloud': 'Wolke',
        'Ame-No-Murakumo(?! )': 'Ame No Murakumo',
        'Assail': 'Schwere Attacke',
        'Churn': 'Schaum',
        'Dark Levin': 'violetter Blitz',
        'Knockback': 'Rückstoß',
        'Levinbolt': 'Keraunisches Feld',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Seespalter',
        'Stun': 'Betäuben',
        'Stormsplitter': 'Sturmspalter',
        'The Hidden Gate': 'Verschwundenes Tor',
        'The Sealed Gate': 'Versiegeltes Tor',
        'Ukehi': 'Ukehi',
        'Yata-No-Kagami': 'Yata no Kagami',
        'Brightstorm': 'Heller Sturm',
        'Yasakani-No-Magatama': 'Yasakani no Magatama',
        'The Parting Clouds': 'Wolkenriss',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Susano': 'Susano',
        'Thunderhead': 'nuage orageux',
        'Ama-No-Iwato': 'ama no iwato',
      },
      'replaceText': {
        '(?<! )cloud': 'nuage',
        'Assail': 'Assaut',
        'Churn': 'Agitation',
        'Dark Levin': 'foudre violette',
        'Knockback': 'Poussée',
        'Levinbolt': 'Fulguration',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur de mers',
        'Stun': 'Étourdissement',
        'Stormsplitter': 'Fendeur de tempêtes',
        'The Hidden Gate': 'Porte cachée',
        'The Sealed Gate': 'Porte scellée',
        'Ukehi': 'Ukehi',
        'Yata-No-Kagami': '--poussée--',
        'Brightstorm': 'Claire tempête',
        'Yasakani-No-Magatama': 'Yasakani no Magatama',
        'The Parting Clouds': 'Dispersion de nuages',
        'Ame-No-Murakumo(?! )': 'Ame no Murakumo',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ame-No-Murakumo': 'アメノムラクモ',
        'Susano': 'スサノオ',
        'Thunderhead': '雷雲',
        'Ama-No-Iwato': '天岩戸',
      },
      'replaceText': {
        'Assail': '強撃',
        'Churn': '禍泡付着',
        'Dark Levin': '紫電',
        'Knockback': 'ノックバック',
        'Levinbolt': '稲妻',
        'Phase': 'フェイス',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '海割り',
        'Stormsplitter': '海嵐斬',
        'The Hidden Gate': '岩戸隠れ',
        'The Sealed Gate': '岩戸閉め',
        'Ukehi': '宇気比',
        '(?<! )cloud': '雲',
        'Ame-No-Murakumo(?! )': 'アメノムラクモ',
        'Stun': 'スタン',
        'Yata-No-Kagami': 'ヤタノカガミ',
        'Brightstorm': '晴嵐',
        'Yasakani-No-Magatama': 'ヤサカニノマガタマ',
        'The Parting Clouds': '雲間放電',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ame-No-Murakumo': '天之丛云',
        'Susano': '须佐之男',
        'Thunderhead': '雷云',
        'Ama-No-Iwato': '天之岩户',
      },
      'replaceText': {
        'Assail': '强击',
        'Churn': '祸泡附身',
        'Dark Levin': '紫电',
        'Knockback': '击退',
        'Levinbolt': '闪电',
        'Phase': '阶段',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '断海',
        'Stormsplitter': '破浪斩',
        'The Hidden Gate': '岩户隐',
        'The Sealed Gate': '岩户闭合',
        'Ukehi': '祈请',
        '(?<! )cloud': '云',
        'Ame-No-Murakumo(?! )': '天之丛云',
        'Stun': '眩晕',
        'Yata-No-Kagami': '八咫镜',
        'Brightstorm': '晴岚',
        'Yasakani-No-Magatama': '八尺琼勾玉',
        'The Parting Clouds': '云间放电',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ame-No-Murakumo(?! )': '아메노무라쿠모',
        'Susano': '스사노오',
        'Thunderhead': '번개구름',
        'Ama-No-Iwato': '신의 바위',
      },
      'replaceText': {
        'Assail': '강력 공격',
        'Churn': '재앙거품 부착',
        'Dark Levin': '번갯불',
        'Knockback': '넉백',
        'Levinbolt': '우레',
        'Phase': '페이즈',
        'Rasen Kaikyo': '나선 해협',
        'Seasplitter': '바다 가르기',
        'Stun': '기절',
        'Stormsplitter': '해풍참',
        'The Hidden Gate': '바위 숨기기',
        'The Sealed Gate': '바위 조이기',
        'Ukehi': '내기 선언',
        '(?<! )cloud': '구름',
        'Ame-No-Murakumo(?! )': '아메노무라쿠모',
        'Yata-No-Kagami': '야타의 거울',
        'Brightstorm': '산바람',
        'Yasakani-No-Magatama': '야사카니의 곡옥',
        'The Parting Clouds': '구름 방전',
      },
    },
  ],
};

export default triggerSet;
