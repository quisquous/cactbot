import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  stackMarker?: string[];
}

// O9N - Alphascape 1.0
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV10,
  timelineFile: 'o9n.txt',
  triggers: [
    {
      id: 'O9N Chaotic Dispersion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '314F', source: 'Chaos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '314F', source: 'Chaos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '314F', source: 'Chaos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '314F', source: 'カオス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '314F', source: '卡奥斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '314F', source: '카오스' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O9N Orbs Fiend',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '315C', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '315C', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '315C', source: '카오스', capture: false }),
      condition: (data) => data.role === 'tank',
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Orb Tethers',
          de: 'Kugel-Verbindungen',
          fr: 'Attrapez les orbes',
          ja: '線',
          cn: '连线',
          ko: '구슬 줄',
        },
      },
    },
    {
      id: 'O9N Entropy',
      type: 'GainsEffect',
      // This corresponds with an 0060 headmarker.
      netRegex: NetRegexes.gainsEffect({ effectId: '640' }),
      condition: Conditions.targetIsYou(),
      // Entropy comes out with 8 and 14 seconds during the Fire phase, for two sets of spreads.
      // During the midphase, it is only 14.  To make this less complicated, add a delay that
      // makes this work for all three cases.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      response: Responses.spread(),
    },
    {
      id: 'O9N Dynamic Fluid',
      type: 'GainsEffect',
      // This corresponds with an 0099 headmarker.
      netRegex: NetRegexes.gainsEffect({ effectId: '641' }),
      // Dynamic Fluid is 8 and 14 seconds during the Water phase.  During midphase, it is 20.
      // However, in all cases, there's no reason not to pre-position the donut stack.
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack for Donuts',
          de: 'Für Donuts sammeln',
          fr: 'Packez-vous pour l\'aoe en donut',
          cn: '集合水环',
          ko: '모여서 도넛장판 피하기',
        },
      },
    },
    {
      id: 'O9N Blaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3165', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3165', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3165', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3165', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3165', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3165', source: '카오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O9N Tsunami',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3166', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3166', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3166', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3166', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3166', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3166', source: '카오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O9N Cyclone',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3167', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3167', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3167', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3167', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3167', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3167', source: '카오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O9N Earthquake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3168', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3168', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3168', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3168', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3168', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3168', source: '카오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O9N Bowels of Agony',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3169', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3169', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3169', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3169', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3169', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3169', source: '카오스', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'O9N Knockdown',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // This isn't quite "flare on you", because there's a follow-up large ground
          // "Big Bang" circle that appears from where this is dropped, on top of the
          // proximity damage.  So this is trying to communicate more of a GTFO.
          en: 'Drop Flare Away',
          de: 'Flare weit weg ablegen',
          fr: 'Déposez les Brasiers au loin',
          cn: '核爆放在远处',
          ko: '플레어 바깥으로 유도',
        },
      },
    },
    {
      id: 'O9N Stack Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      // these stack markers come out in pairs, so collect them.
      run: (data, matches) => (data.stackMarker ??= []).push(matches.target),
    },
    {
      id: 'O9N Stack',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.stackMarker?.includes(data.me))
          return output.stackOnYou!();
        return output.stackGroups!();
      },
      run: (data) => delete data.stackMarker,
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackGroups: {
          en: 'Split into stack groups',
          de: 'In Sammel-Gruppen aufteilen',
          fr: 'Séparez les groupes et packez-vous',
          cn: '分组分摊',
          ko: '쉐어징끼리 떨어지기',
        },
      },
    },
    {
      id: 'O9N Earthquake Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3148', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3148', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3148', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3148', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3148', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3148', source: '카오스', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'O9N Cyclone Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '316D', source: 'Chaos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '316D', source: 'Chaos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '316D', source: 'Chaos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '316D', source: 'カオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '316D', source: '卡奥斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '316D', source: '카오스', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chaos': 'Chaos',
        'YOU DARE!': 'Wie könnt ihr es wagen?!',
      },
      'replaceText': {
        'Big Bang': 'Quantengravitation',
        'Blaze': 'Flamme',
        'Bowels of Agony': 'Quälende Eingeweide',
        'Chaosphere': 'Chaossphäre',
        'Chaotic Dispersion': 'Chaos-Dispersion',
        'Cyclone': 'Tornado',
        'Damning Edict': 'Verdammendes Edikt',
        'Earthquake': 'Erdbeben',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock(?! )': 'Einschlag',
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',
        'Soul of Chaos': 'Chaosseele',
        'Stray Flames': 'Chaosflammen',
        'Stray Spray': 'Chaosspritzer',
        'Tsunami': 'Tsunami',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
        'YOU DARE!': '... Mon cristal !? Impossible !',
      },
      'replaceText': {
        'Big Bang': 'Saillie',
        'Blaze': 'Flammes',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaosphere': 'Sphère de chaos',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Grand séisme',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock(?! )': 'Impact',
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        'Soul of Chaos': 'Âme du chaos',
        'Stray Flames': 'Flammes du chaos',
        'Stray Spray': 'Eaux du chaos',
        'Tsunami': 'Raz-de-marée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chaos': 'カオス',
        'YOU DARE!': 'まさか……黒水晶を……！？',
      },
      'replaceText': {
        'Big Bang': '突出せよ',
        'Blaze': 'ほのお',
        'Bowels of Agony': 'バウル・オブ・アゴニー',
        'Chaosphere': 'カオススフィア',
        'Chaotic Dispersion': 'カオティックディスパーション',
        'Cyclone': 'たつまき',
        'Damning Edict': 'ダミングイーディクト',
        'Earthquake': 'じしん',
        'Fiendish Orbs': '追尾せよ',
        'Knock(?! )': '着弾',
        'Long/Lat Implosion': 'インプロージョン 横/縦',
        'Soul of Chaos': 'ソウル・オブ・カオス',
        'Stray Flames': '混沌の炎',
        'Stray Spray': '混沌の水',
        'Tsunami': 'つなみ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chaos': '卡奥斯',
        'YOU DARE!': '居然……把黑水晶给……',
      },
      'replaceText': {
        'Big Bang': '顶起',
        'Blaze': '烈焰',
        'Bowels of Agony': '深层痛楚',
        'Chaosphere': '混沌晶球',
        'Chaotic Dispersion': '散布混沌',
        'Cyclone': '龙卷风',
        'Damning Edict': '诅咒敕令',
        'Earthquake': '大地震',
        'Fiendish Orbs': '追踪',
        'Knock(?! )': '中弹',
        'Long/Lat Implosion': '经/纬度聚爆',
        'Soul of Chaos': '混沌之魂',
        'Stray Flames': '混沌之炎',
        'Stray Spray': '混沌之水',
        'Tsunami': '海啸',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Chaos': '카오스',
        'YOU DARE!': '네 이노오오옴',
      },
      'replaceText': {
        'Big Bang': '돌출하라',
        'Blaze': '화염',
        'Bowels of Agony': '고통의 심핵',
        'Chaosphere': '혼돈의 구체',
        'Chaotic Dispersion': '혼돈 유포',
        'Cyclone': '회오리',
        'Damning Edict': '파멸 포고',
        'Earthquake': '대지진',
        'Fiendish Orbs': '추격하라',
        'Knock': '착탄',
        'Long/Lat Implosion': '가로/세로 내파',
        'Soul of Chaos': '혼돈의 영혼',
        'Stray Flames': '혼돈의 불',
        'Stray Spray': '혼돈의 물',
        'Tsunami': '해일',
      },
    },
  ],
};

export default triggerSet;
