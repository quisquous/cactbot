import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  lastSpinWasHorizontal?: boolean;
}

// O10N - Alphascape 2.0
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV20,
  timelineFile: 'o10n.txt',
  triggers: [
    {
      // Spin Table
      // 31C7 + 31C9 = 31CD (horiz + horiz = out)
      // 31C7 + 31CB = 31CF (horiz + vert = in)
      // 31C8 + 31CB = 31D0 (vert + vert = +)
      id: 'O10N Spin Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31C[78]', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31C[78]', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31C[78]', source: '미드가르드오름', capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.lastSpinWasHorizontal,
    },
    {
      id: 'O10N Horizontal Spin 1',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31C7', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31C7', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31C7', source: '미드가르드오름', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.lastSpinWasHorizontal = true,
      outputStrings: {
        text: {
          en: 'Next Spin: In or Out',
          de: 'Nächste Drehung: Rein oder raus',
          fr: 'Tour suivant : Dedans/Dehors',
          ja: '次: 中/外',
          cn: '下一转:内圈/外圈',
          ko: '다음: 안으로 혹은 밖으로',
        },
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31C8', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31C8', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31C8', source: '미드가르드오름', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.lastSpinWasHorizontal = false,
      outputStrings: {
        text: {
          en: 'Next Spin: Corners',
          de: 'Nächste Drehung: Ecken',
          fr: 'Tour suivant : Plus',
          ja: '次: コーナー',
          cn: '下一转:角落',
          ko: '다음: 모서리로',
        },
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31C9', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31C9', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31C9', source: '미드가르드오름', capture: false }),
      condition: (data) => data.lastSpinWasHorizontal !== undefined,
      alertText: (data, _matches, output) => {
        if (data.lastSpinWasHorizontal)
          return output.getOut!();

        // This shouldn't happen.
        return output.goToCardinals!();
      },
      outputStrings: {
        getOut: {
          en: 'Get Out',
          de: 'Raus da',
          fr: 'Sortez',
          ja: '外へ',
          cn: '远离',
          ko: '밖으로',
        },
        goToCardinals: {
          en: 'Go To Cardinals',
          de: 'Geh zu den Kanten',
          fr: 'Allez sur les points cardinaux',
          ja: '横や縦へ',
          cn: '去正点',
        },
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31CB', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31CB', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31CB', source: '미드가르드오름', capture: false }),
      condition: (data) => data.lastSpinWasHorizontal !== undefined,
      alertText: (data, _matches, output) => {
        if (data.lastSpinWasHorizontal)
          return output.getIn!();

        return output.goToCorners!();
      },
      outputStrings: {
        getIn: {
          en: 'Get In',
          de: 'Rein da',
          fr: 'Allez sous le boss',
          ja: '中へ',
          cn: '靠近',
          ko: '안으로',
        },
        goToCorners: {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
          ja: '角へ',
          cn: '去角落',
        },
      },
    },
    {
      id: 'O10N Earth Shaker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      id: 'O10N Akh Morn',
      type: 'HeadMarker',
      // This corresponds with 316C ability cast (for initial hit).
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'O10N Thunderstorm',
      type: 'HeadMarker',
      // This corresponds with the 31D2 ability cast.
      netRegex: NetRegexes.headMarker({ id: '00A0' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'O10N Dry Ice',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0043' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Ice Outside',
          de: 'Eis draußen ablegen',
          fr: 'Déposez la glace à l\'extérieur',
          cn: '把冰放在外面',
        },
      },
    },
    {
      id: 'O10N Tail End',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '31C5', source: 'Midgardsormr' }),
      netRegexDe: NetRegexes.startsUsing({ id: '31C5', source: 'Midgardsormr' }),
      netRegexFr: NetRegexes.startsUsing({ id: '31C5', source: 'Midgardsormr' }),
      netRegexJa: NetRegexes.startsUsing({ id: '31C5', source: 'ミドガルズオルム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '31C5', source: '尘世幻龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '31C5', source: '미드가르드오름' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O10N Rime Wreath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '33EF', source: 'Ancient Dragon', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '33EF', source: 'Antik(?:e|er|es|en) Drache', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '33EF', source: 'Dragon Ancien', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '33EF', source: 'エンシェントドラゴン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '33EF', source: '远古之龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '33EF', source: '고룡', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O10N Akh Rhai',
      type: 'Ability',
      // Damage starts hitting ~2s after this ability.
      // Assuming that it locks in on cast and not on starts casting.
      // Technically this is only on DPS, but it's not targeted, so just tell everybody.
      netRegex: NetRegexes.ability({ id: '3622', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '3622', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '3622', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '3622', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '3622', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '3622', source: '미드가르드오름', capture: false }),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Dragon': 'antik(?:e|er|es|en) Drache',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        '(?<!/)Out': 'Raus',
        '(?<!\\w)In(?!/)': 'Rein',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cauterize': 'Kauterisieren',
        'Corners': 'Ecken',
        'Dry Ice': 'Trockeneis',
        'Earth Shaker': 'Erdstoß',
        'Exaflare': 'Exaflare',
        'Flip': 'Rolle',
        'Frost Breath': 'Frostiger Atem',
        'Horrid Roar': 'Entsetzliches Brüllen',
        'In/Out': 'Rein/Raus',
        'Northern Cross': 'Kreuz des Nordens',
        'Protostar': 'Protostern',
        'Spin': 'Drehung',
        'Tail End': 'Schweifspitze',
        'Thunderstorm': 'Gewitter',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Dragon': 'dragon ancien',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'ready': 'prêt',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cauterize': 'Cautérisation',
        'Corners': 'Coins',
        'Dry Ice': 'Poussière glaçante',
        'Earth Shaker': 'Secousse',
        'Exaflare': 'ExaBrasier',
        'Flip': 'Tour vertical',
        'Frost Breath': 'Souffle glacé',
        'Horrid Roar': 'Rugissement horrible',
        'In/Out': 'Dedans/Dehors',
        '(?<!/)Out': 'Dehors',
        'Northern Cross': 'Croix du nord',
        'Protostar': 'Proto-étoile',
        'Spin': 'Tour horizontal',
        'Tail End': 'Pointe de queue',
        'Thunderstorm': 'Tempête de foudre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ancient Dragon': 'エンシェントドラゴン',
        'Midgardsormr': 'ミドガルズオルム',
      },
      'replaceText': {
        '(?<!/)Out': '外',
        '(?<!\\w)In(?!/)': '中',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Cauterize': 'カータライズ',
        'Corners': '角',
        'Dry Ice': 'フリージングダスト',
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Flip': '回転',
        'Frost Breath': 'フロストブレス',
        'Horrid Roar': 'ホリッドロア',
        'In/Out': '中/外',
        'Northern Cross': 'ノーザンクロス',
        'Protostar': 'プロトスター',
        'Spin': 'ぶん回す',
        'Tail End': 'テイルエンド',
        'Thunderstorm': 'サンダーストーム',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ancient Dragon': '远古之龙',
        'Midgardsormr': '尘世幻龙',
      },
      'replaceText': {
        'ready': '准备',
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Cauterize': '低温俯冲',
        'Corners': '角',
        'Dry Ice': '冰尘',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Flip': '竖转',
        'Frost Breath': '寒霜吐息',
        'Horrid Roar': '恐惧咆哮',
        '(?<!\\w)In(?!/)': '靠近',
        'In/Out': '靠近/远离',
        '(?<!/)Out': '远离',
        'Northern Cross': '北十字星',
        'Protostar': '原恒星',
        'Spin': '回转',
        'Tail End': '煞尾',
        'Thunderstorm': '雷暴',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ancient Dragon': '고룡',
        'Midgardsormr': '미드가르드오름',
      },
      'replaceText': {
        'Out': '밖으로',
        '(?<!Sp)In': '안으로',
        'Flip': '미드가르드오름 앞구르기',
        'Corners': '모서리',
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Cauterize': '인두질',
        'Dry Ice': '지면 동결',
        'Earth Shaker': '요동치는 대지',
        'Exaflare': '엑사플레어',
        'Frost Breath': '서리 숨결',
        'Horrid Roar': '소름끼치는 포효',
        'Northern Cross': '북십자성',
        'Protostar': '원시별',
        'Spin': '회전',
        'Tail End': '꼬리 쓸기',
        'Thunderstorm': '번개 폭풍',
      },
    },
  ],
};

export default triggerSet;
